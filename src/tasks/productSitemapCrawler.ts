import { downloadSitemap, getFileStat, sleep } from '../utils/common';
import { sitemapPath } from './index';
import path from 'path';
import { Stats } from 'fs';
import crawlProductList from './productListCrawler';


let pathQueue: string[] = [];
const downloadSitemaps = (productSitemapQueue: string[]) => {
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
            await sleep(1000);
        }

        resolve(1);
    })
}



export default async (productSitemapQueue: string[]) => {
    await downloadSitemaps(productSitemapQueue);
    let productSitemapPath: string = pathQueue.shift();

    while (productSitemapPath) {
        console.log(productSitemapPath);
        await crawlProductList(productSitemapPath);
        productSitemapPath = productSitemapQueue.shift();
    }
}