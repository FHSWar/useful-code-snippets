// 验证了确实可以通过 data-* 属性实现选中元素并执行点击等操作

// 这个并不能转成 import
const puppeteer = require('puppeteer')

async function start() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('http://127.0.0.1:5500/puppeteer_demo/index.html')

    // 可以拿到元素
    // const btns = await page.evaluate(() => Array.from(xxx))
    const btns = await page.$$eval('[data-button]', (btns) => {
        return btns.map(node => node.textContent)
    })
    console.log('truly can!', typeof btns[0], btns[0])

    // 可以进行点击，单需要用 Promise.all()
    // await page.click('#button')
    // await page.click('[data-button]')
    // await page.waitForNavigation()
    // 发现数组中顺序不重要，都能正确截图
    await Promise.all(
        [
            page.click('[data-button]'),
            page.waitForNavigation()
        ]
    )
    await page.screenshot({ path: 'screenshot.png' })

    await browser.close()
}

start()
