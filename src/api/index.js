// 包含应用中所有接口函数的文件
// 之后所有的组件都会在这里调用相关的函数
// 可以理解为根据业务需求对api的进一步封装 api完成指定功能 而这里实现具体功能
import ajax from "./ajax";
import jsonp from "jsonp";
import { message } from "antd"; //参考axios的设计思路 底层错误的问题在底层进行处理并不抛给前台代码
import {
  IP_URL,
  WEATHER_URL,
  KEY,
  CATEGORY,
  PRODUCT,
  IMG,
  NAME_SEARCH,
  ROLE,
  USER,
} from "../config/constant";

export function reqLogin(username, password) {
  return ajax("/login", { username, password }, "POST");
}

export const reqAddOrUpdateUser = (user) => {
  return ajax(USER + (user._id ? "/update" : "/add"), user, "POST");
};

// ps:在高德地图提供的ip查询以及天气查询中后端解决了cors跨域问题 理论上我们是不需要用jsonp但这里仍用jsonp进行处理 jsonp提供get请求
// !!!在一般来说回调函数可以访问上下文的数据变量 但是无法修改 这里应该涉及js的闭包概念
// 如果想把数据抛出去 这里可以考虑promise对象进行封装 因为promise对象可以执行回调函数后获取数据并调用resolve/reject函数将数据封装为promise对象并返回
// tips:对于此可以是上层函数返回promise实例 该实例执行回调函数,回调函数中的结果用resolve,reject抛出
// ps:数据无法修改的原因是url请求是异步函数 在执行完之前已经将赋值语句执行 甚至已经返回 而jsonp不是promise对象 无法用async await进行阻塞限制
export const reqIp = () => {
  return new Promise((resolve) => {
    jsonp(IP_URL + "key=" + KEY, {}, (err, data) => {
      if (!err && data.status === "1") {
        const ipData = { city: data.city, adcode: data.adcode };
        resolve(ipData);
      } else {
        message.error("请求出错" + err);
      }
    });
  });
};

export const reqWeather = (city) => {
  return new Promise((resolve) => {
    jsonp(WEATHER_URL + "key=" + KEY + "&city=" + city, {}, (err, data) => {
      if (!err && data.status === "1") {
        const weatherData = {
          weather: data.lives[0].weather,
          time: data.lives[0].reporttime.split(" ")[0].replaceAll("-", "/"),
        };
        resolve(weatherData);
      } else {
        message.error("请求出错" + err);
      }
    });
  });
};

export const reqCategory = (parentId) =>
  ajax(CATEGORY + "/list", { parentId }, "GET");

//   一般来说更新后台数据都用post请求
export const reqAddCategory = ({ categoryName, parentId }) =>
  ajax(CATEGORY + "/add", { categoryName, parentId }, "POST");

export const reqUpdateCategory = ({ categoryName, categoryId }) =>
  ajax(CATEGORY + "/update", { categoryName, categoryId }, "POST");

// 根据id查询分类名字以及父类分类名字
export const reqCategoryById = ({ categoryId }) =>
  ajax(CATEGORY + "/info", { categoryId }, "GET");

// 后台分页设置  ：一次请求只获取当前页的数据 可以减轻服务器端负担以及网络传输负担 指定pageNum,pageSize
// 前台分页设置 :即一次性获取所有的数据 在前端控制展示的数据情况
export const reqProduct = ({ pageNum, pageSize }) =>
  ajax(PRODUCT + "/list", { pageNum, pageSize }, "GET");

// 按名字搜索以及按描述搜索对应的url请求
export const reqSearchProduct = ({ pageNum, pageSize, seachMsg, flag }) => {
  const params =
    flag === NAME_SEARCH
      ? { pageNum, pageSize, productName: seachMsg }
      : { pageNum, pageSize, productDesc: seachMsg };
  return ajax(PRODUCT + "/search", params, "GET");
};

export const reqUpdateProductStatus = ({ productId, status }) =>
  ajax(PRODUCT + "/updateStatus", { productId, status }, "POST");

export const reqAddOrUpdateProduct = (product) =>
  ajax(PRODUCT + (product._id ? "/update" : "/add"), product, "POST");

export const reqDeleteImg = (name) => ajax(IMG + "/delete", { name }, "POST");

// 获得管理人员数据的api
export const reqRoleList = () => ajax(ROLE + "/list", {}, "GET");

export const reqAddRole = (roleName) =>
  ajax(ROLE + "/add", { roleName }, "POST");

export const reqUpdateRole = (role) => ajax(ROLE + "/update", role, "POST");

export const reqUserList = () => ajax(USER + "/list", {}, "GET");

export const reqDeleteUser = (userId) =>
  ajax(USER + "/delete", { userId }, "POST");

// export const reqAddUser = (user) => ajax(USER + "/add",user,'POST');
