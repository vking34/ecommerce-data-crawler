import express, { Request, Response, Router } from 'express';
import markAndCrawlShops from '../../tasks/shops/shopMarker';
import ShopStateModel from '../../models/shopState';
import ChozoiShopModel from '../../models/chozoiShop';
import axios from 'axios';

const router: Router = express.Router();

router.get('', (req: Request, resp: Response) => {
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

router.post('/approve', async (req: Request, resp: Response) => {
    const shopId = req.body.shop;
    try{
        const shop = await ChozoiShopModel.find({ _id: shopId })
    await axios({
        method: 'post',
        url: '',
        data: shop
    })
        .then(function (response) {
            resp.send(response)
        })
        .catch(function (error) {
            resp.send(error);
        });
    }
    catch(e){
        console.log(e);
    }
});

router.post('/update', async (req: Request, resp: Response) => {
    const shopId = req.body.shopId;
    const data = req.body.data;
    let filter = {
        _id: shopId
    }
    const shop = await ChozoiShopModel.findOneAndUpdate(filter, data);
    resp.send({
        message: "Update Successfully!",
        data: shop
    })
});

router.get('/detaishop:shopId', async (req: Request ,resp: Response) =>{
    const shopId = req.params.shopId;
    try{
        const shop = await ChozoiShopModel.find({ _id: shopId })
            resp.send(shop)

    }
    catch (e){
        resp.send(e);
    }

});



router.post('', (req: Request, resp: Response) => {
    const shopLinks: [string] = req.body.shops;
    resp.send({
        status: true,
        message: 'Crawling shops...'
    });

    markAndCrawlShops(shopLinks);
})


export default router;
