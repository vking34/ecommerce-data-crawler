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
        phone_number:{
            type: Array,
            default:[],
        } ,
        name: String,
        email: {
            type: String,
            default: '',
        },  
        contact_name: {
            type: String,
            default:''
        },
        page_url: {
            type: String,
            default:''
        },
        img_avatar_url: {
            type: String,
        
        },
        img_description_urls: {
            type: String,
            default:''
        },
        img_cover_url: {
            type: String,
        },
        description: String,
        

    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
)
ChozoiShop.plugin(mongoosePaginate);

export default mongoose.model('chozoi_shops', ChozoiShop);