"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenGuard = void 0;
const auth_1 = require("./auth");
const UserAuth = new auth_1.UserService();
function getTokenFromHeaders(headers) {
    const header = headers.authorization;
    if (!header)
        return header;
    return header.split(' ')[1];
}
exports.tokenGuard = (() => (req, res, next) => {
    const token = getTokenFromHeaders(req.headers) || req.query.token || req.body.token || '';
    const hasAccess = UserAuth.verifyToken(token);
    hasAccess.then(result => {
        if (!result)
            return res.status(403).send({ message: "Access Denied" });
        next();
    });
});
