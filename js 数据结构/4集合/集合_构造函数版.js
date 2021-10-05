/* 和 JS 的 api 基本一致，加了并集，交集，差集，子集
    add(value)：向集合添加一个新的项。
    delete(value)：从集合移除一个值。
    has(value)：如果值在集合中，返回true，否则返回false。
    clear()：移除集合中的所有项。
    size()：返回集合所包含元素的数量。与数组的length属性类似。
    values()：返回一个包含集合中所有值的数组。
*/
function Set() {
    let items = {}
    // this.has = function(value){
    //     return value in items;
    // };
    this.has = function(value){
        return items.hasOwnProperty(value);
    }; 
    this.add = function(value){
        if (!this.has(value)){
            items[value] = value; //{1}
            return true;
        }
        return false;
    }; 
    this.remove = function(value){
        if (this.has(value)){
            delete items[value]; //{2}
            return true;
        }
        return false;
    }; 
    this.clear = function(){
        items = {}; // {3}
    }; 
    this.size = function(){
        return Object.keys(items).length; //{4}
    }; 
    // this.sizeLegacy = function(){
    //     let count = 0;
    //     for(let key in items) { //{5}
    //         // 原型对象上的 `for...in` 会被带出来
    //         if(items.hasOwnProperty(key)) //{6}
    //             ++count; //{7}
    //     }
    //     return count;
    // }; 
    this.values = function(){
        let values = [];
        for (let i=0, keys=Object.keys(items); i<keys.length; i++) {
            values.push(items[keys[i]]);
        }
        return values;
    };
    // 并集
    this.union = function(otherSet){
        let unionSet = new Set(); //{1}
        let values = this.values(); //{2}
        for (let i=0; i<values.length; i++){
            unionSet.add(values[i]);
        }
        values = otherSet.values(); //{3}
        for (let i=0; i<values.length; i++){
            unionSet.add(values[i]);
        }
        return unionSet;
    };
    // 交集
    this.intersection = function(otherSet){
        let intersectionSet = new Set(); //{1}
        let values = this.values();
        for (let i=0; i<values.length; i++){ //{2}
            if (otherSet.has(values[i])){ //{3}
                intersectionSet.add(values[i]); //{4}
            }
        }
        return intersectionSet;
    };
    // 差集 （自己有对方没有的）
    this.difference = function(otherSet){
        let differenceSet = new Set(); //{1}
        let values = this.values();
        for (let i=0; i<values.length; i++){ //{2}
            if (!otherSet.has(values[i])){ //{3}
                differenceSet.add(values[i]); //{4}
            }
        }
        return differenceSet;
    }; 
    // 子集 （自己是否完全包含在对方中）
    this.subset = function(otherSet){
        if (this.size() > otherSet.size()){ //{1}
        return false;
        } else {
        let values = this.values();
        for (let i=0; i<values.length; i++){ //{2}
        if (!otherSet.has(values[i])){ //{3}
        return false; //{4}
        }
        }
        return true; //{5}
        }
    }; 
}

// 基础 api
// let set = new Set();
// set.add(1);
// set.add(2); 
// console.log(set.values())
// console.log(set.size())
// console.log(set.has(1))
// console.log(set.remove(1))
// console.log(set.has(1))
// console.log(set.size())
// console.log(set.clear())
// console.log(set.size())

// 并集
// let setA = new Set();
// setA.add(1);
// setA.add(2);
// setA.add(3);
// let setB = new Set();
// setB.add(3);
// setB.add(4);
// setB.add(5);
// setB.add(6);
// let unionAB = setA.union(setB);
// console.log(unionAB.values())

// 交集
// let setA = new Set();
// setA.add(1);
// setA.add(2);
// setA.add(3);
// let setB = new Set();
// setB.add(2);
// setB.add(3);
// setB.add(4);
// let intersectionAB = setA.intersection(setB);
// console.log(intersectionAB.values());

// 差集 （difference方法会得到所有存在于集合A但不存在于B的值）
// let setA = new Set();
// setA.add(1);
// setA.add(2);
// setA.add(3);
// let setB = new Set();
// setB.add(2);
// setB.add(3);
// setB.add(4);
// let differenceAB = setA.difference(setB);
// console.log(differenceAB.values()); 

// 子集
// let setA = new Set();
// setA.add(1);
// setA.add(2);
// let setB = new Set();
// setB.add(1);
// setB.add(2);
// setB.add(3);
// let setC = new Set();
// setC.add(2);
// setC.add(3);
// setC.add(4);
// console.log(setA.subset(setB));
// console.log(setA.subset(setC)); 