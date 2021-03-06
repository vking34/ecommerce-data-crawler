import express, { Request, Response, Router } from 'express';
import { SHOPEE_API } from '../constants/api';
import { INVALID_SHOP_LINK, SHOP_NOT_FOUND } from '../constants/response';
import axios from 'axios';
import ProductModel from '../models/product';
import { crawlShopByUrl } from '../tasks/shopCrawler';
import ShopeeShopModel from '../models/shopeeShop';

const router: Router = express.Router();

router.post('', (req: Request, resp: Response) => {
    const shopLink = new URL(req.body.shop);
    const shopName = shopLink.pathname.substring(1);

    console.log('shop name:', shopName);

    // need to validate more
    if (!shopName) {
        resp.status(400).send(INVALID_SHOP_LINK);
        return;
    }

    resp.send({
        status: true,
        message: 'crawling...'
    });

    const shopDetailUrl = `${SHOPEE_API}/v4/shop/get_shop_detail?username=${shopName}`;
    axios.get(shopDetailUrl)
        .then(async (shopDetailResponse) => {
            const shopId = shopDetailResponse.data.data.shopid;
            console.log('shop id:', shopId);
            let productCount: number = 100;
            for (let newest = 0; productCount === 100; newest += 100) {
                const productListUrl = `${SHOPEE_API}/v2/search_items/?by=pop&limit=100&match_id=${shopId}&newest=0&order=desc&page_type=shop&version=2`
                console.log('product list url: ', productListUrl);

                const headers = {
                    'if-none-match-': '*'
                }
                try {
                    let productListResponse = await axios.get(productListUrl, { headers })
                    const productList: [any] = productListResponse.data.items;
                    productCount = productList.length;
                    productList.forEach(async (product) => {
                        const productId: string = product.itemid;
                        console.log('product id:', productId);

                        try {
                            const productRecord = await ProductModel.findById(productId);
                            console.log('product record: ', productRecord?._id);

                            if (!productRecord) {
                                const productUrl = `${SHOPEE_API}/v2/item/get?itemid=${productId}&shopid=${shopId}`;
                                console.log(productUrl);

                                axios.get(productUrl)
                                    .then((productResponse) => {
                                        const productInfo = productResponse.data.item;
                                        console.log(productInfo.name);

                                        product = {
                                            _id: productId,
                                            shop_id: shopId,
                                            name: productInfo.name,
                                            description: productInfo.description,
                                        }

                                        ProductModel.create(product).catch((_e) => { });
                                    })
                                    .catch((_error) => { })
                            }
                        }
                        catch (_e) {
                            console.log('can not get product id:', productId);
                        }
                    });

                }
                catch (_e) {
                    productCount = 0;
                    console.log('can not get product list')
                }
            }
        }).catch((_e) => {
            // resp.status(400).send(INVALID_SHOP_LINK);
            console.log('can not get shop detail:', _e);
        });
});

router.post('/shopee', (req: Request, resp: Response) => {
    const shopLink: string = req.body.shop;
    crawlShopByUrl(shopLink);

    resp.send({
        status: true,
        shop: shopLink
    });
})


router.get('/shopee/:shopName', async (req: Request, resp: Response) => {
    const shopName: string = req.params.shopName;
    try {
        const shop = await ShopeeShopModel.findById(shopName);
        if (!shop) {
            resp.send(SHOP_NOT_FOUND);
            return;
        }

        resp.send({
            status: true,
            shop
        });
    }
    catch (e) {
        resp.send({
            status: false,
            message: 'Can not find shop'
        })
    }
});

export default router;