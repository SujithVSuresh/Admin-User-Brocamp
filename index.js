const express = require('express')
const bodyParser = require('body-parser');
const userRouter = require('./routes/userRoutes')
const adminRouter = require('./routes/adminRoute')
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const db = require('./config/db')
const session = require('express-session')
const nocache = require("nocache");


const app = express()

// Parse URL-encoded bodies (form data)
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());


app.use(nocache());

//setting session
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true
}));

//mounting user route.
app.use('/', userRouter)
app.use('/admin', adminRouter)

//global settings.
app.set('view engine', 'ejs')

//setting static files.
app.use("/static", express.static(path.join(__dirname, 'public')))


app.listen(3000, () => {
    console.log("server started")
})



