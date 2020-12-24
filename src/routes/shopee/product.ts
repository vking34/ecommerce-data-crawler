import express, { Request, Response, Router } from 'express';


const router: Router = express.Router();

// product list
router.get('/converted-shops/:shopId/products', (req: Request, resp: Response) => {
    const shopId: string = req.params.shopId;
    console.log(shopId);
    resp.send({});
})

// product detail
router.get('/converted-shops/:shopId/products/:productId', (req: Request, resp: Response) => {
    const shopId: string = req.params.shopId;
    const productId: string = req.params.productId;
    console.log(shopId, productId);
    resp.send({});
})


// update product
router.put('/converted-shops/:shopId/products/:productId', (req: Request, resp: Response) => {
    const product = req.body.product;
    console.log(product);

    resp.send({});
})