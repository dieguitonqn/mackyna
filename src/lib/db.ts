import mongoose from "mongoose";

const MONGODB_URI=process.env.MONGODB_URI;

const connect =async ()=>{
    const connection = mongoose.connection.readyState;
    if(connection === 1){
        console.log("already conncected");
        return;
    }
    if(connection === 2){
        console.log("Connecting...");
        return;
    }
    try {
        mongoose.connect(MONGODB_URI!, {
            dbName:'Mackyna',
            bufferCommands:true
        });
        console.log("Connected");
    } catch (error:any) {
        console.log("error"+error);
        throw new Error ("Error: ", error)
        
    }
}

export default connect