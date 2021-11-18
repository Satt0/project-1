import React from 'react'
import styles from './styles.module.scss'
import NavBar from 'components/NavBar'
export default function Layout({children}) {
    return (
        <div className={styles.container}>
            <header>
            <NavBar/>
            </header>
            <main>

            {children}
            </main>
            <footer>

            </footer>
        </div>
    )
}
