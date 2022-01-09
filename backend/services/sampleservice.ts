import axios, { AxiosRequestConfig } from "axios";
import { Vault } from "../databases/vault";
import { ServiceNames, WebMethods } from "../interfaces/payload";
import { Utils } from "../utils/utils";


export abstract class TestService {
    static url = process.env.LEAGUES_URL || "http://localhost:8002/test";

    static state: "RED" | "GREEN" | "YELLOW" = 'GREEN';

    static threshold: number = 0;
    static lastFailureTime: string;
    static cooldownTime = 5;

    public static async CircuitBreaker(rpc: Function) {
        try {
            // console.log('inside circuit breaker');
            if (
                this.state == "RED" &&
                this.threshold >= 5 &&
                new Date().toISOString() > this.lastFailureTime
            ) {
                console.log('start working after 1 min');
                TestService.state = "YELLOW";
            }
            if (TestService.state == "RED") return { status: false };
            else {

                let result = await rpc();
                // console.log(result, "result");
                if (this.state != "GREEN") this.threshold -= 1;
                if (this.state != "GREEN" && this.threshold <= 0) {

                    this.threshold = 0;
                    this.lastFailureTime = undefined as any;
                    this.state = "GREEN";
                    return { status: true };
                }

                if (result) return result;
            }
        } catch (error: any) {
            let err: any = error;
            this.threshold += 1;
            this.lastFailureTime = Utils.GetFutureDateISOString(this.cooldownTime, "min");
            
            if (this.state == 'GREEN' && this.threshold == 5) this.state = "RED";

            if (this.state == "YELLOW" && this.threshold >= 5) this.state = 'RED'

            // console.log({ threshold: this.threshold, state: this.state });

        }
    }


    public static async TestCall(): Promise<Array<any> | any> {
        try {
            let result = await this.CircuitBreaker(async () => {
                let token = Vault.Encrypt(Utils.GenerateAccessToken(Utils.GeneratePayload(ServiceNames.NOVIG_TEAMS_SERVICE, ServiceNames.NOVIG_LEAGUES_SERVICE, WebMethods.GET, "/All")));

                let config: AxiosRequestConfig = { headers: { "X-Novig-Auth": token } };

                let leaguesData = await axios.get(`${TestService.url}/cb`, config);
                return leaguesData.data?.allLeagues;
            });
            return result
        } catch (error: any) {
            console.log('Error in Test Call'); 
            throw error;
        }
    }
 
}