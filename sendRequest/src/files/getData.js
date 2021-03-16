require("../db/mongoose")
const Report = require("../models/report")
const {getValueAndPushData} = require("./getValueAndPushData")

const getData = async ( id, page, ) => {
    try {
        let data=[]
        let url =  `https://etherscan.io/tokentxns?a=${id}`
        url = encodeURI(url)
        try {
            for (let i = 1; i < 6; i++) {
                try {
                    await page.goto(url, { waitUntil: 'load' } );
                } catch (error) { }
                let wrongId = await page.$x(`//td//div[contains(text(),'There are no matching entries')]`)
                if ( ( wrongId.length > 0 ) ) {
                    continue
                } else {
                    let txHashXPath = await page.$x(`//tr[${i}]//td[2]//span//a`)
                    let txHashLink = await txHashXPath[0].getProperty("href");
                    txHashLink = await txHashLink.jsonValue()
                    let txHash = await txHashXPath[0].getProperty("innerText");
                    txHash = await txHash._remoteObject.value;
                    let isReport = await Report.find({txHash})
                    if ( isReport.length > 0 ) {
                        continue
                    } else {
                        let status = await page.$x(`//tr[${i}]//td[6]//span`)
                        let textValue = await status[0].getProperty("innerText");
                        let statusValue = await textValue._remoteObject.value;
                        if ( statusValue.includes("IN") ) {
                            let from = await page.$x(`//tr[${i}]//td[5]`)
                            let fromTextValue = await from[0].getProperty("innerText");
                            fromTextValue = await fromTextValue._remoteObject.value;
                            if ( fromTextValue.includes(`Uniswap`) ) {
                                let tokenXPath = await page.$x(`//tr[${i}]//td[9]`)
                                let tokenTextValue = await tokenXPath[0].getProperty("innerText");
                                tokenTextValue = await tokenTextValue._remoteObject.value;
                                let tokenLinkXPath = await page.$x(`//tr[${i}]//td[9]//a`)
                                let tokenLink = await tokenLinkXPath[0].getProperty("href");
                                tokenLink = await tokenLink.jsonValue()
                                let tokenObj = await tokenLink.match(/https:\/\/etherscan\.io\/token\/(0x[^\s]+)\?a=/i);
                                let token = tokenObj[1]
                                if ( tokenTextValue.includes(`Wrapped eth`) || tokenTextValue.includes(`USD Coin (USDC)`) || tokenTextValue.includes(`(USDT)`) ) {
                                    continue
                                } else {
                                    try {
                                        let result = await getValueAndPushData( txHashLink, txHash, tokenTextValue, token, page )
                                        if (result.success) {
                                            console.log(`Succesfully pushed data of ${txHash}`);
                                            await data.push(result.data)
                                        } else { continue }
                                    } catch (error) { console.log(error); }
                                }
                            }
                        }
                    }
                }
            }

            return {
                success: true,
                data
            }
 
        } catch (error) { 
            return {
                success: false,
                reason: error
            }
        }

    } catch (error) {
        return {
            success: false,
            reason: error
        }
    }    
    
}

module.exports = ({getData})