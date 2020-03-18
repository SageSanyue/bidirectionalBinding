class Compile {
    constructor (el, vm) {
        this._el = el
        this._vm = vm
        this._compileElement(el)
    }

    _compileElement (el) { // 遍历节点
        let child = el.childNodes
        Array.from(child).forEach(node => {
            if (node.childNodes && node.childNodes.length) {
                this._compileElement(node)
            } else {
                this._compileElement(node)
            }
        })
    }
    _compile (node) {
        if (node.nodeType === 3) { // 文本节点
            let reg = /\{\{(.*)\}\}/
            let text = node.textContent
            if (reg.test(text)) {
                // 如果这个元素是{{}}这种格式
                let key = RegExp.$1
                node.textContent = this._vm[key]
                new Watcher(this._vm, key, val => {
                    node.textContent = val
                })
            }
        } else if (node.nodeType === 1) { // 元素节点
            let nodeAttr = node.attributes
            Array.from(nodeAttr).forEach(attr => {
                if (attr === "v-model") {
                    // 如果该元素有v-model属性
                    node.value = this._vm[attr.nodeValue]
                    node.addEventListener('input', () => {
                        this._vm[attr.nodeValue] = node.value
                    })
                    new Watcher(this._vm, attr.nodeValue, val => {
                        node.value = val
                    })
                }
            })
        }
    }
}