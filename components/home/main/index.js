
import Menu from './menu'
import MainOffers from './offers'
import styles from './styles.module.scss'
import MainSwiper from './swiper'
import User from './user'
import MainHeader from './Header'

export default function Main({categories}) {
  return (
    <div className={styles.main}>
      <MainHeader />
      <Menu categories={categories} />
      <MainSwiper />
      <MainOffers />
      <User />
    </div>
  )
}
