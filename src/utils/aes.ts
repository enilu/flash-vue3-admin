import CryptoJS from "crypto-js";
//密钥：长度必须为16位
const KEY = CryptoJS.enc.Utf8.parse("webflash007cool.");
//初始向量：长度随意
const IV = CryptoJS.enc.Utf8.parse("1234567890123456");
export function encrypt(word: string) {
  const key = KEY;
  const iv = IV;
  const srcs = CryptoJS.enc.Utf8.parse(word);
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}

export function decrypt(word: string) {
  const key = KEY;
  const iv = IV;
  const base64 = CryptoJS.enc.Base64.parse(word);
  const src = CryptoJS.enc.Base64.stringify(base64);

  let decrypt = CryptoJS.AES.decrypt(src, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });

  let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  return decryptedStr.toString();
}
