import express, { Request, Response, Router } from 'express';
import markAndCrawlShops from '../../tasks/shops/shopMarker';
import ChozoiShopModel from '../../models/chozoiShop';
import ShopeeShopModel from '../../models/shopeeShop'
import convertShopByIds from '../../tasks/shops/rawShopConverterByIds';
import approveShops from '../../tasks/shops/approveShops';


const router: Router = express.Router();

// get raw shops
router.get('/raw-shops', (req: Request, resp: Response) => {
    let filters: any = {
        $or: [
            { is_crawled: { $exists: false } },
            { is_crawled: false }
        ]
    };
    try {
        let page: number = req.query.page ? parseInt(req.query.page as string) : 1;
        let limit: number = req.query.limit ? parseInt(req.query.limit as string) : 10;
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


router.get('/raw-shops/:shopId', async (req: Request, resp: Response) => {
    const shopId: string = req.params.shopId;
    
    try {
        const shop = await ShopeeShopModel.findById(shopId);
        resp.send(shop);
    }
    catch (e) {
        resp.status(500).send({
            error_message: e
        });
    }
})

// crawler shop by shop link
// router.post('/raw-shops', (req: Request, resp: Response) => {
//     const shopLinks: [string] = req.body.shops;
//     resp.send({
//         status: true,
//         message: 'Crawling shops...'
//     });

//     markAndCrawlShops(shopLinks);
// })


//get convertations shop
router.get('/converted-shops', (req: Request, resp: Response) => {
    let filters: any = {};
    const state = req.query.state;
    try {
        if (state) {
            filters.state = state;
        }

        let page: number = req.query.page ? parseInt(req.query.page as string) : 1;
        let limit: number = req.query.limit ? parseInt(req.query.limit as string) : 10;
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

// crawl and convert shops by ids 
router.post('/converted-shops', async (req: Request, resp: Response) => {
    const shopIds: string[] = req.body.shop_ids;
    const shopLinks: string[] = req.body.shop_links;

    resp.send({
        status: true,
        message: 'Crawling shops...'
    });

    if (shopIds?.length > 0) {
        convertShopByIds(shopIds);
    }
    else {
        markAndCrawlShops(shopLinks);
    }
})

// update shop model chozoishop
// TODO: test
router.put('/converted-shops/:shopId', async (req: Request, resp: Response) => {
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

// get shop detail
router.get('/converted-shops/:shopId', async (req: Request, resp: Response) => {
    const shopId = req.params.shopId;

    try {
        const shop = await ChozoiShopModel.findById(shopId)
        resp.send(shop)
    }
    catch (e) {
        resp.status(500).send({
            error_message: e
        });
    }
});


// approve shops to chozoi
router.post('/approved-shops', async (req: Request, resp: Response) => {
    const shopIds: string[] = req.body.shop_ids;

    resp.send({
        status: true,
        message: 'Approving shops...'
    });

    approveShops(shopIds);
});

export default router;
