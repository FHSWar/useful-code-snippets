/* 
	author: fhsWar
    date: 2022-04-09
	e-mail: fhswar0504@163.com
*/

const { exec } = require('child_process')
const { loopWhile } = require('deasync')
const { readdirSync, statSync } = require('fs')

const GREEN = '\x1b[32m%s\x1b[0m'
const RED = '\x1b[31m%s\x1b[0m'

const imgFileSuffixArr = ['.gif', '.jpg', '.jpeg', '.png', '.svg', '.webp']
const noNeedCheckArr = ['.DS_Store', '.gitignore', 'package-lock.json', 'public']
const rootDir = process.cwd()

// 检查目录格式
const checkDirFormat = (dirArr) => {
	let haveWrongDirName = false
	dirArr.forEach(dirname => {
		if(dirname.toLowerCase() !== dirname) {
			console.error(RED, `文件夹 ${dirname} 命名不符合规范，请改为 kebab case 格式。`)
			haveWrongDirName = true
		}
	})
	if(haveWrongDirName) process.exit(1)
}

// 通过文件后缀判断是否是图片
const imgPathArr = []
const checkIsImg = (path) => {
	let isImg = false
	imgFileSuffixArr.forEach(suffix => {
		if (path.endsWith(suffix)) {
			isImg = true
			imgPathArr.push(path)
		}
	})
	return isImg
}

// 获取所有目录
const dirArr = []
const getAllDirectories = (dir) => {
	const arr = readdirSync(dir).filter(item => !noNeedCheckArr.includes(item))
	arr.forEach(item => {
		const path = `${dir}/${item}`
		if(statSync(path).isDirectory()) dirArr.push(item) && getAllDirectories(path)
	})
}

// 由于文件夹不会在 git staged 中体现，考虑到文件夹为空的情况，这里应该全局扫描
// getAllDirectories(`${rootDir}/src`)
getAllDirectories(rootDir)
checkDirFormat(dirArr)

let done = false
const gitStatus = exec('git diff --name-only --staged')
gitStatus.stdout.on('data', (paths) => {
	let sizeTooLarge = false

	// 校验不是图片的文件们
	paths
		.split('\n') // 处于 staged 的文件列表拆为数组
		.filter(str => !checkIsImg(str) && str !== '') // 滤掉不用测的
		.forEach(path => {
			const stagedFileSize = statSync(path).size
			if (stagedFileSize > 32 * 1024) {
				console.error(RED, '单个文件超过32kb：', path)
				sizeTooLarge = true
			}
		})
	sizeTooLarge
		? console.error(RED, '请调整大文件代码结构！') && process.exit(1)
		: console.log(GREEN, '文件体积校验已完成。✨')

	// 校验是图片的文件们
	imgPathArr.forEach(path => {
		const stagedImgSize = statSync(path).size
		// https://guide.aotu.io/docs/image/size.html
		if (stagedImgSize > 100 * 1024) {
			console.error(RED, '单个图片文件超过100kb：', path)
			sizeTooLarge = true
		}
	})
	sizeTooLarge
		? console.error(RED, '请调整图片体积！') && process.exit(1)
		: console.log(GREEN, '图片体积校验已完成。✨')

	done = true
})
loopWhile(() => !done)

