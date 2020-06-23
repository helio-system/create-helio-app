#!/usr/bin/env node

const chalk = require('chalk')
const figlet = require('figlet')
const fs = require('fs-extra')
const path = require('path')
const slug = require('slug')
const { exec } = require('child_process')
const { prompt } = require('enquirer')

let destination = process.argv[2]
if (!destination) { console.error(chalk.red('You must specify a target directory name')); process.exit(1) }
destination = path.resolve(destination)

const banner = figlet.textSync('Create Helio App', {
  font: 'Merlin1',
  horizontalLayout: 'default',
  verticalLayout: 'default'
})

const init = async () => {
  console.log(chalk.bold.blue(banner))

  const responses = await prompt([
    { type: 'input', name: 'projectName', message: 'What is the name of your app?', validate: (value, state, item, index) => {
      if (value === '') return chalk.red('You must give your app a name')
      return true
    }},
    { type: 'input', name: 'projectDescription', message: 'Enter a short description of your app:' }
  ])

  const safeProjectName = slug(responses.projectName)

  const Package = {
    title: responses.projectName,
    name: safeProjectName,
    description: responses.projectDescription,
    main: "server.js"
  }

  const { proceed } = await prompt({ type: 'confirm', name: 'proceed', message: `I'll be creating your Helio app at ${chalk.bold.blue(destination)}.\nIs that okay?` })
  if (!proceed) { console.error(chalk.red('Aborting')); process.exit(2) }

  console.log(chalk.bold.green('Generating your app, please wait..'))

  await fs.mkdirp(destination)
  await fs.copy('./template', destination)
  await fs.writeFile(path.join(destination, 'package.json'), JSON.stringify(Package, null, 2))

  console.log(chalk.blue('Your app is ready!'))
}

init()
