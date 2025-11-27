require("dotenv").config();
const mongoose = require("mongoose");

async function connectMongo(){
	const uri = process.env.MONGO_URI;

	if(!uri){
		console.error("MONGO_URI missing in .env file");
		process.exit(1);
	}

	await mongoose.connect(uri,{

	});
	console.log("Connected to MongoDB");
}
module.exports = connectMongo;
