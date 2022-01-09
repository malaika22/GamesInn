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
            name: joi_1.default.string().min(3).max(30).required(),
            password: joi_1.default.string().required().min(8).max(50),
            dob: joi_1.default.string().required().regex(/^\d{2}\/\d{2}\/\d{4}$/),
            email: joi_1.default.string().email().required(),
            number: joi_1.default.string().required().regex(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im),
            countryCode: joi_1.default.string().required().min(2).max(4)
        });
        let result = schema.validate(data, { abortEarly: false });
        if (result.error)
            return { errored: true, errors: result.error.message.split('.'), value: result.value };
        else
            return { errored: false, errors: null, value: result.value };
    }
    static LoginValidator(data, key) {
        let schema = joi_1.default.object({
            [key]: joi_1.default.string().required(),
            email: joi_1.default.string().email().required(),
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