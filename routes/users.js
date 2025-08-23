const express = require('express')
const router = express.Router()

router.get("/",(req,res) => {
    res.send("User List")
})

router.get("/new",(req,res) => {
    res.render('users/new', { firstName:"L" })
})

router.post("/",(req,res) => {
    const isValid = true
    if (isValid){
        users.push({ name: req.body.firstName} )
        res.redirect(`/users/${users.length -1}`)
    } else{
        console.log("invalid")
        res.render("users/new", {firstName: req.body.firstName})
    }
})


router
    .route("/:id")
    .get((req,res) => {
        console.log(req.user)
        res.send(`Get user with id ${req.params.id}`)
    })
    .put((req,res) => {
        res.send(`Update user with id ${req.params.id}`)
    })
    .delete((req,res) => {
        res.send(`Delete user with id ${req.params.id}`)
    })

const users = [{ name: "Alice" }, { name: "Bob" }]
router.param("id",(req, res, next, id) =>{
    req.user = users[id]
    next()
})


module.exports = router