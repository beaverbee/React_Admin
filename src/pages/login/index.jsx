import React from "react";
import "./index.less";
import logo from "../../assets/images/logo.png";
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { reqLogin } from "../../api";
import { useNavigate,Link } from "react-router-dom";
import userStore from "../../utils/storageUtils";

export default function Login() {
  // hook函数的声明应该放在函数组件的开头 代码层面应该没问题 但eslint会进行语法检查报错
  // form为表单实例 作为参数传入表单组件中 此时表单即可获得输入的信息
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const onFinish = async (values) => {
    /*
    values:{
      password:string,
      remember:boolean,
      username:string
    }
     */
    const { username, password } = values;
    // 采用async和await实现异步执行 优化代码逻辑 目标是获得response以及对error进行处理
    // await 只有在promise对象中使用 其会异步等待promise对象执行结果
    const { response } = await reqLogin(username, password); //这里一定会获得一个成功的promise对象  因为await本来就是等待promise的resolve 失败的话就无事发生
    const { status } = response.data;
    console.log(response.data);
    if (status === 0) {
      message.success("登录成功");
      // 并进行路由跳转 response.data.data.username
      userStore.saveUser(response.data.data);
      navigate("/", { replace: true });
    } else {
      message.error(response.data.msg);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  // const formValidata = (event) => {
  //   const { username, password } = form.getFieldValue();
  //   console.log(username, password);
  //   if (password !== "") {
  //     form.submit();
  //   } else {
  //     console.log("error");
  //   }
  // };

  return (
    <div className="login">
      <header className="login-header">
        {/* 由于目前我们再jsx中写html的语句 因此静态资源需要通过import导入(webpack可以实现图片资源的导入) 在导入之后可以将其视为jsx的变量 传入html中*/}
        <img src={logo} alt="#"></img>
        <h1>后台管理系统</h1>
      </header>
      <section className="login-content">
        <h2>用户登录</h2>
        <div>
          <Form
            name="basic"
            labelCol={{
              // 控制提示信息宽度 应该是按比例分配的 一份是20.8px
              span: 6,
            }}
            wrapperCol={{
              // 控制输入框宽度 同样是按比例分配
              span: 16,
            }}
            initialValues={{
              remember: true,
            }}
            form={form}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="用户名"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
                {
                  pattern: /^[a-z0-9A-Z]+$/,
                  message: "用户名由大小写字母及数字组成",
                },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              />
            </Form.Item>

            <Form.Item
              // label为展示标签 name为传入标签
              label="密码"
              name="password"
              rules={[
                {
                  type: "string",
                  required: true,
                  message: "请输入密码",
                },
                // {
                //   min: 6,
                //   message: "密码至少大于6位少于20位",
                // },
                // {
                //   max: 20,
                //   message: "密码至少大于6位少于20位",
                // },
                // {
                //   pattern:
                //     /^.*(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*?])/,
                //   message: "密码必须包括大小写字母，数字以及特殊符号",
                // },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                offset: 3,
                span: 19,
              }}
            >
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
              </Form.Item>
              <Link className="login-form-forgot" to="/">
                Forgot password
              </Link>
            </Form.Item>

            <Form.Item
              wrapperCol={{
                offset: 4,
                span: 16,
              }}
            >
              <Button
                type="primary"
                htmlType="submit"
                className="Form-button"
                // onClick={formValidata}
              >
                登录
              </Button>
              <Link className="login-form-register" to='/'>
                还没账号，注册一个
              </Link>
            </Form.Item>
          </Form>
        </div>
      </section>
    </div>
  );
}
