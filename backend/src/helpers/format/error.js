

exports.errorFormater=(message="error!")=>{
    return {error:true,message}
}
exports.successFormater=(data)=>{
    return {error:false,data}
}