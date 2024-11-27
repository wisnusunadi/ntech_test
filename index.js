import express from "express";
import db from "./config/Database.js";
// import Users from "./models/UserModel.js";
import router from "./routes/index.js";
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()
const app = express();
const useCors = cors();

try {
    await db.authenticate()
    console.log('Database Connected')
    // await Users.sync();
} catch (error) {
    console.log(error)
}
app.use(useCors);
app.use(express.json());
app.use(router);
app.listen(5000, () => console.log("Server Running"))
app.use((req, res) => {
    res.status(404).json({
      status: 102,
      message: 'Url atau method yang anda masukkan salah',
      data: null
    });
  });