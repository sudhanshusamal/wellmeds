import styles from './styles.module.scss'

export default function CircledBtn({ type, text, action }) {
  return (
    <button type={type} className={styles.button} onClick={()=>action}>
      {text}
    </button>
  )
}
