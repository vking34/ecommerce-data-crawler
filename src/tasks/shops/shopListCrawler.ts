import xmlFlow from 'xml-flow';
import crawlShop from './shopCrawler';
import { ReadStream, createReadStream } from 'fs';
import { sleep } from '../../utils/common';
import downloadSitemaps from './shopSitemapDownloader';


const crawlShopsPromise = (shopSitemapPath: string) => {
    return new Promise((resolve, reject) => {
        console.log('crawling:', shopSitemapPath);
        const shopQueue: string[] = [];
        try {
            let readStream: ReadStream = createReadStream(shopSitemapPath);
            readStream.setEncoding('utf8');

            let xmlStream = xmlFlow(readStream);
            xmlStream.on('tag:loc', shopTag => {
                const shopName = new URL(shopTag.$cdata).pathname.substring(1);
                shopQueue.push(shopName);
            });

            xmlStream.on('end', async () => {
                // console.log('shopQueue', shopQueue);
                readStream.close();
                let shopName: string = shopQueue.shift();
                while (shopName) {
                    await crawlShop(shopName);
                    await sleep(4000);
                    shopName = shopQueue.shift();
                }

                resolve(1);
            });
        }
        catch (e) {
            reject(e);
        }
    })
}


export default async (shopSiteMapQueue: string[]) => {
    const pathQueue: string[] = [];
    await downloadSitemaps(shopSiteMapQueue, pathQueue);
    // console.log('shop list:', pathQueue);
    let shopSitemapPath = pathQueue.shift();
    while (shopSitemapPath) {
        await crawlShopsPromise(shopSitemapPath);
        shopSitemapPath = pathQueue.shift();
    }
}