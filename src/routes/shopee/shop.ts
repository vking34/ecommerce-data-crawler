import express, { Request, Response, Router } from 'express';
import markAndCrawlShops from '../../tasks/shops/shopMarker';
import ShopStateModel from '../../models/shopState';


const router: Router = express.Router();

router.get('', (req: Request, resp: Response) => {
    let filters: any = {};
    const state = req.query.state;
    try {
        if (state) {
            filters.state = state;
        }

        let page: number = req.query.page ? parseInt(req.query.page as string) : 1;
        let limit: number = req.query.page_size ? parseInt(req.query.page_size as string): 10;
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

router.post('', (req: Request, resp: Response) => {
    const shopLinks: [string] = req.body.shops;
    resp.send({
        status: true,
        message: 'Crawling shops...'
    });

    markAndCrawlShops(shopLinks);
})


export default router;
