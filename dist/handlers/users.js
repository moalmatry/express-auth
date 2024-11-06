"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = exports.getUserById = exports.getUsers = void 0;
const getUsers = (request, response) => { };
exports.getUsers = getUsers;
const getUserById = (request, response) => { };
exports.getUserById = getUserById;
const createUser = (request, response) => {
    // request.params.id
    //   request.body.email;
    request.query.loginAfterCreate;
    response.status(201).send({
        id: 1,
        email: "Mohamed",
        username: "mo",
    });
};
exports.createUser = createUser;
