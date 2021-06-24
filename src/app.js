require('dotenv').config()
const express = require("express")
const app = express()
const path = require('path')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const User = require("./models/users")

app.use(express.urlencoded({ extended: false }))

require("./database/connection");
const port = process.env.PORT || 7000;

const staticPath = path.join(__dirname, "./public");
app.use(express.static(staticPath));

app.set("view engine", "hbs");

console.log(process.env.SECRET_KEY);

app.get("/signup", (req, res) => {
    res.render("registerpage")
})
app.get("/", (req, res) => {
    res.render("loginpage")
})

app.post("/login", async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        console.log(password);

        const user = await User.findOne({username:username})
        console.log(user.password)

        const isMatch = await bcrypt.compare(password,user.password)

        const token = await user.generateAuthToken();
            console.log("generated token is " + token);

        if(isMatch){
            res.render("homepage")
        }else{

            res.send("invalid details else")
        }
    } catch (error) {
        res.status(400).send("invalid details")
    }
})


app.post("/register", async (req, res) => {

    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;

        if (password === cpassword) {
            const user = new User({
                username: req.body.username,
                email: req.body.email,
                phone: req.body.phone,
                password: password,
                confirmpassword: cpassword
            })

            console.log("user data from form "+user);

            const token = await user.generateAuthToken();
            console.log("generated token is " + token);

            const registered = await user.save();
            console.log("registered user details " + registered);
            res.status(201).render("loginpage");
        } else {
            res.send("password not matching")
        }

    } catch (error) {
        res.status(400).send(error)
        console.log("catch error "+error);
    }


})

//concept of bcrypt 
// const bcrypt = require("bcryptjs");
// const hashPassword = bcrypt.hashSync("tushar123",10);
// console.log(hashPassword);
// const bool = bcrypt.compareSync("tushar123",hashPassword)
// console.log(bool);

// concept of JWT 
// const jwt = require("jsonwebtoken")

// const createToken = async () => {
//     const token = jwt.sign({_id:"60d396e4230dcc6018ba8111"}, "mynameisamaniliveinrampuruttarpradesh",{
//         expiresIn: "60 seconds"
//     })
//     console.log(token);
//     const verified = jwt.verify(token,"mynameisamaniliveinrampuruttarpradesh");
//     console.log(verified);
// }

// createToken();

app.listen(port, () => {
    console.log(`connection successful..  at ${port}`);
})