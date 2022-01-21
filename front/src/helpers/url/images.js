const SRC_URL="http://localhost:4000/"
export function getMediaURL(src=""){
    if(typeof src!=='string') return ""
    return SRC_URL+src.replace('\\','/')
}