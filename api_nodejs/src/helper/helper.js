import moment from "moment";

function dateDb(dt=new Date()){
    let dateObj = new Date(dt);
    let date    = dateObj.getFullYear() + "/" + (dateObj.getMonth() + 1) + "/" + dateObj.getDate();

    return date;
}

function dateTimeDB(){
    let date = moment().format("YYYY-MM-DD HH:mm:ss")

    return date;
}

export default {
    dateDb, dateTimeDB
}