import axios from 'axios';
import { CHOZOI_API } from '../constants/api';

const LOGIN_URL = `${CHOZOI_API}/v1/auth/login`;
export const loginCZ = async (username: string, password: string) => {
    let token;
    const data = {
        username: username,
        password: password
    }

    try{
        const response = await axios.post(LOGIN_URL, data);
        token = response.data.access_token;
    }
    catch(e){
        console.log(e);
        token = '';
    }
    return token;
} 