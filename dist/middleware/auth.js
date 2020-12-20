"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const bcrypt = __importStar(require("bcrypt"));
const jwt = __importStar(require("jsonwebtoken"));
const plan_1 = require("../lib/config/models/plan");
const user_1 = require("../lib/config/models/user");
class UserService {
    constructor() {
        this._saltRounds = 12;
        this._jwtSecret = "0.rfyj3n9nzhhhsgyw";
        this._userInfo = {};
    }
    static get userAttributes() {
        return ['id', 'email'];
    }
    static get user() {
        return UserService._user;
    }
    register(payload) {
        let data = {};
        return bcrypt.hash(payload.password, this._saltRounds)
            .then(async (password) => {
            const user = await user_1.User.create(Object.assign(Object.assign({}, payload), { password, status: user_1.userStatus.unverified, wallet_balance: 0, plan: plan_1.planNames.none, role: "user", slug: Math.random().toString(36).substring(2) }));
            return user;
        })
            .then(async (result) => {
            data = await result.get();
            return data;
        })
            .catch(err => new Error(err));
    }
    login({ email, password }, cookies) {
        return user_1.User.findOne({ where: { email } })
            .then(async (user) => {
            if (user && await bcrypt.compare(password, user.password)) {
                const { id, email } = user;
                let token = jwt.sign({ id, email }, this._jwtSecret);
                cookies.set("auth_token", token, {
                    httpOnly: true,
                    sameSite: "lax",
                    maxAge: 1000 * 60 * 60 * 24 * 30,
                    secure: false
                });
                return user.get();
            }
            else
                return false;
        });
    }
    verifyToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, this._jwtSecret, async (err, decoded) => {
                if (err) {
                    resolve(false);
                    return;
                }
                const result = await user_1.User.findByPk(decoded['id']);
                UserService._user = result === null || result === void 0 ? void 0 : result.get();
                resolve(true);
                return;
            });
        });
    }
    getUserById(id) {
        return user_1.User.findByPk(id, {});
    }
}
exports.UserService = UserService;
