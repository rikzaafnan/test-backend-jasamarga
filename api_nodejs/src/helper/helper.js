function dateDb(dt=new Date()){
    let dateObj = new Date(dt);
    let date    = dateObj.getFullYear() + "/" + (dateObj.getMonth() + 1) + "/" + dateObj.getDate();

    return date;
}

export default {
    dateDb
}