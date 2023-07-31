/* eslint-disable react/jsx-key */
import { useState } from "react";
import { BsPlusLg } from "react-icons/bs";
import { FaMinus } from "react-icons/fa";
import styles from "../styles.module.scss";
import { useRouter } from "next/router";
export default function UsesFilter({ data, usesHandler, replaceQuery }) {
  const router = useRouter();
  const existedStyle = router.query.uses || "";
  console.log(existedStyle)
  const [show, setShow] = useState(true);
  return (
    <div className={styles.filter}>
      <h3> Uses For
        <span>{show ? <FaMinus /> : <BsPlusLg />}</span>
      </h3>
      {show && (
        <div className={styles.filter__sizes}>
          {data.map((style, i) => {
            const check = replaceQuery("uses", style);
            return (
              <div
                className={styles.filter__sizes_size}
                onClick={() => usesHandler(check.result)}
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