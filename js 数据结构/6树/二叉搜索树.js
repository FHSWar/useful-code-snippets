/* 
    - 树相关的结构中递归用的很多
*/
/*
    insert(key)：向树中插入一个新的键。
    search(key)：在树中查找一个键，如果节点存在，则返回true；如果不存在，则返回 false。
    inOrderTraverse：通过中序遍历方式遍历所有节点。
    preOrderTraverse：通过先序遍历方式遍历所有节点。
    postOrderTraverse：通过后序遍历方式遍历所有节点。
    min：返回树中最小的值/键。
    max：返回树中最大的值/键。
    remove(key)：从树中移除某个键。
*/
function BinarySearchTree() {
    // 节点结构在此！
    var Node = function (key) { //{1}
        // 键是树相关的术语中对节点的称呼 
        this.key = key;
        this.left = null;
        this.right = null;
    };
    // 插入节点，递归！
    function insertNode(node, newNode) {
        if (newNode.key < node.key) { //{4}
            if (node.left === null) { //{5}
                node.left = newNode; //{6}
            } else {
                insertNode(node.left, newNode); //{7}
            }
        } else {
            if (node.right === null) { //{8}
                node.right = newNode; //{9}
            } else {
                insertNode(node.right, newNode); //{10}
            }
        }
    };


    var root = null; //{2}
    this.insert = function (key) {
        var newNode = new Node(key); //{1}
        if (root === null) { //{2}
            root = newNode;
        } else {
            insertNode(root, newNode); //{3}
        }
    };
    this.getTree = function () {
        return root
    }
    // 中序遍历 （左中右，遍历会是值**从小到大**的 return）
    this.inOrderTraverse = function (callback) {
        inOrderTraverseNode(root, callback); //{1}
    };
    // 前序遍历 （中左右）
    this.preOrderTraverse = function (callback) {
        preOrderTraverseNode(root, callback);
    };
    // 后序遍历 （左右中）
    this.postOrderTraverse = function (callback) {
        postOrderTraverseNode(root, callback);
    };
    function inOrderTraverseNode(node, callback) {
        if (node !== null) { //{2} 
            inOrderTraverseNode(node.left, callback); //{3}
            callback(node.key); //{4}
            inOrderTraverseNode(node.right, callback); //{5}
        }
    }
    function preOrderTraverseNode(node, callback) {
        if (node !== null) {
            callback(node.key); //{1}
            preOrderTraverseNode(node.left, callback); //{2}
            preOrderTraverseNode(node.right, callback); //{3}
        }
    };
    function postOrderTraverseNode(node, callback) {
        if (node !== null) {
            postOrderTraverseNode(node.left, callback); //{1}
            postOrderTraverseNode(node.right, callback); //{2}
            callback(node.key); //{3}
        }
    };
    // 取最小值
    this.min = function () {
        return minNode(root); //{1}
    };
    function minNode(node) {
        if (node) {
            while (node && node.left !== null) { //{2}
                node = node.left; //{3}
            }
            return node.key;
        }
        return null; //{4}
    };
    // 取最大值
    this.max = function () {
        return maxNode(root);
    };
    function maxNode(node) {
        if (node) {
            while (node && node.right !== null) { //{5}
                node = node.right;
            }
            return node.key;
        }
        return null;
    };
    // 搜索特定的值
    this.search = function (key) {
        return searchNode(root, key); //{1}
    };
    function searchNode(node, key) {
        if (node === null) { //{2}
            return false;
        }
        // 二分搜索的时间复杂度是 O(h)，完全二叉树才是 O(logn) 嗷
        if (key < node.key) { //{3}
            return searchNode(node.left, key); //{4}
        } else if (key > node.key) { //{5}
            return searchNode(node.right, key); //{6}
        } else {
            return true; //{7}
        }
    };
    // 移除节点
    this.remove = function (key) {
        root = removeNode(root, key); //{1} };
        return root
    }
    function removeNode(node, key) {
        if (node === null) { //{2}
            return null;
        }
        if (key < node.key) { //{3}
            node.left = removeNode(node.left, key); //{4}
            return node; //{5}
        } else if (key > node.key) { //{6}
            node.right = removeNode(node.right, key); //{7}
            return node; //{8}
        } else { //键等于node.key
            //第一种情况——一个叶节点
            if (node.left === null && node.right === null) { //{9}
                node = null; //{10}
                return node; //{11}
            }
            //第二种情况——一个只有一个子节点的节点
            if (node.left === null) { //{12}
                node = node.right; //{13}
                return node; //{14}
            } else if (node.right === null) { //{15}
                node = node.left; //{16}
                return node; //{17}
            }
            //第三种情况——一个有两个子节点的节点
            var aux = findMinNode(node.right); //{18}
            node.key = aux.key; //{19}
            node.right = removeNode(node.right, aux.key); //{20}
            return node; //{21}
        }
    };
    function findMinNode(node) {
        while (node && node.left !== null) {
            node = node.left;
        }
        return node;
    };

}
var tree = new BinarySearchTree();
tree.insert(11);
tree.insert(7);
tree.insert(15);
tree.insert(5);
tree.insert(3);
tree.insert(9);
tree.insert(8);
tree.insert(10);
tree.insert(13);
tree.insert(12);
tree.insert(14);
tree.insert(20);
tree.insert(18);
tree.insert(25);
// console.log(tree.getTree());


// function printNode(value) { //{6}
//     console.log(value);
// }
// tree.inOrderTraverse(printNode); //{7}
// tree.preOrderTraverse(printNode); //{7}
// tree.postOrderTraverse(printNode); //{7}
// console.log(tree.min(printNode));
// console.log(tree.max(printNode));
// console.log(tree.search(8));
console.log(tree.remove(2))
console.log(tree.getTree())

// AVL 树是自平衡的二叉搜索树，能保证左右子树高度差小于等于 1，也就是增删改查能始终是 O(logn)，不会退化为 O(n)
// 红黑树是更