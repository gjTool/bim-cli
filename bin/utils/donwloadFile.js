const fs = require('fs');
const request = require('request');
const path = require('path');
const compressing = require('compressing');
module.exports = async function (filepath) {
  let version = await getVersion();
  let file_url = "http://192.168.2.45:4873/abc-bim/-/abc-bim-" + version + ".tgz";
  let file_path = path.resolve(process.cwd(), "abc-bim-" + version + ".tgz");
  let dir_path = path.resolve(process.cwd(), "package");
  await donwload(file_url, file_path);
  await compressing.tgz.uncompress(file_path, process.cwd());
  return new Promise((resolve, reject) => {
    fs.rename(dir_path, file_path, function (err) {
      if (err) {
        console.log("重命名失败")
        reject()
      } else {
        fs.unlinkSync(file_path);
        resolve()
      }
    })
  })
}
function getVersion() {
  return new Promise((resolve, reject) => {
    let version = "http://192.168.2.45:4873/abc-bim/latest";
    request(version, function (err, res, body) {
      if (!err && res.statusCode === 200) {
        let version = JSON.parse(body).version;
        resolve(version)
      } else {
        reject()
      }
    })
  })
}
function donwload(file_url, file_path) {
  return new Promise((resolve, reject) => {
    request(file_url).pipe(fs.createReadStream(file_path)).on('close', function (err) {
      if (err) {
        console.log("下载失败")
        reject()
      } else {
        resolve()
      }
    })
  })
}