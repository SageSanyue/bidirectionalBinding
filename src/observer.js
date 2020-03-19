// 监听器——用来劫持并监听所有属性，如果有变动的就通知订阅者
function observer (data) {
    if (!data || typeof data !== 'object') return
    // 取出所有属性遍历
    Object.keys(data).forEach(function (key) {
        defineReactive(data, key, data[key])
    })
}
function defineReactive (data, key, val) {
    observer(val) // 递归遍历所有子属性

    var dep = new Dep()

    // 通过Object.defineProperty()来劫持数据中各个属性的setter\getter
    Object.defineProperty(data, key, {
        get: function () {
            if (Dep.target) { // 判断是否需要添加订阅者
                dep.addSub(Dep.target)
            }
            return val
        },
        set: function (newVal) {
            observer(newVal)
            if (val !== newVal) {
                val = newVal
                dep.notify() // 数据变动时通过调度中心发布消息给订阅者来触发相应监听回调
            }
        }
    })
}

// 订阅器Dep（调度中心）——主要负责收集订阅者然后在属性变化的时候执行对应订阅者的更新函数
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


