class Watcher {
    constructor (vm, exp, callback) {
        this.callback = callback
        this.vm = vm
        this.exp = exp
        this.value = this.add() // 将自己添加到订阅器的操作
    }

    update () {
        this.run()
    }
    run () {
        var value = this.vm.data[this.exp]
        var oldVal = this.value
        if (value !== oldVal) {
            this.value = value
            this.callback.call(this.vm, value, oldVal)
        }
    }
    add () {
        Dep.target = this
        var value = this.vm.data[this.exp]
        Dep.target = null
        return value
    }
}