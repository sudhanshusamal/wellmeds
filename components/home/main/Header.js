import Link from 'next/link'
import styles from './styles.module.scss'
import {MdLocalOffer} from 'react-icons/md'
import { GiHealthPotion, GiMedicines, GiPerfumeBottle } from 'react-icons/gi'

export default function MainHeader() {
    return (
        <div className={styles.header}>
             <ul>
                <li>
                    <GiMedicines />
                    <Link href="/browse?category=64c155bbd6e68b83dc68ff7d">Medicine</Link>
                </li>
                <li>
                    <GiPerfumeBottle />
                    <Link href="/browse?category=64c15582d6e68b83dc68ff37">Beauty</Link>
                </li>
                <li>
                    <GiHealthPotion />
                    <Link href="/browse?category=64c155a1d6e68b83dc68ff5f">Homecare</Link>
                </li>
                <li>
                    <MdLocalOffer />
                    <Link href="/offers">Offers</Link>
                </li>
            </ul> 
        </div>
    )
}
