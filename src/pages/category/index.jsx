import React, { useState, useEffect } from "react";
import "./index.less";
import { Card, Table, Button, message, Modal, Form } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import {
  reqCategory,
  reqAddCategory,
  reqUpdateCategory,
} from "../../api/index";
import AddForm from "../../components/AddForm";
import UpdateForm from "../../components/UpdateForm";
import { PAGE_SIZE, CLOSE, ADD, UPDATE } from "../../config/constant";

export default function Category() {
  // eslint-disable-next-line no-unused-vars
  const [title, setTitle] = useState([{ title: "商品分类", parentId: "0" }]);
  const [reqFlag, setReqFlag] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [parentId, setParentId] = useState("0");
  const [isModalVisible, setIsModalVisible] = useState(0);
  const [categoryList, setCategoryList] = useState({ name: "", id: "" });
  const [AddCategoryForm] = Form.useForm();
  const [UpdateCategoryForm] = Form.useForm();

  const columns = [
    {
      title: "商品分类",
      dataIndex: "name", //这个是用于与database匹配的标签
      key: "name",
      width: "500px",
    },
    {
      title: "执行操作",
      // render属性可以在table的某一列中渲染指定元素 渲染时候已经带参数了 后续的子组件直接使用即可
      render: (dataSource) => {
        //dataSource:{parentId: '0', _id: '5e12b8bce31bb727e4b0e348', name: '家用电器', __v: 0}
        return (
          <span>
            <Button
              type="link"
              onClick={() => {
                // 修改选中categoryName 因为Modal渲染是根据这名字渲染的
                setCategoryList({ name: dataSource.name, id: dataSource._id });
                // 修改完categoryName后打开修改界面
                setIsModalVisible(UPDATE);
              }}
            >
              修改名字
            </Button>
            <Button
              type="link"
              onClick={() => {
                // ps:在onclick函数中传参的是event对象 即当前的组件 不要弄混淆 这里需要用的是render传入的参数 并不是onClick传入的参数
                // 至于传入的参数就是需要渲染的数据源本身 因为table是更具数组中每一条数据进行渲染
                // 该点击函数是用于请求数据并进行页面刷新
                addCategoryTitle(dataSource);
              }}
            >
              查看详情
            </Button>
          </span>
        );
      },
      width: "25%",
    },
  ];
  // 一下实现标题更改以及对应查询问题
  // 一方面 需要记住setTitle是异步更改 不能直接使用
  // 对标题的修改则是用数组记录点击请求 后来想title中就添加index参数可能就没这么麻烦 就不需要用findIndex进行匹配

  const addCategoryTitle = async (dataSource) => {
    // 该函数的作用是查看详情时修改追加title的值
    setTitle([
      ...title,
      { title: dataSource.name, parentId: dataSource["_id"] },
    ]);
    //{parentId: '0', _id: '5e12b8bce31bb727e4b0e348', name: '家用电器', __v: 0}
    setParentId(dataSource["_id"]);
  };

  const updateCategoryTitle = (parentId) => {
    // 该函数用于点击相应title时 修改title的值并回退到该title对应的categories
    // title:[{title:'',parent_id:''}]
    const clickIndex = title.findIndex((item) => {
      return item.parentId === parentId;
    });
    const newTitle = title.splice(0, clickIndex + 1);
    addCategoryTitle({
      name: newTitle[newTitle.length - 1].title,
      _id: newTitle[newTitle.length - 1].parentId,
    });
    setTitle(newTitle);
    // 这里settitle是异步函数 就不要想着执行完再走后续代码 异步代码只会在同步代码执行完后执行
  };

  const updateCategory = async (form, categoryId) => {
    // 该函数是用于修改数据库中category的name属性 最后刷新页面
    const { categoryName } = form.getFieldsValue();
    const result = await reqUpdateCategory({ categoryName, categoryId });
    const { status } = result.response.data;
    if (status === 0) {
      reqDataSource();
    } else {
      message.warn(result.response.data.msg);
    }
  };

  const addCategory = async (form) => {
    // 该函数用于向服务器添加Category数据 并将页面加载添加的分类中
    const { parentId, categoryName } = form.getFieldsValue();
    const result = await reqAddCategory({ categoryName, parentId });

    const { status } = result.response.data;
    // data ：{parentId,_id,name}
    // 请求完数据直接请求完整数据进行刷新
    if (status === 0) {
      reqDataSource();
    } else {
      message.warn(result.response.data.msg);
    }
    setIsModalVisible(CLOSE);
  };

  const reqDataSource = async () => {
    // 该函数用于向服务器请求Category数据
    const {
      response: {
        statusText,
        status,
        data: { data },
      },
      cancel,
    } = await reqCategory(parentId);
    if (statusText === "OK" && status === 200) {
      // 此处决定dataSource的格式 data:[...{parentId:'',_id:'',name:'', __v: ''}]
      setDataSource(data);
      setReqFlag(false);
    } else {
      message.error("获取分类列表失败");
    }
    return cancel;
  };

  useEffect(() => {
    const cancel = reqDataSource();
    return () => {
      // 此处实现了个微不足道的功能：在低网速的情况下在卸载时取消axios请求 避免返回的数据造成内存泄漏
      cancel.then((cancel) => {
        cancel();
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentId]);
  // ps:在useEffect中改变的参数就不要让react监视 因为执行一次修改一次 修改又会导致新的执行 进入死循环
  return (
    <>
      <Card
        title={title.map((item) => {
          return (
            <span key={item.parentId}>
              <span
                className="table-title"
                onClick={() => {
                  updateCategoryTitle(item.parentId);
                }}
              >
                {item.title}
                <span className="iconfont icon-jiantou"></span>
              </span>
            </span>
          );
        })}
        extra={
          <Button
            type="primary"
            shape="round"
            onClick={() => {
              setIsModalVisible(ADD);
            }}
          >
            <PlusCircleFilled />
            添加
          </Button>
        }
        style={{ width: "100%" }}
        className="category-card"
      >
        {/* Table标签自带页面栏 估计在columns中设置表格多少列  每列数据分别是什么 name用于匹配数据源中的数据*/}
        <Table
          dataSource={dataSource} //后续列表传参的格式就是dataSource的格式
          columns={columns}
          rowKey="_id"
          pagination={{
            defaultPageSize: PAGE_SIZE,
            position: { label: "bottomRight", value: "bottomRight" },
            showQuickJumper: true,
          }}
          loading={reqFlag}
        />
      </Card>
      <Modal
        title="添加商品"
        visible={isModalVisible === ADD}
        onOk={() => {
          addCategory(AddCategoryForm);
        }}
        onCancel={() => {
          setIsModalVisible(CLOSE);
        }}
      >
        <AddForm
          form={AddCategoryForm}
          category={dataSource}
          parentId={parentId}
        ></AddForm>
      </Modal>
      <Modal
        title="修改商品名称"
        visible={isModalVisible === UPDATE}
        onOk={() => {
          updateCategory(UpdateCategoryForm, categoryList.id);
          UpdateCategoryForm.setFieldsValue({ categoryName: "" });
          setIsModalVisible(0);
        }}
        onCancel={() => {
          UpdateCategoryForm.setFieldsValue({ categoryName: "" });
          setIsModalVisible(0);
        }}
      >
        <UpdateForm
          categoryName={categoryList.name}
          form={UpdateCategoryForm}
        ></UpdateForm>
      </Modal>
    </>
  );
}
