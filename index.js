// create an express app
require('dotenv').config;
const express = require("express")
const app = express()
const bodyParser = require('body-parser');
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
/*
const RefreshToken = process.env.REFRESH_TOKEN || 'Atzr|IwEBIKaDEcQEt-upWRDiYCpr9w3UXAs1Bpg9phpH6QYZ9QVk93RS28ip2kyS5T55f6M6mV_mLLU4jk6vbPQPJn8KspFgLE5_Ozemye-JVxOiPq7zL1UVDjcuCckibZRddNujWWVldG8KDVmRVUh1sdgbSL-EDqAL6AcFFkWQ0J9YbTs-1X52fSXljyxRdXD8f5L4xHVlZhCBCpvALmJE9XS2ZXXuw7p9rqYBRRNdoBSJCAWlakmIIQKRY2uZEf2z3Ioyrqc4TnQIoF2Gnn_2JHnc1Fzca6iPJddYMTytC4bLZLZ_5t7jS3eMcdMnyBjThoJo44g';
    const ClientId = process.env.SELLING_PARTNER_APP_CLIENT_ID || 'amzn1.application-oa2-client.fb2b1d1c45c040d79115cf4c440b8614';
    const ClientSecret = process.env.SELLING_PARTNER_APP_CLIENT_SECRET || '2b58f2a9ea358a58e5e78a3db5c312fdcdf56c69aabd0a4daab23b42023f16d7';
    const AWSAccessKey = process.env.AWS_ACCESS_KEY_ID || 'AKIAUWP7HSF63GXOMU7F';
    const AWSSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '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';
    const AWSSellingPartnerRole = process.env.AWS_SELLING_PARTNER_ROLE || 'arn:aws:iam::323194687869:role/SPAPIRole';
*/
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
    console.log('process.env.DATABASE_URL'+process.env.DATABASE_URL);
    console.log('AWS_ACCESS_KEY_ID'+process.env.AWS_ACCESS_KEY_ID);
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
        //details: true,
        //granularityType: 'Marketplace',
        MarketplaceIds: 'A1F83G8C2ARO7P',
        LastUpdatedAfter : '2020-09-26'
        }
    });
    console.log('Response->',res.Orders);
    

    if(res != []){
      var orderDetails = [];
      for(let i in res){
        if(res[i].OrderStatus != 'Canceled')orderDetails.push(res[i]);
      }
    }
    console.log('orderDetails->',JSON.stringify(orderDetails));
    console.log('orderDetails Length->',orderDetails[0].length);
    //
    app.get("", function (req, res) {
    res.sendFile(__dirname+"/index.html"); 
  })

  //DB
.get('/db', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM test_table');
    const results = { 'results': (result) ? result.rows : null};
    console.log('DB75->',result)
    res.send(results);
    res.json({ error: err })
    client.release();
  } catch (err) {
    console.error(err);
    res.send("Error->" + err);
  }
})
//
  var name;
  app.post('/',(req, res) => {
    res.send(`<ul>
    <li>${JSON.stringify(orderDetails[0])}</li>
    <br/>
    <li>Total Orders = ${orderDetails[0].length}</li>
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

/*(async() => {
  try {
    let sellingPartner = new SellingPartnerAPI({
      region:'eu', // The region to use for the SP-API endpoints ("eu", "na" or "fe")
     // refresh_token:'<REFRESH_TOKEN>' // The refresh token of your app user
     refresh_token:'Atzr|IwEBIPU1RtJdOqwf0YGa2VkMs1KZKKYNCTW9Cgd9PODYIhagDTuEvZRb45GHthrAd1nK1lUg-9ItFbst5JLZr7cquVtPEDiQpViwsFG-06Kvv8I83hYRyKD1lU2FTQlZfXRfPgamg8Dsz7SpdWGlcx0LsZnwOND6glwqxGTT7nJ9Mg6Lh3rxGdU71F8voqm0cNdpFrSgWjAvPD8eqgXbAnodHuMxwSjvcW0D9GPY3j1Bk3u3YJHmfF-RdViscx7IlV1toIDGOCztpl_fbKg2--MU_O3fNQ6nNSJO-BZplsYwNLhya7oZPC3vH5lLPvjXENpaKQk',// refresh token taken from app > authorize > Generate refresh token
     // JSON of 4 major keys
     credentials: {
      SELLING_PARTNER_APP_CLIENT_ID:'amzn1.application-oa2-client.0c850cdf43ed4e8487a79c648c24bf80',
      SELLING_PARTNER_APP_CLIENT_SECRET:'7f2893920915b2ccb0cfce4af2976484a012e1c380e4afaabe70690178e4fd8a',
      AWS_ACCESS_KEY_ID:'AKIAUWP7HSF63GXOMU7F',
      AWS_SECRET_ACCESS_KEY:'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',
      AWS_SELLING_PARTNER_ROLE:'arn:aws:iam::323194687869:role/SPAPIRole'
      }
    });

    let manageInventoryData = await sellingPartner.callAPI({
      operation: 'getInventorySummaries',
      endpoint:'sellers',
      query: {
      details: true,
      granularityType: 'Marketplace',
      marketplaceIds: 'A1F83G8C2ARO7P'
      }
      });
    
    
    console.log(manageInventoryData);
  } catch(e){
    console.log(e);
  }
})();*/
/*
// create an express app
const express = require("express")
const app = express()

// use the express-static middleware
app.use(express.static("public"))

// define the first route
app.get("/", function (req, res) {
    let value = "Muheeb Pasha";
  res.send(`<h1>Hello, ${value}</h1>`)
})

// start the server listening for requests
app.listen(process.env.PORT || 3000, 
	() => console.log("Server is running..."));

*/
    