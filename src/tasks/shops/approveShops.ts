import axios from 'axios';
import { CHOZOI_API } from '../../constants/api';
import approveProducts from '../../tasks/products/approveProducts';
import { loginCZ } from '../../utils/chozoi';
import ChozoiShopModel from '../../models/chozoiShop';


const SELLER_CREATION_URL = `${CHOZOI_API}/v1/auth/create_account`;
export default (shopIds: string[]) => {
    shopIds.forEach(async shopId => {
        try {
            const shop = await ChozoiShopModel.findById(shopId)
            // TODO: limit description length
            const shopRequestData = {
                username: shop.username,
                phoneNumber: shop.phone_number ? shop.phone_number : shop.phone_numbers[0],
                contactName: shop.contact_name,
                email: shop.email,
                password: shop.password,
                name: shop.name,
                imgAvatarUrl: shop.img_avatar_url,
                imgCoverUrl: shop.img_cover_url,
                description: shop.description
            }
            console.log(shopRequestData);

            try {
                const response = await axios.post(SELLER_CREATION_URL, shopRequestData, { timeout: 10000 });
                console.log('status:', response.status);
                if (response.status == 200) {
                    console.log(response.data);
                    const czShopId: string = response.data.shopId;
                    await ChozoiShopModel.updateOne({_id: shopId}, {cz_shop_id: czShopId});
                    const token = await loginCZ(shop.username, shop.password);
                    console.log(token);
                    await approveProducts(shopId, token);

                }
            }
            catch (e) {
                console.log('can not create seller:', shopId, e);
            }

            // try {
            //     const response = await axios({
            //         method: 'post',
            //         url: `${CHOZOI_API}/v1/auth/create_account`,
            //         data: data
            //     })
            //     console.log(response.statusText);
            //     if (response.status == 200) {
            //         const access_token = await loginCZ(shop.username, shop.password);
            //         markProduct(shopId, access_token);

            //     }
            //     resp.send({
            //         status: true,
            //     })

            // }
            // catch (e) {
            //     console.log(e);


            // }

        }
        catch (e) {
            console.log(e);
        }
    })
}