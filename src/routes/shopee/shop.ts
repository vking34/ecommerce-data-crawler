import express, { Request, Response, Router } from 'express';
// import axios from 'axios';
// import ProductIdsModel from '../../models/shopeeProductId';
// import ProductModel from '../../models/shopeeProduct';
const router: Router = express.Router()


const markShops = (shopLinks: [string]) => {
        console.log(shopLinks);
        
} 

router.post('', (req: Request, resp: Response) => {
        const shopLinks: [string] = req.body.shops;
        resp.send({
                status: true,
                message: 'Crawling shops...'
        });
        
        markShops(shopLinks);
})



export default router;

