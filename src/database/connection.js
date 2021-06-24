const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/userdb", {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify : false
}).then(() => {
    console.log("database connection success..");
}).catch((err) => {
    console.log("No connection " + err);
})