"use client"
import styles from './posting-section.module.scss'
import {PlusIcon} from "lucide-react";
import {useState} from "react";
import PostGameModal from './post-game-modal';

export default function PostingSection() {

  const [modalIsOpen, setModalIsOpen] = useState(false)

  return (
    <div className={styles.wrapper}>
      <PostGameModal/>
      <div className={styles.container}></div>
    </div>
  )
}