const UserModel = require("../models/UserModel");
const TokenModel = require("../models/TokenModel");
const Hash = require("../utils/Hash");
const sender = require("../utils/sender");
const { rswitch } = require("rswitch");

class AuthController {
  // @POST="/login/email" // ✔ checked
  emailLogin = async (req, res) => {
    // validate

    const value = req.validate("emailLogin", req.body);
    // check user
    const user = await UserModel.findOne({ email: value.email });
    if (!user) throw new Error("User not exist", 401);

    // check auth
    if ("google,facebook,apple".includes(user.auth))
      throw new Error(user.auth, 403);

    // check password
    const isMatch = await Hash._matchPassword(value.password, user.password);
    if (!isMatch) throw new Error("Invalid credential", 401);

    if (!user.verified) {
      throw new Error("Your account isn't verified yet, Please verify", 403);
    }
    const token = Hash.encryptData({ id: user._id });

    res.status(200).send({
      token,
      message: "logged in successfully",
    });
  };

  // @POST="/signup" // ✔ checked
  signup = async (req, res) => {
    const value = await req.validate("signup", req.body);

    const user = await UserModel.findOne({ email: value.email });

    if (user) throw new Error("User already exist", 401);

    const hashPassword = await Hash._hashPassword(value.password);

    const newUser = await new UserModel({
      ...value,
      auth: "email",
      password: hashPassword,
    }).save();

    let token = await new TokenModel({
      userId: newUser._id,
      token: Hash.randomString(),
      type: "verifyEmail",
    }).save();

    const confirmEmailUrl = ${process.env.CLIENT_URL}/signup/verify/${token.token};

    sender.send({
      message: {
        to: value.email,
      },
      template: "confirm_email",
      locals: {
        url: confirmEmailUrl,
      },
    });

    const resendToken = await new TokenModel({
      userId: newUser._id,
      token: Hash.randomString(),
      type: "resendEmail",
    }).save();

    const encrypt = Hash.encryptData({
      email: value.email,
    });

    res.status(201).send({
      message: "User created successfully",
      hash: encrypt,
      token: resendToken.token,
    });
  };

  // @POST="/signup/verify" // ✔ checked
  verifyEmail = async (req, res) => {
    const { token } = req.validate(
      "verifyEmail",
      Object.assign({}, req.query, req.body)
    );

    const findToken = await TokenModel.findOne({
      token: token,
      type: "verifyEmail",
    });

    console.log(findToken, "Test");

    if (!findToken) throw new Error("Invalid link", 400);

    const user = await UserModel.findOne({ _id: findToken.userId });
    if (!user) throw new Error("Invalid link", 400);

    await UserModel.updateOne({ _id: user._id }, { verified: true });
    await TokenModel.deleteOne({ _id: findToken._id });

    res.status(200).send({ message: "Email verified successfully" });
  };

  // @POST="/password/forgot" // ✔ checked
  forgotPassword = async (req, res) => {
    const { email } = await req.validate("forgotPassword", req.body);

    const user = await UserModel.findOne({ email });

    if (!user) throw new Error("No user found with this email", 400);

    if ("google,apple,facebook".includes(user.auth)) {
      throw new Error(user.auth, 400);
    }

    if (!user.verified) throw new Error("User is not verified", 401);

    let resendToken = await TokenModel.findOne({
      userId: user._id,
      type: "resendEmail",
    });

    if (resendToken) {
      const isMinute = new Date() - new Date(resendToken.updatedAt) < 60000;
      if (isMinute) {
        throw new Error("Can't resend email within one minute", 403);
      }
      await TokenModel.updateOne({ token: resendToken.token }, {});
    } else {
      resendToken = await TokenModel.create({
        token: Hash.randomString(),
        userId: user._id,
        type: "resendEmail",
      });
    }

    let token = await TokenModel.findOneAndUpdate(
      {
        userId: user._id,
        type: "resetPassword",
      },
      { userId: user._id, token: Hash.randomString(), type: "resetPassword" },
      { new: true, upsert: true }
    );

    const passwordResetLink = ${process.env.CLIENT_URL}/reset-password/${token.token};

    // Send Reset Password Mail
    sender.send({
      message: {
        to: email,
      },
      template: "reset_password",
      locals: {
        url: passwordResetLink,
      },
    });

    const encrypt = Hash.encryptData({ email });

    res.status(200).send({
      message:
        "Password reset email send successfully, Please check your email",
      hash: encrypt,
      token: resendToken.token,
    });
  };

  // @POST="/password/reset" // ✔ checked
  resetPassword = async (req, res) => {
    let { password, token } = await req.validate("resetPassword", req.body);

    // Check if the provided token exists in the database
    const checkToken = await TokenModel.findOne({
      token,
      type: "resetPassword",
    });
    if (!checkToken) throw new Error("Invalid token", 404);

    // Hash the new password
    password = await Hash._hashPassword(password);

    // Update the user's password using the hashed password
    await UserModel.updateOne({ _id: checkToken.userId }, { password });
    await TokenModel.deleteOne({ token });

    // Respond with a success message
    res.status(200).send({
      message: "Password reset successfully",
    });
  };

  // @POST="/email/resend" // ✔ checked
  resendEmail = async (req, res) => {
    const { token: t, type } = req.validate("resendEmail", req.body);

    let token = await TokenModel.findOne({ token: t, type: "resendEmail" });

    if (!token) throw new Error("Token not valid", 400);

    const user = await UserModel.findOne({
      _id: token.userId,
    });

    if (!user) throw new Error("User not exist", 400);

    if (type == "confirm_email") {
      if (user.verified) throw new Error("User already verified", 400);
    }

    const authToken = await TokenModel.findOneAndUpdate(
      { type, userId: token.userId },
      {
        token: Hash.randomString(),
      },
      { new: true }
    );

    if (!authToken) throw new Error("Token not valid");

    const isMinute = new Date() - new Date(token.updatedAt) < 60000;
    if (isMinute) {
      throw new Error("Can't resend email within one minute", 403);
    }
    await TokenModel.updateOne({ token: token.token }, {});

    const resendEmailLink = rswitch(type, {
      resetPassword: ${process.env.CLIENT_URL}/reset-password/${authToken.token},
      verifyEmail: ${process.env.CLIENT_URL}/signup/verify/${authToken.token},
    });

    // Resend email
    sender.send({
      message: {
        to: user.email,
      },
      template: rswitch(type, {
        resetPassword: "reset_password",
        verifyEmail: "confirm_email",
      }),
      locals: {
        url: resendEmailLink,
      },
    });

    res.status(200).send({
      message: "Email resend successfully, Please check your email",
    });
  };

  // @POST="/login/facebook" // ✔ checked
  facebookLogin = async (req, res) => {
    // body data validation
    const value = req.validate("facebookLogin", req.body);

    let user = await UserModel.findOne({ email: value.email });

    if (user && "apple,email,google".includes(user.auth)) {
      throw new Error(user.auth, 400);
    }

    // create user
    if (!user) {
      user = new UserModel({ auth: "facebook", ...value });
      await user.save();
    }

    // create token
    const token = Hash.encryptData({ id: user._id });
    res.status(201).send({
      token,
      message: "Facebook logged in successfully",
    });
  };

  // @POST="/login/google" // ✔ checked
  googleLogin = async (req, res) => {
    // body data validation
    const value = req.validate("googleLogin", req.body);
    let user = await UserModel.findOne({ email: value.email });

    if (user && "apple,email,facebook".includes(user.auth)) {
      throw new Error(user.auth, 400);
    }

    // create user
    if (!user) {
      user = new UserModel({ auth: "google", ...value });
      await user.save();
    }

    // create token
    const token = Hash.encryptData({ id: user._id });
    res.status(201).send({
      token,
      message: "Google logged in successfully",
    });
  };
}

module.exports = AuthController;