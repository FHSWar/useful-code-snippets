/*
    计算多叉树各 branch 节点的 leaf 节点数量
*/
function countLeaves(obj) {
    let res = 0
    function toLeafLayer(obj) {
        if (obj.children.length !== 0) {
            for (const childObj of obj.children) {
                countLeaves(childObj)
                toLeafLayer(childObj)
            }
        } else {
            res++
        }
    }
    toLeafLayer(obj)
    /* 
        叶子结点也会被 count 1，
        于是加这个判断避免混入长度为零 childNum 却为 1 的错误数据
    */
    if(obj.children.length !== 0) obj.childNum = res
    return obj
}

const arr = [
    {
        text: 'a',
        children: [
            {
                text: 'b',
                children: [
                    {
                        text: 'd',
                        children: []
                    },
                    // {
                    //     text: 'e',
                    //     children: []
                    // }
                ]
            },
            {
                text: 'c',
                children: [
                    {
                        text: 'f',
                        children: []
                    },
                    {
                        text: 'g',
                        children: [
                            {
                                text: 'h',
                                children: []
                            },
                            {
                                text: 'i',
                                children: []
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        text: 'a',
        children: [
            {
                text: 'b',
                children: [
                    {
                        text: 'd',
                        children: []
                    },
                    {
                        text: 'e',
                        children: []
                    }
                ]
            },
            {
                text: 'c',
                children: [
                    {
                        text: 'f',
                        children: []
                    },
                    {
                        text: 'g',
                        children: []
                    },
                    {
                        text: 'g',
                        children: []
                    }
                ]
            }
        ]
    }
]

const res = []
for (const obj of arr) {
    res.push(countLeaves(obj))
}
console.log('res', JSON.stringify(res, null, 4))
// console.log('res', res)