const express = require('express')
const app = express()
const axios = require('axios');
const cors = require('cors');
const fs = require('fs')
app.use(express.json());
app.use(express.urlencoded());

const db = require("./models");
let resourceURI=process.env.BACKEND_RESOURCES
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("database Connected!");
  })
  .catch(err => {
    console.log("Unable to connect !", err);
    process.exit();
  });


var corsOptions = {
    origin: "*",
};

//body (request)
app.use(express.json())
app.use(cors(corsOptions))
const Items = db.Items;
//view/assets
app.set("view engine", "ejs")
app.use(express.static('assets'));

//open listener port
app.listen(5000, () => {
    console.log('Port 5000')
})


//get all items list
app.get('/', (req, res) => {
    axios.get(resourceURI+'/items/all')
        .then(function(response) {
            // return index and passs items as argument (list)
            res.render('index', { items: response.data });
        })
        .catch(err => {
            res.send(err);
        })

})

//update ITEMS
app.get('/update-item/', (req, res) => {
    res.render('update', {
        item:req.query.item,
        itemId: req.query.itemId,
        section: req.query.section,
        price: req.query.price
    })


})

//update
app.put('/update', (req, res) => {
  //get the id from url
  const item = req.body.item
  //get the update data
  const itemData = req.body
  console.log('data:',itemData)
    db.Items.update({item:item},itemData).then(data=>{
            res.send(data)
        //   res.redirect('/')
        }).catch(err=>{
            return res.status(409).send({error: true, msg: 'Item id not exist'})
        })
  
})

