class FakeVue {
    constructor (options) {
        this.data = options.data
        this.methods = options.methods

        // 在new FakeVue时做一个代理处理，使得赋值时的FakeVue.data.name = 'sage'变成理想形式FakeVue.name = 'sage'
        Object.keys(this.data).forEach((key) => {
            this.proxyKeys(key)
        })

        observer(this.data)
        new Compile(options.el, this)
        // 所有事情处理好后执行mounted函数
        options.mounted.call(this)
    }

    proxyKeys (key) { // 让访问FakeVue的属性代理为访问FakeVue.data的属性
        var self = this
        Object.defineProperty(this, key, {
            get () { return self.data[key] },
            set (newVal) { self.data[key] = newVal }
        })
    }
}
