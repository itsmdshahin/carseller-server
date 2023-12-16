// otpService.js
import axios from 'axios';

const sendOTPRequest = async (userId, userEmail) => {
   try {
      const response = await axios.post(
         'http://localhost:5000/sendOTP', // Replace with your server's correct endpoint
         {
            userId: userId,
            userEmail: userEmail,
         }
      );

      if (response.status === 200) {
         console.log('OTP request sent successfully.');
      } else {
         console.error('Error sending OTP request:', response.status);
      }
   } catch (error) {
      console.error('Error during OTP request:', error);
   }
};

export default sendOTPRequest;
