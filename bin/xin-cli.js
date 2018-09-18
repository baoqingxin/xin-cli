#! /usr/bin/env node
const fs = require('fs')
const inquirer = require('inquirer')
const program = require('commander');
const download = require('download-git-repo');
const chalk = require('chalk');
const ora = require('ora');
const symbols = require('log-symbols');
const handlebars = require('handlebars');

program.version('0.0.1', '-v', '--version')
        .command('init <name>')
        .action((name) => {
          if (!fs.existsSync(name)) {
            inquirer.prompt([
              {
                name: 'description',
                message: '请输入项目描述'
              },
              {
                name: 'author',
                message: '请输入作者名称'
              }
            ]).then((answers) => {
              console.log(answers.author);
              const spinner = ora('正在下载模板...')
              spinner.start()
              download('direct:https://github.com/baoqingxin/webpack-vue.git#master', name, {clone: true}, (err) => {
                if (err) {
                  spinner.fail()
                  console.log(symbols.error, chalk.red(err))
                } else {
                  spinner.succeed()
                  const fileName = `${name}/package.json`
                  console.log(fileName)
                  console.log(__dirname)
                  const meta = {
                    name,
                    description: answers.description,
                    author: answers.author
                  }

                  if (fs.existsSync(fileName)) {
                    const content = fs.readFileSync(fileName).toString()
                    const result = handlebars.compile(content)(meta)
                    fs.writeFileSync(fileName, result)
                  }
                  console.log(symbols.success, chalk.green('项目初始化完成'))
                }
              })
            })
          } else {
            console.log(symbols.error, chalk.red('项目已存在'))
          }
        })
program.parse(process.argv)
