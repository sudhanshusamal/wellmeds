/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
import { useDispatch } from 'react-redux'
import styles from './styles.module.scss'
import { useRef } from 'react'
import { ErrorMessage, useField } from 'formik'
import { showDialog } from '@/store/DialogSlice'
import { RiDeleteBin7Fill, RiShape2Line } from 'react-icons/ri'
import { GiExtractionOrb } from 'react-icons/gi'

export default function Style({ product, setProduct, name, colorImage, ...props }) {
    const dispatch = useDispatch()
    const fileInput = useRef(null);
    const [meta, field] = useField(props);

    const handleImage = (e) => {
        let img = e.target.files[0];

        if (img.type !== "image/jpeg" && img.type !== "image/png" && img.type !== "image/webp") {
            dispatch(showDialog({
                header: "Unsupported Format.",
                msgs: [{
                    msg: `${img.name} format is unsupported ! only JPG/PNG/WEBP allowed.`,
                    type: "error",
                }]
            }));
            return;
        } else if (img.size > 1024 * 1024 * 10) {
            dispatch(showDialog({
                header: "Image Size Is Too Large",
                msgs: [{
                    msg: `${img.name} size is too large, maximum of 10mb allowed.`,
                    type: "error",
                }]
            }));
            return;
        } else {
            const reader = new FileReader();
            reader.readAsDataURL(img);
            reader.onload = (e) => {
                let obj = {
                    color: product.color.color,
                    image: e.target.result
                }
                setProduct({
                    ...product, color: obj,
                })

            }
        }

    };

    
    return (
        <div className={styles.images}>
            <div className={`${styles.header} ${meta.error ? styles.header__error : ''}`}>
                <div className={styles.flex}>
                    {meta.error && <img src="../../../images/warning.png" alt="" />}
                    Pick a product style image
                </div>
                <span>
                    {
                        meta.touched && meta.error && <div className={styles.error__msg}>
                            <span></span>
                            <ErrorMessage name={name} />
                        </div>
                    }
                </span>
            </div>
            <input type="file" name="colorImageInput" ref={fileInput} hidden accept='image/jpeg, image/png, image/webp, image/gif' onChange={handleImage} />
            
            <button type="reset" onClick={() => fileInput.current.click()} className={`${styles.btn} ${styles.btn__primary}`}>Pick style</button>
        </div>
    )
}
