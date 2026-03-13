const { default: mongoose } = require("mongoose");

exports.connectdb = async()=>{
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("mongo is connected");
    } catch (error) {
        console.log(error);
    }
}