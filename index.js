const express = require("express");
const cors = require("cors");
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
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

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const events = await cursor.toArray();
            res.send(events);
        })
        app.get('/service', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const events = await cursor.limit(3).toArray();
            res.send(events);
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