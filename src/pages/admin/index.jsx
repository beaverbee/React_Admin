import React from "react";
import {  useRoutes, Outlet } from "react-router-dom";
import routes from "../../routes";
import { Layout } from "antd";
import LeftNav from "../../components/leftNav";
import "./index.less";
import Header from "../../components/Header";

const { Footer, Sider, Content } = Layout;

export default function Admin() {
  const element = useRoutes(routes);

  return (
    <Layout className="layout">
      <Sider width={250}>
        <LeftNav></LeftNav>
      </Sider>
      <Layout>
        <Header></Header>
        <Content className="mid-content">
          {/* 如果只是想在页面局部渲染部分组件/路由 需要用Outlet 作为插槽占位 后续陆游将根据插槽位置进行渲染 如果不添加应该是会整个页面渲染导致卡死 */}
          <Outlet>{element}</Outlet>
        </Content>
        <Footer className="bot-footer">
          推荐使用谷歌浏览器，可以获得最佳操作体验
        </Footer>
      </Layout>
    </Layout>
  );
}
