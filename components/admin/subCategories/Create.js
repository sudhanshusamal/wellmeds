import { useState } from 'react'
import styles from './styles.module.scss'
import { Form, Formik } from 'formik'
import * as Yup from "yup";
import AdminInput from '@/components/input/adminInput';
import { toast } from 'react-toastify';
import axios from 'axios';
import SingularSelect from '@/components/selects/SingularSelect';
import categories from '@/pages/admin/dashboard/categories';

export default function Create({ categories, setSubCategories }) {
    const [name, setName] = useState("");
    const [parent, setParent] = useState("");

    const validate = Yup.object({
        name: Yup.string().required("*Subcategory Name is required").min(2, "*Subcategory name must contain atleast 2-30 characters").max(30, "*Subcategory name must contain atleast 2-30 characters").matches(/^[A-Za-z\s]*$/, "*Numbers and Special characters are not allowed."),
        parent: Yup.string().required("*Please choose a parent category")
    })
    const submitHandler = async () => {
        try {
            const { data } = await axios.post('/api/admin/subcategory', { name, parent });
            setSubCategories(data.subCategories);
            setName("");
            setParent("");
            toast.success(data.message)
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
    return (
        <>
            <Formik
                enableReinitialize
                initialValues={{ name, parent }}
                validationSchema={validate}
                onSubmit={() => {
                    submitHandler()
                }}
            >
                {
                    (formik) => (
                        <Form>
                            <div className={styles.header}>Create a Sub-Category</div>
                            <AdminInput type="text" label="Name" name="name" placeholder="Sub-Category Name" onChange={(e) => setName(e.target.value)} />

                            <SingularSelect name="parent" value={parent} data={categories} placeholder="Select Category" handleChange={(e)=>setParent(e.target.value)} />
                            <div className={styles.btnWrap}>
                                <button type='submit' className={`${styles.btn}`}>
                                    Add Sub-Category
                                </button>
                            </div>
                        </Form>
                    )
                }

            </Formik>
        </>
    )
}
