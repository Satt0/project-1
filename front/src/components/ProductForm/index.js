import React from 'react'
import styles from './style.module.scss'

import classnames from 'classnames'
import Basic from './Basic'
import Variant from './Variant'
const initState={
    name:"",
    description:"",
    status:"",
    slug:"",
    thumb:-1,
    variants:[]
}

export default function ProductForm() {
    const [product,setProduct]=React.useState({...initState})
    return (
        <div className={styles.container}>
            
            <div className={styles.basic}>
            <Basic/>
            </div>
            <div className={styles.variant}>
                <Variant/>
            </div>
            <div className={styles.description}></div>
        </div>
    )
}
