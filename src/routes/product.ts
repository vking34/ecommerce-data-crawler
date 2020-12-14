import express, { Request, Response, Router } from 'express';
import axios from "axios";
import ProductModel from '../models/product';
import ShopeeProductModel from '../models/shopeeProduct';
import { PRODUCT_NOT_FOUND } from '../constants/response';
import { SHOPEE_API } from '../constants/api';

const router: Router = express.Router();

router.post('', async (req: Request, resp: Response) => {
    const productLink: string = req.body.product;
    let linkParts = productLink.split('.');
    const shopId = linkParts[2];
    const productId = linkParts[3];

    const product = await ProductModel.findById(productId);
    if (product) {
        resp.send(product);
        return;
    }

    ProductModel.findById(productId, async (_e, product: any) => {
        if (_e) {
            resp.status(500).send({ error: _e });
            return;
        }

        if (!product) {
            const productUrl = `${SHOPEE_API}/v2/item/get?itemid=${productId}&shopid=${shopId}`;
            console.log(productUrl);

            axios.get(productUrl)
                .then((productResponse) => {
                    const productInfo = productResponse.data.item;

                    product = {
                        _id: productId,
                        shop_id: shopId,
                        name: productInfo.name,
                        description: productInfo.description,
                    }

                    ProductModel.create(product).catch((_e) => { });
                    resp.send(product);
                })
                .catch((error) => {
                    resp.send({
                        status: false,
                        message: 'Can not get product',
                        error
                    })
                })
        }
        else {
            resp.send(product);
        }
    })
});


router.get('/:productId', (req: Request, resp: Response) => {
    const productId: string = req.params.productId;
    ProductModel.findById(productId, (_e, product) => {
        if (!product) {
            resp.send(PRODUCT_NOT_FOUND);
            return;
        }

        resp.send(product);
    })
});


router.get('/shopee/:productId', async (req: Request, resp: Response) => {
    const productId: string = req.params.productId;
    const product = await ShopeeProductModel.findById(productId);
    if (!product) {
        resp.status(400).send(PRODUCT_NOT_FOUND);
        return;
    }

    resp.send({
        status: true,
        product
    });
})


router.post('/aaa', (req: Request, resp: Response) => {
    const productId: string = req.body.productId;
   
        resp.send(productId);
 
});

export default router;
