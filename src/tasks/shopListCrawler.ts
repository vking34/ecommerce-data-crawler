import xmlFlow from 'xml-flow';
import crawlShop from './shopCrawler';
import { ReadStream, createReadStream } from 'fs';
import { sleep } from '../utils/common';


const shopLinkQueue: string[] = [];
const crawlShopPromise = (shopSitemapPath: string) => {
    return new Promise((resolve, reject) => {
        try {
            let readStream: ReadStream = createReadStream(shopSitemapPath);
            readStream.setEncoding('utf8');

            let xmlStream = xmlFlow(readStream);
            xmlStream.on('tag:loc', shopTag => {
                shopLinkQueue.push(shopTag.$cdata);
            });

            xmlStream.on('end', async () => {
                readStream.close();
                let shopLink: string = shopLinkQueue.shift();
                while (shopLink) {
                    await crawlShop(shopLink);
                    await sleep(2000);
                    shopLink = shopLinkQueue.shift();
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