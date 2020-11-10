import express, { Request, Response, Router } from 'express';


const router: Router = express.Router();

router.post('', (req: Request, resp: Response) => {
    const product: string = req.body.product;

    console.log(product);

    let linkParts = product.split('.');
    const shopId = linkParts[2];
    const productId = linkParts[3];
    console.log('shop id:', shopId);
    console.log('product id:', productId);

    resp.send({
        status: true
    });
});


export default router;
