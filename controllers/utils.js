const setResponse = (obj, response, responseCode) => {
    response.status(200);
    if (responseCode) {
        response.status(responseCode);
    }
    response.json(obj);
    return response;
};

const setServerError = (error, response) => {
    response.status(500);
    response.json(error);
    return response;
};

const setRequestError = (error, response) => {
    response.status(400);
    response.json(error);
    return response;
};


module.exports = { setResponse, setRequestError, setServerError };
