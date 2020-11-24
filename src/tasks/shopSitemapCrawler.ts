import { ReadStream, createReadStream, createWriteStream, existsSync } from 'fs';
import path from 'path';
import { sitemapPath } from './index';
import axios from 'axios';
import { createGunzip } from 'zlib';
import { promisify } from 'util';
import { pipeline } from 'stream';
import xmlFlow from 'xml-flow';
import crawlShop from './shopCrawler';


const pipe = promisify(pipeline);
const downloadSitemap = async (url: string, filePath: string) => {
    const gunzip = createGunzip();
    const fileWriteStream = createWriteStream(filePath);
    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    await pipe(response.data, gunzip, fileWriteStream);
}


export default async (shopSitemapLink: string) => {
    // console.log(shopSitemapLink);
    const shopSitemapUrl = new URL(shopSitemapLink);
    const shopSitemap = shopSitemapUrl.pathname.slice(1, -3);
    const shopSitemapPath = path.join(sitemapPath, shopSitemap);
    try {
        if (!existsSync(shopSitemapPath)) {
            try {
                await downloadSitemap(shopSitemapLink, shopSitemapPath);
            }
            catch (e) {
                console.log('gunzip error:', e);
            }
        }
        // else {
        //     console.log(shopSitemap, 'exists');
        // }

        let readStream: ReadStream = createReadStream(shopSitemapPath);
        readStream.setEncoding('utf8');

        let xmlStream = xmlFlow(readStream);
        xmlStream.on('tag:loc', shopLink => {
            crawlShop(shopLink.$cdata);
        });
    }
    catch (e) {
        console.log(e);
    }
}