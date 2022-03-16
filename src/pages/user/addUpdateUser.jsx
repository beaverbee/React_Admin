import React, { useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import { ADD } from "../../config/constant";
import { reqAddOrUpdateUser, reqUserList } from "../../api/";
import md5 from 'blueimp-md5'
const { Option } = Select;

export default function AddUpdateUser(props) {
  //   const [isModalVisible, setIsModalVisible] = useState(false);
  const {
    userState,
    user,
    userForm,
    modalFlag,
    setModalFlag,
    roles,
    setUsers,
  } = props;

  useEffect(() => {
    if (userState === ADD) {
      userForm.setFieldsValue({
        username: "",
        password: "",
        email: "",
        phone: "",
        role: "",
      });
    } else {
        userForm.setFieldsValue(user);
      userForm.setFieldsValue({
        email: user.email ? user.email.split("@")[0] : "",
      });
      userForm.setFieldsValue({
        suffix: "@" + (user.email ? user.email.split("@")[1] : ""),
      });
      

      if (user.role_id) {
        userForm.setFieldsValue({
          role: roles.find((item) => {
            return item._id === user.role_id;
          }).name,
        });
      }
    }
  }, [userForm, user, userState, roles]);

  const suffixSelector = (
    <Form.Item
      name="suffix"
      noStyle
      rules={[{ required: true, message: "请选择邮箱地址" }]}
    >
      <Select
        style={{
          width: 120,
        }}
      >
        <Option value="@163.com">@163.com</Option>
        <Option value="@qq.com">@qq.com</Option>
        <Option value="@outlook.com">@outlook.com</Option>
      </Select>
    </Form.Item>
  );
  return (
    <Modal
      title={userState === 1 ? "请添加用户信息" : "请修改用户信息"}
      visible={modalFlag}
      onOk={async () => {
        const result = await userForm.validateFields();
        const { email, suffix, role,password } = result;
        const emailAddress = email + suffix;
        const role_id = roles.find((item) => {
          return item.name === role;
        })._id;
        console.log(role_id);
        
        let newUser = {
          ...result,
          ...{ email: emailAddress, role_id, password: md5(password) },
        };
        if (user._id) {
          newUser = { ...newUser, ...{ _id: user._id} };
        }
        const {
          response: {
            data: { status },
          },
        } = await reqAddOrUpdateUser(newUser);
        if (status === 0) {
          message.success("添加/修改用户成功");
          const {
            response: {
              data: {
                data: { users },
              },
            },
          } = await reqUserList();
          setUsers(users);
        } else if (status === 1) {
          message.warn("用户已存在请重新添加");
        } else {
          message.error("添加用户失败");
        }
        setModalFlag(false);
      }}
      onCancel={() => {
        userForm.setFieldsValue({
          username: "",
          password: "",
          email: "",
          phone: "",
          role: "",
          suffix: "",
        });
        setModalFlag(false);
      }}
      okText="提交"
      cancelText="取消"
    >
      <Form
        name="userForm"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        form={userForm}
      >
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input></Input>
        </Form.Item>
        <Form.Item
          label="手机号"
          name="phone"
          rules={[{ required: true, message: "请输入手机号" }]}
        >
          <Input type="number"></Input>
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="email"
          rules={[{ required: true, message: "请输入邮箱" }]}
        >
          <Input addonAfter={suffixSelector}></Input>
        </Form.Item>
        <Form.Item
          label="角色"
          name="role"
          rules={[{ required: true, message: "请选择角色" }]}
        >
          <Select
            style={{
              width: 200,
            }}
          >
            <Option value="测试">测试</Option>
            <Option value="管理员">管理员</Option>
            <Option value="员工">员工</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
