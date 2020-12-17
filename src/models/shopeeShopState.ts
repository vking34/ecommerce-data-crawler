import { Schema } from "mongoose";
import mongoose from "./index";
import mongoosePaginate from 'mongoose-paginate-v2';


const ShoppeShopState: Schema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: [true , ' Id required!']
        },
        name: String,
        username: String,
        phone: Object,
        link: String,
        state: String,  // INIT, PROCESSING, DONE
        updatable: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
)

ShoppeShopState.index({username: 1});
ShoppeShopState.on('index', e => {
    console.log('index error:', e);
})
ShoppeShopState.plugin(mongoosePaginate);


export default mongoose.model('shopee_shop_state', ShoppeShopState);

