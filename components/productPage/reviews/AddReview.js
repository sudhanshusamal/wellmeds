/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import Select from './Select'
import styles from './styles.module.scss'
import { BsArrowDownCircle, BsArrowRightCircle } from 'react-icons/bs';
import { Rating } from '@mui/material';
import Images from './Images';
import { useDispatch } from 'react-redux';
import { hideDialog, showDialog } from '@/store/DialogSlice';
import DialogModal from '@/components/dialogModal';
import dataURItoBlob from '@/utils/dataURItoBlob';
import { uploadImages } from '@/requests/upload';
import axios from 'axios';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
import GridLoaderSpinner from '@/components/loaders/gridLoader';
import { ClipLoader } from "react-spinners";

const customStyles = {
    '& .MuiRating-iconEmpty .MuiSvgIcon-root, & .MuiRating-iconFilled .MuiSvgIcon-root': {

        fontSize: '45px', // Adjust the font size here to change the icon size
    },
};

const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
        color: theme.palette.action.disabled,
        fontSize: '45px',
    },
    ...customStyles,
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


export default function AddReview({ product, setReviews }) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(hideDialog())
    }, [])
    const [loading, setLoading] = useState(false);
    const [review, setReview] = useState("");
    const [rating, setRating] = useState();
    const [images, setImages] = useState([]);
    let uploaded_images = [];

    const handleSubmit = async () => {
        setLoading(true);
        let msgs = [];

        if (!review) {
            msgs.push({
                msg: "You Forgot to Write a Review!",
                type: "error",
            });
        }
        if (!rating) {
            msgs.push({
                msg: "You Forgot to give Rating!",
                type: "error",
            });
        }
        if (msgs.length > 0) {
            dispatch(
                showDialog({
                    header: "Adding review error !",
                    msgs,
                })
            );
        } else {
            if (images.length > 0) {
                let temp = images.map((img) => {
                    return dataURItoBlob(img);
                });
                const path = "reviews images";
                let formData = new FormData();
                formData.append("path", path);
                temp.forEach((img) => {
                    formData.append("file", img);
                });
                uploaded_images = await uploadImages(formData);
            }
            const { data } = await axios.put(`/api/product/${product._id}/review`, {
                rating, review, images: uploaded_images
            });
            setReviews(data.reviews)
            setImages([])
            setRating(0)
            setReview("")
        }
        setLoading(false);
    }
    return (
        <div className={styles.reviews__add}>
            {/* {loading && <GridLoaderSpinner loading={loading} />} */}
            <DialogModal />
            <div className={styles.reviews__add_wrap}>
                {/* <div className="flex" style={{ gap: "10px" }}>
                    <Select
                        property={size}
                        text="Size"
                        data={product.allSizes.filter((x) => x.size !== size)}
                        handleChange={setSize}
                    />
                    <Select
                        property={style}
                        text="Style"
                        data={product.colors.filter((x) => x !== style)}
                        handleChange={setStyle}
                    />
                    <Select
                        property={fit}
                        text="How does it fit"
                        data={fits.filter((x) => x !== fit)}
                        handleChange={setFit}
                    />
                </div> */}
                <h2>Write a customer review <BsArrowDownCircle style={{ paddingTop: "5px" }} /></h2>
                <Images images={images} setImages={setImages} />
                <textarea name='review' value={review} onChange={(e) => setReview(e.target.value)} placeholder='Write your review...' ></textarea>
                <StyledRating
                    name="highlight-selected-only"
                    defaultValue={0}
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    IconContainerComponent={IconContainer}
                    getLabelText={(value) => customIcons[value].label}
                    highlightSelectedOnly
                />
                <button className={`${styles.login_btn} ${loading ? styles.disabled : ""}`}
                    onClick={() => handleSubmit()}
                    disabled={loading}>Submit Review {" "}  {loading && <ClipLoader loading={loading} color="#fff" />}</button>
            </div>
        </div>
    )
}
