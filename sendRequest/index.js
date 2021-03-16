const monitor = require("./src/monitor")
const axios = require('axios');
const intercept = require('azure-function-log-intercept');



module.exports = async function (context, req ) {
    // intercept(context)
    const sendHttpRequest= async (body)=> {
        try {
            axios.post(process.env["RETURNED_URL"],body,{
                headers: {
                "Content-type": "application/json;charset=UTF-8"
                //"Authorization": "Bearer " + localStorage.getItem("token")
                }
            })
        } catch (error) {
            
        }

    }

    let token=req.body.token
    let username=req.body.username
    let initAttempt=req.body.initAttempt
    context.res = {
        status: 200,
        body: "Request recieved"
    };
    // context.done();

    // context.res = {
    //     // status: 200, /* Defaults to 200 */
    //     body: "Request recieved"
    // };
    let result = await monitor({
            ifUserAgent:true,
            id:token,
        })
    
    console.log(result);
    if (result.success) {
        
       (result.data).forEach( async data => {

        data.username=username
        if (!initAttempt) {
            try {
            await sendHttpRequest(data)
            } catch (error) {}
            
        }
        console.log(data);
       });
        // return true
    } 

    else {
       console.log('not successful');
    }
    
    // var schedule = async () => {
    //     cron.schedule("*/5 * * * *", async () => {
    //         await dataProcessor();
    //     });
    //   };


    //   schedule()




}