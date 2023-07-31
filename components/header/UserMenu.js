import Link from 'next/link';
import styles from './styles.module.scss';
import { signOut, signIn } from 'next-auth/react';

export default function UserMenu({ session }) {
    console.log(session)
    return (
        <div className={styles.menu}>
            <h4>Welcome to Wellmeds</h4>
            {session ?
                <div className={styles.flex}>
                    <img src={session.user.image} alt={session.user.name} className={styles.menu__img} />
                    <div className={styles.col}>
                        <span>Welcome Back,</span>
                        <h3>{session.user.name}</h3>
                        <span onClick={() => signOut()}>Sign Out</span>
                    </div>
                </div>

                : (
                    <div className={styles.flex}>
                        <Link href="/register"><button className={styles.btn_primary}>Register</button></Link>
                        <button className={styles.btn_outlined} onClick={() => signIn()}>Login</button>
                    </div>
                )}
                <ul>
                    <li>
                        <Link href="/profile">Account</Link>
                    </li>
                    <li>
                        <Link href="/profile/orders?tab=1&q=all-orders__">My Orders</Link>
                    </li>
                    <li>
                        <Link href="/profile/messages">Message Center</Link>
                    </li>
                    <li>
                        <Link href="/profile/address?tab=0&q=addresses">Address</Link>
                    </li>
                    <li>
                        <Link href="/profile/wishlist?tab=2&q=whishlist">Whishlist</Link>
                    </li> 
                </ul>
        </div>
    )
}
