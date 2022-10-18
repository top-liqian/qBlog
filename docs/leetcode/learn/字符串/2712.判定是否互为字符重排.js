/**
 * 给定两个字符串 s1 和 s2，请编写一个程序，确定其中一个字符串的字符重新排列后，能否变成另一个字符串
 * 
 * 输入: s1 = "abc", s2 = "bca"
   输出: true

 * 输入: s1 = "abc", s2 = "bad"
   输出: false
 */

// 解法一：两个字符串分别重排 时间复杂度 O(T) = nlogn  空间复杂度 O(logn)

function checkPermutation(s1, s2) {
  return s1.length === s2.length && [...s1].sort().join('') === [...s2].sort().join('')
}

// 解法二：哈希表 时间复杂度 O(T) = n 空间复杂度 O(T) = 128
// 两个字符串的位置和数量都应该是一致对应的
// 创建一个存储字符串的code码的数组，因为字符串只有128位
// 使用js字符串的api的codePointAt判断出s1具体某一个字符串码对应的位置是否有值
// s2对应的位置-1，如果为负值，就说明两个字符串存在不对应的地方

function checkPermutation (s1, s2) {
   if(s1.length !== s2.length) return false
   let table = new Array(128).fill(0)

   for(let i = 0; i < table.length; ++i) {
      table[s1.codePointAt(i)]++
   }

   for(let i = 0; i < table.length; ++i) {
      table[s2.codePointAt(i)]--
      if(table[s2.codePointAt(i)] < 0) return false
   }
   return true
}
