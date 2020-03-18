class FakeVue {
    constructor (options) {
        this.data = options.data
        this.methods = options.methods

        Object.keys(this.data).forEach((key) => {
            this.proxyKeys(key)
        })

        observer(this.data)
        new Compile(options.el, this)
        options.mounted.call(this)
    }

    proxyKeys (key) {
        var self = this
        Object.defineProperty(this, key, {
            get () { return self.data[key] },
            set (newVal) { self.data[key] = newVal }
        })
    }
}
