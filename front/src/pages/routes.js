import LoginPage from './authen'



const routes=[
    {
        path:'/',
        name:'public/homepage',
        Page:LoginPage,
        role:-1
    },
    {
        path:'/filter',
        name:'public/search_for_products',
        Page:LoginPage,
        role:-1
    },
    {
        path:'/search',
        name:'public/search_for_products',
        Page:LoginPage,
        role:-1
    },
    {
        path:'/product/:id',
        name:'public/product',
        Page:LoginPage,
        role:-1
    },
    {
        path:'/cart',
        name:'user/cart',
        Page:LoginPage,
        role:0
    },
    {
        path:'/checkout',
        name:'user/checkout',
        Page:LoginPage,
        role:0
    },
    {
        path:'/admin',
        name:'admin/dashboard',
        Page:LoginPage,
        role:1
    },
    {
        path:'/admin/all-product',
        name:'admin/view_all_products',
        Page:LoginPage,
        role:1
    },
    {
        path:'/admin/create-product',
        name:'admin/create_a_product',
        Page:LoginPage,
        role:1
    },
    {
        path:'/admin/edit-product/:id',
        name:'admin/edit_a_product',
        Page:LoginPage,
        role:1
    },
]
export default routes