const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")


const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]

})


userSchema.methods.generateAuthToken = async function (req,res) {
    try {
        console.log(this._id);
        const token = jwt.sign({ _id: this._id}, process.env.SECRET_KEY)
        this.tokens= this.tokens.concat({token:token})
        const data = await this.save();
        console.log(data);
        console.log(token);
        return token;
    } catch (error) {
        res.send("the catch error")
        console.log("the catch error" + error);
    }
}

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        console.log(`the old pass is ${this.password}`)
        this.password = await bcrypt.hash(this.password, 10)
        console.log(`the new pass is ${this.password}`)

        this.confirmpassword = await bcrypt.hash(this.confirmpassword, 10)
    }
    next();
})





//creating collection
const User = new mongoose.model("User", userSchema);

module.exports = User;