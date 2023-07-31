import nc from "next-connect";
import Product from "../../../models/Product";
import User from "../../../models/User";
import Cart from "../../../models/Cart";
import db from "../../../utils/db";
import auth from "../../../middleware/auth";
import Coupon from "@/models/Coupon";
const handler = nc()

handler.post(async (req, res) => {
    try {
        db.connectDb();
        const { coupon, startDate, endDate, discount } = req.body;
        const test = await Coupon.findOne({ coupon });
        if(test){
            return res.status(400).json({message: "This Coupon is already exists, try differnt one."});
        }
        await new Coupon({
            coupon, startDate, endDate, discount,
        }).save();

        db.disconnectDb();
        return res.json({
            message: "Coupon created successfully",
            coupons: await Coupon.find({})
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: error.message });
    }
});

export default handler;