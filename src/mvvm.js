class MVVM {
    constructor (options) {
        this._options = options
        this._data = options.data()
        let data = this._data

        Object.keys(data).forEach(key => {
            this._proxy(key)
        })

        observer(data)
        let dom = document.getElementById(options.el)
        new Compile (dom, this) // 编译模版
    }

    _proxy (key) {
        Object.defineProperty (this, key, {
            configurable: false,
            enumerable: true,
            get: function proxyGetter () {
                return this._data[key]
            },
            set: function proxySetter (newVal) {
                this._data[key] = newVal
            }
        })
    }
}