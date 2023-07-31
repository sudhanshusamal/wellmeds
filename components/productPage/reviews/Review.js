/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
import { Rating } from '@mui/material';
import styles from './styles.module.scss'
import { BiLike, BiSolidLike } from 'react-icons/bi';
import { useState } from 'react';
import { AiFillLike, AiOutlineLike } from 'react-icons/ai';

export default function Review({ review }) {
    const { name, image } = review.reviewBy;
    const [liked, setLiked] = useState(false)
    return (
        <div className={styles.review}>
            <div className={styles.flex}>
                <div className={styles.review__user}>
                    <h4>
                        {name}
                    </h4>
                    <img src={image} alt='' />
                </div>
                <div className={styles.review__review}>
                    <Rating
                        name='half-rating-read'
                        value={review.rating}
                        readOnly
                        style={{ color: "#F29727" }}
                    />
                    <p>{review.review}</p>
                    <p>
                        {/* <div className={styles.flex}>
                            <img className={styles.review__img} src={review?.style?.image} alt="" />
                        </div> */}
                    </p>
                </div>
            </div>
            <div className={styles.flex}>
                <div className={styles.review__images}>
                    {
                        review.images.length > 0 &&
                        review.images.map((img) => <img src={img?.url} alt='' />)
                    }
                </div>
                <div className={styles.review__extra}>
                    <div className={styles.review__extra_likes}>
                        {review.likes && review.likes?.likes}
                        {liked ?   <AiFillLike onClick={()=>setLiked((prev)=>!prev)}  /> : <AiOutlineLike onClick={()=>setLiked((prev)=>!prev)} /> }
                    </div>
                    
                </div>
            </div>
        </div>
    )
}
