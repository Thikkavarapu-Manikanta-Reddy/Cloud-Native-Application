const setResponse = (response, obj) => {
    response.status(200);
    response.json(obj);
    return response;
};

const setServerError = (response, error) => {
    response.status(500);
    response.json(error);
    return response;
};

const setRequestError = (response, error) => {
    response.status(400);
    response.json(error);
    return response;
};

export { setResponse, setRequestError, setServerError };