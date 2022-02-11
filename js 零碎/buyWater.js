/* 题目：100000元  2元一瓶水 2空瓶换一瓶 4瓶盖换一瓶  能搞多少水 */
const total = 100000 // 初始的钱
const fullBottlePrice = 2 // 一瓶水的价格
const capPrice = 0.5 // 盖子价格
const emptyBottlePrice = 1 // 空瓶价格

let canBuyAmount = 0
function calTotalCanBuy(money) {
    // 首先用现金把水买下来
    const canBuyThisRound = parseInt(money / 2)
    // 不到两块的就是零钱
    const smallChange = money % 2
    canBuyAmount += canBuyThisRound
    // 接着买装水的空瓶和盖子卖出去，算算拿到多少钱
    let capAmount = emptyBottleAmount = canBuyThisRound
    
    const soldReturn = capAmount*capPrice + emptyBottleAmount*emptyBottlePrice
    console.log('soldReturn', soldReturn)
    // 零钱攒几轮还能买，不能浪费
    if(smallChange+soldReturn > 2) calTotalCanBuy(smallChange+soldReturn)
}
calTotalCanBuy(total)

console.log('canBuyAmount', canBuyAmount)