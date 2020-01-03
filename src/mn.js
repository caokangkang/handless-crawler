const puppeteer = require("puppeteer");
const { mn } = require("./config/default");
const srcToImg = require("./help/srcToImg");

(async () =>　{
    // 初始化和跳转浏览器地址
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto("https://images.baidu.com");
    console.log('go to https://images.baidu.com');

    // 设置浏览器窗口大小
    await page.setViewport({
        width: 1920,
        height: 1080
    })
    console.log('reset viewport');

    // *获取百度图片的三个动作  1.获取焦点；2.输入关键字；3.点击搜索
    await page.focus('#kw');
    await page.keyboard.sendCharacter('狗');
    await page.click('.s_search');

    // 等待跳转完成处理逻辑
    page.on('load', async () => {
        console.log('page loading done, start fetch....');

        const srcs = await page.evaluate( () => {
            const images = document.querySelectorAll("img.main_img");
            return Array.prototype.map.call(images, img => img.src);
        });
        
        console.log(`get ${srcs.length} images, start download`);

        srcs.forEach(async (src) => {
            await page.waitFor(200);
            await srcToImg(src, mn);
        })

        await browser.close();
    })
})()