const { required } = require("joi");
const mongoose = require("mongoose");
const Product = require("./Product");
const { type } = require("../controllers/validation/productValidation");

const reviewSchema = new mongoose.Schema({
user: {
    type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    required : true
},

product:{
type :
    mongoose.Schema.Types.ObjectId,
    ref:"Product",
    required:true
},

rate:{
    type:Number,
    required:true,
    min:1,
    max:5
},
comment:{
    type:String,
    required:true
}
},{timestamps:true

})