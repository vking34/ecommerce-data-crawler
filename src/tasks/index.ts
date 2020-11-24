import fs, { ReadStream, Stats } from 'fs';
import axios from 'axios';
import path from 'path';
import util from 'util';
// import XMLParser from 'node-xml-stream';
import xmlFlow from 'xml-flow';
import { Sitemap } from '../interfaces/shopee';
import crawlShopSitemap from './shopSitemapCrawler';
import crawlProductSitemap from './productSitemapCrawler';


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
        console.log(sitemapPath);
        try {
            if (!fs.existsSync(sitemapPath)) {
                console.log('mkdir...');

                fs.mkdirSync(sitemapPath);
            }
        }
        catch (e) {
            console.log(e);
        }

        console.log(shopeeSitemapPath);

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

        // shopeeSitemapReaderStream.pipe(parser);
        const shopStr = 'shops';
        const itemStr: string = 'items';
        let xmlStream = xmlFlow(shopeeSitemapReaderStream);
        xmlStream.on('tag:sitemap', (sitemap: Sitemap) => {
            // console.log(sitemap);
            const location = sitemap.loc;
            if (location.includes(shopStr)) {
                crawlShopSitemap(location);
            }
            else if (location.includes(itemStr)) {
                crawlProductSitemap(location);
            }

        });

        resolve(1);
    })
}