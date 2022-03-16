import React, { useState } from "react";
import { Form, Select, Input } from "antd";
const { Option } = Select;

// 父子组件间的表单通信 在更新过后的antd中 需要创建form实例然后交给Form表单进行数据处理
// 因此可以在父组件中创建好form然后传参给子组件的表单中 子组件拿到数据然后submit即可
export default function AddForm(props) {
  // category{parentId: '0', _id: '5e12b8bce31bb727e4b0e348', name: '家用电器', __v: 0}
  const { form, category,parentId } = props;

  // eslint-disable-next-line no-unused-vars
  const [formLayout, setFormLayout] = useState("horizontal");
  const formItemLayout =
    formLayout === "horizontal"
      ? {
          labelCol: {
            span: 4,
          },
          wrapperCol: {
            span: 14,
          },
        }
      : null;

  return (
    <>
      {/*有一个小bug 就是form.item的默认选项不推荐使用 推荐在主表单Form中添加初始默认值initialValues 用键值对匹配  */}
      <Form
        {...formItemLayout}
        layout={formLayout}
        form={form}
        initialValues={{
          layout: formLayout,
          parentId: parentId,
        }}
      >
        <Form.Item name="parentId" label="所属分类">
          <Select style={{ width: 120 }}>
            <Option value={parentId}>新建标签</Option>
            {category.map((item) => {
              return (
                <Option key={item["_id"]} value={item["_id"]}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name="categoryName"
          label="商品名称"
          rules={[{ required: true, message: "商品名称不能为空" }]}
        >
          <Input placeholder="请输入商品名称"></Input>
        </Form.Item>
      </Form>
    </>
  );
}
