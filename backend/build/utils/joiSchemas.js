"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoiSchemas = void 0;
const joi_1 = __importDefault(require("joi"));
class JoiSchemas {
    static SignUpValidator(data) {
        let schema = joi_1.default.object({
            userName: joi_1.default.string().min(3).max(30).required(),
            firstName: joi_1.default.string().min(3).max(30).required(),
            lastName: joi_1.default.string().min(3).max(30).required(),
            address: joi_1.default.string().min(3).max(100).required(),
            password: joi_1.default.string().required().min(8).max(50),
            city: joi_1.default.string().required().min(3).max(25),
            country: joi_1.default.string().required().min(3).max(25),
            email: joi_1.default.string().email().required(),
            userType: joi_1.default.string().required().valid('GAMER', 'INVESTOR'),
        });
        console.log("data", data);
        let result = schema.validate(data, { abortEarly: false });
        if (result.error)
            return { errored: true, errors: result.error.message.split('.'), value: result.value };
        else
            return { errored: false, errors: null, value: result.value };
    }
    static LoginValidator(data) {
        console.log("login", data);
        let schema = joi_1.default.object({
            password: joi_1.default.string().required(),
            email: joi_1.default.string().email().required(),
        });
        let result = schema.validate(data, { abortEarly: false });
        if (result.error)
            return { errored: true, errors: result.error.message.split('.'), value: result.value };
        else
            return { errored: false, errors: null, value: result.value };
    }
    static LogoutValidator(data) {
        let schema = joi_1.default.object({
            accessToken: joi_1.default.string().required(),
        });
        let result = schema.validate(data, { abortEarly: false });
        if (result.error)
            return { errored: true, errors: result.error.message.split('.'), value: result.value };
        else
            return { errored: false, errors: null, value: result.value };
    }
    static EmailValidator(data) {
        let schema = joi_1.default.object({
            email: joi_1.default.string().email().required(),
        });
        let result = schema.validate(data, { abortEarly: false });
        if (result.error)
            return { errored: true, errors: result.error.message.split('.'), value: result.value };
        else
            return { errored: false, errors: null, value: result.value };
    }
    static UpdatePassword(data) {
        let schema = joi_1.default.object({
            password: joi_1.default.string().min(3).max(15).required().label('Password'),
            confirmPassword: joi_1.default.any().valid(joi_1.default.ref('password')).required().label('Confirm Password').options({ messages: { 'any.only': '{{#label}} password does not match' } })
        });
        let result = schema.validate(data, { abortEarly: false });
        if (result.error)
            return { errored: true, errors: result.error.message.split('.'), value: result.value };
        else
            return { errored: false, errors: null, value: result.value };
    }
    static CreateCampaigns(data) {
        let schema = joi_1.default.object({
            campaignName: joi_1.default.string().min(3).required(),
            campaignDays: joi_1.default.number().max(3).required(),
            campaignDescription: joi_1.default.string().max(800).required(),
            campaignTargetedAmount: joi_1.default.number().min(100).max(1000).required()
        });
        let result = schema.validate(data, { abortEarly: false });
        if (result.error)
            return { errored: true, errors: result.error.message.split('.'), value: result.value };
        else
            return { errored: false, errors: null, value: result.value };
    }
}
exports.JoiSchemas = JoiSchemas;
//# sourceMappingURL=joiSchemas.js.map