import fs, { ReadStream, Stats } from 'fs';
import axios from 'axios';
import path from 'path';
import util from 'util';
// import XMLParser from 'node-xml-stream';
import xmlFlow from 'xml-flow';
import { Sitemap, SitemapNumber } from '../interfaces/shopee';
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
    return new Promise(async (resolve, _reject) => {
        // console.log(sitemapPath);
        try {
            if (!fs.existsSync(sitemapPath)) {
                fs.mkdirSync(sitemapPath);
            }
        }
        catch (e) {
            console.log(e);
        }

        // console.log(shopeeSitemapPath);

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

        let shopeeSitemapReaderStream: ReadStream = fs.createReadStream(shopeeSitemapPath);
        shopeeSitemapReaderStream.setEncoding('utf8');

        // shopeeSitemapReaderStream.pipe(parser);
        const shopSitemapQueue: string[] = [];
        let sitemapNum: SitemapNumber = {
            shopSitemapNum: 0,
            productSitemapNum: 0
        };
        let xmlStream = xmlFlow(shopeeSitemapReaderStream);
        xmlStream.on('tag:sitemap', async (sitemap: Sitemap) => {
            // console.log(sitemap);
            const location = sitemap.loc;
            if (location.includes('shops')) {
                sitemapNum.shopSitemapNum++;
                const shopSitemapPath: string = await crawlShopSitemap(location);
                shopSitemapQueue.push(shopSitemapPath);
            }
            else if (location.includes('items')) {
                sitemapNum.productSitemapNum++;
                crawlProductSitemap(location);
            }

        });

        xmlStream.on('end', () => {
            shopeeSitemapReaderStream.close();
            crawlShopList(shopSitemapQueue);
        });

        resolve(1);

        // parsing by node-xml-stream
        // let parser = new XMLParser();
        // parser.on('opentag', (name, attributes) => {
        //     console.log('tage:', name);
        //     console.log('attributes:', attributes);
        // });

        // parser.on('text', text => {
        //     console.log(text);
        // });

        // parser.on('error', e => {
        //     console.log(e);
        // })

        // parser.on('finish', () => {
        //     console.log('finished!');

        // });
    })
}