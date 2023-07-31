/* eslint-disable react/jsx-key */
import { useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import styles from "../styles.module.scss";
import { useRouter } from "next/router";
export default function ItemFormFilter({ data, formHandler, replaceQuery }) {
  console.log(data)
  const router = useRouter();
  const existedStyle = router.query.form || "";
  const [show, setShow] = useState(true);
  return (
    <div className={styles.filter}>
      <h3> Product Form
        <span>{show ? <FaMinus /> : <BsPlusLg />}</span>
      </h3>
      {show && (
        <div className={styles.filter__sizes}>
          {data.map((style, i) => {
            const check = replaceQuery("form", style);
            return (
              <div
                className={styles.filter__sizes_size}
                onClick={() => formHandler(check.result)}
              >
                <input
                  type="checkbox"
                  name="style"
                  id={style}
                  checked={check.active}
                />
                <label htmlFor={style}>{style}</label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}