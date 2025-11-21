"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRoles = exports.isAuthenticatedUserOptional = exports.isAuthenticatedUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const auth_model_1 = __importDefault(require("../modules/auth/auth.model"));
const user_model_1 = __importDefault(require("../modules/user/user.model"));
const isAuthenticatedUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({ message: "Token not provided" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        if (!decoded)
            return res.status(401).json({ message: "Invalid Authentication." });
        const user = yield user_model_1.default.findOne({
            auth: (_a = decoded === null || decoded === void 0 ? void 0 : decoded.user) === null || _a === void 0 ? void 0 : _a.id,
        });
        if (!user)
            return res.status(404).json({ message: "User does not exist." });
        const auth = yield auth_model_1.default.findOne({ userName: user.userName });
        if (!auth)
            return res.status(404).json({ message: "User does not exist." });
        // console.log("user =======", user);
        const payload = user.toObject();
        req.user = Object.assign(Object.assign({}, payload), { role: auth.role });
        next();
    }
    catch (err) {
        console.log(err);
        return res.status(401).json({ message: err.message });
    }
});
exports.isAuthenticatedUser = isAuthenticatedUser;
const isAuthenticatedUserOptional = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const getToken = req.header("Authorization");
        if (!getToken) {
            return next();
        }
        const token = getToken.split(" ")[1];
        if (!token || token === "undifined") {
            return next();
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        if (!decoded)
            return res.status(401).json({ message: "Invalid Authentication." });
        const user = yield user_model_1.default.findOne({
            auth: (_b = decoded === null || decoded === void 0 ? void 0 : decoded.user) === null || _b === void 0 ? void 0 : _b.id,
        });
        if (!user)
            return next();
        const auth = yield auth_model_1.default.findOne({ userName: user.userName });
        if (!auth)
            return next();
        const payload = user.toObject();
        req.user = Object.assign(Object.assign({}, payload), { role: auth.role });
        next();
    }
    catch (err) {
        // If there's an error (like token verification fails), return 401
        return res.status(401).json({ message: err.message });
    }
});
exports.isAuthenticatedUserOptional = isAuthenticatedUserOptional;
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        var _a, _b;
        if (!roles.includes((_a = req.user) === null || _a === void 0 ? void 0 : _a.role)) {
            return next(new AppError_1.default(403, `User type: ${(_b = req.user) === null || _b === void 0 ? void 0 : _b.role} is not allowed to access this resouce `));
        }
        next();
    };
};
exports.authorizeRoles = authorizeRoles;
