import xmlFlow from 'xml-flow';
import crawlShop from './shopCrawler';
import { ReadStream, createReadStream } from 'fs';
import { sleep } from '../utils/common';


const shopQueue: string[] = [];
const crawlShopPromise = (shopSitemapPath: string) => {
    return new Promise((resolve, reject) => {
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
    let shopSitemapPath: string = shopSiteMapQueue.shift();
    console.log('get shop list:', shopSiteMapQueue);
    while (shopSitemapPath) {
        console.log(shopSitemapPath);
        await crawlShopPromise(shopSitemapPath);
        console.log('next shop path...')
        shopSitemapPath = shopSiteMapQueue.shift();
    };
}