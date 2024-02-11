const express = require('express')
// import { setRequestError, setResponse, setServerError } from "./../utils/responses.js";

const HealthRoute = express.Router();

HealthRoute.get("", async (req, res) => {
    try {
        res.status(200).send();
    } catch (e) {
        res.status(500).send();
    }
})

module.exports = HealthRoute;
// export default HealthRoute;