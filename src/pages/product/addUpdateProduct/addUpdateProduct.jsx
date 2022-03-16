import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  Form,
  Input,
  Cascader,
  Button,
  message,
  Upload,
  Modal,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";

import {
  reqCategory,
  reqCategoryById,
  reqDeleteImg,
  reqAddOrUpdateProduct,
} from "../../../api/";
import { PlusOutlined } from "@ant-design/icons";
import { BASE_IMG_URL } from "../../../config/constant";
import RichTextEditoer from "./richTextEditoer";

const { TextArea } = Input;

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export default function AddUpdateProduct() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [options, setOptions] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [detail, setDetail] = useState("");
  const [id, setId] = useState("");
  const [categoryIdList, setCategoryIdList] = useState([]);
  const richEditorRef = useRef();
  // 此处使用state辨别是update还是add 当add时为无参数的路由跳转 因此state为null 而update时存在state参数 useLocation可以获得参数
  const { state } = useLocation();

  const title = (
    <span
      style={{ color: "#1DA57A", fontSize: 18, fontWeight: "bold" }}
      onClick={() => {
        navigate(-1);
      }}
    >
      <LeftOutlined />
      {state ? "修改商品" : "添加商品"}
    </span>
  );

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const reqDataSource = async (parentId) => {
    // 该函数用于向服务器请求Category数据
    const {
      response: {
        statusText,
        status,
        data: { data },
      },
      cancel,
    } = await reqCategory(parentId);
    let optionData = [];
    if (statusText === "OK" && status === 200) {
      // 此处决定dataSource的格式 data:[...{parentId:'',_id:'',name:'', __v: ''}]
      optionData = data.map((item) => {
        return { value: item._id, label: item.name, isLeaf: false };
      });
    } else {
      message.error("获取分类列表失败");
    }
    return [cancel, optionData];
  };

  const loadDatefunc = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    targetOption.loading = true;
    // eslint-disable-next-line no-unused-vars
    const [_, subCategoty] = await reqDataSource(targetOption.value);
    targetOption.loading = false;
    // 判断是否有下级节点
    if (subCategoty && subCategoty.length === 0) {
      targetOption.isLeaf = true;
    } else {
      targetOption.children = subCategoty;
    }
    setOptions([...options]);
  };

  const getCategoryList = async (categoryId, categoryList, idList) => {
    const {
      response: {
        data: {
          data: { name, parentId, _id },
        },
      },
    } = await reqCategoryById({ categoryId });
    categoryList.unshift(name);
    idList.unshift(_id);
    if (parentId !== "0") {
      await getCategoryList(parentId, categoryList, idList);
    }
  };

  const handleCancel = () => {
    return setPreviewVisible(false);
  };

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = async ({ file, fileList }) => {
    if (file.status === "done") {
      const result = file.response;
      if (result.status === 0) {
        message.success("上传图片成功");
      } else {
        message.error("上传图片失败");
      }
    } else if (file.status === "removed") {
      console.log(file);
      const { name } = file;
      if (name !== "default.png") {
        const {
          response: { status },
        } = await reqDeleteImg(name);
        if (status === 200) {
          message.success("删除图片成功");
        } else {
          message.error("删除图片失败");
        }
      } else {
        message.warn("默认图片无法删除");
      }
    }

    return setFileList(fileList);
  };

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  // react的异步问题后续需要深入了解
  useEffect(() => {
    let cancelfunc;
    let cList = [];
    let idList = [];
    const reqfun = async () => {
      if (state) {
        const { name, price, detail, desc, imgs, categoryId, _id } = state;
        const newfileList = imgs.map((img, index) => {
          let name;
          if (img.search(/\w(\.jpg)/) !== -1) {
            name = "default.png";
          } else {
            name = img;
          }
          return {
            uid: -index,
            name,
            status: "done",
            url: BASE_IMG_URL + "/" + name,
          };
        });
        setId(_id);
        setDetail(detail);
        setFileList(newfileList);

        await getCategoryList(categoryId, cList, idList); //反正异步请求都要被压入异步请求栈中执行 索性就等异步请求结束后再修改form表单属性
        setCategoryIdList(idList);
        form.setFieldsValue({
          name,
          price,
          desc,
          category: cList,
          picture: newfileList,
        });
      }
      await reqDataSource("0").then(([cancel, optionData]) => {
        cancelfunc = cancel;
        setOptions(optionData);
      });
    };
    reqfun();
    return cancelfunc;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card title={title} extra="">
      <Form labelCol={{ span: 2 }} wrapperCol={{ span: 8 }} form={form}>
        <Form.Item
          label="商品名称"
          name="name"
          rules={[{ required: true, message: "必须输入商品名称" }]}
        >
          <Input placeholder="商品名称"></Input>
        </Form.Item>
        <Form.Item
          label="商品描述"
          name="desc"
          rules={[{ required: true, message: "必须输入商品描述" }]}
        >
          <TextArea
            placeholder="商品描述"
            allowClear
            autoSize={{ minRows: 2, maxRows: 6 }}
          ></TextArea>
        </Form.Item>
        <Form.Item
          label="商品价格"
          name="price"
          rules={[
            { required: true, message: "必须输入商品价格" },
            {
              validator: (_, value) => {
                if (value <= 0) {
                  return Promise.reject("价格必须大于0");
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <Input type="number" placeholder="商品价格" addonAfter="元"></Input>
        </Form.Item>
        <Form.Item
          label="商品分类"
          name="category"
          rules={[{ required: true, message: "请选择分类" }]}
        >
          <Cascader
            options={options}
            placeholder="请选择分类"
            loadData={loadDatefunc}
            onChange={(select) => {
              setCategoryIdList(select);
            }}
          ></Cascader>
        </Form.Item>
        <Form.Item
          label="商品图片"
          name="picture"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              message: "请至少上传一张图片",
            },
          ]}
        >
          <Upload
            action="/manage/img/upload" //上传图片的接口地址
            accept="image/*"
            listType="picture-card"
            name="image" //请求参数名
            fileList={fileList} //指定上传文件的列表
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
        </Form.Item>
        <Form.Item
          label="商品详情"
          name="detail"
          labelCol={{ span: 2 }}
          wrapperCol={{ span: 16 }}
          valuePropName="value"
        >
          <RichTextEditoer ref={richEditorRef} detail={detail} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={async () => {
              const { name, desc, price, picture } =
                await form.validateFields();
              const categoryId = categoryIdList[categoryIdList.length - 1];
              const pCategoryId =
                categoryIdList.length >= 2
                  ? categoryIdList[categoryIdList.length - 2]
                  : "0";
              const imgs = picture.map((item) => {
                if (item.response) {
                  const {
                    response: {
                      data: { name },
                    },
                  } = item;
                  return name;
                } else {
                  return item.name;
                }
              });
              const detail = richEditorRef.current.getDetail();
              const submitData = {
                name,
                desc,
                price,
                categoryId,
                pCategoryId,
                imgs,
                detail,
              };
              if (id !== "") {
                submitData._id = id;
              }
              const {
                response: {
                  data: { status },
                  statusText,
                },
              } = await reqAddOrUpdateProduct(submitData);
              console.log(await reqAddOrUpdateProduct(submitData));
              if (statusText === "OK" && status === 0) {
                message.success("修改/添加商品信息成功");
                navigate(-1);
              } else {
                message.error("修改/添加商品信息失败");
              }
              console.log(submitData);
            }}
          >
            提交
          </Button>
        </Form.Item>
      </Form>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </Card>
  );
}
