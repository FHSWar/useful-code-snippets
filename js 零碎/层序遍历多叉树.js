·function flatTree(root) { // , cb
    const result = [], queue = []
    queue.push(root)
    while (queue.length !== 0) {
        const item = queue.shift()
        if (item.children.length > 0) {
            item.children.map((childItem) => {
                queue.push(childItem)
            })
        }
        result.push(item)
    }
    console.log('result')
    return result
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

console.log(flatTree(arr[0]))