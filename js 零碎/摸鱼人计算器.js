// console.log('好好工作，好好学习，按时睡觉，偶尔运动')

const YUAN_DAN = '-01-01'
const QING_MING = '-04-05'
const LAO_DONG = '-05-01'
const DUAN_WU = '-06-03'
const GUO_QING = '-10-01'

// 农历转国历要用库
const ZHONG_QIU = '-09-10'
const CHUN_JIE = '-02-01'

function strokeFish () {
    const whole = new Date()
    const year = whole.getFullYear()
    const month = whole.getMonth()
    // 一个月的第几天，1 开始
    const date = whole.getDate()
    // 一周的第几天，周一开始
    const to_weekend = whole.getDay() - 1
    const today = new Date(`${year}-${month + 1}-${date}`)
    const to_yuan_dan = parseInt((new Date(`${year+1}${YUAN_DAN}`) - today) / 1000 / 3600 /24)
    const to_chun_jie = parseInt((new Date(`${year+1}${CHUN_JIE}`) - today) / 1000 / 3600 /24)
    const to_qing_ming = parseInt((new Date(`${year+1}${QING_MING}`) - today) / 1000 / 3600 /24)
    const to_lao_dong = parseInt((new Date(`${year+1}${LAO_DONG}`) - today) / 1000 / 3600 /24)
    const to_duan_wu = parseInt((new Date(`${year+1}${DUAN_WU}`) - today) / 1000 / 3600 /24)
    const to_zhong_qiu = parseInt((new Date(`${year+1}${ZHONG_QIU}`) - today) / 1000 / 3600 /24)
    const to_guo_qing = parseInt((new Date(`${year+1}${GUO_QING}`) - today) / 1000 / 3600 /24)
    
    console.log(
        `
        今天是${year}-${month}-${date}-星期三
        早上好，摸鱼人，工作再累，一定不要忘记摸鱼哦！有事没事起身去茶水间去廊道去天台走走，别老在工位上坐着，多喝点水，钱是老板的，但命是自己的!
        距离周末假还有:${to_weekend}天
        距离元旦假还有:${to_yuan_dan}天
        距离春节假还有:${to_chun_jie}天
        距离清明节还有:${to_qing_ming}天
        距离劳动节还有:${to_lao_dong}天
        距离端午节还有:${to_duan_wu}天
        距离中秋节还有:${to_zhong_qiu}天
        距离国庆节还有:${to_guo_qing}天
        `
    )
}
strokeFish()