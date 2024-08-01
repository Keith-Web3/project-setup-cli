import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { setup } from './utils.js'

yargs(hideBin(process.argv))
  .command(
    'create <framework> <name>',
    'create new project',
    yargs => {
      yargs.positional('framework', {
        type: 'string',
        describe: 'framework to setup',
      })
    },
    argv => {
      const tags = argv.tags.split(' ').reduce((acc, curr) => {
        const newVal = curr.trim()
        if ('  '.includes(newVal)) return acc
        return [...acc, `--${newVal}`]
      }, [])

      setup(argv.name, argv.framework, tags)
    }
  )
  .option('tags', {
    alias: 't',
    type: 'string',
    description: 'just a random tag',
  })
  .demandCommand(1)
  .parse()
