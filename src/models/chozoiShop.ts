import { Schema } from "mongoose";
import mongoose from "./index";
import mongoosePaginate from 'mongoose-paginate-v2';

const ChozoiShop:  Schema = new mongoose.Schema(
    {
        _id: {
            // SHOPEE.234213
            type: String,
            required: [true, 'Id required!']
        },
        username: String,
        password: {
            type: String,
            default: 'chozoi123'
        },
        name: String,
        phone_numbers:{
            type: Array,
            default:[],
        },
        updatable: {
            type: Boolean,
            default: true
        },
        phone_number: {
            type: String,
            default: null
        },
        email: {
            type: String,
            default: null
        },
        contact_name: {
            type: String,
            default: null
        },
        page_url: String,
        img_avatar_url: String,
        img_description_urls: String,
        img_cover_url: String,
        description: String,
        link: String,
        state: String,
        cz_shop_id: String,
        total_products: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
)

ChozoiShop.plugin(mongoosePaginate);

export default mongoose.model('chozoi_shops', ChozoiShop);