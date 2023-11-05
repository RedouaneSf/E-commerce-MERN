const mongoose=require("mongoose");
module.exports= async()=>{

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connection Succeded ..");  
    } catch (error) {
      console.log("Connection Failed to MongoDb..!",error); 
    }
}