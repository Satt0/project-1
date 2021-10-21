const {UserAuthentication}=require('./user')
const {TokenValidation}=require('./token')
const testUser={
    id:123,
    role:3,
    name:"Tan"
}
test('user validation',()=>{
    const encoder=new TokenValidation()
    const jwt=encoder.signJWT(testUser)

    const userAuthen=new UserAuthentication(jwt)
    
    const userID=userAuthen.authenUserIdentity()
    const userRole=userAuthen.authenUserAuthorization()
    // run test
    expect(userID).toBe(123)
    expect(userRole).toBe(3)
})