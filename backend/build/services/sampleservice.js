"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestService = void 0;
const axios_1 = __importDefault(require("axios"));
const vault_1 = require("../databases/vault");
const payload_1 = require("../interfaces/payload");
const utils_1 = require("../utils/utils");
class TestService {
    static async CircuitBreaker(rpc) {
        try {
            // console.log('inside circuit breaker');
            if (this.state == "RED" &&
                this.threshold >= 5 &&
                new Date().toISOString() > this.lastFailureTime) {
                console.log('start working after 1 min');
                TestService.state = "YELLOW";
            }
            if (TestService.state == "RED")
                return { status: false };
            else {
                let result = await rpc();
                // console.log(result, "result");
                if (this.state != "GREEN")
                    this.threshold -= 1;
                if (this.state != "GREEN" && this.threshold <= 0) {
                    this.threshold = 0;
                    this.lastFailureTime = undefined;
                    this.state = "GREEN";
                    return { status: true };
                }
                if (result)
                    return result;
            }
        }
        catch (error) {
            let err = error;
            this.threshold += 1;
            this.lastFailureTime = utils_1.Utils.GetFutureDateISOString(this.cooldownTime, "min");
            if (this.state == 'GREEN' && this.threshold == 5)
                this.state = "RED";
            if (this.state == "YELLOW" && this.threshold >= 5)
                this.state = 'RED';
            // console.log({ threshold: this.threshold, state: this.state });
        }
    }
    static async TestCall() {
        try {
            let result = await this.CircuitBreaker(async () => {
                var _a;
                let token = vault_1.Vault.Encrypt(utils_1.Utils.GenerateAccessToken(utils_1.Utils.GeneratePayload(payload_1.ServiceNames.NOVIG_TEAMS_SERVICE, payload_1.ServiceNames.NOVIG_LEAGUES_SERVICE, payload_1.WebMethods.GET, "/All")));
                let config = { headers: { "X-Novig-Auth": token } };
                let leaguesData = await axios_1.default.get(`${TestService.url}/cb`, config);
                return (_a = leaguesData.data) === null || _a === void 0 ? void 0 : _a.allLeagues;
            });
            return result;
        }
        catch (error) {
            console.log('Error in Test Call');
            throw error;
        }
    }
}
exports.TestService = TestService;
TestService.url = process.env.LEAGUES_URL || "http://localhost:8002/test";
TestService.state = 'GREEN';
TestService.threshold = 0;
TestService.cooldownTime = 5;
//# sourceMappingURL=sampleservice.js.map