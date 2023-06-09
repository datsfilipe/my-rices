import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const browser = await puppeteer.launch({
  headless: 'new'
})

const page = await browser.newPage()
await page.goto('https://www.reddit.com/user/datsfilipe/?sort=top')

await page.waitForSelector('[data-testid="post-container"]')
const posts = await page.evaluate(() => {
  const regex = /^\[.*\].*/

  const elements = Array.from(document.querySelectorAll('[data-testid="post-container"]')).filter(el =>
    regex.test(el.querySelector('[data-adclicklocation="title"] a[data-click-id="body"] h3').innerText)
  )

  const postsArr = elements.map(el => {
    const title = el.querySelector('[data-adclicklocation="title"] a[data-click-id="body"] h3').innerText
    const image = el.querySelector('[data-click-id="media"] img')?.src || null
    if (!image) return null
    return { image, title }
  })

  return postsArr.filter(i => i)
})

await browser.close()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const saveDir = path.resolve(__dirname, '../utils')

const jsonData = JSON.stringify(posts, null, 2)

fs.writeFile(path.join(saveDir, 'posts.json'), jsonData, 'utf8', err => {
  if (err) {
    console.error('An error occurred while writing the file:', err)
    return
  }
  console.log('File saved successfully!')
})
