import { ReadStream, createReadStream } from 'fs';
import xmlFlow from 'xml-flow';
import { ProductId } from '../interfaces/shopee';
import ShopeeProductIdModel from '../models/shopeeProductId';

const saveProductIdList = (productSitemapPath: string) => {
    return new Promise((resolve, _reject) => {
        try {
            console.log('list', productSitemapPath);

            let readStream: ReadStream = createReadStream(productSitemapPath);
            readStream.setEncoding('utf8');

            const productQueue: ProductId[] = [];
            let xmlStream = xmlFlow(readStream);
            xmlStream.on('tag:loc', shopTag => {
                const urlParts = shopTag.$cdata.split('.');
                const partLength = urlParts.length;
                const product_id: string = urlParts[partLength - 1];
                const shop_id: string = urlParts[partLength - 2];
                const product: ProductId = {
                    _id: `${shop_id}.${product_id}`,
                    product_id,
                    shop_id
                }
                productQueue.push(product);
            });

            xmlStream.on('end', async () => {
                readStream.close();
                let product: ProductId = productQueue.shift();
                while (product) {
                    console.log(product._id);

                    try {
                        await ShopeeProductIdModel.create(product);
                    }
                    catch (e) {
                        console.log(product._id, 'can not save:', e);
                    }
                    product = productQueue.shift();
                }

                resolve(1);
            });
        }
        catch (e) {
            console.log(e);
            resolve(0);
        }
    })
}

export default async (productPathQueue: string[]) => {

    for (let i = 0; i < productPathQueue.length; i++) {
        const productSitemapPath = productPathQueue[i];
        await saveProductIdList(productSitemapPath);
    }

    // productPathQueue.forEach(productSitemapPath => {
    //     try {
    //         console.log('list', productSitemapPath);

    //         let readStream: ReadStream = createReadStream(productSitemapPath);
    //         readStream.setEncoding('utf8');

    //         const productQueue: ProductId[] = [];
    //         let xmlStream = xmlFlow(readStream);
    //         xmlStream.on('tag:loc', shopTag => {
    //             const urlParts = shopTag.$cdata.split('.');
    //             const partLength = urlParts.length;
    //             const product: ProductId = {
    //                 _id: urlParts[partLength - 1],
    //                 shop_id: urlParts[partLength - 2]
    //             }
    //             productQueue.push(product);
    //         });

    //         xmlStream.on('end', async () => {
    //             readStream.close();
    //             console.log('productQueue:', productQueue);

    //             let product: ProductId = productQueue.shift();
    //             while (product) {
    //                 try {
    //                     await ShopeeProductIdModel.create(product);
    //                 }
    //                 catch (e) {
    //                     console.log(product._id, 'can not save:', e);
    //                 }
    //                 product = productQueue.shift();
    //             }
    //         });
    //     }
    //     catch (e) {
    //         console.log(e);
    //     }
    // })
}