import { Schema } from "mongoose";
import mongoose from "./index";

const ShoppeShopState: Schema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: [true , ' Id required!']
        },
        name: String,
        username: String,
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

export default mongoose.model('shopee_shop_state', ShoppeShopState);

