const path = require("path");
const { pipeline } = require("stream");
const fs = require("fs").promise;
const {unzip,readDir,grayScale} = require("./IOhandler")
const PNG = require("pngjs").PNG;


const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

function onEnd(err) {
    if (err) {
        console.error(`Error: ${err}`);
        process.exit(1);
    }
    console.log("done");
}
   

unzip(zipFilePath,pathUnzipped)
.then(()=>console.log("All processing complete"))
.then(readDir(pathUnzipped))
.then(grayScale(pathUnzipped,pathProcessed))
.then(onEnd)



