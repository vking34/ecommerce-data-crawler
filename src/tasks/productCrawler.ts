import axios from "axios";
import { SHOPEE_API } from '../constants/api';
import ShopeeProductModel from '../models/shopeeProduct';


export default (productUrl: string) => {
    return new Promise(async (resolve, reject) => {
        let urlParts = productUrl.split('.');
        const shopId: string = urlParts[2];
        const productId: string = urlParts[3];

        try {
            let product = ShopeeProductModel.findById(productId);
            if (product === null) {
                const productApiUrl = `${SHOPEE_API}/item/get?itemid=${productId}&shopid=${shopId}`;
                try {
                    const productResponse = await axios.get(productApiUrl, { timeout: 4000 });
                    let product = productResponse.data.item;
                    product._id = productId;
                    ShopeeProductModel.create(product).catch(_e => { });
                    console.log('saving product: ', productId);
                    resolve(productId);
                }
                catch (e) {
                    reject(e);
                }
            }
            else {
                console.log('saved product: ', productId);
                reject(productId);
            }
        }
        catch (e) {
            reject(e);
        }
    });
}