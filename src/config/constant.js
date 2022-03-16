export const PAGE_SIZE = 5; //每页显示的条数

//高德查询相关常量
export const IP_URL = "https://restapi.amap.com/v3/ip?"; //IP api请求url
export const WEATHER_URL = "https://restapi.amap.com/v3/weather/weatherInfo?"; //天气 api请求 url
export const KEY = "602d9e141dd2898214373b04d65121a8"; //高德地图个人key

//各模块对应url路径
export const CATEGORY = "/manage/category";
export const PRODUCT = "/manage/product";
export const ROLE = "/manage/role";
export const USER = "/manage/user";
export const IMG = "/manage/img";

//增删改查对应常量标记
export const CLOSE = 0;
export const ADD = 1;
export const UPDATE = 2;

// 按名字检索或描述检索常量标记
export const ALL_SEARCH = 0;
export const NAME_SEARCH = 1;
export const DESC_SEARCH = 2;
// 上传图片的基础路径
export const BASE_IMG_URL='/upload'