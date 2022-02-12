import LoginPage from "./authen";
import AdminRouting from "./admin";
import AuthenLayout from "components/AuthenLayout";
import PublicRouting from "./public";
import UserRouting from "./user";
const routes = [
  {
    path: "/admin",
    name: "admin",
    Page: (props) => (
      <AuthenLayout req={1}>
        <AdminRouting {...props} />
      </AuthenLayout>
    ),
   
  },
  {
    path: "/login",
    name: "login",
    Page: LoginPage,
   
  },
  {
    path: "/user",
    name: "user/checkout",
    Page: (props) => (
      <AuthenLayout req={0}>
        <UserRouting {...props} />
      </AuthenLayout>
    ),
  },
  {
    path: "",
    name: "public/search_for_products",
    Page: PublicRouting,
    
  }

];
export default routes;
