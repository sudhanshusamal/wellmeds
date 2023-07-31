/* eslint-disable react/jsx-key */
import { Tooltip } from '@mui/material'
import styles from './styles.module.scss'
import { AiTwotoneStar } from 'react-icons/ai'
import { useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import Link from 'next/link'
import { BsCheckLg } from 'react-icons/bs'
import { useRouter } from 'next/router'

export default function HeadingFilter({ ratingHandler, sortHandler, shippingHandler, replaceQuery, priceHandler, multiPriceHandler }) {
    const [show, setShow] = useState(false)
    const router = useRouter();
    const check = replaceQuery("shipping", router.query.shipping == "0" ? false : "0")
    const ratingCheck = replaceQuery("rating", "4");
    const sortQuery = router.query.sort || ""
    return (
        <div className={styles.filters}>
            <div className={styles.filters__price}>
                <span>Price :</span>
                <input type="number" placeholder="min" value={router.query.price?.split("_")[0] || ""} min="0" onChange={(e) => priceHandler(e.target.value, "min")} />
                <input type="number" placeholder="max" min="0" value={router.query.price?.split("_")[1] || ""} onChange={(e) => priceHandler(e.target.value, "max")} />
            </div>
            <div className={styles.filters__priceBtns}>
                <Tooltip
                    title={<h2>Check out Products under ₹100</h2>}
                    placement='top'
                    arrow
                    onClick={() => multiPriceHandler(0, 100)}
                >
                    <button className={styles.tooltip_btn}>
                        <span style={{ height: '10%' }}></span>
                    </button>
                </Tooltip>
                <Tooltip
                    title={<h2>Check out Products between ₹100 & ₹500</h2>}
                    placement='top'
                    arrow
                    onClick={() => multiPriceHandler(100, 500)}
                >
                    <button className={styles.tooltip_btn}>
                        <span style={{ height: '25%' }}></span>
                    </button>
                </Tooltip>
                <Tooltip
                    title={<h2>Check out Products between ₹500 & ₹1000</h2>}
                    placement='top'
                    arrow
                    onClick={() => multiPriceHandler(500, 1000)}
                >
                    <button className={styles.tooltip_btn}>
                        <span style={{ height: '50%' }}></span>
                    </button>
                </Tooltip>
                <Tooltip
                    title={<h2>Check out Products between ₹1000 & ₹5000</h2>}
                    placement='top'
                    arrow
                    onClick={() => multiPriceHandler(1000, 5000)}
                >
                    <button className={styles.tooltip_btn}>
                        <span style={{ height: '75%' }}></span>
                    </button>
                </Tooltip>
                <Tooltip
                    title={<h2>Check out Products for more than ₹5000</h2>}
                    placement='top'
                    arrow
                    onClick={() => multiPriceHandler(5000, Infinity)}
                >
                    <button className={styles.tooltip_btn}>
                        <span style={{ height: '100%' }}></span>
                    </button>
                </Tooltip>
            </div>
            <div className={styles.filters__shipping} onClick={() => shippingHandler(check.result)}>
                <input type="checkbox" name="shipping" id="shipping" checked={router.query.shipping == "0"} />
                <label htmlFor="shipping">Free Delivery</label>
            </div>
            <div className={styles.filters__rating} onClick={() => ratingHandler(ratingCheck.result)}>
                <input type="checkbox" name="rating" id="rating" checked={router.query.rating} />
                <label htmlFor="rating">
                    <AiTwotoneStar />
                    <AiTwotoneStar />
                    <AiTwotoneStar />
                    <AiTwotoneStar /> & up
                </label>
            </div>
            <div className={styles.filters__sort}>
                <span>
                    Sort by
                </span>
                <div className={styles.filters__sort_list}
                    onMouseOver={() => setShow(true)}
                    onMouseLeave={() => setShow(false)}>
                    <button
                    >
                        {sortQuery == "" ? 'Recommend' : 
                        sortingOptions?.find((x)=>x?.value == sortQuery)?.name
                        }
                        <div style={{ transform: `${show ? "rotate(180deg)" : "rotate(0)"}` }}>
                            <IoIosArrowDown />
                        </div>
                    </button>
                    <ul style={{ transform: `${show ? "scale3d(1, 1, 1)" : "scale3d(1, 0, 1)"}` }}>
                        {
                            sortingOptions.map((option) => (
                                <li onClick={() => sortHandler(option.value)}><a>
                                    {sortQuery == option.value ? <b>{option.name}</b> : option.name } {sortQuery == option.value ? <BsCheckLg /> : ""}
                                </a></li>
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

const sortingOptions = [
    {
        name: "Recommend",
        value: "",
    },
    {
        name: "Most Popular",
        value: "popular",
    },
    {
        name: "New Arrivals",
        value: "newest",
    },
    {
        name: "Best Selling",
        value: "topSelling",
    },
    {
        name: "Top Reviewed",
        value: "topReviewed",
    },
    {
        name: "Price (low to high)",
        value: "priceasc",
    },
    {
        name: "Price (high to low)",
        value: "pricedesc",
    },
];