/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import styles from './styles.module.scss'
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md'

export default function Header() {
  return (
    <div className={styles.header}>
    <div className={styles.header__container}>
        <div className={styles.header__left}>
            <Link href="/">
                <img src='../../../logog.png' alt='' />
            </Link>
        </div>
        <div className={styles.header__right}>
            <Link href="/browse">
                    Continue Shopping
                    <MdOutlineKeyboardDoubleArrowRight />
            </Link>
        </div>
    </div>
      
    </div>
  )
}
