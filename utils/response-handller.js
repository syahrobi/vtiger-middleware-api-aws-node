const responseData = (res, code, value) => {
    return res.status(code).json({
        data: value
    });
};

const responseMessage = (res, code, message) => {
    return res.status(code).json({
        message: message
    });
};

module.exports = {responseData, responseMessage};