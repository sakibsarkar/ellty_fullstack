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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoverPassword = exports.forgotPassword = exports.resetPassword = exports.changeRole = exports.logout = exports.loginController = exports.genereteAccessToken = exports.createUserController = exports.authSateController = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const mongoose_1 = __importDefault(require("mongoose"));
const catchAsyncError_1 = require("../../../utils/catchAsyncError");
const jwtToken_1 = require("../../../utils/jwtToken");
const sendMessage_1 = __importDefault(require("../../../utils/sendMessage"));
const sendResponse_1 = __importDefault(require("../../../utils/sendResponse"));
const config_1 = __importDefault(require("../../config"));
const user_model_1 = __importDefault(require("../user/user.model"));
const auth_model_1 = __importDefault(require("./auth.model"));
exports.authSateController = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = req.user;
    const data = yield user_model_1.default.findOne({ email: auth.email });
    const result = data ? data.toObject() : {};
    res.json({
        success: true,
        message: "User state get",
        data: Object.assign(Object.assign({}, result), { role: auth.role }),
    });
}));
exports.createUserController = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const isExistCustomer = yield auth_model_1.default.findOne({
            userName: body.userName,
        }).session(session);
        if (isExistCustomer) {
            yield session.abortTransaction();
            session.endSession();
            return (0, sendResponse_1.default)(res, {
                success: false,
                data: null,
                statusCode: 409,
                message: "An account already exists with this User Name",
            });
        }
        const { userName, password } = body;
        // Create authentication details
        const auth = yield auth_model_1.default.create([{ userName, password }], {
            session,
        });
        // Create the user document linked to the auth record
        const user = yield user_model_1.default.create([Object.assign(Object.assign({}, body), { auth: auth[0]._id })], {
            session,
        });
        // Generate tokens
        const token = (0, jwtToken_1.createAcessToken)({
            userName: auth[0].userName,
            id: auth[0]._id.toString(),
            role: auth[0].role,
        }, "1h");
        const refreshToken = (0, jwtToken_1.createRefreshToken)({
            userName: auth[0].userName,
            id: auth[0]._id,
            role: auth[0].role,
        });
        // Commit transaction
        yield session.commitTransaction();
        session.endSession();
        res
            .cookie("accessToken", token, {
            sameSite: config_1.default.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 1000 * 60 * 60, // 1 hour
            httpOnly: true,
            secure: config_1.default.NODE_ENV === "production",
        })
            .cookie("refreshToken", refreshToken, {
            sameSite: config_1.default.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 1000 * 24 * 60 * 60 * 30, // 30 days
            httpOnly: true,
            secure: config_1.default.NODE_ENV === "production",
        });
        // Send response
        res.json({
            data: user[0],
            message: "User created successfully",
            success: true,
            accessToken: token,
        });
    }
    catch (error) {
        // Rollback transaction in case of error
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
}));
exports.genereteAccessToken = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getToken = req.header("Authorization");
    if (!getToken)
        return res.status(400).json({ msg: "Invalid Authentication." });
    const refreshToken = getToken.split(" ")[1];
    if (!refreshToken) {
        (0, sendResponse_1.default)(res, {
            message: "token must be provided",
            success: false,
            data: null,
            statusCode: 400,
        });
    }
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, refreshTokenSecret);
        const user = decoded.user;
        const accessTOkenPayload = {
            userName: user.userName,
            id: user.id,
            role: user.role,
        };
        const isExistUser = yield auth_model_1.default.findById(user.id);
        if (!isExistUser) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                data: null,
                message: "User not found",
                statusCode: 404,
            });
        }
        const newAccessToken = (0, jwtToken_1.createAcessToken)(accessTOkenPayload, "1h");
        res.cookie("accessToken", newAccessToken, {
            sameSite: config_1.default.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 1000 * 60 * 60, // 1 hour
            httpOnly: true,
            secure: config_1.default.NODE_ENV === "production",
        });
        (0, sendResponse_1.default)(res, {
            success: true,
            message: "Successfully retrive access token",
            data: { accessToken: newAccessToken, user: isExistUser },
        });
    }
    catch (error) {
        console.error("Error decoding or verifying refresh token:", error);
        res.status(403).json({ message: "Invalid refresh token" });
    }
}));
exports.loginController = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userName, password } = req.body;
    const isExistUser = yield auth_model_1.default.findOne({ userName });
    if (!isExistUser) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            data: null,
            message: "No account found on this user name",
            statusCode: 404,
        });
    }
    const isPasswordMatched = yield bcrypt_1.default.compare(password, isExistUser.password);
    if (!isPasswordMatched) {
        return (0, sendResponse_1.default)(res, {
            message: "password didn't matched",
            success: false,
            data: null,
            statusCode: 403,
        });
    }
    const token = (0, jwtToken_1.createAcessToken)({
        userName: isExistUser.userName,
        id: isExistUser._id.toString(),
        role: isExistUser.role,
    }, "1h");
    const refreshToken = (0, jwtToken_1.createRefreshToken)({
        userName: isExistUser.userName,
        id: isExistUser._id,
        role: isExistUser.role,
    });
    const _a = (isExistUser === null || isExistUser === void 0 ? void 0 : isExistUser.toObject()) || {}, { password: pass } = _a, rest = __rest(_a, ["password"]);
    res
        .cookie("accessToken", token, {
        sameSite: config_1.default.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
        secure: config_1.default.NODE_ENV === "production",
    })
        .cookie("refreshToken", refreshToken, {
        sameSite: config_1.default.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 1000 * 24 * 60 * 60 * 30, // 30 days
        httpOnly: true,
        secure: config_1.default.NODE_ENV === "production",
    });
    res.json({
        data: rest,
        message: "Login successfull",
        success: true,
        accessToken: token,
    });
}));
exports.logout = (0, catchAsyncError_1.catchAsyncError)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("accessToken", {
        path: "/",
        sameSite: config_1.default.NODE_ENV === "production" ? "none" : "strict",
        secure: config_1.default.NODE_ENV === "production" ? true : false,
    });
    res.clearCookie("refreshToken", {
        path: "/",
        sameSite: config_1.default.NODE_ENV === "production" ? "none" : "strict",
        secure: config_1.default.NODE_ENV === "production" ? true : false,
    });
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        data: null,
        message: "User logged out successfully",
    });
}));
exports.changeRole = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const { role } = req.body;
    const isExistUser = yield user_model_1.default.findById(id);
    if (!isExistUser) {
        return (0, sendResponse_1.default)(res, {
            success: false,
            data: null,
            message: "No account found",
            statusCode: 404,
        });
    }
    const result = yield auth_model_1.default.findOneAndUpdate({ userName: isExistUser.userName }, { role });
    (0, sendResponse_1.default)(res, {
        data: result,
        success: true,
        message: "Successfully update role",
    });
}));
// reset password
exports.resetPassword = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, oldPassword } = req.body;
    const user = req.user;
    const email = user.email;
    if (!password || !oldPassword) {
        return res.json({
            message: "password, oldPassword => is required",
        });
    }
    const theUser = yield auth_model_1.default.findOne({ email });
    // check if there no user
    if (!theUser) {
        return (0, sendResponse_1.default)(res, {
            message: "user not found",
            data: null,
            success: false,
            statusCode: 404,
        });
    }
    // varify old password
    const isOk = yield bcrypt_1.default.compare(oldPassword, theUser.password);
    if (!isOk) {
        return (0, sendResponse_1.default)(res, {
            message: "password didn't matched",
            data: null,
            success: false,
            statusCode: 401,
        });
    }
    // create new hash password
    const newPass = yield bcrypt_1.default.hash(password, 10);
    // update the new
    const updatePassword = yield auth_model_1.default.findOneAndUpdate({ email }, {
        $set: {
            password: newPass,
        },
    });
    res.json({
        message: "password Updated",
        success: true,
        user: Object.assign(Object.assign({}, updatePassword === null || updatePassword === void 0 ? void 0 : updatePassword.toObject()), { password: "****" }),
    });
}));
// forgot-password controller
exports.forgotPassword = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield auth_model_1.default.findOne({ email });
    if (!user) {
        return res
            .status(404)
            .json({ success: false, message: "No user found with this email!" });
    }
    const tokenPayload = {
        userName: user.userName,
        _id: user._id,
    };
    const token = jsonwebtoken_1.default.sign(tokenPayload, process.env.JWT_ACCESS_SECRET, {
        expiresIn: "5m",
    });
    console.log(`${process.env.FRONTEND_BASE_URL}/recover-password/${token}`);
    (0, sendMessage_1.default)("legendxpro123455@gmail.com", email, "Reset your password - Meme Canvas", `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 0;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border: 1px solid #ddd;">
          <div style="text-align: center; background-color: #00466a; color: white; padding: 10px;">
              <h1 style="margin: 0;">Password Reset</h1>
          </div>
          <div style="padding: 20px;">
              <p>Hello,</p>
              <p>We received a request to reset your password. Click the button below to reset it.</p>
              <div style="text-align: center; margin: 20px 0;">
                  <a href="${process.env.FRONTEND_BASE_URL}/recover-password/${token}" style="display: inline-block; padding: 10px 20px; background-color: #00466a; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
              </div>
              <p>If you did not request a password reset, please ignore this email.</p>
              <p>Thanks,</p>
              <p>Memes canvas</p>
          </div>
          <div style="text-align: center; background-color: #f1f1f1; color: #555; padding: 10px;">
              <p style="margin: 0;">&copy; 2024 Fresh Blogs. All rights reserved.</p>
          </div>
      </div>
  </div>`);
    res.status(200).json({
        success: true,
        message: "Check your email to recover the password",
    });
}));
// Resetting new password
exports.recoverPassword = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body;
    const getToken = req.header("Authorization");
    if (!getToken) {
        return (0, sendResponse_1.default)(res, {
            message: "Token is not provided",
            data: null,
            success: false,
        });
    }
    const token = getToken.split(" ")[1];
    if (!token || !password) {
        return res.status(400).json({ error: "Token and password are required" });
    }
    let decoded;
    try {
        const decode = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        decoded = decode;
    }
    catch (_b) {
        (0, sendResponse_1.default)(res, {
            data: null,
            message: "invalid authentication",
            statusCode: 401,
            success: false,
        });
        return;
    }
    if (!decoded)
        return res
            .status(401)
            .json({ success: false, message: "Invalid Authentication." });
    const user = yield auth_model_1.default.findOne({
        email: decoded.email,
    });
    if (!user) {
        return res.status(404).json({
            success: false,
            data: null,
            message: "User not found",
        });
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    user.password = hashedPassword;
    yield auth_model_1.default.findByIdAndUpdate(user._id, {
        password: hashedPassword,
    });
    const tokenPayload = {
        userName: user.userName,
        id: user._id.toString(),
        role: user.role,
    };
    const accessToken = (0, jwtToken_1.createAcessToken)(tokenPayload, "1h");
    res.cookie("accessToken", accessToken, {
        sameSite: config_1.default.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 1000 * 60 * 60, // 1 hour
        httpOnly: true,
        secure: config_1.default.NODE_ENV === "production",
    });
    res.status(200).json({
        success: true,
        message: "Password has been successfully reset",
        accessToken,
    });
}));
