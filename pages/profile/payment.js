/* eslint-disable react-hooks/rules-of-hooks */
import Layout from '@/components/profile/layout';
import { getSession } from 'next-auth/react';
import React, { useState } from 'react'
import User from '../../models/User'
import Payment from '../../components/checkout/payment'
import styles from '../../styles/profile.module.scss'
import axios from 'axios';
import GridLoaderSpinner from '@/components/loaders/gridLoader'
import { useRouter } from 'next/router';

export default function payment({ user, tab, defaultPaymentMethod }) {
    const router = useRouter()
    const [dbPM, setDbPM] = useState(defaultPaymentMethod)
    const [paymentMethod, setPaymentMethod] = useState(defaultPaymentMethod)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handlePM = async () => {
        setLoading(true)
        try {
            const { data } = await axios.put("/api/user/changePM", {
                paymentMethod
            });
            setError("")
            setDbPM(data.paymentMethod)
            window.location.reload(false)
        } catch (error) {
            setError(error.message)
        }
        setLoading(false)
    }
    return (
        <Layout session={user.user} tab={tab}>
            {loading && <GridLoaderSpinner loading={loading} />}
            <div className={styles.header}>
                <h1>My Payment Method</h1>
            </div>
            <Payment paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} profile />
            <button onClick={() => handlePM()} disabled={!paymentMethod || paymentMethod == dbPM} className={`${styles.button} ${!paymentMethod || paymentMethod == dbPM ? styles.disabled : ""}`}>Save</button>
            {error && <span className={styles.error}>{error}</span>}
        </Layout>
    )
}

export async function getServerSideProps(ctx) {
    const { query, req } = ctx;
    const session = await getSession({ req });
    const tab = query.tab || 0;
    const user = await User.findById(session.user.id).select('defaultPaymentMethod')
    return {
        props: {
            user: session,
            tab,
            defaultPaymentMethod: user.defaultPaymentMethod
        }
    }
}