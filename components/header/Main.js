/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import styles from './styles.module.scss';
import { BiSearchAlt } from 'react-icons/bi'
import { FiShoppingCart } from 'react-icons/fi'
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Main({ searchHandler }) {
  const router = useRouter()
  const [query, setQuery] = useState(router.query.search || "")
  const { cart } = useSelector((state) => ({ ...state }));

  const handleSearch = (e) => {
    e.preventDefault()
    if (router.pathname !== "/browse") {
      router.push(`/browse?search=${query}`);
    } else {
      searchHandler(query)
    }
  }

  return (
    <div className={styles.main}>
      <div className={styles.main__container}>
        <Link className={styles.logo} href="/">
          <img src='../../../logog.png' alt='wellmeds' />
        </Link>
        <form onSubmit={(e) => handleSearch(e)} className={styles.search}>
          <input type='text' value={query} placeholder='...' onChange={(e) => setQuery(e.target.value)} />
          <button type='submit' className={styles.search__icon}>
            <BiSearchAlt />
          </button>
        </form>
        <Link href="/cart" className={styles.cart}>
          <FiShoppingCart />
          <span>{cart.length}</span>
        </Link>
      </div>
    </div>
  )
}
