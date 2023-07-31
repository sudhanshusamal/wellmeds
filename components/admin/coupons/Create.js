import { useState } from 'react'
import styles from './styles.module.scss'
import { Form, Formik } from 'formik'
import * as Yup from "yup";
import AdminInput from '@/components/input/adminInput';
import { toast } from 'react-toastify';
import axios from 'axios';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField } from '@mui/material';

export default function Create({ setCoupons }) {
    const [name, setName] = useState("");
    const [discount, setDiscount] = useState(0);
    const tommorow = new Date()
    tommorow.setDate(tommorow.getDate() + 1)
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(tommorow)

    const handleStartDate = (newValue) => {
        setStartDate(newValue)
    }
    const handleEndDate = (newValue) => {
        setEndDate(newValue)
    }

    const validate = Yup.object({
        name: Yup.string().required("*Coupons Name is required").min(2, "*Coupons name must contain atleast 2-30 characters").max(30, "*Coupons name must contain atleast 2-30 characters").matches(/^[A-Za-z\s]*$/, "*Numbers and Special characters are not allowed.")  ,
        discount: Yup.number().required("*Discount % is required").min(1, "*Coupons name must contain 1-100 %").max(99, "*Coupons name must contain 1-99 %")
    })
    const submitHandler = async () => {
        try {
            if(startDate.toString() == endDate.toString()){
                toast.error("You can't pick the same date.")
            } else if((endDate.getTime() - startDate.getTime())<0){
                return toast.error("Start Date cannot be more than the End date.")
            }
            const {data} = await axios.post('/api/admin/coupon', { coupon: name, discount, startDate, endDate});
            setCoupons(data.coupons);
            setName("");
            setDiscount(0)
            setStartDate(new Date())
            setEndDate(tommorow)
            toast.success(data.message)
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
    return (
        <>
            <Formik
                enableReinitialize
                initialValues={{ name, discount }}
                validationSchema={validate}
                onSubmit={() => {
                    submitHandler()
                }}
            >
                {
                    (formik) => (
                        <Form>
                            <div className={styles.header}>Create a Coupon</div>
                            <AdminInput type="text" label="Name" name="name" placeholder="Coupon Name" onChange={(e) => setName(e.target.value)} />
                            <AdminInput type="number" label="Discount" name="discount" placeholder="Set Discount % (don't add % sign write only number)" onChange={(e) => setDiscount(e.target.value)} />
                            <div className={styles.date_picker}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DesktopDatePicker 
                                    label="Start Date"
                                    inputFormat="MM/dd/yyyy"
                                    value={startDate}
                                    onChange={handleStartDate}
                                    renderInput={(params)=><TextField {...params} />}
                                    minDate={new Date()}

                                    />
                                    <DesktopDatePicker 
                                    label="End Date"
                                    inputFormat="MM/dd/yyyy"
                                    value={endDate}
                                    onChange={handleEndDate}
                                    renderInput={(params)=><TextField {...params} />}
                                    minDate={tommorow}

                                    />


                                </LocalizationProvider>
                            </div>
                            <div className={styles.btnWrap}>
                            <button type='submit' className={`${styles.btn}`}>
                                Add Coupon
                            </button>
                            </div>
                        </Form>
                    )
                }

            </Formik>
        </>
    )
}
