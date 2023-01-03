import express from 'express'
import connectDB from './db/connectdb.js'
import web from './routes/web.js'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config()

const port = process.env.PORT || 5000;
const DATABASE_URL =  process.env.DATABASE_URL
const app = express();
app.use(cors({credentials:true, origin:true}));
//app.use(cors({credentials:true, origin:"http://localhost:3000"}));

connectDB(DATABASE_URL)
app.use(express.json())
app.use(cookieParser());



app.use('/', web)

app.listen(port, ()=>{
    console.log(`server listening at http://localhost:${port}`)
})