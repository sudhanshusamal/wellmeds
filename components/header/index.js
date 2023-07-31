import Main from './Main'
import Ad from './Ad'
import Navbar from './Navbar'
import styles from './styles.module.scss'

export default function Header({ country, searchHandler }) {
  return (
    <header className={styles.header}>
      {/* <Ad /> */}
      <Navbar country={country} />
      <Main searchHandler={searchHandler} />
    </header>
  )
}
