const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5144;
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
	res.send("simple crud is running");
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uotm6ic.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	},
});

async function run() {
	try {
		// Connect the client to the server	(optional starting in v4.7)
		await client.connect();

		const database = client.db("ProductDB");
		const productCollection = database.collection("Product");
		const cartCollection = database.collection("Cart");

		app.post("/products", async (req, res) => {
			const user = req.body;
			const result = await productCollection.insertOne(user);
			res.send(result);
		});

		app.get("/products", async (req, res) => {
			const cursor = productCollection.find();
			const result = await cursor.toArray();
			res.send(result);
		});

		app.get("/products/:id", async (req, res) => {
			const id = req.params.id;
			console.log(id);
			const query = { _id: new ObjectId(id) };
			const result = await productCollection.findOne(query);
			res.send(result);
		});

		app.put("/products/:id", async (req, res) => {
			const id = req.params.id;
			const updateProduct = req.body;
			console.log(id, updateProduct);

			const filter = { _id: new ObjectId(id) };
			const options = { upsert: true };

			const updateDoc = {
				$set: {
					ProductRating: updateProduct.Rating,
					Type:  updateProduct.Type,
					ProductName:  updateProduct.name,
					BrandName:  updateProduct.Brand,
					imageUrl: updateProduct.ImageUrl,
					Price:  updateProduct.Price,
					ShortDescription:updateProduct.Description,
				},
			};

			const result = await productCollection.updateOne(
				filter,
				updateDoc,
				options
			);
			res.send(result);
		});



        app.post("/Cart", async (req, res) => {
			const user = req.body;
			const result = await cartCollection.insertOne(user);
			res.send(result);
		});

        app.get("/Cart", async (req, res) => {
			const cursor = cartCollection.find();
			const result = await cursor.toArray();
			res.send(result);
		}); 


        
        app.delete("/Card/:id" , async(req , res) =>{
    
            const id = req.params.id
            // const id = req.params.id
            // get the id which is send from clint via req.params.id
            console.log("plese delete it from database" , id)
			const query = { _id: id };
            // query to select which data need to be delete if not used 
            // all data will be deleted
            const result = await cartCollection.deleteOne(query);
            res.send(result)
      
          })




		// Send a ping to confirm a successful connection
		await client.db("admin").command({ ping: 1 });
		console.log(
			"Pinged to your deployment. You successfully connected to MongoDB!"
		);
	} finally {
		// Ensures that the client will close when you finish/error
		// await client.close();
	}
}
run().catch(console.dir);

app.listen(port, () => {
	console.log(`simple crud is running on ${port}`);
});
