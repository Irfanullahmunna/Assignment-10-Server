const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.krq3y.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const port = 5055;

client.connect(err => {
    const productCollection = client.db("medicine").collection("products");
    const orderedProduct = client.db("medicine").collection("orderedProducts");

    //Try to Connect 
    // app.get('/', (req, res) => {
    //     res.send("Hello")
    // })

    app.get('/products', (req, res) => {
        productCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    })
    app.post("/addOrder/:email", (req, res) => {
        const order = req.body;
        orderedProduct.insertOne(order)
            .then(result => {
                console.log('data added successfully');
                res.send("Data added Successfully");
                res.redirect('/checkout');
            })
    })
    app.post("/addProducts", (req,res) => {
        const product = req.body;
        productCollection.insertOne(product)
            .then(result => {
                console.log('Data added Successfully');
                res.send("Data added Successfully");
                res.redirect('/');
            })
    })
    app.get('/person/:email', (req, res) => {
        orderedProduct.find({ email: req.params.email })
            .toArray((err, documents) => {
                console.log(req.params.email)
                res.send(documents);
            })
    })
    app.delete('/delete/:id', (req, res) => {
        productCollection.deleteOne({_id: ObjectId(req.params.id)})
            .then(result => {
                console.log(result);
                res.send(result.deleteCount > 0)
            })
    })
});



console.log("Listening");
app.listen(process.env.PORT || port);
