import axios, { AxiosRequestConfig } from 'axios';
import ChozoiShopModel from '../../models/chozoiShop';
import { loginCZ } from '../../utils/chozoi';
import ChozoiProductModel from '../../models/chozoiProduct';
import { CHOZOI_API } from '../../constants/api'


export default async (shopId: string, productIds: string[]) => {
    try {
        const shopDetail = await ChozoiShopModel.findById(shopId)
        const username = shopDetail.username;
        const password = shopDetail.password;
        const czShopId = shopDetail.cz_shop_i
        const token = await loginCZ(username, password);
        const productCreationUrl = `${CHOZOI_API}/v1/shops/${czShopId}/products/confirmation`;
        const requestConfig: AxiosRequestConfig = {
            headers: {
                'x-chozoi-token': token
            }
        }
//ddd
        productIds.forEach(async productId => {
            const product = await ChozoiProductModel.findById(productId);
            try {
                const response = await axios.post(productCreationUrl, product, requestConfig);
                if (response.status === 200) {
                    console.log('created product:', product._id, response.data.id);
                }

            }
            catch (e) {
                console.error('can not create product: ', product._id);
            }
        })
    }
    catch {
        console.error('can not find product in shop:', shopId);
    }
}