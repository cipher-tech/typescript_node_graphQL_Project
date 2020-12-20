"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_1 = require("../lib/config/models/user");
class UserController {
    index(req, res) {
        user_1.User.findAll({})
            .then((users) => res.json(users))
            .catch((err) => res.status(500).json(err));
    }
}
exports.UserController = UserController;
