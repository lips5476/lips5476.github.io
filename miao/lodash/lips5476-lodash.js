// # 注意事项

//   * 刷lodash是加深对js的理解
//   * 刷leetcode是锻炼编程能力
//   * 不要使用转换为字符串再转回去的办法实现任何函数
//   * 文档中示例代码及注释不能完全看懂的先别做
//   * 整条全黄的话会有错误原因的告知，hover查看并修改即可
//     * 没有更新的话Ctrl + F5强刷即可
//     * 一般来说如非题目要求，不要修改函数的输入，而是返回新的值，即实现为纯函数

//    * 用户名不要以数字开头，以数字开头的同学请至github更改用户名，不用重新注册
//    * 文件名中最好不要包含中划线，如果包含中划线，请将中划线换为下划线然后做为变量名及文件名的前缀
//    * 文件名(<username>-lodash.js)全小写，用户名与'lodash'之间的分隔符为中划线
//    * 文件中的变量名全小写: var foobar = {chunk: function(){ }}



var lips5476 = function () {
  function chunk(arr, num) {
    var res = []
    for (var i = 0; i < arr.length; i += num) {
      var temp = []
      for (var j = i; j < i + num && j < arr.length; j++) {
        temp.push(arr[j])
      }
      res.push(temp)
    }
    return res
  }

  function compact(arr) {
    for (var i = 0, len = arr.length; i < len; i++) {
      if (arr[i] == "false" || arr[i] == "" || isNaN(arr[i])) {
        arr.splice(i, 1)
        len--
        i--
      }
    }
    return arr
  }

  function concat(arr) {
    var args = Array.from(arguments).slice(1)
    if (args.length < 2) {
      arr.push(args[0])
    }
    else {
      for (var i = 0; i < args.length; i++) {
        if (!Array.isArray(args[i])) {
          arr.push(args[i])
        }
        else {
          for (var j = 0; j < args[i].length; j++) {
            arr.push(args[i][j])
          }
        }
      }
    }
    return arr

  }

  function uniq(arr) {
    var res = []
    for (var i = 0; i < arr.length; i++) {
      if (res.includes(arr[i])) {
        continue
      }
      else {
        res.push(arr[i])
      }
    }
    return res
  }

  /////////////////////////////////////////////////////////////////////////////////////
  function uniqueBy(arr, f) {
    var res = []
    var obj = {}
    for (var i = 0; i < arr.length; i++) {
      var item
      if (typeof arr[i] == 'object') {
        item = arr[i][f]
      }
      else {
        item = f(arr[i])
      }

      if (item in obj) {
        continue
      }
      else {
        obj[item] = true
        res.push(arr[i])
      }
    }
    return res
  }

  function flattenDeep(arr) {
    var res = []
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i]
      if (Array.isArray(item)) {
        item = flattenDeep(item)
        for (var j = 0; j < item.length; j++) {
          res.push(item[j])
        }
      }
      else {
        res.push(item)
      }
    }
    return res
  }

  function flattenDepth(arr, Depth = 1) {
    if (Depth == 0) {
      return arr
    }
    var res = []
    for (var i = 0; i < arr.length; i++) {
      var item = arr[i]
      if (Array.isArray(item)) {
        item = flattenDepth(item, Depth - 1)
        for (var j = 0; j < item.length; j++) {
          res.push(item[j])
        }
      }
      else {
        res.push(item)
      }
    }
    return res
  }
  /////////////////////////////////////////////////////////////////////////////////////////
  function groupBy(arr, f) {
    var obj = {}
    for (var i = 0; i < arr.length; i++) {
      var item
      if (typeof arr[i] == 'number') {
        item = f(arr[i])
      }
      else {
        item = arr[i][f]
      }
      if (item in obj) {
        obj[item].push(arr[i])
      }
      else {
        obj[item] = [arr[i]]
      }
    }
    return obj
  }

  function keyBy(arr, f) {
    var obj = {}
    for (var i = 0; i < arr.length; i++) {
      if (typeof f == 'string') {
        obj[arr[i][f]] = arr[i]
      }
      else {
        obj[f(arr[i])] = arr[i]
      }
    }

    return obj

  }

  function forEach(arr, f) {
    if (Array.isArray(arr)) {
      for (var i = 0; i < arr.length; i++) {
        f(arr[i])
      }
    }
    else {
      for (var k in arr)
        f(k)
    }
  }

  function map(arr, f) {
    if (Array.isArray(arr)) {
      var res = []

      if (typeof f == 'string') {
        for (var i = 0; i < arr.length; i++) {
          res.push(arr[i][f])
        }
      }
      else {
        for (var i = 0; i < arr.length; i++) {
          res.push(f(arr[i]))
        }
      }
      return res

    }
    else {
      var res = []
      for (var k in arr) {
        res.push(f(arr[k]))
      }
      return res

    }

  }

  function filter(arr, f) {

  }
  function reduce(arr, f, initial) {
    if (Array.isArray(arr)) {
      var startIndex = 0
      if (arguments.length == 2) {
        initial = arr[0];
        startIndex = 1
      }
      for (var i = startIndex; i < arr.length; i++) {
        initial = f(initial, arr[i])
      }
      return initial
    }
    else {
      for (var k in arr) {
        initial = f(initial ? initial : {}, arr[k], k)
      }
      return initial
    }

  }
  function zip() {
    var res = []
    var args = Array.from(arguments)
    for (var i = 0; i < args[0].length; i++) {
      var temp = []
      for (var j = 0; j < args.length; j++) {
        temp.push(args[j][i])
      }
      res.push(temp)
    }

    return res

  }

  function unzip(arr) {
    var res = []
    for (var i = 0; i < arr[0].length; i++) {
      var temp = []
      for (var j = 0; j < arr.length; j++) {
        temp.push(arr[j][i])
      }
      res.push(temp)
    }
    return res

  }
  function keys(obj) {
    var arr = []
    if (typeof obj == 'string' || Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        arr.push(i)
      }
    }
    else {
      for (var k in obj) {
        arr.push(k)
      }

    }
    return arr
  }
  function values(obj) {
    var arr = []
    if (typeof obj == 'string' || Array.isArray(obj)) {
      for (var i = 0; i < obj.length; i++) {
        arr.push(obj[i])
      }
    }
    else {
      for (var k in obj) {
        arr.push(obj[k])
      }

    }
    return arr
  }
  function sortBy(arr, f = (i) => { i }) {

  }

  function isEqual(a, b) {
    if (a === b) {   //只是字面量相等
      return true
    }
    var typea = typeof a, typeb = typeof b
    if (typea !== typeb) {
      return false
    }
    else {
      if (typeof a == 'object') {
        if (Array.isArray(a) && !Array.isArray(b) || Array.isArray(b) && !Array.isArray(a)) {
          return false
        }
        else {               //如果同为数组或者对象
          if (Array.isArray(a)) {
            if (a.length !== b.length) {
              return false
            }
          }
          else {
            var keya = Object.keys(a)
            var keyb = Object.keys(b)
            if (keya.length !== keyb.length) {
              return false
            }
          }

          for (var k in a) {
            if (!(k in b)) {
              return false
            }
            if (!(isEqual(a[k], b[k]))) {
              return false
            }
          }
          return true

        }

      }
      else {
        return false
      }
    }
  }




















  return {
    chunk: chunk,
    compact: compact,
    concat: concat,
    uniq: uniq,
    uniqueBy: uniqueBy,
    flattenDepth: flattenDepth,
    flattenDeep: flattenDeep,
    groupBy: groupBy,
    keyBy: keyBy,
    forEach: forEach,////////////
    filter: filter,///////////////
    map: map,///////////////
    reduce: reduce,/////////////
    zip: zip,
    unzip: unzip,
    keys: keys,
    values: values,
    sortBy: sortBy,////////////
    isEqual: isEqual//////




  }

}()














