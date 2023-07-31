import styles from './styles.module.scss'
import GridLoader from 'react-spinners/GridLoader';

export default function GridLoaderSpinner({loading}) {
  return (
    <div className={styles.loader}>
      <GridLoader color="#2f82ff" loading={loading} />
    </div>
  )
}
