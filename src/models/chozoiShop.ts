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
        phoneNumber: {
            type: String,
            default: '',
        },
        email: {
            type: String,
            default: '',
        },  
        contactName: {
            type: String,
            default:''
        },
        page_url: {
            type: String,
            default:''
        },
        imgAvatarUrl: {
            type: String,
            default: ''
        },
        img_description_urls: {
            type: String,
            default:''
        },
        imgCoverUrl: {
            type: String,
            default: ''
        },
        description: String,
        

    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
)
ChozoiShop.plugin(mongoosePaginate);

export default mongoose.model('chozoi_shops', ChozoiShop);