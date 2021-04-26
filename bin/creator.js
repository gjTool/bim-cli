// 写入文件，安装依赖
const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const {
  spawn
} = require('child_process');
const clearConsole = require('./utils/clearConsole');
const inquirer = require('inquirer');
const donwloadFile = require('./utils/donwloadFile');
let startTime, endTime;

module.exports = async function (name) {
  let answer = await setInquirer(name)
  // 目标路径
  const dest = path.resolve(process.cwd(), name);

  startTime = new Date().getTime()
  clearConsole('cyan', `X-BUILD v${require('../package').version}`);

  let data = await readFile(name)
  data = JSON.parse(data.toString());
  data.name = answer.projectName ? answer.projectName : name;
  data.version = answer.projectVersion ? answer.projectVersion : "1.0.0";
  data.author = answer.author ? answer.author : "";
  data.description = answer.description ? answer.description : "";
  await writeFile(name, data)
  console.log(`> 项目生成路径： ${chalk.yellow(dest)}`);
  console.log(`> 正在自动安装依赖，请稍等...`);
  console.log('');
  await spawnCmd(dest, 'inherit', 'npm', ['install']);
  clearConsole('cyan', `BIM-CLI v${require('../package').version}`);
  endTime = new Date().getTime();
  usageTime = (endTime - startTime) / 1000
  console.log(`> 项目已经创建成功，用时${chalk.cyan(usageTime)}s，请输入以下命令继续...`);
  console.log('');
  console.log(chalk.cyan(' $ ') + chalk.blueBright(`cd ${name}`));
  console.log(chalk.cyan(' $ ') + chalk.blueBright('npm run dev'));
  console.log(` ${chalk.green('提示：如果运行失败，请删除node_modules后解压node_modules.rar到当前，再执行')} ${chalk.blueBright('npm run dev')}`)
};

/**
 * 安装依赖指令
 * @param {string} dest 需要执行指令的路径
 */
function spawnCmd(dest, stdio = 'inherit', cmd, instruction) {
  const ls = spawn(cmd, instruction, {
    cwd: dest,
    stdio: stdio,
    shell: true
  });
  return new Promise((resolve, reject) => {
    ls.on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject();
      }
    });
  })

}
function setInquirer(name) {
  return new Promise((resolve, reject) => {
    let answer = inquirer.prompt([
      {
        type: 'input',
        message: 'your project name:(' + name + ')',
        name: 'projectName'
      },
      {
        type: 'input',
        message: 'your project version:(1.0.0)',
        name: 'projectVersion'
      },
      {
        type: 'input',
        message: 'description',
        name: 'description'
      },
      {
        type: 'input',
        message: 'author',
        name: 'author'
      }
    ])
    resolve(answer)
  });
}
function readFile(name) {
  return new Promise((resolve, reject) => {
    fs.readFile(`${process.cwd()}/${name}/package.json`, (err, data) => {
      if (err) {
        console.log(chalk.red("读取文件失败"))
        process.exit(1)
        reject()
      } else {
        resolve()
      }
    })
  });
}
function writeFile(name, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(`${process.cwd()}/${name}/package.json`, JSON.stringify(data, "", "\t"), (err) => {
      if (err) {
        console.log(chalk.red("写入文件失败"))
        process.exit(1)
        reject()
      } else {
        resolve()
      }
    })
  }