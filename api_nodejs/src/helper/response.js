
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

function errorResponse(status = "500", message ="terjadi kesalahan di server", code = 500, errors = "terjadi kesalahan di server") {

    let response = {
        errors: errors,
        status: code,
        message: message
    }

    return response;

}

export default {
    successResponse, errorResponse
}