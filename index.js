const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3030;
const { MongoClient } = require("mongodb");

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

const config = {
    username: 'username',
    password: 'password',
    db: 'db'
}
// Replace the uri string with your MongoDB deployment's connection string.
const uri =`mongodb+srv://${config.username}:${config.password}@cluster0.9iuxm.mongodb.net/${config.db}?retryWrites=true&w=majority`;

fetchData = async (query={}, options={}, isDistinct=false) => {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
        await client.connect();
        const collection = client.db("battle_king").collection("battle");
        let documents;
        if (isDistinct) {
            documents = await collection.distinct(query.field);
        } else {
            documents = await collection.find(query, {});
        }
        
        let data = [];
        await documents.forEach(doc=> data.push(doc));
        return data;
    } catch(e){
        throw e;
    } finally {
        await client.close();
    } 
}

app.get('/list', async (req, res) => {    
    const query = { field: 'location' };
    const data = await fetchData(query, {}, true);
    res.json(data.filter(loc => loc!=""));
});

app.get('/count', async (req, res) => {
    const query = { $or: [ {attacker_outcome: "win"}, {attacker_outcome: "loss"} ]}; 
    const data = await fetchData(query);
    res.json({count: data.length});
});

app.get('/search', async (req, res) => {
    let query = { $and: [ ]}; 
    for(key in req.query){
        switch(key){
            case 'king':
                query['$and'].push({$or: [ {attacker_king: req.query[key]}, {defender_king: req.query[key]} ]});
                break;
            case 'type':
                query['$and'].push({'battle_type': req.query[key]});
                break;
            case 'location':
                query['$and'].push({'location': req.query[key]});
                break;
        }
    }
    if (query['$and'].length === 0) {
        query = {}
    }
    const options = {
        sort: { name: 1 },
        projection: {_id: 0},
    };
    const data = await fetchData(query, options);
    res.json(data);
});

app.use(express.static(path.join(__dirname,'client','build')));

app.get('/', (request, response) => {
    response.sendFile(path.join(__dirname, 'client','build','index.html'));
});

app.use((request, response) => {
    response.status(404).sendFile(path.join(__dirname,'404.html'));
});
  
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});
