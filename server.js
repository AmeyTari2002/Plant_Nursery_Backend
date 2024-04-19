import express from "express"
import dotenv from "dotenv"
import morgan from "morgan";
import connectDb from "./config/db.js";
import authRoute from "./routes/authRoute.js"
import cors from 'cors'
import path from 'path'
import categoryRoutes from './routes/categoryRoutes.js'
import productRoute from './routes/productRoute.js'
// import { fileURLToPath } from "url";

//configure Env
dotenv.config();

//database config
connectDb();


// esmodulefix
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)
// console.log(path.join(__dirname,'./client/dist'))
//rest object
const app = express()

//middleware

app.use(express.json())
app.use(morgan('dev'))
// app.use(express.static(path.join(__dirname,'./client/dist')))

app.use(cors(
    {
        Credential: true,
        origin: "https://ameytari-plant-nursery-app.vercel.app"
    }
))

//routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/category', categoryRoutes)
app.use('/api/v1/product', productRoute)




//api
app.get("/", (req, res) => {
  res.send("<h1>Welcome to ecommerce app</h1>");
});





const PORT = process.env.PORT || 8080;
console.log(PORT)


app.listen(PORT, () => {
    console.log("Server Started");
})
