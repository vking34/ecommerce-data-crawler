// import axios from "axios";
// import ProductModel from '../models/product';


// const SHOPEE_API = process.env.SHOPEE_API;
// export default (shopId: string, productId: string) => {
//     return new Promise(async (resolve, reject) => {
//         const productUrl = `${SHOPEE_API}/item/get?itemid=${productId}&shopid=${shopId}`;
//         const productInfo = (await axios.get(productUrl)).data.item;
//         console.log(productInfo);

//         let product = {
//             _id: productId,
//             description: productInfo.description
//         }
//         ProductModel.


//     });
// }