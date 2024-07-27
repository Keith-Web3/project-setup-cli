import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

console.log('commands')

yargs(hideBin(process.argv))
  .command(
    'create <framework/library>',
    'create new project',
    () => {},
    argv => {
      console.info(argv)
    }
  )
  .demandCommand(1)
  .parse()
