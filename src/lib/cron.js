import { error } from "console";
import cron from "cron";
import http from "http";

const job= new cron.CronJob('*/14 * * * *',function(){
    https.get(process.env.API_URL,(res)=>{
        if(res.this.statusCode==200)
        {
            console.log("Get request sent successfully");
        }
        else console.log("Get req failed")
    })
    .on("error",(e)=>console.log("Cron job req failed",e))
})

export default job;