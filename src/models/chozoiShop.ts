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
        name: String,
        phone_numbers:{
            type: Array,
            default:[],
        },
        phoneNumber:String,
        email: String,
        contactName: String,
        page_url: String,
        imgAvatarUrl: String,
        img_description_urls: String,
        imgCoverUrl: String,
        description: String,
        

    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
)
ChozoiShop.plugin(mongoosePaginate);

export default mongoose.model('chozoi_shops', ChozoiShop);