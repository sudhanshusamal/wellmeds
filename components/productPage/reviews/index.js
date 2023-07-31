/* eslint-disable react/jsx-key */
import { Rating } from "@mui/material";
import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import AddReview from "./AddReview";
import Select from "./Select";
import styles from "./styles.module.scss";
import Table from "./Table";
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';

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


export default function Reviews({ product }) {
    const { data: session } = useSession();
    const [rating, setRating] = useState("");
    const [reviews, setReviews] = useState(product.reviews);


    return (
        <div className={styles.reviews}>
            <div className={styles.reviews__container}>
                <h1>Customer Reviews ({product.reviews.length})</h1>
                <div className={styles.reviews__stats}>
                    <div className={styles.reviews__stats_overview}>
                        <span>Average Rating</span>
                        <div className={styles.reviews__stats_overview_rating}>
                            <StyledRating
                                name="highlight-selected-only"
                                defaultValue={product.rating}
                                IconContainerComponent={IconContainer}
                                getLabelText={(value) => customIcons[value]?.label}
                                highlightSelectedOnly
                                readOnly
                            />
                            {product.rating == 0 ? "No review yet." : ""}
                        </div>
                    </div>
                    <div className={styles.reviews__stats_reviews}>
                        {product.ratings.map((rating, i) => (
                            <div className={styles.reviews__stats_reviews_review}>
                            <StyledRating
                                name="highlight-selected-only"
                                defaultValue={5 - i}
                                IconContainerComponent={IconContainer}
                                getLabelText={(value) => customIcons[value]?.label}
                                highlightSelectedOnly
                                readOnly
                            />
                                <div className={styles.bar}>
                                    <div
                                        className={styles.bar__inner}
                                        style={{ width: `${rating.percentage}%` }}
                                    ></div>
                                </div>
                                <span>{rating.percentage}%</span>
                            </div>
                        ))}
                    </div>
                </div>
                {session ? (
                    <AddReview product={product} setReviews={setReviews} />
                ) : (
                    <button onClick={() => signIn()} className={styles.login_btn}>
                        Login to add review
                    </button>
                )}
                <Table
                    reviews={reviews}
                    allSizes={product.allSizes}
                    colors={product.colors}
                />
            </div>
        </div>
    );
}
