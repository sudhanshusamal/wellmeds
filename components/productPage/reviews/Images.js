/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
import { useRef, useState } from 'react'
import styles from './styles.module.scss'
import { RiDeleteBin5Fill } from 'react-icons/ri';

export default function Images({ images, setImages }) {
    const [error, setError] = useState("")
    const inputRef = useRef(null);
    const handleImages = (e) => {
        let files = Array.from(e.target.files);
        files.forEach((img, i) => {
            if (images.length >= 4 || i >= 3) {
                setError("Maximum 3 images are allowed.")
                return;
            }
            if (
                img.type !== "image/jpeg" &&
                img.type !== "image/png" &&
                img.type !== "image/webp"
            ) {
                setError(`${img.name} format is unsupported ! only JPEG, PNG, WEBP are allowed.`)
                files = files.filter((item) => item.name !== img.name);
                return;
            } else if (img.size > 1024 * 1024 * 5) {
                setError(`${img.name} size is too large max 5mb allowed. `)
                files = files.filter((item) => item.name !== img.name);
                return;
            } else {
                setError("")
                const reader = new FileReader()
                reader.readAsDataURL(img);
                reader.onload = (e) => {
                    setImages((images) => [...images, e.target.result])
                }
            }
        })
    }

    const removeImage = (image) => {
        setImages((images)=>images.filter((img)=> img!== image));
        if(images.length<=3){
            setError("")
        }
    }
    return (
        <div>
            <input type='file' ref={inputRef} hidden onChange={handleImages} multiple accept='image/*' />
            <button className={styles.login_btn} style={{ width: "150px" }} onClick={() => inputRef.current.click()}>Add images</button>
            {
                error && <div className={styles.error} style={{ color: "#f00" }}>{error}</div>
            }
            <div className={styles.imgs_wrap}>
                {
                    images.length > 0 &&
                    images.map((img) => (
                        <span>
                            <RiDeleteBin5Fill onClick={() => removeImage(img)} />
                            <img src={img} />
                        </span>
                    ))
                }
            </div>
        </div>
    )
}
