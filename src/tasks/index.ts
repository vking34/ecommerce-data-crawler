import fs, { ReadStream, Stats } from 'fs';
import axios from 'axios';
import path from 'path';
import util from 'util';
// import XMLParser from 'node-xml-stream';
import xmlFlow from 'xml-flow';
import { Sitemap } from '../interfaces/shopee';
import crawlShopSitemap from './shopSitemapCrawler';
import crawlProductSitemap from './productSitemapCrawler';
import crawlShopList from './shopListCrawler';


export const rootPath = process.env.PWD;
export const sitemapPath = path.join(rootPath, 'sitemaps')
const shopeeSitemap = 'shopee.sitemap.xml';
const shopeeSitemapPath = path.join(sitemapPath, shopeeSitemap);
const getFileStat = util.promisify(fs.stat);

const downloadShopeeSitemap = async () => {
    const shopeeSitemapFile = fs.createWriteStream(shopeeSitemapPath);
    const response = await axios({
        url: 'http://sitemap.shopee.vn/sitemap.xml',
        method: 'GET',
        responseType: 'stream'
    });

    response.data.pipe(shopeeSitemapFile);
}

export default () => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!fs.existsSync(sitemapPath)) {
                fs.mkdirSync(sitemapPath);
            }
        }
        catch (e) {
            console.log(e);
            reject(e);
            return;
        }

        try {
            const fileStat: Stats = await getFileStat(shopeeSitemapPath);
            if (!fileStat.isFile()) {
                await downloadShopeeSitemap();
            }
            // else {
            //     console.log('sitemap exists');
            // }
        }
        catch (e) {
            console.log(e);
            await downloadShopeeSitemap();
        }

        let shopeeSitemapReaderStream: ReadStream;
        try {
            shopeeSitemapReaderStream = fs.createReadStream(shopeeSitemapPath);
            shopeeSitemapReaderStream.setEncoding('utf8');
        }
        catch (e) {
            reject(e);
            return;
        }

        const shopSitemapQueue: string[] = [];
        let xmlStream = xmlFlow(shopeeSitemapReaderStream);

        xmlStream.on('tag:sitemap', async (sitemap: Sitemap) => {
            const location = sitemap.loc;
            if (location.includes('shops')) {
                const shopSitemapPath: string = await crawlShopSitemap(location);
                shopSitemapQueue.push(shopSitemapPath);
            }
            else if (location.includes('items')) {
                crawlProductSitemap(location);
            }
        });

        xmlStream.on('end', () => {
            shopeeSitemapReaderStream.close();
            crawlShopList(shopSitemapQueue);
        });

        resolve(1);
    })
}