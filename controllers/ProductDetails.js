const mongoose = require("mongoose")
const Product = require("../models/Product")

const getProductDetailsController= async(req , res)=>{
    try{
        const id = req.params.id

        if(!id){
            return res.status(400).json({msg:"Id is required"})
        }
        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({msg:"Invalid Id Format"})
        }

        const product = await Product.findById(id);

        if(!product){
            return res.status(404).json({msg:"Product not found"})
        }

        res.status(200).json({
         msg: "Product details",
         data: product
        })
    }

    catch(error){
        res.status(500).json({msg:"server error"})
        console.log(error)
    }
}

module.exports = {getProductDetailsController}