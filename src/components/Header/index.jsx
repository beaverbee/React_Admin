import React, { useEffect, useState } from "react";
import userStore from "../../utils/storageUtils";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./index.less";
import "../../assets/icons/weather/iconfont.css";
import menuList from "../../config/menuConfig";
import Weather from "../Weather";

export default function Header() {
  const userObj = userStore.getUser();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [title, setTitle] = useState("首页");
  const userLoginOut = () => {
    userStore.removeUser();
    navigate("/login", { replace: true });
  };

  const reqTitle = (pathname) => {
    // 该函数用于根据请求路由路径动态生成头标题
    let title = "首页";
    const titleMatch = (pathname, menuList) => {
      menuList.forEach((element) => {
        if (element.hasOwnProperty("children")) {
          titleMatch(pathname, element.children);
        } else {
          if (element.key === pathname) {
            title = element.title;
          }
        }
      });
      return title;
    };
    titleMatch(pathname, menuList);
    return title;
  };
 
  useEffect(() => {
    setTitle(reqTitle(pathname));
  }, [pathname]);

  return (
    <div className="top-header">
      <div className="top-header-top">
        <h3 className="top-login-message">
          {userObj !== null && userObj.username && userObj._id ? (
            <span>
              你好,{userObj.username} &nbsp;&nbsp;
              <Link to="/login" onClick={userLoginOut}>
                <span style={{fontSize:'14px'}}>退出登录</span>
              </Link>
            </span>
          ) : (
            <Link to="/login">
              <span>请登录</span>
            </Link>
          )}
        </h3>
      </div>
      <div className="top-header-bottom">
        <div className="top-header-bottom-left">
          <span>{title}</span>
        </div>
        <Weather></Weather>
      </div>
    </div>
  );
}
