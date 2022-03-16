import React, { useEffect, useState } from "react";
import { Card, List } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import "./index.less";
import github from "../../../assets/images/default.png";
import { reqCategoryById } from "../../../api";

// product 的详情路由
export default function ProductDetail() {
  const [categoryList, setCategoryList] = useState("");
  const navigate = useNavigate();
  // useLocation函数能获得路由传来的相关信息 包括上级路径 state传参等
  const {
    state: {
      product: { name, desc, price, imgs, categoryId, detail },
    },
  } = useLocation();
  const title = (
    <span
      className="detail-title"
      onClick={() => {
        navigate(-1);
      }}
    >
      <LeftOutlined style={{ marginRight: "10px", fontSize: "20px" }} />
      商品详情
    </span>
  );
  // 基于子id获得父级类别的函数
  const getCategoryList = async (categoryId) => {
    // debugger;
    const {
      response: {
        data: {
          data: { name, parentId },
        },
      },
    } = await reqCategoryById({ categoryId });
    setCategoryList((pre) => pre===''?name:name+'->'+pre);
    if (parentId !== "0") {
      getCategoryList(parentId);
    }
  };
  // 
  // 这里有个未知bug 就是useEffect会执行多次，因此需要添加监听变量？ 如果不添加监听变量effect好像会监听所有变量 可能会重复执行
  useEffect(() => {
    getCategoryList(categoryId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);
  return (
    <Card title={title}>
      <List>
        <List.Item>
          <span className="detail-header">
            商品名称: <span>{name}</span>
          </span>
        </List.Item>
        <List.Item>
          <span className="detail-header">
            商品描述: <span>{desc}</span>
          </span>
        </List.Item>
        <List.Item>
          <span className="detail-header">
            商品价格: <span>{price}</span>
          </span>
        </List.Item>
        <List.Item>
          <span className="detail-header">
            所属分类: <span>{categoryList}</span>
          </span>
        </List.Item>
        <List.Item>
          <span className="detail-header">
            商品图片:
            {imgs.map((item,index) => {
              return <img src={github} alt="#" key={-index}></img>;
            })}
          </span>
        </List.Item>
        <List.Item>
          <span
            className="detail-header"
            // dangerouslySetInnerHTML 该属性允许我们从外部注入html代码 格式为字符串格式 react会自动解析
          >
            商品详情:
            <span dangerouslySetInnerHTML={{ __html: detail }}></span>
          </span>
        </List.Item>
      </List>
    </Card>
  );
}
