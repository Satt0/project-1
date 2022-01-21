import { useEffect } from "react"


export const useFullScreen=()=>{
    useEffect(()=>{
        document.body.style.overflow="hidden"
        return ()=>{
            document.body.style.overflow=""
        }
    },[])
}