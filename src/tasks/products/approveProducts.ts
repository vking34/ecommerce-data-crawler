import ChozoiProductModel from '../../models/chozoiProduct';
import axios, { AxiosRequestConfig } from 'axios';
import { CHOZOI_API } from '../../constants/api';


export default async (shopeeShopId: string, czShopId: string, token: string) => {
    console.log(shopeeShopId, czShopId, token);

    try {
        const czProducts = await ChozoiProductModel.find({ shop_id: shopeeShopId });        
        if (czProducts.length > 0) {
            const requestConfig: AxiosRequestConfig = {
                headers: {
                    'x-chozoi-token': token
                }
            }

            czProducts.forEach(async product => {
                const productCreationUrl = `${CHOZOI_API}/v1/shops/${czShopId}/products/confirmation`;
                try {
                    const response = await axios.post(productCreationUrl, product, requestConfig);
                    if (response.status === 200) {
                        console.log('created product:', product._id, response.data.id);
                        // console.log(response.data);
                        await ChozoiProductModel.updateOne({ _id: product._id }, { state: 'APPROVED' });
                    }
                    
                }
                catch (e) {
                    console.error('can not create product: ', product._id);
                }

            })
        }
    } catch (e) {
        console.error('can not find product in shop:', shopeeShopId);
    }
}