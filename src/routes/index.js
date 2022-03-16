import Login from "../pages/login";
import Admin from "../pages/admin";
import Home from "../pages/home";
import Category from "../pages/category";
import Product from "../pages/product";
import Role from "../pages/role";
import User from "../pages/user";
import Bar from "../pages/charts/bar";
import Line from "../pages/charts/line";
import Pie from "../pages/charts/pie";
import ProductHome from "../pages/product/productHome/home.jsx";
import AddUpdateProduct from "../pages/product/addUpdateProduct/addUpdateProduct";
import ProductDetail from "../pages/product/productDetail/productdetail";

const routes = [
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "*",
    element: <Admin></Admin>,
    children: [
      {
        path: "*",
        element: <Home></Home>,
      },
      {
        path: "home",
        element: <Home></Home>,
      },
      {
        path: "category",
        element: <Category></Category>,
      },
      {
        path: "role",
        element: <Role></Role>,
      },
      {
        path: "user",
        element: <User></User>,
      },
      {
        path: "product/*",
        element: <Product></Product>,
        children: [
          {
            path: "*",
            element: <ProductHome></ProductHome>,
          },
          {
            path: "producthome",
            element: <ProductHome></ProductHome>,
          },
          {
            path: "detail",
            element: <ProductDetail></ProductDetail>,
          },
          {
            path: "add_update",
            element: <AddUpdateProduct></AddUpdateProduct>,
          },
        ],
      },
      {
        path: "bar",
        element: <Bar></Bar>,
      },
      {
        path: "line",
        element: <Line></Line>,
      },
      {
        path: "pie",
        element: <Pie></Pie>,
      },
    ],
  },
];

export default routes;
