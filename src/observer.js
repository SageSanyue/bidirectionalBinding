function observer (data) {
    if (!data || typeof data !== 'object') return
    Object.keys(data).forEach(function (key) {
        defineReactive(data, key, data[key])
    })
}
function defineReactive (data, key, val) {
    observer(val) // 递归遍历所有子属性
    var dep = new Dep()
    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get: function () {
            if (Dep.target) {
                dep.addSub(Dep.target)
            }
            return val
        },
        set: function (newVal) {
            observer(newVal)
            if (val !== newVal) {
                val = newVal
                dep.notify()
            }
        }
    })
}
class Dep {
    constructor () {
        this.subs = []
    }
    addSub (sub) {
        this.subs.push(sub)
    }
    notify () {
        this.subs.forEach(function(sub) {
            sub.update();
        });
    }
}
Dep.target = null


