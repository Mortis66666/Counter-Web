const express = require('express')
const http = require('node:http');
const { Server } = require('socket.io');
const mongoose = require('mongoose')
const Counter = require('./models/counter')
const app = express()
const server = http.createServer(app);
const io = new Server(server);
require('dotenv').config();

const dbURI =  `mongodb+srv://counterManager:${process.env.DATABASE_PASSWORD}@cluster0.quo6unb.mongodb.net/counterDB?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(dbURI)
    .then((result) => { 
        console.log('connected to db')
        server.listen(3000)
    })
    .catch((err) => console.log('Error: ', err))

app.set('view engine', 'ejs')
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());


function findAllCounter(req, res, next) {
    Counter.find()
        .then((result) => {
            req.counters = result;   
            next();                  
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send("Database error");
        });
}

app.get("/", findAllCounter, (req, res) => {
    res.render("index", { counters: req.counters})
})

app.post("/",(req, res, next) => {
    const cntr = new Counter({
        name: req.body.counterName,
        value: 0
    })
    cntr.save()
        .then((result) => {
            io.emit('new counter', { result });
            console.log("Save success: ", result)
            next()
        })
        .catch((err) => {
            console.log("Unable to save counter: ", err)
        })
    res.redirect("/");
})

app.delete("/", (req, res) => {
    const { id } = req.body
    Counter.findByIdAndDelete(id)
    .then((result) => {
        io.emit('delete counter', { id: id })
        res.json({ redirect: '/' })
    })
    .catch((err) => console.log("Error deleting: ", err))
})

app.patch("/", (req, res) => {
    try{
        const { id, change } = req.body; 
        if (change != 1 && change != -1) {
            res.status(400).send("YOU are naughty naughtyr")
        } else {
            Counter.findByIdAndUpdate(
                id, 
                { $inc: { value: change }}, 
                { new: true } // important: return updated doc
            )
            .then((result) => {
                io.emit('update counter', { result })
                console.log("update cntr:", result)
                res.json({ redirect: '/' })
            })
            .catch((err) => console.log("Error minus: ", err))
        }
    }
    catch(err) {
        console.log("Error minus: ", err)
    }
})

app.put("/", (req, res) => {
    const { id } = req.body;
    Counter.findByIdAndUpdate(
        id, 
        { $set: { value: 0 }}
    )
    .then((result) => {
        io.emit('reset counter', { result })
        res.json({ redirect: '/' })
    })
    .catch((err) => console.log("Error resetting: ", err))
})

const counterRouter = require("./routes/newCounter")

app.use("/new", counterRouter)
