import express, { Request, Response, Router } from 'express';
import markAndCrawlShops from '../../tasks/shops/shopMarker';
import ShopStateModel from '../../models/shopeeShopState';


const router: Router = express.Router();

router.get('', async (req: Request, resp: Response) => {
    console.log('get shop states');
    
    const state = req.query.state;
    let filters: any = {};
    if(state) {
        filters.state = state;
    }
    try {
        const shops = await ShopStateModel.find(filters);
        filters.size = shops.length;
        resp.send({
            data: shops,
            filters
        });
    }
    catch (e) {
        resp.send({
            data: [],
            filters
        });
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
