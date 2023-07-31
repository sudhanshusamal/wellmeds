/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-key */
import { useState } from 'react'
import styles from '../styles.module.scss'
import { FaMinus } from 'react-icons/fa'
import { BsPlusLg } from 'react-icons/bs'
import slugify from 'slugify'
import { useRouter } from 'next/router'

export default function BrandFilter({ brands, brandHandler, replaceQuery }) {
    const router = useRouter();

    const [show, setShow] = useState(true)
    return (
        <div className={styles.filter}>
            <h3>
                Brands <span>
                    {
                        show ? <FaMinus onClick={() => setShow(false)} /> : <BsPlusLg onClick={() => setShow(true)} />
                    }
                </span>
            </h3>
            {
                show &&
                <div className={`${styles.filter__sizes}`}>
                    {
                        brands.map((brand) => {
                            const check = replaceQuery("brand", brand)
                           return (
                            <button className={`${styles.filter__brand}  ${check.active ? styles.activeFilter : ""}`} onClick={() => {
                                 brandHandler(check.result)
                                 
                                 }}>
                                <img src={`../../../images/brands/${slugify(brand)}.png`} alt={brand} />
                            </button>
                        )})
                    }
                </div>
            }
        </div>
    )
}
