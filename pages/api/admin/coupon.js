import admin from "@/middleware/admin";
import auth from "@/middleware/auth";
import Coupon from "@/models/Coupon";
import db from "@/utils/db";
import nc from "next-connect"
import slugify from "slugify";

const handler = nc().use(auth).use(admin);

handler.post(async (req, res) => {
    try {
        const { coupon, discount, startDate, endDate } = req.body;
        db.connectDb();
        const test = await Coupon.findOne({ coupon });
        if (test) {
            return res.status(400).json({ message: "Coupon already exist, try a different coupon." })
        }
        await new Coupon({ coupon, discount, startDate, endDate }).save();

        db.disconnectDb();
        res.json({
            message: `${coupon} Category created successfully.`,
            coupons: await Coupon.find({}).sort({updateAt: -1})
        })
    } catch (error) {
        db.disconnectDb()
        res.status(500).json({ message: error.message })
    }
})

handler.delete(async (req, res) => {
    try {
      const { id } = req.query;
      db.connectDb();
      await Coupon.findByIdAndDelete(id);
      db.disconnectDb();
      return res.json({
        message: "Coupon has been deleted successfuly",
        coupons: await Coupon.find({}).sort({ updatedAt: -1 }),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });


  handler.put(async (req, res) => {
    try {
      const { id, coupon, discount, startDate, endDate } = req.body;
      db.connectDb();
      await Coupon.findByIdAndUpdate(id, {
        coupon,
        discount,
        startDate,
        endDate,
      });
      db.disconnectDb();
      return res.json({
        message: "Coupon has been updated successfuly",
        coupons: await Coupon.find({}).sort({ createdAt: -1 }),
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

export default handler;