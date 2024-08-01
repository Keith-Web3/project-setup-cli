import { spawn } from 'node:child_process'

const NEXTJS_DEFAULT_TAGS = [
  '--ts',
  '--eslint',
  '--app',
  '--src-dir',
  '--import-alias @/*',
]

export const setup = function (name, framework, tags) {
  const lang = framework.trim().toLowerCase()
  if (tags.includes('--default')) {
    const idx = tags.findIndex(el => el === '--default')

    if (idx === -1) return
    tags.splice(idx, 1, ...NEXTJS_DEFAULT_TAGS)
  }
  const tagsString = tags.join(' ')

  if (lang === 'nextjs') {
    const command = 'npx'
    const args = ['create-next-app@latest', name, tagsString]

    console.log(new URL(`./${name}`, import.meta.url).pathname)

    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
    })

    child.on('error', error => {
      console.error(`Error: ${error.message}`)
    })

    child.on('exit', code => {
      console.log(`Child process exited with code ${code}`)
    })
  }
}
