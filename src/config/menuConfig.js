import {
  AppstoreOutlined,
  BarChartOutlined,
  LineChartOutlined,
  PieChartOutlined,
  HomeOutlined,
  BarsOutlined,
  ToolOutlined,
  UserOutlined,
  SafetyOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";

const menuList = [
  {
    title: "首页",
    key: "/home",
    icon: <HomeOutlined></HomeOutlined>,
  },
  {
    title: "商品",
    key: "/products",
    icon: <AppstoreOutlined></AppstoreOutlined>,
    children: [
      {
        title: "品类管理",
        key: "/category",
        icon: <BarsOutlined></BarsOutlined>,
      },
      {
        title: "商品管理",
        key: "/product",
        icon: <ToolOutlined></ToolOutlined>,
      },
    ],
  },
  { title: "用户管理", key: "/user", icon: <UserOutlined></UserOutlined> },
  { title: "角色管理", key: "/role", icon: <SafetyOutlined></SafetyOutlined> },
  {
    title: "图形图表",
    key: "/charts",
    icon: <AreaChartOutlined></AreaChartOutlined>,
    children: [
      {
        title: "柱形图",
        key: "/charts/bar",
        icon: <BarChartOutlined></BarChartOutlined>,
      },
      {
        title: "折线图",
        key: "/charts/line",
        icon: <LineChartOutlined></LineChartOutlined>,
      },
      {
        title: "饼图",
        key: "/charts/pie",
        icon: <PieChartOutlined></PieChartOutlined>,
      },
    ],
  },
];

export default menuList;
