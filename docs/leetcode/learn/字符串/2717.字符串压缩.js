/**
 * 
 * 字符串压缩。利用字符重复出现的次数，编写一种方法，实现基本的字符串压缩功能。比如，字符串aabcccccaaa会变为a2b1c5a3。若“压缩”后的字符串没有变短，则返回原先的字符串。你可以假设字符串中只包含大小写英文字母（a至z）
 * 
 *  输入："abbccd"
    输出："abbccd"
    解释："abbccd"压缩后为"a1b2c2d1"，比原字符串长度更长。
 * 
 *  输入："aabcccccaaa"
    输出："a2b1c5a3"

 */

// 双指针算法

var compressString = function(S) {
    let result = ''
    let num = 1
    let i = 0
    let j = i + 1

    for(let n = 0; n < S.length; ++n) {
        if(S[i] === S[j]){
            j = j + 1
            num++
        } 
        else {
            result += `${S[i]}${num}`
            i = j
            j++
            num = 1
        }
    }
    return result.length >= S.length ? S : result
};