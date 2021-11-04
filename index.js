const express = require('express');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5000;

const ObjectId = require('mongodb').ObjectId;

// middlewear
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.navt1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// The database to use


async function run() {
    try {
        await client.connect();
        const database = client.db("travelo");
        const servicesCollection = database.collection("services");
        // create a document to insert

        // get services
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();

            res.send(services);
        })

        // single services
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            console.log('load meal with id', service)

            res.json(service);
        })

        // update api
        app.put('/services/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    title: updateUser.title,
                    description: updateUser.description,
                    price: updateUser.price,
                    img: updateUser.img
                },
            };
            const result = await servicesCollection.updateOne(filter, updateDoc, options);
            console.log('updating item of', id);
            res.json(result);
        })

        // post api
        app.post('/services', async (req, res) => {
            const newService = req.body;
            const result = await servicesCollection.insertOne(newService);
            // console.log('hiting the post!', req.body);
            // console.log('added usser', result);
            // res.send('hit the post');
            res.json(result);
        })

        // delete api
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await servicesCollection.deleteOne(query);
            console.log('deleting id', result)

            res.json(result);
        })



    } finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Travelo app from server')
})

app.listen(port, () => {
    console.log(`Travelo app listening at http://localhost:${port}`)
})