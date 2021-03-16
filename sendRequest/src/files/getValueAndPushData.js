require("../db/mongoose")
const Report = require("../models/report")

const getValueAndPushData = async ( txHashLink, txHash, tokenTextValue, token, page ) => {
    try {
        try {
            await page.goto(txHashLink);
        } catch (error) { }
        try {
            await page.waitForXPath(`(//div[contains(text(),"Transaction Action")]/ancestor::div[@class="row"]//div[@class="media-body"]/span)[3]`)
        } catch (error) { }
        let tokenNameXPath = await page.$x(`(//div[contains(text(),"Transaction Action")]/ancestor::div[@class="row"]//div[@class="media-body"]/span)[3]`)
        let tokenValueName = await tokenNameXPath[0].getProperty("innerText");
        tokenValueName = await tokenValueName._remoteObject.value;
        if ( tokenValueName.includes(`Ether`) || tokenValueName.includes(`usdc`) || tokenTextValue.includes(`usdt`) || tokenTextValue.includes(`weth`) || tokenTextValue.includes(`Wrapped eth`) ) {
            let etherValueXPath = await page.$x(`(//div[contains(text(),"Transaction Action")]/ancestor::div[@class="row"]//div[@class="media-body"]/span)[2]`)
            let etherValue = await etherValueXPath[0].getProperty("innerText");
            etherValue = await etherValue._remoteObject.value;
            let value = await parseFloat(etherValue)
            let data = {
                    txHash,
                    amount:value,
                    token,
                    tokenName:tokenTextValue,
                }
            try {
                let report = new Report({
                    txHash,
                    amount:value,
                    token,
                    tokenName:tokenTextValue
                })
                await report.save()
                console.log(`txHashLink- ${txHashLink}`);
                return {
                    success: true,
                    data
                }
            } catch (error) {
                console.log(error);
            } 
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            error
        }
    }
}


module.exports=({getValueAndPushData})