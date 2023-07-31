/* eslint-disable react/jsx-no-undef */
/* eslint-disable react/jsx-key */
import { useState } from 'react'
import styles from '../styles.module.scss'
import { FaMinus } from 'react-icons/fa'
import { BsPlusLg } from 'react-icons/bs'
import Card from './Card'

export default function CategoryFilter({ replaceQuery, categories,categoryHandler,  subCategories }) {
    const [show, setShow] = useState(true)
    return (
        <div className={styles.filter}>
            <h3>
                Category <span>
                    {
                        show ? <FaMinus onClick={()=>setShow(false)} /> : <BsPlusLg onClick={()=>setShow(true)} />
                    }
                </span>
            </h3>
            {
                show &&
                categories.map((category) => (
                    <Card replaceQuery={replaceQuery} category={category} subCategories={subCategories} categoryHandler={categoryHandler} />
                ))

            }
        </div>
    )
}
