/**
 * 实现一个算法，确定一个字符串 s 的所有字符是否全都不同
 * 
 * 输入: s = "leetcode"
   输出: false
 * 输入: s = "abc"
   输出: true
 */

function isUnique (astr) {
   for(let i = 0; i < astr.length; i++) {
       if(astr.indexOf(astr[i]) !== astr.lastIndexOf(astr[i])) return false
   }
   return true
}

// 其他解法：利用Set 集合的唯一性, 看加入集合后 和 原来长度比是否一样
function isUnique1 (astr) {
   return astr.length === (new Set(astr)).size
}

// 其他解法：遍历字符串, 每次往map中加入一个元素, 判断map中是否存在, 已经存在的说明有重复
function isUnique2 (astr) {
    const m = new Map()

    for(let i = 0; i < astr.length; i++) {
        if(m.has(astr[i])) return false
        m.set(astr[i], 1)
    }
    return true
 }