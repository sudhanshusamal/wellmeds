import { useEffect, useRef, useState } from 'react'
import styles from './styles.module.scss'
import { useField, ErrorMessage } from 'formik'
export default function ShippingInput({ placeholder, ...props }) {
    const inputRef = useRef(null);
    const [move, setMove] = useState(false)
    const [field, meta] = useField(props)
    useEffect(() => {
        if (field.value.length > 0) {
            setMove(true)
        } else {
            setMove(false)
        }
    }, [field.value]);

    
    return (
        <div className={`${styles.input} ${meta.touched && meta.error && styles.error__shipping}`}>
            <div className={styles.input__wrapper} onFocus={()=>setMove(true)} onBlur={()=>setMove(field.value.length > 0 ? true : false)}>
                <input ref={inputRef} type={field.type} name={field.name} {...field} {...props}  />
                <span onClick={()=>{
                    inputRef.current.focus();
                    setMove(true)}} className={move ? styles.move : ''}>{placeholder}</span>
                <p>{meta.touched && meta.error && <ErrorMessage name={field.name} />}</p>
            </div>
        </div>
    )
}
