/* eslint-disable react/jsx-key */
/* eslint-disable @next/next/no-img-element */
import { sidebarData } from '@/data/profile'
import styles from './styles.module.scss'
import index from '@/pages/profile'
import Item from './item'

export default function Sidebar({ data }) {
    return (
        <div className={styles.sidebar}>
            <div className={styles.sidebar__container}>
                <img src={data.image} alt="" />
                <span className={styles.sidebar__name}>
                    {data.name}
                </span>
                <ul>
                    {sidebarData.map((item, i) => (
                        <Item
                            kye={i}
                            item={item}
                            visible={data.tab == i.toString()}
                            index={i.toString()}
                        />
                    ))}
                </ul>
            </div>
        </div>
    )
}
