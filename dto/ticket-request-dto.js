class TicketRequestDto{
    title;
    desc;
    assignToId;
    firstName;
    contactId;
    lastName;
    phone;
    email;
    
    constructor(data) {
        this.title = data.title;
        this.desc = data.desc;
        this.assignToId = data.assignToId;
        this.firstName = data.firstName;
        this.contactId = data.contactId;
        this.lastName = data.lastName;
        this.phone = data.phone;
        this.email = data.email;
    }
}

module.exports = {TicketRequestDto};