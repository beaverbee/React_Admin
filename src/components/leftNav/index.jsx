import React, { useState } from "react";
import logo from "../../assets/images/GitHub.png";
import "./index.less";
import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";
import menuList from "../../config/menuConfig";
import userStore from "../../utils/storageUtils";

const { SubMenu } = Menu;

export default function LeftNav() {
  // useLocation函数能获得路由传来的相关信息 包括上级路径 state传参等
  const location = useLocation();
  // eslint-disable-next-line no-unused-vars
  const [theme, _] = useState("dark");
  const [current, setCurrent] = useState(location.pathname);
  const {
    role: { menus },
    username,
  } = userStore.getUser();
  console.log(username);
  let openKey = "";
  // 这里代码逻辑和视频不同 此处是仅在点击左侧导航栏时才会修改current的值 从而导致左侧导航栏的高亮
  // 实际上并不是通过路径修改的
  const handleClick = (e) => {
    setCurrent(e.key);
  };
  // 根据menu数组生成对应的菜单html代码 动态生成菜单列表
  // const getMenuNodes = (MenuList) => {
  //   return MenuList.map((item) => {
  //     if (!item.children) {
  //       return (
  //         <Menu.Item key={item.key} icon={item.icon} style={{ height: "60px" }}>
  //           <Link to={item.key}>{item.title}</Link>
  //         </Menu.Item>
  //       );
  //     } else {
  //       if (
  //         item.children.find((item) => {
  //           return item.key === current;
  //         })
  //       ) {
  //         openKey = item.key;
  //       }
  //       return (
  //         <SubMenu key={item.key} icon={item.icon} title={item.title}>
  //           {getMenuNodes(item.children)}
  //         </SubMenu>
  //       );
  //     }
  //   });
  // };

  const getMenuNodes = (MenuList) => {
    // debugger;
    return MenuList.reduce((renderList, item) => {
      if (!item.children) {
        if (
          menus.findIndex((menu) => {
            return menu === item.key;
          }) !== -1 ||
          username==='admin'
        ) {
          renderList.push(
            <Menu.Item
              key={item.key}
              icon={item.icon}
              style={{ height: "60px" }}
            >
              <Link to={item.key}>{item.title}</Link>
            </Menu.Item>
          );
        }
        return renderList;
      } else {
        if (
          item.children.find((item) => {
            return item.key === current;
          })
        ) {
          openKey = item.key;
        }
        if (
          menus.findIndex((menu) => {
            return menu === item.key;
          }) !== -1 ||
          username === "admin"
        ) {
          renderList.push(
            <SubMenu key={item.key} icon={item.icon} title={item.title}>
              {getMenuNodes(item.children)}
            </SubMenu>
          );
        } else {
          const subMenu = item.children.filter((child) => {
            return (
              menus.findIndex((menu) => {
                return menu === child.key;
              }) !== -1 || username === "admin"
            );
          });
          if (subMenu.length > 0) {
            renderList.push(
              <SubMenu key={item.key} icon={item.icon} title={item.title}>
                {getMenuNodes(item.children)}
              </SubMenu>
            );
          }
        }

        return renderList;
      }
    }, []);
  };

  const renderMenuList = getMenuNodes(menuList);
  return (
    <div className="left-nav">
      <Link to="/" className="left-nav-header">
        <img src={logo} alt="#"></img>
        <h1>电商后台</h1>
      </Link>
      <Menu
        theme={theme}
        onClick={handleClick}
        defaultOpenKeys={[openKey]}
        selectedKeys={[current]}
        mode="inline"
        className="left-nav-menu"
        style={{ width: "100%" }}
      >
        {renderMenuList}
      </Menu>
    </div>
  );
}
