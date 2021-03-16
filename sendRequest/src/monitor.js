const puppeteer = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
const UserAgent = require('user-agents');
const {getData} = require("./files/getData");

const monitor = async ({
    id=null,
    ifUserAgent = false,
}) => {

    await puppeteer.use(StealthPlugin())
    
    const browser = await puppeteer.launch({
        headless: process.env.HEADLESS=="true", //Comment out this file to run it headless
    });
    try {
        const page = await browser.newPage();    
        page.setViewport({
            width: 1366,
            height: 768,
            deviceScaleFactor: 1,
        });

        if (ifUserAgent) {
            // const userAgent = new UserAgent({ deviceCategory: 'desktop' })
            const userAgent = new UserAgent([
                /Safari/,
                {
                  connection: {
                    type: 'wifi',
                  },
                  platform: 'MacIntel',
                },
              ])

            let agent = userAgent.random()
            page.setUserAgent(agent.toString());
        }

        page.setDefaultTimeout(20000);
        page.setDefaultNavigationTimeout(15000);

        let result= await getData( id, page )
        if (result.success) {
            console.log(result.data);
        } else {
            console.log(result.reason);
        }
        browser.close();

        return result
        
    } catch (error) {
        browser.close();
        console.log(error);
        return {
            success: false,
            error,
        };
    }
}

// const main = ()=>{
//     monitor({
//         id:process.env.TOKEN_TRANSFERS,
//         ifUserAgent:true,
//     }).then((result)=>{
//         console.log(result);
//     })
// }

// main()


module.exports = monitor