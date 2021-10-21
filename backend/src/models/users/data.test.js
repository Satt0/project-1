const {UserLogin}=require('./data')

test('test login user',async ()=>{
    const username="tasn"
    const password='tan'
   
    const user=new UserLogin({username,password})
    const response=await user.login()
    console.log(response);
})