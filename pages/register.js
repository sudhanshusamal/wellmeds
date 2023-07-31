/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/rules-of-hooks */
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
import { getProviders, signIn } from 'next-auth/react'
import axios from 'axios'
import Gridloader from '@/components/loaders/gridLoader'
import Router from 'next/router'

const initialvalues = {
  login_email: "",
  login_password: "",
  name: "",
  email: "",
  password: "",
  confirm_pass: "",
  success: "",
  error: "",
}

export default function register({ providers }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(initialvalues);
  const {
    name,
    email,
    password,
    confirm_pass, success, error, } = user;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const registerValidation = Yup.object({
    name: Yup.string().required("Your name shouldn't remains secret!").min(2, 'Name must be between 2 and 20 characters').max(20, 'Name must be between 3 and 20 characters').matches(/^[aA-zZ]/, 'Name must contain letters only.'),
    email: Yup.string().required("Please fix your email to continue").email('Enter a valid email'),
    password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters long'),
    confirm_pass: Yup.string().required('Confirm your password.').oneOf([Yup.ref("password")], "Password doesn't match, please check again"),

  })
  const signUpHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post('/api/auth/signup', {
        name, email, password
      });
      setUser({ ...user, error: "", success: data.message })
      setLoading(false);
      setTimeout(() => {
        Router.push("/")
      }, 2000)
    } catch (error) {
      setLoading(false);
      setUser({ ...user, success: "", error: error.response.data.message })
    }
  }
  return (
    <div>
      {loading && <Gridloader loading={loading} />}
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
            <h1>Create account</h1>
            <p>Join us, unlock wellness.</p>
            <Formik enableReinitialize initialValues={{
              name,
              email,
              password,
              confirm_pass,
            }}
              validationSchema={registerValidation}
              onSubmit={() => {
                signUpHandler();
              }}
            >
              {
                (form) => (
                  <Form>
                    <LoginInput type="text" name="name" placeholder="FULL NAME" onChange={handleChange} />
                    <LoginInput type="text" name="email" placeholder="EMAIL" onChange={handleChange} />
                    <LoginInput type="password" name="password" placeholder="PASSWORD" onChange={handleChange} />
                    <LoginInput type="password" name="confirm_pass" placeholder="CONFIRM PASSWORD" onChange={handleChange} />
                    <CircledBtn type="submit" text="CONTINUE" />
                  </Form>
                )
              }
            </Formik>
            <div>
              {success && <span className={styles.success}>{success}</span>}
            </div>
            <div>
              {error && <span className={styles.error}>{error}</span>}
            </div>
            <div className={styles.forgot}>
              Already a member? <Link href="" onClick={() => signIn()} className={styles.bluesup}>LOG IN</Link>
            </div>

          </div>
        </div>
      </div>
      <Footer country="India" />
    </div>
  )
}


export async function getServerSideProps(context) {
  const providers = Object.values(await getProviders());
  return {
    props: { providers },
  };
}
