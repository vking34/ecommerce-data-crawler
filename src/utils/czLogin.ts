import axios from 'axios';
import { CHOZOI_API } from '../constants/api';

export const loginCZ = async (username,password) => {
    let token;
    const data = {
        username: username,
        password: password
    }
    try{
        const response: any =  await axios({
            method: 'post',
            url: `${CHOZOI_API}/v1/auth/login`,
            data: data
        })
        console.log(response);
        token = response.data.access_token;
        
    }
    catch(e){
        console.log(e);
        
    }
    return token;
} 