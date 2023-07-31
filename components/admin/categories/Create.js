import { useState } from 'react'
import styles from './styles.module.scss'
import { Form, Formik } from 'formik'
import * as Yup from "yup";
import AdminInput from '@/components/input/adminInput';
import { toast } from 'react-toastify';
import axios from 'axios';

export default function Create({ setCategories }) {
    const [name, setName] = useState("");

    const validate = Yup.object({
        name: Yup.string().required("*Category Name is required").min(2, "*Category name must contain atleast 2-30 characters").max(30, "*Category name must contain atleast 2-30 characters").matches(/^[A-Za-z\s]*$/, "*Numbers and Special characters are not allowed.")  ,
    })
    const submitHandler = async () => {
        try {
            const {data} = await axios.post('/api/admin/category', { name });
            setCategories(data.categories);
            setName("");
            toast.success(data.message)
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
    return (
        <>
            <Formik
                enableReinitialize
                initialValues={{ name }}
                validationSchema={validate}
                onSubmit={() => {
                    submitHandler()
                }}
            >
                {
                    (formik) => (
                        <Form>
                            <div className={styles.header}>Create a Category</div>
                            <AdminInput type="text" label="Name" name="name" placeholder="Category Name" onChange={(e) => setName(e.target.value)} />
                            <div className={styles.btnWrap}>
                            <button type='submit' className={`${styles.btn}`}>
                                Add Category
                            </button>
                            </div>
                        </Form>
                    )
                }

            </Formik>
        </>
    )
}
