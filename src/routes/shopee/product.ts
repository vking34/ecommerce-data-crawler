import express, { Request, Response, Router } from 'express';
import ChozoiProduct from '../../models/chozoiProduct';


const router: Router = express.Router();

// product list
router.get('/converted-shops/:shopId/products',(req: Request, resp: Response) => {
    console.log('pppppppppp-=-=-=---------------------------------');
    
    const shopId: string = req.params.shopId;
    let filters: any = {}
    console.log(shopId);
    try{
        if(shopId){
            filters.platform = shopId
        }
        let page: number = req.query.page ? parseInt(req.query.page as string) : 1;
        let limit: number = req.query.page ? parseInt(req.query.limit as string) : 10;
        let paginateOpts = {
            page,
            limit
        };
        ChozoiProduct.paginate(filters,paginateOpts)
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
    catch (error){
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
    resp.send({});
})

// product detail
router.get('/converted-shops/:shopId/products/:productId', async (req: Request, resp: Response) => {
    const shopId: string = req.params.shopId;
    const productId: string = req.params.productId;
    console.log(shopId, productId);
    try{
        const product =  await ChozoiProduct.find({ _id: productId, shop_id: shopId})
        resp.send(product);
    }
    catch(e){
    
        resp.send(e);
    }
    
})


// update product
router.put('/converted-shops/:shopId/products/:productId', (req: Request, resp: Response) => {
    const product = req.body.product;
    console.log(product);

    resp.send({});
})

export default router;