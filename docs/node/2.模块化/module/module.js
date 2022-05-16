const path = require('path')
const fs = require('fs')
const vm = require('vm')

function Module (id){
   this.id = id
   this.exports = {}
}

Module._extensions = {
    '.js'(module) {
        const content = fs.readFileSync(module.id, 'utf8')
        let wrapperFn = vm.compileFunction(content, 
            ['exports','require', 'module','__filename', '__dirname']
        )
        let exports = this.exports
        let thisValue = exports
        let require = req
        let filename = module.id
        let __dirname = path.dirname(filename)

        Reflect.apply(wrapperFn, thisValue,[exports, require, module,filename, __dirname] )
    },
    '.json'() {},
}

Module._resolveFilename = function (id) {
    const filePath = path.resolve(__dirname, id)
    if(fs.existsSync(filePath)) return filePath

    const exts = Object.keys(Module._extensions)

    for(let i = 0; i < exts.length; i++) {
        let file = filePath + exts[i]
        if(fs.existsSync(file)) return file
    }

    throw new Error('Cannot find module: ' + id)
}

Module.prototype.load = function () {
    let ext = path.extname(this.id)
    Module._extensions[ext](this)
}

function req(id) {
   let absPath = Module._resolveFilename(id)
   const module = new Module(absPath)
   module.load(absPath)
   return module.exports
}

let str = req('./test')
console.log('str', str)