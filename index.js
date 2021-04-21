const express = require('express')
const app = express()
const cors=require('cors')
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectID;
const port = 5000
require('dotenv').config()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Welcome to clean Bees!')
})



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oagdq.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const serviceCollection = client.db("CleanBees").collection("Service");
  const adminCollection = client.db("CleanBees").collection("Admin");
  const reviewCollection = client.db("CleanBees").collection("Review");
  const orderCollection = client.db("CleanBees").collection("Orders");

  //addProucts
  app.post('/addService',(req,res)=>{
    const newService=req.body
    serviceCollection.insertOne(newService)
    .then(result=>{
        res.send(result.insertedCount>0)
    })    

    })
  //addReview
  app.post('/addReview',(req,res)=>{
    const newReview=req.body
    reviewCollection.insertOne(newReview)
    .then(result=>{
        res.send(result.insertedCount>0)
    })    

    })
  //AddAdmin
  app.post('/addAdmin',(req,res)=>{
    const newAdmin=req.body
    adminCollection.insertOne(newAdmin)
    .then(result=>{
        res.send(result.insertedCount>0)
    })  
   })


  app.post('/isAdmin',(req,res)=>{
    const adminEmail=req.body.email    
    adminCollection.find({email: adminEmail})
    .toArray((error,result)=>{
        if(result.length>0){
          res.send(true)
        }else{
          res.send(false)
        }
    })  
    
   })
    //getService

    app.get('/getService',(req,res)=>{
      serviceCollection.find()
        .toArray((error,items)=>{
            res.send(items)
      })
    })
    //getreview

    app.get('/getReview',(req,res)=>{
      reviewCollection.find()
        .toArray((error,items)=>{
            res.send(items)
      })
    })

    //loadSIngleProduct
    app.get('/oneService/:id',(req,res)=>{
        serviceCollection.find({_id: ObjectId(req.params.id)})
        .toArray((error,documents)=>{
            res.send(documents)
        })
    })

    // DeleteItem
    app.delete('/delete/:id',(req,res)=>{      
      serviceCollection.findOneAndDelete({_id: ObjectId(req.params.id)})
        .then((error,result)=>{
            console.log(result)
        })
    })

    //postOrderData
    app.post('/newOrder',(req,res)=>{
        const newOrderInfo=req.body
        orderCollection.insertOne(newOrderInfo)
        .then(result=>{
            res.send(result.insertedCount>0)
        })
    })

    //getOrderData
    app.get('/orderService',(req,res)=>{
        orderCollection.find({email: req.query.email})
        .toArray((error,result)=>{
            res.send(result)
        })
    })
    //AddOrder Data
    app.get('/allOrder',(req,res)=>{
        orderCollection.find()
        .toArray((error,result)=>{
            res.send(result)
        })
    })




});









app.listen(process.env.PORT || port)