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


    