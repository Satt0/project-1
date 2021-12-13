import LoginPage from './authen'
import AdminRouting from './admin'


const routes=[
    {
        path:'/admin',
        name:'admin',
        Page:AdminRouting,
        role:3
    },
    
    {
        path:'/',
        name:'public/search_for_products',
        Page:LoginPage,
        role:-1
    },

    
]
export default routes