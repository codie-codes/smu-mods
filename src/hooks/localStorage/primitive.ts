import CryptoJS from "crypto-js";

const secretKey = "secretKey";

export function readFromLS(key: string): string | null {
  if (typeof window !== "undefined" && window.localStorage) {
    const storedData = window.localStorage.getItem(key);
    if (storedData) {
      try {
        const decryptedData = CryptoJS.AES.decrypt(
          storedData,
          secretKey,
        ).toString(CryptoJS.enc.Utf8);
        return decryptedData;
      } catch {
        return null;
      }
    } else {
      return null;
    }
  } else {
    return null;
  }
}

export function writeToLS(key: string, data: string): void {
  if (typeof window !== "undefined" && window.localStorage) {
    const encryptedData = CryptoJS.AES.encrypt(data, secretKey).toString();
    window.localStorage.setItem(key, encryptedData);
  }
}
