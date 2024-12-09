import CryptoJS from "crypto-js";
import Cookies from "universal-cookie";

const cookies = new Cookies(null, { path: "/" });
const SECRET_KEY = import.meta.env.VITE_TAILBUDDY_SECRET_KEY;

export const setEncryptedCookie = (name, data, hours) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    SECRET_KEY
  ).toString();

  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + hours);

  cookies.set(name, encryptedData, {
    path: "/",
    expires: expirationDate,
  });
};

export const getDecryptedCookie = (name) => {
  const encryptedData = cookies.get(name);
  if (!encryptedData) return null;

  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.error("Failed to decrypt cookie:", error);
    return null;
  }
};
