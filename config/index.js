const mongoose = require("mongoose");
const dotenv = require('dotenv')

dotenv.config()

const connectMongoDB = async () => {
  mongoose.set("strictQuery", false);
  const connect = await mongoose.connect(process.env.DATABASE_URL);
//   console.log(connect);
  console.log(`Connection to MONGODB is successful`);
};
module.exports = connectMongoDB