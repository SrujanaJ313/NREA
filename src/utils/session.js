export const setBufferParameters = (params) => {
  sessionStorage.setItem("bufferParams", JSON.stringify(params));
};

export const getBufferParameters = () => {
  return JSON.parse(sessionStorage.getItem("bufferParams"));
};

export const setTokenExpiryTime = (expTime) => {
  sessionStorage.setItem("accessTokenExpiryTime", expTime);
};

export const getTokenExpiryTime = () => {
  return sessionStorage.getItem("accessTokenExpiryTime");
};
