const qrcode = require("qrcode");
const { authenticator } = require("otplib");

authenticator.options = {
  window: 1,
  algorithm: "sha1",
};

const generateUniqueSecret = () => {
  return authenticator.generateSecret();
};

const generateOTPToken = (userName, serviceName, secret) => {
  // serviceName will be displayed on Google Authenticator or Authy app after you scan the QR code
  return authenticator.keyuri(userName, serviceName, secret);
};

const verifyOTPToken = (token, secret) => {
  // return authenticator.verify({ token, secret });
  return authenticator.check(token, secret);
};

const generateQRCode = async (otpAuth) => {
  try {
    return await qrcode.toDataURL(otpAuth);
  } catch (error) {
    return Promise.reject("Could not generate QR code" + error);
  }
};

module.exports = {
  generateUniqueSecret,
  verifyOTPToken,
  generateOTPToken,
  generateQRCode,
};
