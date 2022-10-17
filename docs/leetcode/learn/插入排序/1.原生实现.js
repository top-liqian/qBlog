const A = [2, 4, 7, 9, 13]
const x = 8

const b = A.find(a => a > x)
const idx = A.indexOf(b)

A.splice(idx === -1 ? A.length : idx, 0, x)


// 针对有序数组 ----> 使用循环不变式，在数组的尾部预留一个空位，从后向前递归，比目标值大的依次后移

const A = [2, 4, 7, 9, 13]
const x = 8

function insert(A, x) {
    let p = A.length - 1

    while (p >= 0 && A[p] > x) {
        A[p + 1] = A[p]
        p--
    }

    A[p + 1] = x
}

// 针对无序数组 ---->  采用循环不变式，使用i变量指向下一个需要排序的元素，通过insert函数在小范围内将其变为有序的

function insert(A, i, x) {
    let p = i - 1
    while (p >= 0 && A[p] > x) {
        A[p + 1] = A[p]
        p--
    }
    A[p + 1] = x
}

function insertion_sort(A) {
    for (let i = 1; i < A.length; i++) {
        insert(A, i, A[i])
    }
}

// 时间复杂度
// 最好的情况：insertion_sort主循环执行 N - 1次， insert函数执行一个常数
// 最坏的情况：insertion_sort主循环执行 N - 1次， 每N - 1次循环insert函数执行i次
// 即得到数学公式  T(n) = 1 + 2 + 3 + ... + N-1 = (N-1)(1 + N-1) / 2 * C(常数)


// 如果采用二分方法优化insert函数应该怎么写？