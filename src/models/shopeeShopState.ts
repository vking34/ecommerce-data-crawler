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
        updatable: Boolean
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
)

export default mongoose.model('shopee_shop_state', ShoppeShopState);

