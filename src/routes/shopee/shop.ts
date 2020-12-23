import express, { Request, Response, Router } from 'express';
import markAndCrawlShops from '../../tasks/shops/shopMarker';
import ChozoiShopModel from '../../models/chozoiShop';
import ShopeeShopModel from '../../models/shopeeShop'
import axios from 'axios';
import { CHOZOI_API } from '../../constants/api';
import { markProduct } from '../../utils/shopee';
import { loginCZ } from '../../utils/czLogin';
import filterPhoneNumbers from '../../utils/phoneNumberFilter';
const router: Router = express.Router();

// get raw shops
router.get('/raw-shops', (req: Request, resp: Response) => {

    let filters: any = {};


    try {
        let page: number = req.query.page ? parseInt(req.query.page as string) : 1;
        let limit: number = req.query.page ? parseInt(req.query.limit as string) : 10;
        let paginateOpts = {
            page,
            limit
        };

        ShopeeShopModel.paginate(filters, paginateOpts)
            .then(shopResult => [

                resp.send({
                    data: shopResult.docs,
                    filters,
                    pagination: {
                        page: shopResult.page,
                        page_size: shopResult.limit,
                        total_pages: shopResult.totalPages,
                        total_elements: shopResult.totalDocs
                    }
                })
            ])
            .catch(_e => {
                resp.send({
                    data: [],
                    filters,
                    pagination: {
                        page: 0,
                        page_size: 0,
                        total_pages: 0,
                        total_elements: 0
                    }
                });
            });
    }
    catch {
        resp.send({
            data: [],
            filters,
            pagination: {
                page: 0,
                page_size: 0,
                total_pages: 0,
                total_elements: 0
            }
        });
    }
})


//get convertations shop
router.get('/converted-shop', (req: Request, resp: Response) => {
    let filters: any = {};
    const state = req.query.state;
    try {
        if (state) {
            filters.state = state;
        }

        let page: number = req.query.page ? parseInt(req.query.page as string) : 1;
        let limit: number = req.query.page ? parseInt(req.query.limit as string) : 10;
        let paginateOpts = {
            page,
            limit
        };

        ChozoiShopModel.paginate(filters, paginateOpts)
            .then(shopResult => [
                resp.send({
                    data: shopResult.docs,
                    filters,
                    pagination: {
                        page: shopResult.page,
                        page_size: shopResult.limit,
                        total_pages: shopResult.totalPages,
                        total_elements: shopResult.totalDocs
                    }
                })
            ])
            .catch(_e => {
                resp.send({
                    data: [],
                    filters,
                    pagination: {
                        page: 0,
                        page_size: 0,
                        total_pages: 0,
                        total_elements: 0
                    }
                });
            });
    }
    catch (e) {
        resp.send({
            data: [],
            filters,
            pagination: {
                page: 0,
                page_size: 0,
                total_pages: 0,
                total_elements: 0
            }
        });
    }
});
// approve shop to chozoi
router.post('/approve', async (req: Request, resp: Response) => {
    const shopId = req.body.shop;
    try {
        const shop = await ChozoiShopModel.findById(shopId)
        const data = {
            username: shop.username,
            phoneNumber: shop.phone_number,
            contactName: shop.contact_name,
            email: shop.email,
            password: shop.password,
            name: shop.name,
            imgAvatarUrl: shop.img_avatar_url,
            imgCoverUrl: shop.img_cover_url,
            description: shop.description
        }

        try {
            const response = await axios({
                method: 'post',
                url: `${CHOZOI_API}/v1/auth/create_account`,
                data: data
            })
            console.log(response.statusText);
            if (response.status == 200) {
                const access_token = await loginCZ(shop.username, shop.password);
                markProduct(shopId, access_token);

            }
            resp.send({
                status: true,
            })

        }
        catch (e) {
            console.log(e);


        }

    }
    catch (e) {
        console.log(e);
    }
});
// update shop model chozoishop
router.put('/conveted-shops/:shopId', async (req: Request, resp: Response) => {
    const shopId = req.params.shopId;
    const data = req.body.data;
    let filter = {
        _id: shopId
    }
    try {
        await ChozoiShopModel.findOneAndUpdate(filter, data);
        resp.send({
            status: true,
            message: "Update Successfully!"
        })
    }
    catch (e) {
        resp.send({
            status: false,
            err: e
        })
    }

});

router.get('/conveted-shops/:shopId', async (req: Request, resp: Response) => {

    const shopId = req.params.shopId;
    try {
        console.log(shopId);

        const shop = await ChozoiShopModel.findById(shopId)
        resp.send(shop)

    }
    catch (e) {
        resp.send(e);
    }

});


// crawler shop by shop link
router.post('', (req: Request, resp: Response) => {
    const shopLinks: [string] = req.body.shops;
    resp.send({
        status: true,
        message: 'Crawling shops...'
    });

    markAndCrawlShops(shopLinks);
})

// crawler shop by platform
router.post('/raw-shops', async (req: Request, resp: Response) => {
    const shopId: string = req.body.shop_id;
    resp.send({
        status: true,
        message: 'Crawling shops...'
    });
    try {
        const shopChozoi = await ChozoiShopModel.findById(shopId);
        console.log('-----------------------------', shopChozoi);

        if (shopChozoi == null) {
            const result: any = await ShopeeShopModel.findById(shopId);
            // [ '$__', 'isNew', 'errors', '$locals', '$op', '_doc', '$init' ]
            let shopDetail = result._doc;
            const newLink: string = `https://shopee.vn/${shopDetail.username}`;
            const phoneNumers = filterPhoneNumbers(shopDetail.description)
            console.log('phone set:', phoneNumers);
            let portrait = '', cover = '';
            if (shopDetail.account.portrait !== '') {
                portrait = `https://cf.shopee.vn/file/${shopDetail.account.portrait}_tn`
            }
            if (shopDetail.cover !== '') {
                cover = `https://cf.shopee.vn/file/${shopDetail.cover}`;
            }

            console.log({
                _id: shopId,
                username: shopDetail.account.username,
                phone_numbers: phoneNumers,
                name: shopDetail.name,
                img_avatar_url: portrait,
                img_cover_url: cover,
                description: shopDetail.description,
                link: newLink,
                state: 'INIT'
            });
            
            ChozoiShopModel.create({
                _id: shopId,
                username: shopDetail.account.username,
                phone_numbers: phoneNumers,
                name: shopDetail.name,
                img_avatar_url: portrait,
                img_cover_url: cover,
                description: shopDetail.description,
                link: newLink,
                state: 'INIT'
            })


        }
        else {
            console.log('');

        }
    }
    catch (e) {
        console.log(shopId, ' can not save:', e);

    }
})




export default router;
