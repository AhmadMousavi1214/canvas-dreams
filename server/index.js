require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./config/db')

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/' , (req,res)=>{
    res.send(`server is running now ! ${PORT}`)
});

app.listen(PORT,()=>{console.log(`server is running on port ${PORT} !`)});