import React from 'react'
import { TextField,Button } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles=makeStyles(theme=>({
  root:{
    display:'grid',
   gridGap:'.4em'

  },
  buttonGroup:{
    display:'flex',
    justifyContent:"space-between"
  }
}))

const initUser={
  username:'',
  password:"",
  repassword:''
}
export default function AuthenForm({onLogin,onSignUp}) {
  const [hasAccount,setHasAccount]=React.useState(true);
  const [user,setUser]=React.useState(initUser)
  const styles=useStyles()
  const onChange=(key)=>{
    return (el)=>{
      const value=el.target.value;
      setUser(s=>({...s,[key]:value}))
    }
  }
  const onSubmit=(e)=>{
    e.preventDefault()

   
    if(hasAccount) 
          onLogin(user)
    else
      onSignUp(user)
          
  }
  const toggleAccount=()=>setHasAccount(s=>!s)
  return (
    <form className={styles.root} onSubmit={onSubmit}>
      <TextField value={user.username}  label="username" variant="outlined" required onChange={onChange('username')} />
      <TextField value={user.password} type="password" label="password" variant="outlined" required onChange={onChange('password')}/>
      {!hasAccount&&<TextField type="password" value={user.repassword} label="re-Password" variant="outlined" required onChange={onChange('repassword')}/>}
      <div className={styles.buttonGroup}>
        <Button variant="contained" type="submit">
          {hasAccount?"Login":"Signup"}
        </Button>
        <Button color="warning" onClick={toggleAccount}>
          {hasAccount?"Don't have":"Have"} Account?
        </Button>
      </div>
    </form>
  )
}
