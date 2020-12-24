import axios from "axios";
import { SHOPEE_API } from '../../constants/api';
import ChozoiProductModel from '../../models/chozoiProduct';
import ShopeeProductId from "../../models/shopeeProductId";
import { filterMorePhoneNumbers } from '../../utils/phoneNumberFilter';
import { Platforms } from '../../constants/common';
import CategoriesMapModel from '../../models/categoryMap'


export const saveProduct = (productId: string, shopId: string) => {
    return new Promise(async (resolve, _reject) => {
        try {
            let product = await ChozoiProductModel.findById(productId);

            if (product === null) {
                const productApiUrl = `${SHOPEE_API}/v2/item/get?itemid=${productId}&shopid=${shopId}`;
                try {
                    const productResponse = await axios.get(productApiUrl, { timeout: 4000 });
                    let product = productResponse.data.item;
                    product._id = `${Platforms.shopee}.${productId}`;
                    product.product_id = productId;
                    product.platform = Platforms.shopee;
                    ChozoiProductModel.create(product).catch(_e => { });
                    console.log('saving product:', productId);
                    resolve(1);
                }
                catch (e) {
                    console.log('can not get:', productId);
                    await ShopeeProductId.updateOne({ shop_id: shopId }, { state: "FAIL" });
                    resolve(0);
                }
            }
            else {
                console.log('saved product:', productId);
                resolve(1);
            }
        }
        catch (e) {
            resolve(0);
        }
    });
}


export default (productId: string, shopId: string, phoneNumbers: any) => {
    return new Promise(async (resolve, reject) => {
        try {
            let product = await ChozoiProductModel.findById(productId);

            if (product === null) {
                const productApiUrl = `${SHOPEE_API}/v2/item/get?itemid=${productId}&shopid=${shopId}`;
                try {
                    const productResponse = await axios.get(productApiUrl, { timeout: 4000 });
                    let product = productResponse.data.item;
                    const catShopee = product.categories[2].catid;
                    const czCategory: any = await CategoriesMapModel.findById(catShopee);
                    if (!czCategory) {
                        
                        reject(new Error('Category of Product is not mapped'));
                    }
                    filterMorePhoneNumbers(product.description, phoneNumbers);
                    let images = [];

                    product.images.map((item, index) => {
                        images.push({
                            image_url: `https://cf.shopee.vn/file/${item}`,
                            sort: index
                        });
                    })
                    const variants = {
                        price: Number(product.price_before_discount) / 10000,
                        sale_price: Number(product.price) / 10000,
                        inventory: {
                            in_quantity: product.stock
                        }
                    }
                    const category = {
                        id: czCategory.cz_category_id
                    }
                    let productChozoi = {
                        _id: `${Platforms.shopee}.${productId}`,
                        product_id: productId,
                        shop_id: `${Platforms.shopee}.${shopId}`,
                        name: product.name,
                        images,
                        category,
                        variants,
                        platform: Platforms.shopee,
                    }
                    await ChozoiProductModel.create(productChozoi).catch(_e => {
                        console.log(_e);
                    });
                    console.log('saving product:', productId);
                    resolve(1);

                }
                catch (e) {
                    console.log('can not get:', productId, e);
                    await ShopeeProductId.updateOne({ shop_id: shopId }, { state: "FAIL" });
                    reject(e);
                }
            }
            else {
                console.log('saved product:', productId);
                resolve(1);
            }
        }
        catch (e) {
            console.log('can not get:', productId, e);
            reject(e);
        }
    });
}