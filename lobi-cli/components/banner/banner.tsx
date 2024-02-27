import styles from './banner.module.scss'
import {cn} from "@/lib/utils";

export function Banner() {
  return (
    <div className={styles.container}>
      <div className="flex-col justify-center align-middle z-50 text-center">
        <h1>Lobi</h1>
        <h3>Find your next match.</h3>
      </div>
      <div className={styles.grid}>
        <div className={styles.blur}></div>
      </div>
    </div>
  )
}