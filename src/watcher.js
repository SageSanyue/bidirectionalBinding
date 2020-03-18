var uId = 0
class Watcher {
    constructor (vm, key, callback) {
        this._callback = callback;
        this._vm = vm
        this._key = key
        this._uId = uId
        uId++
        Target = this
        this._value = vm[key]
        Target = null
    }

    update () {
        let value = this._vm[_key]
        if (value != this._value) {
            this._value = value
            this._callback.call(this.vm, value)
        }
    }
}
