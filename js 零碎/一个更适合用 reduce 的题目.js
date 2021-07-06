/*
 * @Author: FHSWar
 * @Date: 2021-06-26 18:25:10
 * @Last Edit Time: Do not edit
 */
const subjectDetails = [
	{
		subjectName: "JavaScript",
		count: 10,
	},
	{
		subjectName: "Java",
		count: 20,
	},
	{
		subjectName: "Java",
		count: 10,
	},
	{
		subjectName: "JavaScript",
		count: 22,
	},
];

const map = new Map()
for (const item of subjectDetails) {
	const name = item.subjectName
	if (map.has(name)) {
		map.set(name, {
			count: map.get(name).count + item.count,
			frequency: map.get(name).frequency + 1
		})
	} else {
		map.set(name, { count: item.count, frequency: 1 })
	}
}
const res = []
for (const item of [...map]) {
	res.push({ subjectName: item[0], ...item[1] })
}
console.log(res)
/*
[
  { subjectName: 'JavaScript', count: 32, frequency: 2 },
  { subjectName: 'Java', count: 30, frequency: 2 }
]
*/