import { spawn } from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'

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

    child.on('data', data => {
      console.log(`stdout: ${data}`)
    })

    child.on('error', error => {
      console.error(`Error: ${error.message}`)
    })

    child.on('close', async () => {
      const currDir = await getCurrentDirectory()

      const delImg = fs.unlink(path.join(currDir, `${name}/public/next.svg`))
      console.log('deleted next svg')

      const globalcssDir = path.join(currDir, `${name}/src/app/globals.css`)

      let clearGlobal
      if (tags.includes('--tailwind')) {
        clearGlobal = fs.writeFile(
          globalcssDir,
          '@tailwind base;\n@tailwind components;\n@tailwind utilities;',
          'utf-8'
        )
      } else {
        clearGlobal = fs.writeFile(globalcssDir, '', 'utf-8')
      }
      const delCssModule = fs.unlink(
        path.join(currDir, `${name}/src/app/page.module.css`)
      )

      const clearHomePage = fs.writeFile(
        path.join(currDir, `${name}/src/app/page.tsx`),
        `export default function Home() {\n\treturn 'hello world'\n}`
      )

      await Promise.allSettled([
        delImg,
        clearGlobal,
        delCssModule,
        clearHomePage,
      ])
    })
  }

  if (lang === 'reactjs') {
    const command = 'npm'
    let template = tags.map(tag => tag.slice(2))

    if (!template.length) template = ['react-ts']
    const args = ['create-vite@latest', name, '--', '--template', template]

    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
    })

    child.on('data', data => {
      console.log(`stdout: ${data}`)
    })

    child.on('error', error => {
      console.error(`Error: ${error.message}`)
    })

    child.on('exit', code => {
      console.log(`Child process exited with code ${code}`)
    })
  }
}

function getCurrentDirectory() {
  return new Promise((resolve, reject) => {
    const child = spawn('cmd', ['/c', 'cd'])

    let stdoutData = ''
    let stderrData = ''

    child.stdout.on('data', data => {
      stdoutData += data.toString()
    })

    child.stderr.on('data', data => {
      stderrData += data.toString()
    })

    child.on('close', code => {
      if (code === 0) {
        resolve(stdoutData.trim())
      } else {
        reject(new Error(`Command failed with code ${code}: ${stderrData}`))
      }
    })

    child.on('error', error => {
      reject(error)
    })
  })
}
