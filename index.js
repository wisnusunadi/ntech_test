import express from "express";
import db from "./config/Database.js";
// import Users from "./models/UserModel.js";
import router from "./routes/index.js";
import dotenv from "dotenv"

dotenv.config()
const app = express();


try {
    await db.authenticate()
    console.log('Database Connected')
    // await Users.sync();
} catch (error) {
    console.log(error)
}
app.use(express.json());
app.use(router);
app.listen(5000, () => console.log("Server Running"))