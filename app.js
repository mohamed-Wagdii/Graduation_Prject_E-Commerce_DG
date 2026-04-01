require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const cors = require("cors");


const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

const port = process.env.PORT || 3000;
async function dbConection() {
    

    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/MicroElectronics");
            console.log("Database connected successfully");
        
    }catch(error){
        console.log(error);
    }
}

dbConection();

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const categoryRoutes = require("./routes/categoryRoute")
const orderRoutes = require("./routes/ordersRoutes")


app.use("/api", authRoutes);
app.use("/api", productRoutes);
app.use("/api", cartRoutes);
app.use("/api", categoryRoutes);
app.use("/api", orderRoutes);


app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
