/* eslint-disable @next/next/no-img-element */
import { useDispatch, useSelector } from 'react-redux'
import styles from './styles.module.scss'
import { toggleSidebar } from '@/store/ExpandSlice';
import { MdArrowForwardIos, MdOutlineCategory, MdSpaceDashboard } from 'react-icons/md';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FcSalesPerformance } from 'react-icons/fc'
import { IoListCircleSharp, IoNotificationsSharp } from 'react-icons/io5';
import { ImUsers } from 'react-icons/im';
import { AiFillMessage } from 'react-icons/ai';
import { FaThList } from 'react-icons/fa';
import { BsGraphUpArrow, BsPatchPlus } from 'react-icons/bs';
import { RiCoupon3Fill, RiLogoutCircleFill, RiSettingsLine } from 'react-icons/ri';
import { Tooltip as ReactTooltip } from "react-tooltip";


export default function Sidebar() {
    const router = useRouter();
    const route = router.pathname.split("/admin/dashboard/")[1];
    const { data: session } = useSession();
    const { expandSidebar } = useSelector((state) => ({ ...state }));
    const expand = expandSidebar.expandSidebar;
    const dispatch = useDispatch()
    const handleExpand = () => {
        dispatch(toggleSidebar());
    }
    return (
        <div className={`${styles.sidebar} ${expand ? styles.opened : ''}`}>
            <div className={styles.sidebar__toggle} onClick={() => handleExpand()}>
                <div style={{
                    transform: `${expand ? 'rotate(180deg)' : ''}`,
                    transition: "all .3s"
                }}>
                    <MdArrowForwardIos />
                </div>
            </div>
            <div className={styles.sidebar__container}>
                <div className={styles.sidebar__header}>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                <div className={styles.sidebar__user}>
                    <img src={session?.user.image} alt={session?.user.name} />
                    <div className={styles.show}>
                        <span>Welcome Back😊</span>
                        <span>{session?.user.name}</span>
                    </div>
                </div>
                <ul className={styles.sidebar__list}>
                    <li className={route == undefined ? styles.active : ""}>
                        <Link href="/admin/dashboard" id='dashboard'>
                            <MdSpaceDashboard />
                            <span className={styles.show} >Dashboard</span>
                        </Link>
                    </li>
                    <li className={route == "sales" ? styles.active : ""}>
                        <Link id='sales' href="/admin/dashboard/sales">
                            <BsGraphUpArrow />
                            <span className={styles.show}>Sales</span>
                        </Link>
                    </li>
                    <li className={route == "orders" ? styles.active : ""}>
                        <Link id='orders' href="/admin/dashboard/orders">
                            <IoListCircleSharp />
                            <span className={styles.show}>Orders</span>
                        </Link>
                    </li>
                    <li className={route == "users" ? styles.active : ""}>
                        <Link id='users' href="/admin/dashboard/users">
                            <ImUsers />
                            <span className={styles.show}>Users</span>
                        </Link>
                    </li>
                    <li className={route == "messages" ? styles.active : ""}>
                        <Link id='messages' href="/admin/dashboard/messages">
                            <AiFillMessage />
                            <span className={styles.show}>Messages</span>
                        </Link>
                    </li>
                </ul>
                <div className={styles.sidebar__dropdown}>
                    <div className={styles.sidebar__dropdown_heading}>
                        <div className={styles.show}>
                            Product
                        </div>
                    </div>
                    <ul className={styles.sidebar__list}>
                        <li className={route == "product/all" ? styles.active : ""}>
                            <Link id='all' href="/admin/dashboard/product/all">
                                <FaThList />
                                <span className={styles.show}>All Products</span>
                            </Link>
                        </li>
                        <li className={route == "product/create" ? styles.active : ""}>
                            <Link id='create' href="/admin/dashboard/product/create">
                                <BsPatchPlus />
                                <span className={styles.show}>Create Product</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={styles.sidebar__dropdown}>
                    <div className={styles.sidebar__dropdown_heading}>
                        <div className={styles.show}>
                            Category
                        </div>
                    </div>
                    <ul className={styles.sidebar__list}>
                        <li className={route == "categories" ? styles.active : ""}>
                            <Link id='categories' href="/admin/dashboard/categories">
                                <MdOutlineCategory />
                                <span className={styles.show}>Categories</span>
                            </Link>
                        </li>
                        <li className={route == "subcategories" ? styles.active : ""}>
                            <Link id='subcategories' href="/admin/dashboard/subcategories">
                                <div style={{ transform: 'rotate(180deg)' }}>
                                    <MdOutlineCategory />
                                </div>
                                <span className={styles.show}>Sub-Categories</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <div className={styles.sidebar__dropdown}>
                    <div className={styles.sidebar__dropdown_heading}>
                        <div className={styles.show}>
                            Coupon
                        </div>
                    </div>
                    <ul className={styles.sidebar__list}>

                        <li className={route == "coupon" ? styles.active : ""}>
                            <Link id='coupon' href="/admin/dashboard/coupon">
                                <div style={{ transform: 'rotate(180deg)' }}>
                                    <RiCoupon3Fill />
                                </div>
                                <span className={styles.show}>Coupons</span>
                            </Link>
                        </li>
                    </ul>
                </div>
                <nav>
                    <ul className={`${styles.sidebar__list} ${expand ? styles.nav_flex : ""}`}>
                        <li>
                            <Link id='setting' href="">
                                <RiSettingsLine />

                            </Link>
                        </li>
                        <li>
                            <Link id='notify' href="">
                                <IoNotificationsSharp />
                            </Link>
                        </li>
                        <li>
                            <Link id='msg' href="">
                                <AiFillMessage />
                            </Link>
                        </li>
                        <li>
                            <Link id='logout' href="">
                                <RiLogoutCircleFill onClick={()=> signOut()}/>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </div>
            {!expand && <><ReactTooltip
                anchorId="dashboard"
                place="right"
                content="Dashboard"
            />
            <ReactTooltip
                anchorId="coupon"
                place="right"
                content="Create Coupon"
            />
            <ReactTooltip
                anchorId="subcategories"
                place="right"
                content="Sub-Categories"
            />
            <ReactTooltip
                anchorId="categories"
                place="right"
                content="Categories"
            />
            <ReactTooltip
                anchorId="create"
                place="right"
                content="Create Product"
            />
            <ReactTooltip
                anchorId="all"
                place="right"
                content="All Products"
            />
            <ReactTooltip
                anchorId="messages"
                place="right"
                content="Messages"
            />
            <ReactTooltip
                anchorId="users"
                place="right"
                content="Users"
            />
            <ReactTooltip
                anchorId="orders"
                place="right"
                content="Orders"
            />
            <ReactTooltip
                anchorId="sales"
                place="right"
                content="Sales"
            />
            <ReactTooltip
                anchorId="logout"
                place="right"
                variant="info"
                content="Logout"
            />
            <ReactTooltip
                anchorId="msg"
                place="right"
                variant="info"
                content="Messages"
            />
            <ReactTooltip
                anchorId="notify"
                place="right"
                variant="info"
                content="Notification"
            />
            <ReactTooltip
                anchorId="setting"
                place="right"
                variant="info"
                content="Settings"
            />
            </>}
        </div>
    )
}
