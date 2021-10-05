/*  这里散列表指 HashMap，即能快速访问到键值对的字典
 *  这里用使用最常见的散列函数——“lose lose”散列函数，方法是简单地将每个键值中的每个字母的ASCII值相加。（loseloseHashCode）
    极简哈希，分离链接处理冲突的哈希，线性探查处理冲突的哈希
    put(key,value)：向散列表增加一个新的项（也能更新散列表）。
    remove(key)：根据键值从散列表中移除值。
    get(key)：返回根据键值检索到的特定的值。
*/
// 用“分离链接”法处理哈希冲突，即冲突时用链表在冲突位置维护不断变长的链表
// 这里 put 需要用到链表
function HashTable() {
    var table = [];
    // HashTable类中的一个私有方法
    function loseloseHashCode(key) {
        var hash = 0; //{1}
        for (var i = 0; i < key.length; i++) { //{2}
            hash += key.charCodeAt(i); //{3}
        }
        return hash % 37; //{4}
    };
    // 辅助类，用于表示将要加入 LinkedList 实例的元素
    function ValuePair(key, value) {
        this.key = key;
        this.value = value;
        this.toString = function () {
            return '[' + this.key + ' - ' + this.value + ']';
        }
    };
    this.put = function (key, value) {
        var position = loseloseHashCode(key);
        if (table[position] == undefined) { //{1}
            table[position] = new LinkedList();
        }
        table[position].append(new ValuePair(key, value)); //{2}
    };
    this.get = function (key) {
        var position = loseloseHashCode(key);
        if (table[position] !== undefined) { //{3}
            //遍历链表来寻找键/值
            var current = table[position].getHead(); //{4}
            while (current.next) { //{5}
                if (current.element.key === key) { //{6}
                    return current.element.value; //{7}
                }
                current = current.next; //{8}
            }
            //检查元素在链表第一个或最后一个节点的情况
            if (current.element.key === key) { //{9}
                return current.element.value;
            }
        }
        return undefined; //{10}
    };
    this.remove = function (key) {
        var position = loseloseHashCode(key);
        if (table[position] !== undefined) {
            var current = table[position].getHead();
            while (current.next) {
                if (current.element.key === key) { //{11}
                    table[position].remove(current.element); //{12}
                    if (table[position].isEmpty()) { //{13}
                        table[position] = undefined; //{14}
                    }
                    return true; //{15}
                }
                current = current.next;
            }
            // 检查是否为第一个或最后一个元素
            if (current.element.key === key) { //{16}
                table[position].remove(current.element);
                if (table[position].isEmpty()) {
                    table[position] = undefined;
                }
                return true;
            }
        }
        return false; //{17}
    };
    this.print = function () {
        for (var i = 0; i < table.length; ++i) { //{1}
            if (table[i] !== undefined) { //{2}
                console.log(i + ": " + table[i]);//{3}
            }
        }
    };
}

// var hash = new HashTable();
// hash.put('Gandalf', 'gandalf@email.com');
// hash.put('John', 'johnsnow@email.com');
// hash.put('Tyrion', 'tyrion@email.com'); 
// console.log(hash.get('Gandalf'));
// console.log(hash.get('Loiane')); 
// hash.remove('Gandalf');
// console.log(hash.get('Gandalf'));


// 这会导致当前哈希策略下的哈希冲突
const hash = new HashTable();
hash.put('Gandalf', 'gandalf@email.com');
hash.put('John', 'johnsnow@email.com');
hash.put('Tyrion', 'tyrion@email.com');
hash.put('Aaron', 'aaron@email.com');
hash.put('Donnie', 'donnie@email.com');
hash.put('Ana', 'ana@email.com');
hash.put('Jonathan', 'jonathan@email.com');
hash.put('Jamie', 'jamie@email.com');
hash.put('Sue', 'sue@email.com');
hash.put('Mindy', 'mindy@email.com');
hash.put('Paul', 'paul@email.com');
hash.put('Nathan', 'nathan@email.com');
console.log(hash.get('Ana'))
console.log(hash.get('Donnie'))

// 用“分离链接”法时调用链表类
function LinkedList() {
    let Node = function (element) {
        this.element = element
        this.next = null
    };
    let length = 0
    let head = null
    this.append = function (element) {
        let node = new Node(element), current
        // head 为空说明该链表对象还没有节点
        if (head === null) {
            // 只要有一个插入，就有了 head
            head = node
        } else {
            // 这个 while 牛, 这个到处用
            current = head
            while (current.next) { current = current.next }
            current.next = node
        }
        length++
    }
    this.insert = function (position, element) {
        if (position >= 0 && position <= length) {
            let node = new Node(element),
                current = head,
                previous,
                index = 0
            // 在第一个位置添加
            if (position === 0) {
                current = position.next
                head = node
            } else {
                // 遍历到指定 position 位置，插进去
                while (index++ < position) {
                    previous = current
                    current = current.next
                }
                node.next = current
                previous.next = node
            }
            // 更新长度列表
            length++
            // 成功插入就返回 true
            return true
        } else {
            // 不能隔着空位插入，JS 数组没这个限制
            return false
        }
    }
    this.indexOf = function (element) {
        let current = head,
            index = -1
        while (current) {
            // 进到 while 就要维护 index，书上这里错了
            index++
            if (element === current.element) {
                return index
            }
            current = current.next
        }
        return -1
    }
    this.remove = function (element) {
        let index = this.indexOf(element)
        console.log(index)
        return this.removeAt(index)
    } // 只移除找到的第一个
    this.removeAt = function (position) {
        // 检查越界值
        if (position > -1 && position < length) {
            let current = head,
                previous,
                index = 0
            //移除第一项
            if (position === 0) {
                head = current.next
            } else {
                while (index++ < position) {
                    previous = current
                    current = current.next
                }
                //将previous与current的下一项链接起来：跳过current，从而移除它
                previous.next = current.next
                length--
                return current.element
            }
        } else {
            return null
        }

    }
    this.isEmpty = function () {
        return length === 0
    }
    this.size = function () {
        return length
    }
    this.getHead = function () {
        return head
    }
    this.toString = function () {
        let current = head
        string = ''
        while (current) {
            string += current.element + (current.next ? '-->' : '')
            current = current.next
        }
        return string
    }
    this.print = function () {
        return JSON.stringify(this.getHead(), null, 4)
    }
}

// 用“线性探查”法处理哈希冲突，即冲突时往数组所在索引+1去插，还不行就反复+1直至插入为止
// 与“分离链接”法主要是 put 和 get 方法的区别
/*function HashTable() {
    var table = [];
    // HashTable类中的一个私有方法
    function loseloseHashCode(key) {
        var hash = 0; //{1}
        for (var i = 0; i < key.length; i++) { //{2}
            hash += key.charCodeAt(i); //{3}
        }
        return hash % 37; //{4}
    };
    // 辅助类，用于表示将要加入 LinkedList 实例的元素
    function ValuePair(key, value) {
        this.key = key;
        this.value = value;
        this.toString = function () {
            return '[' + this.key + ' - ' + this.value + ']';
        }
    };
    this.put = function (key, value) {
        var position = loseloseHashCode(key); // {1}
        if (table[position] == undefined) { // {2}
            table[position] = new ValuePair(key, value); // {3}
        } else {
            var index = ++position; // {4}
            while (table[index] != undefined) { // {5}
                index++; // {6}
            }
            table[index] = new ValuePair(key, value); // {7}
        }
    };

    this.get = function (key) {
        var position = loseloseHashCode(key);
        if (table[position] !== undefined) { //{8}
            if (table[position].key === key) { //{9}
                return table[position].value; //{10}
            } else {
                var index = ++position;
                while (table[index] === undefined
                    || table[index].key !== key) { //{11}
                    index++;
                }
                if (table[index].key === key) { //{12}
                    return table[index].value; //{13}
                }
            }
        }
        return undefined; //{14}
    };
    this.remove = function (key) {
        // todo 待完善
    };
    this.print = function () {
        for (var i = 0; i < table.length; ++i) { //{1}
            if (table[i] !== undefined) { //{2}
                console.log(i + ": " + table[i]);//{3}
            }
        }
    };
}*/

// 哈希表简易版，未处理哈希冲突
/*function HashTable() {
    var table = [];
    // HashTable类中的一个私有方法
    function loseloseHashCode(key) {
        var hash = 0; //{1}
        for (var i = 0; i < key.length; i++) { //{2}
            hash += key.charCodeAt(i); //{3}
        }
        return hash % 37; //{4}
    };
    // 辅助类，用于表示将要加入 LinkedList 实例的元素
    this.put = function(key, value) {
        var position = loseloseHashCode(key); //{5}
        console.log(position + ' - ' + key); //{6}
        table[position] = value; //{7}
    };

    this.get = function (key) {
        // 通过数组实现快读访问，这样哈希只在键名不长而键很多的情况下才有优势
        return table[loseloseHashCode(key)];
    };
    this.remove = function(key) {
        table[loseloseHashCode(key)] = undefined;
    };

    this.print = function () {
        for (var i = 0; i < table.length; ++i) { //{1}
            if (table[i] !== undefined) { //{2}
                console.log(i + ": " + table[i]);//{3}
            }
        }
    };
}*/

// 比 lose lose 好不少的散列函数
function djb2HashCode (key) {
    var hash = 5381; //{1}
    for (var i = 0; i < key.length; i++) { //{2}
    hash = hash * 33 + key.charCodeAt(i); //{3}
    }
    return hash % 1013; //{4}
}; 