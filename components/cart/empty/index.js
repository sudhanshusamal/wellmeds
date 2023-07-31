/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import { signIn, useSession } from 'next-auth/react'
import styles from './styles.module.scss'
import React from 'react'
import Link from 'next/link';

export default function Empty() {
    const {data:session} = useSession();
  return (
    <div className={styles.empty}>
      <img src='../../../images/empty-bg.png' />
      <h1>Your Cart is empty</h1>
      {
        !session && <button className={styles.empty__btn} onClick={()=>signIn()}>LOG IN</button>
      }
      <Link href="/browse">
            <button className={`${styles.empty__btn} ${styles.empty__btn_v2}`}>Shop Now</button>
        </Link>
    </div>
  )
}
