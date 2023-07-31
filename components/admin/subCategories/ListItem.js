import { useRef, useState } from 'react'
import styles from './styles.module.scss'
import { AiFillDelete, AiTwotoneEdit } from 'react-icons/ai'
import { set } from 'mongoose'
import axios from 'axios'
import { toast } from 'react-toastify'
import SingularSelect from '@/components/selects/SingularSelect'
import Category from '@/components/home/category'

export default function ListItem({ categories, subCategory, setSubCategories }) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [parent, setParent] = useState("")
  const input = useRef(null);

  const handleRemove = async (id) => {
    try {
      const { data } = await axios.delete(`/api/admin/subcategory/?id=${id}`, {
        data: { id },
      });
      setSubCategories(data.subCategories);
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const handleUpdate = async (id) => {
    try {
      const { data } = await axios.put('/api/admin/subcategory', {
        id,
        name: name || subCategory.name,
        parent: parent || subCategory.parent._id,
      });
      setSubCategories(data.subCategories);
      setOpen(false)
      toast.success(data.message)
    } catch (error) {
      toast.error(error.response.data.message)
    }
  }
  return (
    <li className={styles.list__item}>

      <input
        className={open ? styles.open : ""}
        type='text'
        value={name ? name : subCategory.name}
        onChange={(e) => setName(e.target.value)}
        disabled={!open}
        ref={input}
      />
      {/* <SingularSelect name="parent" value={parent ? parent : subCategory.parent.name} data={categories} placeholder="Select Category" handleChange={(e) => setParent(e.target.value)} /> */}
      {
        open && (
          <div className={styles.list__item_expand}>
          <select name='parent' value={parent === subCategory.parent || parent !== "" ? parent : subCategory.parent._id || subCategory.parent} onChange={(e)=>setParent(e.target.value)} disabled={!open} className={styles.select} > {
            categories.map((c)=>(
              <option value={c._id} key={c._id}>{c.name}</option>
            ))
          }</select>
            <button className={styles.btn} onClick={() => handleUpdate(subCategory._id)}>Save</button>
            <button className={styles.btn} onClick={() => {
              setOpen(false);
              setName("")
              setParent("")
            }}>Cancel</button>
          </div>
        )
      }
      <div className={styles.list__item_actions}>
        {
          !open && (
            <AiTwotoneEdit onClick={() => {
              setOpen((prev) => !prev);
              input.current.focus();
            }} />
          )
        }
        <AiFillDelete onClick={() => handleRemove(subCategory._id)} />
      </div>
    </li>
  )
}
