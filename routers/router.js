const express = require("express");
const router = express.Router();
const {body, validationResult} = require("express-validator");
const {responseMessage} = require("../utils/response-handller");
const {ticketCreate, userList} = require("../controller/vtiger-controller");

router.post("/v1/ticket/create", 
    [
        body("title").notEmpty(),
        body("assignToId").notEmpty(),
        body("firstName").notEmpty(),
        body("lastName").notEmpty(),
        body("phone").notEmpty(),
        body("email").notEmpty(),
    ], (req, res) => {
        let bodyValid = validationResult(req);
        if (!bodyValid.isEmpty()) {
            responseMessage(res, 400, bodyValid);
        } else {
            ticketCreate(req, res);
        }
});

router.get("/v1/user-list", (req, res) => {
    userList(req, res);
});

module.exports = {router};