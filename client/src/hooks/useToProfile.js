import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';

const useToProfile = ()=>{

    const navigate = useNavigate();

    const encodeUserInfo = (email) => {
        const secretKey = CryptoJS.enc.Utf8.parse(process.env.REACT_APP_secretKey); 
        const iv = CryptoJS.lib.WordArray.random(16); // 랜덤 IV 생성
        const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(email), secretKey, { iv: iv }).toString();
        const urlSafeEncryptedData = encryptedData.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        const encryptedPayload = {
          iv: iv.toString(CryptoJS.enc.Base64),
          email: urlSafeEncryptedData,
        };
        return encryptedPayload;
      }

    const navigateToUserProfile = (email) => {
        if (email) {
          console.log(encodeUserInfo(email));
          navigate(`/userprofile/${encodeUserInfo(email).email}`, {state: encodeUserInfo(email)});
        } else {
          console.error('User ID not found for email:', email);
        }
      };

      return navigateToUserProfile;
}

export default useToProfile;