import cron from 'node-cron'
import { CampaignHistoryModel } from '../../models/campaigns-history'
import { Sentry } from '../../server/sentry'
import { DatesDiffrneceDays, Utils } from '../../utils/utils'
/**
 * @Note https://crontab.guru/ To calculate every day of month
 */
export abstract class CroneJob {

   
    public static Scheduler() {

        console.log('Cron intiallize')
       
        //'0 1 * * *' every day at 1am
        cron.schedule('0 1 * * *', async () => {
            try {
                //Fetch document whose active is true
                let campaignsData = await CampaignHistoryModel.GetActiveCampaigns()
                let campaignsDate: any = campaignsData.map(function (campaign: any) { return { _id: campaign._id, campaignCreatedAt: campaign.campaignCreatedAt } });

                //Check created at date diffrence with todays date
                let ids = Utils.GetDatesDiffrenceInDays(campaignsDate)

                //If ids are theier then update all those document with active property of false
                let result = await CampaignHistoryModel.DeactivateCampaigns((ids as any));
                console.log(result, 'DONE');


            } catch (error: any) {
                console.log(error);
                Sentry.Error(error, 'Error in Crone Scheduler');
                throw error;
            }


        })
    }

}


// 1 * * * * evrey one min

