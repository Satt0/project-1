import React from 'react'
import styles from './authen.module.scss'
import AuthenForm from 'components/AuthenForm'
import { useLazyQuery, useMutation } from '@apollo/client'
import { USER_LOGIN, USER_SIGNUP } from 'api/graphql/query/user/authen'
import { login } from 'store/reducers/user'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
export default function Page() {
    const handler = useAuthen()
    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <AuthenForm {...handler} />
            </div>
        </div>
    )
}

const useAuthen = () => {
    // { loading, error, data }
    const [getUser, loginData] = useLazyQuery(USER_LOGIN);
    const [createUser, signupData] = useMutation(USER_SIGNUP);
    const dispatch = useDispatch();

    const onLogin = ({ username, password }) => {
        console.log('here');
        getUser({
            variables: {
                input: {
                    username, password
                }
            }
        })
    }
    const onSignUp = async ({ username, password, repassword,role }) => {
        if (password !== repassword)
            return alert('password not match!')
        createUser({
            variables: {
                input: {
                    username, password, role
                }
            }
        }).catch(e => { console.log(e.message); })
    }
    const setToken=(token='')=>{
        localStorage.setItem('token',token)
    }
   
    React.useEffect(() => {
        console.log('changed');
        const { loading, error, data } = loginData;
        if (loading) return;
        if (error) {
            console.log(error.message);
            toast(error.message)
            return;
        }
        if (data) {
            const { id, token, role, username } = data.signIn;
            dispatch(login({ id, token, username, role }))
            setToken(token)
            return;
        }



    }, [loginData, dispatch])
    React.useEffect(() => {

        const { loading, error, data } = signupData;
        if (loading) return;
        if (error) return toast(error.message);
        if (data) {
            const { id, token, role, username } = data.signUp;
            dispatch(login({ id, token, username, role }))
            setToken(token)
        }



    }, [signupData, dispatch])

    return { onLogin, onSignUp }
}