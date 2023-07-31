import Link from 'next/link';
import styles from './styles.module.scss';
import { useState } from 'react';
import axios from 'axios';

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const subscribe = async () => {
    setSuccess("")
    setError("")
    try {
      setLoading(true)
      const {data} = await axios.post('/api/newsletter', {email})
      setSuccess(data.message)
      setLoading(false)
      setEmail("")
    } catch (error) {
      setSuccess("")
      setLoading(false)
      setError(error.response.data.message)
    }
  }
  return (
    <div className={styles.footer__newsletter}>
      <h3>Sign up to stay updated with us.</h3>
      <div className={styles.footer__flex}>
        <input type='text' placeholder='Your Email Here' value={email} onChange={(e)=>setEmail(e.target.value)} />
        <button onClick={()=>subscribe()}className={styles.btn_primary} disabled={loading === true} style={{cursor: `${loading ? "not-allowed" : ""}`}} >Subscribe</button>
      </div>
      {loading && <div className="loading">loading...</div>}
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <p>
        By clicking the SUBSCRIBE button, you are agreeing to {" "}
        <Link href="">our Privacy & Cookie Policy</Link>
      </p>
    </div>
  )
}
