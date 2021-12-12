function getDepth (arr) {
    let outerDepth = 0
    function calcDepth(arr, depth) {
        !depth
            ? depth = 1
            : depth++
        for (const item of arr) {
            if (item.children.length !== 0) {
                console.log('🐮！', depth)
                if (Math.max(depth, outerDepth) !== outerDepth) outerDepth = depth
                calcDepth(item.children, depth)
            }
        }
    }
    calcDepth(arr)
    return outerDepth
}

const arr = [
    {
        text: 'a',
        children: []
    },
    {
        text: 'b',
        children: []
    },
    {
        text: 'c',
        children: [
            {
                text: 'g',
                children: [
                    {
                        text: 'h',
                        children: [
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
        text: 'd',
        children: [
            {
                text: 'j',
                children: []
            }
        ]
    },
    {
        text: 'e',
        children: []
    },
    {
        text: 'f',
        children: []
    },
]

console.log('getDepth(arr)',getDepth(arr))