/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link'
import Footer from '../components/footer'
import Header from '../components/header'
import styles from '../styles/signin.module.scss'
import React, { useState } from 'react'
import { MdOutlineKeyboardDoubleArrowLeft } from 'react-icons/md'
import { Form, Formik } from 'formik'
import LoginInput from '../components/input/logininput';
import * as Yup from 'yup';
import CircledBtn from '@/components/buttons/circledBtn'
import { getCsrfToken, getProviders, getSession, signIn, useSession } from 'next-auth/react'
import Router from 'next/router'
import GridLoaderSpinner from '@/components/loaders/gridLoader'

const initialvalues = {
  login_email: "",
  login_password: "",
  success: "",
  error: "",
  login_error: "",
}

export default function signin({ providers, csrfToken, callbackUrl }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(initialvalues);
  const { login_email,
    login_password, success, email, login_error, emailVerified,
  } = user;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };
  const loginValidation = Yup.object({
    login_email: Yup.string().required("Please fix your email to continue").email('Enter a valid email'),
    login_password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long'),
  });
  const signInHandler = async () => {
    setLoading(true);
    let options = {
      redirect: false,
      email: login_email,
      password: login_password,
      emailVerified: emailVerified,
    };
    const res = await signIn("credentials", options);
    setUser({ ...user, success: "", error: "" });
    setLoading(false);
    if (res?.error) {
      setLoading(false);
      setUser({ ...user, login_error: res?.error });
    } else {
      return Router.push(callbackUrl === "http://localhost:3000/register" ? "/" : callbackUrl || "/signin");
    }
  }
  return (
    <div>
    {loading && <GridLoaderSpinner loading={loading} />}
      <Header country="India" />
      <div className={styles.login}>
        <div className={styles.login__container}>
          <div className={styles.login__header}>
            <div className={styles.back__svg}>
            <MdOutlineKeyboardDoubleArrowLeft />
            </div>
            <span>
              We'd be happy to have you! <Link href="/">Go Store</Link>
            </span>
          </div>
          <div className={styles.login__form}>
            <h1>Log in</h1>
            <p>Open the gateway to better health with a simple sign-in.</p>
            <Formik enableReinitialize initialValues={{
              login_email,
              login_password,
              emailVerified,
            }}
              validationSchema={loginValidation}
              onSubmit={() => {
                signInHandler();
              }}
            >
              {
                (form) => (
                  <Form method='post' action="api/auth/signin/email">
                  <input type='hidden' name='csrfToken' defaultValue={csrfToken} />
                    <LoginInput type="text" name="login_email" placeholder="EMAIL" onChange={handleChange} />
                    <LoginInput type="password" name="login_password" placeholder="PASSWORD" onChange={handleChange} />
                    <CircledBtn type="submit" text="LOG IN" />
                    {
                      login_error && <span className={styles.error}>{login_error}</span>
                    }
                    <div className={styles.forgot}>
                      <Link href="/auth/forgot">Forgot your password</Link> ?
                    </div>
                    <div className={styles.forgot}>
                      New to Wellmeds? <Link href="/register" className={styles.bluesup}>SIGN UP</Link>
                    </div>
                  </Form>
                )
              }
            </Formik>
            <div className={styles.login__socials}>
              <span className={styles.or}>OR</span>
              <div className={styles.login__socials_wrap}>
                {
                  providers.map((provider) => {
                    if(provider.name === "Credentials") {
                      return;
                    }
                    return (
                    <div key={provider.name}>
                      <button className={styles.social__btn} onClick={() => signIn(provider.id)}><img src={`../../icons/${provider.name}.png`} alt={provider.name} />Continue with {provider.name}</button>
                    </div>
                  )
                  })
                }
              </div>
            </div>
          </div>
        </div>

      </div>
      <Footer country="India" />
    </div>
  )
}

export async function getServerSideProps(context) {
  const { req, query } = context;

  const session = await getSession({ req });
  const { callbackUrl } = query;

  if (session) {
    return {
      redirect: {
        destination: callbackUrl,
      },
    };
  }
  const csrfToken = await getCsrfToken(context);
  const providers = Object.values(await getProviders());
  return {
    props: {
      providers,
      csrfToken,
      callbackUrl,
    },
  };
}