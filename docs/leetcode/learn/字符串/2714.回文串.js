/**
 * 
 * 给定一个字符串，编写一个函数判定其是否为某个回文串的排列之一。

   回文串是指正反两个方向都一样的单词或短语。排列是指字母的重新排列。

   回文串不一定是字典当中的单词。
 * 
 * 输入："tactcoa"
   输出：true（排列有"tacocat"、"atcocta"，等等）
 * 
 */

// 解法一：使用map结构
var canPermutePalindrome = function(s) {
    let map = new Map()
     for(let i of s) {
        map.set(i, map.get(i) ? 0 : 1)
     }
     return !([...map.values()].reduce((a, b) => a + b) > 1)
 };

// 解法二：哈希表