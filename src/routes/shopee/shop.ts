import express, { Request, Response, Router } from 'express';
import markAndCrawlShops from '../../tasks/shops/shopMarker';
import ShopStateModel from '../../models/shopState';
import ChozoiShopModel from '../../models/chozoiShop';
import ShopeeShopModel from '../../models/shopeeShop'
import axios from 'axios';
// import { markProduct } from '../../utils/shopee';
const router: Router = express.Router();

// get raw shops
router.get('/raw', (req: Request, resp: Response) => {
    let filters: any = {};
    try {
        let page: number = req.query.page ? parseInt(req.query.page as string) : 1;
        let limit: number = req.query.page_size ? parseInt(req.query.page_size as string) : 10;
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
router.get('/convertations', (req: Request, resp: Response) => {
    let filters: any = {};
    const state = req.query.state;
    try {
        if (state) {
            filters.state = state;
        }

        let page: number = req.query.page ? parseInt(req.query.page as string) : 1;
        let limit: number = req.query.page_size ? parseInt(req.query.page_size as string) : 10;
        let paginateOpts = {
            page,
            limit
        };

        ShopStateModel.paginate(filters, paginateOpts)
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
        let shop = await ChozoiShopModel.findById({ _id: shopId })
        const data = {
            username: shop.username,
            phoneNumber: shop.phoneNumber,
            contactName: shop.contactName,
            email: shop.email,
            name: shop.name,
            imgAvatarUrl: shop.imgAvatarUrl,
            imgCoverUrl: shop.imgCoverUrl,
            description: shop.description
        }
        await axios({
            method: 'post',
            url: 'https://api.chozoi.com/v1/auth/create_account',
            data: data
        })
            .then(function (response) {

                resp.send({
                    status: true,
                    response: response
                })
            })
            .catch(function (error) {

                resp.send({
                    status: false,
                    error: error
                });
            });
    }
    catch (e) {
        console.log(e);
    }
});
// update shop model chozoishop
router.post('/update', async (req: Request, resp: Response) => {
    const shopId = req.body.shopId;
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

router.get('/detaishop:shopId', async (req: Request, resp: Response) => {
    const shopId = req.params.shopId;
    try {
        const shop = await ChozoiShopModel.find({ _id: shopId })
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

// approve shop, product to chozoi






export default router;
