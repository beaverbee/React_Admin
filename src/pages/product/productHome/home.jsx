import React, { useState, useEffect, useRef } from "react";
import { Card, Select, Input, Button, Table, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import "./home.less";
import {
  reqProduct,
  reqSearchProduct,
  reqUpdateProductStatus,
} from "../../../api";
import {
  PAGE_SIZE,
  NAME_SEARCH,
  DESC_SEARCH,
  ALL_SEARCH,
} from "../../../config/constant";
import { Link, useNavigate } from "react-router-dom";

const { Option } = Select;

// product的默认路由
export default function ProductHome() {
  const [dataSource, setDataSource] = useState([]);
  const [reqFlag, setReqFlag] = useState(true);
  const [curPage, setCurPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [searchFlag, setSearchFlag] = useState(ALL_SEARCH);
  const searchInput = useRef("");
  const navigate = useNavigate();

  const title = (
    <span className="header-select">
      <Select
        defaultValue={NAME_SEARCH}
        onChange={(value) => {
          setSearchFlag(value);
        }}
      >
        <Option value={NAME_SEARCH}>按名称搜索</Option>
        <Option value={DESC_SEARCH}>按描述搜索</Option>
      </Select>
      <Input
        placeholder="请输入关键字"
        style={{ width: "200px" }}
        ref={searchInput}
      ></Input>
      <Button
        type="primary"
        shape="round"
        onClick={async () => {
          if (searchFlag === ALL_SEARCH) {
            setSearchFlag(NAME_SEARCH);
          }
          await reqDataSource(
            searchFlag === ALL_SEARCH ? NAME_SEARCH : searchFlag,
            1,
            searchInput.current.state.value
          );
          setCurPage(1);
        }}
      >
        搜索
      </Button>
    </span>
  );
  const extra = (
    <Button
      type="primary"
      shape="round"
      onClick={() => {
        navigate("add_update");
      }}
    >
      <PlusOutlined />
      添加商品
    </Button>
  );

  const columns = [
    {
      title: "商品名称",
      dataIndex: "name",
      key: "name",
      width: "25%",
    },
    {
      title: "商品描述",
      dataIndex: "desc",
      key: "desc",
      width: "45%,",
    },
    {
      title: "价格",
      dataIndex: "price",
      key: "price",
      width: "10%",
      render: (price) => "￥" + price,
    },
    {
      title: "状态",
      key: "status",
      width: "8%",
      // 当不指定dataindex后传入的就是完整数据
      render: (product) => {
        const { status, _id } = product;
        return (
          <div className="product-state">
            <Button
              type="primary"
              shape="round"
              onClick={() => {
                updataProductStatus(status, _id);
              }}
            >
              {status === 1 ? "下架" : "上架"}
            </Button>
            <span>{status === 1 ? "在售" : "已下架"}</span>
          </div>
        );
      },
    },
    {
      title: "操作",
      key: "action",
      width: "8%",
      render: (product) => {
        return (
          <span className="product-action">
            {/* 在渲染每一行的时候会给对应行传入相应的datasource 因此可以把它作为参数传过去 */}
            <Link to="detail" state={{ product }}>
              <span style={{ color: "#1DA57A" }}>详情</span>
            </Link>
            <Link to="add_update" state={{ ...product }}>
              <span style={{ color: "#1DA57A" }}>修改</span>
            </Link>
          </span>
        );
      },
    },
  ];

  const reqDataSource = async (searchFlag, reqPage, serchMsg) => {
    let result;
    if (searchFlag === ALL_SEARCH || serchMsg === "") {
      result = await reqProduct({
        pageNum: reqPage,
        pageSize: PAGE_SIZE,
      });
    } else {
      result = await reqSearchProduct({
        pageNum: reqPage,
        pageSize: PAGE_SIZE,
        seachMsg: serchMsg,
        flag: searchFlag,
      });
    }
    const {
      cancel,
      response: { status, statusText, data },
    } = result;
    if (status === 200 && statusText === "OK") {
      setTotalPage(data.data.total);
      setDataSource(data.data.list);
      setReqFlag(false);
    } else {
      message.error("获取商品信息失败");
    }
    return cancel;
  };

  const updataProductStatus = async (status, _id) => {
    await reqUpdateProductStatus({
      productId: _id,
      status: status === 1 ? 2 : 1,
    });

    reqDataSource(ALL_SEARCH);
  };

  useEffect(() => {
    const cancel = reqDataSource(searchFlag, 1);
    return () => {
      cancel.then((cancel) => {
        cancel();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Card title={title} extra={extra}>
      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="_id"
        className="product-table"
        loading={reqFlag}
        pagination={{
          defaultPageSize: PAGE_SIZE,
          total: totalPage,
          position: { label: "bottomRight", value: "bottomRight" },
          showQuickJumper: true,
          current: curPage,
          onChange: (page) => {
            reqDataSource(searchFlag, page, searchInput.current.state.value);
            setCurPage(page);
          },
        }}
      ></Table>
    </Card>
  );
}
