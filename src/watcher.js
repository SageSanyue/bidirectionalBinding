// 订阅者——可以收到属性的变化通知并执行相应的函数从而更新视图
class Watcher {
    constructor (vm, key, callback) {
        this.callback = callback
        this.vm = vm
        this.key = key
        this.value = this.get() // 将自己添加到订阅器的操作
    }

    update () {
        this.run()
    }
    run () {
        var value = this.vm.data[this.key]
        var oldVal = this.value
        if (value !== oldVal) {
            this.value = value

            // 执行解析器Compile中绑定的回调updateText(node, value)或modelUpdater(node, value)，更新视图
            this.callback.call(this.vm, value, oldVal)
        }
    }
    get () {
        Dep.target = this // 在Dep.target上缓存下订阅者
        var value = this.vm.data[this.key] // 强制执行监听器里的get函数
        Dep.target = null // 缓存成功后再将其去掉
        return value
    }
}