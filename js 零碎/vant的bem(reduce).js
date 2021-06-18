/*
 * @Author: FHSWar
 * @Date: 2021-06-18 22:10:43
 * @Last Edit Time: Do not edit
 */
function gen(name, mods) {
	if (!mods) return ''
	if (typeof mods === 'string') return ` ${name}--${mods}` // 这里的模板字符串第一个是空格
	if (Array.isArray(mods)) {
		return mods.reduce((ret, item) => ret + gen(name, item), '')
	}
	// 注意到 mod[key] 只要为 truthy 就会 gen(name, key), 至于 mods[keys] 是什么真值是没影响的
	return Object.keys(mods).reduce((ret, key) => ret + (mods[key] ? gen(name, key) : ''), '')
}
function createBEM(name) {
	return (el, mods) => {
		if (el && typeof el !== 'string') {
			mods = el
			el = ''
		}
		el = el ? `${name}__${el}` : name
		return `${el}${gen(el, mods)}`
	}
}

const prefixCls = 'nui-popover'
const bem = createBEM(prefixCls)
console.log(bem) // [Function]
console.log(bem()) // nui-popover
console.log(bem('mask')) // nui-popover__mask
console.log(bem('mask', 'bottom')) // nui-popover__mask nui-popover__mask--bottom
console.log(bem('box', {
	'inset-bottom': true
})) // nui-popover__box nui-popover__box--inset-bottom
console.log(bem('box', {
	'inset-bottom': false
})) // nui-popover__box
console.log(bem('box', {
	bottom: true,
	round: true
})) // nui-popover__box nui-popover__box--bottom nui-popover__box--round
console.log(bem('box', {
	bottom: true,
	round: false
})) // nui-popover__box
console.log(bem('box', {
	bottom: true,
	round: {
		square: true
	}
})) // nui-popover__box nui-popover__box--bottom nui-popover__box--round
console.log(bem('box', {
	bottom: true,
	round: {
		square: false
	}
})) // nui-popover__box nui-popover__box--bottom nui-popover__box--round