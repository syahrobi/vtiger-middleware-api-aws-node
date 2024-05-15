const axios = require("axios");
const fromData = require("form-data");
const {responseMessage, responseData} = require("../utils/response-handller");
const {TicketRequestDto} = require("../dto/ticket-request-dto");
const md5 = require("md5");
require("dotenv").config();

var operations = JSON.parse(process.env.OPERATIONS);
var elementType = JSON.parse(process.env.ELEMENT_TYPE)
var sessionNumber;

exports.userList = (re, res) => {
    try {
        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `${process.env.URL}?sessionName=${sessionNumber}&operation=${operations[3]}&query=SELECT id, user_name FROM Users;`,
          };
          
        axios.request(config)
        .then((response) => {
            if (response.success === false) {
                responseMessage(res, 400, response.data.result);
            } else {
                responseData(res, 200, response.data.result);
            }
        })
        .catch((error) => {
            responseMessage(res, 500,error);
        });
    } catch (error) {
        responseMessage(res, 500, error);
    }
};

exports.ticketCreate = async (req, res) => {
    try {
        let body = new TicketRequestDto(req.body);

        if (body.contactId === null || body.contactId.trim().length === 0) {
            let contactBody = createContact(req, res);
            contactBody.then(result => {
                if (result.success === false) {
                    responseMessage(res, 400, result);
                } else {
                    body.contactId = result.result.id;
                    console.log("contactId: ", body.contactId);  
                    createTicket(body, res);
                }
            });
        } else {
            createTicket(body, res);
        }
    } catch (error) {
        responseMessage(res, 500, error); 
    }
};

function createTicket(req, res) {
    let body = new TicketRequestDto(req);
    let data = new fromData();

    data.append('operation', operations[0]);
    data.append('sessionName', sessionNumber);
    data.append('element', '{\n    "assigned_user_id": "'+ body.assignToId +'",\n    "ticketpriorities": "Low",\n    "ticketstatus": "Open",\n    "ticket_title": "'+ body.title +'",\n     "contact_id":"'+ body.contactId +'"\n\n}');
    data.append('elementType', elementType[0]);

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.URL,
        headers: { 
            ...data.getHeaders()
    },
    data : data
    };

    axios.request(config)
    .then(response => {
        if (response.data.success === false) {
            responseMessage(res, 400, response.data.result);
        } else {
            responseMessage(res, 200, "created");

        }
    })
    .catch((error) => {
        responseMessage(res, 500, error);
    });

}

function createContact(req, res) {
    let body = new TicketRequestDto(req.body);
    let data = new fromData();

    data.append('operation', operations[0]);
    data.append('sessionName', sessionNumber);
    data.append('element', '{\n    "firstname":"'+body.firstName+'",\n    "lastname":"'+body.lastName+'",\n    "assigned_user_id": "'+body.assignToId+'",\n    "mobile": "'+body.phone+'",\n    "email": "'+body.email+'"\n}');
    data.append('elementType', elementType[1]);

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.URL,
        headers: { 
            ...data.getHeaders()
        },
        data : data
    };

    return axios.request(config)
    .then(response => response.data)
    .catch((error) => {
        responseMessage(res, 500, error);
    });
};

exports.resetSession = () => {
    try {
        let tokenBody = getToken();
        let success = false;
    
        tokenBody.then(result => {
            try {
                success = result.success;
                let accessKey = md5(result.result.token + process.env.ADMINISTRATOR_ACCSESS_KEY);
    
                if (success === true) {
                    let loginBody = login(accessKey);
                    loginBody.then(result => {
                        success = result.success;
                        sessionNumber = result.result.sessionName
                        console.log("success", success);
                        console.log("sessionNumber", sessionNumber);
                        if (success === false) {
                            console.log("get session failed");
                        }
                    });
                }   
            } catch (error) {
                console.log("get session failed");
            } 
        });
    } catch (error) {
        console.log("get session failed");
    }
};

function getToken() {
    let url = `${process.env.URL}?operation=${operations[1]}&username=${process.env.USER}`;
    return axios.get(url)
    .then(response => response.data)
    .catch((error) => {
        console.log("get token - ", error);
    });
};

function login(accessKey) {
    let data = new fromData();
    data.append('operation', operations[2]);
    data.append('username', process.env.USER);
    data.append('accessKey', accessKey);

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: process.env.URL,
        headers: { 
            ...data.getHeaders()
        },
        data : data
    };

    return axios.request(config)
    .then(response => response.data)
    .catch((error) => {
        console.log("login - ", error);
    });
}