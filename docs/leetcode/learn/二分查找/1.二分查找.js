function bSearch(A, x) {
    let l = 0 // 查找范围的左边界
    let r = A.length - 1 // 查找范围的右边界
    let mid // 查找的中间位置

    while (l <= r) { // 查找条件
        mid = Math.floor((l + r) / 2) // 向上取整
        if (A[mid] === x) return mid
        else if (A[mid] > x) r = mid - 1
        else l = mid + 1
    }

    return -1
}