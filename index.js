const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();



const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xloqa3g.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri);

async function run() {
    try {
        const serviceCollection = client.db('beyondBorder').collection('services');
        const reviewsCollection = client.db('beyondBorder').collection('reviews');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const events = await cursor.toArray();
            res.send(events);
        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const services = await serviceCollection.findOne(query);
            res.send(services);
        })

        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const events = await cursor.limit(3).toArray();
            res.send(events);
        })


        // add a service

        app.post('/service', async (req, res) => {
            const service = req.body;
            // users.push(user);
            // console.log(user)
            const result = await serviceCollection.insertOne(service);
            service._id = result.insertedId;
            console.log(result);
            // res.send(user);
        })





        // Review api
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            const query = {};
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.get('/userreviews', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                };
            }
            const cursor = reviewsCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        app.delete('/userreviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewsCollection.deleteOne(query);
            res.send(result);
        })

        app.put('/userreviews/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const review = req.body;
            const option = { upsert: true };
            console.log(review)

            const updatedReview = {
                $set: {
                    review: review.review

                }
            }
            const result = await reviewsCollection.updateOne(filter, updatedReview, option);
            res.send(result)
        })





    }
    finally {

    }
}
run().catch(err => console.log(err));



// const services = require('./services.json');

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})