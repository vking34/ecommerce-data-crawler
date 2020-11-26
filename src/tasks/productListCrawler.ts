import { ReadStream, createReadStream } from 'fs';
import xmlFlow from 'xml-flow';
import { sleep } from "../utils/common";
import crawlProduct from './productCrawler';


export default (productSitemapPath: string) => {
    return new Promise((resolve, reject) => {
        const productUrlQueue: string[] = [];
        try {
            let readStream: ReadStream = createReadStream(productSitemapPath);
            readStream.setEncoding('utf8');

            let xmlStream = xmlFlow(readStream);
            xmlStream.on('tag:loc', shopTag => {
                productUrlQueue.push(shopTag.$cdata);
            });

            xmlStream.on('end', async () => {
                readStream.close();
                let productUrl = productUrlQueue.shift();
                while (productUrl) {
                    await crawlProduct(productUrl);
                    await sleep(4000);
                    productUrl = productUrlQueue.shift();
                }

                resolve(1);
            });
        }
        catch (e) {
            reject(e);
        }
    })
}