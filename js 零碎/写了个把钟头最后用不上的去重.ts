type MenuTree = {
    children: MenuTree
    icon?: string // 用不了keyof typeof Icons
    id: string
    page?: string // 就是路由的name
    pid: string
    title: string
  }[];

const dedup = (constant:MenuTree, dynamic:MenuTree) => {
	const getRepeatedStrArr = (arr: string[]) => {
		const temp = arr.reduce((acc, str) => {
			acc[str] ? acc[str]++ : acc[str] = 1;
			return acc;
		}, {} as {[key:string]: number});
		const tempKeyArr = Object.keys(temp);
		// 向结果推入出现超过一次的name值
		return tempKeyArr.reduce((acc, cur) => {
			if (temp[cur] > 1) acc.push(cur);
			return acc;
		}, [] as string[]);
	};

	// 为了splice，用了any，对不住了
	const combined = [...constant, ...dynamic] as any;
	const pageStrArr = combined
		.map((item: MenuTree[number]) => item.page)
		.filter((item: MenuTree[number]) => item !== undefined) as string[];
	const repeatedPage = getRepeatedStrArr(pageStrArr);
	repeatedPage.forEach((pageStr) => {
		const index = combined.findIndex((item: MenuTree[number]|null) => {
			if (item !== null) return item.page === pageStr;
			return false;
		});
		combined.splice(index, 1, null);
	});
	return combined.filter((item: MenuTree[number]|null) => item !== null) as MenuTree;
};