const fs = require('fs')

// 输入年份，自动生成文件夹和文件，文件里也已经有每天的小标题
const generateDiaryOutline = (year, path) => { createYearFolder(year, path) }
/*
  @param
    year: 指定年份，生成对应年份的日记框子
    path: 指定路径，指定文件夹生成到对应路径
*/
generateDiaryOutline(2021)

// 创建年份文件夹，输入了年份就用指定的年份，没有就用当年
function createYearFolder(year = new Date().getFullYear(), path) {
  let yearFolderPath
  if (path) {
    yearFolderPath = `${path}/${year}`
  } else {
    yearFolderPath = `/Users/fhs_war/Nutstore Files/fhs-md-lib/${year}`
  }
  // 如果原来没有，就创建文件夹，如果原来有，中断该程序
  try {
    if (!fs.existsSync(yearFolderPath)) {
      fs.mkdirSync(yearFolderPath)
    } else {
      throw Error('该路径已存在同名文件夹，程序已退出。')
    }
  } catch (err) {
    console.error(err)
  }
  // 创建完年份接着创建对应月份的文件夹
  createMonthFolder(yearFolderPath)
}

// 创建月份文件夹，一年固定十二个月
function createMonthFolder(yearFolderPath) {
  // 拿到年份
  const year = yearFolderPath.split('/')[yearFolderPath.split('/').length - 1]
  for (let i = 0; i < 12; i++) {
    // 生成每个月份的文件夹名字
    const monthFolder = `${year}-${`0${i + 1}`.slice(-2)}`
    // 生成月份对应的路径，写入对应文件夹
    const monthFolderPath = `${yearFolderPath}/${monthFolder}`
    try {
      if (!fs.existsSync(monthFolderPath)) {
        fs.mkdirSync(monthFolderPath)
        // 月份文件夹里面是对应的 markdown 文件
        createWeekFile(monthFolderPath)
      }
    } catch (err) {
      console.error(err)
    }
  }
}

// 创建周文件，根据对应年月计算
function createWeekFile(monthFolderPath) {
  // 月份文件名
  const monthFolder = monthFolderPath
    .split('/')[monthFolderPath.split('/').length - 1]
  // 年份月份转为 number 类型给 splitMonthToWeeks 作为入参
  const [yearStr, monthStr] = monthFolder.split('-')
  const weekArr = splitMonthToWeeks(Number(yearStr), Number(monthStr))
  // weekArr.length / 2 得到对应月份周数
  for (let i = 0; i < weekArr.length / 2; i++) {
    const weekFile = `${monthFolder}-week${i + 1}.md`
    const weekFilePath = `${monthFolderPath}/${weekFile}`
    const content = generateFileContent(weekFile, weekArr)
    fs.writeFile(weekFilePath, content, err => {
      if (err) {
        console.error(err)
        return
      }
      //文件写入成功。
    })
  }
}

// 把对应月份切为周，每月一号至对应月份第一个周日为第一周 （相当费事）
function splitMonthToWeeks(year, month) {
  // new Date 不带参数可以生成当天，api 多得很
  // getFullYear 得当前年份，getMonth 得当前月份减一，getDay 得所在日是周几
  const today = new Date()
  year = year || today.getFullYear()
  month = month || today.getMonth() + 1
  // 这个月有几天
  const monthDays = new Date(year, month, 0).getDate()
  // 这个月一号离最近的周日有多少天
  const daysToNextWeek = 7 - new Date(year, month - 1, 1).getDay()
  let weekArr = [], date = 1
  while (date < monthDays) {
    // 当月一号到当月第一个周日是当月的第一周
    if (date === 1) {
      date = date + daysToNextWeek
      // daysToNextWeek === 7 说明此月一号是周日，要单独做一周，所以 push 两个 1
      daysToNextWeek === 7
        ? weekArr.push(1, 1, 2, date, date + 1)
        : weekArr.push(1, date, date + 1)
    } else {
      date += 7
      weekArr.push(date, date + 1)
    }
  }

  // 一个月的天数大于 31 肯定是不对的，要修掉。数组长度是奇数也应该修掉最后一个元素
  while (weekArr[weekArr.length - 1] > 31 || weekArr.length % 2 !== 0) {
    weekArr.pop()
  }

  // 月的最后一个周很可能凑不到七天，通过这个补进去
  if (weekArr[weekArr.length - 1] < monthDays) {
    weekArr.push(weekArr[weekArr.length - 1] + 1, monthDays)
  }
  return weekArr
}

// 根据每周的日期来写入内容 （比较费事）
function generateFileContent(weekFile, weekArr) {
  // 年份不需要，拿到月份和周，周是 weekX 的形式，需要进一步处理
  const [yearStr, monthStr, rawWeekStr] = weekFile.split('-')
  const weekStr = rawWeekStr.split('week')[1].split('.md')[0]
  // 将字符串映射为汉字
  const [monthHanzi, weekHanzi] = strToHanzi(monthStr, weekStr)
  
  // 拿到这一周的起始日和结束日
  const [startDate, endDate] = 
    [weekArr[2*(Number(weekStr) - 1)], weekArr[2*(Number(weekStr) - 1) + 1]]
  const week = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  // 换行很重要
  let content = `# ${monthHanzi}月第${weekHanzi}周\n`
  for(let i = startDate; i < endDate + 1; i++) {
    // 拿到对应日期的周几的基数，然后从 week 数组中拿到对应汉字
    const dayCardinalNum = new Date(yearStr, Number(monthStr) - 1, i).getDay()
    const date = `0${i}`.slice(-2)
    content += `## ${date}日 ${week[dayCardinalNum]}\n### 工作\n### 学习\n`
  }
  // 返回拼接完成的内容
  return content
}

// 数字字符串向汉字的映射
function strToHanzi(monthStr, weekStr) {
  const monthMap = {
    '01': '一',
    '02': '二',
    '03': '三',
    '04': '四',
    '05': '五',
    '06': '六',
    '07': '七',
    '08': '八',
    '09': '九',
    '10': '十',
    '11': '十一',
    '12': '十二',
  }
  const weekMap = {
    '1': '一',
    '2': '二',
    '3': '三',
    '4': '四',
    '5': '五',
    '6': '六',
  }
  return [monthMap[monthStr], weekMap[weekStr]]
}