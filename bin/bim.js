#! /usr/bin/env node
const program = require('commander');
const requiredPackageVersion = require('../package.json').version;
const hasDir = require('./utils/hasDir');
const checkNodeVersion = require('./utils/checkNodeVersion.js');
const requireNodeVersion = require("../package.json").engines.node

let cmd, dirname;

program.version(requiredPackageVersion)
  .usage('<command> [options]');

program.command('create <app-name>')
  .description('create a new project powered by bim-cli')
  .action(async(name, cmd) => {
    await checkNodeVersion(requireNodeVersion,"BIM-CLI")
    // 判断是否存在创建的目录
    await hasDir(name);
    cmd = 'create';
    dirname = name;
    require('./creator')(name);
  });

program.parse(process.argv);
