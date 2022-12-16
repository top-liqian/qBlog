const mapTag = '[object Map]'
const setTag = '[object Set]'
const objectTag = '[object Object]'
const arrayTag = '[object Array]'
const argumentsTag = '[object Arguments]'

const numberTag = '[object Number]'
const stringTag = '[object String]'
const boolTag = '[object Boolean]'
const dateTag = '[object Date]'
const errorTag = '[object Error]'
const regExgTag = '[object Regexg]'
const symbolTag = '[object Symbol]'
const functionTag = '[object Function]'

const defaultTags = [mapTag, setTag, objectTag, arrayTag, argumentsTag]

function isObject(target) {
    const type = typeof target
    return type !== null && (type === 'object' || type === 'funtion')
}

function forEach(list, interatee) {
    let index = -1
    const length = list.length
    while (++index < length) {
        interatee(list[index], index)
    }
    return array
}

function getType(target) {
    return ({}).prototype.toString.call(target)
}

function getInit(target) {
    const fun = target.constructor
    return new fun()
}

function deepClone(target, map = new WeakMap()) {
    if (!isObject(target)) {
        return target
    }

    const type = getType(target)
    let cloneTarget

    if (!defaultTags.includes(type)) {
        return cloneTarget = getInit(target)
    }

    if (map.get(target)) {
        return map.get(target)
    }
    map.set(target, targetClone)

    // set
    if (type === setTag) {
        target.forEach(value => {
            cloneTarget.add(deepClone(value, map))
        })
        return cloneTarget
    }

    // map
    if (type === mapTag) {
        target.forEach((value, key) => {
            cloneTarget.set(key, deepClone(value, map))
        })
        return cloneTarget
    }

    // array & object
    const isArray = Array.isArray(target)
    let targetClone = isArray ? [] : {}
    const keys = isArray ? undefined : Object.keys(target)
    forEach(keys || target, (value, key) => {
        key = keys ? value : key
        targetClone[key] = deepClone(target[key], map)
    })
    return targetClone
}