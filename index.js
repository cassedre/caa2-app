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

const PORT = process.env.PORT || 3000;
//open listener port
app.listen(PORT, () => {
    console.log('Port 3000')
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

app.get('/items/all', (req, res) => {

   // fetching All the items from database
   Items.find()
   .then(data => {
       console.log(data)
       res.send(data)
   })
   .catch(err => {
       res.status(500).send({
       message:
           err.message || "Some error occurred while retrieving Items."
       });
   });

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

app.get('/update-item/:itemid', (req, res) => {
    //params
    const id = req.params.itemid

    //check if it exists    
    db.Items.find({_id:id}).then(data => {
        if(data){
                res.send(data[0])     
        }else{ 
            res.status(404).send({ message : "No Item With ID ["+ username+"]"})
            
        }
    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || " Error Occured"
        });
    });
})

//delete
app.get('/delete/:itemname', (req, res) => {
    const itemname = req.params.itemname
    //finding Item by username and deleting the Item
     db.Items.deleteOne({item :itemname}).then(data=>{
        // deleting Item
        console.log("Item deleted successfully Item id [ "+ itemname +"]")
        // res.send({success: true, msg: 'Item has been removed successfully'})
        res.redirect('/')
    }).catch(err=>{
        return res.status(409).send({error: true, msg: 'Item name does not exist'})
    }) 
    

})

//post add
app.post('/item/add', (req, res) => {

    const newItem = req.body
    let options=["Drinks","Side Dishes","Breakfast","lunch","dinner"]
    newItem.section=options[newItem.sec_n]
    console.log(options[newItem.sec_n])
    console.log(newItem)

    db.Items.find({item: newItem.item})
    .then(item => {
        // looking for ITEMS data if already exists
        if (item&&item.length) {
            return res.status(409).send({error: true, msg: 'Item already exist'})
        }else{
            let entry =new db.Items({ item: newItem.item, price:newItem.price, section: newItem.section})
            entry
            .save(entry)
            .then(data => {
                res.redirect('/');

            })
            .catch(err => {
            res.status(500).send({
                message:
                err.message || "Some error occurred while creating the Entry."
            });
            });
        }


    })
    .catch(err => {
        res.status(500).send({
        message:
            err.message || "Some error occurred while retrieving Entrys."
        });
    });


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
