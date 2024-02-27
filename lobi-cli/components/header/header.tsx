// import appStyles from "@/app/app.module.scss"
import styles from "./header.module.scss"

export function Header() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.left}>
          <h4>Lobi</h4>
        </div>
        <div className={styles.right}>
          </div>
      </div>
    </div>
  )
}