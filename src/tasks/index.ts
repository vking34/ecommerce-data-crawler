import fs from 'fs';
import axios from 'axios';

export default async () => {
    const shopeeSiteMapFile = fs.createWriteStream('sitemap.xml');
    const response = await axios({
        url: 'http://sitemap.shopee.vn/sitemap.xml',
        method: 'GET',
        responseType: 'stream'
    });

    response.data.pipe(shopeeSiteMapFile);

}