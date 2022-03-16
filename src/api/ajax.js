// 该模块用于发送异步ajax请求
// 封装axios
// 函数返回值是promise对象
// 统一处理请求异常

import axios from "axios";
import { message } from "antd";

let CancelToken = axios.CancelToken;
let cancel;

export default function ajax(url, data = {}, type = "GET") {
  // 当调用该函数时返回一个promise对象 该对象的执行函数为axios请求 返回结果仍为promise对象 这里不写reject因为reject会产生失败的peomise对象并抛给上层页面层
  return new Promise((resolve, reject) => {
    let promise;
    if (type === "GET") {
      promise = axios.get(url, {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        }),
        //指定请求参数
        params: data,
      });
    } else {
      promise = axios.post(url, data, {
        cancelToken: new CancelToken(function executor(c) {
          cancel = c;
        }),
      });
    }
    promise
      .then((response) => {
        resolve({ response, cancel }); //可以理解为当axios请求成功时执行resolve 返回成功的promise 可以理解在业务层底层实现报错功能
      })
      .catch((error) => {
        message.error("请求出错" + error.message);
      });
  });
}
