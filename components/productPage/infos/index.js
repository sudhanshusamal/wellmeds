/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { useRouter } from "next/router";
import styles from "./styles.module.scss";
import Rating from "@mui/material/Rating";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TbMinus, TbPlus } from "react-icons/tb";
import { BsHeart } from "react-icons/bs";
import { RiShoppingBagFill } from "react-icons/ri";
import Share from "./share";
import Accordian from "./Accordian";
import SimilarSwiper from "./SimilarSwiper";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, updateCart } from "@/store/cartSlice";
import { toast } from "react-toastify";
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import GridLoaderSpinner from "@/components/loaders/gridLoader";
import DialogModal from "@/components/dialogModal";
import { showDialog } from "@/store/DialogSlice";
import { signIn, useSession } from "next-auth/react";
import Tooltip from '@mui/material/Tooltip';

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
    },
}));

const customIcons = {
    1: {
        icon: <SentimentVeryDissatisfiedIcon color="error" />,
        label: 'Very Dissatisfied',
    },
    2: {
        icon: <SentimentDissatisfiedIcon color="error" />,
        label: 'Dissatisfied',
    },
    3: {
        icon: <SentimentSatisfiedIcon color="warning" />,
        label: 'Neutral',
    },
    4: {
        icon: <SentimentSatisfiedAltIcon color="success" />,
        label: 'Satisfied',
    },
    5: {
        icon: <SentimentVerySatisfiedIcon color="success" />,
        label: 'Very Satisfied',
    },
};

function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}

IconContainer.propTypes = {
    value: PropTypes.number.isRequired,
};

export default function Infos({ product, setActiveImg, related }) {
    const {data: session} = useSession()
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [size, setSize] = useState(router.query.size)
    const [qty, setQty] = useState(1)
    const [error, setError] = useState("")
    const { cart } = useSelector((state) => ({ ...state }));
    console.log(cart)
    // console.log(product.colors)
    useEffect(() => {
        setQty(1)
    }, [router.query.style]);


    const addToCartHandler = async () => {
        setLoading(true);
        const { data } = await axios.get(
            `/api/product/${product._id}?style=${product.style}`
        );
        if (qty > data.quantity) {
            setError(
                "The Quantity you have choosed is more than in stock. Try and lower the Qty"
            );
            toast.error('The Quantity you have choosed is more than in stock. Try and lower the Qty')
        } else if (data.quantity < 1) {
            setError("This Product is out of stock.");
            toast.warning('This Product is out of stock.')
            return;
        } else {
            let _uid = `${data._id}_${product.style}_${router.query.size}`;
            let exist = cart?.cartItems.find((p) => p?._uid === _uid);
            if (exist) {
                let newCart = cart.cartItems.map((p) => {
                    if (p?._uid == exist._uid) {
                        return { ...p, qty: qty };
                    }

                    return p;
                });
                toast.success('Product Added To Cart Successfully')
                dispatch(updateCart(newCart));
            } else {
                dispatch(
                    addToCart({
                        ...data,
                        qty,
                        size: data.size,
                        _uid,
                    })
                );
            }
        }
        setLoading(false);
    };


    const handleWishlist = async () => {
    try {
      if (!session) {
        return signIn();
      }
      const { data } = await axios.put("/api/user/wishlist", {
        product_id: product._id,
        style: product.style,
      });
      dispatch(
        showDialog({
          header: "Product Added to Whishlist Successfully",
          msgs: [
            {
              msg: data.message,
              type: "success",
            },
          ],
        })
      );
    } catch (error) {
      dispatch(
        showDialog({
          header: "Whishlist Error",
          msgs: [
            {
              msg: error.response.data.message,
              type: "error",
            },
          ],
        })
      );
    }
  };
    return (
        <div className={styles.infos}>
        {loading && <GridLoaderSpinner loading={loading} />}
            <DialogModal  />
            <div className={styles.infos__container}>
                <h1 className={styles.infos__name}>{product.name}</h1>
                <h2 className={styles.infos__sku}>{product.sku}</h2>
                <div className={styles.infos__rating}>
                    <StyledRating
                        name="highlight-selected-only"
                        defaultValue={product.rating}
                        IconContainerComponent={IconContainer}
                        getLabelText={(value) => customIcons[value]?.label}
                        readOnly
                    />
                    ({product.numReviews}
                    {product.numReviews == 1 ? " review" : " reviews"})
                </div>
                <div className={styles.infos__price}>
                    <h1>₹{product.price}</h1>
                    {
                        product.discount > 0 ?
                            <h3>
                                <span>₹{product.priceBefore}</span>
                                <span>(-{product.discount}%)</span>
                            </h3> : ''
                    }
                </div>
                <span className={styles.infos__shipping}>
                    {
                        product.shipping ? `₹${product.shipping} delivery` : "Free Delivery"
                    }
                </span>
                <span>
                    {
                        product.quantity == 0 ? <span className={styles.error}>Out of stock</span> : `${product.quantity} items left`
                    }
                    {/* {
                        size ?  : product.sizes.reduce((start, next) => start + next.qty, 0) 
                    } item left */}
                </span>
                {/* <div className={styles.infos__sizes}>
                    <h4>Select a style: </h4>
                    <div className={styles.info__sizes_wrap}>
                        { product.sizes.map((size, i)=> (
                            <Link href={`/product/${product.slug}?style=${router.query.style}`}>
                                <div>{size.size}</div>
                            </Link>
                        ))}
                    </div>
                </div> */}
                <div className={styles.infos__colors}>
                    {
                        product.colors.length > 1 && product.colors.map((color, i) => (
                            <span className={
                                i == router.query.style ? styles.active_color : ''
                            } onMouseOver={() => setActiveImg(product.subProducts[i].images[0].url)} onMouseLeave={() => setActiveImg("")}>
                                <Link href={`/product/${product.slug}?style=${i}`}>
                                    <img src={color.image} alt="" />
                                </Link>
                            </span>
                        ))
                    }
                </div>
                <div className={styles.infos__qty}>
                    <button onClick={() => qty > 1 && setQty((prev) => prev - 1)}>
                        <TbMinus />
                    </button>
                    <span>{qty}</span>
                    <button onClick={() => qty < product.quantity && setQty((prev) => prev + 1)}>
                        <TbPlus />
                    </button>
                </div>
                <div className={styles.infos__actions}>
                    <button disabled={product.quantity < 1} style={{ cursor: `${product.quantity < 1 ? 'not-allowed' : ""}` }} onClick={() => addToCartHandler()}>
                        <RiShoppingBagFill />
                        <b>Add to Cart</b>
                    </button>
                    <button onClick={()=>handleWishlist()}>
                        <BsHeart />
                        Wishlist
                    </button>
                </div>
                {
                    error && <span className={styles.error}>{error}</span>
                }
                <Share />
                <Accordian details={[product.description, ...product.details]} />
                <SimilarSwiper />
            </div>
        </div>
    )
}
