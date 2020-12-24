import express, { Request, Response, Router } from 'express';
import ChozoiProduct from '../../models/chozoiProduct';


const router: Router = express.Router();

// product list
router.get('/converted-shops/:shopId/products',(req: Request, resp: Response) => {
   
    const shopId: string = req.params.shopId;
    let filters: any = {}
   
    try{
        if(shopId){
            filters.shop_id = shopId
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

})

// product detail
router.get('/converted-shops/:shopId/products/:productId', async (req: Request, resp: Response) => {
    const shopId: string = req.params.shopId;
    const productId: string = req.params.productId;

    try{

        const product =  await ChozoiProduct.find({ _id: productId, shop_id: shopId})
        resp.send(product);
    }
    catch(e){
    
        resp.status(500).send({
            error_message: e
        });
    }

    
})


// update product
router.put('/converted-shops/:shopId/products/:productId', async (req: Request, resp: Response) => {
    const productId = req.params.productId;
    const shopId = req.params.shopId
    const data = req.body.data
    let filters = {
        _id: productId,
        shop_id: shopId
    }
    console.log(filters);
    
    try{
       const product = await ChozoiProduct.findOneAndUpdate(filters,data);

       if(product){
        resp.send({
            status: true,
            message: "Update Successfully!"
        })
       }
       else {
        resp.status(400).send({
            error_message: "Update failed"
        });
       }
    }
    catch(e){
        resp.send({
            status: false,
            err: e
        })
    }
    
})

export default router;