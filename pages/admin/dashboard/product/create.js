/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
import Layout from '@/components/admin/layout'
import DialogModal from '@/components/dialogModal';
import AdminInput from '@/components/input/adminInput';
import MultipleSelect from '@/components/selects/MultipleSelect';
import SingularSelect from '@/components/selects/SingularSelect';
import Category from '@/models/Category';
import Product from '@/models/Product';
import styles from '@/styles/products.module.scss'
import db from '@/utils/db';
import axios from 'axios';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { showDialog } from '@/store/DialogSlice';
import * as Yup from 'yup';
import Images from '@/components/admin/createProduct/images';
import Colors from '@/components/admin/createProduct/colors';
import Style from '@/components/admin/createProduct/style';
import Sizes from '@/components/admin/createProduct/clickToAdd/Sizes';
import Details from '@/components/admin/createProduct/clickToAdd/Details';
import Questions from '@/components/admin/createProduct/clickToAdd/Questions';
import { validateCreateProduct } from '@/utils/validation';
import dataURItoBlob from '@/utils/dataURItoBlob';
import { uploadImages } from '@/requests/upload';
import { toast } from 'react-toastify';
import GridLoaderSpinner from '@/components/loaders/gridLoader';

const initialState = {
    name: "",
    description: "",
    brand: "",
    sku: "",
    discount: 0,
    images: [],
    description_images: [],
    parent: "",
    category: "",
    subCategories: [],
    color: {
        color: "",
        image: "",
    },
    sizes: [
        {
            size: "",
            qty: "",
            price: "",
        },
    ],
    details: [
        {
            name: "",
            value: "",
        },
    ],
    questions: [
        {
            question: "",
            answer: "",
        },
    ],
    shippingFee: "",
};

export default function create({ parents, categories }) {
    const [product, setProduct] = useState(initialState);
    const [subs, setSubs] = useState([]);
    const [colorImage, setColorImage] = useState("");
    const [images, setImages] = useState([]);
    const [description_images, setDescription_images] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch()
    // console.log(product);
    useEffect(() => {
        const getParentData = async () => {
            const { data } = await axios.get(`/api/product/${product.parent}`);
            console.log(data);
            if (data) {
                setProduct({
                    ...product,
                    name: data.name,
                    description: data.description,
                    brand: data.brand,
                    category: data.category,
                    subCategories: data.subCategories,
                    questions: [],
                    details: [],
                });
            }
        };
        getParentData();
    }, [product.parent]);
    useEffect(() => {
        async function getSubs() {
            const { data } = await axios.get("/api/admin/subcategory", {
                params: {
                    category: product.category,
                },
            });
            console.log(data);
            setSubs(data);
        }
        getSubs();
    }, [product.category]);
    const handleChange = (e) => {
        const { value, name } = e.target;
        setProduct({ ...product, [name]: value });
    };

    const validate = Yup.object({
        name: Yup.string().required("*please add a name").min(10, '*product name must be between 10-300 characters').max(300, '*product name must be between 10-300 characters'),
        brand: Yup.string().required("*please add a brand name"),
        category: Yup.string().required("*please select a category"),
        // subCategories: Yup.array().min(1, "*please select atleast one sub-category"),
        sku: Yup.string().required("*please add a  sku/number"),
        color: Yup.string(),
        description: Yup.string().required("*please add a  description"),

    });

    const createProduct = async () => {
        let test = validateCreateProduct(product, images)
        if (test === "valid") {
            createProductHandler();

        } else {
            dispatch(
                showDialog({
                    header: 'Please follow instructions.',
                    msgs: test,
                })
            )
        }
    };

    var uploaded_images = [];
    var style_img = "";

    const createProductHandler = async () => {
        setLoading(true);
        if (images) {
            let temp = images.map((img) => {
                return dataURItoBlob(img);
            });
            const path = "product images";
            let formData = new FormData();
            formData.append("path", path);
            temp.forEach((image) => {
                formData.append("file", image);
            });
            uploaded_images = await uploadImages(formData);
        }
        if (product.color.image) {
            let temp = dataURItoBlob(product.color.image)
            let path = "product style images"
            let formData = new FormData();
            formData.append("path", path)
            formData.append("file", temp);
            let cloudinary_style_img = await uploadImages(formData)
            style_img = cloudinary_style_img[0].url;

        }
        try {
            const { data } = await axios.post('/api/admin/product', {
                ...product,
                images: uploaded_images,
                color: {
                    image: style_img,
                    color: product.color.color,
                }
            });
            setLoading(false);
            toast.success(data.message);
        } catch (error) {
            setLoading(false)
            toast.error(error.response.data.message);
            console.log(error.response.data.message);
        }
    };


    return (
        <Layout>
            {loading && <GridLoaderSpinner loading={loading} />}
            <div className={styles.header}>Create Product</div>

            <Formik
                enableReinitialize
                initialValues={{
                    name: product.name,
                    brand: product.brand,
                    description: product.description,
                    category: product.category,
                    subCategories: product.subCategories,
                    parent: product.parent,
                    sku: product.sku,
                    discount: product.discount,
                    color: product.color.color,
                    imageInputFile: "",
                    styleInput: ""
                }}
                validationSchema={validate}
                onSubmit={() => {
                    createProduct()
                }}
            >
                {
                    (formik) => (
                        <Form>
                            <Images name="imageInputFile" header="Product Corousel Images" text="Add Images" images={images} setImages={setImages} setColorImages={setColorImage} />
                            <div className={styles.flex}>
                                {
                                    product.color.image && (<img src={product.color.image} className={styles.image_span} alt='' />)
                                }
                                {
                                    product.color.color && <span className={styles.color_span} style={{ background: `${product.color.color}` }}>

                                    </span>
                                }
                            </div>
                            <Colors name="color" product={product} setProduct={setProduct} colorImage={colorImage} />
                            <Style name="styleInput" product={product} setProduct={setProduct} colorImage={colorImage} />
                            <SingularSelect
                                name="parent"
                                value={product.parent}
                                placeholder="Parent product"
                                data={parents}
                                header="Add to an existing product"
                                handleChange={handleChange}
                            />
                            <SingularSelect
                                name="category"
                                value={product.category}
                                placeholder="Select a Category"
                                data={categories}
                                header="Select a Category"
                                handleChange={handleChange}
                                disabled={product.parent}
                            />
                            {product.category && (
                                <MultipleSelect
                                    value={product.subCategories}
                                    data={subs}
                                    header="Select SubCategories"
                                    name="subCategories"
                                    disabled={product.parent}
                                    handleChange={handleChange}
                                />
                            )}
                            <div className={styles.header}>
                                Basic Infos
                            </div>
                            <AdminInput
                                type="text"
                                label="Name"
                                name="name"
                                placeholder="Product Name"
                                onChange={handleChange}
                            />
                            <AdminInput
                                type="text"
                                label="Description"
                                name="description"
                                placeholder="Product Description"
                                onChange={handleChange}
                            />
                            <AdminInput
                                type="text"
                                label="Brand"
                                name="brand"
                                placeholder="Product Brand"
                                onChange={handleChange}
                            />
                            <AdminInput
                                type="text"
                                label="Sku"
                                name="sku"
                                placeholder="Product sku/number"
                                onChange={handleChange}
                            />
                            <AdminInput
                                type="text"
                                label="Discount"
                                name="discount"
                                placeholder="Product Discount"
                                onChange={handleChange}
                            />
                            <Sizes sizes={product.sizes} product={product} setProduct={setProduct} />
                            {/* <Images name="imageDescInputFile" header="Product Description Images" text="Add Images" images={description_images} setImages={setDescription_images} setColorImage={setColorImage} /> */}
                            <Details details={product.details} product={product} setProduct={setProduct} />
                            <Questions questions={product.questions} product={product} setProduct={setProduct} />
                            <button type='submit' className={`${styles.btn} ${styles.btn__primary} ${styles.submit_btn}`}>CREATE PRODUCT</button>
                        </Form>
                    )
                }
            </Formik>
        </Layout>
    )
}


export async function getServerSideProps(ctx) {
    db.connectDb();
    const results = await Product.find().select("name subProducts").lean();
    const categories = await Category.find().lean();

    db.disconnectDb();
    return {
        props: {
            parents: JSON.parse(JSON.stringify(results)),
            categories: JSON.parse(JSON.stringify(categories)),
        }
    }
}