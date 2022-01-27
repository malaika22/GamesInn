import cron from 'node-cron'
/**
 * @Note https://crontab.guru/ To calculate every day of month
 */
export abstract class CroneJob {

public static Scheduler() {
    
    console.log('cron intiallize')
    cron.schedule('* 1 */1 * *', ()=>{
        console.log('Cron running at every minute past hour 1 on every day-of-month.')
        //Fetch document whose active is true

        //Convert Date into yyy-mm-dd and check if diffrence between current date and yyyy-mm--dd is greater than or equal3 (days)
    
        //If true then update all those document with active property of false

        
    })
}

}

// 1 * * * * evrey one min

//'0 1 * * *' every day at 1am