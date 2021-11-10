require('dotenv').config;
const express = require("express")
const app = express()
const bodyParser = require('express');
app.use(bodyParser.urlencoded({extended:true}))
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
const Port = process.env.PORT || 2000;

//Heroku Env Variables :
    const Region = process.env.REGION || 'eu';
    const RefreshToken = process.env.REFRESH_TOKEN || 'Atzr|IwEBIKaDEcQEt-upWRDiYCpr9w3UXAs1Bpg9phpH6QYZ9QVk93RS28ip2kyS5T55f6M6mV_mLLU4jk6vbPQPJn8KspFgLE5_Ozemye-JVxOiPq7zL1UVDjcuCckibZRddNujWWVldG8KDVmRVUh1sdgbSL-EDqAL6AcFFkWQ0J9YbTs-1X52fSXljyxRdXD8f5L4xHVlZhCBCpvALmJE9XS2ZXXuw7p9rqYBRRNdoBSJCAWlakmIIQKRY2uZEf2z3Ioyrqc4TnQIoF2Gnn_2JHnc1Fzca6iPJddYMTytC4bLZLZ_5t7jS3eMcdMnyBjThoJo44g';
    const ClientId = process.env.SELLING_PARTNER_APP_CLIENT_ID || 'amzn1.application-oa2-client.fb2b1d1c45c040d79115cf4c440b8614';
    const ClientSecret = process.env.SELLING_PARTNER_APP_CLIENT_SECRET || '2b58f2a9ea358a58e5e78a3db5c312fdcdf56c69aabd0a4daab23b42023f16d7';
    const AWSAccessKey = process.env.AWS_ACCESS_KEY_ID || 'AKIAUWP7HSF63GXOMU7F';
    const AWSSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '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';
    const AWSSellingPartnerRole = process.env.AWS_SELLING_PARTNER_ROLE || 'arn:aws:iam::323194687869:role/SPAPIRole';

const SellingPartnerAPI = require('amazon-sp-api');
const e = require('express');

(async() => {
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
      
      //Order sync:
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
         console.log('Response Orders ->',JSON.stringify(res.Orders));
         var AmazonOrderIdList = [];
         for(let i in res.Orders){
           if(res.Orders[i].AmazonOrderId != "") AmazonOrderIdList.push(res.Orders[i].AmazonOrderId);
         }
         
      //Sync OrderItems
      console.log('Response AmazonOrderId ->',JSON.stringify(AmazonOrderIdList));
      var AllItems = [];
      for(let i in AmazonOrderIdList){
      var OrderItems = await sellingPartner.callAPI({
        operation:'getOrderItems',
     // endpoint:'orders',
     
      path:{
        orderId:AmazonOrderIdList[i]
      }
    
      });
      AllItems.push(OrderItems);
     // console.log('Response OrderItems ->',OrderItems);

    }
    var mainProductIdList = [];

    console.log('Response All Items ->', AllItems);
    var OrderItemsList = [];
    if(AllItems != []){
      for(let i in AllItems){
       for(let j in AllItems[i].OrderItems){
        OrderItemsList.push(AllItems[i].OrderItems[j]); 
       }
      }
    }
     //Product sync:
      
    /*  if(res != []){
        var orderDetails = [];
        for(let i in res.Orders){
          if(res.Orders[i].AmazonOrderId != "")orderDetails.push(res.Orders[i]);
        }
      }*/
      //console.log('orderDetails->',JSON.stringify(orderDetails));
     // console.log('orderDetails Length  ->',orderDetails.length);
      //console.log('order total amt->'+orderDetails[1].OrderTotal.Amount);
      //console.log('order status->'+orderDetails[1].OrderStatus);
      app.get("", function (req, res) {
      res.sendFile(__dirname+"/index.html"); 
  })

    //DB test
   /* .get('/db', async (req, res) => {
      try {
      
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM salesforce.product2');
        const results = { 'results': (result) ? result.rows : null};
        //console.log('DB75 Response->',result) 
        var productList = [];
        var mainProductList = [];
        for(let i in result.rows){
        productList.push(result.rows[i]);
        }
       // res.send(JSON.stringify(OrderItemsList[0].OrderItemId + result.rows[0].erp7__orderitemid__c));
        //res.send(`${JSON.stringify(productList)}`);
        if(productList.length > 0 && OrderItemsList.length > 0){
         
          for(let i in productList){
            for(let j in OrderItemsList){
             // console.log("=>"++"="+)
              if(productList[i].erp7__orderitemid__c == OrderItemsList[j].OrderItemId){
                //res.send(`${JSON.stringify(productList[i])}`);
                mainProductList.push(productList[i]);
              }
            }
          }
          res.send(JSON.stringify(mainProductList));
        }
        
        console.log('main Product List->',JSON.stringify(mainProductList));
        
      } catch (err) {
        console.error(err);
        res.send("Error ->" + err);
      }
    })*/
    //

  //On click Insert Sync Orders Operation
  app.post('/syncOrders',(req, res) => {
    
    //Upsert Operation for Orders:
    if(orderDetails != []){
      var AccountId = '00106000023CXXzAAO'; 
      var isActive = true;
      for(let i in orderDetails){
        if(orderDetails[i].OrderStatus == 'Canceled')orderDetails[i].OrderStatus = 'Cancelled';
        if(orderDetails[i].AmazonOrderId != "" && orderDetails[i].SalesChannel != "" && orderDetails[i].OrderStatus != "" && orderDetails[i].MarketplaceId != "" && orderDetails[i].OrderType != "" && orderDetails[i].PurchaseDate != "" && AccountId != ""){
          pool.query(`INSERT INTO salesforce.order(ERP7__AmazonOrderId__c, ERP7__SalesChannel__c, Status, ERP7__MarketplaceId__c, ERP7__Type__c, EffectiveDate, ERP7__Payment_Mode__c, ERP7__Shipment_Type__c, ERP7__Amount__c, ERP7__Shipped_Quantity__c, ERP7__Is_Back_Order__c,AccountId,ERP7__Active__c)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) ON CONFLICT (ERP7__AmazonOrderId__c) DO NOTHING` , [`${orderDetails[i].AmazonOrderId}`,`${orderDetails[i].SalesChannel}`, `${orderDetails[i].OrderStatus}`, `${orderDetails[i].MarketplaceId}`, `${orderDetails[i].OrderType}`, `${orderDetails[i].PurchaseDate}`, `${orderDetails[i].PaymentMethodDetails}`, `${orderDetails[i].ShipmentServiceLevelCategory}`, `${orderDetails[i].OrderTotal.Amount}`, `${orderDetails[i].NumberOfItemsShipped}`, `${orderDetails[i].IsReplacementOrder}`, `${AccountId}`, `${isActive}`], (err, res) => {
          //pool.query(`INSERT INTO salesforce.order(ERP7__AmazonOrderId__c, ERP7__SalesChannel__c, Status, ERP7__MarketplaceId__c, ERP7__Type__c, EffectiveDate, AccountId)VALUES($1,$2,$3,$4,$5,$6,$7)`, [`${orderDetails[i].AmazonOrderId}`,`${orderDetails[i].SalesChannel}`, `${orderDetails[i].OrderStatus}`, `${orderDetails[i].MarketplaceId}`, `${orderDetails[i].OrderType}`, `${orderDetails[i].PurchaseDate}`,`${AccountId}`], (err, res) => {   
          if (err) {
                console.log("Error-> Failed to insert data into amazon_orders");
                console.log(err);
            }else{
              console.log('DB res->',res);
            }
        });
       
       }
        else{
      alert('No Orders Found to sync');
      }
    }
  }
    //Nav to Success Screen
    res.sendFile(__dirname+"/success.html");
  })

 //On click Insert Sync Products Operation
  app.post('/syncProducts',(req, res) => {

    console.log('ProductInfo ->', JSON.stringify(AllItems));

     //Upsert Operation for orderItems:
    console.log('OrderItemsList ->', JSON.stringify(OrderItemsList));
     if(OrderItemsList != []){
      var Amazon = true;
      var isActive = true;
      var trackInventory = true;
      for(let i in OrderItemsList){
        if(OrderItemsList[i].OrderItemId != "" && OrderItemsList[i].ItemPrice.Amount != "" && OrderItemsList[i].ASIN != "" && OrderItemsList[i].SellerSKU != "" && OrderItemsList[i].Title != ""){
          pool.query(`INSERT INTO salesforce.product2(ERP7__OrderItemId__c, ERP7__Amazon__c, Name, ERP7__SKU__c, ERP7__ASIN_Code__c, ERP7__Price_Entry_Amount__c,IsActive,ERP7__Track_Inventory__c)VALUES($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (ERP7__OrderItemId__c) DO NOTHING` , [`${OrderItemsList[i].OrderItemId}`,`${Amazon}`,`${OrderItemsList[i].Title}`, `${OrderItemsList[i].SellerSKU}`,`${OrderItemsList[i].ASIN}`, `${OrderItemsList[i].ItemPrice.Amount}`,`${isActive}`,`${trackInventory}`], (err, res) => {
          if (err) {
                console.log("Error-> Failed to insert data into amazon_orders_items");
                console.log(err);
            }
            else{
              console.log('DB res->',res);
            }
            
          })
        }
      }
      //Product query to fetch product from salesforce for PriceBookEntries :
      pool.connect();
      pool.query('SELECT * FROM salesforce.product2', (err, ress) => {
        if (err) throw err;
        for (let row of ress.rows) {
          console.log(JSON.stringify(row));
        }
        //res.send(JSON.stringify(ress));

        var productList = [];
        for(let i in ress.rows){
        productList.push(ress.rows[i]);
        }
       // res.send(JSON.stringify(OrderItemsList[0].OrderItemId + result.rows[0].erp7__orderitemid__c));
        //res.send(`${JSON.stringify(productList)}`);
        if(productList.length > 0 && OrderItemsList.length > 0){
         
          for(let i in productList){
            for(let j in OrderItemsList){
             // console.log("=>"++"="+)
              if(productList[i].erp7__orderitemid__c == OrderItemsList[j].OrderItemId){
                //res.send(`${JSON.stringify(productList[i])}`);
                //pushed salesforce product id's:
                mainProductIdList.push(productList[i].sfid);
              }
            }
          }
         // res.send(JSON.stringify(mainProductIdList));
        }
        
       // pool.end();
      });
      console.log('main Product List->',JSON.stringify(mainProductIdList));

      pool.connect();
      pool.query('SELECT * FROM salesforce.pricebookentry', (err, resp) => {
        if (err) throw err;
        var priceBookEntryList = [];
        var newPriceBookEntries = [];
        const priceBookMap = new Map();
        for(let i in resp.rows){
           priceBookEntryList.push(resp.rows[i]);
         }
        // res.send(JSON.stringify(mainProductIdList));
         if(priceBookEntryList.length > 0){
           for(let i in priceBookEntryList){
             for(let j in mainProductIdList){
               if(priceBookEntryList[i].product2id == mainProductIdList[j]){
                 //res.send(`${JSON.stringify(productList[i])}`);
                 //pushed salesforce product id's:
                 newPriceBookEntries.push(priceBookEntryList[i]);
                 priceBookMap.set([mainProductIdList[j]],[priceBookEntryList[i]]);
                 
               }
             }
           }
         }
       // res.send(JSON.stringify(newPriceBookEntries+""+productId));
       res.send(JSON.stringify(priceBookMap));
        //priceBookMap.set();
        
      })
     
    }

    
    //Nav to Success Screen
    //res.sendFile(__dirname+"/success.html"); 
  })

  // start the server listening for requests
  app.listen(Port, 
    () => console.log("Server is running..."));
    //
  }catch(e){
    console.log('Error-> ',e);
  }
  })();


    