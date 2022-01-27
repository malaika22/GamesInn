import cron from 'node-cron'
import { CampaignHistoryModel } from '../../models/campaigns-history'
import { DatesDiffrneceDays, Utils } from '../../utils/utils'
/**
 * @Note https://crontab.guru/ To calculate every day of month
 */
export abstract class CroneJob {

public static   Scheduler() {
    
    console.log('Cron intiallize')
    cron.schedule('*/1 * * * *', async ()=>{
        //Fetch document whose active is true
        let campaignsData = await CampaignHistoryModel.GetActiveCampaigns()
        let campaignsDate:any = campaignsData.map(function (campaign:any) { return {_id : campaign._id, campaignCreatedAt:campaign.campaignCreatedAt} });
        // console.log(campaignsDate, 'date camp')
        Utils.GetDatesDiffrenceInDays(campaignsDate)
        //Convert Date into yyy-mm-dd and check if diffrence between current date and yyyy-mm--dd is greater than or equal3 (days)

        //If true then update all those document with active property of false

        
    })
}

}


// 1 * * * * evrey one min

//'0 1 * * *' every day at 1am