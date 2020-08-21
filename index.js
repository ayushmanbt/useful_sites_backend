const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const cookieParser = require('cookie-parser');

const siteRouter = require("./router/sites");
const userRouter = require("./router/users");


require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 8000;

//database connection
mongoose.connect(process.env.MONGODB_CONNECTION_URI,{
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex:true,
        useFindAndModify: false
    })
    .then(() => {
    console.log("DB Connected successfully")
    }).catch((err) => console.error(err));

//middlewares
app.use(cors({
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

//disable x-powered-by header
app.use(function (req, res, next) {
    res.removeHeader("X-Powered-By");
    next();
});

//routes
app.get("/", (req, res) => {
    res.send("Backend Works");
})

app.use("/sites", siteRouter);
app.use("/users", userRouter);


app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
})