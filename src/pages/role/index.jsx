import React, { useState, useEffect } from "react";
import { Card, Button, Table, Modal, Form, Input, message, Tree } from "antd";
import { PlusCircleFilled, EditOutlined } from "@ant-design/icons";
import { PAGE_SIZE } from "../../config/constant";
import "./index.less";
import { reqRoleList, reqAddRole, reqUpdateRole } from "../../api";
import menuList from "../../config/menuConfig.js";
import { formDate } from "../../utils/DataUtils";

export default function Role() {
  const [roles, setRoles] = useState([]);
  const [role, setRole] = useState({}); //标记选中的role
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [addRoleForm] = Form.useForm();
  const [UpdateRoleForm] = Form.useForm();
  const [expandedKeys, setExpandedKeys] = useState([]); //expandedKeys记录所有展开的key
  const [checkedKeys, setCheckedKeys] = useState([]); //checkKey记录所有选中的key
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const title = (
    <div className="role-card-title">
      <Button
        type="primary"
        shape="round"
        className="title-button"
        onClick={() => {
          setIsAddModalVisible(true);
        }}
      >
        <PlusCircleFilled></PlusCircleFilled>创建角色
      </Button>
      <Button
        type="primary"
        shape="round"
        className="title-button"
        disabled={!role._id}
        onClick={() => {
          setDefaultTrees(role.menus);

          setIsUpdateModalVisible(true);
        }}
      >
        <EditOutlined />
        设置角色权限
      </Button>
    </div>
  );

  const columns = [
    {
      title: "角色名字",
      dataIndex: "name",
      width: "15%",
    },
    {
      title: "创建时间",
      dataIndex: "create_time",
      width: "20%",
      render: (time) => formDate(time),
    },
    {
      title: "授权时间",
      dataIndex: "auth_time",
      width: "20%",
      render: (time) => formDate(time),
    },
    {
      title: "授权者",
      dataIndex: "auth_name",
      width: "15%",
    },
  ];

  // const treeData = [
  //   {
  //     title: "0-0",
  //     key: "0-0",
  //     children: [
  //       {
  //         title: "0-0-0",
  //         key: "0-0-0",
  //         children: [
  //           { title: "0-0-0-0", key: "0-0-0-0" },
  //           { title: "0-0-0-1", key: "0-0-0-1" },
  //           { title: "0-0-0-2", key: "0-0-0-2" },
  //         ],
  //       },
  //       {
  //         title: "0-0-1",
  //         key: "0-0-1",
  //         children: [
  //           { title: "0-0-1-0", key: "0-0-1-0" },
  //           { title: "0-0-1-1", key: "0-0-1-1" },
  //           { title: "0-0-1-2", key: "0-0-1-2" },
  //         ],
  //       },
  //       {
  //         title: "0-0-2",
  //         key: "0-0-2",
  //       },
  //     ],
  //   },
  //   {
  //     title: "0-1",
  //     key: "0-1",
  //     children: [
  //       { title: "0-1-0-0", key: "0-1-0-0" },
  //       { title: "0-1-0-1", key: "0-1-0-1" },
  //       { title: "0-1-0-2", key: "0-1-0-2" },
  //     ],
  //   },
  //   {
  //     title: "0-2",
  //     key: "0-2",
  //   },
  // ];

  const setDefaultTrees = (roleMenus) => {
    const newMenu = [...roleMenus];
    if (newMenu[0] === "all") {
      newMenu.shift();
    }
    setCheckedKeys(newMenu);
    setExpandedKeys(newMenu);
  };

  const onExpand = (expandedKeysValue) => {
    //console.log("onExpand", expandedKeysValue); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    //本质上Tree不具备自动展开功能，只不过可以收集展开的数据 自己还得手动修改
    setExpandedKeys(expandedKeysValue);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeysValue) => {
    setCheckedKeys(checkedKeysValue);
  };

  const onRow = (checkrole) => {
    //这一属性用于确定对表格中某一行的事件处理回调函数 参数是表格传入的数据
    return {
      onClick: () => {
        setRole(checkrole);
        UpdateRoleForm.setFieldsValue({ role: checkrole.name });
      }, // 点击行
    };
  };

  const handleAddRole = async () => {
    const roleName = addRoleForm.getFieldValue("role");
    const {
      response: {
        data: { status, data },
      },
    } = await reqAddRole(roleName);
    if (status === 0) {
      message.success("添加角色成功");
      addRoleForm.resetFields();
      const newRole = [...roles, data];
      setRoles(newRole);
      setIsAddModalVisible(false);
    } else {
      message.error("添加角色失败");
    }
  };

  const handleCancel = () => {
    setIsAddModalVisible(false);
  };

  const handleUpdateRole = async () => {
    role.menus = checkedKeys;
    const {
      response: { data },
    } = await reqUpdateRole(role);
    if (data.status === 0) {
      message.success("修改角色权限成功");
    } else {
      message.error("修改角色权限失败");
    }
    setIsUpdateModalVisible(false);
  };

  const reqRole = async () => {
    const {
      cancel,
      response: {
        data: { data },
      },
    } = await reqRoleList();
    setRoles(data);
    return cancel;
  };

  useEffect(() => {
    const cancel = reqRole();
    return cancel;
  }, []);

  return (
    <Card title={title}>
      <Table
        dataSource={roles}
        pagination={{ defaultPageSize: PAGE_SIZE }}
        columns={columns}
        rowKey="_id"
        rowSelection={{
          type: "radio",
          columnWidth: "5%",
          selectedRowKeys: [role._id], //ps:role是单个role的信息 选中时就修改它就行了
          onSelect: (checkrole) => {
            UpdateRoleForm.setFieldsValue({ role: role.name });
            setRole(checkrole);
          },
        }}
        onRow={onRow}
      ></Table>
      <Modal
        visible={isAddModalVisible}
        onOk={handleAddRole}
        onCancel={handleCancel}
        title="创建新角色"
      >
        <Form
          name="addRole"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          form={addRoleForm}
        >
          <Form.Item
            label="角色名称"
            name="role"
            rules={[{ required: true, message: "请输入角色名字" }]}
          >
            <Input placeholder="请输入角色名称"></Input>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="修改角色权限"
        visible={isUpdateModalVisible}
        onOk={handleUpdateRole}
        onCancel={() => {
          setIsUpdateModalVisible(false);
        }}
      >
        <Form form={UpdateRoleForm} initialValues={{ role: role.name }}>
          <Form.Item
            label="角色名称"
            name="role"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 16 }}
          >
            <Input placeholder="请输入角色名称"></Input>
          </Form.Item>
          <Form.Item>
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={expandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={checkedKeys}
              treeData={menuList}
            ></Tree>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
