import { spawn, exec } from 'node:child_process'
import path from 'node:path'

export const setup = function (name, framework, tags) {
  const lang = framework.trim().toLowerCase()

  if (lang === 'nextjs') {
    const command = 'npx'
    const args = ['create-next-app@latest', name, '--ts --eslint --app']

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
