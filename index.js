const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;
dotenv.config();
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin: [
    "http://localhost:5173",
  ],
  credentials: true,
})
);

// Connect to MongoDB
mongoose.set('strictQuery', false)
mongoose.connect(process.env.MDB_CONNECT)
.then(() => {
  console.log('Mongodb connected');
})
.catch((err) => {
  console.log(err);
})

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));

app.listen(PORT, err => {
  if (err) throw err;
  console.log(`Server started on port: ${PORT}`);
});