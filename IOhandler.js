/**
 * Project: Milestone 1
 * File Name: IOhandler.js
 * Description: Collection of functions for files input/output related operations
 *
 * Created Date:
 * Author:
 *
 */
const AdmZip = require("adm-zip");
const fs = require("fs").promises;
const PNG = require("pngjs").PNG;
const path = require("path");
const { createReadStream, createWriteStream } = require("fs");
 
/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
*/

const unzip = ( pathIn,pathOut) => {
  return new Promise((resolve,reject)=>{ 
    try{
      const zip = new AdmZip(pathIn);
    resolve(zip.extractAllTo(pathOut, true))
    }catch(err){
      reject(err)
    }
  })
}

/**
 * Description: read all the png files from given directory 
 * and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
*/

const readDir = (dir) => {
  return fs.readdir(dir)
    .then((data) => {
      return  data.filter((file) => path.extname(file) === ".png");
    });
};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
*/

// could not figure out how to pass the value
const grayScale = (pathIn, pathOut) => {
  return readDir(pathIn)
 .then((files)=>{
    files.forEach((file) => {
      const inputPath = path.join(pathIn, file);
      const outputPath = path.join(pathOut, file);
      const readStream = createReadStream(inputPath);
      readStream
      .pipe(
        new PNG({
          filterType: 4,
        })
      )
      .on("parsed", function () {
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
          var idx = (this.width * y + x) << 2;

          // invert color
          const gray=(this.data[idx]*0.3)+(this.data[idx + 1]*0.59)+(this.data[idx + 2]*0.11)
          this.data[idx]= gray;
          this.data[idx + 1] = gray;
          this.data[idx + 2]= gray;

          // and reduce opacity
          this.data[idx + 3];
          }
        }
        return(this.pack().pipe(createWriteStream((outputPath))));
      })
    });
  })
}

module.exports = {
  unzip,
  readDir,
  grayScale,
};
