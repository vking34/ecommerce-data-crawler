import { Schema } from "mongoose";
import mongoose from './index';

const ChozoiProductSchema: Schema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: [true, 'Product ID is required!']
        },
        phone_numbers: {
            type: Array,
            default: [],
        },
        name: String,
        attributes:{
            type: Array,
            default: []
        },
        packing_size:{
            type: Array,
            default: []
        },
        images: {
            type: Array,
            default: []
        },
        video: Array,
        description: String,
        description_pickingout: String,
        category: Array,
        shipping_partner_ids: {
            type: Array,
            default: []
        },
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
        weight: String,
        is_pending: {
            type: Boolean,
            default: true
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
    },
    {
    
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
);

export default mongoose.model('chozoi_products', ChozoiProductSchema);
