
function successResponse(responseParams={
    status : 200,
    content : [],
    message : "success",
    totalData : 0,
    totalContent : 0,
    page:0,
    limit:0,
    sort:null,
    filter:null
}) {
    // default result
    let meta = {
        "message" : responseParams.message,
        "code" : responseParams.status,
        "status" : `${responseParams.status}`,
    }

    let contentData = {
        content : responseParams.content
    }

    if ((responseParams.totalData > 0) && (responseParams.totalContent > 0) ) {
        contentData.total_content = responseParams.totalContent
        contentData.total_data = responseParams.totalData
        contentData.page = responseParams.page
        contentData.limit = responseParams.limit
    }

    if (responseParams.sort !== null) {
        contentData.sort = responseParams.sort
    }

    if (responseParams.filter !== null) {
        contentData.filter = responseParams.filter
    }

    let response = {
        meta : meta,
        data : contentData
    }

    return response;
}

function failedResponse(status = "", message ="") {
  
}

export default {
    successResponse, failedResponse
}