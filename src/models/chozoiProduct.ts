import { Schema } from "mongoose";
import mongoose from './index';
import mongoosePaginate from 'mongoose-paginate-v2';

const ChozoiProductSchema: Schema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: [true, 'Product ID is required!']
        },
        product_id: String,
        shop_id: String,
        name: String,
        // attributes: {
        //     type: Array,
        //     default: []
        // },
        packing_size:{
            type: Array,
            default: [10, 10, 10]
        },
        images: {
            type: Array,
            default: []
        },
        description: {
            type: String,
            default: ''
        },
        category: Object,
        // shipping_partner_ids: {
        //     type: Array,
        //     default: []
        // },
        type: { 
            type: String,
            default: 'NORMAL'
        },
        condition: {
            type: String,
            default: 'NEW'
        },
        is_quantity_limited: {
            type: Boolean,
            default: true
        },
        weight: {
            type: Number,
            default: 1
        },
        auto_public: {
            type: Boolean,
            default: true
        },
        variants: {
            type: Array,
            default: []
        },
        free_ship_status: {
            type: Boolean,
            default: false
        },
        platform: {
            type: String,
            required: [true, 'Platform required!']
        },
        shipping_partner_code: {
            type: String,
            default: "SELLER_EXPRESS"
        },
        state: {
            type: String,
            default: 'DRAFT'
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

ChozoiProductSchema.plugin(mongoosePaginate);
export default mongoose.model('chozoi_products', ChozoiProductSchema);
