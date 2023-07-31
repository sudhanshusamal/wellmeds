/* eslint-disable @next/next/no-img-element */
import styles from './styles.module.scss';
import { TbShieldCheckeredFilled } from 'react-icons/tb'
import { FaRegHeart } from 'react-icons/fa'
import { RiAccountPinCircleLine } from 'react-icons/ri'
import { RiArrowDropDownLine } from 'react-icons/ri'
import Link from 'next/link';
import { useState } from 'react';
import UserMenu from './UserMenu';
import { useSession } from 'next-auth/react';

export default function Top({ country }) {
    // console.log(country)
    const { data: session } = useSession()
    const [visible, setvisible] = useState(false);
    return (
        <div className={styles.top}>
            <div className={styles.top__container}>
                <div></div>
                <ul className={styles.top__list}>
                    <li className={styles.li}>
                        <img src={country.flag} alt={country.name} />
                        <span>{country.name} | INR</span>
                    </li>
                    <li className={styles.li}>
                        <TbShieldCheckeredFilled />
                        <span>Buyer Protection</span>
                    </li>
                    <li className={styles.li}>
                        <span>Customer Service</span>
                    </li>
                    <li className={styles.li}>
                        <span>Help</span>
                    </li>
                    <li className={styles.li}>
                        <FaRegHeart />
                        <Link href="profile/wishlist?tab=2&q=whishlist"><span>Whishlist</span></Link>
                    </li>
                    <li className={styles.li} onClick={()=>setvisible(true)} onMouseOver={() => setvisible(true)} onMouseLeave={() => setvisible(false)}>
                        {session ? <div className={styles.flex}>
                            <img src={session.user.image} alt={session.user.name} />
                            <span>{session.user.name}</span>
                            <RiArrowDropDownLine />
                        </div> :
                            <div className={styles.flex}>
                                <RiAccountPinCircleLine />
                                <span>Account</span>
                                <RiArrowDropDownLine />
                            </div>}
                        {visible && <UserMenu session={session} />}
                    </li>

                </ul>
            </div>
        </div>
    )
}
