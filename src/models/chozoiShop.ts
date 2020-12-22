import { Schema } from "mongoose";
import mongoose from "./index";
import mongoosePaginate from 'mongoose-paginate-v2';

const ChozoiShop:  Schema = new mongoose.Schema(
    {
        _id: {
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
        phone_number:String,
        email: String,
        contact_name: String,
        page_url: String,
        img_avatar_url: String,
        img_description_urls: String,
        img_cover_url: String,
        description: String,
        link: String,
        state: String,

    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
)
ChozoiShop.plugin(mongoosePaginate);

export default mongoose.model('chozoi_shops', ChozoiShop);