import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../components/login/OAuth';
import {jwtDecode} from 'jwt-decode';

const useAuth = () => {
    const { token, serverUrl } = useContext(AuthContext);
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setLoggedInUserId(decodedToken.email);
            } catch (error) {
                console.error('토큰 디코딩 에러:', error);
            }
        }
    }, [token]);

    return {
        loggedInUserId,
        serverUrl,
        token

    };
};

export default useAuth;