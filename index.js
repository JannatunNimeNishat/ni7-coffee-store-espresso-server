const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

//middleware
app.use(cors())
app.use(express.json())

//for securing the db config
require('dotenv').config()



const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oth2isl.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const coffeeCollection = client.db('coffee-store-espresso-db').collection('coffee-store-espresso-collection')
                      // CRUDE
    //CREATE
    app.post('/coffees', async(req,res)=>{
      const newCoffee = req.body;
      console.log(newCoffee);
      const result = await coffeeCollection.insertOne(newCoffee)
      console.log(result);
      res.send(result);
    })

    //READ
    app.get('/coffees', async(req,res)=>{
      // const cursor = client.find();
      const cursor =  coffeeCollection.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    //READ a single coffee
    app.get('/coffees/:id', async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query);
      // console.log(result);
      res.send(result);

    })


    //update
    app.put('/coffees/:id', async(req,res)=>{
      const id = req.params.id;
      const updatedCoffee = req.body;
      const filter = {_id: new ObjectId(id)}
      const options = {upsert:true}
      const updateDoc = {
        $set:{
          name:updatedCoffee.name,
          chef:updatedCoffee.chef,
          supplier:updatedCoffee.supplier,
          test:updatedCoffee.test,
          category:updatedCoffee.category,
          details:updatedCoffee.details,
          photo:updatedCoffee.photo
        }
      }

      const result = await coffeeCollection.updateOne(filter,updateDoc,options)

      console.log(id,updatedCoffee);
      res.send(result);
      
    })

    //DELETE
    app.delete('/coffees/:id', async(req,res)=>{
      const id = req.params.id;
      console.log(id);
      const query = {_id: new ObjectId(id)}

      const result = await coffeeCollection.deleteOne(query)
      console.log(result);
      res.send(result);


    })






    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);





app.get('/',(req,res)=>{
    res.send('coffee-store is running')
})



app.listen(port, ()=>{
    console.log(`coffee-store running at port: ${port}`);
})







