"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CroneJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const campaigns_history_1 = require("../../models/campaigns-history");
const sentry_1 = require("../../server/sentry");
const utils_1 = require("../../utils/utils");
/**
 * @Note https://crontab.guru/ To calculate every day of month
 */
class CroneJob {
    static Scheduler() {
        console.log('Cron intiallize');
        //'0 1 * * *' every day at 1am
        node_cron_1.default.schedule('0 1 * * *', async () => {
            try {
                //Fetch document whose active is true
                let campaignsData = await campaigns_history_1.CampaignHistoryModel.GetActiveCampaigns();
                let campaignsDate = campaignsData.map(function (campaign) { return { _id: campaign._id, campaignCreatedAt: campaign.campaignCreatedAt }; });
                //Check created at date diffrence with todays date
                let ids = utils_1.Utils.GetDatesDiffrenceInDays(campaignsDate);
                //If ids are theier then update all those document with active property of false
                let result = await campaigns_history_1.CampaignHistoryModel.DeactivateCampaigns(ids);
                console.log(result, 'DONE');
            }
            catch (error) {
                console.log(error);
                sentry_1.Sentry.Error(error, 'Error in Crone Scheduler');
                throw error;
            }
        });
    }
}
exports.CroneJob = CroneJob;
// 1 * * * * evrey one min
//# sourceMappingURL=scheduler.js.map