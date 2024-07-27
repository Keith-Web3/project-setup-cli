import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { setup } from './utils.js'

console.log('commands')

yargs(hideBin(process.argv))
  .command(
    'create <framework> <name>',
    'create new project',
    () => {},
    argv => {
      setup(argv.name, argv.framework)
    }
  )
  .demandCommand(1)
  .parse()
