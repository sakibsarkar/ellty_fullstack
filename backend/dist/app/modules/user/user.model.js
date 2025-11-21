"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userScheam = new mongoose_1.default.Schema({
    auth: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: "Authentication",
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: false,
        default: "",
    },
}, { timestamps: true });
const User = mongoose_1.default.model("User", userScheam);
exports.default = User;
