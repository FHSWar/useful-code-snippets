/* 这里叫 Dictionary，实际就是 JS 中的 Map
    set(key,value)：向字典中添加新元素。
    delete(key)：通过使用键值来从字典中移除键值对应的数据值。
    has(key)：如果某个键值存在于这个字典中，则返回true，反之则返回false。
    get(key)：通过键值查找特定的数值并返回。
    clear()：将这个字典中的所有元素全部删除。
    size()：返回字典所包含元素的数量。与数组的length属性类似。
    keys()：将字典所包含的所有键名以数组形式返回。
    values()：将字典所包含的所有数值以数组形式返回。
*/
function Dictionary() {
    var items = {};
    this.has = function(key) {
        return key in items;
    }; 
    this.set = function(key, value) {
        items[key] = value; //{1}
    };
    this.delete= function(key) {
        if (this.has(key)) {
            delete items[key];
            return true;
        }
        return false;
    };
    this.get = function(key) {
        return this.has(key) ? items[key] : undefined;
    };
    this.values = function() {
        var values = [];
        for (var k in items) { //{1}
            if (this.has(k)) {
                values.push(items[k]); //{2}
            }
        }
        return values;
    };
    this.clear = function(){
        items = {}; // {3}
    }; 
    this.size = function(){
        return Object.keys(items).length; //{4}
    }; 
    this.keys = function() {
        return Object.keys(items);
    };
    // 实现一个返回items变量的方法
    this.getItems = function() {
        return items;
    } 
} 

var dictionary = new Dictionary();
dictionary.set('Gandalf', 'gandalf@email.com');
dictionary.set('John', 'johnsnow@email.com');
dictionary.set('Tyrion', 'tyrion@email.com'); 
console.log(dictionary.has('Gandalf'));
console.log(dictionary.size());
console.log(dictionary.keys());
console.log(dictionary.values());
console.log(dictionary.get('Tyrion')); 
dictionary.delete('John'); 
console.log(dictionary.keys());
console.log(dictionary.values());
console.log(dictionary.getItems()); 