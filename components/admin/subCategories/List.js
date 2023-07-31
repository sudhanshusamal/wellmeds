import categories from '@/pages/admin/dashboard/categories'
import ListItem from './ListItem'
import styles from './styles.module.scss'

export default function List({ categories, subCategories, setSubCategories }) {
    return (
        <ul className={styles.list}>
        {
            subCategories.map((sub)=> (
                <ListItem categories={categories} subCategory={sub} key={sub._id} setSubCategories={setSubCategories} />
            ))
        }
        </ul>
    )
}
