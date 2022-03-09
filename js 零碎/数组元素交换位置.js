// 记得之前力扣里面有这么用的，第一行的分号不能省
const arr = [1,2,3,4];
[arr[1], arr[2]] = [arr[2], arr[1]]
console.log(arr) // [ 1, 3, 2, 4 ]