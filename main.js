const path = require("path");
const {unzip,grayScale} = require("./IOhandler")

const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

unzip(zipFilePath,pathUnzipped)
.then(()=>console.log("All processing complete"))
.then(grayScale(pathUnzipped,pathProcessed))
.catch(()=>console.log(err))
