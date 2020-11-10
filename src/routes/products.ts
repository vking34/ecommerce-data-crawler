import express, { Request, Response, Router } from 'express';
import axios from "axios";
import ProductModel from '../models/product';
import { PRODUCT_NOT_FOUND } from '../constants/response';

const router: Router = express.Router();
const SHOPEE_API = process.env.SHOPEE_API;

router.post('', async (req: Request, resp: Response) => {
    const productLink: string = req.body.product;
    let linkParts = productLink.split('.');
    const shopId = linkParts[2];
    const productId = linkParts[3];

    ProductModel.findById(productId, async (_e, product: any) => {
        if (_e) {
            resp.status(500).send({ error: _e });
            return;
        }

        if (!product) {
            const productUrl = `${SHOPEE_API}/item/get?itemid=${productId}&shopid=${shopId}`;
            axios.get(productUrl)
                .then((productResponse) => {
                    const productInfo = productResponse.data.item;

                    product = {
                        _id: productId,
                        description: productInfo.description
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


export default router;
