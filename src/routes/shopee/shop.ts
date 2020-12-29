import express, { Request, Response, Router } from 'express';
import markAndCrawlShops from '../../tasks/shops/shopMarker';
import ChozoiShopModel from '../../models/chozoiShop';
import ShopeeShopModel from '../../models/shopeeShop'
import convertShopByIds from '../../tasks/shops/rawShopConverterByIds';
import approveShops from '../../tasks/shops/approveShops';
import uploadFile from '../../utils/uploadFile';


const router: Router = express.Router();

// get raw shops
router.get('/raw-shops', (req: Request, resp: Response) => {
    let filters: any = {
        $or: [
            { is_crawled: { $exists: false } },
            { is_crawled: false }
        ]
    };
    if (req.query.phone_numbers === '1') {
        filters['phone_numbers.0'] = { $exists: true }
    }
    else if (req.query.phone_numbers === '0') {
        filters['phone_numbers.0'] = { $exists: false }
    }

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
    const state = req.query.state;
    let filters: any = {};

    if (req.query.phone_numbers === '1') {
        filters['phone_numbers.0'] = { $exists: true }
    }
    else if (req.query.phone_numbers === '0') {
        filters['phone_numbers.0'] = { $exists: false }
    }

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
    let rawShop = [];
    let convertedShop = [];



    if (shopIds?.length > 0) {
        const rawShop = [];
        for (let i = 0; i < shopIds.length; i++) {
            const shop = await ChozoiShopModel.findById(shopIds[i]);

            if (shop === null || shop === undefined || shop.length === 0) {
                rawShop.push(shopIds[i]);
            }
            else {
                convertedShop.push(shop);
            }
        }
        resp.send({
            message: "crawling shops...",
            rawShop: rawShop,
            convertedShop: convertedShop
        });
        convertShopByIds(rawShop);
    }
    else {

        for (let i = 0; i < shopLinks.length; i++) {
            const shopUrl = new URL(shopLinks[i]);
            const shopName = shopUrl.pathname.substring(1);
            const shop = await ChozoiShopModel.findOne({ username: shopName })
          
            if (shop === null || shop === undefined || shop.length === 0) {
                await rawShop.push(shopLinks[i]);
            }
            else {
                convertedShop.push(shop);
            }
        }
        resp.send({
            message: "crawling shops...",
            rawShop: rawShop,
            convertedShop: convertedShop
        })
        markAndCrawlShops(rawShop);
    }
})

// crawl and convert shops by file excel

router.post('/converted-shops-file', async (req: any, resp: Response) => {
    
        resp.send(uploadFile(req));
        
     
})

// update shop model chozoishop
// TODO: test
router.put('/converted-shops/:shopId', async (req: Request, resp: Response) => {
    const shopId = req.params.shopId;
    const data = req.body;
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

// 

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



// approve shops  to chozoi
router.post('/approved-shops', async (req: Request, resp: Response) => {

    console.log('=========================================');

    const shopIds: string[] = req.body.shop_ids;
    let type: number = req.body.type ? parseInt(req.body.type as string) : 1;
    resp.send({
        status: true,
        message: 'Approving shops...'
    });

    approveShops(shopIds, type)

});

export default router;
