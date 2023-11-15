export const ISSERVER = typeof window === 'undefined';
export const setLocal = (localKey, localValue) => {
  if (!ISSERVER) {
    let stringifyIfObj =
      typeof localValue === 'object' || typeof localValue === 'array'
        ? JSON.stringify(localValue)
        : localValue;

    localStorage.setItem(localKey, stringifyIfObj);
    return getLocal(localKey);
  }
};

export const getLocal = (localKey) => {
  if (!ISSERVER) {
    const getValue = localStorage.getItem(localKey);
    let returnValue;
    try {
      returnValue = JSON.parse(getValue);
    } catch (e) {
      returnValue = getValue;
    }
    return returnValue;
  }
};

export const removeLocal = (localKey) => {
  if (!ISSERVER) {
    localStorage.removeItem(localKey);
    return true;
  }
};