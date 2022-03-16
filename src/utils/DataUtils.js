import moment from "moment";

export const formDate = (date) => {
   const dateString=moment(date).format('YYYY-MM-DD HH:mm:ss')
   return <p>{dateString}</p>;
};

