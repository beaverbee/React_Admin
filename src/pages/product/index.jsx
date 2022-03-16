import React from "react";
import { useRoutes, Outlet } from "react-router-dom";
import routes from "../../routes";


export default function Product() {
  const element = useRoutes(routes);
  return (
    <div>
      <Outlet>{element}</Outlet>
    </div>
  );
}
