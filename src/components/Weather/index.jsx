import React, { useState, useEffect } from "react";
import { reqIp } from "../../api";
import { reqWeather } from "../../api";
import weatherList from "../../config/weatherConfig";
import "./index.less";

export default function Weather() {
  const [time, setTime] = useState("");
  const [weather, setWeather] = useState("");
  const [city, setCity] = useState("");
  // async会将函数的返回结果封装为一个promise对象

  const weatherMatch = (weather) => {
    const weathercode = weatherList.find((item) => {
      return item.weather.find((weatherItem) => {
        return weatherItem === weather;
      });
    });
    return weathercode ? weathercode.unicode : "icon-weizhitianqi";
  };

  useEffect(() => {
    async function ipRequestFuc() {
      const data = await reqIp();
      if (data) {
        const { city, adcode } = data;
        setCity(city);
        const { weather, time } = await reqWeather(adcode);
        setWeather(weatherMatch(weather));
        setTime(time);
      }
    }
    ipRequestFuc();
  }, [city, time, weather]);
  return (
    <div>
      <div className="top-header-bottom-right">
        <span>{time}</span>
        <span className={"iconfont " + weather}></span>
        <span>{city}</span>
      </div>
    </div>
  );
}
