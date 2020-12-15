import fs, { ReadStream, Stats } from 'fs';
import path from 'path';
import { downloadFile, getFileStat } from '../utils/common';
import xmlFlow from 'xml-flow';
import { Sitemap } from '../interfaces/shopee';
// import crawlShopSitemap from './shopSitemapCrawler';
import crawlProducts from './products/productSitemapCrawler';
// import crawlShops from './shopListCrawler';
// import crawlCategorySitemap from './categorySitemapCrawler';
// import crawlCategories from './categoryListCrawler';

export const rootPath: string = process.cwd();
export const sitemapPath = path.join(rootPath, 'sitemaps')
const shopeeSitemap = 'shopee.sitemap.xml';
const shopeeSitemapPath = path.join(sitemapPath, shopeeSitemap);

// TODO: re-enable crawling shop
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
                await downloadFile('http://sitemap.shopee.vn/sitemap.xml', shopeeSitemapPath);
            }
            // else {
            //     console.log('sitemap exists');
            // }
        }
        catch (e) {
            console.log(e);
            await downloadFile('http://sitemap.shopee.vn/sitemap.xml', shopeeSitemapPath);
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

        // const shopSitemapQueue: string[] = [];
        const productSitemapQueue: string[] = [];
        // const categorySitemapQueue: string[] = [];
        let xmlStream = xmlFlow(shopeeSitemapReaderStream);

        xmlStream.on('tag:sitemap', async (sitemap: Sitemap) => {
            const location = sitemap.loc;
            if (location.includes('items')) {
                productSitemapQueue.push(location);
            }
            
            // else if (location.includes('shops')) {
            //     const shopSitemapPath: string = await crawlShopSitemap(location);
            //     shopSitemapQueue.push(shopSitemapPath);
            //     console.log(shopSitemapQueue)
    
            // }

            // else if(location.includes('categories')){
            //     const catSitemapPath = await crawlCategorySitemap(location);
            //     categorySitemapQueue.push(catSitemapPath)

            // }
        });

        xmlStream.on('end', () => {
            shopeeSitemapReaderStream.close();
            // crawlShops(categorySitemapQueue);
            crawlProducts(productSitemapQueue);
            // crawlCategories(categorySitemapQueue);
        });

        resolve(1);
    })
}

