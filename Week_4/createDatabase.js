let express = require('express');
let app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb://localhost:27017";
const uri = "mongodb+srv://swastiajmera246:U7us2derY0zTeLT6@cluster0.2tfi8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
let port = process.env.port || 3000;
let collection;
const cors = require('cors');
app.use(cors());

app.use(express.static(__dirname + '/public'))
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function runDBConnection() {
    try {
        await client.connect();
        collection = client.db('test').collection('Cat');
        console.log("Connected to MongoDB and collection 'Cat'");
    } catch(ex) {
        console.error(ex);
    }
}

app.get('/', function (req,res) {
    console.log("html");
    res.render('index.html');
});

app.get('/api/cats', async (req, res) => {
    try {
        const cats = await collection.find({}).toArray(req);
        // console.log("Fetched cats:", cats);
        res.json(cats);
    } catch (err) {
        console.error("Error fetching cats:", err);
        res.status(500).send("Internal Server Error");
    }
});


app.post('/api/cat', (req,res)=>{
    let cat = req.body;
    postCat(cat, (err, result) => {
        if (!err) {
            res.json({statusCode:201, data:result, message:'success'});
        }
    });
});

function postCat(cat,callback) {
    console.log("postCat called");
    collection.insertOne(cat,callback);
}

function getAllCats(callback){
    console.log("getallcats called");
    collection.find({}).toArray(callback);
}

app.listen(port, ()=>{
    console.log(`Express server started on port ${port}`);
    runDBConnection();
});