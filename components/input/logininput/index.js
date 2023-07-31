import { ErrorMessage, useField } from 'formik'
import styles from './styles.module.scss'

export default function LoginInput({ placeholder, ...props }) {
  const [field, meta] = useField(props);
  return (
    <div className={`${styles.input} ${meta.touched && meta.error ? styles.error : ''}`}>
      <input type={field.type} name={field.name} placeholder={placeholder} {...field} {...props}></input>
      { meta.touched && meta.error && <div className={styles.error__popup}>
        <span></span>
        <ErrorMessage name={field.name} />
      </div>}
    </div>
  )
}
