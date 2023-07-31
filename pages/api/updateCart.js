import nc from 'next-connect'
import db from '@/utils/db'
import Product from '@/models/Product';

const handler = nc()

handler.put(async (req, res) => {
    try {
        db.connectDb();
        const promises = req.body.products.map(async(p)=> {
            let dbProduct = await Product.findById(p._id).lean();
            let originalPrice = dbProduct.subProducts[p.style].sizes.find((x)=>x.size == p.size).price;
            let quantity = dbProduct.subProducts[p.style].sizes.find((x)=>x.size == p.size).qty;
            let discount = dbProduct.subProducts[p.style].discount;
             return {
                ...p, priceBefore: originalPrice,
                price: discount>0
                ? (originalPrice - originalPrice * discount) / 100 : originalPrice,
                discount: discount,
                quantity: quantity,
                shippingFee: dbProduct.shipping,

             }
        });
        const data = await Promise.all(promises)
        db.disconnectDb();
        return res.json(data)
        console.log(price)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

export default handler;