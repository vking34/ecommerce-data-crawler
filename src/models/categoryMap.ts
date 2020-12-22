import { Schema } from "mongoose";
import mongoose from './index';


const CategoriesMapModel: Schema = new mongoose.Schema(

    {
        _id: {
            type: String,
            required: [true, 'Id required!']
        },

        cz_category_id: String,
        cz_category_level: String
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }
)

export default mongoose.model('shopee_category_mappers', CategoriesMapModel);
