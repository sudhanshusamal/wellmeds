import { FaMinus } from 'react-icons/fa'
import styles from '../styles.module.scss'
import { BsPlusLg } from 'react-icons/bs'
import { useState } from 'react'

export default function Card({ category, categoryHandler, replaceQuery }) {
    const [show, setShow] = useState(false);
    const check = replaceQuery("category", category._id)
    
    return (
        <>
            <section>
                <li onClick={()=>categoryHandler(check.active ? {} : category._id)}>
                    <input type="radio" name="filter" checked={check.active} id={category._id} />
                    <label htmlFor={category._id}>
                        <a>{category.name}</a>
                    </label>
                    <span>
                        {
                            show ? <FaMinus /> : <BsPlusLg />
                        }
                    </span>
                </li>
            </section>
        </>
    )
}
