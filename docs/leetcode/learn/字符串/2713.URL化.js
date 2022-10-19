/**
 * 
 * URL化。编写一种方法，将字符串中的空格全部替换为%20。假定该字符串尾部有足够的空间存放新增字符，并且知道字符串的“真实”长度。（注：用Java实现的话，请使用字符数组实现，以便直接在数组上操作。）
 * 
 * 输入："Mr John Smith    ", 13
   输出："Mr%20John%20Smith"
 * 
 * 输入："               ", 5
   输出："%20%20%20%20%20"
 */

var replaceSpaces = function(S, length) {
    return S.replace(/\s/g, (s, i) => (i >= length ? "" : "%20"))
 };


// 解法二：首先按给出的字符串长度来浅拷贝一个字符串，然后将其空格全部用"%20"代替即可

var replaceSpaces = function(S, length) {
    return S.slice(0,length).replaceAll(" ", "%20")
};