"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CroneJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const campaigns_history_1 = require("../../models/campaigns-history");
const utils_1 = require("../../utils/utils");
/**
 * @Note https://crontab.guru/ To calculate every day of month
 */
class CroneJob {
    static Scheduler() {
        console.log('Cron intiallize');
        node_cron_1.default.schedule('*/1 * * * *', async () => {
            //Fetch document whose active is true
            let campaignsData = await campaigns_history_1.CampaignHistoryModel.GetActiveCampaigns();
            let campaignsDate = campaignsData.map(function (campaign) { return { _id: campaign._id, campaignCreatedAt: campaign.campaignCreatedAt }; });
            // console.log(campaignsDate, 'date camp')
            utils_1.Utils.GetDatesDiffrenceInDays(campaignsDate);
            //Convert Date into yyy-mm-dd and check if diffrence between current date and yyyy-mm--dd is greater than or equal3 (days)
            //If true then update all those document with active property of false
        });
    }
}
exports.CroneJob = CroneJob;
// 1 * * * * evrey one min
//'0 1 * * *' every day at 1am
//# sourceMappingURL=scheduler.js.map