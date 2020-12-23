import { Schema } from "mongoose";
import mongoose from './index';
import mongoosePaginate from 'mongoose-paginate-v2';
const ShopeeShopSchema: Schema = new mongoose.Schema(
    {
        _id: {
            // SHOPEE.234213
            type: String,
            required: [true, 'Shop ID is required!']
        },
        phone_numbers: {
            type: Array,
            default: []
        }
    },
    {
        strict: false,  // ! save all passed values, no strict to schema. default: true
        // strictQuery: false,
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);


ShopeeShopSchema.plugin(mongoosePaginate);
export default mongoose.model('shopee_shops', ShopeeShopSchema);
