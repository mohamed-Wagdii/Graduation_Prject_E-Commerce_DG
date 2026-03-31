const Category = require("../models/Category");
const User = require("../models/User");
const addCategorySchema = require("../controllers/validation/categoryValidation");

const addCategory = async(req , res)=>{
    try{
        if(!req.file) return res.status(400).json({ msg: "Please Add Image" })
     const { error, value } = addCategorySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ msg: error.details[0].message });
    }

        const { name } = req.body

        if(!name) return res.status(400).json({ msg: "Please Add Name" })

            const userId = req.body.id
            const checkAdmin = await User.findById(userId)

            if(!checkAdmin.isAdmin) return res.status(400).json({ msg: "Access Denied" })
            
            const categoryExist = await Category.findOne({ name })

            if(categoryExist) return res.status(400).json({ msg: "Category Is Already Exist" })

                
            const newCategory = new Category({
                name,
                image: req.file.path
            })

            res.status(200).json({
                 msg: "Added Success"
                , data : newCategory
             })
            
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "Server Error"})
    }
}

module.exports = {
    addCategory
}
//