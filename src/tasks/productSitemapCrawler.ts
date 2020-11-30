import { downloadSitemap, getFileStat } from '../utils/common';
import { sitemapPath } from './index';
import path from 'path';
import { Stats } from 'fs';
// import crawlProductList from './productListCrawler';
import saveProductIds from './productIdSaver';


const downloadSitemaps = (productSitemapQueue: string[], pathQueue: string[]) => {
    return new Promise(async (resolve, reject) => {
        if (!productSitemapQueue) reject(new Error('empty product sitemap queue'));

        let url = productSitemapQueue.shift();
        while (url) {
            const productSitemapUrl = new URL(url);
            const productSitemap = productSitemapUrl.pathname.slice(1, -3);
            const productSitemapPath = path.join(sitemapPath, productSitemap);

            try {
                const fileStat: Stats = await getFileStat(productSitemapPath);
                if (!fileStat.isFile()) {
                    try {
                        await downloadSitemap(url, productSitemapPath);
                        pathQueue.push(productSitemapPath);
                    }
                    catch (e) {
                        console.log(e);
                    }
                }
                else {
                    pathQueue.push(productSitemapPath);
                    console.log('existed:', productSitemapPath);
                }
            }
            catch (e) {
                try {
                    await downloadSitemap(url, productSitemapPath);
                    pathQueue.push(productSitemapPath);
                    console.log('downloaded:', productSitemapPath);
                }
                catch (e) {
                    console.log(e);
                }
            }

            url = productSitemapQueue.shift();
            // await sleep(200);
        }

        resolve(1);
    })
}


export default async (productSitemapQueue: string[]) => {
    let pathQueue: string[] = [];
    await downloadSitemaps(productSitemapQueue, pathQueue);
    await saveProductIds(pathQueue);


    // let productSitemapPath: string = pathQueue.shift();
    // while (productSitemapPath) {
    //     console.log('productSitemapPath:', productSitemapPath);
    //     await crawlProductList(productSitemapPath);
    //     productSitemapPath = productSitemapQueue.shift();
    // }
}