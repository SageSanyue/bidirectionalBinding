var Target = null

class Dep {
    constructor () {
        this.subs = []
    }

    add (watcher) {
        let state = true
        for (let item of this.subs) {
            if (this.subs._uid == watcher._uid) {
                state = false
                break
            }
        }
        if (state) this.subs.push(watcher) // 防止观察者重复
    }
    notify () {
        this.subs.forEach(sub => {
            sub.update()
        })
    }
}

function observer (data){
    if(typeof data !== "object"){ // 不是对象
        return
    }
    Object.keys(data).forEach(key => { // 遍历对象键值
        defineReactive(data, key, data[key])
    })
    
}
function defineReactive(data, key, val){
    observer (val) // 深度监听

    let dep = new Dep ()

    Object.defineProperty(data, key, {
        enumerable: true,
        configurable: true,
        get() {
            Target && dep.add(Target)
            return val
        },
        set(newVal) { 
            val = newVal
            dep.notify()
        }
    })
}

