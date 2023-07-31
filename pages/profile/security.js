/* eslint-disable react-hooks/rules-of-hooks */
import CircledBtn from '@/components/buttons/circledBtn';
import LoginInput from '@/components/input/logininput';
import Layout from '@/components/profile/layout';
import { Form, Formik } from 'formik';
import { getSession } from 'next-auth/react';
import Head from 'next/head';
import Link from 'next/link';
import React, { useState } from 'react'
import * as Yup from 'yup'
import styles from '@/styles/profile.module.scss'
import axios from 'axios';

export default function index({ user, tab }) {
    const [cur_password, setCur_password] = useState("")
    const [password, setPassword] = useState("")
    const [confirm_pass, setConfirm_pass] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const validate = Yup.object({
        cur_password: Yup.string().required('*Current password is required').min(8, 'Password must be at least 8 characters long'),
        password: Yup.string().required('*New password is required').min(8, 'Password must be at least 8 characters long'),
        confirm_pass: Yup.string().required('*Confirm your new password.').oneOf([Yup.ref("password")], "Password doesn't match, please check again"),
    })

    const changePasswordHandler = async () => { 
        try {
            const {data} = await axios.put('/api/user/changePassword', {
                cur_password,
                password
            });
            setError("")
            setSuccess(data.message)
        } catch (error) {
            setSuccess("")
            setError(error.response.data.message)
        }
    }
    return (
        <Layout session={user.user} tab={tab}>
            <Head>
                <title>{user.user.name.toUpperCase()} | Security</title>
            </Head>
            <div className={styles.header}>
                <h1>CHANGE YOUR PASSWORD</h1>
            </div>
            <div className={styles.login__form}>
                <Formik enableReinitialize initialValues={{
                    cur_password,
                    password,
                    confirm_pass,
                }}
                    validationSchema={validate}
                    onSubmit={() => {
                        changePasswordHandler();
                    }}
                >
                    {
                        (form) => (
                            <Form>
                                <LoginInput type="password" name="cur_password" placeholder="CURRENT PASSWORD" onChange={(e) => setCur_password(e.target.value)} />
                                <LoginInput type="password" name="password" placeholder="NEW PASSWORD" onChange={(e) => setPassword(e.target.value)} />
                                <LoginInput type="password" name="confirm_pass" placeholder="CONFIRM NEW PASSWORD" onChange={(e) => setConfirm_pass(e.target.value)} />
                                <CircledBtn type="submit" text="CHANGE" />
                                {
                                    error && <span className={styles.error}>{error}</span>
                                }
                                {
                                    success && <span className={styles.success}>{success}</span>
                                }

                            </Form>
                        )
                    }
                </Formik>
            </div>
        </Layout>
    )
}

export async function getServerSideProps(ctx) {
    const { query, req } = ctx;
    const session = await getSession({ req });
    const tab = query.tab || 0;

    return {
        props: {
            user: session,
            tab,

        }
    }
}