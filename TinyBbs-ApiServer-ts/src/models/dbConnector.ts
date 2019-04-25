import mongoose from "mongoose";
import dbConfig from "../../dbConfig.json";
import Koa from "koa";

function connectDb(app: Koa) {
    const currEnv = app.env || "development";
    const currDbConfig = dbConfig[currEnv as string];

    mongoose.connect(currDbConfig.uris, currDbConfig.options);

    // connected event
    mongoose.connection.on("connected", () => {
        console.log("Mongoose default connection open to " + currDbConfig.uris);
    });

    // error event
    mongoose.connection.on("error", (err) => {
        console.log("Mongoose default connection error: " + err);
    });

    // disconnected event
    mongoose.connection.on("disconnected", () => {
        console.log("Mongoose default connection disconnected");
    });

    // process closed event
    process.on("SIGINT", () => {
        mongoose.connection.close(() => {
            console.log("Mongoose default connection is disconnected due to application termination");
            process.exit(0);
        });
    });
}

export default connectDb;
