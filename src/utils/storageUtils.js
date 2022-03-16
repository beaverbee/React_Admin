// 该模块采用localstorage存储用户信息 并提供相应操作的api
const USER = "user";

const userStore = {
  saveUser: (user) => {
    localStorage.setItem(USER, JSON.stringify(user));
  },
  // 这里有一个细节 当localstorage中没有user时将返回undefined 后续如果还强行读取里面内容会报错 因此可以让其解析空对象
  getUser: () => JSON.parse(localStorage.getItem(USER) || "{}"),
  removeUser: () => { 
    localStorage.removeItem(USER);
  },
};

export default userStore;
