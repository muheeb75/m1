// create an express app
const express = require("express")
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}))



const SellingPartnerAPI = require('amazon-sp-api');

(async() => {
  
  try {
    let sellingPartner = new SellingPartnerAPI({
      region:'eu', // The region to use for the SP-API endpoints ("eu", "na" or "fe")
      refresh_token:'Atzr|IwEBIKaDEcQEt-upWRDiYCpr9w3UXAs1Bpg9phpH6QYZ9QVk93RS28ip2kyS5T55f6M6mV_mLLU4jk6vbPQPJn8KspFgLE5_Ozemye-JVxOiPq7zL1UVDjcuCckibZRddNujWWVldG8KDVmRVUh1sdgbSL-EDqAL6AcFFkWQ0J9YbTs-1X52fSXljyxRdXD8f5L4xHVlZhCBCpvALmJE9XS2ZXXuw7p9rqYBRRNdoBSJCAWlakmIIQKRY2uZEf2z3Ioyrqc4TnQIoF2Gnn_2JHnc1Fzca6iPJddYMTytC4bLZLZ_5t7jS3eMcdMnyBjThoJo44g', // The refresh token of your app user
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID:'amzn1.application-oa2-client.fb2b1d1c45c040d79115cf4c440b8614',
        SELLING_PARTNER_APP_CLIENT_SECRET:'2b58f2a9ea358a58e5e78a3db5c312fdcdf56c69aabd0a4daab23b42023f16d7',
        AWS_ACCESS_KEY_ID:'AKIAUWP7HSF63GXOMU7F',
        AWS_SECRET_ACCESS_KEY:'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',
        AWS_SELLING_PARTNER_ROLE:'arn:aws:iam::323194687869:role/SPAPIRole'
        }
    });
    let res = await sellingPartner.callAPI({
      operation:'getOrders',
      endpoint:'orders',
      query: {
       
        MarketplaceIds: 'A1F83G8C2ARO7P',
        LastUpdatedAfter : '2020-09-26'
        }
    });
   // console.log('Response->',res.Orders);
    

    if(res != []){
      var orderDetails = [];
      for(let i in res){
        if(res[i].OrderStatus != 'Canceled')orderDetails.push(res[i]);
      }
    }
   // console.log('orderDetails->',JSON.stringify(orderDetails));
    console.log('orderDetails Length->',orderDetails[0].length);
    //
    app.get("", function (req, res) {
    res.send(`<p>${orderDetails[0].length}</p>`); 
  })
 
  // start the server listening for requests
  app.listen(process.env.PORT || 5000, 
    () => console.log("Server is running..."));
    //
  } catch(e){
    console.log('Error->',e);
  }
})();


    