"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const promises_1 = __importDefault(require("fs/promises"));
require("source-map-support/register");
let application = new app_1.Application();
/**
 * @NOTE : SErvice name spelling mistake is intentional because logger filters t he pii Keywords in which Auth/Authentication will not be printed in log.
 * So We changed the spelling in order to keep it functional.
 */
(async () => {
    let env = JSON.parse((await promises_1.default.readFile(__dirname + `/environments/environment.json`)).toString());
    application.INIT(env);
})();
//# sourceMappingURL=index.js.map