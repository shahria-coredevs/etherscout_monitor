const cron = require("node-cron")
require("./db/mongoose")
const monitor = require("./monitor")



const dataProcessor = async()=>{
        await monitor({
            ifUserAgent:true,
            id:process.env.TOKEN_TRANSFERS,
        }) 
}
dataProcessor()
// var schedule = async () => {
//     cron.schedule("*/5 * * * *", async () => {
//         await dataProcessor();
//     });
//   };


//   schedule()