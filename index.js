// create an express app
require('dotenv').config;
const express = require("express")
const app = express()
const bodyParser = require('express');
app.use(bodyParser.urlencoded({extended:true}))
// use the express-static middleware
//app.use(express.static("public"))

const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
const Port = process.env.PORT || 3000;

//Env Variables :

    const Region = process.env.REGION || 'eu';
    const RefreshToken = process.env.REFRESH_TOKEN || 'Atzr|IwEBIKaDEcQEt-upWRDiYCpr9w3UXAs1Bpg9phpH6QYZ9QVk93RS28ip2kyS5T55f6M6mV_mLLU4jk6vbPQPJn8KspFgLE5_Ozemye-JVxOiPq7zL1UVDjcuCckibZRddNujWWVldG8KDVmRVUh1sdgbSL-EDqAL6AcFFkWQ0J9YbTs-1X52fSXljyxRdXD8f5L4xHVlZhCBCpvALmJE9XS2ZXXuw7p9rqYBRRNdoBSJCAWlakmIIQKRY2uZEf2z3Ioyrqc4TnQIoF2Gnn_2JHnc1Fzca6iPJddYMTytC4bLZLZ_5t7jS3eMcdMnyBjThoJo44g';
    const ClientId = process.env.SELLING_PARTNER_APP_CLIENT_ID || 'amzn1.application-oa2-client.fb2b1d1c45c040d79115cf4c440b8614';
    const ClientSecret = process.env.SELLING_PARTNER_APP_CLIENT_SECRET || '2b58f2a9ea358a58e5e78a3db5c312fdcdf56c69aabd0a4daab23b42023f16d7';
    const AWSAccessKey = process.env.AWS_ACCESS_KEY_ID || 'AKIAUWP7HSF63GXOMU7F';
    const AWSSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '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';
    const AWSSellingPartnerRole = process.env.AWS_SELLING_PARTNER_ROLE || 'arn:aws:iam::323194687869:role/SPAPIRole';

const SellingPartnerAPI = require('amazon-sp-api');

(async() => {
 /* try {
  let sellingPartner =
  new SellingPartnerAPI({
  region:'eu',
  refresh_token:'Atzr|IwEBIKaDEcQEt-upWRDiYCpr9w3UXAs1Bpg9phpH6QYZ9QVk93RS28ip2kyS5T55f6M6mV_mLLU4jk6vbPQPJn8KspFgLE5_Ozemye-JVxOiPq7zL1UVDjcuCckibZRddNujWWVldG8KDVmRVUh1sdgbSL-EDqAL6AcFFkWQ0J9YbTs-1X52fSXljyxRdXD8f5L4xHVlZhCBCpvALmJE9XS2ZXXuw7p9rqYBRRNdoBSJCAWlakmIIQKRY2uZEf2z3Ioyrqc4TnQIoF2Gnn_2JHnc1Fzca6iPJddYMTytC4bLZLZ_5t7jS3eMcdMnyBjThoJo44g', 
  credentials: {
    SELLING_PARTNER_APP_CLIENT_ID:'amzn1.application-oa2-client.fb2b1d1c45c040d79115cf4c440b8614',
    SELLING_PARTNER_APP_CLIENT_SECRET:'2b58f2a9ea358a58e5e78a3db5c312fdcdf56c69aabd0a4daab23b42023f16d7',
    AWS_ACCESS_KEY_ID:'AKIAUWP7HSF63GXOMU7F',
    AWS_SECRET_ACCESS_KEY:'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',
    AWS_SELLING_PARTNER_ROLE:'arn:aws:iam::323194687869:role/SPAPIRole'
    },
  });
 
  let manageInventoryData = await sellingPartner.callAPI({
  operation: 'getInventorySummaries',
  query: {
  details: true,
  granularityType: 'Marketplace',
  marketplaceIds: 'A1F83G8C2ARO7P'
  }
  });
} catch(e){
  console.log('Error->',e);
}*/
  try {
    console.log('process.env.DATABASE_URL->'+process.env.DATABASE_URL);
    console.log('Region->'+Region);
    let sellingPartner = new SellingPartnerAPI({
      region:Region, //'eu', // The region to use for the SP-API endpoints ("eu", "na" or "fe")
      refresh_token:RefreshToken, //'Atzr|IwEBIKaDEcQEt-upWRDiYCpr9w3UXAs1Bpg9phpH6QYZ9QVk93RS28ip2kyS5T55f6M6mV_mLLU4jk6vbPQPJn8KspFgLE5_Ozemye-JVxOiPq7zL1UVDjcuCckibZRddNujWWVldG8KDVmRVUh1sdgbSL-EDqAL6AcFFkWQ0J9YbTs-1X52fSXljyxRdXD8f5L4xHVlZhCBCpvALmJE9XS2ZXXuw7p9rqYBRRNdoBSJCAWlakmIIQKRY2uZEf2z3Ioyrqc4TnQIoF2Gnn_2JHnc1Fzca6iPJddYMTytC4bLZLZ_5t7jS3eMcdMnyBjThoJo44g', // The refresh token of your app user
      credentials: {
        SELLING_PARTNER_APP_CLIENT_ID:ClientId, //'amzn1.application-oa2-client.fb2b1d1c45c040d79115cf4c440b8614',
        SELLING_PARTNER_APP_CLIENT_SECRET:ClientSecret, //'2b58f2a9ea358a58e5e78a3db5c312fdcdf56c69aabd0a4daab23b42023f16d7',
        AWS_ACCESS_KEY_ID:AWSAccessKey, //'AKIAUWP7HSF63GXOMU7F',
        AWS_SECRET_ACCESS_KEY:AWSSecretAccessKey, //'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',
        AWS_SELLING_PARTNER_ROLE:AWSSellingPartnerRole, //'arn:aws:iam::323194687869:role/SPAPIRole'
        }
    });
    let res = await sellingPartner.callAPI({
      operation:'getOrders',
      endpoint:'orders',
      query: {
        //details: true,
        //granularityType: 'Marketplace',
        MarketplaceIds: 'A1F83G8C2ARO7P',
        LastUpdatedAfter : '2020-09-26'
        }
    });
    console.log('Response ->',JSON.stringify(res.Orders));
    
    if(res != []){
      var orderDetails = [];
      for(let i in res.Orders){
          if(res.Orders[i].AmazonOrderId != "")orderDetails.push(res.Orders[i]);
      }
    }
    //console.log('orderDetails->',JSON.stringify(orderDetails));
    console.log('orderDetails Length  ->',orderDetails.length);
    //console.log('order total amt->'+orderDetails[1].OrderTotal.Amount);
    //console.log('order status->'+orderDetails[1].OrderStatus);

    app.get("", function (req, res) {
    res.sendFile(__dirname+"/index.html"); 
  })

  //DB
.get('/db', async (req, res) => {
  try {
    
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM salesforce.order');
    const results = { 'results': (result) ? result.rows : null};
    console.log('DB75 Response->',result)
    res.send(results);
    res.json({ error: err })
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error ->" + err);
  }
})
//
  app.post('/',(req, res) => {
    


 //Insert Operation :

 if(orderDetails != []){
   var AccountId = '00106000023CXXzAAO'; 
    for(let i in orderDetails){
     // if(orderDetails[i].OrderStatus == 'Canceled')orderDetails[i].OrderStatus = 'Cancelled';
     //if(orderDetails[i].AmazonOrderId != "" && orderDetails[i].SalesChannel != "" && orderDetails[i].OrderStatus != "" && orderDetails[i].MarketplaceId != "" && orderDetails[i].OrderType != "" && orderDetails[i].PurchaseDate != "" && orderDetails[i].OrderTotal.Amount != "" && orderDetails[i].PaymentMethodDetails != "" && orderDetails[i].ShipmentServiceLevelCategory != "" && orderDetails[i].NumberOfItemsShipped != "" && orderDetails[i].IsReplacementOrder != ""){
         // pool.query(`INSERT INTO salesforce.order(ERP7__AmazonOrderId__c, ERP7__SalesChannel__c, Status, ERP7__MarketplaceId__c, ERP7__Type__c, ERP7__Book_Date__c, ERP7__Payment_Mode__c, ERP7__Shipment_Type__c, ERP7__Amount__c, ERP7__Shipped_Quantity__c, ERP7__Is_Back_Order__c)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`, [`${orderDetails[i].AmazonOrderId}`,`${orderDetails[i].SalesChannel}`, `${orderDetails[i].OrderStatus}`, `${orderDetails[i].MarketplaceId}`, `${orderDetails[i].OrderType}`, `${orderDetails[i].PurchaseDate}`, `${orderDetails[i].PaymentMethodDetails}`, `${orderDetails[i].ShipmentServiceLevelCategory}`, `${orderDetails[i].OrderTotal.Amount}`, `${orderDetails[i].NumberOfItemsShipped}`, `${orderDetails[i].IsReplacementOrder}`], (err, res) => {
          pool.query(`INSERT INTO salesforce.order(ERP7__AmazonOrderId__c, ERP7__SalesChannel__c, Status, ERP7__MarketplaceId__c, ERP7__Type__c, ERP7__Book_Date__c, AccountId)VALUES($1,$2,$3,$4,$5,$6,$7)`, [`${orderDetails[i].AmazonOrderId}`,`${orderDetails[i].SalesChannel}`, `${orderDetails[i].OrderStatus}`, `${orderDetails[i].MarketplaceId}`, `${orderDetails[i].OrderType}`, `${orderDetails[i].PurchaseDate}`,`${orderDetails[i].AccountId}`], (err, res) => {   
         if (err) {
                console.log("Error -> Failed to insert data into amazon_orders");
                console.log(err);
            }else{
              console.log('DB res->',res);
            }
        });
       
   // }
    }
  }
 
   

    res.send(`<ul>
    <li><h1>You heave successfully synced total "${JSON.stringify(orderDetails.length)}" amazon orders to the salesforce.</h1></li>
    <br/>
    <a href="https://aqxolt-amazon.herokuapp.com" target="_blank">Back</a>
    <br/>
  </ul>`);
  })


  // start the server listening for requests
  app.listen(Port, 
    () => console.log("Server is running..."));
    //
  } catch(e){
    console.log('Error-> ',e);
  }
})();


    