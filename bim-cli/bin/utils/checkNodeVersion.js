const chalk = require("chalk");
const semver = require('semver');
module.exports = function(wanted,cliName){
  return new Promise((resolve,reject)=>{
    if(!semver.satisfies(process.version,wanted)){
      console.log(chalk,red(
        'You are using Node '+process.version+
        ', but this version of '+cliName+
        ' requires Node '+ wanted +
        '.\nPlease upgrade your Node version.'
      ));
      process.exit(1);
      reject();
    }else{
      resolve();
    }
  })
  
}