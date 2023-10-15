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
  const { rejects } = require("assert");
  fs = require("fs").promise,
  PNG = require("pngjs").PNG,
  path = require("path");
  const { createReadStream, createWriteStream } = require("fs");
 const Files=[]
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
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {
  return fs.readdir(dir)
  .then((data) => {
    const newArray = data.filter(file => path.extname(file)=== ".png")
    return Files = newArray 
  })
  .catch((err) => {
    throw err;
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
const grayScale = (pathIn, pathOut) => {
  return new Promise((resolve,reject)=>{ 
    Files.forEach((file) => {
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
          this.data[idx] = (255 - this.data[idx])/3;
          this.data[idx + 1] = (255 - this.data[idx + 1])/3;
          this.data[idx + 2] = (255 - this.data[idx + 2])/3;

          // and reduce opacity
          this.data[idx + 3] = this.data[idx + 3] >> 1;
          }
        }
        resolve(this.pack().pipe(createWriteStream((outputPath))));
      })
    });
  })
}


module.exports = {
  unzip,
  readDir,
  grayScale,
};
