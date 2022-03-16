import React from "react";
import { Input, Form } from "antd";

export default function UpdataForm(props) {
  const { categoryName, form } = props;
  return (
    <Form
      name="修改商品名称"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      form={form}
    >
      <Form.Item
        name="categoryName"
        rules={[{ required: true, message: "商品名称不能为空" }]}
      >
        <Input placeholder={categoryName}></Input>
      </Form.Item>
    </Form>
  );
}
