import React from 'react'
import styles from './authen.module.scss'
import AuthenForm from 'components/AuthenForm'
import { useLazyQuery, useMutation } from '@apollo/client'
import { USER_LOGIN, USER_SIGNUP } from 'api/graphql/query/user/authen'
import { login } from 'store/reducers/user'
import { useDispatch } from 'react-redux'
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
    const dispatch=useDispatch();

    const onLogin = ({ username, password }) => {
        getUser({
            variables: {
                input: {
                    username, password
                }
            }
        })
    }
    const onSignUp = async ({ username, password, repassword }) => {
        if (password !== repassword)
            return alert('password not match!')
        createUser({
            variables: {
                input: {
                    username, password, role: 0
                }
            }
        }).catch(e => { console.log(e.message); })
    }
    React.useEffect(() => {

        const { loading, error, data } = loginData;
        if (loading) return;
        if (error) return alert(error.message);
        if (data) {
            const { id, token, role, username } = data.signIn;
            dispatch(login({ id, token, username, role }))

        }



    }, [loginData])
    React.useEffect(() => {

        const { loading, error, data } = signupData;
        if (loading) return;
        if (error) return alert(error.message);
        if (data) {
            const { id, token, role, username } = data.signUp;
            dispatch(login({ id, token, username, role }))
        }



    }, [signupData])

    return { onLogin, onSignUp }
}