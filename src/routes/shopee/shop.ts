import express, { Request, Response, Router } from 'express';
import markAndCrawlShops from '../../tasks/shops/shopMarker';
import ShopeeShopModel from '../../models/shopeeShop';
const router: Router = express.Router();

router.post('', (req: Request, resp: Response) => {
    const shopLinks: [string] = req.body.shops;
    resp.send({
        status: true,
        message: 'Crawling shops...'
    });

    markAndCrawlShops(shopLinks);
})

// router.get('', (req: Request, resp: Response) => {

// });
router.get('/get/page:page&limit:limit',(req: Request , resp: Response ) => {

    const tmpPage: string = req.params.page;
    const options = {
        page: tmpPage,
        limit: 20,
      };
      
      ShopeeShopModel.paginate({}, options, function (err, result) {
        // result.docs
        result.totalDocs = 100
        // result.limit = 10
        // result.page = 1
        result.totalPages = 10
        // result.hasNextPage = true
        // result.nextPage = 2
        // result.hasPrevPage = false
        // result.prevPage = null
        // result.pagingCounter = 1
      });


} )



export default router;
