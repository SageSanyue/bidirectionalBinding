// class MVVM {
//     constructor (options) {
//         this._options = options
//         this._data = options.data()
//         let data = this._data

//         Object.keys(data).forEach(key => {
//             this._proxy(key)
//         })

//         observer(data)
//         let dom = document.getElementById(options.el)
//         new Compile (dom, this) // 编译模版
//     }

//     _proxy (key) {
//         Object.defineProperty (this, key, {
//             configurable: false,
//             enumerable: true,
//             get: function proxyGetter () {
//                 return this._data[key]
//             },
//             set: function proxySetter (newVal) {
//                 this._data[key] = newVal
//             }
//         })
//     }
// }

function FakeVue (options) {
    var self = this;
    this.data = options.data;
    this.methods = options.methods;

    Object.keys(this.data).forEach(function(key) {
        self.proxyKeys(key);
    });

    observe(this.data);
    new Compile(options.el, this);
    options.mounted.call(this); // 所有事情处理好后执行mounted函数
}

FakeVue.prototype = {
    proxyKeys: function (key) {
        var self = this;
        Object.defineProperty(this, key, {
            enumerable: false,
            configurable: true,
            get: function getter () {
                return self.data[key];
            },
            set: function setter (newVal) {
                self.data[key] = newVal;
            }
        });
    }
}