const {ticketCreate, userList} = require("../service/vtiger-service");

exports.ticketCreate = (req, res) => {
    ticketCreate(req, res);
};

exports.userList = (req, res) => {
    userList(req, res);
}