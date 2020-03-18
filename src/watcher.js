// function Watcher(vm, exp, cb) {
//     this.cb = cb;
//     this.vm = vm;
//     this.exp = exp;
//     this.value = this.get();  // 将自己添加到订阅器的操作
// }

// Watcher.prototype = {
//     update: function() {
//         this.run();
//     },
//     run: function() {
//         var value = this.vm.data[this.exp];
//         var oldVal = this.value;
//         if (value !== oldVal) {
//             this.value = value;
//             this.cb.call(this.vm, value, oldVal);
//         }
//     },
//     get: function() {
//         Dep.target = this;  // 缓存自己
//         var value = this.vm.data[this.exp]  // 强制执行监听器里的get函数
//         Dep.target = null;  // 释放自己
//         return value;
//     }
// };

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