// 解析器——可以扫描和解析每个节点的相关指令，并初始化数据以及初始化相应的订阅器
class Compile {
    constructor (el, vm) {
        this.vm = vm
        this.el = document.querySelector(el)
        this.fragment = null
        this.init()
    }

    init () {
        if (this.el) {
            this.fragment = this.nodeToFragment(this.el)
            this.compileElement(this.fragment)
            this.el.appendChild(this.fragment)
        } else {
            console.log('Dom元素不存在')
        }
    }

    // 为避免对dom频繁操作，将需要解析的dom节点存入fragment片段进行处理
    nodeToFragment (el) {
        var fragment = document.createDocumentFragment()
        var child = el.firstChild
        while (child) {
            fragment.appendChild(child) // 将Dom元素移入fragment中
            child = el.firstChild
        }
        return fragment
    }

    // 遍历各节点，对含有相关指定的节点进行特殊处理
    compileElement (el) {
        var childNodes = el.childNodes
        var self = this
        Array.prototype.slice.call(childNodes).forEach(function (node) {
            var reg = /\{\{(.*)\}\}/
            var text = node.textContent

            if (self.isElementNode(node)) {
                self.compile(node)
            } else if (self.isTextNode(node) && reg.test(text)) { // 判断是否是符合模版字符{{}}的指令
                self.compileText(node, reg.exec(text)[1])
            }

            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node) // 继续递归遍历子节点
            }
        })
    }

    compile (node) {
        var nodeAttrs = node.attributes
        var self = this

        // 遍历所有节点属性
        Array.prototype.forEach.call(nodeAttrs, function (attr) {
            var attrName = attr.name
            // 再判断属性是否是指令属性
            if (self.isDirective(attrName)) {
                var exp = attr.value
                var dir = attrName.substring(2) // v-on:click和v-model处理成on:click和model
                // 如果是指令属性的话再区分是哪种指令再进行相应的处理
                if (self.isEventDirective(dir)) { // 事件指令，如v-on:click
                    self.compileEvent(node, self.vm, exp, dir)
                } else { // v-model 指令
                    self.compileModel(node, exp)
                }
                node.removeAttribute(attrName)
            }
        })
    }

    compileText (node, exp) {
        var self = this
        var initText = this.vm[exp]
        this.textUpdater(node, initText) // 将初始化的数据初始化到视图中
        new Watcher(this.vm, exp, function(value) { // 生成订阅器并绑定更新函数
            self.textUpdater(node, value)
        })
    }
    compileEvent (node, vm, exp, dir) {
        var eventType = dir.split(':')[1] // on:click处理成[on, click]并取第2个
        var callback = vm.methods && vm.methods[exp]

        if (eventType && callback) {
            node.addEventListener(eventType, callback.bind(vm))
        }
    }
    compileModel (node, exp) {
        var self = this
        var val = this.vm[exp]
        this.modelUpdater(node, val)
        new Watcher(this.vm, exp, function(value) {
            self.modelUpdater(node, value)
        })
        node.addEventListener('input', function(e) {
            var newValue = e.target.value
            if (val === newValue) {
                return
            }
            self.vm[exp] = newValue
            val = newValue
        })
    }
    textUpdater (node, value) {
        node.textContent = typeof value === 'undefined' ? '' : value
    }
    modelUpdater (node, value) {
        node.value = typeof value === 'undefined' ? '' : value
    }
    isDirective (attr) {
        return attr.indexOf('v-') === 0
    }
    isEventDirective (dir) { // 事件指令，如v-on:click
        return dir.indexOf('on:') === 0
    }
    isElementNode (node) {
        return node.nodeType === 1 // 元素节点
    }
    isTextNode (node) {
        return node.nodeType === 3 // 文字
    }
}