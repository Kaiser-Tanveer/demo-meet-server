const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.tl2ww1y.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// console.log(uri);


const run = async () => {
    try {
        // collections
        const selectedSlotCollection = client.db('DemoMeet').collection('selectedSlot');
        const allSlotCollection = client.db('DemoMeet').collection('allSlots');

        // Posting data to MongoDB
        app.post('/selected', async (req, res) => {
            const query = req.body;
            // const mySlot = (Object.values(query));
            const result = await selectedSlotCollection.insertOne(query);
            // console.log(result);
            res.send(result);
        })

        // Getting data from MongoDB 
        app.get('/times', async (req, res) => {
            const query = {};
            const result = await selectedSlotCollection.find(query).toArray();
            const myBooked = result.map(booked => booked.slot);
            // console.log(myBooked);
            const allSlots = await allSlotCollection.find(query).toArray();
            const match = allSlots[0]?.slot.filter(s => !myBooked?.includes(s));
            // console.log('37', match);
            res.send(match);
        })
    }
    finally {

    }
}

run()


app.get('/', (req, res) => {
    res.send('Demo server is running..');
});

app.listen(port, (req, res) => {
    console.log('Server is running on :', port);
})