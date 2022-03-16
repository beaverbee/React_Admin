import React, { useEffect, useState } from "react";
import { Card, Table, Button, Modal, message, Form } from "antd";
import {
  PlusCircleFilled,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { formDate } from "../../utils/DataUtils";
import { reqUserList, reqDeleteUser } from "../../api";
import { PAGE_SIZE, ADD, UPDATE, CLOSE } from "../../config/constant";
import AddUpdateUser from "./addUpdateUser";
const { confirm } = Modal;

export default function User() {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [userState, setUserState] = useState(CLOSE);
  const [modalFlag, setModalFlag] = useState(false);
  const [roles,setRoles]=useState([])
  const [userForm] = Form.useForm();
  const title = (
    <Button
      type="primary"
      onClick={() => {
        setUser({});
        setUserState(ADD);
        setModalFlag(true);
      }}
    >
      <PlusCircleFilled></PlusCircleFilled>添加用户
    </Button>
  );
  const columns = [
    {
      title: "用户名字",
      dataIndex: "username",
      width: "15%",
    },
    {
      title: "用户电话",
      dataIndex: "phone",
      width: "15%",
    },
    {
      title: "用户邮箱",
      dataIndex: "email",
      width: "15%",
    },
    {
      title: "注册时间",
      dataIndex: "create_time",
      width: "15%",
      render: formDate,
    },
    {
      title: "操作",
      width: "15%",
      render: (userList) => {
        return (
          <span key={userList._id}>
            <Button
              type="link"
              onClick={() => {
                setUser(userList);
                setUserState(UPDATE);
                setModalFlag(true);
              }}
            >
              <EditOutlined></EditOutlined>修改
            </Button>
            <Button
              type="link"
              onClick={() => {
                showConfirm(userList);
              }}
            >
              <DeleteOutlined />
              删除
            </Button>
          </span>
        );
      },
    },
  ];

  const reqUser = async () => {
    const {
      cancel,
      response: {
        data: {
          data: { users,roles },
          status,
        },
      },
    } = await reqUserList();
    if (status === 0) {
      setUsers(users);
      setRoles(roles);
    }
    return cancel;
  };

  function showConfirm(userList) {
    confirm({
      title: "删除用户",
      icon: <ExclamationCircleOutlined />,
      content: "是否删除" + userList.username + "用户",
      async onOk() {
        const {
          response: {
            data: { status },
          },
        } = await reqDeleteUser(userList._id);
        if (status === 0) {
          message.success("删除用户" + userList.username + "成功");
          reqUser();
        }
      },
    });
  }

  useEffect(() => {
    const cancel = reqUser();
    return cancel;
  }, []);
  return (
    <Card title={title}>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        pagination={{
          defaultPageSize: PAGE_SIZE,
          position: { label: "bottomRight", value: "bottomRight" },
          showQuickJumper: true,
        }}
      ></Table>
      <AddUpdateUser
        userState={userState}
        user={user}
        userForm={userForm}
        modalFlag={modalFlag}
        setModalFlag={setModalFlag}
        roles={roles}
        setUsers={setUsers}
      ></AddUpdateUser>
    </Card>
  );
}
