
import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    reviewBy: {
        type: ObjectId,
        ref: "User",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    review: {
        type: String,
        required: true,
    },
    size: {
        type: String,
    },
    style: {
        color: String,
        image: String,
    },
    images: [],
    likes: [],
});



const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    brand: {
        type: String,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        index: true
    },
    category: {
        type: ObjectId,
        required: true,
        ref: "Category",
    },
    subCategories: [{
        type: ObjectId,
        ref: "subCategory",
    }],
    details: [{
        name: String,
        value: String,
    }],
    questions: [{
        question: String,
        answer: String,
    }],
    reviews: [reviewSchema],
    refundpolicy: {
        type: String,
        deafult: "No Refund for this product.",
    },
    rating: {
        type: Number,
        required: true,
        default: 0,
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0,
    },
    shipping: {
        type: Number,
        required: true,
        default: 0,
    },

    subProducts: [
        {
            sku: String,
            images: [],
            description_images: [],
            color: {
                color: {
                    type: String,
                },
                image: {
                    type: String,
                },
            },
            sizes: [
                {
                    size: String,
                    qty: Number,
                    price: Number,
                },
            ],
            discount: {
                type: Number,
                default: 0,
            },
            sold: {
                type: Number,
                default: 0,
            },
        },
    ],

},
    {
        timestamps: true,
    }
);

const Product = mongoose.models.Product || mongoose.model("Product", productSchema)
export default Product;