/* eslint-disable react/jsx-key */
import { TbCategory2, TbRibbonHealth, TbYoga } from 'react-icons/tb'
import { GrYoga } from 'react-icons/gr'
import { ImHome } from 'react-icons/im'
import { IoMdFitness } from 'react-icons/io'
import { GiFirstAidKit, GiLipstick, GiLovers, GiSugarCane } from 'react-icons/gi'
import styles from './styles.module.scss'
import { menuArray } from '@/data/home'
import Link from 'next/link'
import { RiOilLine } from 'react-icons/ri'
import { MdElderlyWoman, MdEmojiFoodBeverage, MdMasks, MdPregnantWoman } from 'react-icons/md'
import { FaHeadSideMask } from 'react-icons/fa'
import { Tooltip } from '@mui/material'

export default function Menu({ categories }) {
    console.log(categories)
    return (
        <div className={styles.menu}>
            <ul>
                <li>
                    <a className={styles.menu__header}>
                        <TbCategory2 />
                        <b>Categories</b>
                    </a>
                </li>
                <div className={styles.menu__list}>
                    {
                        categories.map((item, i) => (
                            <li>
                                <Tooltip
                                    title={<h2>{item.name}</h2>}
                                    placement='right'
                                    arrow
                                >
                                    <Link className={styles.a} href={`/browse?category=${item._id}`}>
                                        {i == 0 ? <GiLipstick /> :
                                            i == 1 ? <RiOilLine /> :
                                                i == 2 ? <TbYoga /> :
                                                    i == 3 ? <GiLovers /> :
                                                        i == 4 ? <GiSugarCane /> :
                                                            i == 5 ? <ImHome /> :
                                                                i == 6 ? <IoMdFitness /> :
                                                                    i == 7 ? <MdElderlyWoman /> :
                                                                        i == 8 ? <TbRibbonHealth /> :
                                                                            i == 9 ? <MdEmojiFoodBeverage /> :
                                                                                i == 10 ? <GiFirstAidKit /> :
                                                                                    i == 11 ? <FaHeadSideMask /> :
                                                                                        i == 12 ? <MdPregnantWoman /> : ""
                                        }
                                        <span>{item.name}</span>

                                    </Link>
                                </Tooltip>

                            </li>
                        ))
                    }
                </div>
            </ul>
        </div>
    )
}

