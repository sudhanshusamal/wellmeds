import nc from 'next-connect'
import db from '@/utils/db'
import Product from '@/models/Product';

const handler = nc()

handler.get(async (req, res) => {
    try {
        db.connectDb();
        const id = req.query.id;
        const style = req.query.style || 0;
        const size = req.query.size || 0;
        const product = await Product.findById(id).lean();
        let discount = product.subProducts[style].discount;
        let priceBefore = product.subProducts[style].sizes[size].price;
        let price = discount ? (priceBefore -
            (priceBefore * discount) / 100).toFixed(2) : priceBefore;
        db.disconnectDb();
        return res.json({
            _id: product._id,
            sku: product.subProducts[style].sku,
            style: Number(style),
            name: product.name,
            description: product.description,
            slug: product.slug,
            brand: product.brand,
            category: product.category,
            subCategories: product.subCategories,
            shipping: product.shipping,
            images: product.subProducts[style].images,
            color: product.subProducts[style].color,
            price,
            priceBefore,
            quantity: product.subProducts[style].sizes[size].qty,
        })
        console.log(price)
    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
})

export default handler;