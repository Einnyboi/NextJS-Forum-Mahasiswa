import Image from "next/image";
import styles from "./page.module.css"
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar"

export default function Home() {
  return (
    <div>
      <Navbar></Navbar>
      <Sidebar></Sidebar>
    </div>
  )
}