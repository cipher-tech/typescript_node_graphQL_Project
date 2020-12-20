"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const userController_1 = require("../../controllers/userController");
const auth_1 = require("../../middleware/auth");
const validation_1 = require("../validation/validation");
let UserControllers = new userController_1.UserController();
let UserAuth = new auth_1.UserService();
exports.userRouter = express_1.Router();
exports.userRouter.get('/', UserControllers.index);
exports.userRouter.post('/register', validation_1.Rules['RegisterValidation'], (req, res) => {
    console.log("body>>> ", req.body);
    const errors = express_validator_1.validationResult(req);
    if (!errors.isEmpty())
        return res.status(422).json(errors.array());
    const payload = express_validator_1.matchedData(req);
    const user = UserAuth.register(payload);
    return user;
});
