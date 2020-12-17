import { Schema } from "mongoose";
import mongoose from './index';

const ShopeeShopSchema: Schema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: [true, 'Shop ID is required!']
        },
        phone: Object,

    },
    {
        strict: false,  // ! save all passed values, no strict to schema. default: true
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

export default mongoose.model('shopee_shops', ShopeeShopSchema);
