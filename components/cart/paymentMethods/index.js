/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @next/next/no-img-element */
import styles from './styles.module.scss'

export default function PaymentMethods() {
    return (
        <div className={`${styles.card} ${styles.cart__method}`}>
            <h2 className={styles.header}>Payment Methods</h2>
            <div className={styles.images}>
                <img src="../../../images/payment/visa.webp" alt='' />
                <img src="../../../images/payment/mastercard.webp" alt='' />
                <img src="../../../images/payment/paypal.webp" alt='' />
                <img src="../../../images/payment/upi.png" alt='' />
            </div>
            <h2 className={styles.header}>Buyer Protection</h2>
            <div className={styles.protection}>
                <img src='../../../images/protection.png' alt='' />
                Item not as described or undelivered? Get a full refund guaranteed.
            </div>
        </div>
    )
}
