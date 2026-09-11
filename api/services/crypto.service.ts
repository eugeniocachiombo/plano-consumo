import CryptoJS from 'crypto-js';
const CRYPTO_SECRET_KEY = String('secret');
// const CRYPTO_SECRET_KEY = String(process.env.CRYPTO_SECRET_KEY);

class CryptoService {
    constructor(){
        console.log("api", String(process.env.CRYPTO_SECRET_KEY))
    }
    public encryptId(text: string) {
        const encryptedText = CryptoJS.AES.encrypt(String(text), CRYPTO_SECRET_KEY).toString();
        return encodeURIComponent(encryptedText);
    }
    public decryptId(text: string): number {
        const safeText = decodeURIComponent(text);
        const bytes = CryptoJS.AES.decrypt(safeText, CRYPTO_SECRET_KEY);
        const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
        return Number(decryptedText) || 0;
    }
}

export default new CryptoService();