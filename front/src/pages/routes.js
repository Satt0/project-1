import LoginPage from "./authen";
import AdminRouting from "./admin";
import AuthenLayout from "components/AuthenLayout";

const routes = [
  {
    path: "/admin",
    name: "admin",
    Page: (props) => (
      <AuthenLayout req={1}>
        <AdminRouting {...props} />
      </AuthenLayout>
    ),
    role: 3,
  },

  {
    path: "/",
    name: "public/search_for_products",
    Page: LoginPage,
    role: -1,
  },
];
export default routes;
