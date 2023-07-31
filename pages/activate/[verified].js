/* eslint-disable react-hooks/rules-of-hooks */
import styles from "@/styles/forgot.module.scss";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { BiLeftArrowAlt } from "react-icons/bi";
import CircledBtn from '@/components/buttons/circledBtn';
import LoginInput from '@/components/input/logininput';
import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import GridLoaderSpinner from "@/components/loaders/gridLoader";
import axios from "axios";
import { getSession, signIn } from "next-auth/react";
import jwt from "jsonwebtoken";
import { Router } from "next/router";
export default function verified({ user_id }) {
    
    const [emailVerified, setEmailVerified] = useState("admin");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState("");
    
    const verifiedHandler = async () => {
        try {
            setLoading(true);
            const { data } = await axios.put("/api/auth/verified", {
                user_id,
                emailVerified,
            });
            let options = {
                redirect: false,
                email: data.email,
                emailVerified: emailVerified,
            };
            
            await signIn("credentials", options);
            window.location.reload(true);
        } catch (error) {
            setLoading(false);
            setSuccess("");
            setError(error.response.data.message);
        }
    };
    
    return (
        <>
            {loading && <GridLoaderSpinner loading={loading} />}
            <Header country="" />
            <div className={styles.forgot}>
                <div>
                    
                    <Formik
                        enableReinitialize
                        initialValues={{
                           emailVerified,
                        }}
                        onSubmit={() => {
                            verifiedHandler();
                        }}
                    >
                        {(form) => (
                            <Form>
                                <div className={styles.verified}>
                                    
                                        <h1>One Step Left!</h1>
                                        <p className={styles.p}>Your email will be successfully verified. You can access all the features of our website.</p>
                                        <p className={styles.p}>Thank you for verifying your email. Click below button to confirm verification.</p>
                                    </div>
                                <button className={styles.button} onClick={()=>signIn()}><CircledBtn type="submit" text="CONFIRM EMAIL" /></button>
                                <div style={{ marginTop: "10px" }}>
                                    {error && <span className={styles.error}>{error}</span>}
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
            <Footer country="" />
        </>
    );
}

export async function getServerSideProps(context) {
    const { query, req } = context;
    const session = await getSession({ req });
    if (session) {
        return {
            redirect: {
                destination: "/",
            },
        };
    }
    const token = query.verified;
    //   console.log(query)
    const user_id = jwt.verify(token, process.env.ACTIVATION_TOKEN_SECRET);
    if (user_id == null) {
        console.log("adoajdàihjadiohiodhjioadha");
    }
    console.log(user_id);
    return {
        props: {
            user_id: user_id.id,
        },
    };
}