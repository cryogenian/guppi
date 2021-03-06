(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/maximko/.nvm/versions/node/v5.2.0/lib/node_modules/pulp/node_modules/browser-resolve/empty.js":[function(require,module,exports){

},{}],"/Users/maximko/Projects/mine/guppi/node_modules/global/document.js":[function(require,module,exports){
(function (global){
var topLevel = typeof global !== 'undefined' ? global :
    typeof window !== 'undefined' ? window : {}
var minDoc = require('min-document');

if (typeof document !== 'undefined') {
    module.exports = document;
} else {
    var doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'];

    if (!doccy) {
        doccy = topLevel['__GLOBAL_DOCUMENT_CACHE@4'] = minDoc;
    }

    module.exports = doccy;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"min-document":"/Users/maximko/.nvm/versions/node/v5.2.0/lib/node_modules/pulp/node_modules/browser-resolve/empty.js"}],"/Users/maximko/Projects/mine/guppi/node_modules/is-object/index.js":[function(require,module,exports){
"use strict";

module.exports = function isObject(x) {
	return typeof x === "object" && x !== null;
};

},{}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/create-element.js":[function(require,module,exports){
var createElement = require("./vdom/create-element.js")

module.exports = createElement

},{"./vdom/create-element.js":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vdom/create-element.js"}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/diff.js":[function(require,module,exports){
var diff = require("./vtree/diff.js")

module.exports = diff

},{"./vtree/diff.js":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vtree/diff.js"}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/patch.js":[function(require,module,exports){
var patch = require("./vdom/patch.js")

module.exports = patch

},{"./vdom/patch.js":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vdom/patch.js"}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vdom/apply-properties.js":[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook.js")

module.exports = applyProperties

function applyProperties(node, props, previous) {
    for (var propName in props) {
        var propValue = props[propName]

        if (propValue === undefined) {
            removeProperty(node, propName, propValue, previous);
        } else if (isHook(propValue)) {
            removeProperty(node, propName, propValue, previous)
            if (propValue.hook) {
                propValue.hook(node,
                    propName,
                    previous ? previous[propName] : undefined)
            }
        } else {
            if (isObject(propValue)) {
                patchObject(node, props, previous, propName, propValue);
            } else {
                node[propName] = propValue
            }
        }
    }
}

function removeProperty(node, propName, propValue, previous) {
    if (previous) {
        var previousValue = previous[propName]

        if (!isHook(previousValue)) {
            if (propName === "attributes") {
                for (var attrName in previousValue) {
                    node.removeAttribute(attrName)
                }
            } else if (propName === "style") {
                for (var i in previousValue) {
                    node.style[i] = ""
                }
            } else if (typeof previousValue === "string") {
                node[propName] = ""
            } else {
                node[propName] = null
            }
        } else if (previousValue.unhook) {
            previousValue.unhook(node, propName, propValue)
        }
    }
}

function patchObject(node, props, previous, propName, propValue) {
    var previousValue = previous ? previous[propName] : undefined

    // Set attributes
    if (propName === "attributes") {
        for (var attrName in propValue) {
            var attrValue = propValue[attrName]

            if (attrValue === undefined) {
                node.removeAttribute(attrName)
            } else {
                node.setAttribute(attrName, attrValue)
            }
        }

        return
    }

    if(previousValue && isObject(previousValue) &&
        getPrototype(previousValue) !== getPrototype(propValue)) {
        node[propName] = propValue
        return
    }

    if (!isObject(node[propName])) {
        node[propName] = {}
    }

    var replacer = propName === "style" ? "" : undefined

    for (var k in propValue) {
        var value = propValue[k]
        node[propName][k] = (value === undefined) ? replacer : value
    }
}

function getPrototype(value) {
    if (Object.getPrototypeOf) {
        return Object.getPrototypeOf(value)
    } else if (value.__proto__) {
        return value.__proto__
    } else if (value.constructor) {
        return value.constructor.prototype
    }
}

},{"../vnode/is-vhook.js":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-vhook.js","is-object":"/Users/maximko/Projects/mine/guppi/node_modules/is-object/index.js"}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vdom/create-element.js":[function(require,module,exports){
var document = require("global/document")

var applyProperties = require("./apply-properties")

var isVNode = require("../vnode/is-vnode.js")
var isVText = require("../vnode/is-vtext.js")
var isWidget = require("../vnode/is-widget.js")
var handleThunk = require("../vnode/handle-thunk.js")

module.exports = createElement

function createElement(vnode, opts) {
    var doc = opts ? opts.document || document : document
    var warn = opts ? opts.warn : null

    vnode = handleThunk(vnode).a

    if (isWidget(vnode)) {
        return vnode.init()
    } else if (isVText(vnode)) {
        return doc.createTextNode(vnode.text)
    } else if (!isVNode(vnode)) {
        if (warn) {
            warn("Item is not a valid virtual dom node", vnode)
        }
        return null
    }

    var node = (vnode.namespace === null) ?
        doc.createElement(vnode.tagName) :
        doc.createElementNS(vnode.namespace, vnode.tagName)

    var props = vnode.properties
    applyProperties(node, props)

    var children = vnode.children

    for (var i = 0; i < children.length; i++) {
        var childNode = createElement(children[i], opts)
        if (childNode) {
            node.appendChild(childNode)
        }
    }

    return node
}

},{"../vnode/handle-thunk.js":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/handle-thunk.js","../vnode/is-vnode.js":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-vnode.js","../vnode/is-vtext.js":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-vtext.js","../vnode/is-widget.js":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-widget.js","./apply-properties":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vdom/apply-properties.js","global/document":"/Users/maximko/Projects/mine/guppi/node_modules/global/document.js"}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vdom/dom-index.js":[function(require,module,exports){
// Maps a virtual DOM tree onto a real DOM tree in an efficient manner.
// We don't want to read all of the DOM nodes in the tree so we use
// the in-order tree indexing to eliminate recursion down certain branches.
// We only recurse into a DOM node if we know that it contains a child of
// interest.

var noChild = {}

module.exports = domIndex

function domIndex(rootNode, tree, indices, nodes) {
    if (!indices || indices.length === 0) {
        return {}
    } else {
        indices.sort(ascending)
        return recurse(rootNode, tree, indices, nodes, 0)
    }
}

function recurse(rootNode, tree, indices, nodes, rootIndex) {
    nodes = nodes || {}


    if (rootNode) {
        if (indexInRange(indices, rootIndex, rootIndex)) {
            nodes[rootIndex] = rootNode
        }

        var vChildren = tree.children

        if (vChildren) {

            var childNodes = rootNode.childNodes

            for (var i = 0; i < tree.children.length; i++) {
                rootIndex += 1

                var vChild = vChildren[i] || noChild
                var nextIndex = rootIndex + (vChild.count || 0)

                // skip recursion down the tree if there are no nodes down here
                if (indexInRange(indices, rootIndex, nextIndex)) {
                    recurse(childNodes[i], vChild, indices, nodes, rootIndex)
                }

                rootIndex = nextIndex
            }
        }
    }

    return nodes
}

// Binary search for an index in the interval [left, right]
function indexInRange(indices, left, right) {
    if (indices.length === 0) {
        return false
    }

    var minIndex = 0
    var maxIndex = indices.length - 1
    var currentIndex
    var currentItem

    while (minIndex <= maxIndex) {
        currentIndex = ((maxIndex + minIndex) / 2) >> 0
        currentItem = indices[currentIndex]

        if (minIndex === maxIndex) {
            return currentItem >= left && currentItem <= right
        } else if (currentItem < left) {
            minIndex = currentIndex + 1
        } else  if (currentItem > right) {
            maxIndex = currentIndex - 1
        } else {
            return true
        }
    }

    return false;
}

function ascending(a, b) {
    return a > b ? 1 : -1
}

},{}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vdom/patch-op.js":[function(require,module,exports){
var applyProperties = require("./apply-properties")

var isWidget = require("../vnode/is-widget.js")
var VPatch = require("../vnode/vpatch.js")

var updateWidget = require("./update-widget")

module.exports = applyPatch

function applyPatch(vpatch, domNode, renderOptions) {
    var type = vpatch.type
    var vNode = vpatch.vNode
    var patch = vpatch.patch

    switch (type) {
        case VPatch.REMOVE:
            return removeNode(domNode, vNode)
        case VPatch.INSERT:
            return insertNode(domNode, patch, renderOptions)
        case VPatch.VTEXT:
            return stringPatch(domNode, vNode, patch, renderOptions)
        case VPatch.WIDGET:
            return widgetPatch(domNode, vNode, patch, renderOptions)
        case VPatch.VNODE:
            return vNodePatch(domNode, vNode, patch, renderOptions)
        case VPatch.ORDER:
            reorderChildren(domNode, patch)
            return domNode
        case VPatch.PROPS:
            applyProperties(domNode, patch, vNode.properties)
            return domNode
        case VPatch.THUNK:
            return replaceRoot(domNode,
                renderOptions.patch(domNode, patch, renderOptions))
        default:
            return domNode
    }
}

function removeNode(domNode, vNode) {
    var parentNode = domNode.parentNode

    if (parentNode) {
        parentNode.removeChild(domNode)
    }

    destroyWidget(domNode, vNode);

    return null
}

function insertNode(parentNode, vNode, renderOptions) {
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode) {
        parentNode.appendChild(newNode)
    }

    return parentNode
}

function stringPatch(domNode, leftVNode, vText, renderOptions) {
    var newNode

    if (domNode.nodeType === 3) {
        domNode.replaceData(0, domNode.length, vText.text)
        newNode = domNode
    } else {
        var parentNode = domNode.parentNode
        newNode = renderOptions.render(vText, renderOptions)

        if (parentNode && newNode !== domNode) {
            parentNode.replaceChild(newNode, domNode)
        }
    }

    return newNode
}

function widgetPatch(domNode, leftVNode, widget, renderOptions) {
    var updating = updateWidget(leftVNode, widget)
    var newNode

    if (updating) {
        newNode = widget.update(leftVNode, domNode) || domNode
    } else {
        newNode = renderOptions.render(widget, renderOptions)
    }

    var parentNode = domNode.parentNode

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    if (!updating) {
        destroyWidget(domNode, leftVNode)
    }

    return newNode
}

function vNodePatch(domNode, leftVNode, vNode, renderOptions) {
    var parentNode = domNode.parentNode
    var newNode = renderOptions.render(vNode, renderOptions)

    if (parentNode && newNode !== domNode) {
        parentNode.replaceChild(newNode, domNode)
    }

    return newNode
}

function destroyWidget(domNode, w) {
    if (typeof w.destroy === "function" && isWidget(w)) {
        w.destroy(domNode)
    }
}

function reorderChildren(domNode, moves) {
    var childNodes = domNode.childNodes
    var keyMap = {}
    var node
    var remove
    var insert

    for (var i = 0; i < moves.removes.length; i++) {
        remove = moves.removes[i]
        node = childNodes[remove.from]
        if (remove.key) {
            keyMap[remove.key] = node
        }
        domNode.removeChild(node)
    }

    var length = childNodes.length
    for (var j = 0; j < moves.inserts.length; j++) {
        insert = moves.inserts[j]
        node = keyMap[insert.key]
        // this is the weirdest bug i've ever seen in webkit
        domNode.insertBefore(node, insert.to >= length++ ? null : childNodes[insert.to])
    }
}

function replaceRoot(oldRoot, newRoot) {
    if (oldRoot && newRoot && oldRoot !== newRoot && oldRoot.parentNode) {
        oldRoot.parentNode.replaceChild(newRoot, oldRoot)
    }

    return newRoot;
}

},{"../vnode/is-widget.js":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-widget.js","../vnode/vpatch.js":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/vpatch.js","./apply-properties":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vdom/apply-properties.js","./update-widget":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vdom/update-widget.js"}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vdom/patch.js":[function(require,module,exports){
var document = require("global/document")
var isArray = require("x-is-array")

var render = require("./create-element")
var domIndex = require("./dom-index")
var patchOp = require("./patch-op")
module.exports = patch

function patch(rootNode, patches, renderOptions) {
    renderOptions = renderOptions || {}
    renderOptions.patch = renderOptions.patch && renderOptions.patch !== patch
        ? renderOptions.patch
        : patchRecursive
    renderOptions.render = renderOptions.render || render

    return renderOptions.patch(rootNode, patches, renderOptions)
}

function patchRecursive(rootNode, patches, renderOptions) {
    var indices = patchIndices(patches)

    if (indices.length === 0) {
        return rootNode
    }

    var index = domIndex(rootNode, patches.a, indices)
    var ownerDocument = rootNode.ownerDocument

    if (!renderOptions.document && ownerDocument !== document) {
        renderOptions.document = ownerDocument
    }

    for (var i = 0; i < indices.length; i++) {
        var nodeIndex = indices[i]
        rootNode = applyPatch(rootNode,
            index[nodeIndex],
            patches[nodeIndex],
            renderOptions)
    }

    return rootNode
}

function applyPatch(rootNode, domNode, patchList, renderOptions) {
    if (!domNode) {
        return rootNode
    }

    var newNode

    if (isArray(patchList)) {
        for (var i = 0; i < patchList.length; i++) {
            newNode = patchOp(patchList[i], domNode, renderOptions)

            if (domNode === rootNode) {
                rootNode = newNode
            }
        }
    } else {
        newNode = patchOp(patchList, domNode, renderOptions)

        if (domNode === rootNode) {
            rootNode = newNode
        }
    }

    return rootNode
}

function patchIndices(patches) {
    var indices = []

    for (var key in patches) {
        if (key !== "a") {
            indices.push(Number(key))
        }
    }

    return indices
}

},{"./create-element":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vdom/create-element.js","./dom-index":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vdom/dom-index.js","./patch-op":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vdom/patch-op.js","global/document":"/Users/maximko/Projects/mine/guppi/node_modules/global/document.js","x-is-array":"/Users/maximko/Projects/mine/guppi/node_modules/x-is-array/index.js"}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vdom/update-widget.js":[function(require,module,exports){
var isWidget = require("../vnode/is-widget.js")

module.exports = updateWidget

function updateWidget(a, b) {
    if (isWidget(a) && isWidget(b)) {
        if ("name" in a && "name" in b) {
            return a.id === b.id
        } else {
            return a.init === b.init
        }
    }

    return false
}

},{"../vnode/is-widget.js":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-widget.js"}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/virtual-hyperscript/hooks/soft-set-hook.js":[function(require,module,exports){
'use strict';

module.exports = SoftSetHook;

function SoftSetHook(value) {
    if (!(this instanceof SoftSetHook)) {
        return new SoftSetHook(value);
    }

    this.value = value;
}

SoftSetHook.prototype.hook = function (node, propertyName) {
    if (node[propertyName] !== this.value) {
        node[propertyName] = this.value;
    }
};

},{}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/handle-thunk.js":[function(require,module,exports){
var isVNode = require("./is-vnode")
var isVText = require("./is-vtext")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")

module.exports = handleThunk

function handleThunk(a, b) {
    var renderedA = a
    var renderedB = b

    if (isThunk(b)) {
        renderedB = renderThunk(b, a)
    }

    if (isThunk(a)) {
        renderedA = renderThunk(a, null)
    }

    return {
        a: renderedA,
        b: renderedB
    }
}

function renderThunk(thunk, previous) {
    var renderedThunk = thunk.vnode

    if (!renderedThunk) {
        renderedThunk = thunk.vnode = thunk.render(previous)
    }

    if (!(isVNode(renderedThunk) ||
            isVText(renderedThunk) ||
            isWidget(renderedThunk))) {
        throw new Error("thunk did not return a valid node");
    }

    return renderedThunk
}

},{"./is-thunk":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-thunk.js","./is-vnode":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-vnode.js","./is-vtext":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-vtext.js","./is-widget":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-widget.js"}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-thunk.js":[function(require,module,exports){
module.exports = isThunk

function isThunk(t) {
    return t && t.type === "Thunk"
}

},{}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-vhook.js":[function(require,module,exports){
module.exports = isHook

function isHook(hook) {
    return hook &&
      (typeof hook.hook === "function" && !hook.hasOwnProperty("hook") ||
       typeof hook.unhook === "function" && !hook.hasOwnProperty("unhook"))
}

},{}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-vnode.js":[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualNode

function isVirtualNode(x) {
    return x && x.type === "VirtualNode" && x.version === version
}

},{"./version":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/version.js"}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-vtext.js":[function(require,module,exports){
var version = require("./version")

module.exports = isVirtualText

function isVirtualText(x) {
    return x && x.type === "VirtualText" && x.version === version
}

},{"./version":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/version.js"}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-widget.js":[function(require,module,exports){
module.exports = isWidget

function isWidget(w) {
    return w && w.type === "Widget"
}

},{}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/version.js":[function(require,module,exports){
module.exports = "2"

},{}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/vnode.js":[function(require,module,exports){
var version = require("./version")
var isVNode = require("./is-vnode")
var isWidget = require("./is-widget")
var isThunk = require("./is-thunk")
var isVHook = require("./is-vhook")

module.exports = VirtualNode

var noProperties = {}
var noChildren = []

function VirtualNode(tagName, properties, children, key, namespace) {
    this.tagName = tagName
    this.properties = properties || noProperties
    this.children = children || noChildren
    this.key = key != null ? String(key) : undefined
    this.namespace = (typeof namespace === "string") ? namespace : null

    var count = (children && children.length) || 0
    var descendants = 0
    var hasWidgets = false
    var hasThunks = false
    var descendantHooks = false
    var hooks

    for (var propName in properties) {
        if (properties.hasOwnProperty(propName)) {
            var property = properties[propName]
            if (isVHook(property) && property.unhook) {
                if (!hooks) {
                    hooks = {}
                }

                hooks[propName] = property
            }
        }
    }

    for (var i = 0; i < count; i++) {
        var child = children[i]
        if (isVNode(child)) {
            descendants += child.count || 0

            if (!hasWidgets && child.hasWidgets) {
                hasWidgets = true
            }

            if (!hasThunks && child.hasThunks) {
                hasThunks = true
            }

            if (!descendantHooks && (child.hooks || child.descendantHooks)) {
                descendantHooks = true
            }
        } else if (!hasWidgets && isWidget(child)) {
            if (typeof child.destroy === "function") {
                hasWidgets = true
            }
        } else if (!hasThunks && isThunk(child)) {
            hasThunks = true;
        }
    }

    this.count = count + descendants
    this.hasWidgets = hasWidgets
    this.hasThunks = hasThunks
    this.hooks = hooks
    this.descendantHooks = descendantHooks
}

VirtualNode.prototype.version = version
VirtualNode.prototype.type = "VirtualNode"

},{"./is-thunk":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-thunk.js","./is-vhook":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-vhook.js","./is-vnode":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-vnode.js","./is-widget":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-widget.js","./version":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/version.js"}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/vpatch.js":[function(require,module,exports){
var version = require("./version")

VirtualPatch.NONE = 0
VirtualPatch.VTEXT = 1
VirtualPatch.VNODE = 2
VirtualPatch.WIDGET = 3
VirtualPatch.PROPS = 4
VirtualPatch.ORDER = 5
VirtualPatch.INSERT = 6
VirtualPatch.REMOVE = 7
VirtualPatch.THUNK = 8

module.exports = VirtualPatch

function VirtualPatch(type, vNode, patch) {
    this.type = Number(type)
    this.vNode = vNode
    this.patch = patch
}

VirtualPatch.prototype.version = version
VirtualPatch.prototype.type = "VirtualPatch"

},{"./version":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/version.js"}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/vtext.js":[function(require,module,exports){
var version = require("./version")

module.exports = VirtualText

function VirtualText(text) {
    this.text = String(text)
}

VirtualText.prototype.version = version
VirtualText.prototype.type = "VirtualText"

},{"./version":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/version.js"}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vtree/diff-props.js":[function(require,module,exports){
var isObject = require("is-object")
var isHook = require("../vnode/is-vhook")

module.exports = diffProps

function diffProps(a, b) {
    var diff

    for (var aKey in a) {
        if (!(aKey in b)) {
            diff = diff || {}
            diff[aKey] = undefined
        }

        var aValue = a[aKey]
        var bValue = b[aKey]

        if (aValue === bValue) {
            continue
        } else if (isObject(aValue) && isObject(bValue)) {
            if (getPrototype(bValue) !== getPrototype(aValue)) {
                diff = diff || {}
                diff[aKey] = bValue
            } else if (isHook(bValue)) {
                 diff = diff || {}
                 diff[aKey] = bValue
            } else {
                var objectDiff = diffProps(aValue, bValue)
                if (objectDiff) {
                    diff = diff || {}
                    diff[aKey] = objectDiff
                }
            }
        } else {
            diff = diff || {}
            diff[aKey] = bValue
        }
    }

    for (var bKey in b) {
        if (!(bKey in a)) {
            diff = diff || {}
            diff[bKey] = b[bKey]
        }
    }

    return diff
}

function getPrototype(value) {
  if (Object.getPrototypeOf) {
    return Object.getPrototypeOf(value)
  } else if (value.__proto__) {
    return value.__proto__
  } else if (value.constructor) {
    return value.constructor.prototype
  }
}

},{"../vnode/is-vhook":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-vhook.js","is-object":"/Users/maximko/Projects/mine/guppi/node_modules/is-object/index.js"}],"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vtree/diff.js":[function(require,module,exports){
var isArray = require("x-is-array")

var VPatch = require("../vnode/vpatch")
var isVNode = require("../vnode/is-vnode")
var isVText = require("../vnode/is-vtext")
var isWidget = require("../vnode/is-widget")
var isThunk = require("../vnode/is-thunk")
var handleThunk = require("../vnode/handle-thunk")

var diffProps = require("./diff-props")

module.exports = diff

function diff(a, b) {
    var patch = { a: a }
    walk(a, b, patch, 0)
    return patch
}

function walk(a, b, patch, index) {
    if (a === b) {
        return
    }

    var apply = patch[index]
    var applyClear = false

    if (isThunk(a) || isThunk(b)) {
        thunks(a, b, patch, index)
    } else if (b == null) {

        // If a is a widget we will add a remove patch for it
        // Otherwise any child widgets/hooks must be destroyed.
        // This prevents adding two remove patches for a widget.
        if (!isWidget(a)) {
            clearState(a, patch, index)
            apply = patch[index]
        }

        apply = appendPatch(apply, new VPatch(VPatch.REMOVE, a, b))
    } else if (isVNode(b)) {
        if (isVNode(a)) {
            if (a.tagName === b.tagName &&
                a.namespace === b.namespace &&
                a.key === b.key) {
                var propsPatch = diffProps(a.properties, b.properties)
                if (propsPatch) {
                    apply = appendPatch(apply,
                        new VPatch(VPatch.PROPS, a, propsPatch))
                }
                apply = diffChildren(a, b, patch, apply, index)
            } else {
                apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
                applyClear = true
            }
        } else {
            apply = appendPatch(apply, new VPatch(VPatch.VNODE, a, b))
            applyClear = true
        }
    } else if (isVText(b)) {
        if (!isVText(a)) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
            applyClear = true
        } else if (a.text !== b.text) {
            apply = appendPatch(apply, new VPatch(VPatch.VTEXT, a, b))
        }
    } else if (isWidget(b)) {
        if (!isWidget(a)) {
            applyClear = true
        }

        apply = appendPatch(apply, new VPatch(VPatch.WIDGET, a, b))
    }

    if (apply) {
        patch[index] = apply
    }

    if (applyClear) {
        clearState(a, patch, index)
    }
}

function diffChildren(a, b, patch, apply, index) {
    var aChildren = a.children
    var orderedSet = reorder(aChildren, b.children)
    var bChildren = orderedSet.children

    var aLen = aChildren.length
    var bLen = bChildren.length
    var len = aLen > bLen ? aLen : bLen

    for (var i = 0; i < len; i++) {
        var leftNode = aChildren[i]
        var rightNode = bChildren[i]
        index += 1

        if (!leftNode) {
            if (rightNode) {
                // Excess nodes in b need to be added
                apply = appendPatch(apply,
                    new VPatch(VPatch.INSERT, null, rightNode))
            }
        } else {
            walk(leftNode, rightNode, patch, index)
        }

        if (isVNode(leftNode) && leftNode.count) {
            index += leftNode.count
        }
    }

    if (orderedSet.moves) {
        // Reorder nodes last
        apply = appendPatch(apply, new VPatch(
            VPatch.ORDER,
            a,
            orderedSet.moves
        ))
    }

    return apply
}

function clearState(vNode, patch, index) {
    // TODO: Make this a single walk, not two
    unhook(vNode, patch, index)
    destroyWidgets(vNode, patch, index)
}

// Patch records for all destroyed widgets must be added because we need
// a DOM node reference for the destroy function
function destroyWidgets(vNode, patch, index) {
    if (isWidget(vNode)) {
        if (typeof vNode.destroy === "function") {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(VPatch.REMOVE, vNode, null)
            )
        }
    } else if (isVNode(vNode) && (vNode.hasWidgets || vNode.hasThunks)) {
        var children = vNode.children
        var len = children.length
        for (var i = 0; i < len; i++) {
            var child = children[i]
            index += 1

            destroyWidgets(child, patch, index)

            if (isVNode(child) && child.count) {
                index += child.count
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

// Create a sub-patch for thunks
function thunks(a, b, patch, index) {
    var nodes = handleThunk(a, b)
    var thunkPatch = diff(nodes.a, nodes.b)
    if (hasPatches(thunkPatch)) {
        patch[index] = new VPatch(VPatch.THUNK, null, thunkPatch)
    }
}

function hasPatches(patch) {
    for (var index in patch) {
        if (index !== "a") {
            return true
        }
    }

    return false
}

// Execute hooks when two nodes are identical
function unhook(vNode, patch, index) {
    if (isVNode(vNode)) {
        if (vNode.hooks) {
            patch[index] = appendPatch(
                patch[index],
                new VPatch(
                    VPatch.PROPS,
                    vNode,
                    undefinedKeys(vNode.hooks)
                )
            )
        }

        if (vNode.descendantHooks || vNode.hasThunks) {
            var children = vNode.children
            var len = children.length
            for (var i = 0; i < len; i++) {
                var child = children[i]
                index += 1

                unhook(child, patch, index)

                if (isVNode(child) && child.count) {
                    index += child.count
                }
            }
        }
    } else if (isThunk(vNode)) {
        thunks(vNode, null, patch, index)
    }
}

function undefinedKeys(obj) {
    var result = {}

    for (var key in obj) {
        result[key] = undefined
    }

    return result
}

// List diff, naive left to right reordering
function reorder(aChildren, bChildren) {
    // O(M) time, O(M) memory
    var bChildIndex = keyIndex(bChildren)
    var bKeys = bChildIndex.keys
    var bFree = bChildIndex.free

    if (bFree.length === bChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(N) time, O(N) memory
    var aChildIndex = keyIndex(aChildren)
    var aKeys = aChildIndex.keys
    var aFree = aChildIndex.free

    if (aFree.length === aChildren.length) {
        return {
            children: bChildren,
            moves: null
        }
    }

    // O(MAX(N, M)) memory
    var newChildren = []

    var freeIndex = 0
    var freeCount = bFree.length
    var deletedItems = 0

    // Iterate through a and match a node in b
    // O(N) time,
    for (var i = 0 ; i < aChildren.length; i++) {
        var aItem = aChildren[i]
        var itemIndex

        if (aItem.key) {
            if (bKeys.hasOwnProperty(aItem.key)) {
                // Match up the old keys
                itemIndex = bKeys[aItem.key]
                newChildren.push(bChildren[itemIndex])

            } else {
                // Remove old keyed items
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        } else {
            // Match the item in a with the next free item in b
            if (freeIndex < freeCount) {
                itemIndex = bFree[freeIndex++]
                newChildren.push(bChildren[itemIndex])
            } else {
                // There are no free items in b to match with
                // the free items in a, so the extra free nodes
                // are deleted.
                itemIndex = i - deletedItems++
                newChildren.push(null)
            }
        }
    }

    var lastFreeIndex = freeIndex >= bFree.length ?
        bChildren.length :
        bFree[freeIndex]

    // Iterate through b and append any new keys
    // O(M) time
    for (var j = 0; j < bChildren.length; j++) {
        var newItem = bChildren[j]

        if (newItem.key) {
            if (!aKeys.hasOwnProperty(newItem.key)) {
                // Add any new keyed items
                // We are adding new items to the end and then sorting them
                // in place. In future we should insert new items in place.
                newChildren.push(newItem)
            }
        } else if (j >= lastFreeIndex) {
            // Add any leftover non-keyed items
            newChildren.push(newItem)
        }
    }

    var simulate = newChildren.slice()
    var simulateIndex = 0
    var removes = []
    var inserts = []
    var simulateItem

    for (var k = 0; k < bChildren.length;) {
        var wantedItem = bChildren[k]
        simulateItem = simulate[simulateIndex]

        // remove items
        while (simulateItem === null && simulate.length) {
            removes.push(remove(simulate, simulateIndex, null))
            simulateItem = simulate[simulateIndex]
        }

        if (!simulateItem || simulateItem.key !== wantedItem.key) {
            // if we need a key in this position...
            if (wantedItem.key) {
                if (simulateItem && simulateItem.key) {
                    // if an insert doesn't put this key in place, it needs to move
                    if (bKeys[simulateItem.key] !== k + 1) {
                        removes.push(remove(simulate, simulateIndex, simulateItem.key))
                        simulateItem = simulate[simulateIndex]
                        // if the remove didn't put the wanted item in place, we need to insert it
                        if (!simulateItem || simulateItem.key !== wantedItem.key) {
                            inserts.push({key: wantedItem.key, to: k})
                        }
                        // items are matching, so skip ahead
                        else {
                            simulateIndex++
                        }
                    }
                    else {
                        inserts.push({key: wantedItem.key, to: k})
                    }
                }
                else {
                    inserts.push({key: wantedItem.key, to: k})
                }
                k++
            }
            // a key in simulate has no matching wanted key, remove it
            else if (simulateItem && simulateItem.key) {
                removes.push(remove(simulate, simulateIndex, simulateItem.key))
            }
        }
        else {
            simulateIndex++
            k++
        }
    }

    // remove all the remaining nodes from simulate
    while(simulateIndex < simulate.length) {
        simulateItem = simulate[simulateIndex]
        removes.push(remove(simulate, simulateIndex, simulateItem && simulateItem.key))
    }

    // If the only moves we have are deletes then we can just
    // let the delete patch remove these items.
    if (removes.length === deletedItems && !inserts.length) {
        return {
            children: newChildren,
            moves: null
        }
    }

    return {
        children: newChildren,
        moves: {
            removes: removes,
            inserts: inserts
        }
    }
}

function remove(arr, index, key) {
    arr.splice(index, 1)

    return {
        from: index,
        key: key
    }
}

function keyIndex(children) {
    var keys = {}
    var free = []
    var length = children.length

    for (var i = 0; i < length; i++) {
        var child = children[i]

        if (child.key) {
            keys[child.key] = i
        } else {
            free.push(i)
        }
    }

    return {
        keys: keys,     // A hash of key name to index
        free: free      // An array of unkeyed item indices
    }
}

function appendPatch(apply, patch) {
    if (apply) {
        if (isArray(apply)) {
            apply.push(patch)
        } else {
            apply = [apply, patch]
        }

        return apply
    } else {
        return patch
    }
}

},{"../vnode/handle-thunk":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/handle-thunk.js","../vnode/is-thunk":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-thunk.js","../vnode/is-vnode":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-vnode.js","../vnode/is-vtext":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-vtext.js","../vnode/is-widget":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/is-widget.js","../vnode/vpatch":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/vpatch.js","./diff-props":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vtree/diff-props.js","x-is-array":"/Users/maximko/Projects/mine/guppi/node_modules/x-is-array/index.js"}],"/Users/maximko/Projects/mine/guppi/node_modules/x-is-array/index.js":[function(require,module,exports){
var nativeIsArray = Array.isArray
var toString = Object.prototype.toString

module.exports = nativeIsArray || isArray

function isArray(obj) {
    return toString.call(obj) === "[object Array]"
}

},{}],"/Users/maximko/Projects/mine/guppi/output/Control.Alt/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Alt = function (__superclass_Prelude$dotFunctor_0, alt) {
    this["__superclass_Prelude.Functor_0"] = __superclass_Prelude$dotFunctor_0;
    this.alt = alt;
};
var altArray = new Alt(function () {
    return Prelude.functorArray;
}, Prelude.append(Prelude.semigroupArray));
var alt = function (dict) {
    return dict.alt;
};
var $less$bar$greater = function (__dict_Alt_0) {
    return alt(__dict_Alt_0);
};
module.exports = {
    Alt: Alt, 
    "<|>": $less$bar$greater, 
    alt: alt, 
    altArray: altArray
};

},{"Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Alternative/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Plus = require("Control.Plus");
var Alternative = function (__superclass_Control$dotPlus$dotPlus_1, __superclass_Prelude$dotApplicative_0) {
    this["__superclass_Control.Plus.Plus_1"] = __superclass_Control$dotPlus$dotPlus_1;
    this["__superclass_Prelude.Applicative_0"] = __superclass_Prelude$dotApplicative_0;
};
var alternativeArray = new Alternative(function () {
    return Control_Plus.plusArray;
}, function () {
    return Prelude.applicativeArray;
});
module.exports = {
    Alternative: Alternative, 
    alternativeArray: alternativeArray
};

},{"Control.Plus":"/Users/maximko/Projects/mine/guppi/output/Control.Plus/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Apply/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var $less$times = function (__dict_Apply_0) {
    return function (a) {
        return function (b) {
            return Prelude["<*>"](__dict_Apply_0)(Prelude["<$>"](__dict_Apply_0["__superclass_Prelude.Functor_0"]())(Prelude["const"])(a))(b);
        };
    };
};
var $times$greater = function (__dict_Apply_1) {
    return function (a) {
        return function (b) {
            return Prelude["<*>"](__dict_Apply_1)(Prelude["<$>"](__dict_Apply_1["__superclass_Prelude.Functor_0"]())(Prelude["const"](Prelude.id(Prelude.categoryFn)))(a))(b);
        };
    };
};
var lift5 = function (__dict_Apply_2) {
    return function (f) {
        return function (a) {
            return function (b) {
                return function (c) {
                    return function (d) {
                        return function (e) {
                            return Prelude["<*>"](__dict_Apply_2)(Prelude["<*>"](__dict_Apply_2)(Prelude["<*>"](__dict_Apply_2)(Prelude["<*>"](__dict_Apply_2)(Prelude["<$>"](__dict_Apply_2["__superclass_Prelude.Functor_0"]())(f)(a))(b))(c))(d))(e);
                        };
                    };
                };
            };
        };
    };
};
var lift4 = function (__dict_Apply_3) {
    return function (f) {
        return function (a) {
            return function (b) {
                return function (c) {
                    return function (d) {
                        return Prelude["<*>"](__dict_Apply_3)(Prelude["<*>"](__dict_Apply_3)(Prelude["<*>"](__dict_Apply_3)(Prelude["<$>"](__dict_Apply_3["__superclass_Prelude.Functor_0"]())(f)(a))(b))(c))(d);
                    };
                };
            };
        };
    };
};
var lift3 = function (__dict_Apply_4) {
    return function (f) {
        return function (a) {
            return function (b) {
                return function (c) {
                    return Prelude["<*>"](__dict_Apply_4)(Prelude["<*>"](__dict_Apply_4)(Prelude["<$>"](__dict_Apply_4["__superclass_Prelude.Functor_0"]())(f)(a))(b))(c);
                };
            };
        };
    };
};
var lift2 = function (__dict_Apply_5) {
    return function (f) {
        return function (a) {
            return function (b) {
                return Prelude["<*>"](__dict_Apply_5)(Prelude["<$>"](__dict_Apply_5["__superclass_Prelude.Functor_0"]())(f)(a))(b);
            };
        };
    };
};
module.exports = {
    lift5: lift5, 
    lift4: lift4, 
    lift3: lift3, 
    lift2: lift2, 
    "*>": $times$greater, 
    "<*": $less$times
};

},{"Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Biapplicative/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Biapply = require("Control.Biapply");
var Biapplicative = function (__superclass_Control$dotBiapply$dotBiapply_0, bipure) {
    this["__superclass_Control.Biapply.Biapply_0"] = __superclass_Control$dotBiapply$dotBiapply_0;
    this.bipure = bipure;
};
var bipure = function (dict) {
    return dict.bipure;
};
module.exports = {
    Biapplicative: Biapplicative, 
    bipure: bipure
};

},{"Control.Biapply":"/Users/maximko/Projects/mine/guppi/output/Control.Biapply/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Biapply/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Bifunctor = require("Data.Bifunctor");
var Biapply = function (__superclass_Data$dotBifunctor$dotBifunctor_0, biapply) {
    this["__superclass_Data.Bifunctor.Bifunctor_0"] = __superclass_Data$dotBifunctor$dotBifunctor_0;
    this.biapply = biapply;
};
var $less$less$dollar$greater$greater = Prelude.id(Prelude.categoryFn);
var biapply = function (dict) {
    return dict.biapply;
};
var $less$less$times$greater$greater = function (__dict_Biapply_0) {
    return biapply(__dict_Biapply_0);
};
var bilift2 = function (__dict_Biapply_1) {
    return function (f) {
        return function (g) {
            return function (a) {
                return function (b) {
                    return $less$less$times$greater$greater(__dict_Biapply_1)($less$less$dollar$greater$greater(Data_Bifunctor.bimap(__dict_Biapply_1["__superclass_Data.Bifunctor.Bifunctor_0"]())(f)(g))(a))(b);
                };
            };
        };
    };
};
var bilift3 = function (__dict_Biapply_2) {
    return function (f) {
        return function (g) {
            return function (a) {
                return function (b) {
                    return function (c) {
                        return $less$less$times$greater$greater(__dict_Biapply_2)($less$less$times$greater$greater(__dict_Biapply_2)($less$less$dollar$greater$greater(Data_Bifunctor.bimap(__dict_Biapply_2["__superclass_Data.Bifunctor.Bifunctor_0"]())(f)(g))(a))(b))(c);
                    };
                };
            };
        };
    };
};
var $times$greater$greater = function (__dict_Biapply_3) {
    return function (a) {
        return function (b) {
            return $less$less$times$greater$greater(__dict_Biapply_3)($less$less$dollar$greater$greater(Data_Bifunctor.bimap(__dict_Biapply_3["__superclass_Data.Bifunctor.Bifunctor_0"]())(Prelude["const"](Prelude.id(Prelude.categoryFn)))(Prelude["const"](Prelude.id(Prelude.categoryFn))))(a))(b);
        };
    };
};
var $less$less$times = function (__dict_Biapply_4) {
    return function (a) {
        return function (b) {
            return $less$less$times$greater$greater(__dict_Biapply_4)($less$less$dollar$greater$greater(Data_Bifunctor.bimap(__dict_Biapply_4["__superclass_Data.Bifunctor.Bifunctor_0"]())(Prelude["const"])(Prelude["const"]))(a))(b);
        };
    };
};
module.exports = {
    Biapply: Biapply, 
    bilift3: bilift3, 
    bilift2: bilift2, 
    "<<*": $less$less$times, 
    "*>>": $times$greater$greater, 
    "<<*>>": $less$less$times$greater$greater, 
    biapply: biapply, 
    "<<$>>": $less$less$dollar$greater$greater
};

},{"Data.Bifunctor":"/Users/maximko/Projects/mine/guppi/output/Data.Bifunctor/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Bind/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var $greater$eq$greater = function (__dict_Bind_0) {
    return function (f) {
        return function (g) {
            return function (a) {
                return Prelude[">>="](__dict_Bind_0)(f(a))(g);
            };
        };
    };
};
var $eq$less$less = function (__dict_Bind_1) {
    return function (f) {
        return function (m) {
            return Prelude[">>="](__dict_Bind_1)(m)(f);
        };
    };
};
var $less$eq$less = function (__dict_Bind_2) {
    return function (f) {
        return function (g) {
            return function (a) {
                return $eq$less$less(__dict_Bind_2)(f)(g(a));
            };
        };
    };
};
var join = function (__dict_Bind_3) {
    return function (m) {
        return Prelude[">>="](__dict_Bind_3)(m)(Prelude.id(Prelude.categoryFn));
    };
};
var ifM = function (__dict_Bind_4) {
    return function (cond) {
        return function (t) {
            return function (f) {
                return Prelude[">>="](__dict_Bind_4)(cond)(function (cond$prime) {
                    if (cond$prime) {
                        return t;
                    };
                    if (!cond$prime) {
                        return f;
                    };
                    throw new Error("Failed pattern match at Control.Bind line 44, column 1 - line 45, column 1: " + [ cond$prime.constructor.name ]);
                });
            };
        };
    };
};
module.exports = {
    ifM: ifM, 
    join: join, 
    "<=<": $less$eq$less, 
    ">=>": $greater$eq$greater, 
    "=<<": $eq$less$less
};

},{"Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Comonad/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Extend = require("Control.Extend");
var Comonad = function (__superclass_Control$dotExtend$dotExtend_0, extract) {
    this["__superclass_Control.Extend.Extend_0"] = __superclass_Control$dotExtend$dotExtend_0;
    this.extract = extract;
};
var extract = function (dict) {
    return dict.extract;
};
module.exports = {
    Comonad: Comonad, 
    extract: extract
};

},{"Control.Extend":"/Users/maximko/Projects/mine/guppi/output/Control.Extend/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Coroutine.Aff/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Either = require("Data.Either");
var Control_Coroutine = require("Control.Coroutine");
var Control_Monad_Aff = require("Control.Monad.Aff");
var Control_Monad_Aff_AVar = require("Control.Monad.Aff.AVar");
var Control_Monad_Aff_Class = require("Control.Monad.Aff.Class");
var Control_Monad_Eff = require("Control.Monad.Eff");
var Control_Monad_Eff_Class = require("Control.Monad.Eff.Class");
var Control_Monad_Free_Trans = require("Control.Monad.Free.Trans");
var Control_Monad_Trans = require("Control.Monad.Trans");
var produce = function (recv) {
    return Control_Monad_Free_Trans.hoistFreeT(Control_Coroutine.functorEmit)(Control_Monad_Aff.functorAff)(Control_Monad_Aff_Class.liftAff(Control_Monad_Aff_Class.monadAffAff))(Prelude.bind(Control_Monad_Free_Trans.bindFreeT(Control_Coroutine.functorEmit)(Control_Monad_Aff.monadAff))(Control_Monad_Trans.lift(Control_Monad_Free_Trans.monadTransFreeT(Control_Coroutine.functorEmit))(Control_Monad_Aff.monadAff)(Control_Monad_Aff_AVar.makeVar))(function (_0) {
        return Prelude.bind(Control_Monad_Free_Trans.bindFreeT(Control_Coroutine.functorEmit)(Control_Monad_Aff.monadAff))(Control_Monad_Trans.lift(Control_Monad_Free_Trans.monadTransFreeT(Control_Coroutine.functorEmit))(Control_Monad_Aff.monadAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(recv(function (_2) {
            return Control_Monad_Aff.runAff(Prelude["const"](Prelude["return"](Control_Monad_Eff.applicativeEff)(Prelude.unit)))(Prelude["return"](Control_Monad_Eff.applicativeEff))(Control_Monad_Aff_AVar.putVar(_0)(_2));
        }))))(function () {
            return Control_Coroutine.producer(Control_Monad_Aff.monadAff)(Control_Monad_Aff_AVar.takeVar(_0));
        });
    }));
};
var produce$prime = function (__dict_Monad_0) {
    return function (__dict_MonadAff_1) {
        return function (_3) {
            return Control_Monad_Free_Trans.hoistFreeT(Control_Coroutine.functorEmit)(((__dict_Monad_0["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Control_Monad_Aff_Class.liftAff(__dict_MonadAff_1))(produce(_3));
        };
    };
};
module.exports = {
    "produce'": produce$prime, 
    produce: produce
};

},{"Control.Coroutine":"/Users/maximko/Projects/mine/guppi/output/Control.Coroutine/index.js","Control.Monad.Aff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff/index.js","Control.Monad.Aff.AVar":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff.AVar/index.js","Control.Monad.Aff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff.Class/index.js","Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","Control.Monad.Eff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Class/index.js","Control.Monad.Free.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Free.Trans/index.js","Control.Monad.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Trans/index.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Coroutine.Stalling/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Coroutine = require("Control.Coroutine");
var Control_Monad_Free_Trans = require("Control.Monad.Free.Trans");
var Control_Monad_Maybe_Trans = require("Control.Monad.Maybe.Trans");
var Control_Monad_Rec_Class = require("Control.Monad.Rec.Class");
var Control_Monad_Trans = require("Control.Monad.Trans");
var Control_Bind = require("Control.Bind");
var Control_Plus = require("Control.Plus");
var Data_Functor = require("Data.Functor");
var Data_Bifunctor = require("Data.Bifunctor");
var Data_Either = require("Data.Either");
var Data_Identity = require("Data.Identity");
var Data_Maybe = require("Data.Maybe");
var Emit = (function () {
    function Emit(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Emit.create = function (value0) {
        return function (value1) {
            return new Emit(value0, value1);
        };
    };
    return Emit;
})();
var Stall = (function () {
    function Stall(value0) {
        this.value0 = value0;
    };
    Stall.create = function (value0) {
        return new Stall(value0);
    };
    return Stall;
})();
var stallF = function (e) {
    return function (s) {
        return function (q) {
            if (q instanceof Emit) {
                return e(q.value0)(q.value1);
            };
            if (q instanceof Stall) {
                return s(q.value0);
            };
            throw new Error("Failed pattern match at Control.Coroutine.Stalling line 39, column 1 - line 45, column 1: " + [ q.constructor.name ]);
        };
    };
};
var runStallingProcess = function (__dict_MonadRec_2) {
    return function (_19) {
        return Control_Monad_Maybe_Trans.runMaybeT(Control_Monad_Free_Trans.runFreeT(Data_Maybe.functorMaybe)(Control_Monad_Maybe_Trans.monadRecMaybeT(__dict_MonadRec_2))(Data_Maybe.maybe(Control_Plus.empty(Control_Monad_Maybe_Trans.plusMaybeT(__dict_MonadRec_2["__superclass_Prelude.Monad_0"]())))(Prelude.pure(Control_Monad_Maybe_Trans.applicativeMaybeT(__dict_MonadRec_2["__superclass_Prelude.Monad_0"]()))))(Control_Monad_Free_Trans.hoistFreeT(Data_Maybe.functorMaybe)(Control_Monad_Maybe_Trans.functorMaybeT(__dict_MonadRec_2["__superclass_Prelude.Monad_0"]()))(function (_20) {
            return Control_Monad_Maybe_Trans.MaybeT(Prelude.map((((__dict_MonadRec_2["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Maybe.Just.create)(_20));
        })(_19)));
    };
};
var producerToStallingProducer = function (__dict_Functor_3) {
    return Control_Monad_Free_Trans.interpret(Control_Coroutine.functorEmit)(__dict_Functor_3)(function (_1) {
        return new Emit(_1.value0, _1.value1);
    });
};
var processToStallingProcess = function (__dict_Functor_4) {
    return Control_Monad_Free_Trans.interpret(Data_Identity.functorIdentity)(__dict_Functor_4)(function (_21) {
        return Data_Maybe.Just.create(Data_Identity.runIdentity(_21));
    });
};
var bifunctorStallF = new Data_Bifunctor.Bifunctor(function (f) {
    return function (g) {
        return function (q) {
            if (q instanceof Emit) {
                return new Emit(f(q.value0), g(q.value1));
            };
            if (q instanceof Stall) {
                return new Stall(g(q.value0));
            };
            throw new Error("Failed pattern match at Control.Coroutine.Stalling line 50, column 1 - line 56, column 1: " + [ q.constructor.name ]);
        };
    };
});
var functorStallF = new Prelude.Functor(function (f) {
    return Data_Bifunctor.rmap(bifunctorStallF)(f);
});
var emit = function (__dict_Monad_6) {
    return function (_22) {
        return Control_Monad_Free_Trans.liftFreeT(functorStallF)(__dict_Monad_6)(Prelude.flip(Emit.create)(Prelude.unit)(_22));
    };
};
var catMaybes = function (__dict_MonadRec_7) {
    return Control_Monad_Rec_Class.tailRecM(Control_Monad_Free_Trans.monadRecFreeT(functorStallF)(__dict_MonadRec_7["__superclass_Prelude.Monad_0"]()))(Control_Bind[">=>"](Control_Monad_Free_Trans.bindFreeT(functorStallF)(__dict_MonadRec_7["__superclass_Prelude.Monad_0"]()))(Prelude[">>>"](Prelude.semigroupoidFn)(Control_Monad_Free_Trans.resume(functorStallF)(__dict_MonadRec_7))(Control_Monad_Trans.lift(Control_Monad_Free_Trans.monadTransFreeT(functorStallF))(__dict_MonadRec_7["__superclass_Prelude.Monad_0"]())))(Data_Either.either(Prelude[">>>"](Prelude.semigroupoidFn)(Data_Either.Right.create)(Prelude.pure(Control_Monad_Free_Trans.applicativeFreeT(functorStallF)(__dict_MonadRec_7["__superclass_Prelude.Monad_0"]()))))(stallF(function (mo) {
        return function (t) {
            return Data_Functor["$>"](Control_Monad_Free_Trans.functorFreeT(functorStallF)((((__dict_MonadRec_7["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]()))(Data_Maybe.maybe(Prelude.pure(Control_Monad_Free_Trans.applicativeFreeT(functorStallF)(__dict_MonadRec_7["__superclass_Prelude.Monad_0"]()))(Prelude.unit))(emit(__dict_MonadRec_7["__superclass_Prelude.Monad_0"]()))(mo))(new Data_Either.Left(t));
        };
    })(Prelude[">>>"](Prelude.semigroupoidFn)(Data_Either.Left.create)(Prelude.pure(Control_Monad_Free_Trans.applicativeFreeT(functorStallF)(__dict_MonadRec_7["__superclass_Prelude.Monad_0"]())))))));
};
var stall = function (__dict_Monad_1) {
    return Control_Monad_Free_Trans.liftFreeT(functorStallF)(__dict_Monad_1)(new Stall(Prelude.unit));
};
var $dollar$dollar$qmark = function (__dict_MonadRec_0) {
    return Control_Coroutine.fuseWith(functorStallF)(Control_Coroutine.functorAwait)(Data_Maybe.functorMaybe)(__dict_MonadRec_0)(function (f) {
        return function (q) {
            return function (_0) {
                if (q instanceof Emit) {
                    return new Data_Maybe.Just(f(q.value1)(_0(q.value0)));
                };
                if (q instanceof Stall) {
                    return Data_Maybe.Nothing.value;
                };
                throw new Error("Failed pattern match at Control.Coroutine.Stalling line 79, column 1 - line 85, column 1: " + [ q.constructor.name ]);
            };
        };
    });
};
var mapStallingProducer = function (__dict_Functor_5) {
    return function (_23) {
        return Control_Monad_Free_Trans.interpret(functorStallF)(__dict_Functor_5)(Data_Bifunctor.lmap(bifunctorStallF)(_23));
    };
};
var filter = function (__dict_MonadRec_8) {
    return function (p) {
        return function (_24) {
            return catMaybes(__dict_MonadRec_8)(mapStallingProducer((((__dict_MonadRec_8["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(function (x) {
                var _18 = p(x);
                if (_18) {
                    return new Data_Maybe.Just(x);
                };
                if (!_18) {
                    return Data_Maybe.Nothing.value;
                };
                throw new Error("Failed pattern match at Control.Coroutine.Stalling line 142, column 1 - line 148, column 1: " + [ _18.constructor.name ]);
            })(_24));
        };
    };
};
module.exports = {
    Emit: Emit, 
    Stall: Stall, 
    filter: filter, 
    catMaybes: catMaybes, 
    mapStallingProducer: mapStallingProducer, 
    "$$?": $dollar$dollar$qmark, 
    runStallingProcess: runStallingProcess, 
    processToStallingProcess: processToStallingProcess, 
    producerToStallingProducer: producerToStallingProducer, 
    stallF: stallF, 
    stall: stall, 
    emit: emit, 
    bifunctorStallF: bifunctorStallF, 
    functorStallF: functorStallF
};

},{"Control.Bind":"/Users/maximko/Projects/mine/guppi/output/Control.Bind/index.js","Control.Coroutine":"/Users/maximko/Projects/mine/guppi/output/Control.Coroutine/index.js","Control.Monad.Free.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Free.Trans/index.js","Control.Monad.Maybe.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Maybe.Trans/index.js","Control.Monad.Rec.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Rec.Class/index.js","Control.Monad.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Trans/index.js","Control.Plus":"/Users/maximko/Projects/mine/guppi/output/Control.Plus/index.js","Data.Bifunctor":"/Users/maximko/Projects/mine/guppi/output/Data.Bifunctor/index.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Functor":"/Users/maximko/Projects/mine/guppi/output/Data.Functor/index.js","Data.Identity":"/Users/maximko/Projects/mine/guppi/output/Data.Identity/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Coroutine/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Maybe = require("Data.Maybe");
var Data_Tuple = require("Data.Tuple");
var Data_Either = require("Data.Either");
var Data_Identity = require("Data.Identity");
var Data_Functor = require("Data.Functor");
var Data_Bifunctor = require("Data.Bifunctor");
var Data_Profunctor = require("Data.Profunctor");
var Control_Monad_Trans = require("Control.Monad.Trans");
var Control_Monad_Free_Trans = require("Control.Monad.Free.Trans");
var Control_Monad_Rec_Class = require("Control.Monad.Rec.Class");
var Transform = function (x) {
    return x;
};
var Emit = (function () {
    function Emit(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Emit.create = function (value0) {
        return function (value1) {
            return new Emit(value0, value1);
        };
    };
    return Emit;
})();
var Await = function (x) {
    return x;
};
var runProcess = function (__dict_MonadRec_1) {
    return Control_Monad_Free_Trans.runFreeT(Data_Identity.functorIdentity)(__dict_MonadRec_1)(function (_86) {
        return Prelude["return"]((__dict_MonadRec_1["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Applicative_0"]())(Data_Identity.runIdentity(_86));
    });
};
var profunctorAwait = new Data_Profunctor.Profunctor(function (f) {
    return function (g) {
        return function (_22) {
            return Data_Profunctor.dimap(Data_Profunctor.profunctorFn)(f)(g)(_22);
        };
    };
});
var loop = function (__dict_Functor_2) {
    return function (__dict_Monad_3) {
        return function (me) {
            return Control_Monad_Rec_Class.tailRecM(Control_Monad_Free_Trans.monadRecFreeT(__dict_Functor_2)(__dict_Monad_3))(function (_4) {
                return Prelude.map(Control_Monad_Free_Trans.functorFreeT(__dict_Functor_2)(((__dict_Monad_3["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]()))(Data_Maybe.maybe(new Data_Either.Left(Prelude.unit))(Data_Either.Right.create))(me);
            })(Prelude.unit);
        };
    };
};
var fuseWith = function (__dict_Functor_4) {
    return function (__dict_Functor_5) {
        return function (__dict_Functor_6) {
            return function (__dict_MonadRec_7) {
                return function (zap) {
                    return function (fs) {
                        return function (gs) {
                            var go = function (_20) {
                                return Prelude.bind((__dict_MonadRec_7["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())(Control_Monad_Free_Trans.resume(__dict_Functor_5)(__dict_MonadRec_7)(_20.value1))(function (_1) {
                                    return Prelude.bind((__dict_MonadRec_7["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())(Control_Monad_Free_Trans.resume(__dict_Functor_4)(__dict_MonadRec_7)(_20.value0))(function (_0) {
                                        var _31 = Prelude["<*>"](Data_Either.applyEither)(Prelude["<$>"](Data_Either.functorEither)(zap(Data_Tuple.Tuple.create))(_0))(_1);
                                        if (_31 instanceof Data_Either.Left) {
                                            return Prelude["return"]((__dict_MonadRec_7["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Applicative_0"]())(new Data_Either.Left(_31.value0));
                                        };
                                        if (_31 instanceof Data_Either.Right) {
                                            return Prelude["return"]((__dict_MonadRec_7["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Applicative_0"]())(new Data_Either.Right(Prelude.map(__dict_Functor_6)(function (t) {
                                                return Control_Monad_Free_Trans.freeT(function (_5) {
                                                    return go(t);
                                                });
                                            })(_31.value0)));
                                        };
                                        throw new Error("Failed pattern match at Control.Coroutine line 49, column 1 - line 54, column 1: " + [ _31.constructor.name ]);
                                    });
                                });
                            };
                            return Control_Monad_Free_Trans.freeT(function (_6) {
                                return go(new Data_Tuple.Tuple(fs, gs));
                            });
                        };
                    };
                };
            };
        };
    };
};
var functorAwait = new Prelude.Functor(Data_Profunctor.rmap(profunctorAwait));
var $bslash$div = function (__dict_MonadRec_11) {
    return fuseWith(functorAwait)(functorAwait)(functorAwait)(__dict_MonadRec_11)(function (f) {
        return function (_19) {
            return function (_18) {
                return function (_17) {
                    return f(_19(_17.value0))(_18(_17.value1));
                };
            };
        };
    });
};
var bifunctorTransform = new Data_Bifunctor.Bifunctor(function (f) {
    return function (g) {
        return function (_23) {
            return function (_87) {
                return Data_Bifunctor.bimap(Data_Tuple.bifunctorTuple)(f)(g)(_23(_87));
            };
        };
    };
});
var functorTransform = new Prelude.Functor(Data_Bifunctor.rmap(bifunctorTransform));
var transform = function (__dict_Monad_0) {
    return function (f) {
        return Control_Monad_Free_Trans.liftFreeT(functorTransform)(__dict_Monad_0)(function (i) {
            return new Data_Tuple.Tuple(f(i), Prelude.unit);
        });
    };
};
var $tilde$dollar = function (__dict_MonadRec_12) {
    return fuseWith(functorTransform)(functorAwait)(functorAwait)(__dict_MonadRec_12)(function (f) {
        return function (_12) {
            return function (_11) {
                return function (i) {
                    var _48 = _12(i);
                    return f(_48.value1)(_11(_48.value0));
                };
            };
        };
    });
};
var $tilde$tilde = function (__dict_MonadRec_13) {
    return fuseWith(functorTransform)(functorTransform)(functorTransform)(__dict_MonadRec_13)(function (f) {
        return function (_14) {
            return function (_13) {
                return function (i) {
                    var _53 = _14(i);
                    var _54 = _13(_53.value0);
                    return new Data_Tuple.Tuple(_54.value0, f(_53.value1)(_54.value1));
                };
            };
        };
    });
};
var bifunctorEmit = new Data_Bifunctor.Bifunctor(function (f) {
    return function (g) {
        return function (_21) {
            return new Emit(f(_21.value0), g(_21.value1));
        };
    };
});
var functorEmit = new Prelude.Functor(Data_Bifunctor.rmap(bifunctorEmit));
var emit = function (__dict_Monad_14) {
    return function (o) {
        return Control_Monad_Free_Trans.liftFreeT(functorEmit)(__dict_Monad_14)(new Emit(o, Prelude.unit));
    };
};
var producer = function (__dict_Monad_15) {
    return function (recv) {
        return loop(functorEmit)(__dict_Monad_15)(Prelude.bind(Control_Monad_Free_Trans.bindFreeT(functorEmit)(__dict_Monad_15))(Control_Monad_Trans.lift(Control_Monad_Free_Trans.monadTransFreeT(functorEmit))(__dict_Monad_15)(recv))(function (_2) {
            if (_2 instanceof Data_Either.Left) {
                return Data_Functor["$>"](Control_Monad_Free_Trans.functorFreeT(functorEmit)(((__dict_Monad_15["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]()))(emit(__dict_Monad_15)(_2.value0))(Data_Maybe.Nothing.value);
            };
            if (_2 instanceof Data_Either.Right) {
                return Prelude["return"](Control_Monad_Free_Trans.applicativeFreeT(functorEmit)(__dict_Monad_15))(new Data_Maybe.Just(_2.value0));
            };
            throw new Error("Failed pattern match at Control.Coroutine line 83, column 1 - line 84, column 1: " + [ _2.constructor.name ]);
        }));
    };
};
var $dollar$dollar = function (__dict_MonadRec_8) {
    return fuseWith(functorEmit)(functorAwait)(Data_Identity.functorIdentity)(__dict_MonadRec_8)(function (f) {
        return function (_8) {
            return function (_7) {
                return f(_8.value1)(_7(_8.value0));
            };
        };
    });
};
var $dollar$tilde = function (__dict_MonadRec_9) {
    return fuseWith(functorEmit)(functorTransform)(functorEmit)(__dict_MonadRec_9)(function (f) {
        return function (_10) {
            return function (_9) {
                var _74 = _9(_10.value0);
                return new Emit(_74.value0, f(_10.value1)(_74.value1));
            };
        };
    });
};
var $div$bslash = function (__dict_MonadRec_10) {
    return fuseWith(functorEmit)(functorEmit)(functorEmit)(__dict_MonadRec_10)(function (f) {
        return function (_16) {
            return function (_15) {
                return new Emit(new Data_Tuple.Tuple(_16.value0, _15.value0), f(_16.value1)(_15.value1));
            };
        };
    });
};
var await = function (__dict_Monad_16) {
    return Control_Monad_Free_Trans.liftFreeT(functorAwait)(__dict_Monad_16)(Prelude.id(Prelude.categoryFn));
};
var consumer = function (__dict_Monad_17) {
    return function (send) {
        return loop(functorAwait)(__dict_Monad_17)(Prelude.bind(Control_Monad_Free_Trans.bindFreeT(functorAwait)(__dict_Monad_17))(await(__dict_Monad_17))(function (_3) {
            return Control_Monad_Trans.lift(Control_Monad_Free_Trans.monadTransFreeT(functorAwait))(__dict_Monad_17)(send(_3));
        }));
    };
};
module.exports = {
    Transform: Transform, 
    Await: Await, 
    Emit: Emit, 
    "\\/": $bslash$div, 
    "/\\": $div$bslash, 
    "~~": $tilde$tilde, 
    "~$": $tilde$dollar, 
    "$~": $dollar$tilde, 
    "$$": $dollar$dollar, 
    transform: transform, 
    consumer: consumer, 
    await: await, 
    producer: producer, 
    emit: emit, 
    fuseWith: fuseWith, 
    runProcess: runProcess, 
    loop: loop, 
    bifunctorEmit: bifunctorEmit, 
    functorEmit: functorEmit, 
    profunctorAwait: profunctorAwait, 
    functorAwait: functorAwait, 
    bifunctorTransform: bifunctorTransform, 
    functorTransform: functorTransform
};

},{"Control.Monad.Free.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Free.Trans/index.js","Control.Monad.Rec.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Rec.Class/index.js","Control.Monad.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Trans/index.js","Data.Bifunctor":"/Users/maximko/Projects/mine/guppi/output/Data.Bifunctor/index.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Functor":"/Users/maximko/Projects/mine/guppi/output/Data.Functor/index.js","Data.Identity":"/Users/maximko/Projects/mine/guppi/output/Data.Identity/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Profunctor":"/Users/maximko/Projects/mine/guppi/output/Data.Profunctor/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Extend/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Extend = function (__superclass_Prelude$dotFunctor_0, extend) {
    this["__superclass_Prelude.Functor_0"] = __superclass_Prelude$dotFunctor_0;
    this.extend = extend;
};
var extendFn = function (__dict_Semigroup_0) {
    return new Extend(function () {
        return Prelude.functorFn;
    }, function (f) {
        return function (g) {
            return function (w) {
                return f(function (w$prime) {
                    return g(Prelude["<>"](__dict_Semigroup_0)(w)(w$prime));
                });
            };
        };
    });
};
var extend = function (dict) {
    return dict.extend;
};
var $less$less$eq = function (__dict_Extend_1) {
    return extend(__dict_Extend_1);
};
var $eq$less$eq = function (__dict_Extend_2) {
    return function (f) {
        return function (g) {
            return function (w) {
                return f($less$less$eq(__dict_Extend_2)(g)(w));
            };
        };
    };
};
var $eq$greater$eq = function (__dict_Extend_3) {
    return function (f) {
        return function (g) {
            return function (w) {
                return g($less$less$eq(__dict_Extend_3)(f)(w));
            };
        };
    };
};
var $eq$greater$greater = function (__dict_Extend_4) {
    return function (w) {
        return function (f) {
            return $less$less$eq(__dict_Extend_4)(f)(w);
        };
    };
};
var duplicate = function (__dict_Extend_5) {
    return extend(__dict_Extend_5)(Prelude.id(Prelude.categoryFn));
};
module.exports = {
    Extend: Extend, 
    duplicate: duplicate, 
    "=<=": $eq$less$eq, 
    "=>=": $eq$greater$eq, 
    "=>>": $eq$greater$greater, 
    "<<=": $less$less$eq, 
    extend: extend, 
    extendFn: extendFn
};

},{"Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Lazy/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Lazy = function (defer) {
    this.defer = defer;
};
var defer = function (dict) {
    return dict.defer;
};
var fix = function (__dict_Lazy_0) {
    return function (f) {
        return defer(__dict_Lazy_0)(function (_0) {
            return f(fix(__dict_Lazy_0)(f));
        });
    };
};
module.exports = {
    Lazy: Lazy, 
    fix: fix, 
    defer: defer
};

},{"Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff.AVar/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Control.Monad.Aff.AVar

exports._makeVar = function (nonCanceler) {
  return function(success, error) {
    try {
      success({
        consumers: [],
        producers: [],
        error: undefined 
      });
    } catch (e) {
      error(e);
    }

    return nonCanceler;
  }
}

exports._takeVar = function (nonCanceler, avar) {
  return function(success, error) {
    if (avar.error !== undefined) {
      error(avar.error);
    } else if (avar.producers.length > 0) {
      var producer = avar.producers.shift();

      producer(success, error);
    } else {
      avar.consumers.push({success: success, error: error});
    }

    return nonCanceler;
  } 
}

exports._putVar = function (nonCanceler, avar, a) {
  return function(success, error) {
    if (avar.error !== undefined) {
      error(avar.error);
    } else if (avar.consumers.length === 0) {
      avar.producers.push(function(success, error) {
        try {
          success(a);
        } catch (e) {
          error(e);
        }
      });

      success({});
    } else {
      var consumer = avar.consumers.shift();

      try {
        consumer.success(a);
      } catch (e) {
        error(e);

        return;                  
      }

      success({});
    }

    return nonCanceler;
  }
}

exports._killVar = function (nonCanceler, avar, e) {
  return function(success, error) {
    if (avar.error !== undefined) {
      error(avar.error);
    } else {
      var errors = [];

      avar.error = e;

      while (avar.consumers.length > 0) {
        var consumer = avar.consumers.shift();

        try {
          consumer.error(e);
        } catch (e) {
          errors.push(e);              
        }
      }

      if (errors.length > 0) error(errors[0]);
      else success({});
    }

    return nonCanceler;
  }
}

},{}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff.AVar/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Control_Monad_Aff = require("Control.Monad.Aff");
var Control_Monad_Eff_Exception = require("Control.Monad.Eff.Exception");
var Data_Function = require("Data.Function");
var takeVar = function (q) {
    return $foreign._takeVar(Control_Monad_Aff.nonCanceler, q);
};
var putVar = function (q) {
    return function (a) {
        return $foreign._putVar(Control_Monad_Aff.nonCanceler, q, a);
    };
};
var modifyVar = function (f) {
    return function (v) {
        return Prelude[">>="](Control_Monad_Aff.bindAff)(takeVar(v))(Prelude[">>>"](Prelude.semigroupoidFn)(f)(putVar(v)));
    };
};
var makeVar = $foreign._makeVar(Control_Monad_Aff.nonCanceler);
var makeVar$prime = function (a) {
    return Prelude.bind(Control_Monad_Aff.bindAff)(makeVar)(function (_0) {
        return Prelude.bind(Control_Monad_Aff.bindAff)(putVar(_0)(a))(function () {
            return Prelude["return"](Control_Monad_Aff.applicativeAff)(_0);
        });
    });
};
var killVar = function (q) {
    return function (e) {
        return $foreign._killVar(Control_Monad_Aff.nonCanceler, q, e);
    };
};
module.exports = {
    takeVar: takeVar, 
    putVar: putVar, 
    modifyVar: modifyVar, 
    "makeVar'": makeVar$prime, 
    makeVar: makeVar, 
    killVar: killVar
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff.AVar/foreign.js","Control.Monad.Aff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff/index.js","Control.Monad.Eff.Exception":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Exception/index.js","Data.Function":"/Users/maximko/Projects/mine/guppi/output/Data.Function/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff.Class/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Monad_Aff = require("Control.Monad.Aff");
var Control_Monad_Cont_Trans = require("Control.Monad.Cont.Trans");
var Control_Monad_Except_Trans = require("Control.Monad.Except.Trans");
var Control_Monad_List_Trans = require("Control.Monad.List.Trans");
var Control_Monad_Maybe_Trans = require("Control.Monad.Maybe.Trans");
var Control_Monad_Reader_Trans = require("Control.Monad.Reader.Trans");
var Control_Monad_RWS_Trans = require("Control.Monad.RWS.Trans");
var Control_Monad_State_Trans = require("Control.Monad.State.Trans");
var Control_Monad_Trans = require("Control.Monad.Trans");
var Control_Monad_Writer_Trans = require("Control.Monad.Writer.Trans");
var Data_Monoid = require("Data.Monoid");
var MonadAff = function (liftAff) {
    this.liftAff = liftAff;
};
var monadAffAff = new MonadAff(Prelude.id(Prelude.categoryFn));
var liftAff = function (dict) {
    return dict.liftAff;
};
var monadAffContT = function (__dict_Monad_0) {
    return function (__dict_MonadAff_1) {
        return new MonadAff(function (_0) {
            return Control_Monad_Trans.lift(Control_Monad_Cont_Trans.monadTransContT)(__dict_Monad_0)(liftAff(__dict_MonadAff_1)(_0));
        });
    };
};
var monadAffExceptT = function (__dict_Monad_2) {
    return function (__dict_MonadAff_3) {
        return new MonadAff(function (_1) {
            return Control_Monad_Trans.lift(Control_Monad_Except_Trans.monadTransExceptT)(__dict_Monad_2)(liftAff(__dict_MonadAff_3)(_1));
        });
    };
};
var monadAffListT = function (__dict_Monad_4) {
    return function (__dict_MonadAff_5) {
        return new MonadAff(function (_2) {
            return Control_Monad_Trans.lift(Control_Monad_List_Trans.monadTransListT)(__dict_Monad_4)(liftAff(__dict_MonadAff_5)(_2));
        });
    };
};
var monadAffMaybe = function (__dict_Monad_6) {
    return function (__dict_MonadAff_7) {
        return new MonadAff(function (_3) {
            return Control_Monad_Trans.lift(Control_Monad_Maybe_Trans.monadTransMaybeT)(__dict_Monad_6)(liftAff(__dict_MonadAff_7)(_3));
        });
    };
};
var monadAffRWS = function (__dict_Monad_8) {
    return function (__dict_Monoid_9) {
        return function (__dict_MonadAff_10) {
            return new MonadAff(function (_4) {
                return Control_Monad_Trans.lift(Control_Monad_RWS_Trans.monadTransRWST(__dict_Monoid_9))(__dict_Monad_8)(liftAff(__dict_MonadAff_10)(_4));
            });
        };
    };
};
var monadAffReader = function (__dict_Monad_11) {
    return function (__dict_MonadAff_12) {
        return new MonadAff(function (_5) {
            return Control_Monad_Trans.lift(Control_Monad_Reader_Trans.monadTransReaderT)(__dict_Monad_11)(liftAff(__dict_MonadAff_12)(_5));
        });
    };
};
var monadAffState = function (__dict_Monad_13) {
    return function (__dict_MonadAff_14) {
        return new MonadAff(function (_6) {
            return Control_Monad_Trans.lift(Control_Monad_State_Trans.monadTransStateT)(__dict_Monad_13)(liftAff(__dict_MonadAff_14)(_6));
        });
    };
};
var monadAffWriter = function (__dict_Monad_15) {
    return function (__dict_Monoid_16) {
        return function (__dict_MonadAff_17) {
            return new MonadAff(function (_7) {
                return Control_Monad_Trans.lift(Control_Monad_Writer_Trans.monadTransWriterT(__dict_Monoid_16))(__dict_Monad_15)(liftAff(__dict_MonadAff_17)(_7));
            });
        };
    };
};
module.exports = {
    MonadAff: MonadAff, 
    liftAff: liftAff, 
    monadAffAff: monadAffAff, 
    monadAffContT: monadAffContT, 
    monadAffExceptT: monadAffExceptT, 
    monadAffListT: monadAffListT, 
    monadAffMaybe: monadAffMaybe, 
    monadAffReader: monadAffReader, 
    monadAffRWS: monadAffRWS, 
    monadAffState: monadAffState, 
    monadAffWriter: monadAffWriter
};

},{"Control.Monad.Aff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff/index.js","Control.Monad.Cont.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Cont.Trans/index.js","Control.Monad.Except.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Except.Trans/index.js","Control.Monad.List.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.List.Trans/index.js","Control.Monad.Maybe.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Maybe.Trans/index.js","Control.Monad.RWS.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.RWS.Trans/index.js","Control.Monad.Reader.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Reader.Trans/index.js","Control.Monad.State.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State.Trans/index.js","Control.Monad.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Trans/index.js","Control.Monad.Writer.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Writer.Trans/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Control.Monad.Aff

exports._cancelWith = function (nonCanceler, aff, canceler1) {
  return function(success, error) {
    var canceler2 = aff(success, error);

    return function(e) {
      return function(success, error) {
        var cancellations = 0;
        var result        = false;
        var errored       = false;

        var s = function(bool) {
          cancellations = cancellations + 1;
          result        = result || bool;

          if (cancellations === 2 && !errored) {
            try {
              success(result);
            } catch (e) {
              error(e);
            }
          }
        };

        var f = function(err) {
          if (!errored) {
            errored = true;

            error(err);
          }
        };

        canceler2(e)(s, f);
        canceler1(e)(s, f);

        return nonCanceler;
      };
    };
  };
}

exports._setTimeout = function (nonCanceler, millis, aff) {
  var set = setTimeout, clear = clearTimeout;
  if (millis <= 0 && typeof setImmediate === "function") {
    set = setImmediate;
    clear = clearImmediate;
  }
  return function(success, error) {
    var canceler;

    var timeout = set(function() {
      canceler = aff(success, error);
    }, millis);

    return function(e) {
      return function(s, f) {
        if (canceler !== undefined) {
          return canceler(e)(s, f);
        } else {
          clear(timeout);

          try {
            s(true);
          } catch (e) {
            f(e);
          }

          return nonCanceler;
        }
      };
    };
  };
}

exports._unsafeInterleaveAff = function (aff) {
  return aff;
}

exports._forkAff = function (nonCanceler, aff) {
  var voidF = function(){};

  return function(success, error) {
    var canceler = aff(voidF, voidF);

    try {
      success(canceler);
    } catch (e) {
      error(e);
    }

    return nonCanceler;
  };
}

exports._makeAff = function (cb) {
  return function(success, error) {
    return cb(function(e) {
      return function() {
        error(e);
      };
    })(function(v) {
      return function() {
        try {
          success(v);
        } catch (e) {
          error(e);
        }
      };
    })();
  }
}

exports._pure = function (nonCanceler, v) {
  return function(success, error) {
    try {
      success(v);
    } catch (e) {
      error(e);
    }

    return nonCanceler;
  };
}

exports._throwError = function (nonCanceler, e) {
  return function(success, error) {
    error(e);

    return nonCanceler;
  };
}

exports._fmap = function (f, aff) {
  return function(success, error) {
    return aff(function(v) {
      try {
        success(f(v));
      } catch (e) {
        error(e);
      }
    }, error);
  };
}

exports._bind = function (alwaysCanceler, aff, f) {
  return function(success, error) {
    var canceler1, canceler2;

    var isCanceled    = false;
    var requestCancel = false;

    var onCanceler = function(){};

    canceler1 = aff(function(v) {
      if (requestCancel) {
        isCanceled = true;

        return alwaysCanceler;
      } else {
        canceler2 = f(v)(success, error);

        onCanceler(canceler2);

        return canceler2;
      }
    }, error);

    return function(e) {
      return function(s, f) {
        requestCancel = true;

        if (canceler2 !== undefined) {
          return canceler2(e)(s, f);
        } else {
          return canceler1(e)(function(bool) {
            if (bool || isCanceled) {
              try {
                s(true);
              } catch (e) {
                f(e);
              }
            } else {
              onCanceler = function(canceler) {
                canceler(e)(s, f);
              };
            }
          }, f);
        }
      };
    };
  };
}

exports._attempt = function (Left, Right, aff) {
  return function(success, error) {
    return aff(function(v) {
      try {
        success(Right(v));
      } catch (e) {
        error(e);
      }
    }, function(e) {
      try {
        success(Left(e));
      } catch (e) {
        error(e);
      }
    });
  };
}

exports._runAff = function (errorT, successT, aff) {
  return function() {
    return aff(function(v) {
      try {
        successT(v)();
      } catch (e) {
        errorT(e)();
      }
    }, function(e) {
      errorT(e)();
    });
  };
}

exports._liftEff = function (nonCanceler, e) {
  return function(success, error) {
    try {
      success(e());
    } catch (e) {
      error(e);
    }

    return nonCanceler;
  };
}

},{}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Control_Alt = require("Control.Alt");
var Control_Alternative = require("Control.Alternative");
var Control_Monad_Cont_Class = require("Control.Monad.Cont.Class");
var Control_Monad_Eff = require("Control.Monad.Eff");
var Control_Monad_Eff_Class = require("Control.Monad.Eff.Class");
var Control_Monad_Eff_Exception = require("Control.Monad.Eff.Exception");
var Control_Monad_Error_Class = require("Control.Monad.Error.Class");
var Control_Monad_Rec_Class = require("Control.Monad.Rec.Class");
var Control_MonadPlus = require("Control.MonadPlus");
var Control_Plus = require("Control.Plus");
var Data_Either = require("Data.Either");
var Data_Function = require("Data.Function");
var Data_Monoid = require("Data.Monoid");
var Canceler = function (x) {
    return x;
};
var runAff = function (ex) {
    return function (f) {
        return function (aff) {
            return $foreign._runAff(ex, f, aff);
        };
    };
};
var makeAff$prime = function (h) {
    return $foreign._makeAff(h);
};
var launchAff = function (_17) {
    return runAff(Control_Monad_Eff_Exception.throwException)(Prelude["const"](Prelude.pure(Control_Monad_Eff.applicativeEff)(Prelude.unit)))($foreign._unsafeInterleaveAff(_17));
};
var functorAff = new Prelude.Functor(function (f) {
    return function (fa) {
        return $foreign._fmap(f, fa);
    };
});
var cancel = function (_4) {
    return _4;
};
var attempt = function (aff) {
    return $foreign._attempt(Data_Either.Left.create, Data_Either.Right.create, aff);
};
var apathize = function (a) {
    return Prelude["<$>"](functorAff)(Prelude["const"](Prelude.unit))(attempt(a));
};
var applyAff = new Prelude.Apply(function () {
    return functorAff;
}, function (ff) {
    return function (fa) {
        return $foreign._bind(alwaysCanceler, ff, function (f) {
            return Prelude["<$>"](functorAff)(f)(fa);
        });
    };
});
var applicativeAff = new Prelude.Applicative(function () {
    return applyAff;
}, function (v) {
    return $foreign._pure(nonCanceler, v);
});
var nonCanceler = Prelude["const"](Prelude.pure(applicativeAff)(false));
var alwaysCanceler = Prelude["const"](Prelude.pure(applicativeAff)(true));
var cancelWith = function (aff) {
    return function (c) {
        return $foreign._cancelWith(nonCanceler, aff, c);
    };
};
var forkAff = function (aff) {
    return $foreign._forkAff(nonCanceler, aff);
};
var later$prime = function (n) {
    return function (aff) {
        return $foreign._setTimeout(nonCanceler, n, aff);
    };
};
var later = later$prime(0);
var liftEff$prime = function (eff) {
    return attempt($foreign._unsafeInterleaveAff($foreign._liftEff(nonCanceler, eff)));
};
var makeAff = function (h) {
    return makeAff$prime(function (e) {
        return function (a) {
            return Prelude["<$>"](Control_Monad_Eff.functorEff)(Prelude["const"](nonCanceler))(h(e)(a));
        };
    });
};
var semigroupAff = function (__dict_Semigroup_0) {
    return new Prelude.Semigroup(function (a) {
        return function (b) {
            return Prelude["<*>"](applyAff)(Prelude["<$>"](functorAff)(Prelude["<>"](__dict_Semigroup_0))(a))(b);
        };
    });
};
var monoidAff = function (__dict_Monoid_1) {
    return new Data_Monoid.Monoid(function () {
        return semigroupAff(__dict_Monoid_1["__superclass_Prelude.Semigroup_0"]());
    }, Prelude.pure(applicativeAff)(Data_Monoid.mempty(__dict_Monoid_1)));
};
var semigroupCanceler = new Prelude.Semigroup(function (_5) {
    return function (_6) {
        return function (e) {
            return Prelude["<*>"](applyAff)(Prelude["<$>"](functorAff)(Prelude["||"](Prelude.booleanAlgebraBoolean))(_5(e)))(_6(e));
        };
    };
});
var monoidCanceler = new Data_Monoid.Monoid(function () {
    return semigroupCanceler;
}, Prelude["const"](Prelude.pure(applicativeAff)(true)));
var bindAff = new Prelude.Bind(function () {
    return applyAff;
}, function (fa) {
    return function (f) {
        return $foreign._bind(alwaysCanceler, fa, f);
    };
});
var monadAff = new Prelude.Monad(function () {
    return applicativeAff;
}, function () {
    return bindAff;
});
var monadContAff = new Control_Monad_Cont_Class.MonadCont(function () {
    return monadAff;
}, function (f) {
    return makeAff(function (eb) {
        return function (cb) {
            return runAff(eb)(cb)(f(function (a) {
                return makeAff(function (_3) {
                    return function (_2) {
                        return cb(a);
                    };
                });
            }));
        };
    });
});
var monadEffAff = new Control_Monad_Eff_Class.MonadEff(function () {
    return monadAff;
}, function (eff) {
    return $foreign._liftEff(nonCanceler, eff);
});
var monadErrorAff = new Control_Monad_Error_Class.MonadError(function () {
    return monadAff;
}, function (aff) {
    return function (ex) {
        return Prelude[">>="](bindAff)(attempt(aff))(Data_Either.either(ex)(Prelude.pure(applicativeAff)));
    };
}, function (e) {
    return $foreign._throwError(nonCanceler, e);
});
var $$finally = function (aff1) {
    return function (aff2) {
        return Prelude.bind(bindAff)(attempt(aff1))(function (_0) {
            return Prelude.bind(bindAff)(aff2)(function () {
                return Data_Either.either(Control_Monad_Error_Class.throwError(monadErrorAff))(Prelude.pure(applicativeAff))(_0);
            });
        });
    };
};
var monadRecAff = new Control_Monad_Rec_Class.MonadRec(function () {
    return monadAff;
}, function (f) {
    return function (a) {
        var go = function (size) {
            return function (f_1) {
                return function (a_1) {
                    return Prelude.bind(bindAff)(f_1(a_1))(function (_1) {
                        if (_1 instanceof Data_Either.Left) {
                            if (size < 100) {
                                return go(size + 1 | 0)(f_1)(_1.value0);
                            };
                            if (Prelude.otherwise) {
                                return later(Control_Monad_Rec_Class.tailRecM(monadRecAff)(f_1)(_1.value0));
                            };
                        };
                        if (_1 instanceof Data_Either.Right) {
                            return Prelude.pure(applicativeAff)(_1.value0);
                        };
                        throw new Error("Failed pattern match: " + [ _1.constructor.name ]);
                    });
                };
            };
        };
        return go(0)(f)(a);
    };
});
var altAff = new Control_Alt.Alt(function () {
    return functorAff;
}, function (a1) {
    return function (a2) {
        return Prelude[">>="](bindAff)(attempt(a1))(Data_Either.either(Prelude["const"](a2))(Prelude.pure(applicativeAff)));
    };
});
var plusAff = new Control_Plus.Plus(function () {
    return altAff;
}, Control_Monad_Error_Class.throwError(monadErrorAff)(Control_Monad_Eff_Exception.error("Always fails")));
var alternativeAff = new Control_Alternative.Alternative(function () {
    return plusAff;
}, function () {
    return applicativeAff;
});
var monadPlusAff = new Control_MonadPlus.MonadPlus(function () {
    return alternativeAff;
}, function () {
    return monadAff;
});
module.exports = {
    Canceler: Canceler, 
    runAff: runAff, 
    nonCanceler: nonCanceler, 
    "makeAff'": makeAff$prime, 
    makeAff: makeAff, 
    "liftEff'": liftEff$prime, 
    launchAff: launchAff, 
    "later'": later$prime, 
    later: later, 
    forkAff: forkAff, 
    "finally": $$finally, 
    cancelWith: cancelWith, 
    cancel: cancel, 
    attempt: attempt, 
    apathize: apathize, 
    semigroupAff: semigroupAff, 
    monoidAff: monoidAff, 
    functorAff: functorAff, 
    applyAff: applyAff, 
    applicativeAff: applicativeAff, 
    bindAff: bindAff, 
    monadAff: monadAff, 
    monadEffAff: monadEffAff, 
    monadErrorAff: monadErrorAff, 
    altAff: altAff, 
    plusAff: plusAff, 
    alternativeAff: alternativeAff, 
    monadPlusAff: monadPlusAff, 
    monadRecAff: monadRecAff, 
    monadContAff: monadContAff, 
    semigroupCanceler: semigroupCanceler, 
    monoidCanceler: monoidCanceler
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff/foreign.js","Control.Alt":"/Users/maximko/Projects/mine/guppi/output/Control.Alt/index.js","Control.Alternative":"/Users/maximko/Projects/mine/guppi/output/Control.Alternative/index.js","Control.Monad.Cont.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Cont.Class/index.js","Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","Control.Monad.Eff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Class/index.js","Control.Monad.Eff.Exception":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Exception/index.js","Control.Monad.Error.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Error.Class/index.js","Control.Monad.Rec.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Rec.Class/index.js","Control.MonadPlus":"/Users/maximko/Projects/mine/guppi/output/Control.MonadPlus/index.js","Control.Plus":"/Users/maximko/Projects/mine/guppi/output/Control.Plus/index.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Function":"/Users/maximko/Projects/mine/guppi/output/Data.Function/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Cont.Class/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var MonadCont = function (__superclass_Prelude$dotMonad_0, callCC) {
    this["__superclass_Prelude.Monad_0"] = __superclass_Prelude$dotMonad_0;
    this.callCC = callCC;
};
var callCC = function (dict) {
    return dict.callCC;
};
module.exports = {
    MonadCont: MonadCont, 
    callCC: callCC
};

},{"Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Cont.Trans/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Monad_Trans = require("Control.Monad.Trans");
var Control_Monad_Eff_Class = require("Control.Monad.Eff.Class");
var Control_Monad_Cont_Class = require("Control.Monad.Cont.Class");
var Control_Monad_Reader_Class = require("Control.Monad.Reader.Class");
var Control_Monad_State_Class = require("Control.Monad.State.Class");
var ContT = function (x) {
    return x;
};
var runContT = function (_2) {
    return function (k) {
        return _2(k);
    };
};
var withContT = function (f) {
    return function (m) {
        return function (k) {
            return runContT(m)(f(k));
        };
    };
};
var monadTransContT = new Control_Monad_Trans.MonadTrans(function (__dict_Monad_0) {
    return function (m) {
        return function (k) {
            return Prelude[">>="](__dict_Monad_0["__superclass_Prelude.Bind_1"]())(m)(k);
        };
    };
});
var mapContT = function (f) {
    return function (m) {
        return function (k) {
            return f(runContT(m)(k));
        };
    };
};
var functorContT = function (__dict_Monad_6) {
    return new Prelude.Functor(function (f) {
        return function (m) {
            return function (k) {
                return runContT(m)(function (a) {
                    return k(f(a));
                });
            };
        };
    });
};
var applyContT = function (__dict_Monad_8) {
    return new Prelude.Apply(function () {
        return functorContT(__dict_Monad_8);
    }, function (f) {
        return function (v) {
            return function (k) {
                return runContT(f)(function (g) {
                    return runContT(v)(function (a) {
                        return k(g(a));
                    });
                });
            };
        };
    });
};
var bindContT = function (__dict_Monad_7) {
    return new Prelude.Bind(function () {
        return applyContT(__dict_Monad_7);
    }, function (m) {
        return function (k) {
            return function (k$prime) {
                return runContT(m)(function (a) {
                    return runContT(k(a))(k$prime);
                });
            };
        };
    });
};
var applicativeContT = function (__dict_Monad_9) {
    return new Prelude.Applicative(function () {
        return applyContT(__dict_Monad_9);
    }, function (a) {
        return function (k) {
            return k(a);
        };
    });
};
var monadContT = function (__dict_Monad_4) {
    return new Prelude.Monad(function () {
        return applicativeContT(__dict_Monad_4);
    }, function () {
        return bindContT(__dict_Monad_4);
    });
};
var monadContContT = function (__dict_Monad_5) {
    return new Control_Monad_Cont_Class.MonadCont(function () {
        return monadContT(__dict_Monad_5);
    }, function (f) {
        return function (k) {
            return runContT(f(function (a) {
                return function (_1) {
                    return k(a);
                };
            }))(k);
        };
    });
};
var monadEffContT = function (__dict_MonadEff_3) {
    return new Control_Monad_Eff_Class.MonadEff(function () {
        return monadContT(__dict_MonadEff_3["__superclass_Prelude.Monad_0"]());
    }, function (_7) {
        return Control_Monad_Trans.lift(monadTransContT)(__dict_MonadEff_3["__superclass_Prelude.Monad_0"]())(Control_Monad_Eff_Class.liftEff(__dict_MonadEff_3)(_7));
    });
};
var monadReaderContT = function (__dict_MonadReader_2) {
    return new Control_Monad_Reader_Class.MonadReader(function () {
        return monadContT(__dict_MonadReader_2["__superclass_Prelude.Monad_0"]());
    }, Control_Monad_Trans.lift(monadTransContT)(__dict_MonadReader_2["__superclass_Prelude.Monad_0"]())(Control_Monad_Reader_Class.ask(__dict_MonadReader_2)), function (f) {
        return function (c) {
            return function (k) {
                return Prelude.bind((__dict_MonadReader_2["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())(Control_Monad_Reader_Class.ask(__dict_MonadReader_2))(function (_0) {
                    return Control_Monad_Reader_Class.local(__dict_MonadReader_2)(f)(runContT(c)(function (_8) {
                        return Control_Monad_Reader_Class.local(__dict_MonadReader_2)(Prelude["const"](_0))(k(_8));
                    }));
                });
            };
        };
    });
};
var monadStateContT = function (__dict_MonadState_1) {
    return new Control_Monad_State_Class.MonadState(function () {
        return monadContT(__dict_MonadState_1["__superclass_Prelude.Monad_0"]());
    }, function (_9) {
        return Control_Monad_Trans.lift(monadTransContT)(__dict_MonadState_1["__superclass_Prelude.Monad_0"]())(Control_Monad_State_Class.state(__dict_MonadState_1)(_9));
    });
};
module.exports = {
    ContT: ContT, 
    withContT: withContT, 
    mapContT: mapContT, 
    runContT: runContT, 
    monadContContT: monadContContT, 
    functorContT: functorContT, 
    applyContT: applyContT, 
    applicativeContT: applicativeContT, 
    bindContT: bindContT, 
    monadContT: monadContT, 
    monadTransContT: monadTransContT, 
    monadEffContT: monadEffContT, 
    monadReaderContT: monadReaderContT, 
    monadStateContT: monadStateContT
};

},{"Control.Monad.Cont.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Cont.Class/index.js","Control.Monad.Eff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Class/index.js","Control.Monad.Reader.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Reader.Class/index.js","Control.Monad.State.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State.Class/index.js","Control.Monad.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Trans/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Class/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Monad_Eff = require("Control.Monad.Eff");
var MonadEff = function (__superclass_Prelude$dotMonad_0, liftEff) {
    this["__superclass_Prelude.Monad_0"] = __superclass_Prelude$dotMonad_0;
    this.liftEff = liftEff;
};
var monadEffEff = new MonadEff(function () {
    return Control_Monad_Eff.monadEff;
}, Prelude.id(Prelude.categoryFn));
var liftEff = function (dict) {
    return dict.liftEff;
};
module.exports = {
    MonadEff: MonadEff, 
    liftEff: liftEff, 
    monadEffEff: monadEffEff
};

},{"Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Exception/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Control.Monad.Eff.Exception

exports.showErrorImpl = function (err) {
  return err.stack || err.toString();
};

exports.error = function (msg) {
  return new Error(msg);
};

exports.message = function (e) {
  return e.message;
};

exports.stackImpl = function (just) {
  return function (nothing) {
    return function (e) {
      return e.stack ? just(e.stack) : nothing;
    };
  };
};

exports.throwException = function (e) {
  return function () {
    throw e;
  };
};

exports.catchException = function (c) {
  return function (t) {
    return function () {
      try {
        return t();
      } catch (e) {
        if (e instanceof Error || Object.prototype.toString.call(e) === "[object Error]") {
          return c(e)();
        } else {
          return c(new Error(e.toString()))();
        }
      }
    };
  };
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Exception/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Data_Maybe = require("Data.Maybe");
var Control_Monad_Eff = require("Control.Monad.Eff");
var $$throw = function (_0) {
    return $foreign.throwException($foreign.error(_0));
};
var stack = $foreign.stackImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var showError = new Prelude.Show($foreign.showErrorImpl);
module.exports = {
    "throw": $$throw, 
    stack: stack, 
    showError: showError, 
    catchException: $foreign.catchException, 
    throwException: $foreign.throwException, 
    message: $foreign.message, 
    error: $foreign.error
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Exception/foreign.js","Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Unsafe/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Control.Monad.Eff.Unsafe

exports.unsafeInterleaveEff = function (f) {
  return f;
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Unsafe/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Control_Monad_Eff = require("Control.Monad.Eff");
var unsafePerformEff = function (_0) {
    return Control_Monad_Eff.runPure($foreign.unsafeInterleaveEff(_0));
};
module.exports = {
    unsafePerformEff: unsafePerformEff, 
    unsafeInterleaveEff: $foreign.unsafeInterleaveEff
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Unsafe/foreign.js","Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Control.Monad.Eff

exports.returnE = function (a) {
  return function () {
    return a;
  };
};

exports.bindE = function (a) {
  return function (f) {
    return function () {
      return f(a())();
    };
  };
};

exports.runPure = function (f) {
  return f();
};

exports.untilE = function (f) {
  return function () {
    while (!f());
    return {};
  };
};

exports.whileE = function (f) {
  return function (a) {
    return function () {
      while (f()) {
        a();
      }
      return {};
    };
  };
};

exports.forE = function (lo) {
  return function (hi) {
    return function (f) {
      return function () {
        for (var i = lo; i < hi; i++) {
          f(i)();
        }
      };
    };
  };
};

exports.foreachE = function (as) {
  return function (f) {
    return function () {
      for (var i = 0, l = as.length; i < l; i++) {
        f(as[i])();
      }
    };
  };
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var monadEff = new Prelude.Monad(function () {
    return applicativeEff;
}, function () {
    return bindEff;
});
var bindEff = new Prelude.Bind(function () {
    return applyEff;
}, $foreign.bindE);
var applyEff = new Prelude.Apply(function () {
    return functorEff;
}, Prelude.ap(monadEff));
var applicativeEff = new Prelude.Applicative(function () {
    return applyEff;
}, $foreign.returnE);
var functorEff = new Prelude.Functor(Prelude.liftA1(applicativeEff));
module.exports = {
    functorEff: functorEff, 
    applyEff: applyEff, 
    applicativeEff: applicativeEff, 
    bindEff: bindEff, 
    monadEff: monadEff, 
    foreachE: $foreign.foreachE, 
    forE: $foreign.forE, 
    whileE: $foreign.whileE, 
    untilE: $foreign.untilE, 
    runPure: $foreign.runPure
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/foreign.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Error.Class/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Maybe = require("Data.Maybe");
var Data_Either = require("Data.Either");
var MonadError = function (__superclass_Prelude$dotMonad_0, catchError, throwError) {
    this["__superclass_Prelude.Monad_0"] = __superclass_Prelude$dotMonad_0;
    this.catchError = catchError;
    this.throwError = throwError;
};
var throwError = function (dict) {
    return dict.throwError;
};
var monadErrorMaybe = new MonadError(function () {
    return Data_Maybe.monadMaybe;
}, function (_1) {
    return function (f) {
        if (_1 instanceof Data_Maybe.Nothing) {
            return f(Prelude.unit);
        };
        if (_1 instanceof Data_Maybe.Just) {
            return new Data_Maybe.Just(_1.value0);
        };
        throw new Error("Failed pattern match at Control.Monad.Error.Class line 51, column 1 - line 54, column 32: " + [ _1.constructor.name, f.constructor.name ]);
    };
}, Prelude["const"](Data_Maybe.Nothing.value));
var monadErrorEither = new MonadError(function () {
    return Data_Either.monadEither;
}, function (_0) {
    return function (h) {
        if (_0 instanceof Data_Either.Left) {
            return h(_0.value0);
        };
        if (_0 instanceof Data_Either.Right) {
            return new Data_Either.Right(_0.value0);
        };
        throw new Error("Failed pattern match at Control.Monad.Error.Class line 46, column 1 - line 51, column 1: " + [ _0.constructor.name, h.constructor.name ]);
    };
}, Data_Either.Left.create);
var catchError = function (dict) {
    return dict.catchError;
};
var catchJust = function (__dict_MonadError_0) {
    return function (p) {
        return function (act) {
            return function (handler) {
                var handle = function (e) {
                    var _9 = p(e);
                    if (_9 instanceof Data_Maybe.Nothing) {
                        return throwError(__dict_MonadError_0)(e);
                    };
                    if (_9 instanceof Data_Maybe.Just) {
                        return handler(_9.value0);
                    };
                    throw new Error("Failed pattern match at Control.Monad.Error.Class line 41, column 3 - line 46, column 1: " + [ _9.constructor.name ]);
                };
                return catchError(__dict_MonadError_0)(act)(handle);
            };
        };
    };
};
module.exports = {
    MonadError: MonadError, 
    catchJust: catchJust, 
    catchError: catchError, 
    throwError: throwError, 
    monadErrorEither: monadErrorEither, 
    monadErrorMaybe: monadErrorMaybe
};

},{"Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Except.Trans/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Tuple = require("Data.Tuple");
var Data_Either = require("Data.Either");
var Data_Monoid = require("Data.Monoid");
var Control_Alt = require("Control.Alt");
var Control_Alternative = require("Control.Alternative");
var Control_Monad_Cont_Class = require("Control.Monad.Cont.Class");
var Control_Monad_Eff_Class = require("Control.Monad.Eff.Class");
var Control_Monad_Error_Class = require("Control.Monad.Error.Class");
var Control_Monad_Reader_Class = require("Control.Monad.Reader.Class");
var Control_Monad_Rec_Class = require("Control.Monad.Rec.Class");
var Control_Monad_RWS_Class = require("Control.Monad.RWS.Class");
var Control_Monad_State_Class = require("Control.Monad.State.Class");
var Control_Monad_Trans = require("Control.Monad.Trans");
var Control_Monad_Writer_Class = require("Control.Monad.Writer.Class");
var Control_MonadPlus = require("Control.MonadPlus");
var Control_Plus = require("Control.Plus");
var ExceptT = function (x) {
    return x;
};
var runExceptT = function (_6) {
    return _6;
};
var withExceptT = function (__dict_Functor_0) {
    return function (f) {
        var mapLeft = function (f_1) {
            return function (_7) {
                if (_7 instanceof Data_Either.Right) {
                    return new Data_Either.Right(_7.value0);
                };
                if (_7 instanceof Data_Either.Left) {
                    return new Data_Either.Left(f_1(_7.value0));
                };
                throw new Error("Failed pattern match at Control.Monad.Except.Trans line 43, column 3 - line 44, column 3: " + [ f_1.constructor.name, _7.constructor.name ]);
            };
        };
        return function (_42) {
            return ExceptT(Prelude["<$>"](__dict_Functor_0)(mapLeft(f))(runExceptT(_42)));
        };
    };
};
var monadTransExceptT = new Control_Monad_Trans.MonadTrans(function (__dict_Monad_3) {
    return function (m) {
        return ExceptT(Prelude.bind(__dict_Monad_3["__superclass_Prelude.Bind_1"]())(m)(function (_3) {
            return Prelude["return"](__dict_Monad_3["__superclass_Prelude.Applicative_0"]())(new Data_Either.Right(_3));
        }));
    };
});
var mapExceptT = function (f) {
    return function (m) {
        return f(runExceptT(m));
    };
};
var functorExceptT = function (__dict_Functor_16) {
    return new Prelude.Functor(function (f) {
        return mapExceptT(Prelude["<$>"](__dict_Functor_16)(Prelude["<$>"](Data_Either.functorEither)(f)));
    });
};
var applyExceptT = function (__dict_Apply_18) {
    return new Prelude.Apply(function () {
        return functorExceptT(__dict_Apply_18["__superclass_Prelude.Functor_0"]());
    }, function (_8) {
        return function (_9) {
            var f$prime = Prelude["<$>"](__dict_Apply_18["__superclass_Prelude.Functor_0"]())(Prelude["<*>"](Data_Either.applyEither))(_8);
            var x$prime = Prelude["<*>"](__dict_Apply_18)(f$prime)(_9);
            return x$prime;
        };
    });
};
var bindExceptT = function (__dict_Monad_17) {
    return new Prelude.Bind(function () {
        return applyExceptT((__dict_Monad_17["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]());
    }, function (m) {
        return function (k) {
            return Prelude[">>="](__dict_Monad_17["__superclass_Prelude.Bind_1"]())(runExceptT(m))(Data_Either.either(function (_43) {
                return Prelude["return"](__dict_Monad_17["__superclass_Prelude.Applicative_0"]())(Data_Either.Left.create(_43));
            })(function (_44) {
                return runExceptT(k(_44));
            }));
        };
    });
};
var applicativeExceptT = function (__dict_Applicative_19) {
    return new Prelude.Applicative(function () {
        return applyExceptT(__dict_Applicative_19["__superclass_Prelude.Apply_0"]());
    }, function (_45) {
        return ExceptT(Prelude.pure(__dict_Applicative_19)(Data_Either.Right.create(_45)));
    });
};
var monadExceptT = function (__dict_Monad_10) {
    return new Prelude.Monad(function () {
        return applicativeExceptT(__dict_Monad_10["__superclass_Prelude.Applicative_0"]());
    }, function () {
        return bindExceptT(__dict_Monad_10);
    });
};
var monadContExceptT = function (__dict_MonadCont_13) {
    return new Control_Monad_Cont_Class.MonadCont(function () {
        return monadExceptT(__dict_MonadCont_13["__superclass_Prelude.Monad_0"]());
    }, function (f) {
        return ExceptT(Control_Monad_Cont_Class.callCC(__dict_MonadCont_13)(function (c) {
            return runExceptT(f(function (a) {
                return ExceptT(c(new Data_Either.Right(a)));
            }));
        }));
    });
};
var monadEffExceptT = function (__dict_MonadEff_12) {
    return new Control_Monad_Eff_Class.MonadEff(function () {
        return monadExceptT(__dict_MonadEff_12["__superclass_Prelude.Monad_0"]());
    }, function (_46) {
        return Control_Monad_Trans.lift(monadTransExceptT)(__dict_MonadEff_12["__superclass_Prelude.Monad_0"]())(Control_Monad_Eff_Class.liftEff(__dict_MonadEff_12)(_46));
    });
};
var monadErrorExceptT = function (__dict_Monad_11) {
    return new Control_Monad_Error_Class.MonadError(function () {
        return monadExceptT(__dict_Monad_11);
    }, function (m) {
        return function (handler) {
            return Prelude[">>="](__dict_Monad_11["__superclass_Prelude.Bind_1"]())(runExceptT(m))(Data_Either.either(function (_47) {
                return runExceptT(handler(_47));
            })(function (_48) {
                return Prelude.pure(__dict_Monad_11["__superclass_Prelude.Applicative_0"]())(Data_Either.Right.create(_48));
            }));
        };
    }, function (_49) {
        return ExceptT(Prelude.pure(__dict_Monad_11["__superclass_Prelude.Applicative_0"]())(Data_Either.Left.create(_49)));
    });
};
var monadReaderExceptT = function (__dict_MonadReader_14) {
    return new Control_Monad_Reader_Class.MonadReader(function () {
        return monadExceptT(__dict_MonadReader_14["__superclass_Prelude.Monad_0"]());
    }, Control_Monad_Trans.lift(monadTransExceptT)(__dict_MonadReader_14["__superclass_Prelude.Monad_0"]())(Control_Monad_Reader_Class.ask(__dict_MonadReader_14)), function (f) {
        return mapExceptT(Control_Monad_Reader_Class.local(__dict_MonadReader_14)(f));
    });
};
var monadRecExceptT = function (__dict_MonadRec_5) {
    return new Control_Monad_Rec_Class.MonadRec(function () {
        return monadExceptT(__dict_MonadRec_5["__superclass_Prelude.Monad_0"]());
    }, function (f) {
        return function (_50) {
            return ExceptT(Control_Monad_Rec_Class.tailRecM(__dict_MonadRec_5)(function (a) {
                return Prelude.bind((__dict_MonadRec_5["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())(runExceptT(f(a)))(function (_0) {
                    return Prelude["return"]((__dict_MonadRec_5["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Applicative_0"]())((function () {
                        if (_0 instanceof Data_Either.Left) {
                            return new Data_Either.Right(new Data_Either.Left(_0.value0));
                        };
                        if (_0 instanceof Data_Either.Right && _0.value0 instanceof Data_Either.Left) {
                            return new Data_Either.Left(_0.value0.value0);
                        };
                        if (_0 instanceof Data_Either.Right && _0.value0 instanceof Data_Either.Right) {
                            return new Data_Either.Right(new Data_Either.Right(_0.value0.value0));
                        };
                        throw new Error("Failed pattern match at Control.Monad.Except.Trans line 68, column 1 - line 76, column 1: " + [ _0.constructor.name ]);
                    })());
                });
            })(_50));
        };
    });
};
var monadStateExceptT = function (__dict_MonadState_4) {
    return new Control_Monad_State_Class.MonadState(function () {
        return monadExceptT(__dict_MonadState_4["__superclass_Prelude.Monad_0"]());
    }, function (f) {
        return Control_Monad_Trans.lift(monadTransExceptT)(__dict_MonadState_4["__superclass_Prelude.Monad_0"]())(Control_Monad_State_Class.state(__dict_MonadState_4)(f));
    });
};
var monadWriterExceptT = function (__dict_MonadWriter_15) {
    return new Control_Monad_Writer_Class.MonadWriter(function () {
        return monadExceptT(__dict_MonadWriter_15["__superclass_Prelude.Monad_0"]());
    }, mapExceptT(function (m) {
        return Prelude.bind((__dict_MonadWriter_15["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())(Control_Monad_Writer_Class.listen(__dict_MonadWriter_15)(m))(function (_4) {
            return Prelude["return"]((__dict_MonadWriter_15["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Applicative_0"]())(Prelude["<$>"](Data_Either.functorEither)(function (r) {
                return new Data_Tuple.Tuple(r, _4.value1);
            })(_4.value0));
        });
    }), mapExceptT(function (m) {
        return Control_Monad_Writer_Class.pass(__dict_MonadWriter_15)(Prelude.bind((__dict_MonadWriter_15["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())(m)(function (_5) {
            return Prelude["return"]((__dict_MonadWriter_15["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Applicative_0"]())((function () {
                if (_5 instanceof Data_Either.Left) {
                    return new Data_Tuple.Tuple(new Data_Either.Left(_5.value0), Prelude.id(Prelude.categoryFn));
                };
                if (_5 instanceof Data_Either.Right) {
                    return new Data_Tuple.Tuple(new Data_Either.Right(_5.value0.value0), _5.value0.value1);
                };
                throw new Error("Failed pattern match at Control.Monad.Except.Trans line 116, column 1 - line 127, column 1: " + [ _5.constructor.name ]);
            })());
        }));
    }), function (wd) {
        return Control_Monad_Trans.lift(monadTransExceptT)(__dict_MonadWriter_15["__superclass_Prelude.Monad_0"]())(Control_Monad_Writer_Class.writer(__dict_MonadWriter_15)(wd));
    });
};
var monadRWSExceptT = function (__dict_Monoid_6) {
    return function (__dict_MonadRWS_7) {
        return new Control_Monad_RWS_Class.MonadRWS(function () {
            return monadReaderExceptT(__dict_MonadRWS_7["__superclass_Control.Monad.Reader.Class.MonadReader_1"]());
        }, function () {
            return monadStateExceptT(__dict_MonadRWS_7["__superclass_Control.Monad.State.Class.MonadState_3"]());
        }, function () {
            return monadWriterExceptT(__dict_MonadRWS_7["__superclass_Control.Monad.Writer.Class.MonadWriter_2"]());
        }, function () {
            return __dict_Monoid_6;
        });
    };
};
var altExceptT = function (__dict_Semigroup_22) {
    return function (__dict_Monad_23) {
        return new Control_Alt.Alt(function () {
            return functorExceptT(((__dict_Monad_23["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]());
        }, function (m) {
            return function (n) {
                return ExceptT(Prelude.bind(__dict_Monad_23["__superclass_Prelude.Bind_1"]())(runExceptT(m))(function (_2) {
                    if (_2 instanceof Data_Either.Right) {
                        return Prelude.pure(__dict_Monad_23["__superclass_Prelude.Applicative_0"]())(new Data_Either.Right(_2.value0));
                    };
                    if (_2 instanceof Data_Either.Left) {
                        return Prelude.bind(__dict_Monad_23["__superclass_Prelude.Bind_1"]())(runExceptT(n))(function (_1) {
                            if (_1 instanceof Data_Either.Right) {
                                return Prelude.pure(__dict_Monad_23["__superclass_Prelude.Applicative_0"]())(new Data_Either.Right(_1.value0));
                            };
                            if (_1 instanceof Data_Either.Left) {
                                return Prelude.pure(__dict_Monad_23["__superclass_Prelude.Applicative_0"]())(new Data_Either.Left(Prelude["<>"](__dict_Semigroup_22)(_2.value0)(_1.value0)));
                            };
                            throw new Error("Failed pattern match at Control.Monad.Except.Trans line 76, column 1 - line 87, column 1: " + [ _1.constructor.name ]);
                        });
                    };
                    throw new Error("Failed pattern match at Control.Monad.Except.Trans line 76, column 1 - line 87, column 1: " + [ _2.constructor.name ]);
                }));
            };
        });
    };
};
var plusExceptT = function (__dict_Monoid_1) {
    return function (__dict_Monad_2) {
        return new Control_Plus.Plus(function () {
            return altExceptT(__dict_Monoid_1["__superclass_Prelude.Semigroup_0"]())(__dict_Monad_2);
        }, Control_Monad_Error_Class.throwError(monadErrorExceptT(__dict_Monad_2))(Data_Monoid.mempty(__dict_Monoid_1)));
    };
};
var alternativeExceptT = function (__dict_Monoid_20) {
    return function (__dict_Monad_21) {
        return new Control_Alternative.Alternative(function () {
            return plusExceptT(__dict_Monoid_20)(__dict_Monad_21);
        }, function () {
            return applicativeExceptT(__dict_Monad_21["__superclass_Prelude.Applicative_0"]());
        });
    };
};
var monadPlusExceptT = function (__dict_Monoid_8) {
    return function (__dict_Monad_9) {
        return new Control_MonadPlus.MonadPlus(function () {
            return alternativeExceptT(__dict_Monoid_8)(__dict_Monad_9);
        }, function () {
            return monadExceptT(__dict_Monad_9);
        });
    };
};
module.exports = {
    ExceptT: ExceptT, 
    mapExceptT: mapExceptT, 
    withExceptT: withExceptT, 
    runExceptT: runExceptT, 
    functorExceptT: functorExceptT, 
    applyExceptT: applyExceptT, 
    applicativeExceptT: applicativeExceptT, 
    bindExceptT: bindExceptT, 
    monadExceptT: monadExceptT, 
    monadRecExceptT: monadRecExceptT, 
    altExceptT: altExceptT, 
    plusExceptT: plusExceptT, 
    alternativeExceptT: alternativeExceptT, 
    monadPlusExceptT: monadPlusExceptT, 
    monadTransExceptT: monadTransExceptT, 
    monadEffExceptT: monadEffExceptT, 
    monadContExceptT: monadContExceptT, 
    monadErrorExceptT: monadErrorExceptT, 
    monadReaderExceptT: monadReaderExceptT, 
    monadStateExceptT: monadStateExceptT, 
    monadWriterExceptT: monadWriterExceptT, 
    monadRWSExceptT: monadRWSExceptT
};

},{"Control.Alt":"/Users/maximko/Projects/mine/guppi/output/Control.Alt/index.js","Control.Alternative":"/Users/maximko/Projects/mine/guppi/output/Control.Alternative/index.js","Control.Monad.Cont.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Cont.Class/index.js","Control.Monad.Eff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Class/index.js","Control.Monad.Error.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Error.Class/index.js","Control.Monad.RWS.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.RWS.Class/index.js","Control.Monad.Reader.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Reader.Class/index.js","Control.Monad.Rec.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Rec.Class/index.js","Control.Monad.State.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State.Class/index.js","Control.Monad.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Trans/index.js","Control.Monad.Writer.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Writer.Class/index.js","Control.MonadPlus":"/Users/maximko/Projects/mine/guppi/output/Control.MonadPlus/index.js","Control.Plus":"/Users/maximko/Projects/mine/guppi/output/Control.Plus/index.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Free.Trans/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Exists = require("Data.Exists");
var Data_Either = require("Data.Either");
var Data_Bifunctor = require("Data.Bifunctor");
var Control_Bind = require("Control.Bind");
var Control_Monad_Rec_Class = require("Control.Monad.Rec.Class");
var Control_Monad_Trans = require("Control.Monad.Trans");
var Bound = (function () {
    function Bound(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Bound.create = function (value0) {
        return function (value1) {
            return new Bound(value0, value1);
        };
    };
    return Bound;
})();
var FreeT = (function () {
    function FreeT(value0) {
        this.value0 = value0;
    };
    FreeT.create = function (value0) {
        return new FreeT(value0);
    };
    return FreeT;
})();
var Bind = (function () {
    function Bind(value0) {
        this.value0 = value0;
    };
    Bind.create = function (value0) {
        return new Bind(value0);
    };
    return Bind;
})();
var monadTransFreeT = function (__dict_Functor_4) {
    return new Control_Monad_Trans.MonadTrans(function (__dict_Monad_5) {
        return function (ma) {
            return new FreeT(function (_11) {
                return Prelude.map(((__dict_Monad_5["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Either.Left.create)(ma);
            });
        };
    });
};
var freeT = FreeT.create;
var bound = function (m) {
    return function (f) {
        return new Bind(Data_Exists.mkExists(new Bound(m, f)));
    };
};
var functorFreeT = function (__dict_Functor_12) {
    return function (__dict_Functor_13) {
        return new Prelude.Functor(function (f) {
            return function (_17) {
                if (_17 instanceof FreeT) {
                    return new FreeT(function (_5) {
                        return Prelude.map(__dict_Functor_13)(Data_Bifunctor.bimap(Data_Either.bifunctorEither)(f)(Prelude.map(__dict_Functor_12)(Prelude.map(functorFreeT(__dict_Functor_12)(__dict_Functor_13))(f))))(_17.value0(Prelude.unit));
                    });
                };
                if (_17 instanceof Bind) {
                    return Data_Exists.runExists(function (_6) {
                        return bound(_6.value0)(function (_72) {
                            return Prelude.map(functorFreeT(__dict_Functor_12)(__dict_Functor_13))(f)(_6.value1(_72));
                        });
                    })(_17.value0);
                };
                throw new Error("Failed pattern match: " + [ f.constructor.name, _17.constructor.name ]);
            };
        });
    };
};
var bimapFreeT = function (__dict_Functor_16) {
    return function (__dict_Functor_17) {
        return function (nf) {
            return function (nm) {
                return function (_15) {
                    if (_15 instanceof Bind) {
                        return Data_Exists.runExists(function (_13) {
                            return bound(function (_73) {
                                return bimapFreeT(__dict_Functor_16)(__dict_Functor_17)(nf)(nm)(_13.value0(_73));
                            })(function (_74) {
                                return bimapFreeT(__dict_Functor_16)(__dict_Functor_17)(nf)(nm)(_13.value1(_74));
                            });
                        })(_15.value0);
                    };
                    if (_15 instanceof FreeT) {
                        return new FreeT(function (_14) {
                            return Prelude["<$>"](__dict_Functor_17)(Prelude.map(Data_Either.functorEither)(function (_75) {
                                return nf(Prelude.map(__dict_Functor_16)(bimapFreeT(__dict_Functor_16)(__dict_Functor_17)(nf)(nm))(_75));
                            }))(nm(_15.value0(Prelude.unit)));
                        });
                    };
                    throw new Error("Failed pattern match: " + [ nf.constructor.name, nm.constructor.name, _15.constructor.name ]);
                };
            };
        };
    };
};
var hoistFreeT = function (__dict_Functor_18) {
    return function (__dict_Functor_19) {
        return bimapFreeT(__dict_Functor_18)(__dict_Functor_19)(Prelude.id(Prelude.categoryFn));
    };
};
var interpret = function (__dict_Functor_20) {
    return function (__dict_Functor_21) {
        return function (nf) {
            return bimapFreeT(__dict_Functor_20)(__dict_Functor_21)(nf)(Prelude.id(Prelude.categoryFn));
        };
    };
};
var monadFreeT = function (__dict_Functor_8) {
    return function (__dict_Monad_9) {
        return new Prelude.Monad(function () {
            return applicativeFreeT(__dict_Functor_8)(__dict_Monad_9);
        }, function () {
            return bindFreeT(__dict_Functor_8)(__dict_Monad_9);
        });
    };
};
var bindFreeT = function (__dict_Functor_14) {
    return function (__dict_Monad_15) {
        return new Prelude.Bind(function () {
            return applyFreeT(__dict_Functor_14)(__dict_Monad_15);
        }, function (_18) {
            return function (f) {
                if (_18 instanceof Bind) {
                    return Data_Exists.runExists(function (_9) {
                        return bound(_9.value0)(function (x) {
                            return bound(function (_8) {
                                return _9.value1(x);
                            })(f);
                        });
                    })(_18.value0);
                };
                return bound(function (_10) {
                    return _18;
                })(f);
            };
        });
    };
};
var applyFreeT = function (__dict_Functor_22) {
    return function (__dict_Monad_23) {
        return new Prelude.Apply(function () {
            return functorFreeT(__dict_Functor_22)(((__dict_Monad_23["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]());
        }, Prelude.ap(monadFreeT(__dict_Functor_22)(__dict_Monad_23)));
    };
};
var applicativeFreeT = function (__dict_Functor_24) {
    return function (__dict_Monad_25) {
        return new Prelude.Applicative(function () {
            return applyFreeT(__dict_Functor_24)(__dict_Monad_25);
        }, function (a) {
            return new FreeT(function (_7) {
                return Prelude.pure(__dict_Monad_25["__superclass_Prelude.Applicative_0"]())(new Data_Either.Left(a));
            });
        });
    };
};
var liftFreeT = function (__dict_Functor_10) {
    return function (__dict_Monad_11) {
        return function (fa) {
            return new FreeT(function (_12) {
                return Prelude["return"](__dict_Monad_11["__superclass_Prelude.Applicative_0"]())(new Data_Either.Right(Prelude.map(__dict_Functor_10)(Prelude.pure(applicativeFreeT(__dict_Functor_10)(__dict_Monad_11)))(fa)));
            });
        };
    };
};
var resume = function (__dict_Functor_0) {
    return function (__dict_MonadRec_1) {
        var go = function (_16) {
            if (_16 instanceof FreeT) {
                return Prelude.map((((__dict_MonadRec_1["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Either.Right.create)(_16.value0(Prelude.unit));
            };
            if (_16 instanceof Bind) {
                return Data_Exists.runExists(function (_4) {
                    var _51 = _4.value0(Prelude.unit);
                    if (_51 instanceof FreeT) {
                        return Prelude.bind((__dict_MonadRec_1["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())(_51.value0(Prelude.unit))(function (_0) {
                            if (_0 instanceof Data_Either.Left) {
                                return Prelude["return"]((__dict_MonadRec_1["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Applicative_0"]())(new Data_Either.Left(_4.value1(_0.value0)));
                            };
                            if (_0 instanceof Data_Either.Right) {
                                return Prelude["return"]((__dict_MonadRec_1["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Applicative_0"]())(new Data_Either.Right(new Data_Either.Right(Prelude.map(__dict_Functor_0)(function (h) {
                                    return Prelude[">>="](bindFreeT(__dict_Functor_0)(__dict_MonadRec_1["__superclass_Prelude.Monad_0"]()))(h)(_4.value1);
                                })(_0.value0))));
                            };
                            throw new Error("Failed pattern match at Control.Monad.Free.Trans line 43, column 3 - line 44, column 3: " + [ _0.constructor.name ]);
                        });
                    };
                    if (_51 instanceof Bind) {
                        return Data_Exists.runExists(function (_3) {
                            return Prelude["return"]((__dict_MonadRec_1["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Applicative_0"]())(new Data_Either.Left(Prelude.bind(bindFreeT(__dict_Functor_0)(__dict_MonadRec_1["__superclass_Prelude.Monad_0"]()))(_3.value0(Prelude.unit))(function (z) {
                                return Prelude[">>="](bindFreeT(__dict_Functor_0)(__dict_MonadRec_1["__superclass_Prelude.Monad_0"]()))(_3.value1(z))(_4.value1);
                            })));
                        })(_51.value0);
                    };
                    throw new Error("Failed pattern match at Control.Monad.Free.Trans line 43, column 3 - line 44, column 3: " + [ _51.constructor.name ]);
                })(_16.value0);
            };
            throw new Error("Failed pattern match at Control.Monad.Free.Trans line 43, column 3 - line 44, column 3: " + [ _16.constructor.name ]);
        };
        return Control_Monad_Rec_Class.tailRecM(__dict_MonadRec_1)(go);
    };
};
var runFreeT = function (__dict_Functor_2) {
    return function (__dict_MonadRec_3) {
        return function (interp) {
            var go = function (_19) {
                if (_19 instanceof Data_Either.Left) {
                    return Prelude["return"]((__dict_MonadRec_3["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Applicative_0"]())(new Data_Either.Right(_19.value0));
                };
                if (_19 instanceof Data_Either.Right) {
                    return Prelude.bind((__dict_MonadRec_3["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())(interp(_19.value0))(function (_2) {
                        return Prelude["return"]((__dict_MonadRec_3["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Applicative_0"]())(new Data_Either.Left(_2));
                    });
                };
                throw new Error("Failed pattern match at Control.Monad.Free.Trans line 103, column 3 - line 104, column 3: " + [ _19.constructor.name ]);
            };
            return Control_Monad_Rec_Class.tailRecM(__dict_MonadRec_3)(Control_Bind["<=<"]((__dict_MonadRec_3["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())(go)(resume(__dict_Functor_2)(__dict_MonadRec_3)));
        };
    };
};
var monadRecFreeT = function (__dict_Functor_6) {
    return function (__dict_Monad_7) {
        return new Control_Monad_Rec_Class.MonadRec(function () {
            return monadFreeT(__dict_Functor_6)(__dict_Monad_7);
        }, function (f) {
            var go = function (s) {
                return Prelude.bind(bindFreeT(__dict_Functor_6)(__dict_Monad_7))(f(s))(function (_1) {
                    if (_1 instanceof Data_Either.Left) {
                        return go(_1.value0);
                    };
                    if (_1 instanceof Data_Either.Right) {
                        return Prelude["return"](applicativeFreeT(__dict_Functor_6)(__dict_Monad_7))(_1.value0);
                    };
                    throw new Error("Failed pattern match at Control.Monad.Free.Trans line 73, column 1 - line 83, column 1: " + [ _1.constructor.name ]);
                });
            };
            return go;
        });
    };
};
module.exports = {
    runFreeT: runFreeT, 
    resume: resume, 
    bimapFreeT: bimapFreeT, 
    interpret: interpret, 
    hoistFreeT: hoistFreeT, 
    liftFreeT: liftFreeT, 
    freeT: freeT, 
    functorFreeT: functorFreeT, 
    applyFreeT: applyFreeT, 
    applicativeFreeT: applicativeFreeT, 
    bindFreeT: bindFreeT, 
    monadFreeT: monadFreeT, 
    monadTransFreeT: monadTransFreeT, 
    monadRecFreeT: monadRecFreeT
};

},{"Control.Bind":"/Users/maximko/Projects/mine/guppi/output/Control.Bind/index.js","Control.Monad.Rec.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Rec.Class/index.js","Control.Monad.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Trans/index.js","Data.Bifunctor":"/Users/maximko/Projects/mine/guppi/output/Data.Bifunctor/index.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Exists":"/Users/maximko/Projects/mine/guppi/output/Data.Exists/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Free/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Monad_Rec_Class = require("Control.Monad.Rec.Class");
var Control_Monad_Trans = require("Control.Monad.Trans");
var Data_CatList = require("Data.CatList");
var Data_Either = require("Data.Either");
var Data_Identity = require("Data.Identity");
var Data_Inject = require("Data.Inject");
var Data_Maybe = require("Data.Maybe");
var Data_NaturalTransformation = require("Data.NaturalTransformation");
var Data_Tuple = require("Data.Tuple");
var Unsafe_Coerce = require("Unsafe.Coerce");
var ExpF = function (x) {
    return x;
};
var Free = (function () {
    function Free(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Free.create = function (value0) {
        return function (value1) {
            return new Free(value0, value1);
        };
    };
    return Free;
})();
var Return = (function () {
    function Return(value0) {
        this.value0 = value0;
    };
    Return.create = function (value0) {
        return new Return(value0);
    };
    return Return;
})();
var Bind = (function () {
    function Bind(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Bind.create = function (value0) {
        return function (value1) {
            return new Bind(value0, value1);
        };
    };
    return Bind;
})();
var toView = function (__copy__0) {
    var _0 = __copy__0;
    tco: while (true) {
        var runExpF = function (_3) {
            return _3;
        };
        var concatF = function (_2) {
            return function (r) {
                return new Free(_2.value0, Prelude["<>"](Data_CatList.semigroupCatList)(_2.value1)(r));
            };
        };
        if (_0.value0 instanceof Return) {
            var _11 = Data_CatList.uncons(_0.value1);
            if (_11 instanceof Data_Maybe.Nothing) {
                return new Return(Unsafe_Coerce.unsafeCoerce(_0.value0.value0));
            };
            if (_11 instanceof Data_Maybe.Just) {
                var __tco__0 = Unsafe_Coerce.unsafeCoerce(concatF(runExpF(_11.value0.value0)(_0.value0.value0))(_11.value0.value1));
                _0 = __tco__0;
                continue tco;
            };
            throw new Error("Failed pattern match: " + [ _11.constructor.name ]);
        };
        if (_0.value0 instanceof Bind) {
            return new Bind(_0.value0.value0, function (a) {
                return Unsafe_Coerce.unsafeCoerce(concatF(_0.value0.value1(a))(_0.value1));
            });
        };
        throw new Error("Failed pattern match: " + [ _0.value0.constructor.name ]);
    };
};
var runFreeM = function (__dict_Functor_0) {
    return function (__dict_MonadRec_1) {
        return function (k) {
            var go = function (f) {
                var _20 = toView(f);
                if (_20 instanceof Return) {
                    return Prelude["<$>"]((((__dict_MonadRec_1["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Either.Right.create)(Prelude.pure((__dict_MonadRec_1["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Applicative_0"]())(_20.value0));
                };
                if (_20 instanceof Bind) {
                    return Prelude["<$>"]((((__dict_MonadRec_1["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Either.Left.create)(k(Prelude["<$>"](__dict_Functor_0)(_20.value1)(_20.value0)));
                };
                throw new Error("Failed pattern match at Control.Monad.Free line 123, column 3 - line 124, column 3: " + [ _20.constructor.name ]);
            };
            return Control_Monad_Rec_Class.tailRecM(__dict_MonadRec_1)(go);
        };
    };
};
var runFree = function (__dict_Functor_2) {
    return function (k) {
        return function (_32) {
            return Data_Identity.runIdentity(runFreeM(__dict_Functor_2)(Control_Monad_Rec_Class.monadRecIdentity)(function (_33) {
                return Data_Identity.Identity(k(_33));
            })(_32));
        };
    };
};
var fromView = function (f) {
    return new Free(Unsafe_Coerce.unsafeCoerce(f), Data_CatList.empty);
};
var suspendF = function (__dict_Applicative_4) {
    return function (f) {
        return fromView(new Bind(Unsafe_Coerce.unsafeCoerce(Prelude.pure(__dict_Applicative_4)(f)), function (_34) {
            return Prelude.id(Prelude.categoryFn)(Unsafe_Coerce.unsafeCoerce(_34));
        }));
    };
};
var freeMonad = new Prelude.Monad(function () {
    return freeApplicative;
}, function () {
    return freeBind;
});
var freeFunctor = new Prelude.Functor(function (k) {
    return function (f) {
        return Prelude[">>="](freeBind)(f)(function (_35) {
            return Prelude["return"](freeApplicative)(k(_35));
        });
    };
});
var freeBind = new Prelude.Bind(function () {
    return freeApply;
}, function (_1) {
    return function (k) {
        return new Free(_1.value0, Data_CatList.snoc(_1.value1)(Unsafe_Coerce.unsafeCoerce(k)));
    };
});
var freeApply = new Prelude.Apply(function () {
    return freeFunctor;
}, Prelude.ap(freeMonad));
var freeApplicative = new Prelude.Applicative(function () {
    return freeApply;
}, function (_36) {
    return fromView(Return.create(_36));
});
var freeMonadRec = new Control_Monad_Rec_Class.MonadRec(function () {
    return freeMonad;
}, function (k) {
    return function (a) {
        return Prelude[">>="](freeBind)(k(a))(Data_Either.either(Control_Monad_Rec_Class.tailRecM(freeMonadRec)(k))(Prelude.pure(freeApplicative)));
    };
});
var liftF = function (f) {
    return fromView(new Bind(Unsafe_Coerce.unsafeCoerce(f), function (_37) {
        return Prelude.pure(freeApplicative)(Unsafe_Coerce.unsafeCoerce(_37));
    }));
};
var freeMonadTrans = new Control_Monad_Trans.MonadTrans(function (__dict_Monad_5) {
    return liftF;
});
var liftFI = function (__dict_Inject_3) {
    return function (fa) {
        return liftF(Data_Inject.inj(__dict_Inject_3)(fa));
    };
};
var foldFree = function (__dict_MonadRec_6) {
    return function (k) {
        var go = function (f) {
            var _28 = toView(f);
            if (_28 instanceof Return) {
                return Prelude["<$>"]((((__dict_MonadRec_6["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Either.Right.create)(Prelude.pure((__dict_MonadRec_6["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Applicative_0"]())(_28.value0));
            };
            if (_28 instanceof Bind) {
                return Prelude["<$>"]((((__dict_MonadRec_6["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(function (_38) {
                    return Data_Either.Left.create(_28.value1(_38));
                })(k(_28.value0));
            };
            throw new Error("Failed pattern match at Control.Monad.Free line 108, column 3 - line 109, column 3: " + [ _28.constructor.name ]);
        };
        return Control_Monad_Rec_Class.tailRecM(__dict_MonadRec_6)(go);
    };
};
var mapF = function (k) {
    return foldFree(freeMonadRec)(function (_39) {
        return liftF(k(_39));
    });
};
var injF = function (__dict_Inject_7) {
    return mapF(Data_Inject.inj(__dict_Inject_7));
};
module.exports = {
    runFreeM: runFreeM, 
    runFree: runFree, 
    foldFree: foldFree, 
    injF: injF, 
    mapF: mapF, 
    liftFI: liftFI, 
    liftF: liftF, 
    suspendF: suspendF, 
    freeFunctor: freeFunctor, 
    freeBind: freeBind, 
    freeApplicative: freeApplicative, 
    freeApply: freeApply, 
    freeMonad: freeMonad, 
    freeMonadTrans: freeMonadTrans, 
    freeMonadRec: freeMonadRec
};

},{"Control.Monad.Rec.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Rec.Class/index.js","Control.Monad.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Trans/index.js","Data.CatList":"/Users/maximko/Projects/mine/guppi/output/Data.CatList/index.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Identity":"/Users/maximko/Projects/mine/guppi/output/Data.Identity/index.js","Data.Inject":"/Users/maximko/Projects/mine/guppi/output/Data.Inject/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.NaturalTransformation":"/Users/maximko/Projects/mine/guppi/output/Data.NaturalTransformation/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js","Unsafe.Coerce":"/Users/maximko/Projects/mine/guppi/output/Unsafe.Coerce/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.List.Trans/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Alt = require("Control.Alt");
var Control_Alternative = require("Control.Alternative");
var Control_Monad_Eff_Class = require("Control.Monad.Eff.Class");
var Control_Monad_Trans = require("Control.Monad.Trans");
var Control_MonadPlus = require("Control.MonadPlus");
var Control_Plus = require("Control.Plus");
var Data_Lazy = require("Data.Lazy");
var Data_Maybe = require("Data.Maybe");
var Data_Monoid = require("Data.Monoid");
var Data_Tuple = require("Data.Tuple");
var Data_Unfoldable = require("Data.Unfoldable");
var Yield = (function () {
    function Yield(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Yield.create = function (value0) {
        return function (value1) {
            return new Yield(value0, value1);
        };
    };
    return Yield;
})();
var Skip = (function () {
    function Skip(value0) {
        this.value0 = value0;
    };
    Skip.create = function (value0) {
        return new Skip(value0);
    };
    return Skip;
})();
var Done = (function () {
    function Done() {

    };
    Done.value = new Done();
    return Done;
})();
var ListT = (function () {
    function ListT(value0) {
        this.value0 = value0;
    };
    ListT.create = function (value0) {
        return new ListT(value0);
    };
    return ListT;
})();
var wrapLazy = function (__dict_Applicative_0) {
    return function (v) {
        return ListT.create(Prelude.pure(__dict_Applicative_0)(new Skip(v)));
    };
};
var wrapEffect = function (__dict_Functor_1) {
    return function (v) {
        return ListT.create(Prelude["<$>"](__dict_Functor_1)(function (_117) {
            return Skip.create(Data_Lazy.defer(Prelude["const"](_117)));
        })(v));
    };
};
var unfold = function (__dict_Monad_2) {
    return function (f) {
        return function (z) {
            var g = function (_14) {
                if (_14 instanceof Data_Maybe.Just) {
                    return new Yield(_14.value0.value1, Data_Lazy.defer(function (_7) {
                        return unfold(__dict_Monad_2)(f)(_14.value0.value0);
                    }));
                };
                if (_14 instanceof Data_Maybe.Nothing) {
                    return Done.value;
                };
                throw new Error("Failed pattern match at Control.Monad.List.Trans line 118, column 3 - line 119, column 3: " + [ _14.constructor.name ]);
            };
            return ListT.create(Prelude["<$>"](((__dict_Monad_2["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(g)(f(z)));
        };
    };
};
var runListT = function (_10) {
    return _10.value0;
};
var scanl = function (__dict_Monad_3) {
    return function (f) {
        return function (b) {
            return function (l) {
                var g = function (_24) {
                    var h = function (_25) {
                        if (_25 instanceof Yield) {
                            var b$prime = f(_24.value0)(_25.value0);
                            return Data_Maybe.Just.create(new Data_Tuple.Tuple(new Data_Tuple.Tuple(b$prime, Data_Lazy.force(_25.value1)), b$prime));
                        };
                        if (_25 instanceof Skip) {
                            return Data_Maybe.Just.create(new Data_Tuple.Tuple(new Data_Tuple.Tuple(_24.value0, Data_Lazy.force(_25.value0)), _24.value0));
                        };
                        if (_25 instanceof Done) {
                            return Data_Maybe.Nothing.value;
                        };
                        throw new Error("Failed pattern match at Control.Monad.List.Trans line 217, column 5 - line 219, column 5: " + [ _25.constructor.name ]);
                    };
                    return Prelude["<$>"](((__dict_Monad_3["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(h)(runListT(_24.value1));
                };
                return unfold(__dict_Monad_3)(g)(new Data_Tuple.Tuple(b, l));
            };
        };
    };
};
var stepMap = function (__dict_Functor_4) {
    return function (f) {
        return function (l) {
            return ListT.create(Prelude["<$>"](__dict_Functor_4)(f)(runListT(l)));
        };
    };
};
var takeWhile = function (__dict_Applicative_5) {
    return function (f) {
        var g = function (_16) {
            if (_16 instanceof Yield) {
                var _46 = f(_16.value0);
                if (_46) {
                    return new Yield(_16.value0, Prelude["<$>"](Data_Lazy.functorLazy)(takeWhile(__dict_Applicative_5)(f))(_16.value1));
                };
                if (!_46) {
                    return Done.value;
                };
                throw new Error("Failed pattern match at Control.Monad.List.Trans line 142, column 3 - line 143, column 3: " + [ _46.constructor.name ]);
            };
            if (_16 instanceof Skip) {
                return Skip.create(Prelude["<$>"](Data_Lazy.functorLazy)(takeWhile(__dict_Applicative_5)(f))(_16.value0));
            };
            if (_16 instanceof Done) {
                return Done.value;
            };
            throw new Error("Failed pattern match at Control.Monad.List.Trans line 142, column 3 - line 143, column 3: " + [ _16.constructor.name ]);
        };
        return stepMap((__dict_Applicative_5["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(g);
    };
};
var uncons = function (__dict_Monad_6) {
    return function (l) {
        var g = function (_21) {
            if (_21 instanceof Yield) {
                return Prelude.pure(__dict_Monad_6["__superclass_Prelude.Applicative_0"]())(Data_Maybe.Just.create(new Data_Tuple.Tuple(_21.value0, Data_Lazy.force(_21.value1))));
            };
            if (_21 instanceof Skip) {
                return uncons(__dict_Monad_6)(Data_Lazy.force(_21.value0));
            };
            if (_21 instanceof Done) {
                return Prelude.pure(__dict_Monad_6["__superclass_Prelude.Applicative_0"]())(Data_Maybe.Nothing.value);
            };
            throw new Error("Failed pattern match at Control.Monad.List.Trans line 183, column 3 - line 184, column 3: " + [ _21.constructor.name ]);
        };
        return Prelude[">>="](__dict_Monad_6["__superclass_Prelude.Bind_1"]())(runListT(l))(g);
    };
};
var tail = function (__dict_Monad_7) {
    return function (l) {
        return Prelude["<$>"](((__dict_Monad_7["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Prelude["<$>"](Data_Maybe.functorMaybe)(Data_Tuple.snd))(uncons(__dict_Monad_7)(l));
    };
};
var prepend$prime = function (__dict_Applicative_8) {
    return function (h) {
        return function (t) {
            return ListT.create(Prelude.pure(__dict_Applicative_8)(new Yield(h, t)));
        };
    };
};
var prepend = function (__dict_Applicative_9) {
    return function (h) {
        return function (t) {
            return prepend$prime(__dict_Applicative_9)(h)(Data_Lazy.defer(Prelude["const"](t)));
        };
    };
};
var nil = function (__dict_Applicative_10) {
    return ListT.create(Prelude.pure(__dict_Applicative_10)(Done.value));
};
var singleton = function (__dict_Applicative_12) {
    return function (a) {
        return prepend(__dict_Applicative_12)(a)(nil(__dict_Applicative_12));
    };
};
var take = function (__dict_Applicative_13) {
    return function (_11) {
        return function (fa) {
            if (_11 === 0) {
                return nil(__dict_Applicative_13);
            };
            var f = function (_15) {
                if (_15 instanceof Yield) {
                    return new Yield(_15.value0, Prelude["<$>"](Data_Lazy.functorLazy)(take(__dict_Applicative_13)(_11 - 1))(_15.value1));
                };
                if (_15 instanceof Skip) {
                    return new Skip(Prelude["<$>"](Data_Lazy.functorLazy)(take(__dict_Applicative_13)(_11))(_15.value0));
                };
                if (_15 instanceof Done) {
                    return Done.value;
                };
                throw new Error("Failed pattern match at Control.Monad.List.Trans line 135, column 3 - line 136, column 3: " + [ _15.constructor.name ]);
            };
            return stepMap((__dict_Applicative_13["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(f)(fa);
        };
    };
};
var zipWith$prime = function (__dict_Monad_14) {
    return function (f) {
        var g = function (_26) {
            return function (_27) {
                if (_27 instanceof Data_Maybe.Nothing) {
                    return Prelude.pure(__dict_Monad_14["__superclass_Prelude.Applicative_0"]())(nil(__dict_Monad_14["__superclass_Prelude.Applicative_0"]()));
                };
                if (_26 instanceof Data_Maybe.Nothing) {
                    return Prelude.pure(__dict_Monad_14["__superclass_Prelude.Applicative_0"]())(nil(__dict_Monad_14["__superclass_Prelude.Applicative_0"]()));
                };
                if (_26 instanceof Data_Maybe.Just && _27 instanceof Data_Maybe.Just) {
                    return Prelude["<$>"](((__dict_Monad_14["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Prelude.flip(prepend$prime(__dict_Monad_14["__superclass_Prelude.Applicative_0"]()))(Data_Lazy.defer(function (_8) {
                        return zipWith$prime(__dict_Monad_14)(f)(_26.value0.value1)(_27.value0.value1);
                    })))(f(_26.value0.value0)(_27.value0.value0));
                };
                throw new Error("Failed pattern match at Control.Monad.List.Trans line 225, column 3 - line 230, column 3: " + [ _26.constructor.name, _27.constructor.name ]);
            };
        };
        var loop = function (fa) {
            return function (fb) {
                return wrapEffect(((__dict_Monad_14["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Prelude.bind(__dict_Monad_14["__superclass_Prelude.Bind_1"]())(uncons(__dict_Monad_14)(fa))(function (_5) {
                    return Prelude.bind(__dict_Monad_14["__superclass_Prelude.Bind_1"]())(uncons(__dict_Monad_14)(fb))(function (_4) {
                        return g(_5)(_4);
                    });
                }));
            };
        };
        return loop;
    };
};
var zipWith = function (__dict_Monad_15) {
    return function (f) {
        var g = function (a) {
            return function (b) {
                return Prelude.pure(__dict_Monad_15["__superclass_Prelude.Applicative_0"]())(f(a)(b));
            };
        };
        return zipWith$prime(__dict_Monad_15)(g);
    };
};
var mapMaybe = function (__dict_Functor_20) {
    return function (f) {
        var g = function (_20) {
            if (_20 instanceof Yield) {
                return Data_Maybe.fromMaybe(Skip.create)(Prelude["<$>"](Data_Maybe.functorMaybe)(Yield.create)(f(_20.value0)))(Prelude["<$>"](Data_Lazy.functorLazy)(mapMaybe(__dict_Functor_20)(f))(_20.value1));
            };
            if (_20 instanceof Skip) {
                return Skip.create(Prelude["<$>"](Data_Lazy.functorLazy)(mapMaybe(__dict_Functor_20)(f))(_20.value0));
            };
            if (_20 instanceof Done) {
                return Done.value;
            };
            throw new Error("Failed pattern match at Control.Monad.List.Trans line 171, column 3 - line 172, column 3: " + [ _20.constructor.name ]);
        };
        return stepMap(__dict_Functor_20)(g);
    };
};
var iterate = function (__dict_Monad_21) {
    return function (f) {
        return function (a) {
            var g = function (a_1) {
                return Prelude.pure(__dict_Monad_21["__superclass_Prelude.Applicative_0"]())(new Data_Maybe.Just(new Data_Tuple.Tuple(f(a_1), a_1)));
            };
            return unfold(__dict_Monad_21)(g)(a);
        };
    };
};
var repeat = function (__dict_Monad_22) {
    return iterate(__dict_Monad_22)(Prelude.id(Prelude.categoryFn));
};
var head = function (__dict_Monad_23) {
    return function (l) {
        return Prelude["<$>"](((__dict_Monad_23["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Prelude["<$>"](Data_Maybe.functorMaybe)(Data_Tuple.fst))(uncons(__dict_Monad_23)(l));
    };
};
var functorListT = function (__dict_Functor_24) {
    return new Prelude.Functor(function (f) {
        var g = function (_28) {
            if (_28 instanceof Yield) {
                return new Yield(f(_28.value0), Prelude["<$>"](Data_Lazy.functorLazy)(Prelude["<$>"](functorListT(__dict_Functor_24))(f))(_28.value1));
            };
            if (_28 instanceof Skip) {
                return new Skip(Prelude["<$>"](Data_Lazy.functorLazy)(Prelude["<$>"](functorListT(__dict_Functor_24))(f))(_28.value0));
            };
            if (_28 instanceof Done) {
                return Done.value;
            };
            throw new Error("Failed pattern match at Control.Monad.List.Trans line 248, column 5 - line 249, column 5: " + [ _28.constructor.name ]);
        };
        return stepMap(__dict_Functor_24)(g);
    });
};
var fromEffect = function (__dict_Applicative_25) {
    return function (fa) {
        return ListT.create(Prelude["<$>"]((__dict_Applicative_25["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(function (_2) {
            return new Yield(_2, Data_Lazy.defer(function (_6) {
                return nil(__dict_Applicative_25);
            }));
        })(fa));
    };
};
var monadTransListT = new Control_Monad_Trans.MonadTrans(function (__dict_Monad_26) {
    return fromEffect(__dict_Monad_26["__superclass_Prelude.Applicative_0"]());
});
var foldl$prime = function (__dict_Monad_27) {
    return function (f) {
        var loop = function (b) {
            return function (l) {
                var g = function (_22) {
                    if (_22 instanceof Data_Maybe.Nothing) {
                        return Prelude.pure(__dict_Monad_27["__superclass_Prelude.Applicative_0"]())(b);
                    };
                    if (_22 instanceof Data_Maybe.Just) {
                        return Prelude[">>="](__dict_Monad_27["__superclass_Prelude.Bind_1"]())(f(b)(_22.value0.value0))(Prelude.flip(loop)(_22.value0.value1));
                    };
                    throw new Error("Failed pattern match at Control.Monad.List.Trans line 200, column 5 - line 201, column 5: " + [ _22.constructor.name ]);
                };
                return Prelude[">>="](__dict_Monad_27["__superclass_Prelude.Bind_1"]())(uncons(__dict_Monad_27)(l))(g);
            };
        };
        return loop;
    };
};
var foldl = function (__dict_Monad_28) {
    return function (f) {
        var loop = function (b) {
            return function (l) {
                var g = function (_23) {
                    if (_23 instanceof Data_Maybe.Nothing) {
                        return Prelude.pure(__dict_Monad_28["__superclass_Prelude.Applicative_0"]())(b);
                    };
                    if (_23 instanceof Data_Maybe.Just) {
                        return loop(f(b)(_23.value0.value0))(_23.value0.value1);
                    };
                    throw new Error("Failed pattern match at Control.Monad.List.Trans line 208, column 5 - line 209, column 5: " + [ _23.constructor.name ]);
                };
                return Prelude[">>="](__dict_Monad_28["__superclass_Prelude.Bind_1"]())(uncons(__dict_Monad_28)(l))(g);
            };
        };
        return loop;
    };
};
var filter = function (__dict_Functor_29) {
    return function (f) {
        var g = function (_19) {
            if (_19 instanceof Yield) {
                var s$prime = Prelude["<$>"](Data_Lazy.functorLazy)(filter(__dict_Functor_29)(f))(_19.value1);
                var _89 = f(_19.value0);
                if (_89) {
                    return new Yield(_19.value0, s$prime);
                };
                if (!_89) {
                    return new Skip(s$prime);
                };
                throw new Error("Failed pattern match at Control.Monad.List.Trans line 164, column 3 - line 165, column 3: " + [ _89.constructor.name ]);
            };
            if (_19 instanceof Skip) {
                var s$prime = Prelude["<$>"](Data_Lazy.functorLazy)(filter(__dict_Functor_29)(f))(_19.value0);
                return new Skip(s$prime);
            };
            if (_19 instanceof Done) {
                return Done.value;
            };
            throw new Error("Failed pattern match at Control.Monad.List.Trans line 164, column 3 - line 165, column 3: " + [ _19.constructor.name ]);
        };
        return stepMap(__dict_Functor_29)(g);
    };
};
var dropWhile = function (__dict_Applicative_30) {
    return function (f) {
        var g = function (_18) {
            if (_18 instanceof Yield) {
                var _94 = f(_18.value0);
                if (_94) {
                    return new Skip(Prelude["<$>"](Data_Lazy.functorLazy)(dropWhile(__dict_Applicative_30)(f))(_18.value1));
                };
                if (!_94) {
                    return new Yield(_18.value0, _18.value1);
                };
                throw new Error("Failed pattern match at Control.Monad.List.Trans line 157, column 3 - line 158, column 3: " + [ _94.constructor.name ]);
            };
            if (_18 instanceof Skip) {
                return Skip.create(Prelude["<$>"](Data_Lazy.functorLazy)(dropWhile(__dict_Applicative_30)(f))(_18.value0));
            };
            if (_18 instanceof Done) {
                return Done.value;
            };
            throw new Error("Failed pattern match at Control.Monad.List.Trans line 157, column 3 - line 158, column 3: " + [ _18.constructor.name ]);
        };
        return stepMap((__dict_Applicative_30["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(g);
    };
};
var drop = function (__dict_Applicative_31) {
    return function (_12) {
        return function (fa) {
            if (_12 === 0) {
                return fa;
            };
            var f = function (_17) {
                if (_17 instanceof Yield) {
                    return new Skip(Prelude["<$>"](Data_Lazy.functorLazy)(drop(__dict_Applicative_31)(_12 - 1))(_17.value1));
                };
                if (_17 instanceof Skip) {
                    return new Skip(Prelude["<$>"](Data_Lazy.functorLazy)(drop(__dict_Applicative_31)(_12))(_17.value0));
                };
                if (_17 instanceof Done) {
                    return Done.value;
                };
                throw new Error("Failed pattern match at Control.Monad.List.Trans line 150, column 3 - line 151, column 3: " + [ _17.constructor.name ]);
            };
            return stepMap((__dict_Applicative_31["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(f)(fa);
        };
    };
};
var cons = function (__dict_Applicative_32) {
    return function (lh) {
        return function (t) {
            return ListT.create(Prelude.pure(__dict_Applicative_32)(new Yield(Data_Lazy.force(lh), t)));
        };
    };
};
var unfoldableListT = function (__dict_Monad_33) {
    return new Data_Unfoldable.Unfoldable(function (f) {
        return function (b) {
            var go = function (_29) {
                if (_29 instanceof Data_Maybe.Nothing) {
                    return nil(__dict_Monad_33["__superclass_Prelude.Applicative_0"]());
                };
                if (_29 instanceof Data_Maybe.Just) {
                    return cons(__dict_Monad_33["__superclass_Prelude.Applicative_0"]())(Prelude.pure(Data_Lazy.applicativeLazy)(_29.value0.value0))(Data_Lazy.defer(function (_9) {
                        return go(f(_29.value0.value1));
                    }));
                };
                throw new Error("Failed pattern match at Control.Monad.List.Trans line 252, column 1 - line 257, column 1: " + [ _29.constructor.name ]);
            };
            return go(f(b));
        };
    });
};
var semigroupListT = function (__dict_Applicative_35) {
    return new Prelude.Semigroup(concat(__dict_Applicative_35));
};
var concat = function (__dict_Applicative_34) {
    return function (x) {
        return function (y) {
            var f = function (_13) {
                if (_13 instanceof Yield) {
                    return new Yield(_13.value0, Prelude["<$>"](Data_Lazy.functorLazy)(function (_0) {
                        return Prelude["<>"](semigroupListT(__dict_Applicative_34))(_0)(y);
                    })(_13.value1));
                };
                if (_13 instanceof Skip) {
                    return new Skip(Prelude["<$>"](Data_Lazy.functorLazy)(function (_1) {
                        return Prelude["<>"](semigroupListT(__dict_Applicative_34))(_1)(y);
                    })(_13.value0));
                };
                if (_13 instanceof Done) {
                    return new Skip(Data_Lazy.defer(Prelude["const"](y)));
                };
                throw new Error("Failed pattern match at Control.Monad.List.Trans line 94, column 3 - line 95, column 3: " + [ _13.constructor.name ]);
            };
            return stepMap((__dict_Applicative_34["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(f)(x);
        };
    };
};
var monoidListT = function (__dict_Applicative_16) {
    return new Data_Monoid.Monoid(function () {
        return semigroupListT(__dict_Applicative_16);
    }, nil(__dict_Applicative_16));
};
var catMaybes = function (__dict_Functor_36) {
    return mapMaybe(__dict_Functor_36)(Prelude.id(Prelude.categoryFn));
};
var monadListT = function (__dict_Monad_18) {
    return new Prelude.Monad(function () {
        return applicativeListT(__dict_Monad_18);
    }, function () {
        return bindListT(__dict_Monad_18);
    });
};
var bindListT = function (__dict_Monad_37) {
    return new Prelude.Bind(function () {
        return applyListT(__dict_Monad_37);
    }, function (fa) {
        return function (f) {
            var g = function (_30) {
                if (_30 instanceof Yield) {
                    var h = function (s_1) {
                        return Prelude["<>"](semigroupListT(__dict_Monad_37["__superclass_Prelude.Applicative_0"]()))(f(_30.value0))(Prelude[">>="](bindListT(__dict_Monad_37))(s_1)(f));
                    };
                    return new Skip(Prelude["<$>"](Data_Lazy.functorLazy)(h)(_30.value1));
                };
                if (_30 instanceof Skip) {
                    return new Skip(Prelude["<$>"](Data_Lazy.functorLazy)(function (_3) {
                        return Prelude[">>="](bindListT(__dict_Monad_37))(_3)(f);
                    })(_30.value0));
                };
                if (_30 instanceof Done) {
                    return Done.value;
                };
                throw new Error("Failed pattern match at Control.Monad.List.Trans line 265, column 5 - line 268, column 5: " + [ _30.constructor.name ]);
            };
            return stepMap(((__dict_Monad_37["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(g)(fa);
        };
    });
};
var applyListT = function (__dict_Monad_38) {
    return new Prelude.Apply(function () {
        return functorListT(((__dict_Monad_38["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]());
    }, Prelude.ap(monadListT(__dict_Monad_38)));
};
var applicativeListT = function (__dict_Monad_39) {
    return new Prelude.Applicative(function () {
        return applyListT(__dict_Monad_39);
    }, singleton(__dict_Monad_39["__superclass_Prelude.Applicative_0"]()));
};
var monadEffListT = function (__dict_MonadEff_19) {
    return new Control_Monad_Eff_Class.MonadEff(function () {
        return monadListT(__dict_MonadEff_19["__superclass_Prelude.Monad_0"]());
    }, function (_118) {
        return Control_Monad_Trans.lift(monadTransListT)(__dict_MonadEff_19["__superclass_Prelude.Monad_0"]())(Control_Monad_Eff_Class.liftEff(__dict_MonadEff_19)(_118));
    });
};
var altListT = function (__dict_Applicative_41) {
    return new Control_Alt.Alt(function () {
        return functorListT((__dict_Applicative_41["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]());
    }, concat(__dict_Applicative_41));
};
var plusListT = function (__dict_Monad_11) {
    return new Control_Plus.Plus(function () {
        return altListT(__dict_Monad_11["__superclass_Prelude.Applicative_0"]());
    }, nil(__dict_Monad_11["__superclass_Prelude.Applicative_0"]()));
};
var alternativeListT = function (__dict_Monad_40) {
    return new Control_Alternative.Alternative(function () {
        return plusListT(__dict_Monad_40);
    }, function () {
        return applicativeListT(__dict_Monad_40);
    });
};
var monadPlusListT = function (__dict_Monad_17) {
    return new Control_MonadPlus.MonadPlus(function () {
        return alternativeListT(__dict_Monad_17);
    }, function () {
        return monadListT(__dict_Monad_17);
    });
};
module.exports = {
    "zipWith'": zipWith$prime, 
    zipWith: zipWith, 
    wrapLazy: wrapLazy, 
    wrapEffect: wrapEffect, 
    unfold: unfold, 
    uncons: uncons, 
    takeWhile: takeWhile, 
    take: take, 
    tail: tail, 
    singleton: singleton, 
    scanl: scanl, 
    repeat: repeat, 
    "prepend'": prepend$prime, 
    prepend: prepend, 
    nil: nil, 
    mapMaybe: mapMaybe, 
    iterate: iterate, 
    head: head, 
    fromEffect: fromEffect, 
    "foldl'": foldl$prime, 
    foldl: foldl, 
    filter: filter, 
    dropWhile: dropWhile, 
    drop: drop, 
    cons: cons, 
    catMaybes: catMaybes, 
    semigroupListT: semigroupListT, 
    monoidListT: monoidListT, 
    functorListT: functorListT, 
    unfoldableListT: unfoldableListT, 
    applyListT: applyListT, 
    applicativeListT: applicativeListT, 
    bindListT: bindListT, 
    monadListT: monadListT, 
    monadTransListT: monadTransListT, 
    altListT: altListT, 
    plusListT: plusListT, 
    alternativeListT: alternativeListT, 
    monadPlusListT: monadPlusListT, 
    monadEffListT: monadEffListT
};

},{"Control.Alt":"/Users/maximko/Projects/mine/guppi/output/Control.Alt/index.js","Control.Alternative":"/Users/maximko/Projects/mine/guppi/output/Control.Alternative/index.js","Control.Monad.Eff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Class/index.js","Control.Monad.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Trans/index.js","Control.MonadPlus":"/Users/maximko/Projects/mine/guppi/output/Control.MonadPlus/index.js","Control.Plus":"/Users/maximko/Projects/mine/guppi/output/Control.Plus/index.js","Data.Lazy":"/Users/maximko/Projects/mine/guppi/output/Data.Lazy/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Data.Unfoldable":"/Users/maximko/Projects/mine/guppi/output/Data.Unfoldable/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Maybe.Trans/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Either = require("Data.Either");
var Data_Maybe = require("Data.Maybe");
var Data_Tuple = require("Data.Tuple");
var Data_Monoid = require("Data.Monoid");
var Control_Alt = require("Control.Alt");
var Control_Alternative = require("Control.Alternative");
var Control_Monad_Cont_Class = require("Control.Monad.Cont.Class");
var Control_Monad_Eff_Class = require("Control.Monad.Eff.Class");
var Control_Monad_Error_Class = require("Control.Monad.Error.Class");
var Control_Monad_Reader_Class = require("Control.Monad.Reader.Class");
var Control_Monad_Rec_Class = require("Control.Monad.Rec.Class");
var Control_Monad_RWS_Class = require("Control.Monad.RWS.Class");
var Control_Monad_State_Class = require("Control.Monad.State.Class");
var Control_Monad_Trans = require("Control.Monad.Trans");
var Control_Monad_Writer_Class = require("Control.Monad.Writer.Class");
var Control_MonadPlus = require("Control.MonadPlus");
var Control_Plus = require("Control.Plus");
var MaybeT = function (x) {
    return x;
};
var runMaybeT = function (_5) {
    return _5;
};
var monadTransMaybeT = new Control_Monad_Trans.MonadTrans(function (__dict_Monad_1) {
    return function (_26) {
        return MaybeT(Prelude.liftM1(__dict_Monad_1)(Data_Maybe.Just.create)(_26));
    };
});
var mapMaybeT = function (f) {
    return function (_27) {
        return MaybeT(f(runMaybeT(_27)));
    };
};
var monadMaybeT = function (__dict_Monad_7) {
    return new Prelude.Monad(function () {
        return applicativeMaybeT(__dict_Monad_7);
    }, function () {
        return bindMaybeT(__dict_Monad_7);
    });
};
var functorMaybeT = function (__dict_Monad_14) {
    return new Prelude.Functor(Prelude.liftA1(applicativeMaybeT(__dict_Monad_14)));
};
var bindMaybeT = function (__dict_Monad_15) {
    return new Prelude.Bind(function () {
        return applyMaybeT(__dict_Monad_15);
    }, function (x) {
        return function (f) {
            return MaybeT(Prelude.bind(__dict_Monad_15["__superclass_Prelude.Bind_1"]())(runMaybeT(x))(function (_0) {
                if (_0 instanceof Data_Maybe.Nothing) {
                    return Prelude["return"](__dict_Monad_15["__superclass_Prelude.Applicative_0"]())(Data_Maybe.Nothing.value);
                };
                if (_0 instanceof Data_Maybe.Just) {
                    return runMaybeT(f(_0.value0));
                };
                throw new Error("Failed pattern match: " + [ _0.constructor.name ]);
            }));
        };
    });
};
var applyMaybeT = function (__dict_Monad_16) {
    return new Prelude.Apply(function () {
        return functorMaybeT(__dict_Monad_16);
    }, Prelude.ap(monadMaybeT(__dict_Monad_16)));
};
var applicativeMaybeT = function (__dict_Monad_17) {
    return new Prelude.Applicative(function () {
        return applyMaybeT(__dict_Monad_17);
    }, function (_28) {
        return MaybeT(Prelude.pure(__dict_Monad_17["__superclass_Prelude.Applicative_0"]())(Data_Maybe.Just.create(_28)));
    });
};
var monadContMaybeT = function (__dict_MonadCont_10) {
    return new Control_Monad_Cont_Class.MonadCont(function () {
        return monadMaybeT(__dict_MonadCont_10["__superclass_Prelude.Monad_0"]());
    }, function (f) {
        return MaybeT(Control_Monad_Cont_Class.callCC(__dict_MonadCont_10)(function (c) {
            return runMaybeT(f(function (a) {
                return MaybeT(c(new Data_Maybe.Just(a)));
            }));
        }));
    });
};
var monadEffMaybe = function (__dict_MonadEff_9) {
    return new Control_Monad_Eff_Class.MonadEff(function () {
        return monadMaybeT(__dict_MonadEff_9["__superclass_Prelude.Monad_0"]());
    }, function (_29) {
        return Control_Monad_Trans.lift(monadTransMaybeT)(__dict_MonadEff_9["__superclass_Prelude.Monad_0"]())(Control_Monad_Eff_Class.liftEff(__dict_MonadEff_9)(_29));
    });
};
var monadErrorMaybeT = function (__dict_MonadError_8) {
    return new Control_Monad_Error_Class.MonadError(function () {
        return monadMaybeT(__dict_MonadError_8["__superclass_Prelude.Monad_0"]());
    }, function (m) {
        return function (h) {
            return MaybeT(Control_Monad_Error_Class.catchError(__dict_MonadError_8)(runMaybeT(m))(function (_30) {
                return runMaybeT(h(_30));
            }));
        };
    }, function (e) {
        return Control_Monad_Trans.lift(monadTransMaybeT)(__dict_MonadError_8["__superclass_Prelude.Monad_0"]())(Control_Monad_Error_Class.throwError(__dict_MonadError_8)(e));
    });
};
var monadReaderMaybeT = function (__dict_MonadReader_11) {
    return new Control_Monad_Reader_Class.MonadReader(function () {
        return monadMaybeT(__dict_MonadReader_11["__superclass_Prelude.Monad_0"]());
    }, Control_Monad_Trans.lift(monadTransMaybeT)(__dict_MonadReader_11["__superclass_Prelude.Monad_0"]())(Control_Monad_Reader_Class.ask(__dict_MonadReader_11)), function (f) {
        return mapMaybeT(Control_Monad_Reader_Class.local(__dict_MonadReader_11)(f));
    });
};
var monadRecMaybeT = function (__dict_MonadRec_3) {
    return new Control_Monad_Rec_Class.MonadRec(function () {
        return monadMaybeT(__dict_MonadRec_3["__superclass_Prelude.Monad_0"]());
    }, function (f) {
        return function (_31) {
            return MaybeT(Control_Monad_Rec_Class.tailRecM(__dict_MonadRec_3)(function (a) {
                return Prelude.bind((__dict_MonadRec_3["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())(runMaybeT(f(a)))(function (_2) {
                    return Prelude["return"]((__dict_MonadRec_3["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Applicative_0"]())((function () {
                        if (_2 instanceof Data_Maybe.Nothing) {
                            return new Data_Either.Right(Data_Maybe.Nothing.value);
                        };
                        if (_2 instanceof Data_Maybe.Just && _2.value0 instanceof Data_Either.Left) {
                            return new Data_Either.Left(_2.value0.value0);
                        };
                        if (_2 instanceof Data_Maybe.Just && _2.value0 instanceof Data_Either.Right) {
                            return new Data_Either.Right(new Data_Maybe.Just(_2.value0.value0));
                        };
                        throw new Error("Failed pattern match at Control.Monad.Maybe.Trans line 78, column 1 - line 86, column 1: " + [ _2.constructor.name ]);
                    })());
                });
            })(_31));
        };
    });
};
var monadStateMaybeT = function (__dict_MonadState_2) {
    return new Control_Monad_State_Class.MonadState(function () {
        return monadMaybeT(__dict_MonadState_2["__superclass_Prelude.Monad_0"]());
    }, function (f) {
        return Control_Monad_Trans.lift(monadTransMaybeT)(__dict_MonadState_2["__superclass_Prelude.Monad_0"]())(Control_Monad_State_Class.state(__dict_MonadState_2)(f));
    });
};
var monadWriterMaybeT = function (__dict_Monad_12) {
    return function (__dict_MonadWriter_13) {
        return new Control_Monad_Writer_Class.MonadWriter(function () {
            return monadMaybeT(__dict_Monad_12);
        }, mapMaybeT(function (m) {
            return Prelude.bind(__dict_Monad_12["__superclass_Prelude.Bind_1"]())(Control_Monad_Writer_Class.listen(__dict_MonadWriter_13)(m))(function (_3) {
                return Prelude["return"](__dict_Monad_12["__superclass_Prelude.Applicative_0"]())(Prelude["<$>"](Data_Maybe.functorMaybe)(function (r) {
                    return new Data_Tuple.Tuple(r, _3.value1);
                })(_3.value0));
            });
        }), mapMaybeT(function (m) {
            return Control_Monad_Writer_Class.pass(__dict_MonadWriter_13)(Prelude.bind(__dict_Monad_12["__superclass_Prelude.Bind_1"]())(m)(function (_4) {
                return Prelude["return"](__dict_Monad_12["__superclass_Prelude.Applicative_0"]())((function () {
                    if (_4 instanceof Data_Maybe.Nothing) {
                        return new Data_Tuple.Tuple(Data_Maybe.Nothing.value, Prelude.id(Prelude.categoryFn));
                    };
                    if (_4 instanceof Data_Maybe.Just) {
                        return new Data_Tuple.Tuple(new Data_Maybe.Just(_4.value0.value0), _4.value0.value1);
                    };
                    throw new Error("Failed pattern match at Control.Monad.Maybe.Trans line 103, column 1 - line 114, column 1: " + [ _4.constructor.name ]);
                })());
            }));
        }), function (wd) {
            return Control_Monad_Trans.lift(monadTransMaybeT)(__dict_Monad_12)(Control_Monad_Writer_Class.writer(__dict_MonadWriter_13)(wd));
        });
    };
};
var monadRWSMaybeT = function (__dict_Monoid_4) {
    return function (__dict_MonadRWS_5) {
        return new Control_Monad_RWS_Class.MonadRWS(function () {
            return monadReaderMaybeT(__dict_MonadRWS_5["__superclass_Control.Monad.Reader.Class.MonadReader_1"]());
        }, function () {
            return monadStateMaybeT(__dict_MonadRWS_5["__superclass_Control.Monad.State.Class.MonadState_3"]());
        }, function () {
            return monadWriterMaybeT((__dict_MonadRWS_5["__superclass_Control.Monad.State.Class.MonadState_3"]())["__superclass_Prelude.Monad_0"]())(__dict_MonadRWS_5["__superclass_Control.Monad.Writer.Class.MonadWriter_2"]());
        }, function () {
            return __dict_Monoid_4;
        });
    };
};
var altMaybeT = function (__dict_Monad_19) {
    return new Control_Alt.Alt(function () {
        return functorMaybeT(__dict_Monad_19);
    }, function (m1) {
        return function (m2) {
            return Prelude.bind(__dict_Monad_19["__superclass_Prelude.Bind_1"]())(runMaybeT(m1))(function (_1) {
                if (_1 instanceof Data_Maybe.Nothing) {
                    return runMaybeT(m2);
                };
                return Prelude["return"](__dict_Monad_19["__superclass_Prelude.Applicative_0"]())(_1);
            });
        };
    });
};
var plusMaybeT = function (__dict_Monad_0) {
    return new Control_Plus.Plus(function () {
        return altMaybeT(__dict_Monad_0);
    }, Prelude.pure(__dict_Monad_0["__superclass_Prelude.Applicative_0"]())(Data_Maybe.Nothing.value));
};
var alternativeMaybeT = function (__dict_Monad_18) {
    return new Control_Alternative.Alternative(function () {
        return plusMaybeT(__dict_Monad_18);
    }, function () {
        return applicativeMaybeT(__dict_Monad_18);
    });
};
var monadPlusMaybeT = function (__dict_Monad_6) {
    return new Control_MonadPlus.MonadPlus(function () {
        return alternativeMaybeT(__dict_Monad_6);
    }, function () {
        return monadMaybeT(__dict_Monad_6);
    });
};
module.exports = {
    MaybeT: MaybeT, 
    mapMaybeT: mapMaybeT, 
    runMaybeT: runMaybeT, 
    functorMaybeT: functorMaybeT, 
    applyMaybeT: applyMaybeT, 
    applicativeMaybeT: applicativeMaybeT, 
    bindMaybeT: bindMaybeT, 
    monadMaybeT: monadMaybeT, 
    monadTransMaybeT: monadTransMaybeT, 
    altMaybeT: altMaybeT, 
    plusMaybeT: plusMaybeT, 
    alternativeMaybeT: alternativeMaybeT, 
    monadPlusMaybeT: monadPlusMaybeT, 
    monadRecMaybeT: monadRecMaybeT, 
    monadEffMaybe: monadEffMaybe, 
    monadContMaybeT: monadContMaybeT, 
    monadErrorMaybeT: monadErrorMaybeT, 
    monadReaderMaybeT: monadReaderMaybeT, 
    monadStateMaybeT: monadStateMaybeT, 
    monadWriterMaybeT: monadWriterMaybeT, 
    monadRWSMaybeT: monadRWSMaybeT
};

},{"Control.Alt":"/Users/maximko/Projects/mine/guppi/output/Control.Alt/index.js","Control.Alternative":"/Users/maximko/Projects/mine/guppi/output/Control.Alternative/index.js","Control.Monad.Cont.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Cont.Class/index.js","Control.Monad.Eff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Class/index.js","Control.Monad.Error.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Error.Class/index.js","Control.Monad.RWS.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.RWS.Class/index.js","Control.Monad.Reader.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Reader.Class/index.js","Control.Monad.Rec.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Rec.Class/index.js","Control.Monad.State.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State.Class/index.js","Control.Monad.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Trans/index.js","Control.Monad.Writer.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Writer.Class/index.js","Control.MonadPlus":"/Users/maximko/Projects/mine/guppi/output/Control.MonadPlus/index.js","Control.Plus":"/Users/maximko/Projects/mine/guppi/output/Control.Plus/index.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.RWS.Class/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Monoid = require("Data.Monoid");
var Control_Monad_Trans = require("Control.Monad.Trans");
var Control_Monad_Reader_Class = require("Control.Monad.Reader.Class");
var Control_Monad_State_Class = require("Control.Monad.State.Class");
var Control_Monad_Writer_Class = require("Control.Monad.Writer.Class");
var MonadRWS = function (__superclass_Control$dotMonad$dotReader$dotClass$dotMonadReader_1, __superclass_Control$dotMonad$dotState$dotClass$dotMonadState_3, __superclass_Control$dotMonad$dotWriter$dotClass$dotMonadWriter_2, __superclass_Data$dotMonoid$dotMonoid_0) {
    this["__superclass_Control.Monad.Reader.Class.MonadReader_1"] = __superclass_Control$dotMonad$dotReader$dotClass$dotMonadReader_1;
    this["__superclass_Control.Monad.State.Class.MonadState_3"] = __superclass_Control$dotMonad$dotState$dotClass$dotMonadState_3;
    this["__superclass_Control.Monad.Writer.Class.MonadWriter_2"] = __superclass_Control$dotMonad$dotWriter$dotClass$dotMonadWriter_2;
    this["__superclass_Data.Monoid.Monoid_0"] = __superclass_Data$dotMonoid$dotMonoid_0;
};
module.exports = {
    MonadRWS: MonadRWS
};

},{"Control.Monad.Reader.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Reader.Class/index.js","Control.Monad.State.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State.Class/index.js","Control.Monad.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Trans/index.js","Control.Monad.Writer.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Writer.Class/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.RWS.Trans/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Either = require("Data.Either");
var Data_Monoid = require("Data.Monoid");
var Data_Tuple = require("Data.Tuple");
var Control_Monad_Eff_Class = require("Control.Monad.Eff.Class");
var Control_Monad_Error_Class = require("Control.Monad.Error.Class");
var Control_Monad_Reader_Class = require("Control.Monad.Reader.Class");
var Control_Monad_Rec_Class = require("Control.Monad.Rec.Class");
var Control_Monad_RWS_Class = require("Control.Monad.RWS.Class");
var Control_Monad_State_Class = require("Control.Monad.State.Class");
var Control_Monad_Trans = require("Control.Monad.Trans");
var Control_Monad_Writer_Class = require("Control.Monad.Writer.Class");
var RWSResult = (function () {
    function RWSResult(value0, value1, value2) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
    };
    RWSResult.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return new RWSResult(value0, value1, value2);
            };
        };
    };
    return RWSResult;
})();
var RWST = function (x) {
    return x;
};
var runRWST = function (_14) {
    return _14;
};
var withRWST = function (f) {
    return function (m) {
        return function (r) {
            return function (s) {
                return Data_Tuple.uncurry(runRWST(m))(f(r)(s));
            };
        };
    };
};
var monadTransRWST = function (__dict_Monoid_2) {
    return new Control_Monad_Trans.MonadTrans(function (__dict_Monad_3) {
        return function (m) {
            return function (_9) {
                return function (s) {
                    return Prelude[">>="](__dict_Monad_3["__superclass_Prelude.Bind_1"]())(m)(function (a) {
                        return Prelude["return"](__dict_Monad_3["__superclass_Prelude.Applicative_0"]())(new RWSResult(s, a, Data_Monoid.mempty(__dict_Monoid_2)));
                    });
                };
            };
        };
    });
};
var mapRWST = function (f) {
    return function (m) {
        return function (r) {
            return function (s) {
                return f(runRWST(m)(r)(s));
            };
        };
    };
};
var functorRWST = function (__dict_Functor_19) {
    return function (__dict_Monoid_20) {
        return new Prelude.Functor(function (f) {
            return function (m) {
                return function (r) {
                    return function (s) {
                        return Prelude["<$>"](__dict_Functor_19)(function (_3) {
                            return new RWSResult(_3.value0, f(_3.value1), _3.value2);
                        })(runRWST(m)(r)(s));
                    };
                };
            };
        });
    };
};
var execRWST = function (__dict_Monad_21) {
    return function (m) {
        return function (r) {
            return function (s) {
                return Prelude[">>="](__dict_Monad_21["__superclass_Prelude.Bind_1"]())(runRWST(m)(r)(s))(function (_2) {
                    return Prelude["return"](__dict_Monad_21["__superclass_Prelude.Applicative_0"]())(new Data_Tuple.Tuple(_2.value0, _2.value2));
                });
            };
        };
    };
};
var evalRWST = function (__dict_Monad_22) {
    return function (m) {
        return function (r) {
            return function (s) {
                return Prelude[">>="](__dict_Monad_22["__superclass_Prelude.Bind_1"]())(runRWST(m)(r)(s))(function (_1) {
                    return Prelude["return"](__dict_Monad_22["__superclass_Prelude.Applicative_0"]())(new Data_Tuple.Tuple(_1.value1, _1.value2));
                });
            };
        };
    };
};
var applyRWST = function (__dict_Bind_25) {
    return function (__dict_Monoid_26) {
        return new Prelude.Apply(function () {
            return functorRWST((__dict_Bind_25["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(__dict_Monoid_26);
        }, function (f) {
            return function (m) {
                return function (r) {
                    return function (s) {
                        return Prelude[">>="](__dict_Bind_25)(runRWST(f)(r)(s))(function (_5) {
                            return Prelude["<#>"]((__dict_Bind_25["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(runRWST(m)(r)(_5.value0))(function (_4) {
                                return new RWSResult(_4.value0, _5.value1(_4.value1), Prelude["++"](__dict_Monoid_26["__superclass_Prelude.Semigroup_0"]())(_5.value2)(_4.value2));
                            });
                        });
                    };
                };
            };
        });
    };
};
var bindRWST = function (__dict_Bind_23) {
    return function (__dict_Monoid_24) {
        return new Prelude.Bind(function () {
            return applyRWST(__dict_Bind_23)(__dict_Monoid_24);
        }, function (m) {
            return function (f) {
                return function (r) {
                    return function (s) {
                        return Prelude[">>="](__dict_Bind_23)(runRWST(m)(r)(s))(function (_7) {
                            return Prelude["<#>"]((__dict_Bind_23["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(runRWST(f(_7.value1))(r)(_7.value0))(function (_6) {
                                return new RWSResult(_6.value0, _6.value1, Prelude["++"](__dict_Monoid_24["__superclass_Prelude.Semigroup_0"]())(_7.value2)(_6.value2));
                            });
                        });
                    };
                };
            };
        });
    };
};
var applicativeRWST = function (__dict_Monad_27) {
    return function (__dict_Monoid_28) {
        return new Prelude.Applicative(function () {
            return applyRWST(__dict_Monad_27["__superclass_Prelude.Bind_1"]())(__dict_Monoid_28);
        }, function (a) {
            return function (_8) {
                return function (s) {
                    return Prelude.pure(__dict_Monad_27["__superclass_Prelude.Applicative_0"]())(new RWSResult(s, a, Data_Monoid.mempty(__dict_Monoid_28)));
                };
            };
        });
    };
};
var monadRWST = function (__dict_Monad_10) {
    return function (__dict_Monoid_11) {
        return new Prelude.Monad(function () {
            return applicativeRWST(__dict_Monad_10)(__dict_Monoid_11);
        }, function () {
            return bindRWST(__dict_Monad_10["__superclass_Prelude.Bind_1"]())(__dict_Monoid_11);
        });
    };
};
var monadEffRWS = function (__dict_Monad_16) {
    return function (__dict_Monoid_17) {
        return function (__dict_MonadEff_18) {
            return new Control_Monad_Eff_Class.MonadEff(function () {
                return monadRWST(__dict_Monad_16)(__dict_Monoid_17);
            }, function (_78) {
                return Control_Monad_Trans.lift(monadTransRWST(__dict_Monoid_17))(__dict_Monad_16)(Control_Monad_Eff_Class.liftEff(__dict_MonadEff_18)(_78));
            });
        };
    };
};
var monadErrorRWST = function (__dict_MonadError_14) {
    return function (__dict_Monoid_15) {
        return new Control_Monad_Error_Class.MonadError(function () {
            return monadRWST(__dict_MonadError_14["__superclass_Prelude.Monad_0"]())(__dict_Monoid_15);
        }, function (m) {
            return function (h) {
                return RWST(function (r) {
                    return function (s) {
                        return Control_Monad_Error_Class.catchError(__dict_MonadError_14)(runRWST(m)(r)(s))(function (e) {
                            return runRWST(h(e))(r)(s);
                        });
                    };
                });
            };
        }, function (e) {
            return Control_Monad_Trans.lift(monadTransRWST(__dict_Monoid_15))(__dict_MonadError_14["__superclass_Prelude.Monad_0"]())(Control_Monad_Error_Class.throwError(__dict_MonadError_14)(e));
        });
    };
};
var monadReaderRWST = function (__dict_Monad_8) {
    return function (__dict_Monoid_9) {
        return new Control_Monad_Reader_Class.MonadReader(function () {
            return monadRWST(__dict_Monad_8)(__dict_Monoid_9);
        }, function (r) {
            return function (s) {
                return Prelude.pure(__dict_Monad_8["__superclass_Prelude.Applicative_0"]())(new RWSResult(s, r, Data_Monoid.mempty(__dict_Monoid_9)));
            };
        }, function (f) {
            return function (m) {
                return function (r) {
                    return function (s) {
                        return runRWST(m)(f(r))(s);
                    };
                };
            };
        });
    };
};
var monadRecRWST = function (__dict_Monoid_6) {
    return function (__dict_MonadRec_7) {
        return new Control_Monad_Rec_Class.MonadRec(function () {
            return monadRWST(__dict_MonadRec_7["__superclass_Prelude.Monad_0"]())(__dict_Monoid_6);
        }, function (k) {
            return function (a) {
                var k$prime = function (r) {
                    return function (_16) {
                        return Prelude.bind((__dict_MonadRec_7["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())(runRWST(k(_16.value1))(r)(_16.value0))(function (_0) {
                            return Prelude["return"]((__dict_MonadRec_7["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Applicative_0"]())((function () {
                                if (_0.value1 instanceof Data_Either.Left) {
                                    return new Data_Either.Left(new RWSResult(_0.value0, _0.value1.value0, Prelude["<>"](__dict_Monoid_6["__superclass_Prelude.Semigroup_0"]())(_16.value2)(_0.value2)));
                                };
                                if (_0.value1 instanceof Data_Either.Right) {
                                    return new Data_Either.Right(new RWSResult(_0.value0, _0.value1.value0, Prelude["<>"](__dict_Monoid_6["__superclass_Prelude.Semigroup_0"]())(_16.value2)(_0.value2)));
                                };
                                throw new Error("Failed pattern match at Control.Monad.RWS.Trans line 98, column 5 - line 102, column 75: " + [ _0.value1.constructor.name ]);
                            })());
                        });
                    };
                };
                return function (r) {
                    return function (s) {
                        return Control_Monad_Rec_Class.tailRecM(__dict_MonadRec_7)(k$prime(r))(new RWSResult(s, a, Data_Monoid.mempty(__dict_Monoid_6)));
                    };
                };
            };
        });
    };
};
var monadStateRWST = function (__dict_Monad_4) {
    return function (__dict_Monoid_5) {
        return new Control_Monad_State_Class.MonadState(function () {
            return monadRWST(__dict_Monad_4)(__dict_Monoid_5);
        }, function (f) {
            return function (_10) {
                return function (s) {
                    var _61 = f(s);
                    return Prelude.pure(__dict_Monad_4["__superclass_Prelude.Applicative_0"]())(new RWSResult(_61.value1, _61.value0, Data_Monoid.mempty(__dict_Monoid_5)));
                };
            };
        });
    };
};
var monadWriterRWST = function (__dict_Monad_0) {
    return function (__dict_Monoid_1) {
        return new Control_Monad_Writer_Class.MonadWriter(function () {
            return monadRWST(__dict_Monad_0)(__dict_Monoid_1);
        }, function (m) {
            return function (r) {
                return function (s) {
                    return Prelude[">>="](__dict_Monad_0["__superclass_Prelude.Bind_1"]())(runRWST(m)(r)(s))(function (_12) {
                        return Prelude.pure(__dict_Monad_0["__superclass_Prelude.Applicative_0"]())(new RWSResult(_12.value0, new Data_Tuple.Tuple(_12.value1, _12.value2), _12.value2));
                    });
                };
            };
        }, function (m) {
            return function (r) {
                return function (s) {
                    return Prelude[">>="](__dict_Monad_0["__superclass_Prelude.Bind_1"]())(runRWST(m)(r)(s))(function (_13) {
                        return Prelude.pure(__dict_Monad_0["__superclass_Prelude.Applicative_0"]())(new RWSResult(_13.value0, _13.value1.value0, _13.value1.value1(_13.value2)));
                    });
                };
            };
        }, function (_15) {
            return function (_11) {
                return function (s) {
                    return Prelude.pure(__dict_Monad_0["__superclass_Prelude.Applicative_0"]())(new RWSResult(s, _15.value0, _15.value1));
                };
            };
        });
    };
};
var monadRWSRWST = function (__dict_Monad_12) {
    return function (__dict_Monoid_13) {
        return new Control_Monad_RWS_Class.MonadRWS(function () {
            return monadReaderRWST(__dict_Monad_12)(__dict_Monoid_13);
        }, function () {
            return monadStateRWST(__dict_Monad_12)(__dict_Monoid_13);
        }, function () {
            return monadWriterRWST(__dict_Monad_12)(__dict_Monoid_13);
        }, function () {
            return __dict_Monoid_13;
        });
    };
};
module.exports = {
    RWST: RWST, 
    RWSResult: RWSResult, 
    withRWST: withRWST, 
    mapRWST: mapRWST, 
    execRWST: execRWST, 
    evalRWST: evalRWST, 
    runRWST: runRWST, 
    functorRWST: functorRWST, 
    applyRWST: applyRWST, 
    bindRWST: bindRWST, 
    applicativeRWST: applicativeRWST, 
    monadRWST: monadRWST, 
    monadTransRWST: monadTransRWST, 
    monadEffRWS: monadEffRWS, 
    monadReaderRWST: monadReaderRWST, 
    monadStateRWST: monadStateRWST, 
    monadWriterRWST: monadWriterRWST, 
    monadRWSRWST: monadRWSRWST, 
    monadErrorRWST: monadErrorRWST, 
    monadRecRWST: monadRecRWST
};

},{"Control.Monad.Eff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Class/index.js","Control.Monad.Error.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Error.Class/index.js","Control.Monad.RWS.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.RWS.Class/index.js","Control.Monad.Reader.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Reader.Class/index.js","Control.Monad.Rec.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Rec.Class/index.js","Control.Monad.State.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State.Class/index.js","Control.Monad.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Trans/index.js","Control.Monad.Writer.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Writer.Class/index.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Reader.Class/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var MonadReader = function (__superclass_Prelude$dotMonad_0, ask, local) {
    this["__superclass_Prelude.Monad_0"] = __superclass_Prelude$dotMonad_0;
    this.ask = ask;
    this.local = local;
};
var monadReaderFun = new MonadReader(function () {
    return Prelude.monadFn;
}, Prelude.id(Prelude.categoryFn), Prelude[">>>"](Prelude.semigroupoidFn));
var local = function (dict) {
    return dict.local;
};
var ask = function (dict) {
    return dict.ask;
};
var reader = function (__dict_MonadReader_0) {
    return function (f) {
        return Prelude[">>="]((__dict_MonadReader_0["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())(ask(__dict_MonadReader_0))(function (_0) {
            return Prelude["return"]((__dict_MonadReader_0["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Applicative_0"]())(f(_0));
        });
    };
};
module.exports = {
    MonadReader: MonadReader, 
    reader: reader, 
    local: local, 
    ask: ask, 
    monadReaderFun: monadReaderFun
};

},{"Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Reader.Trans/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Alt = require("Control.Alt");
var Control_Alternative = require("Control.Alternative");
var Control_Monad_Cont_Class = require("Control.Monad.Cont.Class");
var Control_Monad_Eff_Class = require("Control.Monad.Eff.Class");
var Control_Monad_Error_Class = require("Control.Monad.Error.Class");
var Control_Monad_Reader_Class = require("Control.Monad.Reader.Class");
var Control_Monad_Rec_Class = require("Control.Monad.Rec.Class");
var Control_Monad_State_Class = require("Control.Monad.State.Class");
var Control_Monad_Trans = require("Control.Monad.Trans");
var Control_Monad_Writer_Class = require("Control.Monad.Writer.Class");
var Control_MonadPlus = require("Control.MonadPlus");
var Control_Plus = require("Control.Plus");
var Data_Distributive = require("Data.Distributive");
var Data_Either = require("Data.Either");
var ReaderT = function (x) {
    return x;
};
var runReaderT = function (_2) {
    return _2;
};
var withReaderT = function (f) {
    return function (m) {
        return ReaderT(function (_6) {
            return runReaderT(m)(f(_6));
        });
    };
};
var monadTransReaderT = new Control_Monad_Trans.MonadTrans(function (__dict_Monad_1) {
    return function (_7) {
        return ReaderT(Prelude["const"](_7));
    };
});
var mapReaderT = function (f) {
    return function (m) {
        return ReaderT(function (_8) {
            return f(runReaderT(m)(_8));
        });
    };
};
var functorReaderT = function (__dict_Functor_12) {
    return new Prelude.Functor(function (f) {
        return mapReaderT(Prelude["<$>"](__dict_Functor_12)(f));
    });
};
var distributiveReaderT = function (__dict_Distributive_13) {
    return new Data_Distributive.Distributive(function () {
        return functorReaderT(__dict_Distributive_13["__superclass_Prelude.Functor_0"]());
    }, function (__dict_Functor_15) {
        return function (f) {
            return function (_9) {
                return Data_Distributive.distribute(distributiveReaderT(__dict_Distributive_13))(__dict_Functor_15)(Prelude.map(__dict_Functor_15)(f)(_9));
            };
        };
    }, function (__dict_Functor_14) {
        return function (a) {
            return function (e) {
                return Data_Distributive.collect(__dict_Distributive_13)(__dict_Functor_14)(Prelude.flip(runReaderT)(e))(a);
            };
        };
    });
};
var applyReaderT = function (__dict_Applicative_17) {
    return new Prelude.Apply(function () {
        return functorReaderT((__dict_Applicative_17["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]());
    }, function (f) {
        return function (v) {
            return function (r) {
                return Prelude["<*>"](__dict_Applicative_17["__superclass_Prelude.Apply_0"]())(runReaderT(f)(r))(runReaderT(v)(r));
            };
        };
    });
};
var bindReaderT = function (__dict_Monad_16) {
    return new Prelude.Bind(function () {
        return applyReaderT(__dict_Monad_16["__superclass_Prelude.Applicative_0"]());
    }, function (m) {
        return function (k) {
            return function (r) {
                return Prelude.bind(__dict_Monad_16["__superclass_Prelude.Bind_1"]())(runReaderT(m)(r))(function (_0) {
                    return runReaderT(k(_0))(r);
                });
            };
        };
    });
};
var applicativeReaderT = function (__dict_Applicative_18) {
    return new Prelude.Applicative(function () {
        return applyReaderT(__dict_Applicative_18);
    }, function (_10) {
        return ReaderT(Prelude["const"](Prelude.pure(__dict_Applicative_18)(_10)));
    });
};
var monadReaderT = function (__dict_Monad_4) {
    return new Prelude.Monad(function () {
        return applicativeReaderT(__dict_Monad_4["__superclass_Prelude.Applicative_0"]());
    }, function () {
        return bindReaderT(__dict_Monad_4);
    });
};
var monadContReaderT = function (__dict_MonadCont_9) {
    return new Control_Monad_Cont_Class.MonadCont(function () {
        return monadReaderT(__dict_MonadCont_9["__superclass_Prelude.Monad_0"]());
    }, function (f) {
        return ReaderT(function (r) {
            return Control_Monad_Cont_Class.callCC(__dict_MonadCont_9)(function (c) {
                return runReaderT(f(function (a) {
                    return ReaderT(Prelude["const"](c(a)));
                }))(r);
            });
        });
    });
};
var monadEffReader = function (__dict_MonadEff_8) {
    return new Control_Monad_Eff_Class.MonadEff(function () {
        return monadReaderT(__dict_MonadEff_8["__superclass_Prelude.Monad_0"]());
    }, function (_11) {
        return Control_Monad_Trans.lift(monadTransReaderT)(__dict_MonadEff_8["__superclass_Prelude.Monad_0"]())(Control_Monad_Eff_Class.liftEff(__dict_MonadEff_8)(_11));
    });
};
var monadErrorReaderT = function (__dict_MonadError_7) {
    return new Control_Monad_Error_Class.MonadError(function () {
        return monadReaderT(__dict_MonadError_7["__superclass_Prelude.Monad_0"]());
    }, function (m) {
        return function (h) {
            return ReaderT(function (r) {
                return Control_Monad_Error_Class.catchError(__dict_MonadError_7)(runReaderT(m)(r))(function (e) {
                    return runReaderT(h(e))(r);
                });
            });
        };
    }, function (e) {
        return Control_Monad_Trans.lift(monadTransReaderT)(__dict_MonadError_7["__superclass_Prelude.Monad_0"]())(Control_Monad_Error_Class.throwError(__dict_MonadError_7)(e));
    });
};
var monadReaderReaderT = function (__dict_Monad_5) {
    return new Control_Monad_Reader_Class.MonadReader(function () {
        return monadReaderT(__dict_Monad_5);
    }, Prelude["return"](__dict_Monad_5["__superclass_Prelude.Applicative_0"]()), withReaderT);
};
var monadRecReaderT = function (__dict_MonadRec_3) {
    return new Control_Monad_Rec_Class.MonadRec(function () {
        return monadReaderT(__dict_MonadRec_3["__superclass_Prelude.Monad_0"]());
    }, function (k) {
        return function (a) {
            var k$prime = function (r) {
                return function (a_1) {
                    return Prelude.bind((__dict_MonadRec_3["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())(runReaderT(k(a_1))(r))(function (_1) {
                        return Prelude["return"]((__dict_MonadRec_3["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Applicative_0"]())(Data_Either.either(Data_Either.Left.create)(Data_Either.Right.create)(_1));
                    });
                };
            };
            return function (r) {
                return Control_Monad_Rec_Class.tailRecM(__dict_MonadRec_3)(k$prime(r))(a);
            };
        };
    });
};
var monadStateReaderT = function (__dict_MonadState_2) {
    return new Control_Monad_State_Class.MonadState(function () {
        return monadReaderT(__dict_MonadState_2["__superclass_Prelude.Monad_0"]());
    }, function (f) {
        return Control_Monad_Trans.lift(monadTransReaderT)(__dict_MonadState_2["__superclass_Prelude.Monad_0"]())(Control_Monad_State_Class.state(__dict_MonadState_2)(f));
    });
};
var monadWriterReaderT = function (__dict_Monad_10) {
    return function (__dict_MonadWriter_11) {
        return new Control_Monad_Writer_Class.MonadWriter(function () {
            return monadReaderT(__dict_Monad_10);
        }, mapReaderT(Control_Monad_Writer_Class.listen(__dict_MonadWriter_11)), mapReaderT(Control_Monad_Writer_Class.pass(__dict_MonadWriter_11)), function (wd) {
            return Control_Monad_Trans.lift(monadTransReaderT)(__dict_Monad_10)(Control_Monad_Writer_Class.writer(__dict_MonadWriter_11)(wd));
        });
    };
};
var altReaderT = function (__dict_Alt_20) {
    return new Control_Alt.Alt(function () {
        return functorReaderT(__dict_Alt_20["__superclass_Prelude.Functor_0"]());
    }, function (m) {
        return function (n) {
            return function (r) {
                return Control_Alt["<|>"](__dict_Alt_20)(runReaderT(m)(r))(runReaderT(n)(r));
            };
        };
    });
};
var plusReaderT = function (__dict_Plus_0) {
    return new Control_Plus.Plus(function () {
        return altReaderT(__dict_Plus_0["__superclass_Control.Alt.Alt_0"]());
    }, Prelude["const"](Control_Plus.empty(__dict_Plus_0)));
};
var alternativeReaderT = function (__dict_Alternative_19) {
    return new Control_Alternative.Alternative(function () {
        return plusReaderT(__dict_Alternative_19["__superclass_Control.Plus.Plus_1"]());
    }, function () {
        return applicativeReaderT(__dict_Alternative_19["__superclass_Prelude.Applicative_0"]());
    });
};
var monadPlusReaderT = function (__dict_MonadPlus_6) {
    return new Control_MonadPlus.MonadPlus(function () {
        return alternativeReaderT(__dict_MonadPlus_6["__superclass_Control.Alternative.Alternative_1"]());
    }, function () {
        return monadReaderT(__dict_MonadPlus_6["__superclass_Prelude.Monad_0"]());
    });
};
module.exports = {
    ReaderT: ReaderT, 
    mapReaderT: mapReaderT, 
    withReaderT: withReaderT, 
    runReaderT: runReaderT, 
    functorReaderT: functorReaderT, 
    applyReaderT: applyReaderT, 
    applicativeReaderT: applicativeReaderT, 
    altReaderT: altReaderT, 
    plusReaderT: plusReaderT, 
    alternativeReaderT: alternativeReaderT, 
    bindReaderT: bindReaderT, 
    monadReaderT: monadReaderT, 
    monadPlusReaderT: monadPlusReaderT, 
    monadTransReaderT: monadTransReaderT, 
    monadEffReader: monadEffReader, 
    monadContReaderT: monadContReaderT, 
    monadErrorReaderT: monadErrorReaderT, 
    monadReaderReaderT: monadReaderReaderT, 
    monadStateReaderT: monadStateReaderT, 
    monadWriterReaderT: monadWriterReaderT, 
    distributiveReaderT: distributiveReaderT, 
    monadRecReaderT: monadRecReaderT
};

},{"Control.Alt":"/Users/maximko/Projects/mine/guppi/output/Control.Alt/index.js","Control.Alternative":"/Users/maximko/Projects/mine/guppi/output/Control.Alternative/index.js","Control.Monad.Cont.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Cont.Class/index.js","Control.Monad.Eff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Class/index.js","Control.Monad.Error.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Error.Class/index.js","Control.Monad.Reader.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Reader.Class/index.js","Control.Monad.Rec.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Rec.Class/index.js","Control.Monad.State.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State.Class/index.js","Control.Monad.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Trans/index.js","Control.Monad.Writer.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Writer.Class/index.js","Control.MonadPlus":"/Users/maximko/Projects/mine/guppi/output/Control.MonadPlus/index.js","Control.Plus":"/Users/maximko/Projects/mine/guppi/output/Control.Plus/index.js","Data.Distributive":"/Users/maximko/Projects/mine/guppi/output/Data.Distributive/index.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Rec.Class/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Monad_Eff = require("Control.Monad.Eff");
var Control_Monad_ST = require("Control.Monad.ST");
var Data_Either = require("Data.Either");
var Data_Functor = require("Data.Functor");
var Data_Identity = require("Data.Identity");
var Control_Monad_Eff_Unsafe = require("Control.Monad.Eff.Unsafe");
var Data_Either_Unsafe = require("Data.Either.Unsafe");
var MonadRec = function (__superclass_Prelude$dotMonad_0, tailRecM) {
    this["__superclass_Prelude.Monad_0"] = __superclass_Prelude$dotMonad_0;
    this.tailRecM = tailRecM;
};
var tailRecM = function (dict) {
    return dict.tailRecM;
};
var tailRecM2 = function (__dict_MonadRec_0) {
    return function (f) {
        return function (a) {
            return function (b) {
                return tailRecM(__dict_MonadRec_0)(function (o) {
                    return f(o.a)(o.b);
                })({
                    a: a, 
                    b: b
                });
            };
        };
    };
};
var tailRecM3 = function (__dict_MonadRec_1) {
    return function (f) {
        return function (a) {
            return function (b) {
                return function (c) {
                    return tailRecM(__dict_MonadRec_1)(function (o) {
                        return f(o.a)(o.b)(o.c);
                    })({
                        a: a, 
                        b: b, 
                        c: c
                    });
                };
            };
        };
    };
};
var tailRecEff = function (f) {
    return function (a) {
        var f$prime = function (_15) {
            return Control_Monad_Eff_Unsafe.unsafeInterleaveEff(f(_15));
        };
        return function __do() {
            var _3 = f$prime(a)();
            var _2 = {
                value: _3
            };
            (function () {
                while (!(function __do() {
                    var _1 = _2.value;
                    return (function () {
                        if (_1 instanceof Data_Either.Left) {
                            return function __do() {
                                var _0 = f$prime(_1.value0)();
                                _2.value = _0;
                                return Prelude["return"](Control_Monad_Eff.applicativeEff)(false)();
                            };
                        };
                        if (_1 instanceof Data_Either.Right) {
                            return Prelude["return"](Control_Monad_Eff.applicativeEff)(true);
                        };
                        throw new Error("Failed pattern match at Control.Monad.Rec.Class line 75, column 1 - line 76, column 1: " + [ _1.constructor.name ]);
                    })()();
                })()) {

                };
                return {};
            })();
            return Prelude["<$>"](Control_Monad_Eff.functorEff)(Data_Either_Unsafe.fromRight)(Control_Monad_ST.readSTRef(_2))();
        };
    };
};
var tailRec = function (f) {
    return function (a) {
        var go = function (__copy__4) {
            var _4 = __copy__4;
            tco: while (true) {
                if (_4 instanceof Data_Either.Left) {
                    var __tco__4 = f(_4.value0);
                    _4 = __tco__4;
                    continue tco;
                };
                if (_4 instanceof Data_Either.Right) {
                    return _4.value0;
                };
                throw new Error("Failed pattern match at Control.Monad.Rec.Class line 63, column 1 - line 64, column 1: " + [ _4.constructor.name ]);
            };
        };
        return go(f(a));
    };
};
var monadRecIdentity = new MonadRec(function () {
    return Data_Identity.monadIdentity;
}, function (f) {
    return function (_16) {
        return Data_Identity.Identity(tailRec(function (_17) {
            return Data_Identity.runIdentity(f(_17));
        })(_16));
    };
});
var monadRecEff = new MonadRec(function () {
    return Control_Monad_Eff.monadEff;
}, tailRecEff);
var forever = function (__dict_MonadRec_2) {
    return function (ma) {
        return tailRecM(__dict_MonadRec_2)(function (u) {
            return Data_Functor["<$"]((((__dict_MonadRec_2["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(new Data_Either.Left(u))(ma);
        })(Prelude.unit);
    };
};
module.exports = {
    MonadRec: MonadRec, 
    forever: forever, 
    tailRecM3: tailRecM3, 
    tailRecM2: tailRecM2, 
    tailRecM: tailRecM, 
    tailRec: tailRec, 
    monadRecIdentity: monadRecIdentity, 
    monadRecEff: monadRecEff
};

},{"Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","Control.Monad.Eff.Unsafe":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Unsafe/index.js","Control.Monad.ST":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.ST/index.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Either.Unsafe":"/Users/maximko/Projects/mine/guppi/output/Data.Either.Unsafe/index.js","Data.Functor":"/Users/maximko/Projects/mine/guppi/output/Data.Functor/index.js","Data.Identity":"/Users/maximko/Projects/mine/guppi/output/Data.Identity/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.ST/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Control.Monad.ST

exports.newSTRef = function (val) {
  return function () {
    return { value: val };
  };
};

exports.readSTRef = function (ref) {
  return function () {
    return ref.value;
  };
};

exports.modifySTRef = function (ref) {
  return function (f) {
    return function () {
      /* jshint boss: true */
      return ref.value = f(ref.value);
    };
  };
};

exports.writeSTRef = function (ref) {
  return function (a) {
    return function () {
      /* jshint boss: true */
      return ref.value = a;
    };
  };
};

exports.runST = function (f) {
  return f;
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.ST/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Control_Monad_Eff = require("Control.Monad.Eff");
var pureST = function (st) {
    return Control_Monad_Eff.runPure($foreign.runST(st));
};
module.exports = {
    pureST: pureST, 
    runST: $foreign.runST, 
    writeSTRef: $foreign.writeSTRef, 
    modifySTRef: $foreign.modifySTRef, 
    readSTRef: $foreign.readSTRef, 
    newSTRef: $foreign.newSTRef
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.ST/foreign.js","Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State.Class/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Tuple = require("Data.Tuple");
var MonadState = function (__superclass_Prelude$dotMonad_0, state) {
    this["__superclass_Prelude.Monad_0"] = __superclass_Prelude$dotMonad_0;
    this.state = state;
};
var state = function (dict) {
    return dict.state;
};
var put = function (__dict_MonadState_0) {
    return function (s) {
        return state(__dict_MonadState_0)(function (_0) {
            return new Data_Tuple.Tuple(Prelude.unit, s);
        });
    };
};
var modify = function (__dict_MonadState_1) {
    return function (f) {
        return state(__dict_MonadState_1)(function (s) {
            return new Data_Tuple.Tuple(Prelude.unit, f(s));
        });
    };
};
var gets = function (__dict_MonadState_2) {
    return function (f) {
        return state(__dict_MonadState_2)(function (s) {
            return new Data_Tuple.Tuple(f(s), s);
        });
    };
};
var get = function (__dict_MonadState_3) {
    return state(__dict_MonadState_3)(function (s) {
        return new Data_Tuple.Tuple(s, s);
    });
};
module.exports = {
    MonadState: MonadState, 
    modify: modify, 
    put: put, 
    gets: gets, 
    get: get, 
    state: state
};

},{"Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State.Trans/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Tuple = require("Data.Tuple");
var Data_Either = require("Data.Either");
var Control_Alt = require("Control.Alt");
var Control_Alternative = require("Control.Alternative");
var Control_Lazy = require("Control.Lazy");
var Control_Monad_Cont_Class = require("Control.Monad.Cont.Class");
var Control_Monad_Eff_Class = require("Control.Monad.Eff.Class");
var Control_Monad_Error_Class = require("Control.Monad.Error.Class");
var Control_Monad_Reader_Class = require("Control.Monad.Reader.Class");
var Control_Monad_Rec_Class = require("Control.Monad.Rec.Class");
var Control_Monad_State_Class = require("Control.Monad.State.Class");
var Control_Monad_Trans = require("Control.Monad.Trans");
var Control_Monad_Writer_Class = require("Control.Monad.Writer.Class");
var Control_MonadPlus = require("Control.MonadPlus");
var Control_Plus = require("Control.Plus");
var StateT = function (x) {
    return x;
};
var runStateT = function (_6) {
    return _6;
};
var withStateT = function (f) {
    return function (s) {
        return StateT(function (_36) {
            return runStateT(s)(f(_36));
        });
    };
};
var monadTransStateT = new Control_Monad_Trans.MonadTrans(function (__dict_Monad_4) {
    return function (m) {
        return function (s) {
            return Prelude.bind(__dict_Monad_4["__superclass_Prelude.Bind_1"]())(m)(function (_2) {
                return Prelude["return"](__dict_Monad_4["__superclass_Prelude.Applicative_0"]())(new Data_Tuple.Tuple(_2, s));
            });
        };
    };
});
var mapStateT = function (f) {
    return function (m) {
        return StateT(function (_37) {
            return f(runStateT(m)(_37));
        });
    };
};
var lazyStateT = new Control_Lazy.Lazy(function (f) {
    return StateT(function (s) {
        return runStateT(f(Prelude.unit))(s);
    });
});
var execStateT = function (__dict_Apply_15) {
    return function (m) {
        return function (s) {
            return Prelude["<$>"](__dict_Apply_15["__superclass_Prelude.Functor_0"]())(Data_Tuple.snd)(runStateT(m)(s));
        };
    };
};
var evalStateT = function (__dict_Apply_16) {
    return function (m) {
        return function (s) {
            return Prelude["<$>"](__dict_Apply_16["__superclass_Prelude.Functor_0"]())(Data_Tuple.fst)(runStateT(m)(s));
        };
    };
};
var monadStateT = function (__dict_Monad_5) {
    return new Prelude.Monad(function () {
        return applicativeStateT(__dict_Monad_5);
    }, function () {
        return bindStateT(__dict_Monad_5);
    });
};
var functorStateT = function (__dict_Monad_14) {
    return new Prelude.Functor(Prelude.liftM1(monadStateT(__dict_Monad_14)));
};
var bindStateT = function (__dict_Monad_17) {
    return new Prelude.Bind(function () {
        return applyStateT(__dict_Monad_17);
    }, function (_7) {
        return function (f) {
            return function (s) {
                return Prelude.bind(__dict_Monad_17["__superclass_Prelude.Bind_1"]())(_7(s))(function (_0) {
                    return runStateT(f(_0.value0))(_0.value1);
                });
            };
        };
    });
};
var applyStateT = function (__dict_Monad_18) {
    return new Prelude.Apply(function () {
        return functorStateT(__dict_Monad_18);
    }, Prelude.ap(monadStateT(__dict_Monad_18)));
};
var applicativeStateT = function (__dict_Monad_19) {
    return new Prelude.Applicative(function () {
        return applyStateT(__dict_Monad_19);
    }, function (a) {
        return StateT(function (s) {
            return Prelude["return"](__dict_Monad_19["__superclass_Prelude.Applicative_0"]())(new Data_Tuple.Tuple(a, s));
        });
    });
};
var monadContStateT = function (__dict_MonadCont_12) {
    return new Control_Monad_Cont_Class.MonadCont(function () {
        return monadStateT(__dict_MonadCont_12["__superclass_Prelude.Monad_0"]());
    }, function (f) {
        return StateT(function (s) {
            return Control_Monad_Cont_Class.callCC(__dict_MonadCont_12)(function (c) {
                return runStateT(f(function (a) {
                    return StateT(function (s$prime) {
                        return c(new Data_Tuple.Tuple(a, s$prime));
                    });
                }))(s);
            });
        });
    });
};
var monadEffState = function (__dict_Monad_10) {
    return function (__dict_MonadEff_11) {
        return new Control_Monad_Eff_Class.MonadEff(function () {
            return monadStateT(__dict_Monad_10);
        }, function (_38) {
            return Control_Monad_Trans.lift(monadTransStateT)(__dict_Monad_10)(Control_Monad_Eff_Class.liftEff(__dict_MonadEff_11)(_38));
        });
    };
};
var monadErrorStateT = function (__dict_MonadError_9) {
    return new Control_Monad_Error_Class.MonadError(function () {
        return monadStateT(__dict_MonadError_9["__superclass_Prelude.Monad_0"]());
    }, function (m) {
        return function (h) {
            return StateT(function (s) {
                return Control_Monad_Error_Class.catchError(__dict_MonadError_9)(runStateT(m)(s))(function (e) {
                    return runStateT(h(e))(s);
                });
            });
        };
    }, function (e) {
        return Control_Monad_Trans.lift(monadTransStateT)(__dict_MonadError_9["__superclass_Prelude.Monad_0"]())(Control_Monad_Error_Class.throwError(__dict_MonadError_9)(e));
    });
};
var monadReaderStateT = function (__dict_MonadReader_13) {
    return new Control_Monad_Reader_Class.MonadReader(function () {
        return monadStateT(__dict_MonadReader_13["__superclass_Prelude.Monad_0"]());
    }, Control_Monad_Trans.lift(monadTransStateT)(__dict_MonadReader_13["__superclass_Prelude.Monad_0"]())(Control_Monad_Reader_Class.ask(__dict_MonadReader_13)), function (f) {
        return mapStateT(Control_Monad_Reader_Class.local(__dict_MonadReader_13)(f));
    });
};
var monadRecStateT = function (__dict_MonadRec_7) {
    return new Control_Monad_Rec_Class.MonadRec(function () {
        return monadStateT(__dict_MonadRec_7["__superclass_Prelude.Monad_0"]());
    }, function (f) {
        return function (a) {
            var f$prime = function (_8) {
                return Prelude.bind((__dict_MonadRec_7["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())(runStateT(f(_8.value0))(_8.value1))(function (_1) {
                    return Prelude["return"]((__dict_MonadRec_7["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Applicative_0"]())((function () {
                        if (_1.value0 instanceof Data_Either.Left) {
                            return new Data_Either.Left(new Data_Tuple.Tuple(_1.value0.value0, _1.value1));
                        };
                        if (_1.value0 instanceof Data_Either.Right) {
                            return new Data_Either.Right(new Data_Tuple.Tuple(_1.value0.value0, _1.value1));
                        };
                        throw new Error("Failed pattern match at Control.Monad.State.Trans line 83, column 5 - line 89, column 1: " + [ _1.value0.constructor.name ]);
                    })());
                });
            };
            return function (s) {
                return Control_Monad_Rec_Class.tailRecM(__dict_MonadRec_7)(f$prime)(new Data_Tuple.Tuple(a, s));
            };
        };
    });
};
var monadStateStateT = function (__dict_Monad_6) {
    return new Control_Monad_State_Class.MonadState(function () {
        return monadStateT(__dict_Monad_6);
    }, function (f) {
        return StateT(function (_39) {
            return Prelude["return"](__dict_Monad_6["__superclass_Prelude.Applicative_0"]())(f(_39));
        });
    });
};
var monadWriterStateT = function (__dict_Monad_2) {
    return function (__dict_MonadWriter_3) {
        return new Control_Monad_Writer_Class.MonadWriter(function () {
            return monadStateT(__dict_Monad_2);
        }, function (m) {
            return StateT(function (s) {
                return Prelude.bind(__dict_Monad_2["__superclass_Prelude.Bind_1"]())(Control_Monad_Writer_Class.listen(__dict_MonadWriter_3)(runStateT(m)(s)))(function (_3) {
                    return Prelude["return"](__dict_Monad_2["__superclass_Prelude.Applicative_0"]())(new Data_Tuple.Tuple(new Data_Tuple.Tuple(_3.value0.value0, _3.value1), _3.value0.value1));
                });
            });
        }, function (m) {
            return StateT(function (s) {
                return Control_Monad_Writer_Class.pass(__dict_MonadWriter_3)(Prelude.bind(__dict_Monad_2["__superclass_Prelude.Bind_1"]())(runStateT(m)(s))(function (_4) {
                    return Prelude["return"](__dict_Monad_2["__superclass_Prelude.Applicative_0"]())(new Data_Tuple.Tuple(new Data_Tuple.Tuple(_4.value0.value0, _4.value1), _4.value0.value1));
                }));
            });
        }, function (wd) {
            return Control_Monad_Trans.lift(monadTransStateT)(__dict_Monad_2)(Control_Monad_Writer_Class.writer(__dict_MonadWriter_3)(wd));
        });
    };
};
var altStateT = function (__dict_Monad_22) {
    return function (__dict_Alt_23) {
        return new Control_Alt.Alt(function () {
            return functorStateT(__dict_Monad_22);
        }, function (x) {
            return function (y) {
                return StateT(function (s) {
                    return Control_Alt["<|>"](__dict_Alt_23)(runStateT(x)(s))(runStateT(y)(s));
                });
            };
        });
    };
};
var plusStateT = function (__dict_Monad_0) {
    return function (__dict_Plus_1) {
        return new Control_Plus.Plus(function () {
            return altStateT(__dict_Monad_0)(__dict_Plus_1["__superclass_Control.Alt.Alt_0"]());
        }, StateT(function (_5) {
            return Control_Plus.empty(__dict_Plus_1);
        }));
    };
};
var alternativeStateT = function (__dict_Monad_20) {
    return function (__dict_Alternative_21) {
        return new Control_Alternative.Alternative(function () {
            return plusStateT(__dict_Monad_20)(__dict_Alternative_21["__superclass_Control.Plus.Plus_1"]());
        }, function () {
            return applicativeStateT(__dict_Monad_20);
        });
    };
};
var monadPlusStateT = function (__dict_MonadPlus_8) {
    return new Control_MonadPlus.MonadPlus(function () {
        return alternativeStateT(__dict_MonadPlus_8["__superclass_Prelude.Monad_0"]())(__dict_MonadPlus_8["__superclass_Control.Alternative.Alternative_1"]());
    }, function () {
        return monadStateT(__dict_MonadPlus_8["__superclass_Prelude.Monad_0"]());
    });
};
module.exports = {
    StateT: StateT, 
    withStateT: withStateT, 
    mapStateT: mapStateT, 
    execStateT: execStateT, 
    evalStateT: evalStateT, 
    runStateT: runStateT, 
    functorStateT: functorStateT, 
    applyStateT: applyStateT, 
    applicativeStateT: applicativeStateT, 
    altStateT: altStateT, 
    plusStateT: plusStateT, 
    alternativeStateT: alternativeStateT, 
    bindStateT: bindStateT, 
    monadStateT: monadStateT, 
    monadRecStateT: monadRecStateT, 
    monadPlusStateT: monadPlusStateT, 
    monadTransStateT: monadTransStateT, 
    lazyStateT: lazyStateT, 
    monadEffState: monadEffState, 
    monadContStateT: monadContStateT, 
    monadErrorStateT: monadErrorStateT, 
    monadReaderStateT: monadReaderStateT, 
    monadStateStateT: monadStateStateT, 
    monadWriterStateT: monadWriterStateT
};

},{"Control.Alt":"/Users/maximko/Projects/mine/guppi/output/Control.Alt/index.js","Control.Alternative":"/Users/maximko/Projects/mine/guppi/output/Control.Alternative/index.js","Control.Lazy":"/Users/maximko/Projects/mine/guppi/output/Control.Lazy/index.js","Control.Monad.Cont.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Cont.Class/index.js","Control.Monad.Eff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Class/index.js","Control.Monad.Error.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Error.Class/index.js","Control.Monad.Reader.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Reader.Class/index.js","Control.Monad.Rec.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Rec.Class/index.js","Control.Monad.State.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State.Class/index.js","Control.Monad.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Trans/index.js","Control.Monad.Writer.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Writer.Class/index.js","Control.MonadPlus":"/Users/maximko/Projects/mine/guppi/output/Control.MonadPlus/index.js","Control.Plus":"/Users/maximko/Projects/mine/guppi/output/Control.Plus/index.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Monad_State_Class = require("Control.Monad.State.Class");
var Control_Monad_State_Trans = require("Control.Monad.State.Trans");
var Data_Identity = require("Data.Identity");
var Data_Tuple = require("Data.Tuple");
var withState = Control_Monad_State_Trans.withStateT;
var runState = function (s) {
    return function (_0) {
        return Data_Identity.runIdentity(Control_Monad_State_Trans.runStateT(s)(_0));
    };
};
var mapState = function (f) {
    return Control_Monad_State_Trans.mapStateT(function (_1) {
        return Data_Identity.Identity(f(Data_Identity.runIdentity(_1)));
    });
};
var execState = function (m) {
    return function (s) {
        return Data_Tuple.snd(runState(m)(s));
    };
};
var evalState = function (m) {
    return function (s) {
        return Data_Tuple.fst(runState(m)(s));
    };
};
module.exports = {
    withState: withState, 
    mapState: mapState, 
    execState: execState, 
    evalState: evalState, 
    runState: runState
};

},{"Control.Monad.State.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State.Class/index.js","Control.Monad.State.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State.Trans/index.js","Data.Identity":"/Users/maximko/Projects/mine/guppi/output/Data.Identity/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Trans/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var MonadTrans = function (lift) {
    this.lift = lift;
};
var lift = function (dict) {
    return dict.lift;
};
module.exports = {
    MonadTrans: MonadTrans, 
    lift: lift
};

},{"Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Writer.Class/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Monoid = require("Data.Monoid");
var Data_Tuple = require("Data.Tuple");
var MonadWriter = function (__superclass_Prelude$dotMonad_0, listen, pass, writer) {
    this["__superclass_Prelude.Monad_0"] = __superclass_Prelude$dotMonad_0;
    this.listen = listen;
    this.pass = pass;
    this.writer = writer;
};
var writer = function (dict) {
    return dict.writer;
};
var tell = function (__dict_Monoid_0) {
    return function (__dict_Monad_1) {
        return function (__dict_MonadWriter_2) {
            return function (w) {
                return writer(__dict_MonadWriter_2)(new Data_Tuple.Tuple(Prelude.unit, w));
            };
        };
    };
};
var pass = function (dict) {
    return dict.pass;
};
var listen = function (dict) {
    return dict.listen;
};
var listens = function (__dict_Monoid_3) {
    return function (__dict_Monad_4) {
        return function (__dict_MonadWriter_5) {
            return function (f) {
                return function (m) {
                    return Prelude.bind(__dict_Monad_4["__superclass_Prelude.Bind_1"]())(listen(__dict_MonadWriter_5)(m))(function (_0) {
                        return Prelude["return"](__dict_Monad_4["__superclass_Prelude.Applicative_0"]())(new Data_Tuple.Tuple(_0.value0, f(_0.value1)));
                    });
                };
            };
        };
    };
};
var censor = function (__dict_Monoid_6) {
    return function (__dict_Monad_7) {
        return function (__dict_MonadWriter_8) {
            return function (f) {
                return function (m) {
                    return pass(__dict_MonadWriter_8)(Prelude.bind(__dict_Monad_7["__superclass_Prelude.Bind_1"]())(m)(function (_1) {
                        return Prelude["return"](__dict_Monad_7["__superclass_Prelude.Applicative_0"]())(new Data_Tuple.Tuple(_1, f));
                    }));
                };
            };
        };
    };
};
module.exports = {
    MonadWriter: MonadWriter, 
    censor: censor, 
    listens: listens, 
    tell: tell, 
    pass: pass, 
    listen: listen, 
    writer: writer
};

},{"Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Writer.Trans/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Either = require("Data.Either");
var Data_Monoid = require("Data.Monoid");
var Data_Tuple = require("Data.Tuple");
var Control_Alt = require("Control.Alt");
var Control_Alternative = require("Control.Alternative");
var Control_Monad_Cont_Class = require("Control.Monad.Cont.Class");
var Control_Monad_Eff_Class = require("Control.Monad.Eff.Class");
var Control_Monad_Error_Class = require("Control.Monad.Error.Class");
var Control_Monad_Reader_Class = require("Control.Monad.Reader.Class");
var Control_Monad_Rec_Class = require("Control.Monad.Rec.Class");
var Control_Monad_State_Class = require("Control.Monad.State.Class");
var Control_Monad_Trans = require("Control.Monad.Trans");
var Control_Monad_Writer_Class = require("Control.Monad.Writer.Class");
var Control_MonadPlus = require("Control.MonadPlus");
var Control_Plus = require("Control.Plus");
var WriterT = function (x) {
    return x;
};
var runWriterT = function (_7) {
    return _7;
};
var monadTransWriterT = function (__dict_Monoid_5) {
    return new Control_Monad_Trans.MonadTrans(function (__dict_Monad_6) {
        return function (m) {
            return WriterT(Prelude.bind(__dict_Monad_6["__superclass_Prelude.Bind_1"]())(m)(function (_3) {
                return Prelude["return"](__dict_Monad_6["__superclass_Prelude.Applicative_0"]())(new Data_Tuple.Tuple(_3, Data_Monoid.mempty(__dict_Monoid_5)));
            }));
        };
    });
};
var mapWriterT = function (f) {
    return function (m) {
        return WriterT(f(runWriterT(m)));
    };
};
var functorWriterT = function (__dict_Functor_22) {
    return new Prelude.Functor(function (f) {
        return mapWriterT(Prelude["<$>"](__dict_Functor_22)(function (_6) {
            return new Data_Tuple.Tuple(f(_6.value0), _6.value1);
        }));
    });
};
var execWriterT = function (__dict_Apply_23) {
    return function (m) {
        return Prelude["<$>"](__dict_Apply_23["__superclass_Prelude.Functor_0"]())(Data_Tuple.snd)(runWriterT(m));
    };
};
var applyWriterT = function (__dict_Semigroup_26) {
    return function (__dict_Apply_27) {
        return new Prelude.Apply(function () {
            return functorWriterT(__dict_Apply_27["__superclass_Prelude.Functor_0"]());
        }, function (f) {
            return function (v) {
                return WriterT((function () {
                    var k = function (_8) {
                        return function (_9) {
                            return new Data_Tuple.Tuple(_8.value0(_9.value0), Prelude["<>"](__dict_Semigroup_26)(_8.value1)(_9.value1));
                        };
                    };
                    return Prelude["<*>"](__dict_Apply_27)(Prelude["<$>"](__dict_Apply_27["__superclass_Prelude.Functor_0"]())(k)(runWriterT(f)))(runWriterT(v));
                })());
            };
        });
    };
};
var bindWriterT = function (__dict_Semigroup_24) {
    return function (__dict_Monad_25) {
        return new Prelude.Bind(function () {
            return applyWriterT(__dict_Semigroup_24)((__dict_Monad_25["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]());
        }, function (m) {
            return function (k) {
                return WriterT(Prelude.bind(__dict_Monad_25["__superclass_Prelude.Bind_1"]())(runWriterT(m))(function (_1) {
                    return Prelude.bind(__dict_Monad_25["__superclass_Prelude.Bind_1"]())(runWriterT(k(_1.value0)))(function (_0) {
                        return Prelude["return"](__dict_Monad_25["__superclass_Prelude.Applicative_0"]())(new Data_Tuple.Tuple(_0.value0, Prelude["<>"](__dict_Semigroup_24)(_1.value1)(_0.value1)));
                    });
                }));
            };
        });
    };
};
var applicativeWriterT = function (__dict_Monoid_28) {
    return function (__dict_Applicative_29) {
        return new Prelude.Applicative(function () {
            return applyWriterT(__dict_Monoid_28["__superclass_Prelude.Semigroup_0"]())(__dict_Applicative_29["__superclass_Prelude.Apply_0"]());
        }, function (a) {
            return WriterT(Prelude.pure(__dict_Applicative_29)(new Data_Tuple.Tuple(a, Data_Monoid.mempty(__dict_Monoid_28))));
        });
    };
};
var monadWriterT = function (__dict_Monoid_3) {
    return function (__dict_Monad_4) {
        return new Prelude.Monad(function () {
            return applicativeWriterT(__dict_Monoid_3)(__dict_Monad_4["__superclass_Prelude.Applicative_0"]());
        }, function () {
            return bindWriterT(__dict_Monoid_3["__superclass_Prelude.Semigroup_0"]())(__dict_Monad_4);
        });
    };
};
var monadContWriterT = function (__dict_Monoid_18) {
    return function (__dict_MonadCont_19) {
        return new Control_Monad_Cont_Class.MonadCont(function () {
            return monadWriterT(__dict_Monoid_18)(__dict_MonadCont_19["__superclass_Prelude.Monad_0"]());
        }, function (f) {
            return WriterT(Control_Monad_Cont_Class.callCC(__dict_MonadCont_19)(function (c) {
                return runWriterT(f(function (a) {
                    return WriterT(c(new Data_Tuple.Tuple(a, Data_Monoid.mempty(__dict_Monoid_18))));
                }));
            }));
        });
    };
};
var monadEffWriter = function (__dict_Monad_15) {
    return function (__dict_Monoid_16) {
        return function (__dict_MonadEff_17) {
            return new Control_Monad_Eff_Class.MonadEff(function () {
                return monadWriterT(__dict_Monoid_16)(__dict_Monad_15);
            }, function (_45) {
                return Control_Monad_Trans.lift(monadTransWriterT(__dict_Monoid_16))(__dict_Monad_15)(Control_Monad_Eff_Class.liftEff(__dict_MonadEff_17)(_45));
            });
        };
    };
};
var monadErrorWriterT = function (__dict_Monoid_13) {
    return function (__dict_MonadError_14) {
        return new Control_Monad_Error_Class.MonadError(function () {
            return monadWriterT(__dict_Monoid_13)(__dict_MonadError_14["__superclass_Prelude.Monad_0"]());
        }, function (m) {
            return function (h) {
                return WriterT(Control_Monad_Error_Class.catchError(__dict_MonadError_14)(runWriterT(m))(function (e) {
                    return runWriterT(h(e));
                }));
            };
        }, function (e) {
            return Control_Monad_Trans.lift(monadTransWriterT(__dict_Monoid_13))(__dict_MonadError_14["__superclass_Prelude.Monad_0"]())(Control_Monad_Error_Class.throwError(__dict_MonadError_14)(e));
        });
    };
};
var monadReaderWriterT = function (__dict_Monoid_20) {
    return function (__dict_MonadReader_21) {
        return new Control_Monad_Reader_Class.MonadReader(function () {
            return monadWriterT(__dict_Monoid_20)(__dict_MonadReader_21["__superclass_Prelude.Monad_0"]());
        }, Control_Monad_Trans.lift(monadTransWriterT(__dict_Monoid_20))(__dict_MonadReader_21["__superclass_Prelude.Monad_0"]())(Control_Monad_Reader_Class.ask(__dict_MonadReader_21)), function (f) {
            return mapWriterT(Control_Monad_Reader_Class.local(__dict_MonadReader_21)(f));
        });
    };
};
var monadRecWriterT = function (__dict_Monoid_9) {
    return function (__dict_MonadRec_10) {
        return new Control_Monad_Rec_Class.MonadRec(function () {
            return monadWriterT(__dict_Monoid_9)(__dict_MonadRec_10["__superclass_Prelude.Monad_0"]());
        }, function (f) {
            return function (a) {
                var f$prime = function (_10) {
                    return Prelude.bind((__dict_MonadRec_10["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())(runWriterT(f(_10.value0)))(function (_2) {
                        return Prelude["return"]((__dict_MonadRec_10["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Applicative_0"]())((function () {
                            if (_2.value0 instanceof Data_Either.Left) {
                                return new Data_Either.Left(new Data_Tuple.Tuple(_2.value0.value0, Prelude["<>"](__dict_Monoid_9["__superclass_Prelude.Semigroup_0"]())(_10.value1)(_2.value1)));
                            };
                            if (_2.value0 instanceof Data_Either.Right) {
                                return new Data_Either.Right(new Data_Tuple.Tuple(_2.value0.value0, Prelude["<>"](__dict_Monoid_9["__superclass_Prelude.Semigroup_0"]())(_10.value1)(_2.value1)));
                            };
                            throw new Error("Failed pattern match at Control.Monad.Writer.Trans line 78, column 5 - line 84, column 1: " + [ _2.value0.constructor.name ]);
                        })());
                    });
                };
                return WriterT(Control_Monad_Rec_Class.tailRecM(__dict_MonadRec_10)(f$prime)(new Data_Tuple.Tuple(a, Data_Monoid.mempty(__dict_Monoid_9))));
            };
        });
    };
};
var monadStateWriterT = function (__dict_Monoid_7) {
    return function (__dict_MonadState_8) {
        return new Control_Monad_State_Class.MonadState(function () {
            return monadWriterT(__dict_Monoid_7)(__dict_MonadState_8["__superclass_Prelude.Monad_0"]());
        }, function (f) {
            return Control_Monad_Trans.lift(monadTransWriterT(__dict_Monoid_7))(__dict_MonadState_8["__superclass_Prelude.Monad_0"]())(Control_Monad_State_Class.state(__dict_MonadState_8)(f));
        });
    };
};
var monadWriterWriterT = function (__dict_Monoid_1) {
    return function (__dict_Monad_2) {
        return new Control_Monad_Writer_Class.MonadWriter(function () {
            return monadWriterT(__dict_Monoid_1)(__dict_Monad_2);
        }, function (m) {
            return WriterT(Prelude.bind(__dict_Monad_2["__superclass_Prelude.Bind_1"]())(runWriterT(m))(function (_4) {
                return Prelude["return"](__dict_Monad_2["__superclass_Prelude.Applicative_0"]())(new Data_Tuple.Tuple(new Data_Tuple.Tuple(_4.value0, _4.value1), _4.value1));
            }));
        }, function (m) {
            return WriterT(Prelude.bind(__dict_Monad_2["__superclass_Prelude.Bind_1"]())(runWriterT(m))(function (_5) {
                return Prelude["return"](__dict_Monad_2["__superclass_Prelude.Applicative_0"]())(new Data_Tuple.Tuple(_5.value0.value0, _5.value0.value1(_5.value1)));
            }));
        }, function (_46) {
            return WriterT(Prelude["return"](__dict_Monad_2["__superclass_Prelude.Applicative_0"]())(_46));
        });
    };
};
var altWriterT = function (__dict_Alt_32) {
    return new Control_Alt.Alt(function () {
        return functorWriterT(__dict_Alt_32["__superclass_Prelude.Functor_0"]());
    }, function (m) {
        return function (n) {
            return WriterT(Control_Alt["<|>"](__dict_Alt_32)(runWriterT(m))(runWriterT(n)));
        };
    });
};
var plusWriterT = function (__dict_Plus_0) {
    return new Control_Plus.Plus(function () {
        return altWriterT(__dict_Plus_0["__superclass_Control.Alt.Alt_0"]());
    }, Control_Plus.empty(__dict_Plus_0));
};
var alternativeWriterT = function (__dict_Monoid_30) {
    return function (__dict_Alternative_31) {
        return new Control_Alternative.Alternative(function () {
            return plusWriterT(__dict_Alternative_31["__superclass_Control.Plus.Plus_1"]());
        }, function () {
            return applicativeWriterT(__dict_Monoid_30)(__dict_Alternative_31["__superclass_Prelude.Applicative_0"]());
        });
    };
};
var monadPlusWriterT = function (__dict_Monoid_11) {
    return function (__dict_MonadPlus_12) {
        return new Control_MonadPlus.MonadPlus(function () {
            return alternativeWriterT(__dict_Monoid_11)(__dict_MonadPlus_12["__superclass_Control.Alternative.Alternative_1"]());
        }, function () {
            return monadWriterT(__dict_Monoid_11)(__dict_MonadPlus_12["__superclass_Prelude.Monad_0"]());
        });
    };
};
module.exports = {
    WriterT: WriterT, 
    mapWriterT: mapWriterT, 
    execWriterT: execWriterT, 
    runWriterT: runWriterT, 
    functorWriterT: functorWriterT, 
    applyWriterT: applyWriterT, 
    applicativeWriterT: applicativeWriterT, 
    altWriterT: altWriterT, 
    plusWriterT: plusWriterT, 
    alternativeWriterT: alternativeWriterT, 
    bindWriterT: bindWriterT, 
    monadWriterT: monadWriterT, 
    monadRecWriterT: monadRecWriterT, 
    monadPlusWriterT: monadPlusWriterT, 
    monadTransWriterT: monadTransWriterT, 
    monadEffWriter: monadEffWriter, 
    monadContWriterT: monadContWriterT, 
    monadErrorWriterT: monadErrorWriterT, 
    monadReaderWriterT: monadReaderWriterT, 
    monadStateWriterT: monadStateWriterT, 
    monadWriterWriterT: monadWriterWriterT
};

},{"Control.Alt":"/Users/maximko/Projects/mine/guppi/output/Control.Alt/index.js","Control.Alternative":"/Users/maximko/Projects/mine/guppi/output/Control.Alternative/index.js","Control.Monad.Cont.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Cont.Class/index.js","Control.Monad.Eff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Class/index.js","Control.Monad.Error.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Error.Class/index.js","Control.Monad.Reader.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Reader.Class/index.js","Control.Monad.Rec.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Rec.Class/index.js","Control.Monad.State.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State.Class/index.js","Control.Monad.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Trans/index.js","Control.Monad.Writer.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Writer.Class/index.js","Control.MonadPlus":"/Users/maximko/Projects/mine/guppi/output/Control.MonadPlus/index.js","Control.Plus":"/Users/maximko/Projects/mine/guppi/output/Control.Plus/index.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Writer/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Monad_Writer_Class = require("Control.Monad.Writer.Class");
var Control_Monad_Writer_Trans = require("Control.Monad.Writer.Trans");
var Data_Identity = require("Data.Identity");
var Data_Tuple = require("Data.Tuple");
var runWriter = function (_0) {
    return Data_Identity.runIdentity(Control_Monad_Writer_Trans.runWriterT(_0));
};
var mapWriter = function (f) {
    return Control_Monad_Writer_Trans.mapWriterT(function (_1) {
        return Data_Identity.Identity(f(Data_Identity.runIdentity(_1)));
    });
};
var execWriter = function (m) {
    return Data_Tuple.snd(runWriter(m));
};
module.exports = {
    mapWriter: mapWriter, 
    execWriter: execWriter, 
    runWriter: runWriter
};

},{"Control.Monad.Writer.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Writer.Class/index.js","Control.Monad.Writer.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Writer.Trans/index.js","Data.Identity":"/Users/maximko/Projects/mine/guppi/output/Data.Identity/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.MonadPlus/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Alternative = require("Control.Alternative");
var Control_Plus = require("Control.Plus");
var MonadPlus = function (__superclass_Control$dotAlternative$dotAlternative_1, __superclass_Prelude$dotMonad_0) {
    this["__superclass_Control.Alternative.Alternative_1"] = __superclass_Control$dotAlternative$dotAlternative_1;
    this["__superclass_Prelude.Monad_0"] = __superclass_Prelude$dotMonad_0;
};
var monadPlusArray = new MonadPlus(function () {
    return Control_Alternative.alternativeArray;
}, function () {
    return Prelude.monadArray;
});
var guard = function (__dict_MonadPlus_0) {
    return function (_0) {
        if (_0) {
            return Prelude["return"]((__dict_MonadPlus_0["__superclass_Control.Alternative.Alternative_1"]())["__superclass_Prelude.Applicative_0"]())(Prelude.unit);
        };
        if (!_0) {
            return Control_Plus.empty((__dict_MonadPlus_0["__superclass_Control.Alternative.Alternative_1"]())["__superclass_Control.Plus.Plus_1"]());
        };
        throw new Error("Failed pattern match at Control.MonadPlus line 35, column 1 - line 36, column 1: " + [ _0.constructor.name ]);
    };
};
module.exports = {
    MonadPlus: MonadPlus, 
    guard: guard, 
    monadPlusArray: monadPlusArray
};

},{"Control.Alternative":"/Users/maximko/Projects/mine/guppi/output/Control.Alternative/index.js","Control.Plus":"/Users/maximko/Projects/mine/guppi/output/Control.Plus/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Control.Plus/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Alt = require("Control.Alt");
var Plus = function (__superclass_Control$dotAlt$dotAlt_0, empty) {
    this["__superclass_Control.Alt.Alt_0"] = __superclass_Control$dotAlt$dotAlt_0;
    this.empty = empty;
};
var plusArray = new Plus(function () {
    return Control_Alt.altArray;
}, [  ]);
var empty = function (dict) {
    return dict.empty;
};
module.exports = {
    Plus: Plus, 
    empty: empty, 
    plusArray: plusArray
};

},{"Control.Alt":"/Users/maximko/Projects/mine/guppi/output/Control.Alt/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Cordova.EventTypes/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var DOM_Event_Types = require("DOM.Event.Types");
var volumeupbutton = "volumeupbutton";
var volumedownbutton = "volumedownbutton";
var startcallbutton = "startcallbutton";
var searchbutton = "searchbutton";
var resume = "resume";
var pause = "pause";
var menubutton = "menubutton";
var endcallbutton = "endcallbutton";
var deviceready = "deviceready";
var backbutton = "backbutton";
module.exports = {
    volumeupbutton: volumeupbutton, 
    volumedownbutton: volumedownbutton, 
    endcallbutton: endcallbutton, 
    startcallbutton: startcallbutton, 
    searchbutton: searchbutton, 
    menubutton: menubutton, 
    backbutton: backbutton, 
    resume: resume, 
    pause: pause, 
    deviceready: deviceready
};

},{"DOM.Event.Types":"/Users/maximko/Projects/mine/guppi/output/DOM.Event.Types/index.js"}],"/Users/maximko/Projects/mine/guppi/output/DOM.Event.EventTarget/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module DOM.Event.EventTarget

exports.eventListener = function (fn) {
  return function (event) {
    return fn(event)();
  };
};

exports.addEventListener = function (type) {
  return function (listener) {
    return function (useCapture) {
      return function (target) {
        return function () {
          target.addEventListener(type, listener, useCapture);
          return {};
        };
      };
    };
  };
};

exports.removeEventListener = function (type) {
  return function (listener) {
    return function (useCapture) {
      return function (target) {
        return function () {
          target.removeEventListener(type, listener, useCapture);
          return {};
        };
      };
    };
  };
};

exports.dispatchEvent = function (event) {
  return function (target) {
    return function () {
      return target.dispatchEvent(event);
    };
  };
};

},{}],"/Users/maximko/Projects/mine/guppi/output/DOM.Event.EventTarget/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Control_Monad_Eff = require("Control.Monad.Eff");
var Control_Monad_Eff_Exception = require("Control.Monad.Eff.Exception");
var DOM = require("DOM");
var DOM_Event_Types = require("DOM.Event.Types");
module.exports = {
    dispatchEvent: $foreign.dispatchEvent, 
    removeEventListener: $foreign.removeEventListener, 
    addEventListener: $foreign.addEventListener, 
    eventListener: $foreign.eventListener
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/DOM.Event.EventTarget/foreign.js","Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","Control.Monad.Eff.Exception":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Exception/index.js","DOM":"/Users/maximko/Projects/mine/guppi/output/DOM/index.js","DOM.Event.Types":"/Users/maximko/Projects/mine/guppi/output/DOM.Event.Types/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/DOM.Event.EventTypes/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var DOM_Event_Types = require("DOM.Event.Types");
var wheel = "wheel";
var waiting = "waiting";
var volumechange = "volumechange";
var visibilitychange = "visibilitychange";
var unload = "unload";
var transitionend = "transitionend";
var touchstart = "touchstart";
var touchmove = "touchmove";
var touchleave = "touchleave";
var touchenter = "touchenter";
var touchend = "touchend";
var touchcancel = "touchcancel";
var timeupdate = "timeupdate";
var timeout = "timeout";
var suspend = "suspend";
var submit = "submit";
var stalled = "stalled";
var show = "show";
var select = "select";
var seeking = "seeking";
var seeked = "seeked";
var scroll = "scroll";
var resize = "resize";
var reset = "reset";
var readystatechange = "readystatechange";
var ratechange = "ratechange";
var progress = "progress";
var popstate = "popstate";
var playing = "playing";
var play = "play";
var pause = "pause";
var paste = "paste";
var pageshow = "pageshow";
var pagehide = "pagehide";
var open = "open";
var mouseup = "mouseup";
var mouseover = "mouseover";
var mouseout = "mouseout";
var mousemove = "mousemove";
var mouseleave = "mouseleave";
var mouseenter = "mouseenter";
var mousedown = "mousedown";
var message = "message";
var loadstart = "loadstart";
var loadend = "loadend";
var loadedmetadata = "loadedmetadata";
var loadeddata = "loadeddata";
var load = "load";
var keyup = "keyup";
var keypress = "keypress";
var keydown = "keydown";
var invalid = "invalid";
var input = "input";
var hashchange = "hashchange";
var fullscreenerror = "fullscreenerror";
var fullscreenchange = "fullscreenchange";
var focus = "focus";
var error = "error";
var ended = "ended";
var emptied = "emptied";
var durationchange = "durationchange";
var drop = "drop";
var dragstart = "dragstart";
var dragover = "dragover";
var dragleave = "dragleave";
var dragenter = "dragenter";
var dragend = "dragend";
var drag = "drag";
var dblclick = "dblclick";
var cut = "cut";
var copy = "copy";
var contextmenu = "contextmenu";
var compositionupdate = "compositionupdate";
var compositionstart = "compositionstart";
var compositionend = "compositionend";
var complete = "complete";
var click = "click";
var change = "change";
var canplaythrough = "canplaythrough";
var canplay = "canplay";
var blur = "blur";
var beforeunload = "beforeunload";
var beforeprint = "beforeprint";
var audioprocess = "audioprocess";
var animationstart = "animationstart";
var animationiteration = "animationiteration";
var animationend = "animationend";
var abort = "abort";
module.exports = {
    wheel: wheel, 
    waiting: waiting, 
    volumechange: volumechange, 
    visibilitychange: visibilitychange, 
    unload: unload, 
    transitionend: transitionend, 
    touchstart: touchstart, 
    touchmove: touchmove, 
    touchleave: touchleave, 
    touchenter: touchenter, 
    touchend: touchend, 
    touchcancel: touchcancel, 
    timeupdate: timeupdate, 
    timeout: timeout, 
    suspend: suspend, 
    submit: submit, 
    stalled: stalled, 
    show: show, 
    select: select, 
    seeking: seeking, 
    seeked: seeked, 
    scroll: scroll, 
    resize: resize, 
    reset: reset, 
    readystatechange: readystatechange, 
    ratechange: ratechange, 
    progress: progress, 
    popstate: popstate, 
    playing: playing, 
    play: play, 
    pause: pause, 
    paste: paste, 
    pageshow: pageshow, 
    pagehide: pagehide, 
    open: open, 
    mouseup: mouseup, 
    mouseover: mouseover, 
    mouseout: mouseout, 
    mousemove: mousemove, 
    mouseleave: mouseleave, 
    mouseenter: mouseenter, 
    mousedown: mousedown, 
    message: message, 
    loadstart: loadstart, 
    loadend: loadend, 
    loadedmetadata: loadedmetadata, 
    loadeddata: loadeddata, 
    load: load, 
    keyup: keyup, 
    keypress: keypress, 
    keydown: keydown, 
    invalid: invalid, 
    input: input, 
    hashchange: hashchange, 
    fullscreenerror: fullscreenerror, 
    fullscreenchange: fullscreenchange, 
    focus: focus, 
    error: error, 
    ended: ended, 
    emptied: emptied, 
    durationchange: durationchange, 
    drop: drop, 
    dragstart: dragstart, 
    dragover: dragover, 
    dragleave: dragleave, 
    dragenter: dragenter, 
    dragend: dragend, 
    drag: drag, 
    dblclick: dblclick, 
    cut: cut, 
    copy: copy, 
    contextmenu: contextmenu, 
    compositionupdate: compositionupdate, 
    compositionstart: compositionstart, 
    compositionend: compositionend, 
    complete: complete, 
    click: click, 
    change: change, 
    canplaythrough: canplaythrough, 
    canplay: canplay, 
    blur: blur, 
    beforeunload: beforeunload, 
    beforeprint: beforeprint, 
    audioprocess: audioprocess, 
    animationstart: animationstart, 
    animationiteration: animationiteration, 
    animationend: animationend, 
    abort: abort
};

},{"DOM.Event.Types":"/Users/maximko/Projects/mine/guppi/output/DOM.Event.Types/index.js"}],"/Users/maximko/Projects/mine/guppi/output/DOM.Event.Types/foreign.js":[function(require,module,exports){
/* global exports, EventTarget */
"use strict";

// module DOM.Event.Types

exports._readEventTarget = function (left) {
  return function (right) {
    return function (foreign) {
      return foreign instanceof EventTarget ? left("Value is not an EventTarget") : right(foreign);
    };
  };
};

},{}],"/Users/maximko/Projects/mine/guppi/output/DOM.Event.Types/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Data_Either = require("Data.Either");
var Data_Foreign = require("Data.Foreign");
var Data_Foreign_Class = require("Data.Foreign.Class");
var Unsafe_Coerce = require("Unsafe.Coerce");
var EventType = function (x) {
    return x;
};
var unsafeToEvent = Unsafe_Coerce.unsafeCoerce;
var userProximityEventToEvent = unsafeToEvent;
var wheelEventToEvent = unsafeToEvent;
var uiEventToEvent = unsafeToEvent;
var transitionEventToEvent = unsafeToEvent;
var touchEventToEvent = unsafeToEvent;
var timeEventToEvent = unsafeToEvent;
var svgZoomEventToEvent = unsafeToEvent;
var svgEventToEvent = unsafeToEvent;
var storageEventToEvent = unsafeToEvent;
var sensorEventToEvent = unsafeToEvent;
var rtcPeerConnectionIceEventToEvent = unsafeToEvent;
var rtcIdentityEventToEvent = unsafeToEvent;
var rtcIdentityErrorEventToEvent = unsafeToEvent;
var rtcDataChannelEventToEvent = unsafeToEvent;
var relatedEventToEvent = unsafeToEvent;
var readWheelEvent = Data_Foreign.unsafeReadTagged("WheelEvent");
var readUserProximityEvent = Data_Foreign.unsafeReadTagged("UserProximityEvent");
var readUIEvent = Data_Foreign.unsafeReadTagged("UIEvent");
var readTransitionEvent = Data_Foreign.unsafeReadTagged("TransitionEvent");
var readTouchEvent = Data_Foreign.unsafeReadTagged("TouchEvent");
var readTimeEvent = Data_Foreign.unsafeReadTagged("TimeEvent");
var readStorageEvent = Data_Foreign.unsafeReadTagged("StorageEvent");
var readSensorEvent = Data_Foreign.unsafeReadTagged("SensorEvent");
var readSVGZoomEvent = Data_Foreign.unsafeReadTagged("SVGZoomEvent");
var readSVGEvent = Data_Foreign.unsafeReadTagged("SVGEvent");
var readRelatedEvent = Data_Foreign.unsafeReadTagged("RelatedEvent");
var readRTCPeerConnectionIceEvent = Data_Foreign.unsafeReadTagged("RTCPeerConnectionIceEvent");
var readRTCIdentityEvent = Data_Foreign.unsafeReadTagged("RTCIdentityEvent");
var readRTCIdentityErrorEvent = Data_Foreign.unsafeReadTagged("RTCIdentityErrorEvent");
var readRTCDataChannelEvent = Data_Foreign.unsafeReadTagged("RTCDataChannelEvent");
var readProgressEvent = Data_Foreign.unsafeReadTagged("ProgressEvent");
var readPopStateEvent = Data_Foreign.unsafeReadTagged("PopStateEvent");
var readPointerEvent = Data_Foreign.unsafeReadTagged("PointerEvent");
var readPageTransitionEvent = Data_Foreign.unsafeReadTagged("PageTransitionEvent");
var readOfflineAudioCompletionEvent = Data_Foreign.unsafeReadTagged("OfflineAudioCompletionEvent");
var readMutationEvent = Data_Foreign.unsafeReadTagged("MutationEvent");
var readMouseEvent = Data_Foreign.unsafeReadTagged("MouseEvent");
var readMessageEvent = Data_Foreign.unsafeReadTagged("MessageEvent");
var readMediaStreamEvent = Data_Foreign.unsafeReadTagged("MediaStreamEvent");
var readKeyboardEvent = Data_Foreign.unsafeReadTagged("KeyboardEvent");
var readInputEvent = Data_Foreign.unsafeReadTagged("InputEvent");
var readIDBVersionChangeEvent = Data_Foreign.unsafeReadTagged("IDBVersionChangeEvent");
var readHashChangeEvent = Data_Foreign.unsafeReadTagged("HashChangeEvent");
var readGamepadEvent = Data_Foreign.unsafeReadTagged("GamepadEvent");
var readFocusEvent = Data_Foreign.unsafeReadTagged("FocusEvent");
var readFetchEvent = Data_Foreign.unsafeReadTagged("FetchEvent");
var readEventTarget = $foreign._readEventTarget(Data_Either.Left.create)(Data_Either.Right.create);
var readErrorEvent = Data_Foreign.unsafeReadTagged("ErrorEvent");
var readEditingBeforeInputEvent = Data_Foreign.unsafeReadTagged("EditingBeforeInputEvent");
var readDragEvent = Data_Foreign.unsafeReadTagged("DragEvent");
var readDeviceProximityEvent = Data_Foreign.unsafeReadTagged("DeviceProximityEvent");
var readDeviceOrientationEvent = Data_Foreign.unsafeReadTagged("DeviceOrientationEvent");
var readDeviceMotionEvent = Data_Foreign.unsafeReadTagged("DeviceMotionEvent");
var readDeviceLightEvent = Data_Foreign.unsafeReadTagged("DeviceLightEvent");
var readDOMTransactionEvent = Data_Foreign.unsafeReadTagged("DOMTransactionEvent");
var readCustomEvent = Data_Foreign.unsafeReadTagged("CustomEvent");
var readCompositionEvent = Data_Foreign.unsafeReadTagged("CompositionEvent");
var readCloseEvent = Data_Foreign.unsafeReadTagged("CloseEvent");
var readClipboardEvent = Data_Foreign.unsafeReadTagged("ClipboardEvent");
var readCSSFontFaceLoadEvent = Data_Foreign.unsafeReadTagged("CSSFontFaceLoadEvent");
var readBlobEvent = Data_Foreign.unsafeReadTagged("BlobEvent");
var readBeforeUnloadEvent = Data_Foreign.unsafeReadTagged("BeforeUnloadEvent");
var readBeforeInputEvent = Data_Foreign.unsafeReadTagged("BeforeInputEvent");
var readAudioProcessingEvent = Data_Foreign.unsafeReadTagged("AudioProcessingEvent");
var readAnimationEvent = Data_Foreign.unsafeReadTagged("AnimationEvent");
var progressEventToEvent = unsafeToEvent;
var popStateEventToEvent = unsafeToEvent;
var pointerEventToEvent = unsafeToEvent;
var pageTransitionEventToEvent = unsafeToEvent;
var offlineAudioCompletionEventToEvent = unsafeToEvent;
var mutationEventToEvent = unsafeToEvent;
var mouseEventToEvent = unsafeToEvent;
var messageEventToEvent = unsafeToEvent;
var mediaStreamEventToEvent = unsafeToEvent;
var keyboardEventToEvent = unsafeToEvent;
var isForeignWheelEvent = new Data_Foreign_Class.IsForeign(readWheelEvent);
var isForeignUserProximityEvent = new Data_Foreign_Class.IsForeign(readUserProximityEvent);
var isForeignUIEvent = new Data_Foreign_Class.IsForeign(readUIEvent);
var isForeignTransitionEvent = new Data_Foreign_Class.IsForeign(readTransitionEvent);
var isForeignTouchEvent = new Data_Foreign_Class.IsForeign(readTouchEvent);
var isForeignTimeEvent = new Data_Foreign_Class.IsForeign(readTimeEvent);
var isForeignStorageEvent = new Data_Foreign_Class.IsForeign(readStorageEvent);
var isForeignSensorEvent = new Data_Foreign_Class.IsForeign(readSensorEvent);
var isForeignSVGZoomEvent = new Data_Foreign_Class.IsForeign(readSVGZoomEvent);
var isForeignSVGEvent = new Data_Foreign_Class.IsForeign(readSVGEvent);
var isForeignRelatedEvent = new Data_Foreign_Class.IsForeign(readRelatedEvent);
var isForeignRTCPeerConnectionIceEvent = new Data_Foreign_Class.IsForeign(readRTCPeerConnectionIceEvent);
var isForeignRTCIdentityEvent = new Data_Foreign_Class.IsForeign(readRTCIdentityEvent);
var isForeignRTCIdentityErrorEvent = new Data_Foreign_Class.IsForeign(readRTCIdentityErrorEvent);
var isForeignRTCDataChannelEvent = new Data_Foreign_Class.IsForeign(readRTCDataChannelEvent);
var isForeignProgressEvent = new Data_Foreign_Class.IsForeign(readProgressEvent);
var isForeignPopStateEvent = new Data_Foreign_Class.IsForeign(readPopStateEvent);
var isForeignPointerEvent = new Data_Foreign_Class.IsForeign(readPointerEvent);
var isForeignPageTransitionEvent = new Data_Foreign_Class.IsForeign(readPageTransitionEvent);
var isForeignOfflineAudioCompletionEvent = new Data_Foreign_Class.IsForeign(readOfflineAudioCompletionEvent);
var isForeignMutationEvent = new Data_Foreign_Class.IsForeign(readMutationEvent);
var isForeignMouseEvent = new Data_Foreign_Class.IsForeign(readMouseEvent);
var isForeignMessageEvent = new Data_Foreign_Class.IsForeign(readMessageEvent);
var isForeignMediaStreamEvent = new Data_Foreign_Class.IsForeign(readMediaStreamEvent);
var isForeignKeyboardEvent = new Data_Foreign_Class.IsForeign(readKeyboardEvent);
var isForeignInputEvent = new Data_Foreign_Class.IsForeign(readInputEvent);
var isForeignIDBVersionChangeEvent = new Data_Foreign_Class.IsForeign(readIDBVersionChangeEvent);
var isForeignHashChangeEvent = new Data_Foreign_Class.IsForeign(readHashChangeEvent);
var isForeignGamepadEvent = new Data_Foreign_Class.IsForeign(readGamepadEvent);
var isForeignFocusEvent = new Data_Foreign_Class.IsForeign(readFocusEvent);
var isForeignFetchEvent = new Data_Foreign_Class.IsForeign(readFetchEvent);
var isForeignEventTarget = new Data_Foreign_Class.IsForeign(readEventTarget);
var isForeignErrorEvent = new Data_Foreign_Class.IsForeign(readErrorEvent);
var isForeignEditingBeforeInputEvent = new Data_Foreign_Class.IsForeign(readEditingBeforeInputEvent);
var isForeignDragEvent = new Data_Foreign_Class.IsForeign(readDragEvent);
var isForeignDeviceProximityEvent = new Data_Foreign_Class.IsForeign(readDeviceProximityEvent);
var isForeignDeviceOrientationEvent = new Data_Foreign_Class.IsForeign(readDeviceOrientationEvent);
var isForeignDeviceMotionEvent = new Data_Foreign_Class.IsForeign(readDeviceMotionEvent);
var isForeignDeviceLightEvent = new Data_Foreign_Class.IsForeign(readDeviceLightEvent);
var isForeignDOMTransactionEvent = new Data_Foreign_Class.IsForeign(readDOMTransactionEvent);
var isForeignCustomEvent = new Data_Foreign_Class.IsForeign(readCustomEvent);
var isForeignCompositionEvent = new Data_Foreign_Class.IsForeign(readCompositionEvent);
var isForeignCloseEvent = new Data_Foreign_Class.IsForeign(readCloseEvent);
var isForeignClipboardEvent = new Data_Foreign_Class.IsForeign(readClipboardEvent);
var isForeignCSSFontFaceLoadEvent = new Data_Foreign_Class.IsForeign(readCSSFontFaceLoadEvent);
var isForeignBlobEvent = new Data_Foreign_Class.IsForeign(readBlobEvent);
var isForeignBeforeUnloadEvent = new Data_Foreign_Class.IsForeign(readBeforeUnloadEvent);
var isForeignBeforeInputEvent = new Data_Foreign_Class.IsForeign(readBeforeInputEvent);
var isForeignAudioProcessingEvent = new Data_Foreign_Class.IsForeign(readAudioProcessingEvent);
var isForeignAnimationEvent = new Data_Foreign_Class.IsForeign(readAnimationEvent);
var inputEventToEvent = unsafeToEvent;
var idbVersionChangeEventToEvent = unsafeToEvent;
var hashChangeEventToEvent = unsafeToEvent;
var gamepadEventToEvent = unsafeToEvent;
var focusEventToEvent = unsafeToEvent;
var fetchEventToEvent = unsafeToEvent;
var errorEventToEvent = unsafeToEvent;
var eqEventType = new Prelude.Eq(function (_0) {
    return function (_1) {
        return Prelude["=="](Prelude.eqString)(_0)(_1);
    };
});
var ordEventType = new Prelude.Ord(function () {
    return eqEventType;
}, function (_2) {
    return function (_3) {
        return Prelude.compare(Prelude.ordString)(_2)(_3);
    };
});
var editingBeforeInputEventToEvent = unsafeToEvent;
var dragEventToEvent = unsafeToEvent;
var domTransactionEventToEvent = unsafeToEvent;
var deviceProximityEventToEvent = unsafeToEvent;
var deviceOrientationEventToEvent = unsafeToEvent;
var deviceMotionEventToEvent = unsafeToEvent;
var deviceLightEventToEvent = unsafeToEvent;
var customEventToEvent = unsafeToEvent;
var cssFontFaceLoadEventToEvent = unsafeToEvent;
var compositionEventToEvent = unsafeToEvent;
var closeEventToEvent = unsafeToEvent;
var clipboardEventToEvent = unsafeToEvent;
var blobEventToEvent = unsafeToEvent;
var beforeUnloadEventToEvent = unsafeToEvent;
var beforeInputEventToEvent = unsafeToEvent;
var audioProcessingEventToEvent = unsafeToEvent;
var animationEventToEvent = unsafeToEvent;
module.exports = {
    EventType: EventType, 
    readWheelEvent: readWheelEvent, 
    wheelEventToEvent: wheelEventToEvent, 
    readUserProximityEvent: readUserProximityEvent, 
    userProximityEventToEvent: userProximityEventToEvent, 
    readUIEvent: readUIEvent, 
    uiEventToEvent: uiEventToEvent, 
    readTransitionEvent: readTransitionEvent, 
    transitionEventToEvent: transitionEventToEvent, 
    readTouchEvent: readTouchEvent, 
    touchEventToEvent: touchEventToEvent, 
    readTimeEvent: readTimeEvent, 
    timeEventToEvent: timeEventToEvent, 
    readSVGZoomEvent: readSVGZoomEvent, 
    svgZoomEventToEvent: svgZoomEventToEvent, 
    readSVGEvent: readSVGEvent, 
    svgEventToEvent: svgEventToEvent, 
    readStorageEvent: readStorageEvent, 
    storageEventToEvent: storageEventToEvent, 
    readSensorEvent: readSensorEvent, 
    sensorEventToEvent: sensorEventToEvent, 
    readRTCPeerConnectionIceEvent: readRTCPeerConnectionIceEvent, 
    rtcPeerConnectionIceEventToEvent: rtcPeerConnectionIceEventToEvent, 
    readRTCIdentityEvent: readRTCIdentityEvent, 
    rtcIdentityEventToEvent: rtcIdentityEventToEvent, 
    readRTCIdentityErrorEvent: readRTCIdentityErrorEvent, 
    rtcIdentityErrorEventToEvent: rtcIdentityErrorEventToEvent, 
    readRTCDataChannelEvent: readRTCDataChannelEvent, 
    rtcDataChannelEventToEvent: rtcDataChannelEventToEvent, 
    readRelatedEvent: readRelatedEvent, 
    relatedEventToEvent: relatedEventToEvent, 
    readProgressEvent: readProgressEvent, 
    progressEventToEvent: progressEventToEvent, 
    readPopStateEvent: readPopStateEvent, 
    popStateEventToEvent: popStateEventToEvent, 
    readPointerEvent: readPointerEvent, 
    pointerEventToEvent: pointerEventToEvent, 
    readPageTransitionEvent: readPageTransitionEvent, 
    pageTransitionEventToEvent: pageTransitionEventToEvent, 
    readOfflineAudioCompletionEvent: readOfflineAudioCompletionEvent, 
    offlineAudioCompletionEventToEvent: offlineAudioCompletionEventToEvent, 
    readMutationEvent: readMutationEvent, 
    mutationEventToEvent: mutationEventToEvent, 
    readMouseEvent: readMouseEvent, 
    mouseEventToEvent: mouseEventToEvent, 
    readMessageEvent: readMessageEvent, 
    messageEventToEvent: messageEventToEvent, 
    readMediaStreamEvent: readMediaStreamEvent, 
    mediaStreamEventToEvent: mediaStreamEventToEvent, 
    readKeyboardEvent: readKeyboardEvent, 
    keyboardEventToEvent: keyboardEventToEvent, 
    readInputEvent: readInputEvent, 
    inputEventToEvent: inputEventToEvent, 
    readIDBVersionChangeEvent: readIDBVersionChangeEvent, 
    idbVersionChangeEventToEvent: idbVersionChangeEventToEvent, 
    readHashChangeEvent: readHashChangeEvent, 
    hashChangeEventToEvent: hashChangeEventToEvent, 
    readGamepadEvent: readGamepadEvent, 
    gamepadEventToEvent: gamepadEventToEvent, 
    readFocusEvent: readFocusEvent, 
    focusEventToEvent: focusEventToEvent, 
    readFetchEvent: readFetchEvent, 
    fetchEventToEvent: fetchEventToEvent, 
    readErrorEvent: readErrorEvent, 
    errorEventToEvent: errorEventToEvent, 
    readEditingBeforeInputEvent: readEditingBeforeInputEvent, 
    editingBeforeInputEventToEvent: editingBeforeInputEventToEvent, 
    readDragEvent: readDragEvent, 
    dragEventToEvent: dragEventToEvent, 
    readDOMTransactionEvent: readDOMTransactionEvent, 
    domTransactionEventToEvent: domTransactionEventToEvent, 
    readDeviceProximityEvent: readDeviceProximityEvent, 
    deviceProximityEventToEvent: deviceProximityEventToEvent, 
    readDeviceOrientationEvent: readDeviceOrientationEvent, 
    deviceOrientationEventToEvent: deviceOrientationEventToEvent, 
    readDeviceMotionEvent: readDeviceMotionEvent, 
    deviceMotionEventToEvent: deviceMotionEventToEvent, 
    readDeviceLightEvent: readDeviceLightEvent, 
    deviceLightEventToEvent: deviceLightEventToEvent, 
    readCustomEvent: readCustomEvent, 
    customEventToEvent: customEventToEvent, 
    readCSSFontFaceLoadEvent: readCSSFontFaceLoadEvent, 
    cssFontFaceLoadEventToEvent: cssFontFaceLoadEventToEvent, 
    readCompositionEvent: readCompositionEvent, 
    compositionEventToEvent: compositionEventToEvent, 
    readCloseEvent: readCloseEvent, 
    closeEventToEvent: closeEventToEvent, 
    readClipboardEvent: readClipboardEvent, 
    clipboardEventToEvent: clipboardEventToEvent, 
    readBlobEvent: readBlobEvent, 
    blobEventToEvent: blobEventToEvent, 
    readBeforeUnloadEvent: readBeforeUnloadEvent, 
    beforeUnloadEventToEvent: beforeUnloadEventToEvent, 
    readBeforeInputEvent: readBeforeInputEvent, 
    beforeInputEventToEvent: beforeInputEventToEvent, 
    readAudioProcessingEvent: readAudioProcessingEvent, 
    audioProcessingEventToEvent: audioProcessingEventToEvent, 
    readAnimationEvent: readAnimationEvent, 
    animationEventToEvent: animationEventToEvent, 
    readEventTarget: readEventTarget, 
    eqEventType: eqEventType, 
    ordEventType: ordEventType, 
    isForeignEventTarget: isForeignEventTarget, 
    isForeignAnimationEvent: isForeignAnimationEvent, 
    isForeignAudioProcessingEvent: isForeignAudioProcessingEvent, 
    isForeignBeforeInputEvent: isForeignBeforeInputEvent, 
    isForeignBeforeUnloadEvent: isForeignBeforeUnloadEvent, 
    isForeignBlobEvent: isForeignBlobEvent, 
    isForeignClipboardEvent: isForeignClipboardEvent, 
    isForeignCloseEvent: isForeignCloseEvent, 
    isForeignCompositionEvent: isForeignCompositionEvent, 
    isForeignCSSFontFaceLoadEvent: isForeignCSSFontFaceLoadEvent, 
    isForeignCustomEvent: isForeignCustomEvent, 
    isForeignDeviceLightEvent: isForeignDeviceLightEvent, 
    isForeignDeviceMotionEvent: isForeignDeviceMotionEvent, 
    isForeignDeviceOrientationEvent: isForeignDeviceOrientationEvent, 
    isForeignDeviceProximityEvent: isForeignDeviceProximityEvent, 
    isForeignDOMTransactionEvent: isForeignDOMTransactionEvent, 
    isForeignDragEvent: isForeignDragEvent, 
    isForeignEditingBeforeInputEvent: isForeignEditingBeforeInputEvent, 
    isForeignErrorEvent: isForeignErrorEvent, 
    isForeignFetchEvent: isForeignFetchEvent, 
    isForeignFocusEvent: isForeignFocusEvent, 
    isForeignGamepadEvent: isForeignGamepadEvent, 
    isForeignHashChangeEvent: isForeignHashChangeEvent, 
    isForeignIDBVersionChangeEvent: isForeignIDBVersionChangeEvent, 
    isForeignInputEvent: isForeignInputEvent, 
    isForeignKeyboardEvent: isForeignKeyboardEvent, 
    isForeignMediaStreamEvent: isForeignMediaStreamEvent, 
    isForeignMessageEvent: isForeignMessageEvent, 
    isForeignMouseEvent: isForeignMouseEvent, 
    isForeignMutationEvent: isForeignMutationEvent, 
    isForeignOfflineAudioCompletionEvent: isForeignOfflineAudioCompletionEvent, 
    isForeignPageTransitionEvent: isForeignPageTransitionEvent, 
    isForeignPointerEvent: isForeignPointerEvent, 
    isForeignPopStateEvent: isForeignPopStateEvent, 
    isForeignProgressEvent: isForeignProgressEvent, 
    isForeignRelatedEvent: isForeignRelatedEvent, 
    isForeignRTCDataChannelEvent: isForeignRTCDataChannelEvent, 
    isForeignRTCIdentityErrorEvent: isForeignRTCIdentityErrorEvent, 
    isForeignRTCIdentityEvent: isForeignRTCIdentityEvent, 
    isForeignRTCPeerConnectionIceEvent: isForeignRTCPeerConnectionIceEvent, 
    isForeignSensorEvent: isForeignSensorEvent, 
    isForeignStorageEvent: isForeignStorageEvent, 
    isForeignSVGEvent: isForeignSVGEvent, 
    isForeignSVGZoomEvent: isForeignSVGZoomEvent, 
    isForeignTimeEvent: isForeignTimeEvent, 
    isForeignTouchEvent: isForeignTouchEvent, 
    isForeignTransitionEvent: isForeignTransitionEvent, 
    isForeignUIEvent: isForeignUIEvent, 
    isForeignUserProximityEvent: isForeignUserProximityEvent, 
    isForeignWheelEvent: isForeignWheelEvent
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/DOM.Event.Types/foreign.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Foreign/index.js","Data.Foreign.Class":"/Users/maximko/Projects/mine/guppi/output/Data.Foreign.Class/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js","Unsafe.Coerce":"/Users/maximko/Projects/mine/guppi/output/Unsafe.Coerce/index.js"}],"/Users/maximko/Projects/mine/guppi/output/DOM.HTML.Types/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module DOM.HTML.Types

exports._readHTMLElement = function (failure) {
  return function (success) {
    return function (value) {
      var tag = Object.prototype.toString.call(value);
      if (tag.indexOf("[object HTML") === 0 && tag.indexOf("Element]") === tag.length - 8) {
        return success(value);
      } else {
        return failure(tag);
      }
    };
  };
};

},{}],"/Users/maximko/Projects/mine/guppi/output/DOM.HTML.Types/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Data_Either = require("Data.Either");
var Data_Foreign = require("Data.Foreign");
var Data_Foreign_Class = require("Data.Foreign.Class");
var DOM_Event_Types = require("DOM.Event.Types");
var DOM_Node_Types = require("DOM.Node.Types");
var Unsafe_Coerce = require("Unsafe.Coerce");
var windowToEventTarget = Unsafe_Coerce.unsafeCoerce;
var readHTMLElement = $foreign._readHTMLElement(function (_0) {
    return Data_Either.Left.create(Data_Foreign.TypeMismatch.create("HTMLElement")(_0));
})(Data_Either.Right.create);
var readHTMLDocument = Data_Foreign.unsafeReadTagged("HTMLDocument");
var isForeignHTMLElement = new Data_Foreign_Class.IsForeign(readHTMLElement);
var isForeignHTMLDocument = new Data_Foreign_Class.IsForeign(readHTMLDocument);
var htmlElementToParentNode = Unsafe_Coerce.unsafeCoerce;
var htmlElementToNonDocumentTypeChildNode = Unsafe_Coerce.unsafeCoerce;
var htmlElementToNode = Unsafe_Coerce.unsafeCoerce;
var htmlElementToEventTarget = Unsafe_Coerce.unsafeCoerce;
var htmlElementToElement = Unsafe_Coerce.unsafeCoerce;
var htmlDocumentToParentNode = Unsafe_Coerce.unsafeCoerce;
var htmlDocumentToNonElementParentNode = Unsafe_Coerce.unsafeCoerce;
var htmlDocumentToNode = Unsafe_Coerce.unsafeCoerce;
var htmlDocumentToEventTarget = Unsafe_Coerce.unsafeCoerce;
var htmlDocumentToDocument = Unsafe_Coerce.unsafeCoerce;
module.exports = {
    readHTMLElement: readHTMLElement, 
    htmlElementToEventTarget: htmlElementToEventTarget, 
    htmlElementToNode: htmlElementToNode, 
    htmlElementToNonDocumentTypeChildNode: htmlElementToNonDocumentTypeChildNode, 
    htmlElementToParentNode: htmlElementToParentNode, 
    htmlElementToElement: htmlElementToElement, 
    readHTMLDocument: readHTMLDocument, 
    htmlDocumentToEventTarget: htmlDocumentToEventTarget, 
    htmlDocumentToNode: htmlDocumentToNode, 
    htmlDocumentToParentNode: htmlDocumentToParentNode, 
    htmlDocumentToNonElementParentNode: htmlDocumentToNonElementParentNode, 
    htmlDocumentToDocument: htmlDocumentToDocument, 
    windowToEventTarget: windowToEventTarget, 
    isForeignHTMLDocument: isForeignHTMLDocument, 
    isForeignHTMLElement: isForeignHTMLElement
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/DOM.HTML.Types/foreign.js","DOM.Event.Types":"/Users/maximko/Projects/mine/guppi/output/DOM.Event.Types/index.js","DOM.Node.Types":"/Users/maximko/Projects/mine/guppi/output/DOM.Node.Types/index.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Foreign/index.js","Data.Foreign.Class":"/Users/maximko/Projects/mine/guppi/output/Data.Foreign.Class/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js","Unsafe.Coerce":"/Users/maximko/Projects/mine/guppi/output/Unsafe.Coerce/index.js"}],"/Users/maximko/Projects/mine/guppi/output/DOM.HTML.Window/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module DOM.HTML.Window

exports.document = function (window) {
  return function () {
    return window.document;
  };
};

exports.navigator = function (window) {
  return function () {
    return window.navigator;
  };
};

exports.location = function (window) {
  return function () {
    return window.location;
  };
};

},{}],"/Users/maximko/Projects/mine/guppi/output/DOM.HTML.Window/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Control_Monad_Eff = require("Control.Monad.Eff");
var DOM = require("DOM");
var DOM_HTML_Types = require("DOM.HTML.Types");
module.exports = {
    location: $foreign.location, 
    navigator: $foreign.navigator, 
    document: $foreign.document
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/DOM.HTML.Window/foreign.js","Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","DOM":"/Users/maximko/Projects/mine/guppi/output/DOM/index.js","DOM.HTML.Types":"/Users/maximko/Projects/mine/guppi/output/DOM.HTML.Types/index.js"}],"/Users/maximko/Projects/mine/guppi/output/DOM.HTML/foreign.js":[function(require,module,exports){
/* global exports, window */
"use strict";

// module DOM.HTML

exports.window = function () {
  return window;
};

},{}],"/Users/maximko/Projects/mine/guppi/output/DOM.HTML/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Control_Monad_Eff = require("Control.Monad.Eff");
var DOM = require("DOM");
var DOM_HTML_Types = require("DOM.HTML.Types");
module.exports = {
    window: $foreign.window
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/DOM.HTML/foreign.js","Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","DOM":"/Users/maximko/Projects/mine/guppi/output/DOM/index.js","DOM.HTML.Types":"/Users/maximko/Projects/mine/guppi/output/DOM.HTML.Types/index.js"}],"/Users/maximko/Projects/mine/guppi/output/DOM.Node.Node/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module DOM.Node.Node

var getEffProp = function (name) {
  return function (node) {
    return function () {
      return node[name];
    };
  };
};

exports.nodeTypeIndex = function (node) {
  return node.nodeType;
};

exports.nodeName = function (node) {
  return node.nodeName;
};

exports.baseURI = getEffProp("baseURI");

exports.ownerDocument = getEffProp("ownerDocument");

exports.parentNode = getEffProp("parentNode");

exports.parentElement = getEffProp("parentElement");

exports.hasChildNodes = function (node) {
  return function () {
    return node.hasChildNodes();
  };
};

exports.childNodes = getEffProp("childNodes");

exports.firstChild = getEffProp("firstChild");

exports.lastChild = getEffProp("lastChild");

exports.previousSibling = getEffProp("previousSibling");

exports.nextSibling = getEffProp("nextSibling");

exports.nodeValue = getEffProp("nodeValue");

exports.setNodeValue = function (value) {
  return function (node) {
    return function () {
      node.nodeValue = value;
      return {};
    };
  };
};

exports.textContent = getEffProp("textContent");

exports.setTextContent = function (value) {
  return function (node) {
    return function () {
      node.textContent = value;
      return {};
    };
  };
};

exports.normalize = function (node) {
  return function () {
    node.normalize();
    return {};
  };
};

exports.clone = function (node) {
  return function () {
    return node.clone(false);
  };
};

exports.deepClone = function (node) {
  return function () {
    return node.clone(false);
  };
};

exports.isEqualNode = function (node1) {
  return function (node2) {
    return function () {
      return node1.isEqualNode(node2);
    };
  };
};

exports.compareDocumentPositionBits = function (node1) {
  return function (node2) {
    return function () {
      return node1.compareDocumentPosition(node2);
    };
  };
};

exports.contains = function (node1) {
  return function (node2) {
    return function () {
      return node1.contains(node2);
    };
  };
};

exports.lookupPrefix = function (prefix) {
  return function (node) {
    return function () {
      return node.lookupPrefix(prefix);
    };
  };
};

exports.lookupNamespaceURI = function (ns) {
  return function (node) {
    return function () {
      return node.lookupNamespaceURI(ns);
    };
  };
};

exports.lookupNamespaceURI = function (ns) {
  return function (node) {
    return function () {
      return node.isDefaultNamespace(ns);
    };
  };
};

exports.insertBefore = function (node1) {
  return function (node2) {
    return function (parent) {
      return function () {
        return parent.insertBefore(node1, node2);
      };
    };
  };
};

exports.appendChild = function (node) {
  return function (parent) {
    return function () {
      return parent.appendChild(node);
    };
  };
};

exports.replaceChild = function (oldChild) {
  return function (newChild) {
    return function (parent) {
      return function () {
        return parent.replaceChild(oldChild, newChild);
      };
    };
  };
};

exports.removeChild = function (node) {
  return function (parent) {
    return function () {
      return parent.removeChild(node);
    };
  };
};

},{}],"/Users/maximko/Projects/mine/guppi/output/DOM.Node.Node/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Control_Monad_Eff = require("Control.Monad.Eff");
var Data_Enum = require("Data.Enum");
var Data_Nullable = require("Data.Nullable");
var Data_Maybe_Unsafe = require("Data.Maybe.Unsafe");
var DOM = require("DOM");
var DOM_Node_NodeType = require("DOM.Node.NodeType");
var DOM_Node_Types = require("DOM.Node.Types");
var nodeType = function (_0) {
    return Data_Maybe_Unsafe.fromJust(Data_Enum.toEnum(DOM_Node_NodeType.enumNodeType)($foreign.nodeTypeIndex(_0)));
};
module.exports = {
    nodeType: nodeType, 
    removeChild: $foreign.removeChild, 
    replaceChild: $foreign.replaceChild, 
    appendChild: $foreign.appendChild, 
    insertBefore: $foreign.insertBefore, 
    isDefaultNamespace: $foreign.isDefaultNamespace, 
    lookupNamespaceURI: $foreign.lookupNamespaceURI, 
    lookupPrefix: $foreign.lookupPrefix, 
    contains: $foreign.contains, 
    compareDocumentPositionBits: $foreign.compareDocumentPositionBits, 
    isEqualNode: $foreign.isEqualNode, 
    deepClone: $foreign.deepClone, 
    clone: $foreign.clone, 
    normalize: $foreign.normalize, 
    setTextContent: $foreign.setTextContent, 
    textContent: $foreign.textContent, 
    setNodeValue: $foreign.setNodeValue, 
    nodeValue: $foreign.nodeValue, 
    nextSibling: $foreign.nextSibling, 
    previousSibling: $foreign.previousSibling, 
    lastChild: $foreign.lastChild, 
    firstChild: $foreign.firstChild, 
    childNodes: $foreign.childNodes, 
    hasChildNodes: $foreign.hasChildNodes, 
    parentElement: $foreign.parentElement, 
    parentNode: $foreign.parentNode, 
    ownerDocument: $foreign.ownerDocument, 
    baseURI: $foreign.baseURI, 
    nodeName: $foreign.nodeName, 
    nodeTypeIndex: $foreign.nodeTypeIndex
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/DOM.Node.Node/foreign.js","Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","DOM":"/Users/maximko/Projects/mine/guppi/output/DOM/index.js","DOM.Node.NodeType":"/Users/maximko/Projects/mine/guppi/output/DOM.Node.NodeType/index.js","DOM.Node.Types":"/Users/maximko/Projects/mine/guppi/output/DOM.Node.Types/index.js","Data.Enum":"/Users/maximko/Projects/mine/guppi/output/Data.Enum/index.js","Data.Maybe.Unsafe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe.Unsafe/index.js","Data.Nullable":"/Users/maximko/Projects/mine/guppi/output/Data.Nullable/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/DOM.Node.NodeType/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Maybe = require("Data.Maybe");
var Data_Enum = require("Data.Enum");
var ElementNode = (function () {
    function ElementNode() {

    };
    ElementNode.value = new ElementNode();
    return ElementNode;
})();
var AttributeNode = (function () {
    function AttributeNode() {

    };
    AttributeNode.value = new AttributeNode();
    return AttributeNode;
})();
var TextNode = (function () {
    function TextNode() {

    };
    TextNode.value = new TextNode();
    return TextNode;
})();
var CDATASectionNode = (function () {
    function CDATASectionNode() {

    };
    CDATASectionNode.value = new CDATASectionNode();
    return CDATASectionNode;
})();
var EntityReferenceNode = (function () {
    function EntityReferenceNode() {

    };
    EntityReferenceNode.value = new EntityReferenceNode();
    return EntityReferenceNode;
})();
var EntityNode = (function () {
    function EntityNode() {

    };
    EntityNode.value = new EntityNode();
    return EntityNode;
})();
var ProcessingInstructionNode = (function () {
    function ProcessingInstructionNode() {

    };
    ProcessingInstructionNode.value = new ProcessingInstructionNode();
    return ProcessingInstructionNode;
})();
var CommentNode = (function () {
    function CommentNode() {

    };
    CommentNode.value = new CommentNode();
    return CommentNode;
})();
var DocumentNode = (function () {
    function DocumentNode() {

    };
    DocumentNode.value = new DocumentNode();
    return DocumentNode;
})();
var DocumentTypeNode = (function () {
    function DocumentTypeNode() {

    };
    DocumentTypeNode.value = new DocumentTypeNode();
    return DocumentTypeNode;
})();
var DocumentFragmentNode = (function () {
    function DocumentFragmentNode() {

    };
    DocumentFragmentNode.value = new DocumentFragmentNode();
    return DocumentFragmentNode;
})();
var NotationNode = (function () {
    function NotationNode() {

    };
    NotationNode.value = new NotationNode();
    return NotationNode;
})();
var toEnumNodeType = function (_0) {
    if (_0 === 1) {
        return new Data_Maybe.Just(ElementNode.value);
    };
    if (_0 === 2) {
        return new Data_Maybe.Just(AttributeNode.value);
    };
    if (_0 === 3) {
        return new Data_Maybe.Just(TextNode.value);
    };
    if (_0 === 4) {
        return new Data_Maybe.Just(CDATASectionNode.value);
    };
    if (_0 === 5) {
        return new Data_Maybe.Just(EntityReferenceNode.value);
    };
    if (_0 === 6) {
        return new Data_Maybe.Just(EntityNode.value);
    };
    if (_0 === 7) {
        return new Data_Maybe.Just(ProcessingInstructionNode.value);
    };
    if (_0 === 8) {
        return new Data_Maybe.Just(CommentNode.value);
    };
    if (_0 === 9) {
        return new Data_Maybe.Just(DocumentNode.value);
    };
    if (_0 === 10) {
        return new Data_Maybe.Just(DocumentTypeNode.value);
    };
    if (_0 === 11) {
        return new Data_Maybe.Just(DocumentFragmentNode.value);
    };
    if (_0 === 12) {
        return new Data_Maybe.Just(NotationNode.value);
    };
    return Data_Maybe.Nothing.value;
};
var fromEnumNodeType = function (_1) {
    if (_1 instanceof ElementNode) {
        return 1;
    };
    if (_1 instanceof AttributeNode) {
        return 2;
    };
    if (_1 instanceof TextNode) {
        return 3;
    };
    if (_1 instanceof CDATASectionNode) {
        return 4;
    };
    if (_1 instanceof EntityReferenceNode) {
        return 5;
    };
    if (_1 instanceof EntityNode) {
        return 6;
    };
    if (_1 instanceof ProcessingInstructionNode) {
        return 7;
    };
    if (_1 instanceof CommentNode) {
        return 8;
    };
    if (_1 instanceof DocumentNode) {
        return 9;
    };
    if (_1 instanceof DocumentTypeNode) {
        return 10;
    };
    if (_1 instanceof DocumentFragmentNode) {
        return 11;
    };
    if (_1 instanceof NotationNode) {
        return 12;
    };
    throw new Error("Failed pattern match at DOM.Node.NodeType line 67, column 1 - line 68, column 1: " + [ _1.constructor.name ]);
};
var eqNodeType = new Prelude.Eq(function (_2) {
    return function (_3) {
        if (_2 instanceof ElementNode && _3 instanceof ElementNode) {
            return true;
        };
        if (_2 instanceof AttributeNode && _3 instanceof AttributeNode) {
            return true;
        };
        if (_2 instanceof TextNode && _3 instanceof TextNode) {
            return true;
        };
        if (_2 instanceof CDATASectionNode && _3 instanceof CDATASectionNode) {
            return true;
        };
        if (_2 instanceof EntityReferenceNode && _3 instanceof EntityReferenceNode) {
            return true;
        };
        if (_2 instanceof EntityNode && _3 instanceof EntityNode) {
            return true;
        };
        if (_2 instanceof ProcessingInstructionNode && _3 instanceof ProcessingInstructionNode) {
            return true;
        };
        if (_2 instanceof CommentNode && _3 instanceof CommentNode) {
            return true;
        };
        if (_2 instanceof DocumentNode && _3 instanceof DocumentNode) {
            return true;
        };
        if (_2 instanceof DocumentTypeNode && _3 instanceof DocumentTypeNode) {
            return true;
        };
        if (_2 instanceof DocumentFragmentNode && _3 instanceof DocumentFragmentNode) {
            return true;
        };
        if (_2 instanceof NotationNode && _3 instanceof NotationNode) {
            return true;
        };
        return false;
    };
});
var ordNodeType = new Prelude.Ord(function () {
    return eqNodeType;
}, function (x) {
    return function (y) {
        return Prelude.compare(Prelude.ordInt)(fromEnumNodeType(x))(fromEnumNodeType(y));
    };
});
var boundedNodeType = new Prelude.Bounded(ElementNode.value, NotationNode.value);
var boundedOrdNodeType = new Prelude.BoundedOrd(function () {
    return boundedNodeType;
}, function () {
    return ordNodeType;
});
var enumNodeType = new Data_Enum.Enum(function () {
    return boundedNodeType;
}, 4, fromEnumNodeType, Data_Enum.defaultPred(toEnumNodeType)(fromEnumNodeType), Data_Enum.defaultSucc(toEnumNodeType)(fromEnumNodeType), toEnumNodeType);
module.exports = {
    ElementNode: ElementNode, 
    AttributeNode: AttributeNode, 
    TextNode: TextNode, 
    CDATASectionNode: CDATASectionNode, 
    EntityReferenceNode: EntityReferenceNode, 
    EntityNode: EntityNode, 
    ProcessingInstructionNode: ProcessingInstructionNode, 
    CommentNode: CommentNode, 
    DocumentNode: DocumentNode, 
    DocumentTypeNode: DocumentTypeNode, 
    DocumentFragmentNode: DocumentFragmentNode, 
    NotationNode: NotationNode, 
    eqNodeType: eqNodeType, 
    ordNodeType: ordNodeType, 
    boundedNodeType: boundedNodeType, 
    boundedOrdNodeType: boundedOrdNodeType, 
    enumNodeType: enumNodeType
};

},{"Data.Enum":"/Users/maximko/Projects/mine/guppi/output/Data.Enum/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/DOM.Node.ParentNode/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module DOM.Node.ParentNode

var getEffProp = function (name) {
  return function (node) {
    return function () {
      return node[name];
    };
  };
};

exports.children = getEffProp("children");

exports.firstElementChild = getEffProp("firstElementChild");

exports.lastElementChild = getEffProp("lastElementChild");

exports.childElementCount = getEffProp("childElementCount");

exports.querySelector = function (selector) {
  return function (node) {
    return function () {
      return node.querySelector(selector);
    };
  };
};

exports.querySelectorAll = function (selector) {
  return function (node) {
    return function () {
      return node.querySelectorAll(selector);
    };
  };
};

},{}],"/Users/maximko/Projects/mine/guppi/output/DOM.Node.ParentNode/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Control_Monad_Eff = require("Control.Monad.Eff");
var Data_Nullable = require("Data.Nullable");
var DOM = require("DOM");
var DOM_Node_Types = require("DOM.Node.Types");
module.exports = {
    querySelectorAll: $foreign.querySelectorAll, 
    querySelector: $foreign.querySelector, 
    childElementCount: $foreign.childElementCount, 
    lastElementChild: $foreign.lastElementChild, 
    firstElementChild: $foreign.firstElementChild, 
    children: $foreign.children
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/DOM.Node.ParentNode/foreign.js","Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","DOM":"/Users/maximko/Projects/mine/guppi/output/DOM/index.js","DOM.Node.Types":"/Users/maximko/Projects/mine/guppi/output/DOM.Node.Types/index.js","Data.Nullable":"/Users/maximko/Projects/mine/guppi/output/Data.Nullable/index.js"}],"/Users/maximko/Projects/mine/guppi/output/DOM.Node.Types/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var DOM_Event_Types = require("DOM.Event.Types");
var Unsafe_Coerce = require("Unsafe.Coerce");
var ElementId = function (x) {
    return x;
};
var textToNode = Unsafe_Coerce.unsafeCoerce;
var processingInstructionToNode = Unsafe_Coerce.unsafeCoerce;
var elementToParentNode = Unsafe_Coerce.unsafeCoerce;
var elementToNonDocumentTypeChildNode = Unsafe_Coerce.unsafeCoerce;
var elementToNode = Unsafe_Coerce.unsafeCoerce;
var elementToEventTarget = Unsafe_Coerce.unsafeCoerce;
var documentTypeToNode = Unsafe_Coerce.unsafeCoerce;
var documentToParentNode = Unsafe_Coerce.unsafeCoerce;
var documentToNonElementParentNode = Unsafe_Coerce.unsafeCoerce;
var documentToNode = Unsafe_Coerce.unsafeCoerce;
var documentToEventTarget = Unsafe_Coerce.unsafeCoerce;
var documentFragmentToParentNode = Unsafe_Coerce.unsafeCoerce;
var documentFragmentToNonElementParentNode = Unsafe_Coerce.unsafeCoerce;
var documentFragmentToNode = Unsafe_Coerce.unsafeCoerce;
var commentToNode = Unsafe_Coerce.unsafeCoerce;
var characterDataToNonDocumentTypeChildNode = Unsafe_Coerce.unsafeCoerce;
module.exports = {
    ElementId: ElementId, 
    documentTypeToNode: documentTypeToNode, 
    documentFragmentToNode: documentFragmentToNode, 
    documentFragmentToParentNode: documentFragmentToParentNode, 
    documentFragmentToNonElementParentNode: documentFragmentToNonElementParentNode, 
    processingInstructionToNode: processingInstructionToNode, 
    commentToNode: commentToNode, 
    textToNode: textToNode, 
    characterDataToNonDocumentTypeChildNode: characterDataToNonDocumentTypeChildNode, 
    elementToEventTarget: elementToEventTarget, 
    elementToNode: elementToNode, 
    elementToNonDocumentTypeChildNode: elementToNonDocumentTypeChildNode, 
    elementToParentNode: elementToParentNode, 
    documentToEventTarget: documentToEventTarget, 
    documentToNode: documentToNode, 
    documentToParentNode: documentToParentNode, 
    documentToNonElementParentNode: documentToNonElementParentNode
};

},{"DOM.Event.Types":"/Users/maximko/Projects/mine/guppi/output/DOM.Event.Types/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js","Unsafe.Coerce":"/Users/maximko/Projects/mine/guppi/output/Unsafe.Coerce/index.js"}],"/Users/maximko/Projects/mine/guppi/output/DOM/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
module.exports = {};

},{}],"/Users/maximko/Projects/mine/guppi/output/Data.Array.ST/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Data.Array.ST

exports.runSTArray = function (f) {
  return f;
};

exports.emptySTArray = function () {
  return [];
};

exports.peekSTArrayImpl = function (just) {
  return function (nothing) {
    return function (xs) {
      return function (i) {
        return function () {
          return i >= 0 && i < xs.length ? just(xs[i]) : nothing;
        };
      };
    };
  };
};

exports.pokeSTArray = function (xs) {
  return function (i) {
    return function (a) {
      return function () {
        var ret = i >= 0 && i < xs.length;
        if (ret) xs[i] = a;
        return ret;
      };
    };
  };
};

exports.pushAllSTArray = function (xs) {
  return function (as) {
    return function () {
      return xs.push.apply(xs, as);
    };
  };
};

exports.spliceSTArray = function (xs) {
  return function (i) {
    return function (howMany) {
      return function (bs) {
        return function () {
          return xs.splice.apply(xs, [i, howMany].concat(bs));
        };
      };
    };
  };
};

exports.copyImpl = function (xs) {
  return function () {
    return xs.slice();
  };
};

exports.toAssocArray = function (xs) {
  return function () {
    var n = xs.length;
    var as = new Array(n);
    for (var i = 0; i < n; i++) as[i] = { value: xs[i], index: i };
    return as;
  };
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Data.Array.ST/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Control_Monad_Eff = require("Control.Monad.Eff");
var Control_Monad_ST = require("Control.Monad.ST");
var Data_Maybe = require("Data.Maybe");
var thaw = $foreign.copyImpl;
var pushSTArray = function (arr) {
    return function (a) {
        return $foreign.pushAllSTArray(arr)([ a ]);
    };
};
var peekSTArray = $foreign.peekSTArrayImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var freeze = $foreign.copyImpl;
module.exports = {
    thaw: thaw, 
    freeze: freeze, 
    pushSTArray: pushSTArray, 
    peekSTArray: peekSTArray, 
    toAssocArray: $foreign.toAssocArray, 
    spliceSTArray: $foreign.spliceSTArray, 
    pushAllSTArray: $foreign.pushAllSTArray, 
    pokeSTArray: $foreign.pokeSTArray, 
    emptySTArray: $foreign.emptySTArray, 
    runSTArray: $foreign.runSTArray
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Array.ST/foreign.js","Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","Control.Monad.ST":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.ST/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Array/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Data.Array

//------------------------------------------------------------------------------
// Array creation --------------------------------------------------------------
//------------------------------------------------------------------------------

exports.range = function (start) {
  return function (end) {
    var step = start > end ? -1 : 1;
    var result = [];
    for (var i = start, n = 0; i !== end; i += step) {
      result[n++] = i;
    }
    result[n] = i;
    return result;
  };
};

exports.replicate = function (n) {
  return function (v) {
    if (n < 1) return [];
    var r = new Array(n);
    for (var i = 0; i < n; i++) r[i] = v;
    return r;
  };
};

//------------------------------------------------------------------------------
// Array size ------------------------------------------------------------------
//------------------------------------------------------------------------------

exports.length = function (xs) {
  return xs.length;
};

//------------------------------------------------------------------------------
// Extending arrays ------------------------------------------------------------
//------------------------------------------------------------------------------

exports.cons = function (e) {
  return function (l) {
    return [e].concat(l);
  };
};

exports.snoc = function (l) {
  return function (e) {
    var l1 = l.slice();
    l1.push(e);
    return l1;
  };
};

//------------------------------------------------------------------------------
// Non-indexed reads -----------------------------------------------------------
//------------------------------------------------------------------------------

exports["uncons'"] = function (empty) {
  return function (next) {
    return function (xs) {
      return xs.length === 0 ? empty({}) : next(xs[0])(xs.slice(1));
    };
  };
};

//------------------------------------------------------------------------------
// Indexed operations ----------------------------------------------------------
//------------------------------------------------------------------------------

exports.indexImpl = function (just) {
  return function (nothing) {
    return function (xs) {
      return function (i) {
        return i < 0 || i >= xs.length ? nothing :  just(xs[i]);
      };
    };
  };
};

exports.findIndexImpl = function (just) {
  return function (nothing) {
    return function (f) {
      return function (xs) {
        for (var i = 0, l = xs.length; i < l; i++) {
          if (f(xs[i])) return just(i);
        }
        return nothing;
      };
    };
  };
};

exports.findLastIndexImpl = function (just) {
  return function (nothing) {
    return function (f) {
      return function (xs) {
        for (var i = xs.length - 1; i >= 0; i--) {
          if (f(xs[i])) return just(i);
        }
        return nothing;
      };
    };
  };
};

exports._insertAt = function (just) {
  return function (nothing) {
    return function (i) {
      return function (a) {
        return function (l) {
          if (i < 0 || i > l.length) return nothing;
          var l1 = l.slice();
          l1.splice(i, 0, a);
          return just(l1);
        };
      };
    };
  };
};

exports._deleteAt = function (just) {
  return function (nothing) {
    return function (i) {
      return function (l) {
        if (i < 0 || i >= l.length) return nothing;
        var l1 = l.slice();
        l1.splice(i, 1);
        return just(l1);
      };
    };
  };
};

exports._updateAt = function (just) {
  return function (nothing) {
    return function (i) {
      return function (a) {
        return function (l) {
          if (i < 0 || i >= l.length) return nothing;
          var l1 = l.slice();
          l1[i] = a;
          return just(l1);
        };
      };
    };
  };
};

//------------------------------------------------------------------------------
// Transformations -------------------------------------------------------------
//------------------------------------------------------------------------------

exports.reverse = function (l) {
  return l.slice().reverse();
};

exports.concat = function (xss) {
  var result = [];
  for (var i = 0, l = xss.length; i < l; i++) {
    var xs = xss[i];
    for (var j = 0, m = xs.length; j < m; j++) {
      result.push(xs[j]);
    }
  }
  return result;
};

exports.filter = function (f) {
  return function (xs) {
    return xs.filter(f);
  };
};

//------------------------------------------------------------------------------
// Sorting ---------------------------------------------------------------------
//------------------------------------------------------------------------------

exports.sortImpl = function (f) {
  return function (l) {
    /* jshint maxparams: 2 */
    return l.slice().sort(function (x, y) {
      return f(x)(y);
    });
  };
};

//------------------------------------------------------------------------------
// Subarrays -------------------------------------------------------------------
//------------------------------------------------------------------------------

exports.slice = function (s) {
  return function (e) {
    return function (l) {
      return l.slice(s, e);
    };
  };
};

exports.drop = function (n) {
  return function (l) {
    return n < 1 ? l : l.slice(n);
  };
};

//------------------------------------------------------------------------------
// Zipping ---------------------------------------------------------------------
//------------------------------------------------------------------------------

exports.zipWith = function (f) {
  return function (xs) {
    return function (ys) {
      var l = xs.length < ys.length ? xs.length : ys.length;
      var result = new Array(l);
      for (var i = 0; i < l; i++) {
        result[i] = f(xs[i])(ys[i]);
      }
      return result;
    };
  };
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Data.Array/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Control_Alt = require("Control.Alt");
var Control_Alternative = require("Control.Alternative");
var Control_Lazy = require("Control.Lazy");
var Control_MonadPlus = require("Control.MonadPlus");
var Control_Plus = require("Control.Plus");
var Data_Foldable = require("Data.Foldable");
var Data_Functor_Invariant = require("Data.Functor.Invariant");
var Data_Maybe = require("Data.Maybe");
var Data_Monoid = require("Data.Monoid");
var Data_Traversable = require("Data.Traversable");
var Data_Tuple = require("Data.Tuple");
var Data_Maybe_Unsafe = require("Data.Maybe.Unsafe");
var $colon = $foreign.cons;
var $dot$dot = $foreign.range;
var zipWithA = function (__dict_Applicative_0) {
    return function (f) {
        return function (xs) {
            return function (ys) {
                return Data_Traversable.sequence(Data_Traversable.traversableArray)(__dict_Applicative_0)($foreign.zipWith(f)(xs)(ys));
            };
        };
    };
};
var zip = $foreign.zipWith(Data_Tuple.Tuple.create);
var updateAt = $foreign._updateAt(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var unzip = $foreign["uncons'"](function (_9) {
    return new Data_Tuple.Tuple([  ], [  ]);
})(function (_10) {
    return function (ts) {
        var _15 = unzip(ts);
        return new Data_Tuple.Tuple($colon(_10.value0)(_15.value0), $colon(_10.value1)(_15.value1));
    };
});
var uncons = $foreign["uncons'"](Prelude["const"](Data_Maybe.Nothing.value))(function (x) {
    return function (xs) {
        return new Data_Maybe.Just({
            head: x, 
            tail: xs
        });
    };
});
var take = $foreign.slice(0);
var tail = $foreign["uncons'"](Prelude["const"](Data_Maybe.Nothing.value))(function (_7) {
    return function (xs) {
        return new Data_Maybe.Just(xs);
    };
});
var span = function (p) {
    var go = function (__copy_acc) {
        return function (__copy_xs) {
            var acc = __copy_acc;
            var xs = __copy_xs;
            tco: while (true) {
                var _21 = uncons(xs);
                if (_21 instanceof Data_Maybe.Just && p(_21.value0.head)) {
                    var __tco_acc = $colon(_21.value0.head)(acc);
                    acc = __tco_acc;
                    xs = _21.value0.tail;
                    continue tco;
                };
                return {
                    init: $foreign.reverse(acc), 
                    rest: xs
                };
            };
        };
    };
    return go([  ]);
};
var takeWhile = function (p) {
    return function (xs) {
        return (span(p)(xs)).init;
    };
};
var sortBy = function (comp) {
    return function (xs) {
        var comp$prime = function (x) {
            return function (y) {
                var _25 = comp(x)(y);
                if (_25 instanceof Prelude.GT) {
                    return 1;
                };
                if (_25 instanceof Prelude.EQ) {
                    return 0;
                };
                if (_25 instanceof Prelude.LT) {
                    return -1;
                };
                throw new Error("Failed pattern match at Data.Array line 409, column 3 - line 414, column 1: " + [ _25.constructor.name ]);
            };
        };
        return $foreign.sortImpl(comp$prime)(xs);
    };
};
var sort = function (__dict_Ord_1) {
    return function (xs) {
        return sortBy(Prelude.compare(__dict_Ord_1))(xs);
    };
};
var singleton = function (a) {
    return [ a ];
};
var replicateM = function (__dict_Monad_2) {
    return function (n) {
        return function (m) {
            if (n < 1) {
                return Prelude["return"](__dict_Monad_2["__superclass_Prelude.Applicative_0"]())([  ]);
            };
            if (Prelude.otherwise) {
                return Data_Traversable.sequence(Data_Traversable.traversableArray)(__dict_Monad_2["__superclass_Prelude.Applicative_0"]())($foreign.replicate(n)(m));
            };
            throw new Error("Failed pattern match at Data.Array line 136, column 1 - line 137, column 1: " + [ n.constructor.name, m.constructor.name ]);
        };
    };
};
var $$null = function (xs) {
    return $foreign.length(xs) === 0;
};
var nubBy = function (eq) {
    return function (xs) {
        var _28 = uncons(xs);
        if (_28 instanceof Data_Maybe.Just) {
            return $colon(_28.value0.head)(nubBy(eq)($foreign.filter(function (y) {
                return !eq(_28.value0.head)(y);
            })(_28.value0.tail)));
        };
        if (_28 instanceof Data_Maybe.Nothing) {
            return [  ];
        };
        throw new Error("Failed pattern match: " + [ _28.constructor.name ]);
    };
};
var nub = function (__dict_Eq_3) {
    return nubBy(Prelude.eq(__dict_Eq_3));
};
var some = function (__dict_Alternative_4) {
    return function (__dict_Lazy_5) {
        return function (v) {
            return Prelude["<*>"]((__dict_Alternative_4["__superclass_Prelude.Applicative_0"]())["__superclass_Prelude.Apply_0"]())(Prelude["<$>"](((__dict_Alternative_4["__superclass_Control.Plus.Plus_1"]())["__superclass_Control.Alt.Alt_0"]())["__superclass_Prelude.Functor_0"]())($colon)(v))(Control_Lazy.defer(__dict_Lazy_5)(function (_5) {
                return many(__dict_Alternative_4)(__dict_Lazy_5)(v);
            }));
        };
    };
};
var many = function (__dict_Alternative_6) {
    return function (__dict_Lazy_7) {
        return function (v) {
            return Control_Alt["<|>"]((__dict_Alternative_6["__superclass_Control.Plus.Plus_1"]())["__superclass_Control.Alt.Alt_0"]())(some(__dict_Alternative_6)(__dict_Lazy_7)(v))(Prelude.pure(__dict_Alternative_6["__superclass_Prelude.Applicative_0"]())([  ]));
        };
    };
};
var insertAt = $foreign._insertAt(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var init = function (xs) {
    if ($$null(xs)) {
        return Data_Maybe.Nothing.value;
    };
    if (Prelude.otherwise) {
        return new Data_Maybe.Just($foreign.slice(0)($foreign.length(xs) - 1)(xs));
    };
    throw new Error("Failed pattern match at Data.Array line 226, column 1 - line 227, column 1: " + [ xs.constructor.name ]);
};
var index = $foreign.indexImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var $bang$bang = index;
var last = function (xs) {
    return $bang$bang(xs)($foreign.length(xs) - 1);
};
var modifyAt = function (i) {
    return function (f) {
        return function (xs) {
            var go = function (x) {
                return updateAt(i)(f(x))(xs);
            };
            return Data_Maybe.maybe(Data_Maybe.Nothing.value)(go)($bang$bang(xs)(i));
        };
    };
};
var head = $foreign["uncons'"](Prelude["const"](Data_Maybe.Nothing.value))(function (x) {
    return function (_6) {
        return new Data_Maybe.Just(x);
    };
});
var groupBy = function (op) {
    var go = function (__copy_acc) {
        return function (__copy_xs) {
            var acc = __copy_acc;
            var xs = __copy_xs;
            tco: while (true) {
                var _33 = uncons(xs);
                if (_33 instanceof Data_Maybe.Just) {
                    var sp = span(op(_33.value0.head))(_33.value0.tail);
                    var __tco_acc = $colon($colon(_33.value0.head)(sp.init))(acc);
                    acc = __tco_acc;
                    xs = sp.rest;
                    continue tco;
                };
                if (_33 instanceof Data_Maybe.Nothing) {
                    return $foreign.reverse(acc);
                };
                throw new Error("Failed pattern match at Data.Array line 476, column 1 - line 477, column 1: " + [ _33.constructor.name ]);
            };
        };
    };
    return go([  ]);
};
var group = function (__dict_Eq_8) {
    return function (xs) {
        return groupBy(Prelude.eq(__dict_Eq_8))(xs);
    };
};
var group$prime = function (__dict_Ord_9) {
    return function (_47) {
        return group(__dict_Ord_9["__superclass_Prelude.Eq_0"]())(sort(__dict_Ord_9)(_47));
    };
};
var foldM = function (__dict_Monad_10) {
    return function (f) {
        return function (a) {
            return $foreign["uncons'"](function (_11) {
                return Prelude["return"](__dict_Monad_10["__superclass_Prelude.Applicative_0"]())(a);
            })(function (b) {
                return function (bs) {
                    return Prelude[">>="](__dict_Monad_10["__superclass_Prelude.Bind_1"]())(f(a)(b))(function (a$prime) {
                        return foldM(__dict_Monad_10)(f)(a$prime)(bs);
                    });
                };
            });
        };
    };
};
var findLastIndex = $foreign.findLastIndexImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var insertBy = function (cmp) {
    return function (x) {
        return function (ys) {
            var i = Data_Maybe.maybe(0)(function (_0) {
                return _0 + 1 | 0;
            })(findLastIndex(function (y) {
                return Prelude["=="](Prelude.eqOrdering)(cmp(x)(y))(Prelude.GT.value);
            })(ys));
            return Data_Maybe_Unsafe.fromJust(insertAt(i)(x)(ys));
        };
    };
};
var insert = function (__dict_Ord_11) {
    return insertBy(Prelude.compare(__dict_Ord_11));
};
var findIndex = $foreign.findIndexImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var intersectBy = function (eq) {
    return function (xs) {
        return function (ys) {
            return $foreign.filter(function (x) {
                return Data_Maybe.isJust(findIndex(eq(x))(ys));
            })(xs);
        };
    };
};
var intersect = function (__dict_Eq_12) {
    return intersectBy(Prelude.eq(__dict_Eq_12));
};
var filterM = function (__dict_Monad_13) {
    return function (p) {
        return $foreign["uncons'"](function (_8) {
            return Prelude.pure(__dict_Monad_13["__superclass_Prelude.Applicative_0"]())([  ]);
        })(function (x) {
            return function (xs) {
                return Prelude.bind(__dict_Monad_13["__superclass_Prelude.Bind_1"]())(p(x))(function (_4) {
                    return Prelude.bind(__dict_Monad_13["__superclass_Prelude.Bind_1"]())(filterM(__dict_Monad_13)(p)(xs))(function (_3) {
                        return Prelude["return"](__dict_Monad_13["__superclass_Prelude.Applicative_0"]())((function () {
                            if (_4) {
                                return $colon(x)(_3);
                            };
                            if (!_4) {
                                return _3;
                            };
                            throw new Error("Failed pattern match: " + [ _4.constructor.name ]);
                        })());
                    });
                });
            };
        });
    };
};
var elemLastIndex = function (__dict_Eq_14) {
    return function (x) {
        return findLastIndex(function (_2) {
            return Prelude["=="](__dict_Eq_14)(_2)(x);
        });
    };
};
var elemIndex = function (__dict_Eq_15) {
    return function (x) {
        return findIndex(function (_1) {
            return Prelude["=="](__dict_Eq_15)(_1)(x);
        });
    };
};
var dropWhile = function (p) {
    return function (xs) {
        return (span(p)(xs)).rest;
    };
};
var deleteAt = $foreign._deleteAt(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var deleteBy = function (eq) {
    return function (x) {
        return function (_12) {
            if (_12.length === 0) {
                return [  ];
            };
            return Data_Maybe.maybe(_12)(function (i) {
                return Data_Maybe_Unsafe.fromJust(deleteAt(i)(_12));
            })(findIndex(eq(x))(_12));
        };
    };
};
var unionBy = function (eq) {
    return function (xs) {
        return function (ys) {
            return Prelude["++"](Prelude.semigroupArray)(xs)(Data_Foldable.foldl(Data_Foldable.foldableArray)(Prelude.flip(deleteBy(eq)))(nubBy(eq)(ys))(xs));
        };
    };
};
var union = function (__dict_Eq_16) {
    return unionBy(Prelude["=="](__dict_Eq_16));
};
var $$delete = function (__dict_Eq_17) {
    return deleteBy(Prelude.eq(__dict_Eq_17));
};
var $bslash$bslash = function (__dict_Eq_18) {
    return function (xs) {
        return function (ys) {
            if ($$null(xs)) {
                return [  ];
            };
            if (Prelude.otherwise) {
                return $foreign["uncons'"](Prelude["const"](xs))(function (y) {
                    return function (ys_2) {
                        return $bslash$bslash(__dict_Eq_18)($$delete(__dict_Eq_18)(y)(xs))(ys_2);
                    };
                })(ys);
            };
            throw new Error("Failed pattern match: " + [ xs.constructor.name, ys.constructor.name ]);
        };
    };
};
var concatMap = Prelude.flip(Prelude.bind(Prelude.bindArray));
var mapMaybe = function (f) {
    return concatMap(function (_48) {
        return Data_Maybe.maybe([  ])(singleton)(f(_48));
    });
};
var catMaybes = mapMaybe(Prelude.id(Prelude.categoryFn));
var alterAt = function (i) {
    return function (f) {
        return function (xs) {
            var go = function (x) {
                var _45 = f(x);
                if (_45 instanceof Data_Maybe.Nothing) {
                    return deleteAt(i)(xs);
                };
                if (_45 instanceof Data_Maybe.Just) {
                    return updateAt(i)(_45.value0)(xs);
                };
                throw new Error("Failed pattern match at Data.Array line 349, column 3 - line 358, column 1: " + [ _45.constructor.name ]);
            };
            return Data_Maybe.maybe(Data_Maybe.Nothing.value)(go)($bang$bang(xs)(i));
        };
    };
};
module.exports = {
    foldM: foldM, 
    unzip: unzip, 
    zip: zip, 
    zipWithA: zipWithA, 
    intersectBy: intersectBy, 
    intersect: intersect, 
    "\\\\": $bslash$bslash, 
    deleteBy: deleteBy, 
    "delete": $$delete, 
    unionBy: unionBy, 
    union: union, 
    nubBy: nubBy, 
    nub: nub, 
    groupBy: groupBy, 
    "group'": group$prime, 
    group: group, 
    span: span, 
    dropWhile: dropWhile, 
    takeWhile: takeWhile, 
    take: take, 
    sortBy: sortBy, 
    sort: sort, 
    catMaybes: catMaybes, 
    mapMaybe: mapMaybe, 
    filterM: filterM, 
    concatMap: concatMap, 
    alterAt: alterAt, 
    modifyAt: modifyAt, 
    updateAt: updateAt, 
    deleteAt: deleteAt, 
    insertAt: insertAt, 
    findLastIndex: findLastIndex, 
    findIndex: findIndex, 
    elemLastIndex: elemLastIndex, 
    elemIndex: elemIndex, 
    index: index, 
    "!!": $bang$bang, 
    uncons: uncons, 
    init: init, 
    tail: tail, 
    last: last, 
    head: head, 
    insertBy: insertBy, 
    insert: insert, 
    ":": $colon, 
    "null": $$null, 
    many: many, 
    some: some, 
    replicateM: replicateM, 
    "..": $dot$dot, 
    singleton: singleton, 
    zipWith: $foreign.zipWith, 
    drop: $foreign.drop, 
    slice: $foreign.slice, 
    filter: $foreign.filter, 
    concat: $foreign.concat, 
    reverse: $foreign.reverse, 
    snoc: $foreign.snoc, 
    cons: $foreign.cons, 
    length: $foreign.length, 
    replicate: $foreign.replicate, 
    range: $foreign.range
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Array/foreign.js","Control.Alt":"/Users/maximko/Projects/mine/guppi/output/Control.Alt/index.js","Control.Alternative":"/Users/maximko/Projects/mine/guppi/output/Control.Alternative/index.js","Control.Lazy":"/Users/maximko/Projects/mine/guppi/output/Control.Lazy/index.js","Control.MonadPlus":"/Users/maximko/Projects/mine/guppi/output/Control.MonadPlus/index.js","Control.Plus":"/Users/maximko/Projects/mine/guppi/output/Control.Plus/index.js","Data.Foldable":"/Users/maximko/Projects/mine/guppi/output/Data.Foldable/index.js","Data.Functor.Invariant":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Invariant/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Maybe.Unsafe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe.Unsafe/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Traversable":"/Users/maximko/Projects/mine/guppi/output/Data.Traversable/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Bifoldable/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Apply = require("Control.Apply");
var Data_Monoid = require("Data.Monoid");
var Data_Monoid_Disj = require("Data.Monoid.Disj");
var Data_Monoid_Conj = require("Data.Monoid.Conj");
var Data_Monoid_Endo = require("Data.Monoid.Endo");
var Data_Monoid_Dual = require("Data.Monoid.Dual");
var Bifoldable = function (bifoldMap, bifoldl, bifoldr) {
    this.bifoldMap = bifoldMap;
    this.bifoldl = bifoldl;
    this.bifoldr = bifoldr;
};
var bifoldr = function (dict) {
    return dict.bifoldr;
};
var bitraverse_ = function (__dict_Bifoldable_0) {
    return function (__dict_Applicative_1) {
        return function (f) {
            return function (g) {
                return bifoldr(__dict_Bifoldable_0)(function (_0) {
                    return Control_Apply["*>"](__dict_Applicative_1["__superclass_Prelude.Apply_0"]())(f(_0));
                })(function (_1) {
                    return Control_Apply["*>"](__dict_Applicative_1["__superclass_Prelude.Apply_0"]())(g(_1));
                })(Prelude.pure(__dict_Applicative_1)(Prelude.unit));
            };
        };
    };
};
var bifor_ = function (__dict_Bifoldable_2) {
    return function (__dict_Applicative_3) {
        return function (t) {
            return function (f) {
                return function (g) {
                    return bitraverse_(__dict_Bifoldable_2)(__dict_Applicative_3)(f)(g)(t);
                };
            };
        };
    };
};
var bisequence_ = function (__dict_Bifoldable_4) {
    return function (__dict_Applicative_5) {
        return bitraverse_(__dict_Bifoldable_4)(__dict_Applicative_5)(Prelude.id(Prelude.categoryFn))(Prelude.id(Prelude.categoryFn));
    };
};
var bifoldl = function (dict) {
    return dict.bifoldl;
};
var bifoldMapDefaultR = function (__dict_Bifoldable_6) {
    return function (__dict_Monoid_7) {
        return function (f) {
            return function (g) {
                return function (p) {
                    return bifoldr(__dict_Bifoldable_6)(function (_2) {
                        return Prelude["<>"](__dict_Monoid_7["__superclass_Prelude.Semigroup_0"]())(f(_2));
                    })(function (_3) {
                        return Prelude["<>"](__dict_Monoid_7["__superclass_Prelude.Semigroup_0"]())(g(_3));
                    })(Data_Monoid.mempty(__dict_Monoid_7))(p);
                };
            };
        };
    };
};
var bifoldMapDefaultL = function (__dict_Bifoldable_8) {
    return function (__dict_Monoid_9) {
        return function (f) {
            return function (g) {
                return function (p) {
                    return bifoldl(__dict_Bifoldable_8)(function (m) {
                        return function (a) {
                            return Prelude["<>"](__dict_Monoid_9["__superclass_Prelude.Semigroup_0"]())(m)(f(a));
                        };
                    })(function (m) {
                        return function (b) {
                            return Prelude["<>"](__dict_Monoid_9["__superclass_Prelude.Semigroup_0"]())(m)(g(b));
                        };
                    })(Data_Monoid.mempty(__dict_Monoid_9))(p);
                };
            };
        };
    };
};
var bifoldMap = function (dict) {
    return dict.bifoldMap;
};
var bifoldlDefault = function (__dict_Bifoldable_10) {
    return function (f) {
        return function (g) {
            return function (z) {
                return function (p) {
                    return Data_Monoid_Endo.runEndo(Data_Monoid_Dual.runDual(bifoldMap(__dict_Bifoldable_10)(Data_Monoid_Dual.monoidDual(Data_Monoid_Endo.monoidEndo))(function (_4) {
                        return Data_Monoid_Dual.Dual(Data_Monoid_Endo.Endo(Prelude.flip(f)(_4)));
                    })(function (_5) {
                        return Data_Monoid_Dual.Dual(Data_Monoid_Endo.Endo(Prelude.flip(g)(_5)));
                    })(p)))(z);
                };
            };
        };
    };
};
var bifoldrDefault = function (__dict_Bifoldable_11) {
    return function (f) {
        return function (g) {
            return function (z) {
                return function (p) {
                    return Data_Monoid_Endo.runEndo(bifoldMap(__dict_Bifoldable_11)(Data_Monoid_Endo.monoidEndo)(function (_6) {
                        return Data_Monoid_Endo.Endo(f(_6));
                    })(function (_7) {
                        return Data_Monoid_Endo.Endo(g(_7));
                    })(p))(z);
                };
            };
        };
    };
};
var bifold = function (__dict_Bifoldable_12) {
    return function (__dict_Monoid_13) {
        return bifoldMap(__dict_Bifoldable_12)(__dict_Monoid_13)(Prelude.id(Prelude.categoryFn))(Prelude.id(Prelude.categoryFn));
    };
};
var biany = function (__dict_Bifoldable_14) {
    return function (__dict_BooleanAlgebra_15) {
        return function (p) {
            return function (q) {
                return function (_8) {
                    return Data_Monoid_Disj.runDisj(bifoldMap(__dict_Bifoldable_14)(Data_Monoid_Disj.monoidDisj(__dict_BooleanAlgebra_15))(function (_9) {
                        return Data_Monoid_Disj.Disj(p(_9));
                    })(function (_10) {
                        return Data_Monoid_Disj.Disj(q(_10));
                    })(_8));
                };
            };
        };
    };
};
var biall = function (__dict_Bifoldable_16) {
    return function (__dict_BooleanAlgebra_17) {
        return function (p) {
            return function (q) {
                return function (_11) {
                    return Data_Monoid_Conj.runConj(bifoldMap(__dict_Bifoldable_16)(Data_Monoid_Conj.monoidConj(__dict_BooleanAlgebra_17))(function (_12) {
                        return Data_Monoid_Conj.Conj(p(_12));
                    })(function (_13) {
                        return Data_Monoid_Conj.Conj(q(_13));
                    })(_11));
                };
            };
        };
    };
};
module.exports = {
    Bifoldable: Bifoldable, 
    biall: biall, 
    biany: biany, 
    bisequence_: bisequence_, 
    bifor_: bifor_, 
    bitraverse_: bitraverse_, 
    bifold: bifold, 
    bifoldMapDefaultL: bifoldMapDefaultL, 
    bifoldMapDefaultR: bifoldMapDefaultR, 
    bifoldlDefault: bifoldlDefault, 
    bifoldrDefault: bifoldrDefault, 
    bifoldMap: bifoldMap, 
    bifoldl: bifoldl, 
    bifoldr: bifoldr
};

},{"Control.Apply":"/Users/maximko/Projects/mine/guppi/output/Control.Apply/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Monoid.Conj":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Conj/index.js","Data.Monoid.Disj":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Disj/index.js","Data.Monoid.Dual":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Dual/index.js","Data.Monoid.Endo":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Endo/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Bifunctor/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Bifunctor = function (bimap) {
    this.bimap = bimap;
};
var bimap = function (dict) {
    return dict.bimap;
};
var lmap = function (__dict_Bifunctor_0) {
    return function (f) {
        return bimap(__dict_Bifunctor_0)(f)(Prelude.id(Prelude.categoryFn));
    };
};
var rmap = function (__dict_Bifunctor_1) {
    return bimap(__dict_Bifunctor_1)(Prelude.id(Prelude.categoryFn));
};
module.exports = {
    Bifunctor: Bifunctor, 
    rmap: rmap, 
    lmap: lmap, 
    bimap: bimap
};

},{"Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Bitraversable/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Bifoldable = require("Data.Bifoldable");
var Data_Bifunctor = require("Data.Bifunctor");
var Bitraversable = function (__superclass_Data$dotBifoldable$dotBifoldable_1, __superclass_Data$dotBifunctor$dotBifunctor_0, bisequence, bitraverse) {
    this["__superclass_Data.Bifoldable.Bifoldable_1"] = __superclass_Data$dotBifoldable$dotBifoldable_1;
    this["__superclass_Data.Bifunctor.Bifunctor_0"] = __superclass_Data$dotBifunctor$dotBifunctor_0;
    this.bisequence = bisequence;
    this.bitraverse = bitraverse;
};
var bitraverse = function (dict) {
    return dict.bitraverse;
};
var bisequenceDefault = function (__dict_Bitraversable_0) {
    return function (__dict_Applicative_1) {
        return function (t) {
            return bitraverse(__dict_Bitraversable_0)(__dict_Applicative_1)(Prelude.id(Prelude.categoryFn))(Prelude.id(Prelude.categoryFn))(t);
        };
    };
};
var bisequence = function (dict) {
    return dict.bisequence;
};
var bitraverseDefault = function (__dict_Bitraversable_2) {
    return function (__dict_Applicative_3) {
        return function (f) {
            return function (g) {
                return function (t) {
                    return bisequence(__dict_Bitraversable_2)(__dict_Applicative_3)(Data_Bifunctor.bimap(__dict_Bitraversable_2["__superclass_Data.Bifunctor.Bifunctor_0"]())(f)(g)(t));
                };
            };
        };
    };
};
var bifor = function (__dict_Bitraversable_4) {
    return function (__dict_Applicative_5) {
        return function (t) {
            return function (f) {
                return function (g) {
                    return bitraverse(__dict_Bitraversable_4)(__dict_Applicative_5)(f)(g)(t);
                };
            };
        };
    };
};
module.exports = {
    Bitraversable: Bitraversable, 
    bifor: bifor, 
    bisequenceDefault: bisequenceDefault, 
    bitraverseDefault: bitraverseDefault, 
    bisequence: bisequence, 
    bitraverse: bitraverse
};

},{"Data.Bifoldable":"/Users/maximko/Projects/mine/guppi/output/Data.Bifoldable/index.js","Data.Bifunctor":"/Users/maximko/Projects/mine/guppi/output/Data.Bifunctor/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.CatList/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Maybe = require("Data.Maybe");
var Data_Monoid = require("Data.Monoid");
var Data_Tuple = require("Data.Tuple");
var Data_CatQueue = require("Data.CatQueue");
var Data_List = require("Data.List");
var CatNil = (function () {
    function CatNil() {

    };
    CatNil.value = new CatNil();
    return CatNil;
})();
var CatCons = (function () {
    function CatCons(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    CatCons.create = function (value0) {
        return function (value1) {
            return new CatCons(value0, value1);
        };
    };
    return CatCons;
})();
var showCatList = function (__dict_Show_0) {
    return new Prelude.Show(function (_6) {
        if (_6 instanceof CatNil) {
            return "CatNil";
        };
        if (_6 instanceof CatCons) {
            return "CatList (" + (Prelude.show(__dict_Show_0)(_6.value0) + (") (" + (Prelude.show(Data_CatQueue.showCatQueue(showCatList(__dict_Show_0)))(_6.value1) + ")")));
        };
        throw new Error("Failed pattern match: " + [ _6.constructor.name ]);
    });
};
var $$null = function (_0) {
    if (_0 instanceof CatNil) {
        return true;
    };
    return false;
};
var link = function (_4) {
    return function (cat) {
        if (_4 instanceof CatNil) {
            return cat;
        };
        if (_4 instanceof CatCons) {
            return new CatCons(_4.value0, Data_CatQueue.snoc(_4.value1)(cat));
        };
        throw new Error("Failed pattern match at Data.CatList line 88, column 1 - line 89, column 1: " + [ _4.constructor.name, cat.constructor.name ]);
    };
};
var foldr = function (k) {
    return function (b) {
        return function (q) {
            var foldl = function (__copy_k_1) {
                return function (__copy_c) {
                    return function (__copy__5) {
                        var k_1 = __copy_k_1;
                        var c = __copy_c;
                        var _5 = __copy__5;
                        tco: while (true) {
                            var c_1 = c;
                            if (_5 instanceof Data_List.Nil) {
                                return c_1;
                            };
                            if (_5 instanceof Data_List.Cons) {
                                var __tco_k_1 = k_1;
                                var __tco_c = k_1(c)(_5.value0);
                                var __tco__5 = _5.value1;
                                k_1 = __tco_k_1;
                                c = __tco_c;
                                _5 = __tco__5;
                                continue tco;
                            };
                            throw new Error("Failed pattern match at Data.CatList line 95, column 1 - line 96, column 1: " + [ k_1.constructor.name, c.constructor.name, _5.constructor.name ]);
                        };
                    };
                };
            };
            var go = function (__copy_xs) {
                return function (__copy_ys) {
                    var xs = __copy_xs;
                    var ys = __copy_ys;
                    tco: while (true) {
                        var _20 = Data_CatQueue.uncons(xs);
                        if (_20 instanceof Data_Maybe.Nothing) {
                            return foldl(function (x) {
                                return function (i) {
                                    return i(x);
                                };
                            })(b)(ys);
                        };
                        if (_20 instanceof Data_Maybe.Just) {
                            var __tco_ys = new Data_List.Cons(k(_20.value0.value0), ys);
                            xs = _20.value0.value1;
                            ys = __tco_ys;
                            continue tco;
                        };
                        throw new Error("Failed pattern match at Data.CatList line 95, column 1 - line 96, column 1: " + [ _20.constructor.name ]);
                    };
                };
            };
            return go(q)(Data_List.Nil.value);
        };
    };
};
var uncons = function (_3) {
    if (_3 instanceof CatNil) {
        return Data_Maybe.Nothing.value;
    };
    if (_3 instanceof CatCons) {
        return new Data_Maybe.Just(new Data_Tuple.Tuple(_3.value0, (function () {
            var _25 = Data_CatQueue["null"](_3.value1);
            if (_25) {
                return CatNil.value;
            };
            if (!_25) {
                return foldr(link)(CatNil.value)(_3.value1);
            };
            throw new Error("Failed pattern match at Data.CatList line 79, column 1 - line 80, column 1: " + [ _25.constructor.name ]);
        })()));
    };
    throw new Error("Failed pattern match at Data.CatList line 79, column 1 - line 80, column 1: " + [ _3.constructor.name ]);
};
var empty = CatNil.value;
var append = function (_1) {
    return function (_2) {
        if (_2 instanceof CatNil) {
            return _1;
        };
        if (_1 instanceof CatNil) {
            return _2;
        };
        return link(_1)(_2);
    };
};
var cons = function (a) {
    return function (cat) {
        return append(new CatCons(a, Data_CatQueue.empty))(cat);
    };
};
var semigroupCatList = new Prelude.Semigroup(append);
var monoidCatList = new Data_Monoid.Monoid(function () {
    return semigroupCatList;
}, CatNil.value);
var snoc = function (cat) {
    return function (a) {
        return append(cat)(new CatCons(a, Data_CatQueue.empty));
    };
};
module.exports = {
    CatNil: CatNil, 
    CatCons: CatCons, 
    uncons: uncons, 
    snoc: snoc, 
    cons: cons, 
    append: append, 
    "null": $$null, 
    empty: empty, 
    semigroupCatList: semigroupCatList, 
    monoidCatList: monoidCatList, 
    showCatList: showCatList
};

},{"Data.CatQueue":"/Users/maximko/Projects/mine/guppi/output/Data.CatQueue/index.js","Data.List":"/Users/maximko/Projects/mine/guppi/output/Data.List/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.CatQueue/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_List = require("Data.List");
var Data_Maybe = require("Data.Maybe");
var Data_Tuple = require("Data.Tuple");
var CatQueue = (function () {
    function CatQueue(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    CatQueue.create = function (value0) {
        return function (value1) {
            return new CatQueue(value0, value1);
        };
    };
    return CatQueue;
})();
var uncons = function (__copy__2) {
    var _2 = __copy__2;
    tco: while (true) {
        if (_2.value0 instanceof Data_List.Nil && _2.value1 instanceof Data_List.Nil) {
            return Data_Maybe.Nothing.value;
        };
        if (_2.value0 instanceof Data_List.Nil) {
            var __tco__2 = new CatQueue(Data_List.reverse(_2.value1), Data_List.Nil.value);
            _2 = __tco__2;
            continue tco;
        };
        if (_2.value0 instanceof Data_List.Cons) {
            return new Data_Maybe.Just(new Data_Tuple.Tuple(_2.value0.value0, new CatQueue(_2.value0.value1, _2.value1)));
        };
        throw new Error("Failed pattern match: " + [ _2.constructor.name ]);
    };
};
var snoc = function (_1) {
    return function (a) {
        return new CatQueue(_1.value0, new Data_List.Cons(a, _1.value1));
    };
};
var showCatQueue = function (__dict_Show_0) {
    return new Prelude.Show(function (_3) {
        return "CatQueue (" + (Prelude.show(Data_List.showList(__dict_Show_0))(_3.value0) + (") (" + (Prelude.show(Data_List.showList(__dict_Show_0))(_3.value1) + ")")));
    });
};
var $$null = function (_0) {
    if (_0.value0 instanceof Data_List.Nil && _0.value1 instanceof Data_List.Nil) {
        return true;
    };
    return false;
};
var empty = new CatQueue(Data_List.Nil.value, Data_List.Nil.value);
module.exports = {
    CatQueue: CatQueue, 
    uncons: uncons, 
    snoc: snoc, 
    "null": $$null, 
    empty: empty, 
    showCatQueue: showCatQueue
};

},{"Data.List":"/Users/maximko/Projects/mine/guppi/output/Data.List/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Char/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Data.Char

exports.toString = function (c) {
  return c;
};

exports.toCharCode = function (c) {
  return c.charCodeAt(0);
};

exports.fromCharCode = function (c) {
  return String.fromCharCode(c);
};

exports.toLower = function (c) {
  return c.toLowerCase();
};

exports.toUpper = function (c) {
  return c.toUpperCase();
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Data.Char/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
module.exports = {
    toUpper: $foreign.toUpper, 
    toLower: $foreign.toLower, 
    toCharCode: $foreign.toCharCode, 
    fromCharCode: $foreign.fromCharCode, 
    toString: $foreign.toString
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Char/foreign.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Const/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Bifoldable = require("Data.Bifoldable");
var Data_Foldable = require("Data.Foldable");
var Data_Functor_Contravariant = require("Data.Functor.Contravariant");
var Data_Functor_Invariant = require("Data.Functor.Invariant");
var Data_Monoid = require("Data.Monoid");
var Data_Traversable = require("Data.Traversable");
var Const = function (x) {
    return x;
};
var showConst = function (__dict_Show_2) {
    return new Prelude.Show(function (_5) {
        return "Const (" + (Prelude.show(__dict_Show_2)(_5) + ")");
    });
};
var semigroupoidConst = new Prelude.Semigroupoid(function (_6) {
    return function (_7) {
        return _7;
    };
});
var semigroupConst = function (__dict_Semigroup_3) {
    return new Prelude.Semigroup(function (_8) {
        return function (_9) {
            return Prelude["<>"](__dict_Semigroup_3)(_8)(_9);
        };
    });
};
var monoidConst = function (__dict_Monoid_5) {
    return new Data_Monoid.Monoid(function () {
        return semigroupConst(__dict_Monoid_5["__superclass_Prelude.Semigroup_0"]());
    }, Data_Monoid.mempty(__dict_Monoid_5));
};
var getConst = function (_0) {
    return _0;
};
var functorConst = new Prelude.Functor(function (_10) {
    return function (_11) {
        return _11;
    };
});
var invariantConst = new Data_Functor_Invariant.Invariant(Data_Functor_Invariant.imapF(functorConst));
var foldableConst = new Data_Foldable.Foldable(function (__dict_Monoid_6) {
    return function (_23) {
        return function (_24) {
            return Data_Monoid.mempty(__dict_Monoid_6);
        };
    };
}, function (_21) {
    return function (z) {
        return function (_22) {
            return z;
        };
    };
}, function (_19) {
    return function (z) {
        return function (_20) {
            return z;
        };
    };
});
var traversableConst = new Data_Traversable.Traversable(function () {
    return foldableConst;
}, function () {
    return functorConst;
}, function (__dict_Applicative_1) {
    return function (_27) {
        return Prelude.pure(__dict_Applicative_1)(_27);
    };
}, function (__dict_Applicative_0) {
    return function (_25) {
        return function (_26) {
            return Prelude.pure(__dict_Applicative_0)(_26);
        };
    };
});
var eqConst = function (__dict_Eq_7) {
    return new Prelude.Eq(function (_1) {
        return function (_2) {
            return Prelude["=="](__dict_Eq_7)(_1)(_2);
        };
    });
};
var ordConst = function (__dict_Ord_4) {
    return new Prelude.Ord(function () {
        return eqConst(__dict_Ord_4["__superclass_Prelude.Eq_0"]());
    }, function (_3) {
        return function (_4) {
            return Prelude.compare(__dict_Ord_4)(_3)(_4);
        };
    });
};
var contravariantConst = new Data_Functor_Contravariant.Contravariant(function (_17) {
    return function (_18) {
        return _18;
    };
});
var boundedConst = function (__dict_Bounded_8) {
    return new Prelude.Bounded(Prelude.bottom(__dict_Bounded_8), Prelude.top(__dict_Bounded_8));
};
var applyConst = function (__dict_Semigroup_10) {
    return new Prelude.Apply(function () {
        return functorConst;
    }, function (_12) {
        return function (_13) {
            return Prelude["<>"](__dict_Semigroup_10)(_12)(_13);
        };
    });
};
var bindConst = function (__dict_Semigroup_9) {
    return new Prelude.Bind(function () {
        return applyConst(__dict_Semigroup_9);
    }, function (_14) {
        return function (_15) {
            return _14;
        };
    });
};
var applicativeConst = function (__dict_Monoid_11) {
    return new Prelude.Applicative(function () {
        return applyConst(__dict_Monoid_11["__superclass_Prelude.Semigroup_0"]());
    }, function (_16) {
        return Data_Monoid.mempty(__dict_Monoid_11);
    });
};
module.exports = {
    Const: Const, 
    getConst: getConst, 
    eqConst: eqConst, 
    ordConst: ordConst, 
    boundedConst: boundedConst, 
    showConst: showConst, 
    semigroupoidConst: semigroupoidConst, 
    semigroupConst: semigroupConst, 
    monoidConst: monoidConst, 
    functorConst: functorConst, 
    invariantConst: invariantConst, 
    applyConst: applyConst, 
    bindConst: bindConst, 
    applicativeConst: applicativeConst, 
    contravariantConst: contravariantConst, 
    foldableConst: foldableConst, 
    traversableConst: traversableConst
};

},{"Data.Bifoldable":"/Users/maximko/Projects/mine/guppi/output/Data.Bifoldable/index.js","Data.Foldable":"/Users/maximko/Projects/mine/guppi/output/Data.Foldable/index.js","Data.Functor.Contravariant":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Contravariant/index.js","Data.Functor.Invariant":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Invariant/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Traversable":"/Users/maximko/Projects/mine/guppi/output/Data.Traversable/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Distributive/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Identity = require("Data.Identity");
var Distributive = function (__superclass_Prelude$dotFunctor_0, collect, distribute) {
    this["__superclass_Prelude.Functor_0"] = __superclass_Prelude$dotFunctor_0;
    this.collect = collect;
    this.distribute = distribute;
};
var distributiveIdentity = new Distributive(function () {
    return Data_Identity.functorIdentity;
}, function (__dict_Functor_1) {
    return function (f) {
        return function (_1) {
            return Data_Identity.Identity(Prelude.map(__dict_Functor_1)(function (_2) {
                return Data_Identity.runIdentity(f(_2));
            })(_1));
        };
    };
}, function (__dict_Functor_0) {
    return function (_3) {
        return Data_Identity.Identity(Prelude.map(__dict_Functor_0)(Data_Identity.runIdentity)(_3));
    };
});
var distribute = function (dict) {
    return dict.distribute;
};
var distributiveFunction = new Distributive(function () {
    return Prelude.functorFn;
}, function (__dict_Functor_3) {
    return function (f) {
        return function (_4) {
            return distribute(distributiveFunction)(__dict_Functor_3)(Prelude.map(__dict_Functor_3)(f)(_4));
        };
    };
}, function (__dict_Functor_2) {
    return function (a) {
        return function (e) {
            return Prelude.map(__dict_Functor_2)(function (_0) {
                return _0(e);
            })(a);
        };
    };
});
var cotraverse = function (__dict_Distributive_4) {
    return function (__dict_Functor_5) {
        return function (f) {
            return function (_5) {
                return Prelude.map(__dict_Distributive_4["__superclass_Prelude.Functor_0"]())(f)(distribute(__dict_Distributive_4)(__dict_Functor_5)(_5));
            };
        };
    };
};
var collect = function (dict) {
    return dict.collect;
};
module.exports = {
    Distributive: Distributive, 
    cotraverse: cotraverse, 
    collect: collect, 
    distribute: distribute, 
    distributiveIdentity: distributiveIdentity, 
    distributiveFunction: distributiveFunction
};

},{"Data.Identity":"/Users/maximko/Projects/mine/guppi/output/Data.Identity/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Either.Unsafe/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Data.Either.Unsafe

exports.unsafeThrow = function (msg) {
  throw new Error(msg);
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Data.Either.Unsafe/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Data_Either = require("Data.Either");
var fromRight = function (_1) {
    if (_1 instanceof Data_Either.Right) {
        return _1.value0;
    };
    return $foreign.unsafeThrow("Data.Either.Unsafe.fromRight called on Left value");
};
var fromLeft = function (_0) {
    if (_0 instanceof Data_Either.Left) {
        return _0.value0;
    };
    return $foreign.unsafeThrow("Data.Either.Unsafe.fromLeft called on Right value");
};
module.exports = {
    fromRight: fromRight, 
    fromLeft: fromLeft
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Either.Unsafe/foreign.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Alt = require("Control.Alt");
var Control_Extend = require("Control.Extend");
var Data_Bifoldable = require("Data.Bifoldable");
var Data_Bifunctor = require("Data.Bifunctor");
var Data_Bitraversable = require("Data.Bitraversable");
var Data_Foldable = require("Data.Foldable");
var Data_Monoid = require("Data.Monoid");
var Data_Traversable = require("Data.Traversable");
var Left = (function () {
    function Left(value0) {
        this.value0 = value0;
    };
    Left.create = function (value0) {
        return new Left(value0);
    };
    return Left;
})();
var Right = (function () {
    function Right(value0) {
        this.value0 = value0;
    };
    Right.create = function (value0) {
        return new Right(value0);
    };
    return Right;
})();
var showEither = function (__dict_Show_2) {
    return function (__dict_Show_3) {
        return new Prelude.Show(function (_7) {
            if (_7 instanceof Left) {
                return "Left (" + (Prelude.show(__dict_Show_2)(_7.value0) + ")");
            };
            if (_7 instanceof Right) {
                return "Right (" + (Prelude.show(__dict_Show_3)(_7.value0) + ")");
            };
            throw new Error("Failed pattern match at Data.Either line 174, column 1 - line 181, column 1: " + [ _7.constructor.name ]);
        });
    };
};
var functorEither = new Prelude.Functor(function (f) {
    return function (_2) {
        if (_2 instanceof Left) {
            return new Left(_2.value0);
        };
        if (_2 instanceof Right) {
            return new Right(f(_2.value0));
        };
        throw new Error("Failed pattern match at Data.Either line 52, column 1 - line 56, column 1: " + [ f.constructor.name, _2.constructor.name ]);
    };
});
var foldableEither = new Data_Foldable.Foldable(function (__dict_Monoid_8) {
    return function (f) {
        return function (_14) {
            if (_14 instanceof Left) {
                return Data_Monoid.mempty(__dict_Monoid_8);
            };
            if (_14 instanceof Right) {
                return f(_14.value0);
            };
            throw new Error("Failed pattern match at Data.Either line 201, column 1 - line 209, column 1: " + [ f.constructor.name, _14.constructor.name ]);
        };
    };
}, function (f) {
    return function (z) {
        return function (_13) {
            if (_13 instanceof Left) {
                return z;
            };
            if (_13 instanceof Right) {
                return f(z)(_13.value0);
            };
            throw new Error("Failed pattern match at Data.Either line 201, column 1 - line 209, column 1: " + [ f.constructor.name, z.constructor.name, _13.constructor.name ]);
        };
    };
}, function (f) {
    return function (z) {
        return function (_12) {
            if (_12 instanceof Left) {
                return z;
            };
            if (_12 instanceof Right) {
                return f(_12.value0)(z);
            };
            throw new Error("Failed pattern match at Data.Either line 201, column 1 - line 209, column 1: " + [ f.constructor.name, z.constructor.name, _12.constructor.name ]);
        };
    };
});
var traversableEither = new Data_Traversable.Traversable(function () {
    return foldableEither;
}, function () {
    return functorEither;
}, function (__dict_Applicative_1) {
    return function (_19) {
        if (_19 instanceof Left) {
            return Prelude.pure(__dict_Applicative_1)(new Left(_19.value0));
        };
        if (_19 instanceof Right) {
            return Prelude["<$>"]((__dict_Applicative_1["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Right.create)(_19.value0);
        };
        throw new Error("Failed pattern match at Data.Either line 217, column 1 - line 223, column 1: " + [ _19.constructor.name ]);
    };
}, function (__dict_Applicative_0) {
    return function (f) {
        return function (_18) {
            if (_18 instanceof Left) {
                return Prelude.pure(__dict_Applicative_0)(new Left(_18.value0));
            };
            if (_18 instanceof Right) {
                return Prelude["<$>"]((__dict_Applicative_0["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Right.create)(f(_18.value0));
            };
            throw new Error("Failed pattern match at Data.Either line 217, column 1 - line 223, column 1: " + [ f.constructor.name, _18.constructor.name ]);
        };
    };
});
var extendEither = new Control_Extend.Extend(function () {
    return functorEither;
}, function (f) {
    return function (_6) {
        if (_6 instanceof Left) {
            return new Left(_6.value0);
        };
        return new Right(f(_6));
    };
});
var eqEither = function (__dict_Eq_9) {
    return function (__dict_Eq_10) {
        return new Prelude.Eq(function (_8) {
            return function (_9) {
                if (_8 instanceof Left && _9 instanceof Left) {
                    return Prelude["=="](__dict_Eq_9)(_8.value0)(_9.value0);
                };
                if (_8 instanceof Right && _9 instanceof Right) {
                    return Prelude["=="](__dict_Eq_10)(_8.value0)(_9.value0);
                };
                return false;
            };
        });
    };
};
var ordEither = function (__dict_Ord_6) {
    return function (__dict_Ord_7) {
        return new Prelude.Ord(function () {
            return eqEither(__dict_Ord_6["__superclass_Prelude.Eq_0"]())(__dict_Ord_7["__superclass_Prelude.Eq_0"]());
        }, function (_10) {
            return function (_11) {
                if (_10 instanceof Left && _11 instanceof Left) {
                    return Prelude.compare(__dict_Ord_6)(_10.value0)(_11.value0);
                };
                if (_10 instanceof Right && _11 instanceof Right) {
                    return Prelude.compare(__dict_Ord_7)(_10.value0)(_11.value0);
                };
                if (_10 instanceof Left) {
                    return Prelude.LT.value;
                };
                if (_11 instanceof Left) {
                    return Prelude.GT.value;
                };
                throw new Error("Failed pattern match at Data.Either line 191, column 1 - line 197, column 1: " + [ _10.constructor.name, _11.constructor.name ]);
            };
        });
    };
};
var either = function (f) {
    return function (g) {
        return function (_1) {
            if (_1 instanceof Left) {
                return f(_1.value0);
            };
            if (_1 instanceof Right) {
                return g(_1.value0);
            };
            throw new Error("Failed pattern match at Data.Either line 28, column 1 - line 29, column 1: " + [ f.constructor.name, g.constructor.name, _1.constructor.name ]);
        };
    };
};
var isLeft = either(Prelude["const"](true))(Prelude["const"](false));
var isRight = either(Prelude["const"](false))(Prelude["const"](true));
var boundedEither = function (__dict_Bounded_11) {
    return function (__dict_Bounded_12) {
        return new Prelude.Bounded(new Left(Prelude.bottom(__dict_Bounded_11)), new Right(Prelude.top(__dict_Bounded_12)));
    };
};
var bifunctorEither = new Data_Bifunctor.Bifunctor(function (f) {
    return function (g) {
        return function (_3) {
            if (_3 instanceof Left) {
                return new Left(f(_3.value0));
            };
            if (_3 instanceof Right) {
                return new Right(g(_3.value0));
            };
            throw new Error("Failed pattern match at Data.Either line 56, column 1 - line 92, column 1: " + [ f.constructor.name, g.constructor.name, _3.constructor.name ]);
        };
    };
});
var bifoldableEither = new Data_Bifoldable.Bifoldable(function (__dict_Monoid_15) {
    return function (f) {
        return function (g) {
            return function (_17) {
                if (_17 instanceof Left) {
                    return f(_17.value0);
                };
                if (_17 instanceof Right) {
                    return g(_17.value0);
                };
                throw new Error("Failed pattern match at Data.Either line 209, column 1 - line 217, column 1: " + [ f.constructor.name, g.constructor.name, _17.constructor.name ]);
            };
        };
    };
}, function (f) {
    return function (g) {
        return function (z) {
            return function (_16) {
                if (_16 instanceof Left) {
                    return f(z)(_16.value0);
                };
                if (_16 instanceof Right) {
                    return g(z)(_16.value0);
                };
                throw new Error("Failed pattern match at Data.Either line 209, column 1 - line 217, column 1: " + [ f.constructor.name, g.constructor.name, z.constructor.name, _16.constructor.name ]);
            };
        };
    };
}, function (f) {
    return function (g) {
        return function (z) {
            return function (_15) {
                if (_15 instanceof Left) {
                    return f(_15.value0)(z);
                };
                if (_15 instanceof Right) {
                    return g(_15.value0)(z);
                };
                throw new Error("Failed pattern match at Data.Either line 209, column 1 - line 217, column 1: " + [ f.constructor.name, g.constructor.name, z.constructor.name, _15.constructor.name ]);
            };
        };
    };
});
var bitraversableEither = new Data_Bitraversable.Bitraversable(function () {
    return bifoldableEither;
}, function () {
    return bifunctorEither;
}, function (__dict_Applicative_14) {
    return function (_21) {
        if (_21 instanceof Left) {
            return Prelude["<$>"]((__dict_Applicative_14["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Left.create)(_21.value0);
        };
        if (_21 instanceof Right) {
            return Prelude["<$>"]((__dict_Applicative_14["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Right.create)(_21.value0);
        };
        throw new Error("Failed pattern match at Data.Either line 223, column 1 - line 229, column 1: " + [ _21.constructor.name ]);
    };
}, function (__dict_Applicative_13) {
    return function (f) {
        return function (g) {
            return function (_20) {
                if (_20 instanceof Left) {
                    return Prelude["<$>"]((__dict_Applicative_13["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Left.create)(f(_20.value0));
                };
                if (_20 instanceof Right) {
                    return Prelude["<$>"]((__dict_Applicative_13["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Right.create)(g(_20.value0));
                };
                throw new Error("Failed pattern match at Data.Either line 223, column 1 - line 229, column 1: " + [ f.constructor.name, g.constructor.name, _20.constructor.name ]);
            };
        };
    };
});
var applyEither = new Prelude.Apply(function () {
    return functorEither;
}, function (_4) {
    return function (r) {
        if (_4 instanceof Left) {
            return new Left(_4.value0);
        };
        if (_4 instanceof Right) {
            return Prelude["<$>"](functorEither)(_4.value0)(r);
        };
        throw new Error("Failed pattern match at Data.Either line 92, column 1 - line 116, column 1: " + [ _4.constructor.name, r.constructor.name ]);
    };
});
var bindEither = new Prelude.Bind(function () {
    return applyEither;
}, either(function (e) {
    return function (_0) {
        return new Left(e);
    };
})(function (a) {
    return function (f) {
        return f(a);
    };
}));
var semigroupEither = function (__dict_Semigroup_5) {
    return new Prelude.Semigroup(function (x) {
        return function (y) {
            return Prelude["<*>"](applyEither)(Prelude["<$>"](functorEither)(Prelude.append(__dict_Semigroup_5))(x))(y);
        };
    });
};
var semiringEither = function (__dict_Semiring_4) {
    return new Prelude.Semiring(function (x) {
        return function (y) {
            return Prelude["<*>"](applyEither)(Prelude["<$>"](functorEither)(Prelude.add(__dict_Semiring_4))(x))(y);
        };
    }, function (x) {
        return function (y) {
            return Prelude["<*>"](applyEither)(Prelude["<$>"](functorEither)(Prelude.mul(__dict_Semiring_4))(x))(y);
        };
    }, new Right(Prelude.one(__dict_Semiring_4)), new Right(Prelude.zero(__dict_Semiring_4)));
};
var applicativeEither = new Prelude.Applicative(function () {
    return applyEither;
}, Right.create);
var monadEither = new Prelude.Monad(function () {
    return applicativeEither;
}, function () {
    return bindEither;
});
var altEither = new Control_Alt.Alt(function () {
    return functorEither;
}, function (_5) {
    return function (r) {
        if (_5 instanceof Left) {
            return r;
        };
        return _5;
    };
});
module.exports = {
    Left: Left, 
    Right: Right, 
    isRight: isRight, 
    isLeft: isLeft, 
    either: either, 
    functorEither: functorEither, 
    bifunctorEither: bifunctorEither, 
    applyEither: applyEither, 
    applicativeEither: applicativeEither, 
    altEither: altEither, 
    bindEither: bindEither, 
    monadEither: monadEither, 
    extendEither: extendEither, 
    showEither: showEither, 
    eqEither: eqEither, 
    ordEither: ordEither, 
    boundedEither: boundedEither, 
    foldableEither: foldableEither, 
    bifoldableEither: bifoldableEither, 
    traversableEither: traversableEither, 
    bitraversableEither: bitraversableEither, 
    semiringEither: semiringEither, 
    semigroupEither: semigroupEither
};

},{"Control.Alt":"/Users/maximko/Projects/mine/guppi/output/Control.Alt/index.js","Control.Extend":"/Users/maximko/Projects/mine/guppi/output/Control.Extend/index.js","Data.Bifoldable":"/Users/maximko/Projects/mine/guppi/output/Data.Bifoldable/index.js","Data.Bifunctor":"/Users/maximko/Projects/mine/guppi/output/Data.Bifunctor/index.js","Data.Bitraversable":"/Users/maximko/Projects/mine/guppi/output/Data.Bitraversable/index.js","Data.Foldable":"/Users/maximko/Projects/mine/guppi/output/Data.Foldable/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Traversable":"/Users/maximko/Projects/mine/guppi/output/Data.Traversable/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Enum/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Char = require("Data.Char");
var Data_Either = require("Data.Either");
var Data_Maybe = require("Data.Maybe");
var Data_Maybe_Unsafe = require("Data.Maybe.Unsafe");
var Data_Tuple = require("Data.Tuple");
var Data_Unfoldable = require("Data.Unfoldable");
var Cardinality = function (x) {
    return x;
};
var Enum = function (__superclass_Prelude$dotBounded_0, cardinality, fromEnum, pred, succ, toEnum) {
    this["__superclass_Prelude.Bounded_0"] = __superclass_Prelude$dotBounded_0;
    this.cardinality = cardinality;
    this.fromEnum = fromEnum;
    this.pred = pred;
    this.succ = succ;
    this.toEnum = toEnum;
};
var toEnum = function (dict) {
    return dict.toEnum;
};
var succ = function (dict) {
    return dict.succ;
};
var runCardinality = function (_0) {
    return _0;
};
var tupleCardinality = function (__dict_Enum_0) {
    return function (__dict_Enum_1) {
        return function (l) {
            return function (r) {
                return Cardinality(runCardinality(l) * runCardinality(r) | 0);
            };
        };
    };
};
var tupleToEnum = function (__dict_Enum_2) {
    return function (__dict_Enum_3) {
        return function (cardb) {
            return function (n) {
                return Prelude["<*>"](Data_Maybe.applyMaybe)(Prelude["<$>"](Data_Maybe.functorMaybe)(Data_Tuple.Tuple.create)(toEnum(__dict_Enum_2)(n / runCardinality(cardb) | 0)))(toEnum(__dict_Enum_3)(n % runCardinality(cardb)));
            };
        };
    };
};
var pred = function (dict) {
    return dict.pred;
};
var maybeCardinality = function (__dict_Enum_4) {
    return function (c) {
        return Cardinality(1 + runCardinality(c) | 0);
    };
};
var maybeToEnum = function (__dict_Enum_5) {
    return function (carda) {
        return function (n) {
            if (n <= runCardinality(maybeCardinality(__dict_Enum_5)(carda))) {
                var _15 = n === 0;
                if (_15) {
                    return Data_Maybe.Just.create(Data_Maybe.Nothing.value);
                };
                if (!_15) {
                    return Data_Maybe.Just.create(toEnum(__dict_Enum_5)(n - 1));
                };
                throw new Error("Failed pattern match at Data.Enum line 138, column 1 - line 139, column 1: " + [ _15.constructor.name ]);
            };
            return Data_Maybe.Nothing.value;
        };
    };
};
var intStepFromTo = function (step) {
    return function (from) {
        return function (to) {
            return Data_Unfoldable.unfoldr(Data_Unfoldable.unfoldableArray)(function (e) {
                var _16 = e <= to;
                if (_16) {
                    return Data_Maybe.Just.create(new Data_Tuple.Tuple(e, e + step | 0));
                };
                if (!_16) {
                    return Data_Maybe.Nothing.value;
                };
                throw new Error("Failed pattern match at Data.Enum line 103, column 1 - line 104, column 1: " + [ _16.constructor.name ]);
            })(from);
        };
    };
};
var intFromTo = intStepFromTo(1);
var fromEnum = function (dict) {
    return dict.fromEnum;
};
var tupleFromEnum = function (__dict_Enum_6) {
    return function (__dict_Enum_7) {
        return function (cardb) {
            return function (_3) {
                return (fromEnum(__dict_Enum_6)(_3.value0) * runCardinality(cardb) | 0) + fromEnum(__dict_Enum_7)(_3.value1) | 0;
            };
        };
    };
};
var enumFromTo = function (__dict_Enum_8) {
    return function (a) {
        return function (b) {
            var b$prime = fromEnum(__dict_Enum_8)(b);
            var a$prime = fromEnum(__dict_Enum_8)(a);
            return Prelude["<$>"](Prelude.functorArray)(Prelude[">>>"](Prelude.semigroupoidFn)(toEnum(__dict_Enum_8))(Data_Maybe_Unsafe.fromJust))(intFromTo(a$prime)(b$prime));
        };
    };
};
var enumFromThenTo = function (__dict_Enum_9) {
    return function (a) {
        return function (b) {
            return function (c) {
                var c$prime = fromEnum(__dict_Enum_9)(c);
                var b$prime = fromEnum(__dict_Enum_9)(b);
                var a$prime = fromEnum(__dict_Enum_9)(a);
                return Prelude["<$>"](Prelude.functorArray)(Prelude[">>>"](Prelude.semigroupoidFn)(toEnum(__dict_Enum_9))(Data_Maybe_Unsafe.fromJust))(intStepFromTo(b$prime - a$prime)(a$prime)(c$prime));
            };
        };
    };
};
var eitherFromEnum = function (__dict_Enum_10) {
    return function (__dict_Enum_11) {
        return function (carda) {
            return function (_4) {
                if (_4 instanceof Data_Either.Left) {
                    return fromEnum(__dict_Enum_10)(_4.value0);
                };
                if (_4 instanceof Data_Either.Right) {
                    return fromEnum(__dict_Enum_11)(_4.value0) + runCardinality(carda) | 0;
                };
                throw new Error("Failed pattern match at Data.Enum line 197, column 1 - line 198, column 1: " + [ carda.constructor.name, _4.constructor.name ]);
            };
        };
    };
};
var eitherCardinality = function (__dict_Enum_12) {
    return function (__dict_Enum_13) {
        return function (l) {
            return function (r) {
                return Cardinality(runCardinality(l) + runCardinality(r) | 0);
            };
        };
    };
};
var eitherToEnum = function (__dict_Enum_14) {
    return function (__dict_Enum_15) {
        return function (carda) {
            return function (cardb) {
                return function (n) {
                    var _25 = n >= 0 && n < runCardinality(carda);
                    if (_25) {
                        return Prelude["<$>"](Data_Maybe.functorMaybe)(Data_Either.Left.create)(toEnum(__dict_Enum_14)(n));
                    };
                    if (!_25) {
                        var _26 = n >= runCardinality(carda) && n < runCardinality(eitherCardinality(__dict_Enum_14)(__dict_Enum_15)(carda)(cardb));
                        if (_26) {
                            return Prelude["<$>"](Data_Maybe.functorMaybe)(Data_Either.Right.create)(toEnum(__dict_Enum_15)(n - runCardinality(carda)));
                        };
                        if (!_26) {
                            return Data_Maybe.Nothing.value;
                        };
                        throw new Error("Failed pattern match: " + [ _26.constructor.name ]);
                    };
                    throw new Error("Failed pattern match at Data.Enum line 189, column 1 - line 190, column 1: " + [ _25.constructor.name ]);
                };
            };
        };
    };
};
var defaultToEnum = function (succ$prime) {
    return function (bottom$prime) {
        return function (n) {
            if (n < 0) {
                return Data_Maybe.Nothing.value;
            };
            if (n === 0) {
                return new Data_Maybe.Just(bottom$prime);
            };
            if (Prelude.otherwise) {
                return Prelude[">>="](Data_Maybe.bindMaybe)(defaultToEnum(succ$prime)(bottom$prime)(n - 1))(succ$prime);
            };
            throw new Error("Failed pattern match: " + [ succ$prime.constructor.name, bottom$prime.constructor.name, n.constructor.name ]);
        };
    };
};
var defaultSucc = function (toEnum$prime) {
    return function (fromEnum$prime) {
        return function (a) {
            return toEnum$prime(fromEnum$prime(a) + 1 | 0);
        };
    };
};
var defaultPred = function (toEnum$prime) {
    return function (fromEnum$prime) {
        return function (a) {
            return toEnum$prime(fromEnum$prime(a) - 1);
        };
    };
};
var defaultFromEnum = function (pred$prime) {
    return function (e) {
        return Data_Maybe.maybe(0)(function (prd) {
            return defaultFromEnum(pred$prime)(prd) + 1 | 0;
        })(pred$prime(e));
    };
};
var charToEnum = function (n) {
    if (n >= 0 && n <= 65535) {
        return Data_Maybe.Just.create(Data_Char.fromCharCode(n));
    };
    return Data_Maybe.Nothing.value;
};
var charFromEnum = Data_Char.toCharCode;
var enumChar = new Enum(function () {
    return Prelude.boundedChar;
}, 65536, charFromEnum, defaultPred(charToEnum)(charFromEnum), defaultSucc(charToEnum)(charFromEnum), charToEnum);
var cardinality = function (dict) {
    return dict.cardinality;
};
var enumEither = function (__dict_Enum_16) {
    return function (__dict_Enum_17) {
        return new Enum(function () {
            return Data_Either.boundedEither(__dict_Enum_16["__superclass_Prelude.Bounded_0"]())(__dict_Enum_17["__superclass_Prelude.Bounded_0"]());
        }, eitherCardinality(__dict_Enum_16)(__dict_Enum_17)(cardinality(__dict_Enum_16))(cardinality(__dict_Enum_17)), eitherFromEnum(__dict_Enum_16)(__dict_Enum_17)(cardinality(__dict_Enum_16)), function (_11) {
            if (_11 instanceof Data_Either.Left) {
                return Data_Maybe.maybe(Data_Maybe.Nothing.value)(function (_51) {
                    return Data_Maybe.Just.create(Data_Either.Left.create(_51));
                })(pred(__dict_Enum_16)(_11.value0));
            };
            if (_11 instanceof Data_Either.Right) {
                return Data_Maybe.maybe(Data_Maybe.Just.create(new Data_Either.Left(Prelude.top(__dict_Enum_16["__superclass_Prelude.Bounded_0"]()))))(function (_52) {
                    return Data_Maybe.Just.create(Data_Either.Right.create(_52));
                })(pred(__dict_Enum_17)(_11.value0));
            };
            throw new Error("Failed pattern match at Data.Enum line 180, column 1 - line 189, column 1: " + [ _11.constructor.name ]);
        }, function (_10) {
            if (_10 instanceof Data_Either.Left) {
                return Data_Maybe.maybe(Data_Maybe.Just.create(new Data_Either.Right(Prelude.bottom(__dict_Enum_17["__superclass_Prelude.Bounded_0"]()))))(function (_53) {
                    return Data_Maybe.Just.create(Data_Either.Left.create(_53));
                })(succ(__dict_Enum_16)(_10.value0));
            };
            if (_10 instanceof Data_Either.Right) {
                return Data_Maybe.maybe(Data_Maybe.Nothing.value)(function (_54) {
                    return Data_Maybe.Just.create(Data_Either.Right.create(_54));
                })(succ(__dict_Enum_17)(_10.value0));
            };
            throw new Error("Failed pattern match at Data.Enum line 180, column 1 - line 189, column 1: " + [ _10.constructor.name ]);
        }, eitherToEnum(__dict_Enum_16)(__dict_Enum_17)(cardinality(__dict_Enum_16))(cardinality(__dict_Enum_17)));
    };
};
var enumMaybe = function (__dict_Enum_18) {
    return new Enum(function () {
        return Data_Maybe.boundedMaybe(__dict_Enum_18["__superclass_Prelude.Bounded_0"]());
    }, maybeCardinality(__dict_Enum_18)(cardinality(__dict_Enum_18)), function (_7) {
        if (_7 instanceof Data_Maybe.Nothing) {
            return 0;
        };
        if (_7 instanceof Data_Maybe.Just) {
            return fromEnum(__dict_Enum_18)(_7.value0) + 1 | 0;
        };
        throw new Error("Failed pattern match at Data.Enum line 128, column 1 - line 138, column 1: " + [ _7.constructor.name ]);
    }, function (_6) {
        if (_6 instanceof Data_Maybe.Nothing) {
            return Data_Maybe.Nothing.value;
        };
        if (_6 instanceof Data_Maybe.Just) {
            return Prelude["<$>"](Data_Maybe.functorMaybe)(Data_Maybe.Just.create)(pred(__dict_Enum_18)(_6.value0));
        };
        throw new Error("Failed pattern match at Data.Enum line 128, column 1 - line 138, column 1: " + [ _6.constructor.name ]);
    }, function (_5) {
        if (_5 instanceof Data_Maybe.Nothing) {
            return Data_Maybe.Just.create(Prelude.bottom(Data_Maybe.boundedMaybe(__dict_Enum_18["__superclass_Prelude.Bounded_0"]())));
        };
        if (_5 instanceof Data_Maybe.Just) {
            return Prelude["<$>"](Data_Maybe.functorMaybe)(Data_Maybe.Just.create)(succ(__dict_Enum_18)(_5.value0));
        };
        throw new Error("Failed pattern match at Data.Enum line 128, column 1 - line 138, column 1: " + [ _5.constructor.name ]);
    }, maybeToEnum(__dict_Enum_18)(cardinality(__dict_Enum_18)));
};
var enumTuple = function (__dict_Enum_19) {
    return function (__dict_Enum_20) {
        return new Enum(function () {
            return Data_Tuple.boundedTuple(__dict_Enum_19["__superclass_Prelude.Bounded_0"]())(__dict_Enum_20["__superclass_Prelude.Bounded_0"]());
        }, tupleCardinality(__dict_Enum_19)(__dict_Enum_20)(cardinality(__dict_Enum_19))(cardinality(__dict_Enum_20)), tupleFromEnum(__dict_Enum_19)(__dict_Enum_20)(cardinality(__dict_Enum_20)), function (_9) {
            return Data_Maybe.maybe(Prelude["<$>"](Data_Maybe.functorMaybe)(Prelude.flip(Data_Tuple.Tuple.create)(Prelude.bottom(__dict_Enum_20["__superclass_Prelude.Bounded_0"]())))(pred(__dict_Enum_19)(_9.value0)))(function (_55) {
                return Data_Maybe.Just.create(Data_Tuple.Tuple.create(_9.value0)(_55));
            })(pred(__dict_Enum_20)(_9.value1));
        }, function (_8) {
            return Data_Maybe.maybe(Prelude["<$>"](Data_Maybe.functorMaybe)(Prelude.flip(Data_Tuple.Tuple.create)(Prelude.bottom(__dict_Enum_20["__superclass_Prelude.Bounded_0"]())))(succ(__dict_Enum_19)(_8.value0)))(function (_56) {
                return Data_Maybe.Just.create(Data_Tuple.Tuple.create(_8.value0)(_56));
            })(succ(__dict_Enum_20)(_8.value1));
        }, tupleToEnum(__dict_Enum_19)(__dict_Enum_20)(cardinality(__dict_Enum_20)));
    };
};
var booleanSucc = function (_1) {
    if (!_1) {
        return new Data_Maybe.Just(true);
    };
    return Data_Maybe.Nothing.value;
};
var booleanPred = function (_2) {
    if (_2) {
        return new Data_Maybe.Just(false);
    };
    return Data_Maybe.Nothing.value;
};
var enumBoolean = new Enum(function () {
    return Prelude.boundedBoolean;
}, 2, defaultFromEnum(booleanPred), booleanPred, booleanSucc, defaultToEnum(booleanSucc)(false));
module.exports = {
    Cardinality: Cardinality, 
    Enum: Enum, 
    enumFromThenTo: enumFromThenTo, 
    enumFromTo: enumFromTo, 
    intStepFromTo: intStepFromTo, 
    intFromTo: intFromTo, 
    defaultFromEnum: defaultFromEnum, 
    defaultToEnum: defaultToEnum, 
    defaultPred: defaultPred, 
    defaultSucc: defaultSucc, 
    toEnum: toEnum, 
    succ: succ, 
    runCardinality: runCardinality, 
    pred: pred, 
    fromEnum: fromEnum, 
    cardinality: cardinality, 
    enumChar: enumChar, 
    enumMaybe: enumMaybe, 
    enumBoolean: enumBoolean, 
    enumTuple: enumTuple, 
    enumEither: enumEither
};

},{"Data.Char":"/Users/maximko/Projects/mine/guppi/output/Data.Char/index.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Maybe.Unsafe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe.Unsafe/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Data.Unfoldable":"/Users/maximko/Projects/mine/guppi/output/Data.Unfoldable/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Exists/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Data.Exists

exports.mkExists = function (fa) {
  return fa;
};

exports.runExists = function (f) {
  return function (fa) {
    return f(fa);
  };
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Data.Exists/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
module.exports = {
    runExists: $foreign.runExists, 
    mkExists: $foreign.mkExists
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Exists/foreign.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.ExistsR/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Unsafe_Coerce = require("Unsafe.Coerce");
var runExistsR = Unsafe_Coerce.unsafeCoerce;
var mkExistsR = Unsafe_Coerce.unsafeCoerce;
module.exports = {
    runExistsR: runExistsR, 
    mkExistsR: mkExistsR
};

},{"Unsafe.Coerce":"/Users/maximko/Projects/mine/guppi/output/Unsafe.Coerce/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Foldable/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Data.Foldable

exports.foldrArray = function (f) {
  return function (init) {
    return function (xs) {
      var acc = init;
      var len = xs.length;
      for (var i = len - 1; i >= 0; i--) {
        acc = f(xs[i])(acc);
      }
      return acc;
    };
  };
};

exports.foldlArray = function (f) {
  return function (init) {
    return function (xs) {
      var acc = init;
      var len = xs.length;
      for (var i = 0; i < len; i++) {
        acc = f(acc)(xs[i]);
      }
      return acc;
    };
  };
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Data.Foldable/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Control_Apply = require("Control.Apply");
var Data_Maybe = require("Data.Maybe");
var Data_Maybe_First = require("Data.Maybe.First");
var Data_Maybe_Last = require("Data.Maybe.Last");
var Data_Monoid = require("Data.Monoid");
var Data_Monoid_Additive = require("Data.Monoid.Additive");
var Data_Monoid_Conj = require("Data.Monoid.Conj");
var Data_Monoid_Disj = require("Data.Monoid.Disj");
var Data_Monoid_Dual = require("Data.Monoid.Dual");
var Data_Monoid_Endo = require("Data.Monoid.Endo");
var Data_Monoid_Multiplicative = require("Data.Monoid.Multiplicative");
var Foldable = function (foldMap, foldl, foldr) {
    this.foldMap = foldMap;
    this.foldl = foldl;
    this.foldr = foldr;
};
var foldr = function (dict) {
    return dict.foldr;
};
var traverse_ = function (__dict_Applicative_0) {
    return function (__dict_Foldable_1) {
        return function (f) {
            return foldr(__dict_Foldable_1)(function (_109) {
                return Control_Apply["*>"](__dict_Applicative_0["__superclass_Prelude.Apply_0"]())(f(_109));
            })(Prelude.pure(__dict_Applicative_0)(Prelude.unit));
        };
    };
};
var for_ = function (__dict_Applicative_2) {
    return function (__dict_Foldable_3) {
        return Prelude.flip(traverse_(__dict_Applicative_2)(__dict_Foldable_3));
    };
};
var sequence_ = function (__dict_Applicative_4) {
    return function (__dict_Foldable_5) {
        return traverse_(__dict_Applicative_4)(__dict_Foldable_5)(Prelude.id(Prelude.categoryFn));
    };
};
var foldl = function (dict) {
    return dict.foldl;
};
var intercalate = function (__dict_Foldable_6) {
    return function (__dict_Monoid_7) {
        return function (sep) {
            return function (xs) {
                var go = function (_24) {
                    return function (x) {
                        if (_24.init) {
                            return {
                                init: false, 
                                acc: x
                            };
                        };
                        return {
                            init: false, 
                            acc: Prelude["<>"](__dict_Monoid_7["__superclass_Prelude.Semigroup_0"]())(_24.acc)(Prelude["<>"](__dict_Monoid_7["__superclass_Prelude.Semigroup_0"]())(sep)(x))
                        };
                    };
                };
                return (foldl(__dict_Foldable_6)(go)({
                    init: true, 
                    acc: Data_Monoid.mempty(__dict_Monoid_7)
                })(xs)).acc;
            };
        };
    };
};
var maximumBy = function (__dict_Foldable_8) {
    return function (cmp) {
        var max$prime = function (_25) {
            return function (_26) {
                if (_25 instanceof Data_Maybe.Nothing) {
                    return new Data_Maybe.Just(_26);
                };
                if (_25 instanceof Data_Maybe.Just) {
                    return new Data_Maybe.Just((function () {
                        var _35 = cmp(_25.value0)(_26);
                        if (_35 instanceof Prelude.GT) {
                            return _25.value0;
                        };
                        return _26;
                    })());
                };
                throw new Error("Failed pattern match at Data.Foldable line 246, column 3 - line 247, column 3: " + [ _25.constructor.name, _26.constructor.name ]);
            };
        };
        return foldl(__dict_Foldable_8)(max$prime)(Data_Maybe.Nothing.value);
    };
};
var maximum = function (__dict_Ord_9) {
    return function (__dict_Foldable_10) {
        return maximumBy(__dict_Foldable_10)(Prelude.compare(__dict_Ord_9));
    };
};
var mconcat = function (__dict_Foldable_11) {
    return function (__dict_Monoid_12) {
        return foldl(__dict_Foldable_11)(Prelude["<>"](__dict_Monoid_12["__superclass_Prelude.Semigroup_0"]()))(Data_Monoid.mempty(__dict_Monoid_12));
    };
};
var minimumBy = function (__dict_Foldable_13) {
    return function (cmp) {
        var min$prime = function (_27) {
            return function (_28) {
                if (_27 instanceof Data_Maybe.Nothing) {
                    return new Data_Maybe.Just(_28);
                };
                if (_27 instanceof Data_Maybe.Just) {
                    return new Data_Maybe.Just((function () {
                        var _39 = cmp(_27.value0)(_28);
                        if (_39 instanceof Prelude.LT) {
                            return _27.value0;
                        };
                        return _28;
                    })());
                };
                throw new Error("Failed pattern match at Data.Foldable line 261, column 3 - line 262, column 3: " + [ _27.constructor.name, _28.constructor.name ]);
            };
        };
        return foldl(__dict_Foldable_13)(min$prime)(Data_Maybe.Nothing.value);
    };
};
var minimum = function (__dict_Ord_14) {
    return function (__dict_Foldable_15) {
        return minimumBy(__dict_Foldable_15)(Prelude.compare(__dict_Ord_14));
    };
};
var product = function (__dict_Foldable_16) {
    return function (__dict_Semiring_17) {
        return foldl(__dict_Foldable_16)(Prelude["*"](__dict_Semiring_17))(Prelude.one(__dict_Semiring_17));
    };
};
var sum = function (__dict_Foldable_18) {
    return function (__dict_Semiring_19) {
        return foldl(__dict_Foldable_18)(Prelude["+"](__dict_Semiring_19))(Prelude.zero(__dict_Semiring_19));
    };
};
var foldableMultiplicative = new Foldable(function (__dict_Monoid_20) {
    return function (f) {
        return function (_23) {
            return f(_23);
        };
    };
}, function (f) {
    return function (z) {
        return function (_22) {
            return f(z)(_22);
        };
    };
}, function (f) {
    return function (z) {
        return function (_21) {
            return f(_21)(z);
        };
    };
});
var foldableMaybe = new Foldable(function (__dict_Monoid_21) {
    return function (f) {
        return function (_2) {
            if (_2 instanceof Data_Maybe.Nothing) {
                return Data_Monoid.mempty(__dict_Monoid_21);
            };
            if (_2 instanceof Data_Maybe.Just) {
                return f(_2.value0);
            };
            throw new Error("Failed pattern match at Data.Foldable line 103, column 1 - line 111, column 1: " + [ f.constructor.name, _2.constructor.name ]);
        };
    };
}, function (f) {
    return function (z) {
        return function (_1) {
            if (_1 instanceof Data_Maybe.Nothing) {
                return z;
            };
            if (_1 instanceof Data_Maybe.Just) {
                return f(z)(_1.value0);
            };
            throw new Error("Failed pattern match at Data.Foldable line 103, column 1 - line 111, column 1: " + [ f.constructor.name, z.constructor.name, _1.constructor.name ]);
        };
    };
}, function (f) {
    return function (z) {
        return function (_0) {
            if (_0 instanceof Data_Maybe.Nothing) {
                return z;
            };
            if (_0 instanceof Data_Maybe.Just) {
                return f(_0.value0)(z);
            };
            throw new Error("Failed pattern match at Data.Foldable line 103, column 1 - line 111, column 1: " + [ f.constructor.name, z.constructor.name, _0.constructor.name ]);
        };
    };
});
var foldableDual = new Foldable(function (__dict_Monoid_22) {
    return function (f) {
        return function (_14) {
            return f(_14);
        };
    };
}, function (f) {
    return function (z) {
        return function (_13) {
            return f(z)(_13);
        };
    };
}, function (f) {
    return function (z) {
        return function (_12) {
            return f(_12)(z);
        };
    };
});
var foldableDisj = new Foldable(function (__dict_Monoid_23) {
    return function (f) {
        return function (_17) {
            return f(_17);
        };
    };
}, function (f) {
    return function (z) {
        return function (_16) {
            return f(z)(_16);
        };
    };
}, function (f) {
    return function (z) {
        return function (_15) {
            return f(_15)(z);
        };
    };
});
var foldableConj = new Foldable(function (__dict_Monoid_24) {
    return function (f) {
        return function (_20) {
            return f(_20);
        };
    };
}, function (f) {
    return function (z) {
        return function (_19) {
            return f(z)(_19);
        };
    };
}, function (f) {
    return function (z) {
        return function (_18) {
            return f(_18)(z);
        };
    };
});
var foldableAdditive = new Foldable(function (__dict_Monoid_25) {
    return function (f) {
        return function (_11) {
            return f(_11);
        };
    };
}, function (f) {
    return function (z) {
        return function (_10) {
            return f(z)(_10);
        };
    };
}, function (f) {
    return function (z) {
        return function (_9) {
            return f(_9)(z);
        };
    };
});
var foldMapDefaultR = function (__dict_Foldable_26) {
    return function (__dict_Monoid_27) {
        return function (f) {
            return function (xs) {
                return foldr(__dict_Foldable_26)(function (x) {
                    return function (acc) {
                        return Prelude["<>"](__dict_Monoid_27["__superclass_Prelude.Semigroup_0"]())(f(x))(acc);
                    };
                })(Data_Monoid.mempty(__dict_Monoid_27))(xs);
            };
        };
    };
};
var foldableArray = new Foldable(function (__dict_Monoid_28) {
    return foldMapDefaultR(foldableArray)(__dict_Monoid_28);
}, $foreign.foldlArray, $foreign.foldrArray);
var foldMapDefaultL = function (__dict_Foldable_29) {
    return function (__dict_Monoid_30) {
        return function (f) {
            return function (xs) {
                return foldl(__dict_Foldable_29)(function (acc) {
                    return function (x) {
                        return Prelude["<>"](__dict_Monoid_30["__superclass_Prelude.Semigroup_0"]())(f(x))(acc);
                    };
                })(Data_Monoid.mempty(__dict_Monoid_30))(xs);
            };
        };
    };
};
var foldMap = function (dict) {
    return dict.foldMap;
};
var foldableFirst = new Foldable(function (__dict_Monoid_31) {
    return function (f) {
        return function (_5) {
            return foldMap(foldableMaybe)(__dict_Monoid_31)(f)(_5);
        };
    };
}, function (f) {
    return function (z) {
        return function (_4) {
            return foldl(foldableMaybe)(f)(z)(_4);
        };
    };
}, function (f) {
    return function (z) {
        return function (_3) {
            return foldr(foldableMaybe)(f)(z)(_3);
        };
    };
});
var foldableLast = new Foldable(function (__dict_Monoid_32) {
    return function (f) {
        return function (_8) {
            return foldMap(foldableMaybe)(__dict_Monoid_32)(f)(_8);
        };
    };
}, function (f) {
    return function (z) {
        return function (_7) {
            return foldl(foldableMaybe)(f)(z)(_7);
        };
    };
}, function (f) {
    return function (z) {
        return function (_6) {
            return foldr(foldableMaybe)(f)(z)(_6);
        };
    };
});
var foldlDefault = function (__dict_Foldable_33) {
    return function (c) {
        return function (u) {
            return function (xs) {
                return Data_Monoid_Endo.runEndo(Data_Monoid_Dual.runDual(foldMap(__dict_Foldable_33)(Data_Monoid_Dual.monoidDual(Data_Monoid_Endo.monoidEndo))(function (_110) {
                    return Data_Monoid_Dual.Dual(Data_Monoid_Endo.Endo(Prelude.flip(c)(_110)));
                })(xs)))(u);
            };
        };
    };
};
var foldrDefault = function (__dict_Foldable_34) {
    return function (c) {
        return function (u) {
            return function (xs) {
                return Data_Monoid_Endo.runEndo(foldMap(__dict_Foldable_34)(Data_Monoid_Endo.monoidEndo)(function (_111) {
                    return Data_Monoid_Endo.Endo(c(_111));
                })(xs))(u);
            };
        };
    };
};
var fold = function (__dict_Foldable_35) {
    return function (__dict_Monoid_36) {
        return foldMap(__dict_Foldable_35)(__dict_Monoid_36)(Prelude.id(Prelude.categoryFn));
    };
};
var find = function (__dict_Foldable_37) {
    return function (p) {
        return foldl(__dict_Foldable_37)(function (r) {
            return function (x) {
                var _108 = p(x);
                if (_108) {
                    return new Data_Maybe.Just(x);
                };
                if (!_108) {
                    return r;
                };
                throw new Error("Failed pattern match at Data.Foldable line 233, column 1 - line 234, column 1: " + [ _108.constructor.name ]);
            };
        })(Data_Maybe.Nothing.value);
    };
};
var any = function (__dict_Foldable_38) {
    return function (__dict_BooleanAlgebra_39) {
        return function (p) {
            return function (_112) {
                return Data_Monoid_Disj.runDisj(foldMap(__dict_Foldable_38)(Data_Monoid_Disj.monoidDisj(__dict_BooleanAlgebra_39))(function (_113) {
                    return Data_Monoid_Disj.Disj(p(_113));
                })(_112));
            };
        };
    };
};
var elem = function (__dict_Foldable_40) {
    return function (__dict_Eq_41) {
        return function (_114) {
            return any(__dict_Foldable_40)(Prelude.booleanAlgebraBoolean)(Prelude["=="](__dict_Eq_41)(_114));
        };
    };
};
var notElem = function (__dict_Foldable_42) {
    return function (__dict_Eq_43) {
        return function (x) {
            return function (_115) {
                return !elem(__dict_Foldable_42)(__dict_Eq_43)(x)(_115);
            };
        };
    };
};
var or = function (__dict_Foldable_44) {
    return function (__dict_BooleanAlgebra_45) {
        return any(__dict_Foldable_44)(__dict_BooleanAlgebra_45)(Prelude.id(Prelude.categoryFn));
    };
};
var all = function (__dict_Foldable_46) {
    return function (__dict_BooleanAlgebra_47) {
        return function (p) {
            return function (_116) {
                return Data_Monoid_Conj.runConj(foldMap(__dict_Foldable_46)(Data_Monoid_Conj.monoidConj(__dict_BooleanAlgebra_47))(function (_117) {
                    return Data_Monoid_Conj.Conj(p(_117));
                })(_116));
            };
        };
    };
};
var and = function (__dict_Foldable_48) {
    return function (__dict_BooleanAlgebra_49) {
        return all(__dict_Foldable_48)(__dict_BooleanAlgebra_49)(Prelude.id(Prelude.categoryFn));
    };
};
module.exports = {
    Foldable: Foldable, 
    minimumBy: minimumBy, 
    minimum: minimum, 
    maximumBy: maximumBy, 
    maximum: maximum, 
    find: find, 
    notElem: notElem, 
    elem: elem, 
    product: product, 
    sum: sum, 
    all: all, 
    any: any, 
    or: or, 
    and: and, 
    intercalate: intercalate, 
    mconcat: mconcat, 
    sequence_: sequence_, 
    for_: for_, 
    traverse_: traverse_, 
    fold: fold, 
    foldMapDefaultR: foldMapDefaultR, 
    foldMapDefaultL: foldMapDefaultL, 
    foldlDefault: foldlDefault, 
    foldrDefault: foldrDefault, 
    foldMap: foldMap, 
    foldl: foldl, 
    foldr: foldr, 
    foldableArray: foldableArray, 
    foldableMaybe: foldableMaybe, 
    foldableFirst: foldableFirst, 
    foldableLast: foldableLast, 
    foldableAdditive: foldableAdditive, 
    foldableDual: foldableDual, 
    foldableDisj: foldableDisj, 
    foldableConj: foldableConj, 
    foldableMultiplicative: foldableMultiplicative
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Foldable/foreign.js","Control.Apply":"/Users/maximko/Projects/mine/guppi/output/Control.Apply/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Maybe.First":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe.First/index.js","Data.Maybe.Last":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe.Last/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Monoid.Additive":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Additive/index.js","Data.Monoid.Conj":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Conj/index.js","Data.Monoid.Disj":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Disj/index.js","Data.Monoid.Dual":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Dual/index.js","Data.Monoid.Endo":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Endo/index.js","Data.Monoid.Multiplicative":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Multiplicative/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Foreign.Class/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Array = require("Data.Array");
var Data_Either = require("Data.Either");
var Data_Foreign = require("Data.Foreign");
var Data_Foreign_Index = require("Data.Foreign.Index");
var Data_Foreign_Null = require("Data.Foreign.Null");
var Data_Foreign_NullOrUndefined = require("Data.Foreign.NullOrUndefined");
var Data_Foreign_Undefined = require("Data.Foreign.Undefined");
var Data_Int = require("Data.Int");
var Data_Traversable = require("Data.Traversable");
var IsForeign = function (read) {
    this.read = read;
};
var stringIsForeign = new IsForeign(Data_Foreign.readString);
var read = function (dict) {
    return dict.read;
};
var readJSON = function (__dict_IsForeign_0) {
    return function (json) {
        return Prelude[">>="](Data_Either.bindEither)(Data_Foreign.parseJSON(json))(read(__dict_IsForeign_0));
    };
};
var readWith = function (__dict_IsForeign_1) {
    return function (f) {
        return function (value) {
            return Data_Either.either(function (_0) {
                return Data_Either.Left.create(f(_0));
            })(Data_Either.Right.create)(read(__dict_IsForeign_1)(value));
        };
    };
};
var readProp = function (__dict_IsForeign_2) {
    return function (__dict_Index_3) {
        return function (prop) {
            return function (value) {
                return Prelude[">>="](Data_Either.bindEither)(Data_Foreign_Index["!"](__dict_Index_3)(value)(prop))(readWith(__dict_IsForeign_2)(Data_Foreign_Index.errorAt(__dict_Index_3)(prop)));
            };
        };
    };
};
var undefinedIsForeign = function (__dict_IsForeign_4) {
    return new IsForeign(Data_Foreign_Undefined.readUndefined(read(__dict_IsForeign_4)));
};
var numberIsForeign = new IsForeign(Data_Foreign.readNumber);
var nullOrUndefinedIsForeign = function (__dict_IsForeign_5) {
    return new IsForeign(Data_Foreign_NullOrUndefined.readNullOrUndefined(read(__dict_IsForeign_5)));
};
var nullIsForeign = function (__dict_IsForeign_6) {
    return new IsForeign(Data_Foreign_Null.readNull(read(__dict_IsForeign_6)));
};
var intIsForeign = new IsForeign(Data_Foreign.readInt);
var foreignIsForeign = new IsForeign(function (f) {
    return Prelude["return"](Data_Either.applicativeEither)(f);
});
var charIsForeign = new IsForeign(Data_Foreign.readChar);
var booleanIsForeign = new IsForeign(Data_Foreign.readBoolean);
var arrayIsForeign = function (__dict_IsForeign_7) {
    return new IsForeign(function (value) {
        var readElement = function (i) {
            return function (value_1) {
                return readWith(__dict_IsForeign_7)(Data_Foreign.ErrorAtIndex.create(i))(value_1);
            };
        };
        var readElements = function (arr) {
            return Data_Traversable.sequence(Data_Traversable.traversableArray)(Data_Either.applicativeEither)(Data_Array.zipWith(readElement)(Data_Array.range(0)(Data_Array.length(arr)))(arr));
        };
        return Prelude[">>="](Data_Either.bindEither)(Data_Foreign.readArray(value))(readElements);
    });
};
module.exports = {
    IsForeign: IsForeign, 
    readProp: readProp, 
    readWith: readWith, 
    readJSON: readJSON, 
    read: read, 
    foreignIsForeign: foreignIsForeign, 
    stringIsForeign: stringIsForeign, 
    charIsForeign: charIsForeign, 
    booleanIsForeign: booleanIsForeign, 
    numberIsForeign: numberIsForeign, 
    intIsForeign: intIsForeign, 
    arrayIsForeign: arrayIsForeign, 
    nullIsForeign: nullIsForeign, 
    undefinedIsForeign: undefinedIsForeign, 
    nullOrUndefinedIsForeign: nullOrUndefinedIsForeign
};

},{"Data.Array":"/Users/maximko/Projects/mine/guppi/output/Data.Array/index.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Foreign/index.js","Data.Foreign.Index":"/Users/maximko/Projects/mine/guppi/output/Data.Foreign.Index/index.js","Data.Foreign.Null":"/Users/maximko/Projects/mine/guppi/output/Data.Foreign.Null/index.js","Data.Foreign.NullOrUndefined":"/Users/maximko/Projects/mine/guppi/output/Data.Foreign.NullOrUndefined/index.js","Data.Foreign.Undefined":"/Users/maximko/Projects/mine/guppi/output/Data.Foreign.Undefined/index.js","Data.Int":"/Users/maximko/Projects/mine/guppi/output/Data.Int/index.js","Data.Traversable":"/Users/maximko/Projects/mine/guppi/output/Data.Traversable/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Foreign.Index/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Data.Foreign.Index

// jshint maxparams: 4
exports.unsafeReadPropImpl = function (f, s, key, value) {
  return value == null ? f : s(value[key]);
};

// jshint maxparams: 2
exports.unsafeHasOwnProperty = function (prop, value) {
  return Object.prototype.hasOwnProperty.call(value, prop);
};

exports.unsafeHasProperty = function (prop, value) {
  return prop in value;
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Data.Foreign.Index/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Data_Either = require("Data.Either");
var Data_Foreign = require("Data.Foreign");
var Data_Function = require("Data.Function");
var Data_Int = require("Data.Int");
var Index = function (errorAt, hasOwnProperty, hasProperty, ix) {
    this.errorAt = errorAt;
    this.hasOwnProperty = hasOwnProperty;
    this.hasProperty = hasProperty;
    this.ix = ix;
};
var unsafeReadProp = function (k) {
    return function (value) {
        return $foreign.unsafeReadPropImpl(new Data_Either.Left(new Data_Foreign.TypeMismatch("object", Data_Foreign.typeOf(value))), Prelude.pure(Data_Either.applicativeEither), k, value);
    };
};
var prop = unsafeReadProp;
var ix = function (dict) {
    return dict.ix;
};
var $bang = function (__dict_Index_0) {
    return ix(__dict_Index_0);
};
var index = unsafeReadProp;
var hasPropertyImpl = function (p) {
    return function (value) {
        if (Data_Foreign.isNull(value)) {
            return false;
        };
        if (Data_Foreign.isUndefined(value)) {
            return false;
        };
        if (Prelude["=="](Prelude.eqString)(Data_Foreign.typeOf(value))("object") || Prelude["=="](Prelude.eqString)(Data_Foreign.typeOf(value))("function")) {
            return $foreign.unsafeHasProperty(p, value);
        };
        return false;
    };
};
var hasProperty = function (dict) {
    return dict.hasProperty;
};
var hasOwnPropertyImpl = function (p) {
    return function (value) {
        if (Data_Foreign.isNull(value)) {
            return false;
        };
        if (Data_Foreign.isUndefined(value)) {
            return false;
        };
        if (Prelude["=="](Prelude.eqString)(Data_Foreign.typeOf(value))("object") || Prelude["=="](Prelude.eqString)(Data_Foreign.typeOf(value))("function")) {
            return $foreign.unsafeHasOwnProperty(p, value);
        };
        return false;
    };
};
var indexInt = new Index(Data_Foreign.ErrorAtIndex.create, hasOwnPropertyImpl, hasPropertyImpl, Prelude.flip(index));
var indexString = new Index(Data_Foreign.ErrorAtProperty.create, hasOwnPropertyImpl, hasPropertyImpl, Prelude.flip(prop));
var hasOwnProperty = function (dict) {
    return dict.hasOwnProperty;
};
var errorAt = function (dict) {
    return dict.errorAt;
};
module.exports = {
    Index: Index, 
    errorAt: errorAt, 
    hasOwnProperty: hasOwnProperty, 
    hasProperty: hasProperty, 
    "!": $bang, 
    ix: ix, 
    index: index, 
    prop: prop, 
    indexString: indexString, 
    indexInt: indexInt
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Foreign.Index/foreign.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Foreign/index.js","Data.Function":"/Users/maximko/Projects/mine/guppi/output/Data.Function/index.js","Data.Int":"/Users/maximko/Projects/mine/guppi/output/Data.Int/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Foreign.Null/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Maybe = require("Data.Maybe");
var Data_Foreign = require("Data.Foreign");
var Data_Either = require("Data.Either");
var Null = function (x) {
    return x;
};
var runNull = function (_0) {
    return _0;
};
var readNull = function (f) {
    return function (value) {
        if (Data_Foreign.isNull(value)) {
            return Prelude.pure(Data_Either.applicativeEither)(Data_Maybe.Nothing.value);
        };
        return Prelude["<$>"](Data_Either.functorEither)(function (_4) {
            return Null(Data_Maybe.Just.create(_4));
        })(f(value));
    };
};
module.exports = {
    Null: Null, 
    readNull: readNull, 
    runNull: runNull
};

},{"Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Foreign/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Foreign.NullOrUndefined/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Maybe = require("Data.Maybe");
var Data_Foreign = require("Data.Foreign");
var Data_Either = require("Data.Either");
var NullOrUndefined = function (x) {
    return x;
};
var runNullOrUndefined = function (_0) {
    return _0;
};
var readNullOrUndefined = function (f) {
    return function (value) {
        if (Data_Foreign.isNull(value) || Data_Foreign.isUndefined(value)) {
            return Prelude.pure(Data_Either.applicativeEither)(Data_Maybe.Nothing.value);
        };
        return Prelude["<$>"](Data_Either.functorEither)(function (_4) {
            return NullOrUndefined(Data_Maybe.Just.create(_4));
        })(f(value));
    };
};
module.exports = {
    NullOrUndefined: NullOrUndefined, 
    readNullOrUndefined: readNullOrUndefined, 
    runNullOrUndefined: runNullOrUndefined
};

},{"Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Foreign/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Foreign.Undefined/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Maybe = require("Data.Maybe");
var Data_Foreign = require("Data.Foreign");
var Data_Either = require("Data.Either");
var Undefined = function (x) {
    return x;
};
var runUndefined = function (_0) {
    return _0;
};
var readUndefined = function (f) {
    return function (value) {
        if (Data_Foreign.isUndefined(value)) {
            return Prelude.pure(Data_Either.applicativeEither)(Data_Maybe.Nothing.value);
        };
        return Prelude["<$>"](Data_Either.functorEither)(function (_4) {
            return Undefined(Data_Maybe.Just.create(_4));
        })(f(value));
    };
};
module.exports = {
    Undefined: Undefined, 
    readUndefined: readUndefined, 
    runUndefined: runUndefined
};

},{"Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Foreign/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Foreign/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Data.Foreign

// jshint maxparams: 3
exports.parseJSONImpl = function (left, right, str) {
  try {
    return right(JSON.parse(str));
  } catch (e) {
    return left(e.toString());
  }
};

// jshint maxparams: 1
exports.toForeign = function (value) {
  return value;
};

exports.unsafeFromForeign = function (value) {
  return value;
};

exports.typeOf = function (value) {
  return typeof value;
};

exports.tagOf = function (value) {
  return Object.prototype.toString.call(value).slice(8, -1);
};

exports.isNull = function (value) {
  return value === null;
};

exports.isUndefined = function (value) {
  return value === undefined;
};

exports.isArray = Array.isArray || function (value) {
  return Object.prototype.toString.call(value) === "[object Array]";
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Data.Foreign/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Data_Either = require("Data.Either");
var Data_Maybe = require("Data.Maybe");
var Data_Function = require("Data.Function");
var Data_Int = require("Data.Int");
var Data_String = require("Data.String");
var TypeMismatch = (function () {
    function TypeMismatch(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    TypeMismatch.create = function (value0) {
        return function (value1) {
            return new TypeMismatch(value0, value1);
        };
    };
    return TypeMismatch;
})();
var ErrorAtIndex = (function () {
    function ErrorAtIndex(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    ErrorAtIndex.create = function (value0) {
        return function (value1) {
            return new ErrorAtIndex(value0, value1);
        };
    };
    return ErrorAtIndex;
})();
var ErrorAtProperty = (function () {
    function ErrorAtProperty(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    ErrorAtProperty.create = function (value0) {
        return function (value1) {
            return new ErrorAtProperty(value0, value1);
        };
    };
    return ErrorAtProperty;
})();
var JSONError = (function () {
    function JSONError(value0) {
        this.value0 = value0;
    };
    JSONError.create = function (value0) {
        return new JSONError(value0);
    };
    return JSONError;
})();
var unsafeReadTagged = function (tag) {
    return function (value) {
        if (Prelude["=="](Prelude.eqString)($foreign.tagOf(value))(tag)) {
            return Prelude.pure(Data_Either.applicativeEither)($foreign.unsafeFromForeign(value));
        };
        return new Data_Either.Left(new TypeMismatch(tag, $foreign.tagOf(value)));
    };
};
var showForeignError = new Prelude.Show(function (_0) {
    if (_0 instanceof TypeMismatch) {
        return "Type mismatch: expected " + (_0.value0 + (", found " + _0.value1));
    };
    if (_0 instanceof ErrorAtIndex) {
        return "Error at array index " + (Prelude.show(Prelude.showInt)(_0.value0) + (": " + Prelude.show(showForeignError)(_0.value1)));
    };
    if (_0 instanceof ErrorAtProperty) {
        return "Error at property " + (Prelude.show(Prelude.showString)(_0.value0) + (": " + Prelude.show(showForeignError)(_0.value1)));
    };
    if (_0 instanceof JSONError) {
        return "JSON error: " + _0.value0;
    };
    throw new Error("Failed pattern match: " + [ _0.constructor.name ]);
});
var readString = unsafeReadTagged("String");
var readNumber = unsafeReadTagged("Number");
var readInt = function (value) {
    var error = Data_Either.Left.create(new TypeMismatch("Int", $foreign.tagOf(value)));
    var fromNumber = function (_30) {
        return Data_Maybe.maybe(error)(Prelude.pure(Data_Either.applicativeEither))(Data_Int.fromNumber(_30));
    };
    return Data_Either.either(Prelude["const"](error))(fromNumber)(readNumber(value));
};
var readChar = function (value) {
    var error = Data_Either.Left.create(new TypeMismatch("Char", $foreign.tagOf(value)));
    var fromString = function (_31) {
        return Data_Maybe.maybe(error)(Prelude.pure(Data_Either.applicativeEither))(Data_String.toChar(_31));
    };
    return Data_Either.either(Prelude["const"](error))(fromString)(readString(value));
};
var readBoolean = unsafeReadTagged("Boolean");
var readArray = function (value) {
    if ($foreign.isArray(value)) {
        return Prelude.pure(Data_Either.applicativeEither)($foreign.unsafeFromForeign(value));
    };
    return new Data_Either.Left(new TypeMismatch("array", $foreign.tagOf(value)));
};
var parseJSON = function (json) {
    return $foreign.parseJSONImpl(function (_32) {
        return Data_Either.Left.create(JSONError.create(_32));
    }, Data_Either.Right.create, json);
};
var eqForeignError = new Prelude.Eq(function (_1) {
    return function (_2) {
        if (_1 instanceof TypeMismatch && _2 instanceof TypeMismatch) {
            return Prelude["=="](Prelude.eqString)(_1.value0)(_2.value0) && Prelude["=="](Prelude.eqString)(_1.value1)(_2.value1);
        };
        if (_1 instanceof ErrorAtIndex && _2 instanceof ErrorAtIndex) {
            return _1.value0 === _2.value0 && Prelude["=="](eqForeignError)(_1.value1)(_2.value1);
        };
        if (_1 instanceof ErrorAtProperty && _2 instanceof ErrorAtProperty) {
            return Prelude["=="](Prelude.eqString)(_1.value0)(_2.value0) && Prelude["=="](eqForeignError)(_1.value1)(_2.value1);
        };
        if (_1 instanceof JSONError && _2 instanceof JSONError) {
            return Prelude["=="](Prelude.eqString)(_1.value0)(_2.value0);
        };
        return false;
    };
});
module.exports = {
    TypeMismatch: TypeMismatch, 
    ErrorAtIndex: ErrorAtIndex, 
    ErrorAtProperty: ErrorAtProperty, 
    JSONError: JSONError, 
    readArray: readArray, 
    readInt: readInt, 
    readNumber: readNumber, 
    readBoolean: readBoolean, 
    readChar: readChar, 
    readString: readString, 
    unsafeReadTagged: unsafeReadTagged, 
    parseJSON: parseJSON, 
    showForeignError: showForeignError, 
    eqForeignError: eqForeignError, 
    isArray: $foreign.isArray, 
    isUndefined: $foreign.isUndefined, 
    isNull: $foreign.isNull, 
    tagOf: $foreign.tagOf, 
    typeOf: $foreign.typeOf, 
    unsafeFromForeign: $foreign.unsafeFromForeign, 
    toForeign: $foreign.toForeign
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Foreign/foreign.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Function":"/Users/maximko/Projects/mine/guppi/output/Data.Function/index.js","Data.Int":"/Users/maximko/Projects/mine/guppi/output/Data.Int/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.String":"/Users/maximko/Projects/mine/guppi/output/Data.String/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Function/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Data.Function

exports.mkFn0 = function (fn) {
  return function () {
    return fn({});
  };
};

exports.mkFn1 = function (fn) {
  return function (a) {
    return fn(a);
  };
};

exports.mkFn2 = function (fn) {
  /* jshint maxparams: 2 */
  return function (a, b) {
    return fn(a)(b);
  };
};

exports.mkFn3 = function (fn) {
  /* jshint maxparams: 3 */
  return function (a, b, c) {
    return fn(a)(b)(c);
  };
};

exports.mkFn4 = function (fn) {
  /* jshint maxparams: 4 */
  return function (a, b, c, d) {
    return fn(a)(b)(c)(d);
  };
};

exports.mkFn5 = function (fn) {
  /* jshint maxparams: 5 */
  return function (a, b, c, d, e) {
    return fn(a)(b)(c)(d)(e);
  };
};

exports.mkFn6 = function (fn) {
  /* jshint maxparams: 6 */
  return function (a, b, c, d, e, f) {
    return fn(a)(b)(c)(d)(e)(f);
  };
};

exports.mkFn7 = function (fn) {
  /* jshint maxparams: 7 */
  return function (a, b, c, d, e, f, g) {
    return fn(a)(b)(c)(d)(e)(f)(g);
  };
};

exports.mkFn8 = function (fn) {
  /* jshint maxparams: 8 */
  return function (a, b, c, d, e, f, g, h) {
    return fn(a)(b)(c)(d)(e)(f)(g)(h);
  };
};

exports.mkFn9 = function (fn) {
  /* jshint maxparams: 9 */
  return function (a, b, c, d, e, f, g, h, i) {
    return fn(a)(b)(c)(d)(e)(f)(g)(h)(i);
  };
};

exports.mkFn10 = function (fn) {
  /* jshint maxparams: 10 */
  return function (a, b, c, d, e, f, g, h, i, j) {
    return fn(a)(b)(c)(d)(e)(f)(g)(h)(i)(j);
  };
};

exports.runFn0 = function (fn) {
  return fn();
};

exports.runFn1 = function (fn) {
  return function (a) {
    return fn(a);
  };
};

exports.runFn2 = function (fn) {
  return function (a) {
    return function (b) {
      return fn(a, b);
    };
  };
};

exports.runFn3 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return fn(a, b, c);
      };
    };
  };
};

exports.runFn4 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return fn(a, b, c, d);
        };
      };
    };
  };
};

exports.runFn5 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return function (e) {
            return fn(a, b, c, d, e);
          };
        };
      };
    };
  };
};

exports.runFn6 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return function (e) {
            return function (f) {
              return fn(a, b, c, d, e, f);
            };
          };
        };
      };
    };
  };
};

exports.runFn7 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return function (e) {
            return function (f) {
              return function (g) {
                return fn(a, b, c, d, e, f, g);
              };
            };
          };
        };
      };
    };
  };
};

exports.runFn8 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return function (e) {
            return function (f) {
              return function (g) {
                return function (h) {
                  return fn(a, b, c, d, e, f, g, h);
                };
              };
            };
          };
        };
      };
    };
  };
};

exports.runFn9 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return function (e) {
            return function (f) {
              return function (g) {
                return function (h) {
                  return function (i) {
                    return fn(a, b, c, d, e, f, g, h, i);
                  };
                };
              };
            };
          };
        };
      };
    };
  };
};

exports.runFn10 = function (fn) {
  return function (a) {
    return function (b) {
      return function (c) {
        return function (d) {
          return function (e) {
            return function (f) {
              return function (g) {
                return function (h) {
                  return function (i) {
                    return function (j) {
                      return fn(a, b, c, d, e, f, g, h, i, j);
                    };
                  };
                };
              };
            };
          };
        };
      };
    };
  };
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Data.Function/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var on = function (f) {
    return function (g) {
        return function (x) {
            return function (y) {
                return f(g(x))(g(y));
            };
        };
    };
};
module.exports = {
    on: on, 
    runFn10: $foreign.runFn10, 
    runFn9: $foreign.runFn9, 
    runFn8: $foreign.runFn8, 
    runFn7: $foreign.runFn7, 
    runFn6: $foreign.runFn6, 
    runFn5: $foreign.runFn5, 
    runFn4: $foreign.runFn4, 
    runFn3: $foreign.runFn3, 
    runFn2: $foreign.runFn2, 
    runFn1: $foreign.runFn1, 
    runFn0: $foreign.runFn0, 
    mkFn10: $foreign.mkFn10, 
    mkFn9: $foreign.mkFn9, 
    mkFn8: $foreign.mkFn8, 
    mkFn7: $foreign.mkFn7, 
    mkFn6: $foreign.mkFn6, 
    mkFn5: $foreign.mkFn5, 
    mkFn4: $foreign.mkFn4, 
    mkFn3: $foreign.mkFn3, 
    mkFn2: $foreign.mkFn2, 
    mkFn1: $foreign.mkFn1, 
    mkFn0: $foreign.mkFn0
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Function/foreign.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Aff/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Monad_Aff = require("Control.Monad.Aff");
var Control_Monad_Cont_Trans = require("Control.Monad.Cont.Trans");
var Control_Monad_Except_Trans = require("Control.Monad.Except.Trans");
var Control_Monad_Free = require("Control.Monad.Free");
var Control_Monad_List_Trans = require("Control.Monad.List.Trans");
var Control_Monad_Maybe_Trans = require("Control.Monad.Maybe.Trans");
var Control_Monad_Reader_Trans = require("Control.Monad.Reader.Trans");
var Control_Monad_RWS_Trans = require("Control.Monad.RWS.Trans");
var Control_Monad_State_Trans = require("Control.Monad.State.Trans");
var Control_Monad_Trans = require("Control.Monad.Trans");
var Control_Monad_Writer_Trans = require("Control.Monad.Writer.Trans");
var Data_Monoid = require("Data.Monoid");
var FunctorAff = function (__superclass_Prelude$dotFunctor_0, liftAff) {
    this["__superclass_Prelude.Functor_0"] = __superclass_Prelude$dotFunctor_0;
    this.liftAff = liftAff;
};
var liftAff = function (dict) {
    return dict.liftAff;
};
var monadAffContT = function (__dict_Monad_0) {
    return function (__dict_FunctorAff_1) {
        return new FunctorAff(function () {
            return Control_Monad_Cont_Trans.functorContT(__dict_Monad_0);
        }, function (_0) {
            return Control_Monad_Trans.lift(Control_Monad_Cont_Trans.monadTransContT)(__dict_Monad_0)(liftAff(__dict_FunctorAff_1)(_0));
        });
    };
};
var monadAffExceptT = function (__dict_Monad_2) {
    return function (__dict_FunctorAff_3) {
        return new FunctorAff(function () {
            return Control_Monad_Except_Trans.functorExceptT(__dict_FunctorAff_3["__superclass_Prelude.Functor_0"]());
        }, function (_1) {
            return Control_Monad_Trans.lift(Control_Monad_Except_Trans.monadTransExceptT)(__dict_Monad_2)(liftAff(__dict_FunctorAff_3)(_1));
        });
    };
};
var monadAffListT = function (__dict_Monad_4) {
    return function (__dict_FunctorAff_5) {
        return new FunctorAff(function () {
            return Control_Monad_List_Trans.functorListT(__dict_FunctorAff_5["__superclass_Prelude.Functor_0"]());
        }, function (_2) {
            return Control_Monad_Trans.lift(Control_Monad_List_Trans.monadTransListT)(__dict_Monad_4)(liftAff(__dict_FunctorAff_5)(_2));
        });
    };
};
var monadAffMaybe = function (__dict_Monad_6) {
    return function (__dict_FunctorAff_7) {
        return new FunctorAff(function () {
            return Control_Monad_Maybe_Trans.functorMaybeT(__dict_Monad_6);
        }, function (_3) {
            return Control_Monad_Trans.lift(Control_Monad_Maybe_Trans.monadTransMaybeT)(__dict_Monad_6)(liftAff(__dict_FunctorAff_7)(_3));
        });
    };
};
var monadAffRWS = function (__dict_Monad_8) {
    return function (__dict_Monoid_9) {
        return function (__dict_FunctorAff_10) {
            return new FunctorAff(function () {
                return Control_Monad_RWS_Trans.functorRWST(__dict_FunctorAff_10["__superclass_Prelude.Functor_0"]())(__dict_Monoid_9);
            }, function (_4) {
                return Control_Monad_Trans.lift(Control_Monad_RWS_Trans.monadTransRWST(__dict_Monoid_9))(__dict_Monad_8)(liftAff(__dict_FunctorAff_10)(_4));
            });
        };
    };
};
var monadAffReader = function (__dict_Monad_11) {
    return function (__dict_FunctorAff_12) {
        return new FunctorAff(function () {
            return Control_Monad_Reader_Trans.functorReaderT(__dict_FunctorAff_12["__superclass_Prelude.Functor_0"]());
        }, function (_5) {
            return Control_Monad_Trans.lift(Control_Monad_Reader_Trans.monadTransReaderT)(__dict_Monad_11)(liftAff(__dict_FunctorAff_12)(_5));
        });
    };
};
var monadAffState = function (__dict_Monad_13) {
    return function (__dict_FunctorAff_14) {
        return new FunctorAff(function () {
            return Control_Monad_State_Trans.functorStateT(__dict_Monad_13);
        }, function (_6) {
            return Control_Monad_Trans.lift(Control_Monad_State_Trans.monadTransStateT)(__dict_Monad_13)(liftAff(__dict_FunctorAff_14)(_6));
        });
    };
};
var monadAffWriter = function (__dict_Monad_15) {
    return function (__dict_Monoid_16) {
        return function (__dict_FunctorAff_17) {
            return new FunctorAff(function () {
                return Control_Monad_Writer_Trans.functorWriterT(__dict_FunctorAff_17["__superclass_Prelude.Functor_0"]());
            }, function (_7) {
                return Control_Monad_Trans.lift(Control_Monad_Writer_Trans.monadTransWriterT(__dict_Monoid_16))(__dict_Monad_15)(liftAff(__dict_FunctorAff_17)(_7));
            });
        };
    };
};
var functorAffFree = function (__dict_FunctorAff_18) {
    return new FunctorAff(function () {
        return Control_Monad_Free.freeFunctor;
    }, function (_8) {
        return Control_Monad_Free.liftF(liftAff(__dict_FunctorAff_18)(_8));
    });
};
var functorAffAff = new FunctorAff(function () {
    return Control_Monad_Aff.functorAff;
}, Prelude.id(Prelude.categoryFn));
module.exports = {
    FunctorAff: FunctorAff, 
    liftAff: liftAff, 
    functorAffAff: functorAffAff, 
    functorAffFree: functorAffFree, 
    monadAffContT: monadAffContT, 
    monadAffExceptT: monadAffExceptT, 
    monadAffListT: monadAffListT, 
    monadAffMaybe: monadAffMaybe, 
    monadAffReader: monadAffReader, 
    monadAffRWS: monadAffRWS, 
    monadAffState: monadAffState, 
    monadAffWriter: monadAffWriter
};

},{"Control.Monad.Aff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff/index.js","Control.Monad.Cont.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Cont.Trans/index.js","Control.Monad.Except.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Except.Trans/index.js","Control.Monad.Free":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Free/index.js","Control.Monad.List.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.List.Trans/index.js","Control.Monad.Maybe.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Maybe.Trans/index.js","Control.Monad.RWS.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.RWS.Trans/index.js","Control.Monad.Reader.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Reader.Trans/index.js","Control.Monad.State.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State.Trans/index.js","Control.Monad.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Trans/index.js","Control.Monad.Writer.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Writer.Trans/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Contravariant/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Contravariant = function (cmap) {
    this.cmap = cmap;
};
var cmap = function (dict) {
    return dict.cmap;
};
var $greater$dollar$less = function (__dict_Contravariant_0) {
    return cmap(__dict_Contravariant_0);
};
var $greater$hash$less = function (__dict_Contravariant_1) {
    return function (x) {
        return function (f) {
            return $greater$dollar$less(__dict_Contravariant_1)(f)(x);
        };
    };
};
module.exports = {
    Contravariant: Contravariant, 
    ">#<": $greater$hash$less, 
    ">$<": $greater$dollar$less, 
    cmap: cmap
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Coproduct/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Either = require("Data.Either");
var Data_Foldable = require("Data.Foldable");
var Data_Traversable = require("Data.Traversable");
var Coproduct = function (x) {
    return x;
};
var runCoproduct = function (_0) {
    return _0;
};
var right = function (_2) {
    return Coproduct(Data_Either.Right.create(_2));
};
var left = function (_3) {
    return Coproduct(Data_Either.Left.create(_3));
};
var coproduct = function (f) {
    return function (g) {
        return function (_4) {
            return Data_Either.either(f)(g)(runCoproduct(_4));
        };
    };
};
var foldableCoproduct = function (__dict_Foldable_0) {
    return function (__dict_Foldable_1) {
        return new Data_Foldable.Foldable(function (__dict_Monoid_2) {
            return function (f) {
                return coproduct(Data_Foldable.foldMap(__dict_Foldable_0)(__dict_Monoid_2)(f))(Data_Foldable.foldMap(__dict_Foldable_1)(__dict_Monoid_2)(f));
            };
        }, function (f) {
            return function (z) {
                return coproduct(Data_Foldable.foldl(__dict_Foldable_0)(f)(z))(Data_Foldable.foldl(__dict_Foldable_1)(f)(z));
            };
        }, function (f) {
            return function (z) {
                return coproduct(Data_Foldable.foldr(__dict_Foldable_0)(f)(z))(Data_Foldable.foldr(__dict_Foldable_1)(f)(z));
            };
        });
    };
};
var functorCoproduct = function (__dict_Functor_3) {
    return function (__dict_Functor_4) {
        return new Prelude.Functor(function (f) {
            return function (_5) {
                return Coproduct(coproduct(function (_6) {
                    return Data_Either.Left.create(Prelude["<$>"](__dict_Functor_3)(f)(_6));
                })(function (_7) {
                    return Data_Either.Right.create(Prelude["<$>"](__dict_Functor_4)(f)(_7));
                })(_5));
            };
        });
    };
};
var traversableCoproduct = function (__dict_Traversable_5) {
    return function (__dict_Traversable_6) {
        return new Data_Traversable.Traversable(function () {
            return foldableCoproduct(__dict_Traversable_5["__superclass_Data.Foldable.Foldable_1"]())(__dict_Traversable_6["__superclass_Data.Foldable.Foldable_1"]());
        }, function () {
            return functorCoproduct(__dict_Traversable_5["__superclass_Prelude.Functor_0"]())(__dict_Traversable_6["__superclass_Prelude.Functor_0"]());
        }, function (__dict_Applicative_8) {
            return coproduct(function (_8) {
                return Prelude["<$>"]((__dict_Applicative_8["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(function (_9) {
                    return Coproduct(Data_Either.Left.create(_9));
                })(Data_Traversable.sequence(__dict_Traversable_5)(__dict_Applicative_8)(_8));
            })(function (_10) {
                return Prelude["<$>"]((__dict_Applicative_8["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(function (_11) {
                    return Coproduct(Data_Either.Right.create(_11));
                })(Data_Traversable.sequence(__dict_Traversable_6)(__dict_Applicative_8)(_10));
            });
        }, function (__dict_Applicative_7) {
            return function (f) {
                return coproduct(function (_12) {
                    return Prelude["<$>"]((__dict_Applicative_7["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(function (_13) {
                        return Coproduct(Data_Either.Left.create(_13));
                    })(Data_Traversable.traverse(__dict_Traversable_5)(__dict_Applicative_7)(f)(_12));
                })(function (_14) {
                    return Prelude["<$>"]((__dict_Applicative_7["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(function (_15) {
                        return Coproduct(Data_Either.Right.create(_15));
                    })(Data_Traversable.traverse(__dict_Traversable_6)(__dict_Applicative_7)(f)(_14));
                });
            };
        });
    };
};
module.exports = {
    Coproduct: Coproduct, 
    coproduct: coproduct, 
    right: right, 
    left: left, 
    runCoproduct: runCoproduct, 
    functorCoproduct: functorCoproduct, 
    foldableCoproduct: foldableCoproduct, 
    traversableCoproduct: traversableCoproduct
};

},{"Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Foldable":"/Users/maximko/Projects/mine/guppi/output/Data.Foldable/index.js","Data.Traversable":"/Users/maximko/Projects/mine/guppi/output/Data.Traversable/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Eff/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Monad_Aff = require("Control.Monad.Aff");
var Control_Monad_Cont_Trans = require("Control.Monad.Cont.Trans");
var Control_Monad_Eff = require("Control.Monad.Eff");
var Control_Monad_Eff_Class = require("Control.Monad.Eff.Class");
var Control_Monad_Except_Trans = require("Control.Monad.Except.Trans");
var Control_Monad_Free = require("Control.Monad.Free");
var Control_Monad_List_Trans = require("Control.Monad.List.Trans");
var Control_Monad_Maybe_Trans = require("Control.Monad.Maybe.Trans");
var Control_Monad_Reader_Trans = require("Control.Monad.Reader.Trans");
var Control_Monad_RWS_Trans = require("Control.Monad.RWS.Trans");
var Control_Monad_State_Trans = require("Control.Monad.State.Trans");
var Control_Monad_Trans = require("Control.Monad.Trans");
var Control_Monad_Writer_Trans = require("Control.Monad.Writer.Trans");
var Data_Monoid = require("Data.Monoid");
var FunctorEff = function (__superclass_Prelude$dotFunctor_0, liftEff) {
    this["__superclass_Prelude.Functor_0"] = __superclass_Prelude$dotFunctor_0;
    this.liftEff = liftEff;
};
var liftEff = function (dict) {
    return dict.liftEff;
};
var monadAffContT = function (__dict_Monad_0) {
    return function (__dict_FunctorEff_1) {
        return new FunctorEff(function () {
            return Control_Monad_Cont_Trans.functorContT(__dict_Monad_0);
        }, function (_0) {
            return Control_Monad_Trans.lift(Control_Monad_Cont_Trans.monadTransContT)(__dict_Monad_0)(liftEff(__dict_FunctorEff_1)(_0));
        });
    };
};
var monadAffExceptT = function (__dict_Monad_2) {
    return function (__dict_FunctorEff_3) {
        return new FunctorEff(function () {
            return Control_Monad_Except_Trans.functorExceptT(__dict_FunctorEff_3["__superclass_Prelude.Functor_0"]());
        }, function (_1) {
            return Control_Monad_Trans.lift(Control_Monad_Except_Trans.monadTransExceptT)(__dict_Monad_2)(liftEff(__dict_FunctorEff_3)(_1));
        });
    };
};
var monadAffListT = function (__dict_Monad_4) {
    return function (__dict_FunctorEff_5) {
        return new FunctorEff(function () {
            return Control_Monad_List_Trans.functorListT(__dict_FunctorEff_5["__superclass_Prelude.Functor_0"]());
        }, function (_2) {
            return Control_Monad_Trans.lift(Control_Monad_List_Trans.monadTransListT)(__dict_Monad_4)(liftEff(__dict_FunctorEff_5)(_2));
        });
    };
};
var monadAffMaybe = function (__dict_Monad_6) {
    return function (__dict_FunctorEff_7) {
        return new FunctorEff(function () {
            return Control_Monad_Maybe_Trans.functorMaybeT(__dict_Monad_6);
        }, function (_3) {
            return Control_Monad_Trans.lift(Control_Monad_Maybe_Trans.monadTransMaybeT)(__dict_Monad_6)(liftEff(__dict_FunctorEff_7)(_3));
        });
    };
};
var monadAffRWS = function (__dict_Monad_8) {
    return function (__dict_Monoid_9) {
        return function (__dict_FunctorEff_10) {
            return new FunctorEff(function () {
                return Control_Monad_RWS_Trans.functorRWST(__dict_FunctorEff_10["__superclass_Prelude.Functor_0"]())(__dict_Monoid_9);
            }, function (_4) {
                return Control_Monad_Trans.lift(Control_Monad_RWS_Trans.monadTransRWST(__dict_Monoid_9))(__dict_Monad_8)(liftEff(__dict_FunctorEff_10)(_4));
            });
        };
    };
};
var monadAffReader = function (__dict_Monad_11) {
    return function (__dict_FunctorEff_12) {
        return new FunctorEff(function () {
            return Control_Monad_Reader_Trans.functorReaderT(__dict_FunctorEff_12["__superclass_Prelude.Functor_0"]());
        }, function (_5) {
            return Control_Monad_Trans.lift(Control_Monad_Reader_Trans.monadTransReaderT)(__dict_Monad_11)(liftEff(__dict_FunctorEff_12)(_5));
        });
    };
};
var monadAffState = function (__dict_Monad_13) {
    return function (__dict_FunctorEff_14) {
        return new FunctorEff(function () {
            return Control_Monad_State_Trans.functorStateT(__dict_Monad_13);
        }, function (_6) {
            return Control_Monad_Trans.lift(Control_Monad_State_Trans.monadTransStateT)(__dict_Monad_13)(liftEff(__dict_FunctorEff_14)(_6));
        });
    };
};
var monadAffWriter = function (__dict_Monad_15) {
    return function (__dict_Monoid_16) {
        return function (__dict_FunctorEff_17) {
            return new FunctorEff(function () {
                return Control_Monad_Writer_Trans.functorWriterT(__dict_FunctorEff_17["__superclass_Prelude.Functor_0"]());
            }, function (_7) {
                return Control_Monad_Trans.lift(Control_Monad_Writer_Trans.monadTransWriterT(__dict_Monoid_16))(__dict_Monad_15)(liftEff(__dict_FunctorEff_17)(_7));
            });
        };
    };
};
var functorEffFree = function (__dict_FunctorEff_18) {
    return new FunctorEff(function () {
        return Control_Monad_Free.freeFunctor;
    }, function (_8) {
        return Control_Monad_Free.liftF(liftEff(__dict_FunctorEff_18)(_8));
    });
};
var functorEffEff = new FunctorEff(function () {
    return Control_Monad_Eff.functorEff;
}, Prelude.id(Prelude.categoryFn));
var functorEffAff = new FunctorEff(function () {
    return Control_Monad_Aff.functorAff;
}, Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff));
module.exports = {
    FunctorEff: FunctorEff, 
    liftEff: liftEff, 
    functorEffEff: functorEffEff, 
    functorEffAff: functorEffAff, 
    functorEffFree: functorEffFree, 
    monadAffContT: monadAffContT, 
    monadAffExceptT: monadAffExceptT, 
    monadAffListT: monadAffListT, 
    monadAffMaybe: monadAffMaybe, 
    monadAffReader: monadAffReader, 
    monadAffRWS: monadAffRWS, 
    monadAffState: monadAffState, 
    monadAffWriter: monadAffWriter
};

},{"Control.Monad.Aff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff/index.js","Control.Monad.Cont.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Cont.Trans/index.js","Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","Control.Monad.Eff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Class/index.js","Control.Monad.Except.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Except.Trans/index.js","Control.Monad.Free":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Free/index.js","Control.Monad.List.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.List.Trans/index.js","Control.Monad.Maybe.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Maybe.Trans/index.js","Control.Monad.RWS.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.RWS.Trans/index.js","Control.Monad.Reader.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Reader.Trans/index.js","Control.Monad.State.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State.Trans/index.js","Control.Monad.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Trans/index.js","Control.Monad.Writer.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Writer.Trans/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Invariant/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Invariant = function (imap) {
    this.imap = imap;
};
var imapF = function (__dict_Functor_0) {
    return function (_0) {
        return Prelude["const"](Prelude.map(__dict_Functor_0)(_0));
    };
};
var invariantArray = new Invariant(imapF(Prelude.functorArray));
var invariantFn = new Invariant(imapF(Prelude.functorFn));
var imap = function (dict) {
    return dict.imap;
};
module.exports = {
    Invariant: Invariant, 
    imapF: imapF, 
    imap: imap, 
    invariantFn: invariantFn, 
    invariantArray: invariantArray
};

},{"Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Functor/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var $less$dollar = function (__dict_Functor_0) {
    return function (x) {
        return function (f) {
            return Prelude["<$>"](__dict_Functor_0)(Prelude["const"](x))(f);
        };
    };
};
var $dollar$greater = function (__dict_Functor_1) {
    return function (f) {
        return function (x) {
            return Prelude["<$>"](__dict_Functor_1)(Prelude["const"](x))(f);
        };
    };
};
module.exports = {
    "$>": $dollar$greater, 
    "<$": $less$dollar
};

},{"Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Identity/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Comonad = require("Control.Comonad");
var Control_Extend = require("Control.Extend");
var Data_Foldable = require("Data.Foldable");
var Data_Functor_Invariant = require("Data.Functor.Invariant");
var Data_Monoid = require("Data.Monoid");
var Data_Traversable = require("Data.Traversable");
var Identity = function (x) {
    return x;
};
var showIdentity = function (__dict_Show_2) {
    return new Prelude.Show(function (_22) {
        return "Identity (" + (Prelude.show(__dict_Show_2)(_22) + ")");
    });
};
var semiringIdentity = function (__dict_Semiring_3) {
    return new Prelude.Semiring(function (_12) {
        return function (_13) {
            return Prelude["+"](__dict_Semiring_3)(_12)(_13);
        };
    }, function (_14) {
        return function (_15) {
            return Prelude["*"](__dict_Semiring_3)(_14)(_15);
        };
    }, Prelude.one(__dict_Semiring_3), Prelude.zero(__dict_Semiring_3));
};
var semigroupIdenity = function (__dict_Semigroup_4) {
    return new Prelude.Semigroup(function (_10) {
        return function (_11) {
            return Prelude["<>"](__dict_Semigroup_4)(_10)(_11);
        };
    });
};
var runIdentity = function (_0) {
    return _0;
};
var ringIdentity = function (__dict_Ring_5) {
    return new Prelude.Ring(function () {
        return semiringIdentity(__dict_Ring_5["__superclass_Prelude.Semiring_0"]());
    }, function (_20) {
        return function (_21) {
            return Prelude["-"](__dict_Ring_5)(_20)(_21);
        };
    });
};
var monoidIdentity = function (__dict_Monoid_8) {
    return new Data_Monoid.Monoid(function () {
        return semigroupIdenity(__dict_Monoid_8["__superclass_Prelude.Semigroup_0"]());
    }, Data_Monoid.mempty(__dict_Monoid_8));
};
var moduloSemiringIdentity = function (__dict_ModuloSemiring_9) {
    return new Prelude.ModuloSemiring(function () {
        return semiringIdentity(__dict_ModuloSemiring_9["__superclass_Prelude.Semiring_0"]());
    }, function (_18) {
        return function (_19) {
            return Prelude["/"](__dict_ModuloSemiring_9)(_18)(_19);
        };
    }, function (_16) {
        return function (_17) {
            return Prelude.mod(__dict_ModuloSemiring_9)(_16)(_17);
        };
    });
};
var functorIdentity = new Prelude.Functor(function (f) {
    return function (_23) {
        return f(_23);
    };
});
var invariantIdentity = new Data_Functor_Invariant.Invariant(Data_Functor_Invariant.imapF(functorIdentity));
var foldableIdentity = new Data_Foldable.Foldable(function (__dict_Monoid_10) {
    return function (f) {
        return function (_30) {
            return f(_30);
        };
    };
}, function (f) {
    return function (z) {
        return function (_29) {
            return f(z)(_29);
        };
    };
}, function (f) {
    return function (z) {
        return function (_28) {
            return f(_28)(z);
        };
    };
});
var traversableIdentity = new Data_Traversable.Traversable(function () {
    return foldableIdentity;
}, function () {
    return functorIdentity;
}, function (__dict_Applicative_1) {
    return function (_32) {
        return Prelude["<$>"]((__dict_Applicative_1["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Identity)(_32);
    };
}, function (__dict_Applicative_0) {
    return function (f) {
        return function (_31) {
            return Prelude["<$>"]((__dict_Applicative_0["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Identity)(f(_31));
        };
    };
});
var extendIdentity = new Control_Extend.Extend(function () {
    return functorIdentity;
}, function (f) {
    return function (m) {
        return f(m);
    };
});
var eqIdentity = function (__dict_Eq_11) {
    return new Prelude.Eq(function (_1) {
        return function (_2) {
            return Prelude["=="](__dict_Eq_11)(_1)(_2);
        };
    });
};
var ordIdentity = function (__dict_Ord_6) {
    return new Prelude.Ord(function () {
        return eqIdentity(__dict_Ord_6["__superclass_Prelude.Eq_0"]());
    }, function (_3) {
        return function (_4) {
            return Prelude.compare(__dict_Ord_6)(_3)(_4);
        };
    });
};
var divisionRingIdentity = function (__dict_DivisionRing_12) {
    return new Prelude.DivisionRing(function () {
        return moduloSemiringIdentity(__dict_DivisionRing_12["__superclass_Prelude.ModuloSemiring_1"]());
    }, function () {
        return ringIdentity(__dict_DivisionRing_12["__superclass_Prelude.Ring_0"]());
    });
};
var numIdentity = function (__dict_Num_7) {
    return new Prelude.Num(function () {
        return divisionRingIdentity(__dict_Num_7["__superclass_Prelude.DivisionRing_0"]());
    });
};
var comonadIdentity = new Control_Comonad.Comonad(function () {
    return extendIdentity;
}, function (_27) {
    return _27;
});
var boundedIdentity = function (__dict_Bounded_14) {
    return new Prelude.Bounded(Prelude.bottom(__dict_Bounded_14), Prelude.top(__dict_Bounded_14));
};
var boundedOrdIdentity = function (__dict_BoundedOrd_13) {
    return new Prelude.BoundedOrd(function () {
        return boundedIdentity(__dict_BoundedOrd_13["__superclass_Prelude.Bounded_0"]());
    }, function () {
        return ordIdentity(__dict_BoundedOrd_13["__superclass_Prelude.Ord_1"]());
    });
};
var booleanAlgebraIdentity = function (__dict_BooleanAlgebra_15) {
    return new Prelude.BooleanAlgebra(function () {
        return boundedIdentity(__dict_BooleanAlgebra_15["__superclass_Prelude.Bounded_0"]());
    }, function (_5) {
        return function (_6) {
            return Prelude.conj(__dict_BooleanAlgebra_15)(_5)(_6);
        };
    }, function (_7) {
        return function (_8) {
            return Prelude.disj(__dict_BooleanAlgebra_15)(_7)(_8);
        };
    }, function (_9) {
        return Prelude.not(__dict_BooleanAlgebra_15)(_9);
    });
};
var applyIdentity = new Prelude.Apply(function () {
    return functorIdentity;
}, function (_24) {
    return function (_25) {
        return _24(_25);
    };
});
var bindIdentity = new Prelude.Bind(function () {
    return applyIdentity;
}, function (_26) {
    return function (f) {
        return f(_26);
    };
});
var applicativeIdentity = new Prelude.Applicative(function () {
    return applyIdentity;
}, Identity);
var monadIdentity = new Prelude.Monad(function () {
    return applicativeIdentity;
}, function () {
    return bindIdentity;
});
module.exports = {
    Identity: Identity, 
    runIdentity: runIdentity, 
    eqIdentity: eqIdentity, 
    ordIdentity: ordIdentity, 
    boundedIdentity: boundedIdentity, 
    boundedOrdIdentity: boundedOrdIdentity, 
    booleanAlgebraIdentity: booleanAlgebraIdentity, 
    semigroupIdenity: semigroupIdenity, 
    monoidIdentity: monoidIdentity, 
    semiringIdentity: semiringIdentity, 
    moduloSemiringIdentity: moduloSemiringIdentity, 
    ringIdentity: ringIdentity, 
    divisionRingIdentity: divisionRingIdentity, 
    numIdentity: numIdentity, 
    showIdentity: showIdentity, 
    functorIdentity: functorIdentity, 
    invariantIdentity: invariantIdentity, 
    applyIdentity: applyIdentity, 
    applicativeIdentity: applicativeIdentity, 
    bindIdentity: bindIdentity, 
    monadIdentity: monadIdentity, 
    extendIdentity: extendIdentity, 
    comonadIdentity: comonadIdentity, 
    foldableIdentity: foldableIdentity, 
    traversableIdentity: traversableIdentity
};

},{"Control.Comonad":"/Users/maximko/Projects/mine/guppi/output/Control.Comonad/index.js","Control.Extend":"/Users/maximko/Projects/mine/guppi/output/Control.Extend/index.js","Data.Foldable":"/Users/maximko/Projects/mine/guppi/output/Data.Foldable/index.js","Data.Functor.Invariant":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Invariant/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Traversable":"/Users/maximko/Projects/mine/guppi/output/Data.Traversable/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Inject/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Either = require("Data.Either");
var Data_Functor_Coproduct = require("Data.Functor.Coproduct");
var Data_Maybe = require("Data.Maybe");
var Inject = function (inj, prj) {
    this.inj = inj;
    this.prj = prj;
};
var prj = function (dict) {
    return dict.prj;
};
var injectReflexive = new Inject(Prelude.id(Prelude.categoryFn), Data_Maybe.Just.create);
var injectLeft = new Inject(function (_0) {
    return Data_Functor_Coproduct.Coproduct(Data_Either.Left.create(_0));
}, Data_Functor_Coproduct.coproduct(Data_Maybe.Just.create)(Prelude["const"](Data_Maybe.Nothing.value)));
var inj = function (dict) {
    return dict.inj;
};
var injectRight = function (__dict_Inject_0) {
    return new Inject(function (_1) {
        return Data_Functor_Coproduct.Coproduct(Data_Either.Right.create(inj(__dict_Inject_0)(_1)));
    }, Data_Functor_Coproduct.coproduct(Prelude["const"](Data_Maybe.Nothing.value))(prj(__dict_Inject_0)));
};
module.exports = {
    Inject: Inject, 
    prj: prj, 
    inj: inj, 
    injectReflexive: injectReflexive, 
    injectLeft: injectLeft, 
    injectRight: injectRight
};

},{"Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Functor.Coproduct":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Coproduct/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Injector/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Const = require("Data.Const");
var Data_Either = require("Data.Either");
var Data_Functor_Coproduct = require("Data.Functor.Coproduct");
var Data_Identity = require("Data.Identity");
var Data_Maybe = require("Data.Maybe");
var Data_Maybe_First = require("Data.Maybe.First");
var Data_Profunctor = require("Data.Profunctor");
var Data_Profunctor_Choice = require("Data.Profunctor.Choice");
var Tagged = function (x) {
    return x;
};
var unTagged = function (_0) {
    return _0;
};
var profunctorTagged = new Data_Profunctor.Profunctor(function (_1) {
    return function (f) {
        return function (_2) {
            return f(_2);
        };
    };
});
var prj = function (p) {
    return function (_11) {
        return Data_Maybe_First.runFirst(Data_Const.getConst(p(Data_Profunctor_Choice.choiceFn)(Data_Const.applicativeConst(Data_Maybe_First.monoidFirst))(function (_12) {
            return Data_Const.Const(Data_Maybe_First.First(Data_Maybe.Just.create(_12)));
        })(_11)));
    };
};
var prism = function (f) {
    return function (g) {
        return function (__dict_Choice_0) {
            return function (__dict_Applicative_1) {
                return function (_13) {
                    return Data_Profunctor.dimap(__dict_Choice_0["__superclass_Data.Profunctor.Profunctor_0"]())(g)(Data_Either.either(Prelude.pure(__dict_Applicative_1))(Prelude.map((__dict_Applicative_1["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(f)))(Data_Profunctor_Choice.right(__dict_Choice_0)(_13));
                };
            };
        };
    };
};
var prism$prime = function (f) {
    return function (g) {
        return function (__dict_Choice_2) {
            return function (__dict_Applicative_3) {
                return prism(f)(function (s) {
                    return Data_Maybe.maybe(new Data_Either.Left(s))(Data_Either.Right.create)(g(s));
                })(__dict_Choice_2)(__dict_Applicative_3);
            };
        };
    };
};
var injRE = function (__dict_Choice_4) {
    return function (__dict_Applicative_5) {
        return prism$prime(Data_Either.Right.create)(Data_Either.either(Prelude["const"](Data_Maybe.Nothing.value))(Data_Maybe.Just.create))(__dict_Choice_4)(__dict_Applicative_5);
    };
};
var injRC = function (__dict_Choice_6) {
    return function (__dict_Applicative_7) {
        return prism$prime(Data_Functor_Coproduct.right)(Data_Functor_Coproduct.coproduct(Prelude["const"](Data_Maybe.Nothing.value))(Data_Maybe.Just.create))(__dict_Choice_6)(__dict_Applicative_7);
    };
};
var injLE = function (__dict_Choice_8) {
    return function (__dict_Applicative_9) {
        return prism$prime(Data_Either.Left.create)(Data_Either.either(Data_Maybe.Just.create)(Prelude["const"](Data_Maybe.Nothing.value)))(__dict_Choice_8)(__dict_Applicative_9);
    };
};
var injLC = function (__dict_Choice_10) {
    return function (__dict_Applicative_11) {
        return prism$prime(Data_Functor_Coproduct.left)(Data_Functor_Coproduct.coproduct(Data_Maybe.Just.create)(Prelude["const"](Data_Maybe.Nothing.value)))(__dict_Choice_10)(__dict_Applicative_11);
    };
};
var injI = function (__dict_Choice_12) {
    return function (__dict_Applicative_13) {
        return prism$prime(Prelude.id(Prelude.categoryFn))(Data_Maybe.Just.create)(__dict_Choice_12)(__dict_Applicative_13);
    };
};
var choiceTagged = new Data_Profunctor_Choice.Choice(function () {
    return profunctorTagged;
}, function (_3) {
    return new Data_Either.Left(_3);
}, function (_4) {
    return new Data_Either.Right(_4);
});
var inj = function (p) {
    return function (_14) {
        return Data_Identity.runIdentity(unTagged(p(choiceTagged)(Data_Identity.applicativeIdentity)(Tagged(Data_Identity.Identity(_14)))));
    };
};
module.exports = {
    injRC: injRC, 
    injRE: injRE, 
    injLC: injLC, 
    injLE: injLE, 
    injI: injI, 
    prj: prj, 
    inj: inj
};

},{"Data.Const":"/Users/maximko/Projects/mine/guppi/output/Data.Const/index.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Functor.Coproduct":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Coproduct/index.js","Data.Identity":"/Users/maximko/Projects/mine/guppi/output/Data.Identity/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Maybe.First":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe.First/index.js","Data.Profunctor":"/Users/maximko/Projects/mine/guppi/output/Data.Profunctor/index.js","Data.Profunctor.Choice":"/Users/maximko/Projects/mine/guppi/output/Data.Profunctor.Choice/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Int.Bits/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Data.Int.Bits

exports.andImpl = function (n1) {
  return function (n2) {
    /* jshint bitwise: false */
    return n1 & n2;
  };
};

exports.orImpl = function (n1) {
  return function (n2) {
    /* jshint bitwise: false */
    return n1 | n2;
  };
};

exports.xorImpl = function (n1) {
  return function (n2) {
    /* jshint bitwise: false */
    return n1 ^ n2;
  };
};

exports.shl = function (n1) {
  return function (n2) {
    /* jshint bitwise: false */
    return n1 << n2;
  };
};

exports.shr = function (n1) {
  return function (n2) {
    /* jshint bitwise: false */
    return n1 >> n2;
  };
};

exports.zshr = function (n1) {
  return function (n2) {
    /* jshint bitwise: false */
    return n1 >>> n2;
  };
};

exports.complement = function (n) {
  /* jshint bitwise: false */
  return ~n;
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Data.Int.Bits/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var $dot$bar$dot = $foreign.orImpl;
var $dot$up$dot = $foreign.xorImpl;
var $dot$amp$dot = $foreign.andImpl;
module.exports = {
    ".^.": $dot$up$dot, 
    ".|.": $dot$bar$dot, 
    ".&.": $dot$amp$dot, 
    complement: $foreign.complement, 
    zshr: $foreign.zshr, 
    shr: $foreign.shr, 
    shl: $foreign.shl
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Int.Bits/foreign.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Int/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Data.Int

exports.fromNumberImpl = function (just) {
  return function (nothing) {
    return function (n) {
      /* jshint bitwise: false */
      return (n | 0) === n ? just(n) : nothing;
    };
  };
};

exports.toNumber = function (n) {
  return n;
};

exports.fromStringImpl = function (just) {
  return function (nothing) {
    return function (s) {
      /* jshint bitwise: false */
      var i = parseFloat(s);
      return (i | 0) === i ? just(i) : nothing;
    };
  };
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Data.Int/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Data_Int_Bits = require("Data.Int.Bits");
var Data_Maybe = require("Data.Maybe");
var Data_Maybe_Unsafe = require("Data.Maybe.Unsafe");
var $$Math = require("Math");
var odd = function (x) {
    return (x & 1) !== 0;
};
var fromString = $foreign.fromStringImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var fromNumber = $foreign.fromNumberImpl(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var unsafeClamp = function (x) {
    if (x >= $foreign.toNumber(Prelude.top(Prelude.boundedInt))) {
        return Prelude.top(Prelude.boundedInt);
    };
    if (x <= $foreign.toNumber(Prelude.bottom(Prelude.boundedInt))) {
        return Prelude.bottom(Prelude.boundedInt);
    };
    if (Prelude.otherwise) {
        return Data_Maybe_Unsafe.fromJust(fromNumber(x));
    };
    throw new Error("Failed pattern match at Data.Int line 48, column 1 - line 49, column 1: " + [ x.constructor.name ]);
};
var round = function (_1) {
    return unsafeClamp($$Math.round(_1));
};
var floor = function (_2) {
    return unsafeClamp($$Math.floor(_2));
};
var even = function (x) {
    return (x & 1) === 0;
};
var ceil = function (_3) {
    return unsafeClamp($$Math.ceil(_3));
};
module.exports = {
    odd: odd, 
    even: even, 
    fromString: fromString, 
    round: round, 
    floor: floor, 
    ceil: ceil, 
    fromNumber: fromNumber, 
    toNumber: $foreign.toNumber
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Int/foreign.js","Data.Int.Bits":"/Users/maximko/Projects/mine/guppi/output/Data.Int.Bits/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Maybe.Unsafe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe.Unsafe/index.js","Math":"/Users/maximko/Projects/mine/guppi/output/Math/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Lazy/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Data.Lazy

exports.defer = function () {

  function Defer (thunk) {
    if (this instanceof Defer) {
      this.thunk = thunk;
      return this;
    } else {
      return new Defer(thunk);
    }
  }

  Defer.prototype.force = function () {
    var value = this.thunk();
    delete this.thunk;
    this.force = function () {
      return value;
    };
    return value;
  };

  return Defer;

}();

exports.force = function (l) {
  return l.force();
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Data.Lazy/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Control_Comonad = require("Control.Comonad");
var Control_Extend = require("Control.Extend");
var Data_Monoid = require("Data.Monoid");
var Control_Lazy = require("Control.Lazy");
var showLazy = function (__dict_Show_0) {
    return new Prelude.Show(function (x) {
        return "Lazy " + Prelude.show(__dict_Show_0)($foreign.force(x));
    });
};
var semiringLazy = function (__dict_Semiring_1) {
    return new Prelude.Semiring(function (a) {
        return function (b) {
            return $foreign.defer(function (_0) {
                return Prelude["+"](__dict_Semiring_1)($foreign.force(a))($foreign.force(b));
            });
        };
    }, function (a) {
        return function (b) {
            return $foreign.defer(function (_2) {
                return Prelude["*"](__dict_Semiring_1)($foreign.force(a))($foreign.force(b));
            });
        };
    }, $foreign.defer(function (_3) {
        return Prelude.one(__dict_Semiring_1);
    }), $foreign.defer(function (_1) {
        return Prelude.zero(__dict_Semiring_1);
    }));
};
var semigroupLazy = function (__dict_Semigroup_2) {
    return new Prelude.Semigroup(function (a) {
        return function (b) {
            return $foreign.defer(function (_9) {
                return Prelude["<>"](__dict_Semigroup_2)($foreign.force(a))($foreign.force(b));
            });
        };
    });
};
var ringLazy = function (__dict_Ring_3) {
    return new Prelude.Ring(function () {
        return semiringLazy(__dict_Ring_3["__superclass_Prelude.Semiring_0"]());
    }, function (a) {
        return function (b) {
            return $foreign.defer(function (_4) {
                return Prelude["-"](__dict_Ring_3)($foreign.force(a))($foreign.force(b));
            });
        };
    });
};
var monoidLazy = function (__dict_Monoid_6) {
    return new Data_Monoid.Monoid(function () {
        return semigroupLazy(__dict_Monoid_6["__superclass_Prelude.Semigroup_0"]());
    }, $foreign.defer(function (_10) {
        return Data_Monoid.mempty(__dict_Monoid_6);
    }));
};
var moduloSemiringLazy = function (__dict_ModuloSemiring_7) {
    return new Prelude.ModuloSemiring(function () {
        return semiringLazy(__dict_ModuloSemiring_7["__superclass_Prelude.Semiring_0"]());
    }, function (a) {
        return function (b) {
            return $foreign.defer(function (_5) {
                return Prelude["/"](__dict_ModuloSemiring_7)($foreign.force(a))($foreign.force(b));
            });
        };
    }, function (a) {
        return function (b) {
            return $foreign.defer(function (_6) {
                return Prelude.mod(__dict_ModuloSemiring_7)($foreign.force(a))($foreign.force(b));
            });
        };
    });
};
var lazyLazy = new Control_Lazy.Lazy(function (f) {
    return $foreign.defer(function (_16) {
        return $foreign.force(f(Prelude.unit));
    });
});
var functorLazy = new Prelude.Functor(function (f) {
    return function (l) {
        return $foreign.defer(function (_11) {
            return f($foreign.force(l));
        });
    };
});
var extendLazy = new Control_Extend.Extend(function () {
    return functorLazy;
}, function (f) {
    return function (x) {
        return $foreign.defer(function (_15) {
            return f(x);
        });
    };
});
var eqLazy = function (__dict_Eq_8) {
    return new Prelude.Eq(function (x) {
        return function (y) {
            return Prelude["=="](__dict_Eq_8)($foreign.force(x))($foreign.force(y));
        };
    });
};
var ordLazy = function (__dict_Ord_4) {
    return new Prelude.Ord(function () {
        return eqLazy(__dict_Ord_4["__superclass_Prelude.Eq_0"]());
    }, function (x) {
        return function (y) {
            return Prelude.compare(__dict_Ord_4)($foreign.force(x))($foreign.force(y));
        };
    });
};
var divisionRingLazy = function (__dict_DivisionRing_9) {
    return new Prelude.DivisionRing(function () {
        return moduloSemiringLazy(__dict_DivisionRing_9["__superclass_Prelude.ModuloSemiring_1"]());
    }, function () {
        return ringLazy(__dict_DivisionRing_9["__superclass_Prelude.Ring_0"]());
    });
};
var numLazy = function (__dict_Num_5) {
    return new Prelude.Num(function () {
        return divisionRingLazy(__dict_Num_5["__superclass_Prelude.DivisionRing_0"]());
    });
};
var comonadLazy = new Control_Comonad.Comonad(function () {
    return extendLazy;
}, $foreign.force);
var boundedLazy = function (__dict_Bounded_11) {
    return new Prelude.Bounded($foreign.defer(function (_8) {
        return Prelude.bottom(__dict_Bounded_11);
    }), $foreign.defer(function (_7) {
        return Prelude.top(__dict_Bounded_11);
    }));
};
var boundedOrdLazy = function (__dict_BoundedOrd_10) {
    return new Prelude.BoundedOrd(function () {
        return boundedLazy(__dict_BoundedOrd_10["__superclass_Prelude.Bounded_0"]());
    }, function () {
        return ordLazy(__dict_BoundedOrd_10["__superclass_Prelude.Ord_1"]());
    });
};
var applyLazy = new Prelude.Apply(function () {
    return functorLazy;
}, function (f) {
    return function (x) {
        return $foreign.defer(function (_12) {
            return $foreign.force(f)($foreign.force(x));
        });
    };
});
var bindLazy = new Prelude.Bind(function () {
    return applyLazy;
}, function (l) {
    return function (f) {
        return $foreign.defer(function (_14) {
            return $foreign.force(f($foreign.force(l)));
        });
    };
});
var booleanAlgebraLazy = function (__dict_BooleanAlgebra_12) {
    return new Prelude.BooleanAlgebra(function () {
        return boundedLazy(__dict_BooleanAlgebra_12["__superclass_Prelude.Bounded_0"]());
    }, function (a) {
        return function (b) {
            return Prelude["<*>"](applyLazy)(Prelude["<$>"](functorLazy)(Prelude.conj(__dict_BooleanAlgebra_12))(a))(b);
        };
    }, function (a) {
        return function (b) {
            return Prelude["<*>"](applyLazy)(Prelude["<$>"](functorLazy)(Prelude.disj(__dict_BooleanAlgebra_12))(a))(b);
        };
    }, function (a) {
        return Prelude["<$>"](functorLazy)(Prelude.not(__dict_BooleanAlgebra_12))(a);
    });
};
var applicativeLazy = new Prelude.Applicative(function () {
    return applyLazy;
}, function (a) {
    return $foreign.defer(function (_13) {
        return a;
    });
});
var monadLazy = new Prelude.Monad(function () {
    return applicativeLazy;
}, function () {
    return bindLazy;
});
module.exports = {
    semiringLazy: semiringLazy, 
    ringLazy: ringLazy, 
    moduloSemiringLazy: moduloSemiringLazy, 
    divisionRingLazy: divisionRingLazy, 
    numLazy: numLazy, 
    eqLazy: eqLazy, 
    ordLazy: ordLazy, 
    boundedLazy: boundedLazy, 
    boundedOrdLazy: boundedOrdLazy, 
    semigroupLazy: semigroupLazy, 
    monoidLazy: monoidLazy, 
    booleanAlgebraLazy: booleanAlgebraLazy, 
    functorLazy: functorLazy, 
    applyLazy: applyLazy, 
    applicativeLazy: applicativeLazy, 
    bindLazy: bindLazy, 
    monadLazy: monadLazy, 
    extendLazy: extendLazy, 
    comonadLazy: comonadLazy, 
    showLazy: showLazy, 
    lazyLazy: lazyLazy, 
    force: $foreign.force, 
    defer: $foreign.defer
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Lazy/foreign.js","Control.Comonad":"/Users/maximko/Projects/mine/guppi/output/Control.Comonad/index.js","Control.Extend":"/Users/maximko/Projects/mine/guppi/output/Control.Extend/index.js","Control.Lazy":"/Users/maximko/Projects/mine/guppi/output/Control.Lazy/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.List/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Alt = require("Control.Alt");
var Control_Alternative = require("Control.Alternative");
var Control_Lazy = require("Control.Lazy");
var Control_MonadPlus = require("Control.MonadPlus");
var Control_Plus = require("Control.Plus");
var Data_Foldable = require("Data.Foldable");
var Data_Maybe = require("Data.Maybe");
var Data_Monoid = require("Data.Monoid");
var Data_Traversable = require("Data.Traversable");
var Data_Tuple = require("Data.Tuple");
var Data_Unfoldable = require("Data.Unfoldable");
var Nil = (function () {
    function Nil() {

    };
    Nil.value = new Nil();
    return Nil;
})();
var Cons = (function () {
    function Cons(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Cons.create = function (value0) {
        return function (value1) {
            return new Cons(value0, value1);
        };
    };
    return Cons;
})();
var $colon = Cons.create;
var updateAt = function (_24) {
    return function (x) {
        return function (_25) {
            if (_24 === 0 && _25 instanceof Cons) {
                return new Data_Maybe.Just(new Cons(x, _25.value1));
            };
            if (_25 instanceof Cons) {
                return Prelude["<$>"](Data_Maybe.functorMaybe)(Cons.create(_25.value0))(updateAt(_24 - 1)(x)(_25.value1));
            };
            return Data_Maybe.Nothing.value;
        };
    };
};
var uncons = function (_17) {
    if (_17 instanceof Nil) {
        return Data_Maybe.Nothing.value;
    };
    if (_17 instanceof Cons) {
        return new Data_Maybe.Just({
            head: _17.value0, 
            tail: _17.value1
        });
    };
    throw new Error("Failed pattern match at Data.List line 270, column 1 - line 271, column 1: " + [ _17.constructor.name ]);
};
var toUnfoldable = function (__dict_Unfoldable_2) {
    return Data_Unfoldable.unfoldr(__dict_Unfoldable_2)(function (xs) {
        return Prelude["<$>"](Data_Maybe.functorMaybe)(function (rec) {
            return new Data_Tuple.Tuple(rec.head, rec.tail);
        })(uncons(xs));
    });
};
var tail = function (_15) {
    if (_15 instanceof Nil) {
        return Data_Maybe.Nothing.value;
    };
    if (_15 instanceof Cons) {
        return new Data_Maybe.Just(_15.value1);
    };
    throw new Error("Failed pattern match at Data.List line 251, column 1 - line 252, column 1: " + [ _15.constructor.name ]);
};
var span = function (p) {
    return function (_32) {
        if (_32 instanceof Cons && p(_32.value0)) {
            var _85 = span(p)(_32.value1);
            return {
                init: new Cons(_32.value0, _85.init), 
                rest: _85.rest
            };
        };
        return {
            init: Nil.value, 
            rest: _32
        };
    };
};
var singleton = function (a) {
    return new Cons(a, Nil.value);
};
var sortBy = function (cmp) {
    var merge = function (_49) {
        return function (_50) {
            if (_49 instanceof Cons && _50 instanceof Cons) {
                if (Prelude["=="](Prelude.eqOrdering)(cmp(_49.value0)(_50.value0))(Prelude.GT.value)) {
                    return new Cons(_50.value0, merge(_49)(_50.value1));
                };
                if (Prelude.otherwise) {
                    return new Cons(_49.value0, merge(_49.value1)(_50));
                };
            };
            if (_49 instanceof Nil) {
                return _50;
            };
            if (_50 instanceof Nil) {
                return _49;
            };
            throw new Error("Failed pattern match at Data.List line 444, column 1 - line 445, column 1: " + [ _49.constructor.name, _50.constructor.name ]);
        };
    };
    var mergePairs = function (_48) {
        if (_48 instanceof Cons && _48.value1 instanceof Cons) {
            return new Cons(merge(_48.value0)(_48.value1.value0), mergePairs(_48.value1.value1));
        };
        return _48;
    };
    var mergeAll = function (__copy__47) {
        var _47 = __copy__47;
        tco: while (true) {
            if (_47 instanceof Cons && _47.value1 instanceof Nil) {
                return _47.value0;
            };
            var __tco__47 = mergePairs(_47);
            _47 = __tco__47;
            continue tco;
        };
    };
    var sequences = function (_44) {
        if (_44 instanceof Cons && _44.value1 instanceof Cons) {
            if (Prelude["=="](Prelude.eqOrdering)(cmp(_44.value0)(_44.value1.value0))(Prelude.GT.value)) {
                return descending(_44.value1.value0)(singleton(_44.value0))(_44.value1.value1);
            };
            if (Prelude.otherwise) {
                return ascending(_44.value1.value0)(Cons.create(_44.value0))(_44.value1.value1);
            };
        };
        return singleton(_44);
    };
    var descending = function (__copy_a) {
        return function (__copy_as) {
            return function (__copy__45) {
                var a = __copy_a;
                var as = __copy_as;
                var _45 = __copy__45;
                tco: while (true) {
                    var a_1 = a;
                    var as_1 = as;
                    if (_45 instanceof Cons && Prelude["=="](Prelude.eqOrdering)(cmp(a_1)(_45.value0))(Prelude.GT.value)) {
                        var __tco_a = _45.value0;
                        var __tco_as = new Cons(a_1, as_1);
                        var __tco__45 = _45.value1;
                        a = __tco_a;
                        as = __tco_as;
                        _45 = __tco__45;
                        continue tco;
                    };
                    return new Cons(new Cons(a, as), sequences(_45));
                };
            };
        };
    };
    var ascending = function (a) {
        return function (as) {
            return function (_46) {
                if (_46 instanceof Cons && Prelude["/="](Prelude.eqOrdering)(cmp(a)(_46.value0))(Prelude.GT.value)) {
                    return ascending(_46.value0)(function (ys) {
                        return as(new Cons(a, ys));
                    })(_46.value1);
                };
                return new Cons(as(singleton(a)), sequences(_46));
            };
        };
    };
    return function (_316) {
        return mergeAll(sequences(_316));
    };
};
var sort = function (__dict_Ord_3) {
    return function (xs) {
        return sortBy(Prelude.compare(__dict_Ord_3))(xs);
    };
};
var showList = function (__dict_Show_4) {
    return new Prelude.Show(function (_57) {
        if (_57 instanceof Nil) {
            return "Nil";
        };
        if (_57 instanceof Cons) {
            return "Cons (" + (Prelude.show(__dict_Show_4)(_57.value0) + (") (" + (Prelude.show(showList(__dict_Show_4))(_57.value1) + ")")));
        };
        throw new Error("Failed pattern match: " + [ _57.constructor.name ]);
    });
};
var semigroupList = new Prelude.Semigroup(function (_63) {
    return function (ys) {
        if (_63 instanceof Nil) {
            return ys;
        };
        if (_63 instanceof Cons) {
            return new Cons(_63.value0, Prelude["<>"](semigroupList)(_63.value1)(ys));
        };
        throw new Error("Failed pattern match: " + [ _63.constructor.name, ys.constructor.name ]);
    };
});
var reverse = (function () {
    var go = function (__copy_acc) {
        return function (__copy__41) {
            var acc = __copy_acc;
            var _41 = __copy__41;
            tco: while (true) {
                var acc_1 = acc;
                if (_41 instanceof Nil) {
                    return acc_1;
                };
                if (_41 instanceof Cons) {
                    var __tco_acc = new Cons(_41.value0, acc);
                    var __tco__41 = _41.value1;
                    acc = __tco_acc;
                    _41 = __tco__41;
                    continue tco;
                };
                throw new Error("Failed pattern match at Data.List line 368, column 1 - line 369, column 1: " + [ acc.constructor.name, _41.constructor.name ]);
            };
        };
    };
    return go(Nil.value);
})();
var snoc = function (xs) {
    return function (x) {
        return reverse(new Cons(x, reverse(xs)));
    };
};
var take = (function () {
    var go = function (__copy_acc) {
        return function (__copy__51) {
            return function (__copy__52) {
                var acc = __copy_acc;
                var _51 = __copy__51;
                var _52 = __copy__52;
                tco: while (true) {
                    var acc_1 = acc;
                    if (_51 === 0) {
                        return reverse(acc_1);
                    };
                    var acc_1 = acc;
                    if (_52 instanceof Nil) {
                        return reverse(acc_1);
                    };
                    if (_52 instanceof Cons) {
                        var __tco_acc = new Cons(_52.value0, acc);
                        var __tco__51 = _51 - 1;
                        var __tco__52 = _52.value1;
                        acc = __tco_acc;
                        _51 = __tco__51;
                        _52 = __tco__52;
                        continue tco;
                    };
                    throw new Error("Failed pattern match at Data.List line 490, column 1 - line 491, column 1: " + [ acc.constructor.name, _51.constructor.name, _52.constructor.name ]);
                };
            };
        };
    };
    return go(Nil.value);
})();
var takeWhile = function (p) {
    var go = function (__copy_acc) {
        return function (__copy__53) {
            var acc = __copy_acc;
            var _53 = __copy__53;
            tco: while (true) {
                var acc_1 = acc;
                if (_53 instanceof Cons && p(_53.value0)) {
                    var __tco_acc = new Cons(_53.value0, acc_1);
                    var __tco__53 = _53.value1;
                    acc = __tco_acc;
                    _53 = __tco__53;
                    continue tco;
                };
                return reverse(acc);
            };
        };
    };
    return go(Nil.value);
};
var unfoldableList = new Data_Unfoldable.Unfoldable(function (f) {
    return function (b) {
        var go = function (__copy_source) {
            return function (__copy_memo) {
                var source = __copy_source;
                var memo = __copy_memo;
                tco: while (true) {
                    var _139 = f(source);
                    if (_139 instanceof Data_Maybe.Nothing) {
                        return reverse(memo);
                    };
                    if (_139 instanceof Data_Maybe.Just) {
                        var __tco_memo = new Cons(_139.value0.value0, memo);
                        source = _139.value0.value1;
                        memo = __tco_memo;
                        continue tco;
                    };
                    throw new Error("Failed pattern match at Data.List line 748, column 1 - line 755, column 1: " + [ _139.constructor.name ]);
                };
            };
        };
        return go(b)(Nil.value);
    };
});
var zipWith = function (f) {
    return function (xs) {
        return function (ys) {
            var go = function (__copy__55) {
                return function (__copy__56) {
                    return function (__copy_acc) {
                        var _55 = __copy__55;
                        var _56 = __copy__56;
                        var acc = __copy_acc;
                        tco: while (true) {
                            if (_55 instanceof Nil) {
                                return acc;
                            };
                            if (_56 instanceof Nil) {
                                return acc;
                            };
                            if (_55 instanceof Cons && _56 instanceof Cons) {
                                var __tco__55 = _55.value1;
                                var __tco__56 = _56.value1;
                                var __tco_acc = new Cons(f(_55.value0)(_56.value0), acc);
                                _55 = __tco__55;
                                _56 = __tco__56;
                                acc = __tco_acc;
                                continue tco;
                            };
                            throw new Error("Failed pattern match at Data.List line 654, column 1 - line 655, column 1: " + [ _55.constructor.name, _56.constructor.name, acc.constructor.name ]);
                        };
                    };
                };
            };
            return reverse(go(xs)(ys)(Nil.value));
        };
    };
};
var zip = zipWith(Data_Tuple.Tuple.create);
var replicateM = function (__dict_Monad_6) {
    return function (n) {
        return function (m) {
            if (n < 1) {
                return Prelude["return"](__dict_Monad_6["__superclass_Prelude.Applicative_0"]())(Nil.value);
            };
            if (Prelude.otherwise) {
                return Prelude.bind(__dict_Monad_6["__superclass_Prelude.Bind_1"]())(m)(function (_4) {
                    return Prelude.bind(__dict_Monad_6["__superclass_Prelude.Bind_1"]())(replicateM(__dict_Monad_6)(n - 1)(m))(function (_3) {
                        return Prelude["return"](__dict_Monad_6["__superclass_Prelude.Applicative_0"]())(new Cons(_4, _3));
                    });
                });
            };
            throw new Error("Failed pattern match: " + [ n.constructor.name, m.constructor.name ]);
        };
    };
};
var replicate = function (n) {
    return function (value) {
        var go = function (__copy_n_1) {
            return function (__copy_rest) {
                var n_1 = __copy_n_1;
                var rest = __copy_rest;
                tco: while (true) {
                    if (n_1 <= 0) {
                        return rest;
                    };
                    if (Prelude.otherwise) {
                        var __tco_n_1 = n_1 - 1;
                        var __tco_rest = new Cons(value, rest);
                        n_1 = __tco_n_1;
                        rest = __tco_rest;
                        continue tco;
                    };
                    throw new Error("Failed pattern match at Data.List line 148, column 1 - line 149, column 1: " + [ n_1.constructor.name, rest.constructor.name ]);
                };
            };
        };
        return go(n)(Nil.value);
    };
};
var range = function (start) {
    return function (end) {
        if (start === end) {
            return singleton(start);
        };
        if (Prelude.otherwise) {
            var go = function (__copy_s) {
                return function (__copy_e) {
                    return function (__copy_step) {
                        return function (__copy_rest) {
                            var s = __copy_s;
                            var e = __copy_e;
                            var step = __copy_step;
                            var rest = __copy_rest;
                            tco: while (true) {
                                if (s === e) {
                                    return new Cons(s, rest);
                                };
                                if (Prelude.otherwise) {
                                    var __tco_s = s + step | 0;
                                    var __tco_e = e;
                                    var __tco_step = step;
                                    var __tco_rest = new Cons(s, rest);
                                    s = __tco_s;
                                    e = __tco_e;
                                    step = __tco_step;
                                    rest = __tco_rest;
                                    continue tco;
                                };
                                throw new Error("Failed pattern match at Data.List line 140, column 1 - line 141, column 1: " + [ s.constructor.name, e.constructor.name, step.constructor.name, rest.constructor.name ]);
                            };
                        };
                    };
                };
            };
            return go(end)(start)((function () {
                var _162 = start > end;
                if (_162) {
                    return 1;
                };
                if (!_162) {
                    return -1;
                };
                throw new Error("Failed pattern match at Data.List line 140, column 1 - line 141, column 1: " + [ _162.constructor.name ]);
            })())(Nil.value);
        };
        throw new Error("Failed pattern match at Data.List line 140, column 1 - line 141, column 1: " + [ start.constructor.name, end.constructor.name ]);
    };
};
var $dot$dot = range;
var $$null = function (_11) {
    if (_11 instanceof Nil) {
        return true;
    };
    return false;
};
var monoidList = new Data_Monoid.Monoid(function () {
    return semigroupList;
}, Nil.value);
var mapMaybe = function (f) {
    var go = function (__copy_acc) {
        return function (__copy__43) {
            var acc = __copy_acc;
            var _43 = __copy__43;
            tco: while (true) {
                var acc_1 = acc;
                if (_43 instanceof Nil) {
                    return reverse(acc_1);
                };
                if (_43 instanceof Cons) {
                    var _166 = f(_43.value0);
                    if (_166 instanceof Data_Maybe.Nothing) {
                        var __tco_acc = acc;
                        var __tco__43 = _43.value1;
                        acc = __tco_acc;
                        _43 = __tco__43;
                        continue tco;
                    };
                    if (_166 instanceof Data_Maybe.Just) {
                        var __tco_acc = new Cons(_166.value0, acc);
                        var __tco__43 = _43.value1;
                        acc = __tco_acc;
                        _43 = __tco__43;
                        continue tco;
                    };
                    throw new Error("Failed pattern match at Data.List line 420, column 1 - line 421, column 1: " + [ _166.constructor.name ]);
                };
                throw new Error("Failed pattern match at Data.List line 420, column 1 - line 421, column 1: " + [ acc.constructor.name, _43.constructor.name ]);
            };
        };
    };
    return go(Nil.value);
};
var some = function (__dict_Alternative_8) {
    return function (__dict_Lazy_9) {
        return function (v) {
            return Prelude["<*>"]((__dict_Alternative_8["__superclass_Prelude.Applicative_0"]())["__superclass_Prelude.Apply_0"]())(Prelude["<$>"](((__dict_Alternative_8["__superclass_Control.Plus.Plus_1"]())["__superclass_Control.Alt.Alt_0"]())["__superclass_Prelude.Functor_0"]())(Cons.create)(v))(Control_Lazy.defer(__dict_Lazy_9)(function (_7) {
                return many(__dict_Alternative_8)(__dict_Lazy_9)(v);
            }));
        };
    };
};
var many = function (__dict_Alternative_10) {
    return function (__dict_Lazy_11) {
        return function (v) {
            return Control_Alt["<|>"]((__dict_Alternative_10["__superclass_Control.Plus.Plus_1"]())["__superclass_Control.Alt.Alt_0"]())(some(__dict_Alternative_10)(__dict_Lazy_11)(v))(Prelude.pure(__dict_Alternative_10["__superclass_Prelude.Applicative_0"]())(Nil.value));
        };
    };
};
var last = function (__copy__14) {
    var _14 = __copy__14;
    tco: while (true) {
        if (_14 instanceof Cons && _14.value1 instanceof Nil) {
            return new Data_Maybe.Just(_14.value0);
        };
        if (_14 instanceof Cons) {
            var __tco__14 = _14.value1;
            _14 = __tco__14;
            continue tco;
        };
        return Data_Maybe.Nothing.value;
    };
};
var insertBy = function (cmp) {
    return function (x) {
        return function (_12) {
            if (_12 instanceof Nil) {
                return new Cons(x, Nil.value);
            };
            if (_12 instanceof Cons) {
                var _179 = cmp(x)(_12.value0);
                if (_179 instanceof Prelude.GT) {
                    return new Cons(_12.value0, insertBy(cmp)(x)(_12.value1));
                };
                return new Cons(x, _12);
            };
            throw new Error("Failed pattern match: " + [ cmp.constructor.name, x.constructor.name, _12.constructor.name ]);
        };
    };
};
var insertAt = function (_20) {
    return function (x) {
        return function (_21) {
            if (_20 === 0) {
                return new Data_Maybe.Just(new Cons(x, _21));
            };
            if (_21 instanceof Cons) {
                return Prelude["<$>"](Data_Maybe.functorMaybe)(Cons.create(_21.value0))(insertAt(_20 - 1)(x)(_21.value1));
            };
            return Data_Maybe.Nothing.value;
        };
    };
};
var insert = function (__dict_Ord_12) {
    return insertBy(Prelude.compare(__dict_Ord_12));
};
var init = function (_16) {
    if (_16 instanceof Nil) {
        return Data_Maybe.Nothing.value;
    };
    var go = function (__copy__39) {
        return function (__copy_acc) {
            var _39 = __copy__39;
            var acc = __copy_acc;
            tco: while (true) {
                if (_39 instanceof Cons && _39.value1 instanceof Nil) {
                    return acc;
                };
                if (_39 instanceof Cons) {
                    var __tco__39 = _39.value1;
                    var __tco_acc = new Cons(_39.value0, acc);
                    _39 = __tco__39;
                    acc = __tco_acc;
                    continue tco;
                };
                return acc;
            };
        };
    };
    return Data_Maybe.Just.create(reverse(go(_16)(Nil.value)));
};
var index = function (__copy__18) {
    return function (__copy__19) {
        var _18 = __copy__18;
        var _19 = __copy__19;
        tco: while (true) {
            if (_18 instanceof Nil) {
                return Data_Maybe.Nothing.value;
            };
            if (_18 instanceof Cons && _19 === 0) {
                return new Data_Maybe.Just(_18.value0);
            };
            if (_18 instanceof Cons) {
                var __tco__18 = _18.value1;
                var __tco__19 = _19 - 1;
                _18 = __tco__18;
                _19 = __tco__19;
                continue tco;
            };
            throw new Error("Failed pattern match: " + [ _18.constructor.name, _19.constructor.name ]);
        };
    };
};
var $bang$bang = index;
var head = function (_13) {
    if (_13 instanceof Nil) {
        return Data_Maybe.Nothing.value;
    };
    if (_13 instanceof Cons) {
        return new Data_Maybe.Just(_13.value0);
    };
    throw new Error("Failed pattern match at Data.List line 236, column 1 - line 237, column 1: " + [ _13.constructor.name ]);
};
var groupBy = function (eq) {
    return function (_33) {
        if (_33 instanceof Nil) {
            return Nil.value;
        };
        if (_33 instanceof Cons) {
            var _205 = span(eq(_33.value0))(_33.value1);
            return new Cons(new Cons(_33.value0, _205.init), groupBy(eq)(_205.rest));
        };
        throw new Error("Failed pattern match: " + [ eq.constructor.name, _33.constructor.name ]);
    };
};
var group = function (__dict_Eq_13) {
    return groupBy(Prelude["=="](__dict_Eq_13));
};
var group$prime = function (__dict_Ord_14) {
    return function (_317) {
        return group(__dict_Ord_14["__superclass_Prelude.Eq_0"]())(sort(__dict_Ord_14)(_317));
    };
};
var functorList = new Prelude.Functor(function (f) {
    return function (lst) {
        var go = function (__copy__64) {
            return function (__copy_acc) {
                var _64 = __copy__64;
                var acc = __copy_acc;
                tco: while (true) {
                    if (_64 instanceof Nil) {
                        return acc;
                    };
                    if (_64 instanceof Cons) {
                        var __tco__64 = _64.value1;
                        var __tco_acc = new Cons(f(_64.value0), acc);
                        _64 = __tco__64;
                        acc = __tco_acc;
                        continue tco;
                    };
                    throw new Error("Failed pattern match at Data.List line 731, column 1 - line 738, column 1: " + [ _64.constructor.name, acc.constructor.name ]);
                };
            };
        };
        return reverse(go(lst)(Nil.value));
    };
});
var fromList = function (__dict_Unfoldable_15) {
    return toUnfoldable(__dict_Unfoldable_15);
};
var fromFoldable = function (__dict_Foldable_16) {
    return Data_Foldable.foldr(__dict_Foldable_16)(Cons.create)(Nil.value);
};
var toList = function (__dict_Foldable_17) {
    return fromFoldable(__dict_Foldable_17);
};
var foldableList = new Data_Foldable.Foldable(function (__dict_Monoid_18) {
    return function (f) {
        return Data_Foldable.foldl(foldableList)(function (acc) {
            return function (_318) {
                return Prelude.append(__dict_Monoid_18["__superclass_Prelude.Semigroup_0"]())(acc)(f(_318));
            };
        })(Data_Monoid.mempty(__dict_Monoid_18));
    };
}, (function () {
    var go = function (__copy_o) {
        return function (__copy_b) {
            return function (__copy__66) {
                var o = __copy_o;
                var b = __copy_b;
                var _66 = __copy__66;
                tco: while (true) {
                    var b_1 = b;
                    if (_66 instanceof Nil) {
                        return b_1;
                    };
                    if (_66 instanceof Cons) {
                        var __tco_o = o;
                        var __tco_b = o(b)(_66.value0);
                        var __tco__66 = _66.value1;
                        o = __tco_o;
                        b = __tco_b;
                        _66 = __tco__66;
                        continue tco;
                    };
                    throw new Error("Failed pattern match: " + [ o.constructor.name, b.constructor.name, _66.constructor.name ]);
                };
            };
        };
    };
    return go;
})(), function (o) {
    return function (b) {
        return function (_65) {
            if (_65 instanceof Nil) {
                return b;
            };
            if (_65 instanceof Cons) {
                return o(_65.value0)(Data_Foldable.foldr(foldableList)(o)(b)(_65.value1));
            };
            throw new Error("Failed pattern match: " + [ o.constructor.name, b.constructor.name, _65.constructor.name ]);
        };
    };
});
var length = Data_Foldable.foldl(foldableList)(function (acc) {
    return function (_8) {
        return acc + 1 | 0;
    };
})(0);
var traversableList = new Data_Traversable.Traversable(function () {
    return foldableList;
}, function () {
    return functorList;
}, function (__dict_Applicative_1) {
    return function (_68) {
        if (_68 instanceof Nil) {
            return Prelude.pure(__dict_Applicative_1)(Nil.value);
        };
        if (_68 instanceof Cons) {
            return Prelude["<*>"](__dict_Applicative_1["__superclass_Prelude.Apply_0"]())(Prelude["<$>"]((__dict_Applicative_1["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Cons.create)(_68.value0))(Data_Traversable.sequence(traversableList)(__dict_Applicative_1)(_68.value1));
        };
        throw new Error("Failed pattern match: " + [ _68.constructor.name ]);
    };
}, function (__dict_Applicative_0) {
    return function (f) {
        return function (_67) {
            if (_67 instanceof Nil) {
                return Prelude.pure(__dict_Applicative_0)(Nil.value);
            };
            if (_67 instanceof Cons) {
                return Prelude["<*>"](__dict_Applicative_0["__superclass_Prelude.Apply_0"]())(Prelude["<$>"]((__dict_Applicative_0["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Cons.create)(f(_67.value0)))(Data_Traversable.traverse(traversableList)(__dict_Applicative_0)(f)(_67.value1));
            };
            throw new Error("Failed pattern match: " + [ f.constructor.name, _67.constructor.name ]);
        };
    };
});
var zipWithA = function (__dict_Applicative_5) {
    return function (f) {
        return function (xs) {
            return function (ys) {
                return Data_Traversable.sequence(traversableList)(__dict_Applicative_5)(zipWith(f)(xs)(ys));
            };
        };
    };
};
var unzip = Data_Foldable.foldr(foldableList)(function (_10) {
    return function (_9) {
        return new Data_Tuple.Tuple(new Cons(_10.value0, _9.value0), new Cons(_10.value1, _9.value1));
    };
})(new Data_Tuple.Tuple(Nil.value, Nil.value));
var foldM = function (__dict_Monad_19) {
    return function (f) {
        return function (a) {
            return function (_38) {
                if (_38 instanceof Nil) {
                    return Prelude["return"](__dict_Monad_19["__superclass_Prelude.Applicative_0"]())(a);
                };
                if (_38 instanceof Cons) {
                    return Prelude[">>="](__dict_Monad_19["__superclass_Prelude.Bind_1"]())(f(a)(_38.value0))(function (a$prime) {
                        return foldM(__dict_Monad_19)(f)(a$prime)(_38.value1);
                    });
                };
                throw new Error("Failed pattern match: " + [ f.constructor.name, a.constructor.name, _38.constructor.name ]);
            };
        };
    };
};
var findIndex = function (fn) {
    var go = function (__copy_n) {
        return function (__copy__40) {
            var n = __copy_n;
            var _40 = __copy__40;
            tco: while (true) {
                if (_40 instanceof Cons) {
                    if (fn(_40.value0)) {
                        return new Data_Maybe.Just(n);
                    };
                    if (Prelude.otherwise) {
                        var __tco_n = n + 1 | 0;
                        var __tco__40 = _40.value1;
                        n = __tco_n;
                        _40 = __tco__40;
                        continue tco;
                    };
                };
                if (_40 instanceof Nil) {
                    return Data_Maybe.Nothing.value;
                };
                throw new Error("Failed pattern match at Data.List line 301, column 1 - line 302, column 1: " + [ n.constructor.name, _40.constructor.name ]);
            };
        };
    };
    return go(0);
};
var findLastIndex = function (fn) {
    return function (xs) {
        return Prelude["<$>"](Data_Maybe.functorMaybe)(Prelude["-"](Prelude.ringInt)(length(xs) - 1))(findIndex(fn)(reverse(xs)));
    };
};
var filterM = function (__dict_Monad_20) {
    return function (p) {
        return function (_29) {
            if (_29 instanceof Nil) {
                return Prelude["return"](__dict_Monad_20["__superclass_Prelude.Applicative_0"]())(Nil.value);
            };
            if (_29 instanceof Cons) {
                return Prelude.bind(__dict_Monad_20["__superclass_Prelude.Bind_1"]())(p(_29.value0))(function (_6) {
                    return Prelude.bind(__dict_Monad_20["__superclass_Prelude.Bind_1"]())(filterM(__dict_Monad_20)(p)(_29.value1))(function (_5) {
                        return Prelude["return"](__dict_Monad_20["__superclass_Prelude.Applicative_0"]())((function () {
                            if (_6) {
                                return new Cons(_29.value0, _5);
                            };
                            if (!_6) {
                                return _5;
                            };
                            throw new Error("Failed pattern match: " + [ _6.constructor.name ]);
                        })());
                    });
                });
            };
            throw new Error("Failed pattern match: " + [ p.constructor.name, _29.constructor.name ]);
        };
    };
};
var filter = function (p) {
    var go = function (__copy_acc) {
        return function (__copy__42) {
            var acc = __copy_acc;
            var _42 = __copy__42;
            tco: while (true) {
                var acc_1 = acc;
                if (_42 instanceof Nil) {
                    return reverse(acc_1);
                };
                if (_42 instanceof Cons) {
                    if (p(_42.value0)) {
                        var __tco_acc = new Cons(_42.value0, acc);
                        var __tco__42 = _42.value1;
                        acc = __tco_acc;
                        _42 = __tco__42;
                        continue tco;
                    };
                    if (Prelude.otherwise) {
                        var __tco_acc = acc;
                        var __tco__42 = _42.value1;
                        acc = __tco_acc;
                        _42 = __tco__42;
                        continue tco;
                    };
                };
                throw new Error("Failed pattern match at Data.List line 391, column 1 - line 392, column 1: " + [ acc.constructor.name, _42.constructor.name ]);
            };
        };
    };
    return go(Nil.value);
};
var intersectBy = function (eq) {
    return function (_36) {
        return function (_37) {
            if (_36 instanceof Nil) {
                return Nil.value;
            };
            if (_37 instanceof Nil) {
                return Nil.value;
            };
            return filter(function (x) {
                return Data_Foldable.any(foldableList)(Prelude.booleanAlgebraBoolean)(eq(x))(_37);
            })(_36);
        };
    };
};
var intersect = function (__dict_Eq_21) {
    return intersectBy(Prelude["=="](__dict_Eq_21));
};
var nubBy = function ($eq$eq) {
    return function (_34) {
        if (_34 instanceof Nil) {
            return Nil.value;
        };
        if (_34 instanceof Cons) {
            return new Cons(_34.value0, nubBy($eq$eq)(filter(function (y) {
                return !$eq$eq(_34.value0)(y);
            })(_34.value1)));
        };
        throw new Error("Failed pattern match: " + [ $eq$eq.constructor.name, _34.constructor.name ]);
    };
};
var nub = function (__dict_Eq_22) {
    return nubBy(Prelude.eq(__dict_Eq_22));
};
var eqList = function (__dict_Eq_23) {
    return new Prelude.Eq(function (xs) {
        return function (ys) {
            var go = function (__copy__58) {
                return function (__copy__59) {
                    return function (__copy__60) {
                        var _58 = __copy__58;
                        var _59 = __copy__59;
                        var _60 = __copy__60;
                        tco: while (true) {
                            if (!_60) {
                                return false;
                            };
                            if (_58 instanceof Nil && _59 instanceof Nil) {
                                return _60;
                            };
                            if (_58 instanceof Cons && _59 instanceof Cons) {
                                var __tco__58 = _58.value1;
                                var __tco__59 = _59.value1;
                                var __tco__60 = _60 && Prelude["=="](__dict_Eq_23)(_59.value0)(_58.value0);
                                _58 = __tco__58;
                                _59 = __tco__59;
                                _60 = __tco__60;
                                continue tco;
                            };
                            return false;
                        };
                    };
                };
            };
            return go(xs)(ys)(true);
        };
    });
};
var ordList = function (__dict_Ord_7) {
    return new Prelude.Ord(function () {
        return eqList(__dict_Ord_7["__superclass_Prelude.Eq_0"]());
    }, function (xs) {
        return function (ys) {
            var go = function (__copy__61) {
                return function (__copy__62) {
                    var _61 = __copy__61;
                    var _62 = __copy__62;
                    tco: while (true) {
                        if (_61 instanceof Nil && _62 instanceof Nil) {
                            return Prelude.EQ.value;
                        };
                        if (_61 instanceof Nil) {
                            return Prelude.LT.value;
                        };
                        if (_62 instanceof Nil) {
                            return Prelude.GT.value;
                        };
                        if (_61 instanceof Cons && _62 instanceof Cons) {
                            var _274 = Prelude.compare(__dict_Ord_7)(_61.value0)(_62.value0);
                            if (_274 instanceof Prelude.EQ) {
                                var __tco__61 = _61.value1;
                                var __tco__62 = _62.value1;
                                _61 = __tco__61;
                                _62 = __tco__62;
                                continue tco;
                            };
                            return _274;
                        };
                        throw new Error("Failed pattern match at Data.List line 713, column 1 - line 724, column 1: " + [ _61.constructor.name, _62.constructor.name ]);
                    };
                };
            };
            return go(xs)(ys);
        };
    });
};
var elemLastIndex = function (__dict_Eq_24) {
    return function (x) {
        return findLastIndex(function (_1) {
            return Prelude["=="](__dict_Eq_24)(_1)(x);
        });
    };
};
var elemIndex = function (__dict_Eq_25) {
    return function (x) {
        return findIndex(function (_0) {
            return Prelude["=="](__dict_Eq_25)(_0)(x);
        });
    };
};
var dropWhile = function (p) {
    var go = function (__copy__54) {
        var _54 = __copy__54;
        tco: while (true) {
            if (_54 instanceof Cons && p(_54.value0)) {
                var __tco__54 = _54.value1;
                _54 = __tco__54;
                continue tco;
            };
            return _54;
        };
    };
    return go;
};
var drop = function (__copy__30) {
    return function (__copy__31) {
        var _30 = __copy__30;
        var _31 = __copy__31;
        tco: while (true) {
            if (_30 === 0) {
                return _31;
            };
            if (_31 instanceof Nil) {
                return Nil.value;
            };
            if (_31 instanceof Cons) {
                var __tco__30 = _30 - 1;
                var __tco__31 = _31.value1;
                _30 = __tco__30;
                _31 = __tco__31;
                continue tco;
            };
            throw new Error("Failed pattern match: " + [ _30.constructor.name, _31.constructor.name ]);
        };
    };
};
var slice = function (start) {
    return function (end) {
        return function (xs) {
            return take(end - start)(drop(start)(xs));
        };
    };
};
var deleteBy = function ($eq$eq) {
    return function (x) {
        return function (_35) {
            if (_35 instanceof Nil) {
                return Nil.value;
            };
            if (_35 instanceof Cons && $eq$eq(x)(_35.value0)) {
                return _35.value1;
            };
            if (_35 instanceof Cons) {
                return new Cons(_35.value0, deleteBy($eq$eq)(x)(_35.value1));
            };
            throw new Error("Failed pattern match: " + [ $eq$eq.constructor.name, x.constructor.name, _35.constructor.name ]);
        };
    };
};
var unionBy = function (eq) {
    return function (xs) {
        return function (ys) {
            return Prelude["<>"](semigroupList)(xs)(Data_Foldable.foldl(foldableList)(Prelude.flip(deleteBy(eq)))(nubBy(eq)(ys))(xs));
        };
    };
};
var union = function (__dict_Eq_26) {
    return unionBy(Prelude["=="](__dict_Eq_26));
};
var deleteAt = function (_22) {
    return function (_23) {
        if (_22 === 0 && _23 instanceof Cons) {
            return new Data_Maybe.Just(_23.value1);
        };
        if (_23 instanceof Cons) {
            return Prelude["<$>"](Data_Maybe.functorMaybe)(Cons.create(_23.value0))(deleteAt(_22 - 1)(_23.value1));
        };
        return Data_Maybe.Nothing.value;
    };
};
var $$delete = function (__dict_Eq_27) {
    return deleteBy(Prelude["=="](__dict_Eq_27));
};
var $bslash$bslash = function (__dict_Eq_28) {
    return Data_Foldable.foldl(foldableList)(Prelude.flip($$delete(__dict_Eq_28)));
};
var concatMap = function (f) {
    return function (_28) {
        if (_28 instanceof Nil) {
            return Nil.value;
        };
        if (_28 instanceof Cons) {
            return Prelude["<>"](semigroupList)(f(_28.value0))(concatMap(f)(_28.value1));
        };
        throw new Error("Failed pattern match: " + [ f.constructor.name, _28.constructor.name ]);
    };
};
var catMaybes = mapMaybe(Prelude.id(Prelude.categoryFn));
var applyList = new Prelude.Apply(function () {
    return functorList;
}, function (_69) {
    return function (xs) {
        if (_69 instanceof Nil) {
            return Nil.value;
        };
        if (_69 instanceof Cons) {
            return Prelude["<>"](semigroupList)(Prelude["<$>"](functorList)(_69.value0)(xs))(Prelude["<*>"](applyList)(_69.value1)(xs));
        };
        throw new Error("Failed pattern match: " + [ _69.constructor.name, xs.constructor.name ]);
    };
});
var bindList = new Prelude.Bind(function () {
    return applyList;
}, Prelude.flip(concatMap));
var concat = function (_2) {
    return Prelude[">>="](bindList)(_2)(Prelude.id(Prelude.categoryFn));
};
var applicativeList = new Prelude.Applicative(function () {
    return applyList;
}, function (a) {
    return new Cons(a, Nil.value);
});
var monadList = new Prelude.Monad(function () {
    return applicativeList;
}, function () {
    return bindList;
});
var alterAt = function (_26) {
    return function (f) {
        return function (_27) {
            if (_26 === 0 && _27 instanceof Cons) {
                return Data_Maybe.Just.create((function () {
                    var _310 = f(_27.value0);
                    if (_310 instanceof Data_Maybe.Nothing) {
                        return _27.value1;
                    };
                    if (_310 instanceof Data_Maybe.Just) {
                        return new Cons(_310.value0, _27.value1);
                    };
                    throw new Error("Failed pattern match: " + [ _310.constructor.name ]);
                })());
            };
            if (_27 instanceof Cons) {
                return Prelude["<$>"](Data_Maybe.functorMaybe)(Cons.create(_27.value0))(alterAt(_26 - 1)(f)(_27.value1));
            };
            return Data_Maybe.Nothing.value;
        };
    };
};
var modifyAt = function (n) {
    return function (f) {
        return alterAt(n)(function (_319) {
            return Data_Maybe.Just.create(f(_319));
        });
    };
};
var altList = new Control_Alt.Alt(function () {
    return functorList;
}, Prelude.append(semigroupList));
var plusList = new Control_Plus.Plus(function () {
    return altList;
}, Nil.value);
var alternativeList = new Control_Alternative.Alternative(function () {
    return plusList;
}, function () {
    return applicativeList;
});
var monadPlusList = new Control_MonadPlus.MonadPlus(function () {
    return alternativeList;
}, function () {
    return monadList;
});
module.exports = {
    Nil: Nil, 
    Cons: Cons, 
    fromList: fromList, 
    toList: toList, 
    foldM: foldM, 
    unzip: unzip, 
    zip: zip, 
    zipWithA: zipWithA, 
    zipWith: zipWith, 
    intersectBy: intersectBy, 
    intersect: intersect, 
    "\\\\": $bslash$bslash, 
    deleteBy: deleteBy, 
    "delete": $$delete, 
    unionBy: unionBy, 
    union: union, 
    nubBy: nubBy, 
    nub: nub, 
    groupBy: groupBy, 
    "group'": group$prime, 
    group: group, 
    span: span, 
    dropWhile: dropWhile, 
    drop: drop, 
    takeWhile: takeWhile, 
    take: take, 
    slice: slice, 
    sortBy: sortBy, 
    sort: sort, 
    catMaybes: catMaybes, 
    mapMaybe: mapMaybe, 
    filterM: filterM, 
    filter: filter, 
    concatMap: concatMap, 
    concat: concat, 
    reverse: reverse, 
    alterAt: alterAt, 
    modifyAt: modifyAt, 
    updateAt: updateAt, 
    deleteAt: deleteAt, 
    insertAt: insertAt, 
    findLastIndex: findLastIndex, 
    findIndex: findIndex, 
    elemLastIndex: elemLastIndex, 
    elemIndex: elemIndex, 
    index: index, 
    "!!": $bang$bang, 
    uncons: uncons, 
    init: init, 
    tail: tail, 
    last: last, 
    head: head, 
    insertBy: insertBy, 
    insert: insert, 
    snoc: snoc, 
    ":": $colon, 
    length: length, 
    "null": $$null, 
    many: many, 
    some: some, 
    replicateM: replicateM, 
    replicate: replicate, 
    range: range, 
    "..": $dot$dot, 
    singleton: singleton, 
    fromFoldable: fromFoldable, 
    toUnfoldable: toUnfoldable, 
    showList: showList, 
    eqList: eqList, 
    ordList: ordList, 
    semigroupList: semigroupList, 
    monoidList: monoidList, 
    functorList: functorList, 
    foldableList: foldableList, 
    unfoldableList: unfoldableList, 
    traversableList: traversableList, 
    applyList: applyList, 
    applicativeList: applicativeList, 
    bindList: bindList, 
    monadList: monadList, 
    altList: altList, 
    plusList: plusList, 
    alternativeList: alternativeList, 
    monadPlusList: monadPlusList
};

},{"Control.Alt":"/Users/maximko/Projects/mine/guppi/output/Control.Alt/index.js","Control.Alternative":"/Users/maximko/Projects/mine/guppi/output/Control.Alternative/index.js","Control.Lazy":"/Users/maximko/Projects/mine/guppi/output/Control.Lazy/index.js","Control.MonadPlus":"/Users/maximko/Projects/mine/guppi/output/Control.MonadPlus/index.js","Control.Plus":"/Users/maximko/Projects/mine/guppi/output/Control.Plus/index.js","Data.Foldable":"/Users/maximko/Projects/mine/guppi/output/Data.Foldable/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Traversable":"/Users/maximko/Projects/mine/guppi/output/Data.Traversable/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Data.Unfoldable":"/Users/maximko/Projects/mine/guppi/output/Data.Unfoldable/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Map/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Foldable = require("Data.Foldable");
var Data_List = require("Data.List");
var Data_Maybe = require("Data.Maybe");
var Data_Maybe_Unsafe = require("Data.Maybe.Unsafe");
var Data_Monoid = require("Data.Monoid");
var Data_Traversable = require("Data.Traversable");
var Data_Tuple = require("Data.Tuple");
var Leaf = (function () {
    function Leaf() {

    };
    Leaf.value = new Leaf();
    return Leaf;
})();
var Two = (function () {
    function Two(value0, value1, value2, value3) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
        this.value3 = value3;
    };
    Two.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return function (value3) {
                    return new Two(value0, value1, value2, value3);
                };
            };
        };
    };
    return Two;
})();
var Three = (function () {
    function Three(value0, value1, value2, value3, value4, value5, value6) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
        this.value3 = value3;
        this.value4 = value4;
        this.value5 = value5;
        this.value6 = value6;
    };
    Three.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return function (value3) {
                    return function (value4) {
                        return function (value5) {
                            return function (value6) {
                                return new Three(value0, value1, value2, value3, value4, value5, value6);
                            };
                        };
                    };
                };
            };
        };
    };
    return Three;
})();
var TwoLeft = (function () {
    function TwoLeft(value0, value1, value2) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
    };
    TwoLeft.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return new TwoLeft(value0, value1, value2);
            };
        };
    };
    return TwoLeft;
})();
var TwoRight = (function () {
    function TwoRight(value0, value1, value2) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
    };
    TwoRight.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return new TwoRight(value0, value1, value2);
            };
        };
    };
    return TwoRight;
})();
var ThreeLeft = (function () {
    function ThreeLeft(value0, value1, value2, value3, value4, value5) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
        this.value3 = value3;
        this.value4 = value4;
        this.value5 = value5;
    };
    ThreeLeft.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return function (value3) {
                    return function (value4) {
                        return function (value5) {
                            return new ThreeLeft(value0, value1, value2, value3, value4, value5);
                        };
                    };
                };
            };
        };
    };
    return ThreeLeft;
})();
var ThreeMiddle = (function () {
    function ThreeMiddle(value0, value1, value2, value3, value4, value5) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
        this.value3 = value3;
        this.value4 = value4;
        this.value5 = value5;
    };
    ThreeMiddle.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return function (value3) {
                    return function (value4) {
                        return function (value5) {
                            return new ThreeMiddle(value0, value1, value2, value3, value4, value5);
                        };
                    };
                };
            };
        };
    };
    return ThreeMiddle;
})();
var ThreeRight = (function () {
    function ThreeRight(value0, value1, value2, value3, value4, value5) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
        this.value3 = value3;
        this.value4 = value4;
        this.value5 = value5;
    };
    ThreeRight.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return function (value3) {
                    return function (value4) {
                        return function (value5) {
                            return new ThreeRight(value0, value1, value2, value3, value4, value5);
                        };
                    };
                };
            };
        };
    };
    return ThreeRight;
})();
var KickUp = (function () {
    function KickUp(value0, value1, value2, value3) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
        this.value3 = value3;
    };
    KickUp.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return function (value3) {
                    return new KickUp(value0, value1, value2, value3);
                };
            };
        };
    };
    return KickUp;
})();
var values = function (_9) {
    if (_9 instanceof Leaf) {
        return Data_List.Nil.value;
    };
    if (_9 instanceof Two) {
        return Prelude["++"](Data_List.semigroupList)(values(_9.value0))(Prelude["++"](Data_List.semigroupList)(Prelude.pure(Data_List.applicativeList)(_9.value2))(values(_9.value3)));
    };
    if (_9 instanceof Three) {
        return Prelude["++"](Data_List.semigroupList)(values(_9.value0))(Prelude["++"](Data_List.semigroupList)(Prelude.pure(Data_List.applicativeList)(_9.value2))(Prelude["++"](Data_List.semigroupList)(values(_9.value3))(Prelude["++"](Data_List.semigroupList)(Prelude.pure(Data_List.applicativeList)(_9.value5))(values(_9.value6)))));
    };
    throw new Error("Failed pattern match: " + [ _9.constructor.name ]);
};
var toList = function (_7) {
    if (_7 instanceof Leaf) {
        return Data_List.Nil.value;
    };
    if (_7 instanceof Two) {
        return Prelude["++"](Data_List.semigroupList)(toList(_7.value0))(Prelude["++"](Data_List.semigroupList)(Prelude.pure(Data_List.applicativeList)(new Data_Tuple.Tuple(_7.value1, _7.value2)))(toList(_7.value3)));
    };
    if (_7 instanceof Three) {
        return Prelude["++"](Data_List.semigroupList)(toList(_7.value0))(Prelude["++"](Data_List.semigroupList)(Prelude.pure(Data_List.applicativeList)(new Data_Tuple.Tuple(_7.value1, _7.value2)))(Prelude["++"](Data_List.semigroupList)(toList(_7.value3))(Prelude["++"](Data_List.semigroupList)(Prelude.pure(Data_List.applicativeList)(new Data_Tuple.Tuple(_7.value4, _7.value5)))(toList(_7.value6)))));
    };
    throw new Error("Failed pattern match: " + [ _7.constructor.name ]);
};
var size = function (_565) {
    return Data_List.length(values(_565));
};
var singleton = function (k) {
    return function (v) {
        return new Two(Leaf.value, k, v, Leaf.value);
    };
};
var showTree = function (__dict_Show_0) {
    return function (__dict_Show_1) {
        return function (_2) {
            if (_2 instanceof Leaf) {
                return "Leaf";
            };
            if (_2 instanceof Two) {
                return "Two (" + (showTree(__dict_Show_0)(__dict_Show_1)(_2.value0) + (") (" + (Prelude.show(__dict_Show_0)(_2.value1) + (") (" + (Prelude.show(__dict_Show_1)(_2.value2) + (") (" + (showTree(__dict_Show_0)(__dict_Show_1)(_2.value3) + ")")))))));
            };
            if (_2 instanceof Three) {
                return "Three (" + (showTree(__dict_Show_0)(__dict_Show_1)(_2.value0) + (") (" + (Prelude.show(__dict_Show_0)(_2.value1) + (") (" + (Prelude.show(__dict_Show_1)(_2.value2) + (") (" + (showTree(__dict_Show_0)(__dict_Show_1)(_2.value3) + (") (" + (Prelude.show(__dict_Show_0)(_2.value4) + (") (" + (Prelude.show(__dict_Show_1)(_2.value5) + (") (" + (showTree(__dict_Show_0)(__dict_Show_1)(_2.value6) + ")")))))))))))));
            };
            throw new Error("Failed pattern match: " + [ _2.constructor.name ]);
        };
    };
};
var showMap = function (__dict_Show_2) {
    return function (__dict_Show_3) {
        return new Prelude.Show(function (m) {
            return "fromList " + Prelude.show(Data_List.showList(Data_Tuple.showTuple(__dict_Show_2)(__dict_Show_3)))(toList(m));
        });
    };
};
var lookup = function (__copy___dict_Ord_6) {
    return function (__copy_k) {
        return function (__copy__4) {
            var __dict_Ord_6 = __copy___dict_Ord_6;
            var k = __copy_k;
            var _4 = __copy__4;
            tco: while (true) {
                if (_4 instanceof Leaf) {
                    return Data_Maybe.Nothing.value;
                };
                var k_1 = k;
                if (_4 instanceof Two && Prelude["=="](__dict_Ord_6["__superclass_Prelude.Eq_0"]())(k_1)(_4.value1)) {
                    return new Data_Maybe.Just(_4.value2);
                };
                var k_1 = k;
                if (_4 instanceof Two && Prelude["<"](__dict_Ord_6)(k_1)(_4.value1)) {
                    var __tco___dict_Ord_6 = __dict_Ord_6;
                    var __tco__4 = _4.value0;
                    __dict_Ord_6 = __tco___dict_Ord_6;
                    k = k_1;
                    _4 = __tco__4;
                    continue tco;
                };
                var k_1 = k;
                if (_4 instanceof Two) {
                    var __tco___dict_Ord_6 = __dict_Ord_6;
                    var __tco__4 = _4.value3;
                    __dict_Ord_6 = __tco___dict_Ord_6;
                    k = k_1;
                    _4 = __tco__4;
                    continue tco;
                };
                var k_1 = k;
                if (_4 instanceof Three && Prelude["=="](__dict_Ord_6["__superclass_Prelude.Eq_0"]())(k_1)(_4.value1)) {
                    return new Data_Maybe.Just(_4.value2);
                };
                var k_1 = k;
                if (_4 instanceof Three && Prelude["=="](__dict_Ord_6["__superclass_Prelude.Eq_0"]())(k_1)(_4.value4)) {
                    return new Data_Maybe.Just(_4.value5);
                };
                var k_1 = k;
                if (_4 instanceof Three && Prelude["<"](__dict_Ord_6)(k_1)(_4.value1)) {
                    var __tco___dict_Ord_6 = __dict_Ord_6;
                    var __tco__4 = _4.value0;
                    __dict_Ord_6 = __tco___dict_Ord_6;
                    k = k_1;
                    _4 = __tco__4;
                    continue tco;
                };
                var k_1 = k;
                if (_4 instanceof Three && (Prelude["<"](__dict_Ord_6)(_4.value1)(k_1) && Prelude["<="](__dict_Ord_6)(k_1)(_4.value4))) {
                    var __tco___dict_Ord_6 = __dict_Ord_6;
                    var __tco__4 = _4.value3;
                    __dict_Ord_6 = __tco___dict_Ord_6;
                    k = k_1;
                    _4 = __tco__4;
                    continue tco;
                };
                if (_4 instanceof Three) {
                    var __tco___dict_Ord_6 = __dict_Ord_6;
                    var __tco_k = k;
                    var __tco__4 = _4.value6;
                    __dict_Ord_6 = __tco___dict_Ord_6;
                    k = __tco_k;
                    _4 = __tco__4;
                    continue tco;
                };
                throw new Error("Failed pattern match: " + [ k.constructor.name, _4.constructor.name ]);
            };
        };
    };
};
var member = function (__dict_Ord_7) {
    return function (k) {
        return function (m) {
            return Data_Maybe.isJust(lookup(__dict_Ord_7)(k)(m));
        };
    };
};
var keys = function (_8) {
    if (_8 instanceof Leaf) {
        return Data_List.Nil.value;
    };
    if (_8 instanceof Two) {
        return Prelude["++"](Data_List.semigroupList)(keys(_8.value0))(Prelude["++"](Data_List.semigroupList)(Prelude.pure(Data_List.applicativeList)(_8.value1))(keys(_8.value3)));
    };
    if (_8 instanceof Three) {
        return Prelude["++"](Data_List.semigroupList)(keys(_8.value0))(Prelude["++"](Data_List.semigroupList)(Prelude.pure(Data_List.applicativeList)(_8.value1))(Prelude["++"](Data_List.semigroupList)(keys(_8.value3))(Prelude["++"](Data_List.semigroupList)(Prelude.pure(Data_List.applicativeList)(_8.value4))(keys(_8.value6)))));
    };
    throw new Error("Failed pattern match: " + [ _8.constructor.name ]);
};
var isEmpty = function (_3) {
    if (_3 instanceof Leaf) {
        return true;
    };
    return false;
};
var functorMap = new Prelude.Functor(function (f) {
    return function (_10) {
        if (_10 instanceof Leaf) {
            return Leaf.value;
        };
        if (_10 instanceof Two) {
            return new Two(Prelude.map(functorMap)(f)(_10.value0), _10.value1, f(_10.value2), Prelude.map(functorMap)(f)(_10.value3));
        };
        if (_10 instanceof Three) {
            return new Three(Prelude.map(functorMap)(f)(_10.value0), _10.value1, f(_10.value2), Prelude.map(functorMap)(f)(_10.value3), _10.value4, f(_10.value5), Prelude.map(functorMap)(f)(_10.value6));
        };
        throw new Error("Failed pattern match: " + [ f.constructor.name, _10.constructor.name ]);
    };
});
var fromZipper = function (__copy___dict_Ord_8) {
    return function (__copy__5) {
        return function (__copy__6) {
            var __dict_Ord_8 = __copy___dict_Ord_8;
            var _5 = __copy__5;
            var _6 = __copy__6;
            tco: while (true) {
                if (_5 instanceof Data_List.Nil) {
                    return _6;
                };
                if (_5 instanceof Data_List.Cons && _5.value0 instanceof TwoLeft) {
                    var __tco___dict_Ord_8 = __dict_Ord_8;
                    var __tco__5 = _5.value1;
                    var __tco__6 = new Two(_6, _5.value0.value0, _5.value0.value1, _5.value0.value2);
                    __dict_Ord_8 = __tco___dict_Ord_8;
                    _5 = __tco__5;
                    _6 = __tco__6;
                    continue tco;
                };
                if (_5 instanceof Data_List.Cons && _5.value0 instanceof TwoRight) {
                    var __tco___dict_Ord_8 = __dict_Ord_8;
                    var __tco__5 = _5.value1;
                    var __tco__6 = new Two(_5.value0.value0, _5.value0.value1, _5.value0.value2, _6);
                    __dict_Ord_8 = __tco___dict_Ord_8;
                    _5 = __tco__5;
                    _6 = __tco__6;
                    continue tco;
                };
                if (_5 instanceof Data_List.Cons && _5.value0 instanceof ThreeLeft) {
                    var __tco___dict_Ord_8 = __dict_Ord_8;
                    var __tco__5 = _5.value1;
                    var __tco__6 = new Three(_6, _5.value0.value0, _5.value0.value1, _5.value0.value2, _5.value0.value3, _5.value0.value4, _5.value0.value5);
                    __dict_Ord_8 = __tco___dict_Ord_8;
                    _5 = __tco__5;
                    _6 = __tco__6;
                    continue tco;
                };
                if (_5 instanceof Data_List.Cons && _5.value0 instanceof ThreeMiddle) {
                    var __tco___dict_Ord_8 = __dict_Ord_8;
                    var __tco__5 = _5.value1;
                    var __tco__6 = new Three(_5.value0.value0, _5.value0.value1, _5.value0.value2, _6, _5.value0.value3, _5.value0.value4, _5.value0.value5);
                    __dict_Ord_8 = __tco___dict_Ord_8;
                    _5 = __tco__5;
                    _6 = __tco__6;
                    continue tco;
                };
                if (_5 instanceof Data_List.Cons && _5.value0 instanceof ThreeRight) {
                    var __tco___dict_Ord_8 = __dict_Ord_8;
                    var __tco__5 = _5.value1;
                    var __tco__6 = new Three(_5.value0.value0, _5.value0.value1, _5.value0.value2, _5.value0.value3, _5.value0.value4, _5.value0.value5, _6);
                    __dict_Ord_8 = __tco___dict_Ord_8;
                    _5 = __tco__5;
                    _6 = __tco__6;
                    continue tco;
                };
                throw new Error("Failed pattern match: " + [ _5.constructor.name, _6.constructor.name ]);
            };
        };
    };
};
var insert = function (__dict_Ord_9) {
    var up = function (__copy__13) {
        return function (__copy__14) {
            var _13 = __copy__13;
            var _14 = __copy__14;
            tco: while (true) {
                if (_13 instanceof Data_List.Nil) {
                    return new Two(_14.value0, _14.value1, _14.value2, _14.value3);
                };
                if (_13 instanceof Data_List.Cons && _13.value0 instanceof TwoLeft) {
                    return fromZipper(__dict_Ord_9)(_13.value1)(new Three(_14.value0, _14.value1, _14.value2, _14.value3, _13.value0.value0, _13.value0.value1, _13.value0.value2));
                };
                if (_13 instanceof Data_List.Cons && _13.value0 instanceof TwoRight) {
                    return fromZipper(__dict_Ord_9)(_13.value1)(new Three(_13.value0.value0, _13.value0.value1, _13.value0.value2, _14.value0, _14.value1, _14.value2, _14.value3));
                };
                if (_13 instanceof Data_List.Cons && _13.value0 instanceof ThreeLeft) {
                    var __tco__13 = _13.value1;
                    var __tco__14 = new KickUp(new Two(_14.value0, _14.value1, _14.value2, _14.value3), _13.value0.value0, _13.value0.value1, new Two(_13.value0.value2, _13.value0.value3, _13.value0.value4, _13.value0.value5));
                    _13 = __tco__13;
                    _14 = __tco__14;
                    continue tco;
                };
                if (_13 instanceof Data_List.Cons && _13.value0 instanceof ThreeMiddle) {
                    var __tco__13 = _13.value1;
                    var __tco__14 = new KickUp(new Two(_13.value0.value0, _13.value0.value1, _13.value0.value2, _14.value0), _14.value1, _14.value2, new Two(_14.value3, _13.value0.value3, _13.value0.value4, _13.value0.value5));
                    _13 = __tco__13;
                    _14 = __tco__14;
                    continue tco;
                };
                if (_13 instanceof Data_List.Cons && _13.value0 instanceof ThreeRight) {
                    var __tco__13 = _13.value1;
                    var __tco__14 = new KickUp(new Two(_13.value0.value0, _13.value0.value1, _13.value0.value2, _13.value0.value3), _13.value0.value4, _13.value0.value5, new Two(_14.value0, _14.value1, _14.value2, _14.value3));
                    _13 = __tco__13;
                    _14 = __tco__14;
                    continue tco;
                };
                throw new Error("Failed pattern match at Data.Map line 150, column 1 - line 151, column 1: " + [ _13.constructor.name, _14.constructor.name ]);
            };
        };
    };
    var down = function (__copy_ctx) {
        return function (__copy_k) {
            return function (__copy_v) {
                return function (__copy__12) {
                    var ctx = __copy_ctx;
                    var k = __copy_k;
                    var v = __copy_v;
                    var _12 = __copy__12;
                    tco: while (true) {
                        var ctx_1 = ctx;
                        var k_1 = k;
                        var v_1 = v;
                        if (_12 instanceof Leaf) {
                            return up(ctx_1)(new KickUp(Leaf.value, k_1, v_1, Leaf.value));
                        };
                        var ctx_1 = ctx;
                        var k_1 = k;
                        var v_1 = v;
                        if (_12 instanceof Two && Prelude["=="](__dict_Ord_9["__superclass_Prelude.Eq_0"]())(k_1)(_12.value1)) {
                            return fromZipper(__dict_Ord_9)(ctx_1)(new Two(_12.value0, k_1, v_1, _12.value3));
                        };
                        var ctx_1 = ctx;
                        var k_1 = k;
                        var v_1 = v;
                        if (_12 instanceof Two && Prelude["<"](__dict_Ord_9)(k_1)(_12.value1)) {
                            var __tco_ctx = new Data_List.Cons(new TwoLeft(_12.value1, _12.value2, _12.value3), ctx_1);
                            var __tco__12 = _12.value0;
                            ctx = __tco_ctx;
                            k = k_1;
                            v = v_1;
                            _12 = __tco__12;
                            continue tco;
                        };
                        var ctx_1 = ctx;
                        var k_1 = k;
                        var v_1 = v;
                        if (_12 instanceof Two) {
                            var __tco_ctx = new Data_List.Cons(new TwoRight(_12.value0, _12.value1, _12.value2), ctx_1);
                            var __tco__12 = _12.value3;
                            ctx = __tco_ctx;
                            k = k_1;
                            v = v_1;
                            _12 = __tco__12;
                            continue tco;
                        };
                        var ctx_1 = ctx;
                        var k_1 = k;
                        var v_1 = v;
                        if (_12 instanceof Three && Prelude["=="](__dict_Ord_9["__superclass_Prelude.Eq_0"]())(k_1)(_12.value1)) {
                            return fromZipper(__dict_Ord_9)(ctx_1)(new Three(_12.value0, k_1, v_1, _12.value3, _12.value4, _12.value5, _12.value6));
                        };
                        var ctx_1 = ctx;
                        var k_1 = k;
                        var v_1 = v;
                        if (_12 instanceof Three && Prelude["=="](__dict_Ord_9["__superclass_Prelude.Eq_0"]())(k_1)(_12.value4)) {
                            return fromZipper(__dict_Ord_9)(ctx_1)(new Three(_12.value0, _12.value1, _12.value2, _12.value3, k_1, v_1, _12.value6));
                        };
                        var ctx_1 = ctx;
                        var k_1 = k;
                        var v_1 = v;
                        if (_12 instanceof Three && Prelude["<"](__dict_Ord_9)(k_1)(_12.value1)) {
                            var __tco_ctx = new Data_List.Cons(new ThreeLeft(_12.value1, _12.value2, _12.value3, _12.value4, _12.value5, _12.value6), ctx_1);
                            var __tco__12 = _12.value0;
                            ctx = __tco_ctx;
                            k = k_1;
                            v = v_1;
                            _12 = __tco__12;
                            continue tco;
                        };
                        var ctx_1 = ctx;
                        var k_1 = k;
                        var v_1 = v;
                        if (_12 instanceof Three && (Prelude["<"](__dict_Ord_9)(_12.value1)(k_1) && Prelude["<="](__dict_Ord_9)(k_1)(_12.value4))) {
                            var __tco_ctx = new Data_List.Cons(new ThreeMiddle(_12.value0, _12.value1, _12.value2, _12.value4, _12.value5, _12.value6), ctx_1);
                            var __tco__12 = _12.value3;
                            ctx = __tco_ctx;
                            k = k_1;
                            v = v_1;
                            _12 = __tco__12;
                            continue tco;
                        };
                        if (_12 instanceof Three) {
                            var __tco_ctx = new Data_List.Cons(new ThreeRight(_12.value0, _12.value1, _12.value2, _12.value3, _12.value4, _12.value5), ctx);
                            var __tco_k = k;
                            var __tco_v = v;
                            var __tco__12 = _12.value6;
                            ctx = __tco_ctx;
                            k = __tco_k;
                            v = __tco_v;
                            _12 = __tco__12;
                            continue tco;
                        };
                        throw new Error("Failed pattern match at Data.Map line 150, column 1 - line 151, column 1: " + [ ctx.constructor.name, k.constructor.name, v.constructor.name, _12.constructor.name ]);
                    };
                };
            };
        };
    };
    return down(Data_List.Nil.value);
};
var foldableMap = new Data_Foldable.Foldable(function (__dict_Monoid_10) {
    return function (f) {
        return function (m) {
            return Data_Foldable.foldMap(Data_List.foldableList)(__dict_Monoid_10)(f)(values(m));
        };
    };
}, function (f) {
    return function (z) {
        return function (m) {
            return Data_Foldable.foldl(Data_List.foldableList)(f)(z)(values(m));
        };
    };
}, function (f) {
    return function (z) {
        return function (m) {
            return Data_Foldable.foldr(Data_List.foldableList)(f)(z)(values(m));
        };
    };
});
var eqMap = function (__dict_Eq_11) {
    return function (__dict_Eq_12) {
        return new Prelude.Eq(function (m1) {
            return function (m2) {
                return Prelude["=="](Data_List.eqList(Data_Tuple.eqTuple(__dict_Eq_11)(__dict_Eq_12)))(toList(m1))(toList(m2));
            };
        });
    };
};
var ordMap = function (__dict_Ord_4) {
    return function (__dict_Ord_5) {
        return new Prelude.Ord(function () {
            return eqMap(__dict_Ord_4["__superclass_Prelude.Eq_0"]())(__dict_Ord_5["__superclass_Prelude.Eq_0"]());
        }, function (m1) {
            return function (m2) {
                return Prelude.compare(Data_List.ordList(Data_Tuple.ordTuple(__dict_Ord_4)(__dict_Ord_5)))(toList(m1))(toList(m2));
            };
        });
    };
};
var empty = Leaf.value;
var fromFoldable = function (__dict_Ord_13) {
    return function (__dict_Foldable_14) {
        return Data_Foldable.foldl(__dict_Foldable_14)(function (m) {
            return function (_0) {
                return insert(__dict_Ord_13)(_0.value0)(_0.value1)(m);
            };
        })(empty);
    };
};
var fromList = function (__dict_Ord_15) {
    return fromFoldable(__dict_Ord_15)(Data_List.foldableList);
};
var $$delete = function (__dict_Ord_17) {
    var up = function (__copy__16) {
        return function (__copy__17) {
            var _16 = __copy__16;
            var _17 = __copy__17;
            tco: while (true) {
                if (_16 instanceof Data_List.Nil) {
                    return _17;
                };
                if (_16 instanceof Data_List.Cons && (_16.value0 instanceof TwoLeft && (_16.value0.value2 instanceof Leaf && _17 instanceof Leaf))) {
                    return fromZipper(__dict_Ord_17)(_16.value1)(new Two(Leaf.value, _16.value0.value0, _16.value0.value1, Leaf.value));
                };
                if (_16 instanceof Data_List.Cons && (_16.value0 instanceof TwoRight && (_16.value0.value0 instanceof Leaf && _17 instanceof Leaf))) {
                    return fromZipper(__dict_Ord_17)(_16.value1)(new Two(Leaf.value, _16.value0.value1, _16.value0.value2, Leaf.value));
                };
                if (_16 instanceof Data_List.Cons && (_16.value0 instanceof TwoLeft && _16.value0.value2 instanceof Two)) {
                    var __tco__16 = _16.value1;
                    var __tco__17 = new Three(_17, _16.value0.value0, _16.value0.value1, _16.value0.value2.value0, _16.value0.value2.value1, _16.value0.value2.value2, _16.value0.value2.value3);
                    _16 = __tco__16;
                    _17 = __tco__17;
                    continue tco;
                };
                if (_16 instanceof Data_List.Cons && (_16.value0 instanceof TwoRight && _16.value0.value0 instanceof Two)) {
                    var __tco__16 = _16.value1;
                    var __tco__17 = new Three(_16.value0.value0.value0, _16.value0.value0.value1, _16.value0.value0.value2, _16.value0.value0.value3, _16.value0.value1, _16.value0.value2, _17);
                    _16 = __tco__16;
                    _17 = __tco__17;
                    continue tco;
                };
                if (_16 instanceof Data_List.Cons && (_16.value0 instanceof TwoLeft && _16.value0.value2 instanceof Three)) {
                    return fromZipper(__dict_Ord_17)(_16.value1)(new Two(new Two(_17, _16.value0.value0, _16.value0.value1, _16.value0.value2.value0), _16.value0.value2.value1, _16.value0.value2.value2, new Two(_16.value0.value2.value3, _16.value0.value2.value4, _16.value0.value2.value5, _16.value0.value2.value6)));
                };
                if (_16 instanceof Data_List.Cons && (_16.value0 instanceof TwoRight && _16.value0.value0 instanceof Three)) {
                    return fromZipper(__dict_Ord_17)(_16.value1)(new Two(new Two(_16.value0.value0.value0, _16.value0.value0.value1, _16.value0.value0.value2, _16.value0.value0.value3), _16.value0.value0.value4, _16.value0.value0.value5, new Two(_16.value0.value0.value6, _16.value0.value1, _16.value0.value2, _17)));
                };
                if (_16 instanceof Data_List.Cons && (_16.value0 instanceof ThreeLeft && (_16.value0.value2 instanceof Leaf && (_16.value0.value5 instanceof Leaf && _17 instanceof Leaf)))) {
                    return fromZipper(__dict_Ord_17)(_16.value1)(new Three(Leaf.value, _16.value0.value0, _16.value0.value1, Leaf.value, _16.value0.value3, _16.value0.value4, Leaf.value));
                };
                if (_16 instanceof Data_List.Cons && (_16.value0 instanceof ThreeMiddle && (_16.value0.value0 instanceof Leaf && (_16.value0.value5 instanceof Leaf && _17 instanceof Leaf)))) {
                    return fromZipper(__dict_Ord_17)(_16.value1)(new Three(Leaf.value, _16.value0.value1, _16.value0.value2, Leaf.value, _16.value0.value3, _16.value0.value4, Leaf.value));
                };
                if (_16 instanceof Data_List.Cons && (_16.value0 instanceof ThreeRight && (_16.value0.value0 instanceof Leaf && (_16.value0.value3 instanceof Leaf && _17 instanceof Leaf)))) {
                    return fromZipper(__dict_Ord_17)(_16.value1)(new Three(Leaf.value, _16.value0.value1, _16.value0.value2, Leaf.value, _16.value0.value4, _16.value0.value5, Leaf.value));
                };
                if (_16 instanceof Data_List.Cons && (_16.value0 instanceof ThreeLeft && _16.value0.value2 instanceof Two)) {
                    return fromZipper(__dict_Ord_17)(_16.value1)(new Two(new Three(_17, _16.value0.value0, _16.value0.value1, _16.value0.value2.value0, _16.value0.value2.value1, _16.value0.value2.value2, _16.value0.value2.value3), _16.value0.value3, _16.value0.value4, _16.value0.value5));
                };
                if (_16 instanceof Data_List.Cons && (_16.value0 instanceof ThreeMiddle && _16.value0.value0 instanceof Two)) {
                    return fromZipper(__dict_Ord_17)(_16.value1)(new Two(new Three(_16.value0.value0.value0, _16.value0.value0.value1, _16.value0.value0.value2, _16.value0.value0.value3, _16.value0.value1, _16.value0.value2, _17), _16.value0.value3, _16.value0.value4, _16.value0.value5));
                };
                if (_16 instanceof Data_List.Cons && (_16.value0 instanceof ThreeMiddle && _16.value0.value5 instanceof Two)) {
                    return fromZipper(__dict_Ord_17)(_16.value1)(new Two(_16.value0.value0, _16.value0.value1, _16.value0.value2, new Three(_17, _16.value0.value3, _16.value0.value4, _16.value0.value5.value0, _16.value0.value5.value1, _16.value0.value5.value2, _16.value0.value5.value3)));
                };
                if (_16 instanceof Data_List.Cons && (_16.value0 instanceof ThreeRight && _16.value0.value3 instanceof Two)) {
                    return fromZipper(__dict_Ord_17)(_16.value1)(new Two(_16.value0.value0, _16.value0.value1, _16.value0.value2, new Three(_16.value0.value3.value0, _16.value0.value3.value1, _16.value0.value3.value2, _16.value0.value3.value3, _16.value0.value4, _16.value0.value5, _17)));
                };
                if (_16 instanceof Data_List.Cons && (_16.value0 instanceof ThreeLeft && _16.value0.value2 instanceof Three)) {
                    return fromZipper(__dict_Ord_17)(_16.value1)(new Three(new Two(_17, _16.value0.value0, _16.value0.value1, _16.value0.value2.value0), _16.value0.value2.value1, _16.value0.value2.value2, new Two(_16.value0.value2.value3, _16.value0.value2.value4, _16.value0.value2.value5, _16.value0.value2.value6), _16.value0.value3, _16.value0.value4, _16.value0.value5));
                };
                if (_16 instanceof Data_List.Cons && (_16.value0 instanceof ThreeMiddle && _16.value0.value0 instanceof Three)) {
                    return fromZipper(__dict_Ord_17)(_16.value1)(new Three(new Two(_16.value0.value0.value0, _16.value0.value0.value1, _16.value0.value0.value2, _16.value0.value0.value3), _16.value0.value0.value4, _16.value0.value0.value5, new Two(_16.value0.value0.value6, _16.value0.value1, _16.value0.value2, _17), _16.value0.value3, _16.value0.value4, _16.value0.value5));
                };
                if (_16 instanceof Data_List.Cons && (_16.value0 instanceof ThreeMiddle && _16.value0.value5 instanceof Three)) {
                    return fromZipper(__dict_Ord_17)(_16.value1)(new Three(_16.value0.value0, _16.value0.value1, _16.value0.value2, new Two(_17, _16.value0.value3, _16.value0.value4, _16.value0.value5.value0), _16.value0.value5.value1, _16.value0.value5.value2, new Two(_16.value0.value5.value3, _16.value0.value5.value4, _16.value0.value5.value5, _16.value0.value5.value6)));
                };
                if (_16 instanceof Data_List.Cons && (_16.value0 instanceof ThreeRight && _16.value0.value3 instanceof Three)) {
                    return fromZipper(__dict_Ord_17)(_16.value1)(new Three(_16.value0.value0, _16.value0.value1, _16.value0.value2, new Two(_16.value0.value3.value0, _16.value0.value3.value1, _16.value0.value3.value2, _16.value0.value3.value3), _16.value0.value3.value4, _16.value0.value3.value5, new Two(_16.value0.value3.value6, _16.value0.value4, _16.value0.value5, _17)));
                };
                return Data_Maybe_Unsafe.unsafeThrow("Impossible case in 'up'");
            };
        };
    };
    var removeMaxNode = function (__copy_ctx) {
        return function (__copy__19) {
            var ctx = __copy_ctx;
            var _19 = __copy__19;
            tco: while (true) {
                var ctx_1 = ctx;
                if (_19 instanceof Two && (_19.value0 instanceof Leaf && _19.value3 instanceof Leaf)) {
                    return up(ctx_1)(Leaf.value);
                };
                var ctx_1 = ctx;
                if (_19 instanceof Two) {
                    var __tco_ctx = new Data_List.Cons(new TwoRight(_19.value0, _19.value1, _19.value2), ctx_1);
                    var __tco__19 = _19.value3;
                    ctx = __tco_ctx;
                    _19 = __tco__19;
                    continue tco;
                };
                var ctx_1 = ctx;
                if (_19 instanceof Three && (_19.value0 instanceof Leaf && (_19.value3 instanceof Leaf && _19.value6 instanceof Leaf))) {
                    return up(new Data_List.Cons(new TwoRight(Leaf.value, _19.value1, _19.value2), ctx_1))(Leaf.value);
                };
                if (_19 instanceof Three) {
                    var __tco_ctx = new Data_List.Cons(new ThreeRight(_19.value0, _19.value1, _19.value2, _19.value3, _19.value4, _19.value5), ctx);
                    var __tco__19 = _19.value6;
                    ctx = __tco_ctx;
                    _19 = __tco__19;
                    continue tco;
                };
                if (_19 instanceof Leaf) {
                    return Data_Maybe_Unsafe.unsafeThrow("Impossible case in 'removeMaxNode'");
                };
                throw new Error("Failed pattern match at Data.Map line 173, column 1 - line 174, column 1: " + [ ctx.constructor.name, _19.constructor.name ]);
            };
        };
    };
    var maxNode = function (__copy__18) {
        var _18 = __copy__18;
        tco: while (true) {
            if (_18 instanceof Two && _18.value3 instanceof Leaf) {
                return {
                    key: _18.value1, 
                    value: _18.value2
                };
            };
            if (_18 instanceof Two) {
                var __tco__18 = _18.value3;
                _18 = __tco__18;
                continue tco;
            };
            if (_18 instanceof Three && _18.value6 instanceof Leaf) {
                return {
                    key: _18.value4, 
                    value: _18.value5
                };
            };
            if (_18 instanceof Three) {
                var __tco__18 = _18.value6;
                _18 = __tco__18;
                continue tco;
            };
            if (_18 instanceof Leaf) {
                return Data_Maybe_Unsafe.unsafeThrow("Impossible case in 'maxNode'");
            };
            throw new Error("Failed pattern match at Data.Map line 173, column 1 - line 174, column 1: " + [ _18.constructor.name ]);
        };
    };
    var down = function (__copy_ctx) {
        return function (__copy_k) {
            return function (__copy__15) {
                var ctx = __copy_ctx;
                var k = __copy_k;
                var _15 = __copy__15;
                tco: while (true) {
                    var ctx_1 = ctx;
                    if (_15 instanceof Leaf) {
                        return fromZipper(__dict_Ord_17)(ctx_1)(Leaf.value);
                    };
                    var ctx_1 = ctx;
                    var k_1 = k;
                    if (_15 instanceof Two && (_15.value0 instanceof Leaf && (_15.value3 instanceof Leaf && Prelude["=="](__dict_Ord_17["__superclass_Prelude.Eq_0"]())(k_1)(_15.value1)))) {
                        return up(ctx_1)(Leaf.value);
                    };
                    var ctx_1 = ctx;
                    var k_1 = k;
                    if (_15 instanceof Two) {
                        if (Prelude["=="](__dict_Ord_17["__superclass_Prelude.Eq_0"]())(k_1)(_15.value1)) {
                            var max = maxNode(_15.value0);
                            return removeMaxNode(new Data_List.Cons(new TwoLeft(max.key, max.value, _15.value3), ctx_1))(_15.value0);
                        };
                        if (Prelude["<"](__dict_Ord_17)(k_1)(_15.value1)) {
                            var __tco_ctx = new Data_List.Cons(new TwoLeft(_15.value1, _15.value2, _15.value3), ctx_1);
                            var __tco__15 = _15.value0;
                            ctx = __tco_ctx;
                            k = k_1;
                            _15 = __tco__15;
                            continue tco;
                        };
                        if (Prelude.otherwise) {
                            var __tco_ctx = new Data_List.Cons(new TwoRight(_15.value0, _15.value1, _15.value2), ctx_1);
                            var __tco__15 = _15.value3;
                            ctx = __tco_ctx;
                            k = k_1;
                            _15 = __tco__15;
                            continue tco;
                        };
                    };
                    var ctx_1 = ctx;
                    var k_1 = k;
                    if (_15 instanceof Three && (_15.value0 instanceof Leaf && (_15.value3 instanceof Leaf && _15.value6 instanceof Leaf))) {
                        if (Prelude["=="](__dict_Ord_17["__superclass_Prelude.Eq_0"]())(k_1)(_15.value1)) {
                            return fromZipper(__dict_Ord_17)(ctx_1)(new Two(Leaf.value, _15.value4, _15.value5, Leaf.value));
                        };
                        if (Prelude["=="](__dict_Ord_17["__superclass_Prelude.Eq_0"]())(k_1)(_15.value4)) {
                            return fromZipper(__dict_Ord_17)(ctx_1)(new Two(Leaf.value, _15.value1, _15.value2, Leaf.value));
                        };
                    };
                    if (_15 instanceof Three) {
                        if (Prelude["=="](__dict_Ord_17["__superclass_Prelude.Eq_0"]())(k)(_15.value1)) {
                            var max = maxNode(_15.value0);
                            return removeMaxNode(new Data_List.Cons(new ThreeLeft(max.key, max.value, _15.value3, _15.value4, _15.value5, _15.value6), ctx))(_15.value0);
                        };
                        if (Prelude["=="](__dict_Ord_17["__superclass_Prelude.Eq_0"]())(k)(_15.value4)) {
                            var max = maxNode(_15.value3);
                            return removeMaxNode(new Data_List.Cons(new ThreeMiddle(_15.value0, _15.value1, _15.value2, max.key, max.value, _15.value6), ctx))(_15.value3);
                        };
                        if (Prelude["<"](__dict_Ord_17)(k)(_15.value1)) {
                            var __tco_ctx = new Data_List.Cons(new ThreeLeft(_15.value1, _15.value2, _15.value3, _15.value4, _15.value5, _15.value6), ctx);
                            var __tco_k = k;
                            var __tco__15 = _15.value0;
                            ctx = __tco_ctx;
                            k = __tco_k;
                            _15 = __tco__15;
                            continue tco;
                        };
                        if (Prelude["<"](__dict_Ord_17)(_15.value1)(k) && Prelude["<"](__dict_Ord_17)(k)(_15.value4)) {
                            var __tco_ctx = new Data_List.Cons(new ThreeMiddle(_15.value0, _15.value1, _15.value2, _15.value4, _15.value5, _15.value6), ctx);
                            var __tco_k = k;
                            var __tco__15 = _15.value3;
                            ctx = __tco_ctx;
                            k = __tco_k;
                            _15 = __tco__15;
                            continue tco;
                        };
                        if (Prelude.otherwise) {
                            var __tco_ctx = new Data_List.Cons(new ThreeRight(_15.value0, _15.value1, _15.value2, _15.value3, _15.value4, _15.value5), ctx);
                            var __tco_k = k;
                            var __tco__15 = _15.value6;
                            ctx = __tco_ctx;
                            k = __tco_k;
                            _15 = __tco__15;
                            continue tco;
                        };
                    };
                    throw new Error("Failed pattern match at Data.Map line 173, column 1 - line 174, column 1: " + [ ctx.constructor.name, k.constructor.name, _15.constructor.name ]);
                };
            };
        };
    };
    return down(Data_List.Nil.value);
};
var checkValid = function (tree) {
    var allHeights = function (_11) {
        if (_11 instanceof Leaf) {
            return Prelude.pure(Data_List.applicativeList)(0);
        };
        if (_11 instanceof Two) {
            return Prelude.map(Data_List.functorList)(function (n) {
                return n + 1 | 0;
            })(Prelude["++"](Data_List.semigroupList)(allHeights(_11.value0))(allHeights(_11.value3)));
        };
        if (_11 instanceof Three) {
            return Prelude.map(Data_List.functorList)(function (n) {
                return n + 1 | 0;
            })(Prelude["++"](Data_List.semigroupList)(allHeights(_11.value0))(Prelude["++"](Data_List.semigroupList)(allHeights(_11.value3))(allHeights(_11.value6))));
        };
        throw new Error("Failed pattern match at Data.Map line 108, column 1 - line 109, column 1: " + [ _11.constructor.name ]);
    };
    return Data_List.length(Data_List.nub(Prelude.eqInt)(allHeights(tree))) === 1;
};
var alter = function (__dict_Ord_18) {
    return function (f) {
        return function (k) {
            return function (m) {
                var _553 = f(lookup(__dict_Ord_18)(k)(m));
                if (_553 instanceof Data_Maybe.Nothing) {
                    return $$delete(__dict_Ord_18)(k)(m);
                };
                if (_553 instanceof Data_Maybe.Just) {
                    return insert(__dict_Ord_18)(k)(_553.value0)(m);
                };
                throw new Error("Failed pattern match at Data.Map line 235, column 1 - line 236, column 1: " + [ _553.constructor.name ]);
            };
        };
    };
};
var fromFoldableWith = function (__dict_Ord_19) {
    return function (__dict_Foldable_20) {
        return function (f) {
            var combine = function (v) {
                return function (_20) {
                    if (_20 instanceof Data_Maybe.Just) {
                        return Data_Maybe.Just.create(f(v)(_20.value0));
                    };
                    if (_20 instanceof Data_Maybe.Nothing) {
                        return new Data_Maybe.Just(v);
                    };
                    throw new Error("Failed pattern match at Data.Map line 253, column 3 - line 254, column 3: " + [ v.constructor.name, _20.constructor.name ]);
                };
            };
            return Data_Foldable.foldl(__dict_Foldable_20)(function (m) {
                return function (_1) {
                    return alter(__dict_Ord_19)(combine(_1.value1))(_1.value0)(m);
                };
            })(empty);
        };
    };
};
var fromListWith = function (__dict_Ord_21) {
    return fromFoldableWith(__dict_Ord_21)(Data_List.foldableList);
};
var unionWith = function (__dict_Ord_22) {
    return function (f) {
        return function (m1) {
            return function (m2) {
                var go = function (m) {
                    return function (_21) {
                        return alter(__dict_Ord_22)(function (_566) {
                            return Data_Maybe.Just.create(Data_Maybe.maybe(_21.value1)(f(_21.value1))(_566));
                        })(_21.value0)(m);
                    };
                };
                return Data_Foldable.foldl(Data_List.foldableList)(go)(m2)(toList(m1));
            };
        };
    };
};
var union = function (__dict_Ord_23) {
    return unionWith(__dict_Ord_23)(Prelude["const"]);
};
var semigroupMap = function (__dict_Ord_24) {
    return new Prelude.Semigroup(union(__dict_Ord_24));
};
var monoidMap = function (__dict_Ord_16) {
    return new Data_Monoid.Monoid(function () {
        return semigroupMap(__dict_Ord_16);
    }, empty);
};
var traversableMap = function (__dict_Ord_25) {
    return new Data_Traversable.Traversable(function () {
        return foldableMap;
    }, function () {
        return functorMap;
    }, function (__dict_Applicative_27) {
        return Data_Traversable.traverse(traversableMap(__dict_Ord_25))(__dict_Applicative_27)(Prelude.id(Prelude.categoryFn));
    }, function (__dict_Applicative_26) {
        return function (f) {
            return function (ms) {
                return Data_Foldable.foldr(Data_List.foldableList)(function (x) {
                    return function (acc) {
                        return Prelude["<*>"](__dict_Applicative_26["__superclass_Prelude.Apply_0"]())(Prelude["<$>"]((__dict_Applicative_26["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(union(__dict_Ord_25))(x))(acc);
                    };
                })(Prelude.pure(__dict_Applicative_26)(empty))(Prelude["<$>"](Data_List.functorList)(Prelude["<$>"]((__dict_Applicative_26["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Tuple.uncurry(singleton)))(Prelude["<$>"](Data_List.functorList)(Data_Traversable.traverse(Data_Tuple.traversableTuple)(__dict_Applicative_26)(f))(toList(ms))));
            };
        };
    });
};
var unions = function (__dict_Ord_28) {
    return function (__dict_Foldable_29) {
        return Data_Foldable.foldl(__dict_Foldable_29)(union(__dict_Ord_28))(empty);
    };
};
var update = function (__dict_Ord_30) {
    return function (f) {
        return function (k) {
            return function (m) {
                return alter(__dict_Ord_30)(Data_Maybe.maybe(Data_Maybe.Nothing.value)(f))(k)(m);
            };
        };
    };
};
module.exports = {
    size: size, 
    unions: unions, 
    unionWith: unionWith, 
    union: union, 
    values: values, 
    keys: keys, 
    update: update, 
    alter: alter, 
    member: member, 
    "delete": $$delete, 
    fromListWith: fromListWith, 
    fromList: fromList, 
    toList: toList, 
    fromFoldableWith: fromFoldableWith, 
    fromFoldable: fromFoldable, 
    lookup: lookup, 
    insert: insert, 
    checkValid: checkValid, 
    singleton: singleton, 
    isEmpty: isEmpty, 
    empty: empty, 
    showTree: showTree, 
    eqMap: eqMap, 
    showMap: showMap, 
    ordMap: ordMap, 
    semigroupMap: semigroupMap, 
    monoidMap: monoidMap, 
    functorMap: functorMap, 
    foldableMap: foldableMap, 
    traversableMap: traversableMap
};

},{"Data.Foldable":"/Users/maximko/Projects/mine/guppi/output/Data.Foldable/index.js","Data.List":"/Users/maximko/Projects/mine/guppi/output/Data.List/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Maybe.Unsafe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe.Unsafe/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Traversable":"/Users/maximko/Projects/mine/guppi/output/Data.Traversable/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Maybe.First/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Comonad = require("Control.Comonad");
var Control_Extend = require("Control.Extend");
var Data_Functor_Invariant = require("Data.Functor.Invariant");
var Data_Maybe = require("Data.Maybe");
var Data_Monoid = require("Data.Monoid");
var First = function (x) {
    return x;
};
var showFirst = function (__dict_Show_0) {
    return new Prelude.Show(function (_10) {
        return "First (" + (Prelude.show(Data_Maybe.showMaybe(__dict_Show_0))(_10) + ")");
    });
};
var semigroupFirst = new Prelude.Semigroup(function (_11) {
    return function (second) {
        if (_11 instanceof Data_Maybe.Just) {
            return _11;
        };
        return second;
    };
});
var runFirst = function (_0) {
    return _0;
};
var monoidFirst = new Data_Monoid.Monoid(function () {
    return semigroupFirst;
}, Data_Maybe.Nothing.value);
var functorFirst = new Prelude.Functor(function (f) {
    return function (_5) {
        return Prelude["<$>"](Data_Maybe.functorMaybe)(f)(_5);
    };
});
var invariantFirst = new Data_Functor_Invariant.Invariant(Data_Functor_Invariant.imapF(functorFirst));
var extendFirst = new Control_Extend.Extend(function () {
    return functorFirst;
}, function (f) {
    return function (_9) {
        return Control_Extend.extend(Data_Maybe.extendMaybe)(function (_29) {
            return f(First(_29));
        })(_9);
    };
});
var eqFirst = function (__dict_Eq_2) {
    return new Prelude.Eq(function (_1) {
        return function (_2) {
            return Prelude["=="](Data_Maybe.eqMaybe(__dict_Eq_2))(_1)(_2);
        };
    });
};
var ordFirst = function (__dict_Ord_1) {
    return new Prelude.Ord(function () {
        return eqFirst(__dict_Ord_1["__superclass_Prelude.Eq_0"]());
    }, function (_3) {
        return function (_4) {
            return Prelude.compare(Data_Maybe.ordMaybe(__dict_Ord_1))(_3)(_4);
        };
    });
};
var boundedFirst = function (__dict_Bounded_3) {
    return new Prelude.Bounded(Prelude.bottom(Data_Maybe.boundedMaybe(__dict_Bounded_3)), Prelude.top(Data_Maybe.boundedMaybe(__dict_Bounded_3)));
};
var applyFirst = new Prelude.Apply(function () {
    return functorFirst;
}, function (_6) {
    return function (_7) {
        return Prelude["<*>"](Data_Maybe.applyMaybe)(_6)(_7);
    };
});
var bindFirst = new Prelude.Bind(function () {
    return applyFirst;
}, function (_8) {
    return function (f) {
        return Prelude.bind(Data_Maybe.bindMaybe)(_8)(function (_30) {
            return runFirst(f(_30));
        });
    };
});
var applicativeFirst = new Prelude.Applicative(function () {
    return applyFirst;
}, function (_31) {
    return First(Prelude.pure(Data_Maybe.applicativeMaybe)(_31));
});
var monadFirst = new Prelude.Monad(function () {
    return applicativeFirst;
}, function () {
    return bindFirst;
});
module.exports = {
    First: First, 
    runFirst: runFirst, 
    eqFirst: eqFirst, 
    ordFirst: ordFirst, 
    boundedFirst: boundedFirst, 
    functorFirst: functorFirst, 
    applyFirst: applyFirst, 
    applicativeFirst: applicativeFirst, 
    bindFirst: bindFirst, 
    monadFirst: monadFirst, 
    extendFirst: extendFirst, 
    invariantFirst: invariantFirst, 
    showFirst: showFirst, 
    semigroupFirst: semigroupFirst, 
    monoidFirst: monoidFirst
};

},{"Control.Comonad":"/Users/maximko/Projects/mine/guppi/output/Control.Comonad/index.js","Control.Extend":"/Users/maximko/Projects/mine/guppi/output/Control.Extend/index.js","Data.Functor.Invariant":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Invariant/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Maybe.Last/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Comonad = require("Control.Comonad");
var Control_Extend = require("Control.Extend");
var Data_Functor_Invariant = require("Data.Functor.Invariant");
var Data_Maybe = require("Data.Maybe");
var Data_Monoid = require("Data.Monoid");
var Last = function (x) {
    return x;
};
var showLast = function (__dict_Show_0) {
    return new Prelude.Show(function (_10) {
        return "Last (" + (Prelude.show(Data_Maybe.showMaybe(__dict_Show_0))(_10) + ")");
    });
};
var semigroupLast = new Prelude.Semigroup(function (last) {
    return function (_11) {
        if (_11 instanceof Data_Maybe.Just) {
            return _11;
        };
        if (_11 instanceof Data_Maybe.Nothing) {
            return last;
        };
        throw new Error("Failed pattern match at Data.Maybe.Last line 57, column 1 - line 61, column 1: " + [ last.constructor.name, _11.constructor.name ]);
    };
});
var runLast = function (_0) {
    return _0;
};
var monoidLast = new Data_Monoid.Monoid(function () {
    return semigroupLast;
}, Data_Maybe.Nothing.value);
var functorLast = new Prelude.Functor(function (f) {
    return function (_5) {
        return Prelude["<$>"](Data_Maybe.functorMaybe)(f)(_5);
    };
});
var invariantLast = new Data_Functor_Invariant.Invariant(Data_Functor_Invariant.imapF(functorLast));
var extendLast = new Control_Extend.Extend(function () {
    return functorLast;
}, function (f) {
    return function (_9) {
        return Control_Extend.extend(Data_Maybe.extendMaybe)(function (_29) {
            return f(Last(_29));
        })(_9);
    };
});
var eqLast = function (__dict_Eq_2) {
    return new Prelude.Eq(function (_1) {
        return function (_2) {
            return Prelude["=="](Data_Maybe.eqMaybe(__dict_Eq_2))(_1)(_2);
        };
    });
};
var ordLast = function (__dict_Ord_1) {
    return new Prelude.Ord(function () {
        return eqLast(__dict_Ord_1["__superclass_Prelude.Eq_0"]());
    }, function (_3) {
        return function (_4) {
            return Prelude.compare(Data_Maybe.ordMaybe(__dict_Ord_1))(_3)(_4);
        };
    });
};
var boundedLast = function (__dict_Bounded_3) {
    return new Prelude.Bounded(Prelude.bottom(Data_Maybe.boundedMaybe(__dict_Bounded_3)), Prelude.top(Data_Maybe.boundedMaybe(__dict_Bounded_3)));
};
var applyLast = new Prelude.Apply(function () {
    return functorLast;
}, function (_6) {
    return function (_7) {
        return Prelude["<*>"](Data_Maybe.applyMaybe)(_6)(_7);
    };
});
var bindLast = new Prelude.Bind(function () {
    return applyLast;
}, function (_8) {
    return function (f) {
        return Prelude.bind(Data_Maybe.bindMaybe)(_8)(function (_30) {
            return runLast(f(_30));
        });
    };
});
var applicativeLast = new Prelude.Applicative(function () {
    return applyLast;
}, function (_31) {
    return Last(Prelude.pure(Data_Maybe.applicativeMaybe)(_31));
});
var monadLast = new Prelude.Monad(function () {
    return applicativeLast;
}, function () {
    return bindLast;
});
module.exports = {
    Last: Last, 
    runLast: runLast, 
    eqLast: eqLast, 
    ordLast: ordLast, 
    boundedLast: boundedLast, 
    functorLast: functorLast, 
    applyLast: applyLast, 
    applicativeLast: applicativeLast, 
    bindLast: bindLast, 
    monadLast: monadLast, 
    extendLast: extendLast, 
    invariantLast: invariantLast, 
    showLast: showLast, 
    semigroupLast: semigroupLast, 
    monoidLast: monoidLast
};

},{"Control.Comonad":"/Users/maximko/Projects/mine/guppi/output/Control.Comonad/index.js","Control.Extend":"/Users/maximko/Projects/mine/guppi/output/Control.Extend/index.js","Data.Functor.Invariant":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Invariant/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Maybe.Unsafe/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Data.Maybe.Unsafe

exports.unsafeThrow = function (msg) {
  throw new Error(msg);
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Data.Maybe.Unsafe/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Data_Maybe = require("Data.Maybe");
var fromJust = function (_0) {
    if (_0 instanceof Data_Maybe.Just) {
        return _0.value0;
    };
    if (_0 instanceof Data_Maybe.Nothing) {
        return $foreign.unsafeThrow("Data.Maybe.Unsafe.fromJust called on Nothing");
    };
    throw new Error("Failed pattern match at Data.Maybe.Unsafe line 10, column 1 - line 11, column 1: " + [ _0.constructor.name ]);
};
module.exports = {
    fromJust: fromJust, 
    unsafeThrow: $foreign.unsafeThrow
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe.Unsafe/foreign.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Alt = require("Control.Alt");
var Control_Alternative = require("Control.Alternative");
var Control_Extend = require("Control.Extend");
var Control_MonadPlus = require("Control.MonadPlus");
var Control_Plus = require("Control.Plus");
var Data_Functor_Invariant = require("Data.Functor.Invariant");
var Data_Monoid = require("Data.Monoid");
var Nothing = (function () {
    function Nothing() {

    };
    Nothing.value = new Nothing();
    return Nothing;
})();
var Just = (function () {
    function Just(value0) {
        this.value0 = value0;
    };
    Just.create = function (value0) {
        return new Just(value0);
    };
    return Just;
})();
var showMaybe = function (__dict_Show_0) {
    return new Prelude.Show(function (_13) {
        if (_13 instanceof Just) {
            return "Just (" + (Prelude.show(__dict_Show_0)(_13.value0) + ")");
        };
        if (_13 instanceof Nothing) {
            return "Nothing";
        };
        throw new Error("Failed pattern match at Data.Maybe line 289, column 1 - line 291, column 19: " + [ _13.constructor.name ]);
    });
};
var semigroupMaybe = function (__dict_Semigroup_2) {
    return new Prelude.Semigroup(function (_7) {
        return function (_8) {
            if (_7 instanceof Nothing) {
                return _8;
            };
            if (_8 instanceof Nothing) {
                return _7;
            };
            if (_7 instanceof Just && _8 instanceof Just) {
                return new Just(Prelude["<>"](__dict_Semigroup_2)(_7.value0)(_8.value0));
            };
            throw new Error("Failed pattern match at Data.Maybe line 231, column 1 - line 236, column 1: " + [ _7.constructor.name, _8.constructor.name ]);
        };
    });
};
var monoidMaybe = function (__dict_Semigroup_6) {
    return new Data_Monoid.Monoid(function () {
        return semigroupMaybe(__dict_Semigroup_6);
    }, Nothing.value);
};
var maybe$prime = function (g) {
    return function (f) {
        return function (_1) {
            if (_1 instanceof Nothing) {
                return g(Prelude.unit);
            };
            if (_1 instanceof Just) {
                return f(_1.value0);
            };
            throw new Error("Failed pattern match at Data.Maybe line 39, column 1 - line 40, column 1: " + [ g.constructor.name, f.constructor.name, _1.constructor.name ]);
        };
    };
};
var maybe = function (b) {
    return function (f) {
        return function (_0) {
            if (_0 instanceof Nothing) {
                return b;
            };
            if (_0 instanceof Just) {
                return f(_0.value0);
            };
            throw new Error("Failed pattern match at Data.Maybe line 26, column 1 - line 27, column 1: " + [ b.constructor.name, f.constructor.name, _0.constructor.name ]);
        };
    };
};
var isNothing = maybe(true)(Prelude["const"](false));
var isJust = maybe(false)(Prelude["const"](true));
var functorMaybe = new Prelude.Functor(function (fn) {
    return function (_2) {
        if (_2 instanceof Just) {
            return new Just(fn(_2.value0));
        };
        return Nothing.value;
    };
});
var invariantMaybe = new Data_Functor_Invariant.Invariant(Data_Functor_Invariant.imapF(functorMaybe));
var fromMaybe$prime = function (a) {
    return maybe$prime(a)(Prelude.id(Prelude.categoryFn));
};
var fromMaybe = function (a) {
    return maybe(a)(Prelude.id(Prelude.categoryFn));
};
var extendMaybe = new Control_Extend.Extend(function () {
    return functorMaybe;
}, function (f) {
    return function (_6) {
        if (_6 instanceof Nothing) {
            return Nothing.value;
        };
        return new Just(f(_6));
    };
});
var eqMaybe = function (__dict_Eq_8) {
    return new Prelude.Eq(function (_9) {
        return function (_10) {
            if (_9 instanceof Nothing && _10 instanceof Nothing) {
                return true;
            };
            if (_9 instanceof Just && _10 instanceof Just) {
                return Prelude["=="](__dict_Eq_8)(_9.value0)(_10.value0);
            };
            return false;
        };
    });
};
var ordMaybe = function (__dict_Ord_4) {
    return new Prelude.Ord(function () {
        return eqMaybe(__dict_Ord_4["__superclass_Prelude.Eq_0"]());
    }, function (_11) {
        return function (_12) {
            if (_11 instanceof Just && _12 instanceof Just) {
                return Prelude.compare(__dict_Ord_4)(_11.value0)(_12.value0);
            };
            if (_11 instanceof Nothing && _12 instanceof Nothing) {
                return Prelude.EQ.value;
            };
            if (_11 instanceof Nothing) {
                return Prelude.LT.value;
            };
            if (_12 instanceof Nothing) {
                return Prelude.GT.value;
            };
            throw new Error("Failed pattern match at Data.Maybe line 269, column 1 - line 275, column 1: " + [ _11.constructor.name, _12.constructor.name ]);
        };
    });
};
var boundedMaybe = function (__dict_Bounded_11) {
    return new Prelude.Bounded(Nothing.value, new Just(Prelude.top(__dict_Bounded_11)));
};
var boundedOrdMaybe = function (__dict_BoundedOrd_10) {
    return new Prelude.BoundedOrd(function () {
        return boundedMaybe(__dict_BoundedOrd_10["__superclass_Prelude.Bounded_0"]());
    }, function () {
        return ordMaybe(__dict_BoundedOrd_10["__superclass_Prelude.Ord_1"]());
    });
};
var applyMaybe = new Prelude.Apply(function () {
    return functorMaybe;
}, function (_3) {
    return function (x) {
        if (_3 instanceof Just) {
            return Prelude["<$>"](functorMaybe)(_3.value0)(x);
        };
        if (_3 instanceof Nothing) {
            return Nothing.value;
        };
        throw new Error("Failed pattern match at Data.Maybe line 121, column 1 - line 145, column 1: " + [ _3.constructor.name, x.constructor.name ]);
    };
});
var bindMaybe = new Prelude.Bind(function () {
    return applyMaybe;
}, function (_5) {
    return function (k) {
        if (_5 instanceof Just) {
            return k(_5.value0);
        };
        if (_5 instanceof Nothing) {
            return Nothing.value;
        };
        throw new Error("Failed pattern match at Data.Maybe line 180, column 1 - line 199, column 1: " + [ _5.constructor.name, k.constructor.name ]);
    };
});
var booleanAlgebraMaybe = function (__dict_BooleanAlgebra_12) {
    return new Prelude.BooleanAlgebra(function () {
        return boundedMaybe(__dict_BooleanAlgebra_12["__superclass_Prelude.Bounded_0"]());
    }, function (x) {
        return function (y) {
            return Prelude["<*>"](applyMaybe)(Prelude["<$>"](functorMaybe)(Prelude.conj(__dict_BooleanAlgebra_12))(x))(y);
        };
    }, function (x) {
        return function (y) {
            return Prelude["<*>"](applyMaybe)(Prelude["<$>"](functorMaybe)(Prelude.disj(__dict_BooleanAlgebra_12))(x))(y);
        };
    }, Prelude.map(functorMaybe)(Prelude.not(__dict_BooleanAlgebra_12)));
};
var semiringMaybe = function (__dict_Semiring_1) {
    return new Prelude.Semiring(function (x) {
        return function (y) {
            return Prelude["<*>"](applyMaybe)(Prelude["<$>"](functorMaybe)(Prelude.add(__dict_Semiring_1))(x))(y);
        };
    }, function (x) {
        return function (y) {
            return Prelude["<*>"](applyMaybe)(Prelude["<$>"](functorMaybe)(Prelude.mul(__dict_Semiring_1))(x))(y);
        };
    }, new Just(Prelude.one(__dict_Semiring_1)), new Just(Prelude.zero(__dict_Semiring_1)));
};
var moduloSemiringMaybe = function (__dict_ModuloSemiring_7) {
    return new Prelude.ModuloSemiring(function () {
        return semiringMaybe(__dict_ModuloSemiring_7["__superclass_Prelude.Semiring_0"]());
    }, function (x) {
        return function (y) {
            return Prelude["<*>"](applyMaybe)(Prelude["<$>"](functorMaybe)(Prelude.div(__dict_ModuloSemiring_7))(x))(y);
        };
    }, function (x) {
        return function (y) {
            return Prelude["<*>"](applyMaybe)(Prelude["<$>"](functorMaybe)(Prelude.mod(__dict_ModuloSemiring_7))(x))(y);
        };
    });
};
var ringMaybe = function (__dict_Ring_3) {
    return new Prelude.Ring(function () {
        return semiringMaybe(__dict_Ring_3["__superclass_Prelude.Semiring_0"]());
    }, function (x) {
        return function (y) {
            return Prelude["<*>"](applyMaybe)(Prelude["<$>"](functorMaybe)(Prelude.sub(__dict_Ring_3))(x))(y);
        };
    });
};
var divisionRingMaybe = function (__dict_DivisionRing_9) {
    return new Prelude.DivisionRing(function () {
        return moduloSemiringMaybe(__dict_DivisionRing_9["__superclass_Prelude.ModuloSemiring_1"]());
    }, function () {
        return ringMaybe(__dict_DivisionRing_9["__superclass_Prelude.Ring_0"]());
    });
};
var numMaybe = function (__dict_Num_5) {
    return new Prelude.Num(function () {
        return divisionRingMaybe(__dict_Num_5["__superclass_Prelude.DivisionRing_0"]());
    });
};
var applicativeMaybe = new Prelude.Applicative(function () {
    return applyMaybe;
}, Just.create);
var monadMaybe = new Prelude.Monad(function () {
    return applicativeMaybe;
}, function () {
    return bindMaybe;
});
var altMaybe = new Control_Alt.Alt(function () {
    return functorMaybe;
}, function (_4) {
    return function (r) {
        if (_4 instanceof Nothing) {
            return r;
        };
        return _4;
    };
});
var plusMaybe = new Control_Plus.Plus(function () {
    return altMaybe;
}, Nothing.value);
var alternativeMaybe = new Control_Alternative.Alternative(function () {
    return plusMaybe;
}, function () {
    return applicativeMaybe;
});
var monadPlusMaybe = new Control_MonadPlus.MonadPlus(function () {
    return alternativeMaybe;
}, function () {
    return monadMaybe;
});
module.exports = {
    Nothing: Nothing, 
    Just: Just, 
    isNothing: isNothing, 
    isJust: isJust, 
    "fromMaybe'": fromMaybe$prime, 
    fromMaybe: fromMaybe, 
    "maybe'": maybe$prime, 
    maybe: maybe, 
    functorMaybe: functorMaybe, 
    applyMaybe: applyMaybe, 
    applicativeMaybe: applicativeMaybe, 
    altMaybe: altMaybe, 
    plusMaybe: plusMaybe, 
    alternativeMaybe: alternativeMaybe, 
    bindMaybe: bindMaybe, 
    monadMaybe: monadMaybe, 
    monadPlusMaybe: monadPlusMaybe, 
    extendMaybe: extendMaybe, 
    invariantMaybe: invariantMaybe, 
    semigroupMaybe: semigroupMaybe, 
    monoidMaybe: monoidMaybe, 
    semiringMaybe: semiringMaybe, 
    moduloSemiringMaybe: moduloSemiringMaybe, 
    ringMaybe: ringMaybe, 
    divisionRingMaybe: divisionRingMaybe, 
    numMaybe: numMaybe, 
    eqMaybe: eqMaybe, 
    ordMaybe: ordMaybe, 
    boundedMaybe: boundedMaybe, 
    boundedOrdMaybe: boundedOrdMaybe, 
    booleanAlgebraMaybe: booleanAlgebraMaybe, 
    showMaybe: showMaybe
};

},{"Control.Alt":"/Users/maximko/Projects/mine/guppi/output/Control.Alt/index.js","Control.Alternative":"/Users/maximko/Projects/mine/guppi/output/Control.Alternative/index.js","Control.Extend":"/Users/maximko/Projects/mine/guppi/output/Control.Extend/index.js","Control.MonadPlus":"/Users/maximko/Projects/mine/guppi/output/Control.MonadPlus/index.js","Control.Plus":"/Users/maximko/Projects/mine/guppi/output/Control.Plus/index.js","Data.Functor.Invariant":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Invariant/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Additive/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Comonad = require("Control.Comonad");
var Control_Extend = require("Control.Extend");
var Data_Functor_Invariant = require("Data.Functor.Invariant");
var Data_Monoid = require("Data.Monoid");
var Additive = function (x) {
    return x;
};
var showAdditive = function (__dict_Show_0) {
    return new Prelude.Show(function (_11) {
        return "Additive (" + (Prelude.show(__dict_Show_0)(_11) + ")");
    });
};
var semigroupAdditive = function (__dict_Semiring_1) {
    return new Prelude.Semigroup(function (_12) {
        return function (_13) {
            return Prelude["+"](__dict_Semiring_1)(_12)(_13);
        };
    });
};
var runAdditive = function (_0) {
    return _0;
};
var monoidAdditive = function (__dict_Semiring_3) {
    return new Data_Monoid.Monoid(function () {
        return semigroupAdditive(__dict_Semiring_3);
    }, Prelude.zero(__dict_Semiring_3));
};
var invariantAdditive = new Data_Functor_Invariant.Invariant(function (f) {
    return function (_9) {
        return function (_10) {
            return f(_10);
        };
    };
});
var functorAdditive = new Prelude.Functor(function (f) {
    return function (_5) {
        return f(_5);
    };
});
var extendAdditive = new Control_Extend.Extend(function () {
    return functorAdditive;
}, function (f) {
    return function (x) {
        return f(x);
    };
});
var eqAdditive = function (__dict_Eq_4) {
    return new Prelude.Eq(function (_1) {
        return function (_2) {
            return Prelude["=="](__dict_Eq_4)(_1)(_2);
        };
    });
};
var ordAdditive = function (__dict_Ord_2) {
    return new Prelude.Ord(function () {
        return eqAdditive(__dict_Ord_2["__superclass_Prelude.Eq_0"]());
    }, function (_3) {
        return function (_4) {
            return Prelude.compare(__dict_Ord_2)(_3)(_4);
        };
    });
};
var comonadAdditive = new Control_Comonad.Comonad(function () {
    return extendAdditive;
}, runAdditive);
var applyAdditive = new Prelude.Apply(function () {
    return functorAdditive;
}, function (_6) {
    return function (_7) {
        return _6(_7);
    };
});
var bindAdditive = new Prelude.Bind(function () {
    return applyAdditive;
}, function (_8) {
    return function (f) {
        return f(_8);
    };
});
var applicativeAdditive = new Prelude.Applicative(function () {
    return applyAdditive;
}, Additive);
var monadAdditive = new Prelude.Monad(function () {
    return applicativeAdditive;
}, function () {
    return bindAdditive;
});
module.exports = {
    Additive: Additive, 
    runAdditive: runAdditive, 
    eqAdditive: eqAdditive, 
    ordAdditive: ordAdditive, 
    functorAdditive: functorAdditive, 
    applyAdditive: applyAdditive, 
    applicativeAdditive: applicativeAdditive, 
    bindAdditive: bindAdditive, 
    monadAdditive: monadAdditive, 
    extendAdditive: extendAdditive, 
    comonadAdditive: comonadAdditive, 
    invariantAdditive: invariantAdditive, 
    showAdditive: showAdditive, 
    semigroupAdditive: semigroupAdditive, 
    monoidAdditive: monoidAdditive
};

},{"Control.Comonad":"/Users/maximko/Projects/mine/guppi/output/Control.Comonad/index.js","Control.Extend":"/Users/maximko/Projects/mine/guppi/output/Control.Extend/index.js","Data.Functor.Invariant":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Invariant/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Conj/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Comonad = require("Control.Comonad");
var Control_Extend = require("Control.Extend");
var Data_Monoid = require("Data.Monoid");
var Conj = function (x) {
    return x;
};
var showConj = function (__dict_Show_0) {
    return new Prelude.Show(function (_9) {
        return "Conj (" + (Prelude.show(__dict_Show_0)(_9) + ")");
    });
};
var semiringConj = function (__dict_BooleanAlgebra_1) {
    return new Prelude.Semiring(function (_12) {
        return function (_13) {
            return Prelude.conj(__dict_BooleanAlgebra_1)(_12)(_13);
        };
    }, function (_14) {
        return function (_15) {
            return Prelude.disj(__dict_BooleanAlgebra_1)(_14)(_15);
        };
    }, Prelude.bottom(__dict_BooleanAlgebra_1["__superclass_Prelude.Bounded_0"]()), Prelude.top(__dict_BooleanAlgebra_1["__superclass_Prelude.Bounded_0"]()));
};
var semigroupConj = function (__dict_BooleanAlgebra_2) {
    return new Prelude.Semigroup(function (_10) {
        return function (_11) {
            return Prelude.conj(__dict_BooleanAlgebra_2)(_10)(_11);
        };
    });
};
var runConj = function (_0) {
    return _0;
};
var monoidConj = function (__dict_BooleanAlgebra_4) {
    return new Data_Monoid.Monoid(function () {
        return semigroupConj(__dict_BooleanAlgebra_4);
    }, Prelude.top(__dict_BooleanAlgebra_4["__superclass_Prelude.Bounded_0"]()));
};
var functorConj = new Prelude.Functor(function (f) {
    return function (_5) {
        return f(_5);
    };
});
var extendConj = new Control_Extend.Extend(function () {
    return functorConj;
}, function (f) {
    return function (x) {
        return f(x);
    };
});
var eqConj = function (__dict_Eq_5) {
    return new Prelude.Eq(function (_1) {
        return function (_2) {
            return Prelude["=="](__dict_Eq_5)(_1)(_2);
        };
    });
};
var ordConj = function (__dict_Ord_3) {
    return new Prelude.Ord(function () {
        return eqConj(__dict_Ord_3["__superclass_Prelude.Eq_0"]());
    }, function (_3) {
        return function (_4) {
            return Prelude.compare(__dict_Ord_3)(_3)(_4);
        };
    });
};
var comonadConj = new Control_Comonad.Comonad(function () {
    return extendConj;
}, runConj);
var boundedConj = function (__dict_Bounded_6) {
    return new Prelude.Bounded(Prelude.bottom(__dict_Bounded_6), Prelude.top(__dict_Bounded_6));
};
var applyConj = new Prelude.Apply(function () {
    return functorConj;
}, function (_6) {
    return function (_7) {
        return _6(_7);
    };
});
var bindConj = new Prelude.Bind(function () {
    return applyConj;
}, function (_8) {
    return function (f) {
        return f(_8);
    };
});
var applicativeConj = new Prelude.Applicative(function () {
    return applyConj;
}, Conj);
var monadConj = new Prelude.Monad(function () {
    return applicativeConj;
}, function () {
    return bindConj;
});
module.exports = {
    Conj: Conj, 
    runConj: runConj, 
    eqConj: eqConj, 
    ordConj: ordConj, 
    boundedConj: boundedConj, 
    functorConj: functorConj, 
    applyConj: applyConj, 
    applicativeConj: applicativeConj, 
    bindConj: bindConj, 
    monadConj: monadConj, 
    extendConj: extendConj, 
    comonadConj: comonadConj, 
    showConj: showConj, 
    semigroupConj: semigroupConj, 
    monoidConj: monoidConj, 
    semiringConj: semiringConj
};

},{"Control.Comonad":"/Users/maximko/Projects/mine/guppi/output/Control.Comonad/index.js","Control.Extend":"/Users/maximko/Projects/mine/guppi/output/Control.Extend/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Disj/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Comonad = require("Control.Comonad");
var Control_Extend = require("Control.Extend");
var Data_Monoid = require("Data.Monoid");
var Disj = function (x) {
    return x;
};
var showDisj = function (__dict_Show_0) {
    return new Prelude.Show(function (_9) {
        return "Disj (" + (Prelude.show(__dict_Show_0)(_9) + ")");
    });
};
var semiringDisj = function (__dict_BooleanAlgebra_1) {
    return new Prelude.Semiring(function (_12) {
        return function (_13) {
            return Prelude.disj(__dict_BooleanAlgebra_1)(_12)(_13);
        };
    }, function (_14) {
        return function (_15) {
            return Prelude.conj(__dict_BooleanAlgebra_1)(_14)(_15);
        };
    }, Prelude.top(__dict_BooleanAlgebra_1["__superclass_Prelude.Bounded_0"]()), Prelude.bottom(__dict_BooleanAlgebra_1["__superclass_Prelude.Bounded_0"]()));
};
var semigroupDisj = function (__dict_BooleanAlgebra_2) {
    return new Prelude.Semigroup(function (_10) {
        return function (_11) {
            return Prelude.disj(__dict_BooleanAlgebra_2)(_10)(_11);
        };
    });
};
var runDisj = function (_0) {
    return _0;
};
var monoidDisj = function (__dict_BooleanAlgebra_4) {
    return new Data_Monoid.Monoid(function () {
        return semigroupDisj(__dict_BooleanAlgebra_4);
    }, Prelude.bottom(__dict_BooleanAlgebra_4["__superclass_Prelude.Bounded_0"]()));
};
var functorDisj = new Prelude.Functor(function (f) {
    return function (_5) {
        return f(_5);
    };
});
var extendDisj = new Control_Extend.Extend(function () {
    return functorDisj;
}, function (f) {
    return function (x) {
        return f(x);
    };
});
var eqDisj = function (__dict_Eq_5) {
    return new Prelude.Eq(function (_1) {
        return function (_2) {
            return Prelude["=="](__dict_Eq_5)(_1)(_2);
        };
    });
};
var ordDisj = function (__dict_Ord_3) {
    return new Prelude.Ord(function () {
        return eqDisj(__dict_Ord_3["__superclass_Prelude.Eq_0"]());
    }, function (_3) {
        return function (_4) {
            return Prelude.compare(__dict_Ord_3)(_3)(_4);
        };
    });
};
var comonadDisj = new Control_Comonad.Comonad(function () {
    return extendDisj;
}, runDisj);
var boundedDisj = function (__dict_Bounded_6) {
    return new Prelude.Bounded(Prelude.bottom(__dict_Bounded_6), Prelude.top(__dict_Bounded_6));
};
var applyDisj = new Prelude.Apply(function () {
    return functorDisj;
}, function (_6) {
    return function (_7) {
        return _6(_7);
    };
});
var bindDisj = new Prelude.Bind(function () {
    return applyDisj;
}, function (_8) {
    return function (f) {
        return f(_8);
    };
});
var applicativeDisj = new Prelude.Applicative(function () {
    return applyDisj;
}, Disj);
var monadDisj = new Prelude.Monad(function () {
    return applicativeDisj;
}, function () {
    return bindDisj;
});
module.exports = {
    Disj: Disj, 
    runDisj: runDisj, 
    eqDisj: eqDisj, 
    ordDisj: ordDisj, 
    boundedDisj: boundedDisj, 
    functorDisj: functorDisj, 
    applyDisj: applyDisj, 
    applicativeDisj: applicativeDisj, 
    bindDisj: bindDisj, 
    monadDisj: monadDisj, 
    extendDisj: extendDisj, 
    comonadDisj: comonadDisj, 
    showDisj: showDisj, 
    semigroupDisj: semigroupDisj, 
    monoidDisj: monoidDisj, 
    semiringDisj: semiringDisj
};

},{"Control.Comonad":"/Users/maximko/Projects/mine/guppi/output/Control.Comonad/index.js","Control.Extend":"/Users/maximko/Projects/mine/guppi/output/Control.Extend/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Dual/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Comonad = require("Control.Comonad");
var Control_Extend = require("Control.Extend");
var Data_Functor_Invariant = require("Data.Functor.Invariant");
var Data_Monoid = require("Data.Monoid");
var Dual = function (x) {
    return x;
};
var showDual = function (__dict_Show_0) {
    return new Prelude.Show(function (_11) {
        return "Dual (" + (Prelude.show(__dict_Show_0)(_11) + ")");
    });
};
var semigroupDual = function (__dict_Semigroup_1) {
    return new Prelude.Semigroup(function (_12) {
        return function (_13) {
            return Prelude["<>"](__dict_Semigroup_1)(_13)(_12);
        };
    });
};
var runDual = function (_0) {
    return _0;
};
var monoidDual = function (__dict_Monoid_3) {
    return new Data_Monoid.Monoid(function () {
        return semigroupDual(__dict_Monoid_3["__superclass_Prelude.Semigroup_0"]());
    }, Data_Monoid.mempty(__dict_Monoid_3));
};
var invariantDual = new Data_Functor_Invariant.Invariant(function (f) {
    return function (_9) {
        return function (_10) {
            return f(_10);
        };
    };
});
var functorDual = new Prelude.Functor(function (f) {
    return function (_5) {
        return f(_5);
    };
});
var extendDual = new Control_Extend.Extend(function () {
    return functorDual;
}, function (f) {
    return function (x) {
        return f(x);
    };
});
var eqDual = function (__dict_Eq_4) {
    return new Prelude.Eq(function (_1) {
        return function (_2) {
            return Prelude["=="](__dict_Eq_4)(_1)(_2);
        };
    });
};
var ordDual = function (__dict_Ord_2) {
    return new Prelude.Ord(function () {
        return eqDual(__dict_Ord_2["__superclass_Prelude.Eq_0"]());
    }, function (_3) {
        return function (_4) {
            return Prelude.compare(__dict_Ord_2)(_3)(_4);
        };
    });
};
var comonadDual = new Control_Comonad.Comonad(function () {
    return extendDual;
}, runDual);
var applyDual = new Prelude.Apply(function () {
    return functorDual;
}, function (_6) {
    return function (_7) {
        return _6(_7);
    };
});
var bindDual = new Prelude.Bind(function () {
    return applyDual;
}, function (_8) {
    return function (f) {
        return f(_8);
    };
});
var applicativeDual = new Prelude.Applicative(function () {
    return applyDual;
}, Dual);
var monadDual = new Prelude.Monad(function () {
    return applicativeDual;
}, function () {
    return bindDual;
});
module.exports = {
    Dual: Dual, 
    runDual: runDual, 
    eqDual: eqDual, 
    ordDual: ordDual, 
    functorDual: functorDual, 
    applyDual: applyDual, 
    applicativeDual: applicativeDual, 
    bindDual: bindDual, 
    monadDual: monadDual, 
    extendDual: extendDual, 
    comonadDual: comonadDual, 
    invariantDual: invariantDual, 
    showDual: showDual, 
    semigroupDual: semigroupDual, 
    monoidDual: monoidDual
};

},{"Control.Comonad":"/Users/maximko/Projects/mine/guppi/output/Control.Comonad/index.js","Control.Extend":"/Users/maximko/Projects/mine/guppi/output/Control.Extend/index.js","Data.Functor.Invariant":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Invariant/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Endo/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Functor_Invariant = require("Data.Functor.Invariant");
var Data_Monoid = require("Data.Monoid");
var Endo = function (x) {
    return x;
};
var semigroupEndo = new Prelude.Semigroup(function (_2) {
    return function (_3) {
        return function (_10) {
            return _2(_3(_10));
        };
    };
});
var runEndo = function (_0) {
    return _0;
};
var monoidEndo = new Data_Monoid.Monoid(function () {
    return semigroupEndo;
}, Prelude.id(Prelude.categoryFn));
var invariantEndo = new Data_Functor_Invariant.Invariant(function (ab) {
    return function (ba) {
        return function (_1) {
            return function (_11) {
                return ab(_1(ba(_11)));
            };
        };
    };
});
module.exports = {
    Endo: Endo, 
    runEndo: runEndo, 
    invariantEndo: invariantEndo, 
    semigroupEndo: semigroupEndo, 
    monoidEndo: monoidEndo
};

},{"Data.Functor.Invariant":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Invariant/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Multiplicative/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Comonad = require("Control.Comonad");
var Control_Extend = require("Control.Extend");
var Data_Functor_Invariant = require("Data.Functor.Invariant");
var Data_Monoid = require("Data.Monoid");
var Multiplicative = function (x) {
    return x;
};
var showMultiplicative = function (__dict_Show_0) {
    return new Prelude.Show(function (_11) {
        return "Multiplicative (" + (Prelude.show(__dict_Show_0)(_11) + ")");
    });
};
var semigroupMultiplicative = function (__dict_Semiring_1) {
    return new Prelude.Semigroup(function (_12) {
        return function (_13) {
            return Prelude["*"](__dict_Semiring_1)(_12)(_13);
        };
    });
};
var runMultiplicative = function (_0) {
    return _0;
};
var monoidMultiplicative = function (__dict_Semiring_3) {
    return new Data_Monoid.Monoid(function () {
        return semigroupMultiplicative(__dict_Semiring_3);
    }, Prelude.one(__dict_Semiring_3));
};
var invariantMultiplicative = new Data_Functor_Invariant.Invariant(function (f) {
    return function (_9) {
        return function (_10) {
            return f(_10);
        };
    };
});
var functorMultiplicative = new Prelude.Functor(function (f) {
    return function (_5) {
        return f(_5);
    };
});
var extendMultiplicative = new Control_Extend.Extend(function () {
    return functorMultiplicative;
}, function (f) {
    return function (x) {
        return f(x);
    };
});
var eqMultiplicative = function (__dict_Eq_4) {
    return new Prelude.Eq(function (_1) {
        return function (_2) {
            return Prelude["=="](__dict_Eq_4)(_1)(_2);
        };
    });
};
var ordMultiplicative = function (__dict_Ord_2) {
    return new Prelude.Ord(function () {
        return eqMultiplicative(__dict_Ord_2["__superclass_Prelude.Eq_0"]());
    }, function (_3) {
        return function (_4) {
            return Prelude.compare(__dict_Ord_2)(_3)(_4);
        };
    });
};
var comonadMultiplicative = new Control_Comonad.Comonad(function () {
    return extendMultiplicative;
}, runMultiplicative);
var applyMultiplicative = new Prelude.Apply(function () {
    return functorMultiplicative;
}, function (_6) {
    return function (_7) {
        return _6(_7);
    };
});
var bindMultiplicative = new Prelude.Bind(function () {
    return applyMultiplicative;
}, function (_8) {
    return function (f) {
        return f(_8);
    };
});
var applicativeMultiplicative = new Prelude.Applicative(function () {
    return applyMultiplicative;
}, Multiplicative);
var monadMultiplicative = new Prelude.Monad(function () {
    return applicativeMultiplicative;
}, function () {
    return bindMultiplicative;
});
module.exports = {
    Multiplicative: Multiplicative, 
    runMultiplicative: runMultiplicative, 
    eqMultiplicative: eqMultiplicative, 
    ordMultiplicative: ordMultiplicative, 
    functorMultiplicative: functorMultiplicative, 
    applyMultiplicative: applyMultiplicative, 
    applicativeMultiplicative: applicativeMultiplicative, 
    bindMultiplicative: bindMultiplicative, 
    monadMultiplicative: monadMultiplicative, 
    extendMultiplicative: extendMultiplicative, 
    comonadMultiplicative: comonadMultiplicative, 
    invariantMultiplicative: invariantMultiplicative, 
    showMultiplicative: showMultiplicative, 
    semigroupMultiplicative: semigroupMultiplicative, 
    monoidMultiplicative: monoidMultiplicative
};

},{"Control.Comonad":"/Users/maximko/Projects/mine/guppi/output/Control.Comonad/index.js","Control.Extend":"/Users/maximko/Projects/mine/guppi/output/Control.Extend/index.js","Data.Functor.Invariant":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Invariant/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Monoid = function (__superclass_Prelude$dotSemigroup_0, mempty) {
    this["__superclass_Prelude.Semigroup_0"] = __superclass_Prelude$dotSemigroup_0;
    this.mempty = mempty;
};
var monoidUnit = new Monoid(function () {
    return Prelude.semigroupUnit;
}, Prelude.unit);
var monoidString = new Monoid(function () {
    return Prelude.semigroupString;
}, "");
var monoidArray = new Monoid(function () {
    return Prelude.semigroupArray;
}, [  ]);
var mempty = function (dict) {
    return dict.mempty;
};
var monoidFn = function (__dict_Monoid_0) {
    return new Monoid(function () {
        return Prelude.semigroupFn(__dict_Monoid_0["__superclass_Prelude.Semigroup_0"]());
    }, Prelude["const"](mempty(__dict_Monoid_0)));
};
module.exports = {
    Monoid: Monoid, 
    mempty: mempty, 
    monoidUnit: monoidUnit, 
    monoidFn: monoidFn, 
    monoidString: monoidString, 
    monoidArray: monoidArray
};

},{"Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.NaturalTransformation/index.js":[function(require,module,exports){
arguments[4]["/Users/maximko/Projects/mine/guppi/output/DOM/index.js"][0].apply(exports,arguments)
},{}],"/Users/maximko/Projects/mine/guppi/output/Data.Nullable/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Data.Nullable

exports["null"] = null;

exports.nullable = function(a, r, f) {
    return a == null ? r : f(a);
};

exports.notNull = function(x) {
    return x;
}; 

},{}],"/Users/maximko/Projects/mine/guppi/output/Data.Nullable/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Data_Maybe = require("Data.Maybe");
var Data_Function = require("Data.Function");
var toNullable = Data_Maybe.maybe($foreign["null"])($foreign.notNull);
var toMaybe = function (n) {
    return $foreign.nullable(n, Data_Maybe.Nothing.value, Data_Maybe.Just.create);
};
var showNullable = function (__dict_Show_0) {
    return new Prelude.Show(function (n) {
        var _0 = toMaybe(n);
        if (_0 instanceof Data_Maybe.Nothing) {
            return "null";
        };
        if (_0 instanceof Data_Maybe.Just) {
            return Prelude.show(__dict_Show_0)(_0.value0);
        };
        throw new Error("Failed pattern match at Data.Nullable line 37, column 1 - line 42, column 1: " + [ _0.constructor.name ]);
    });
};
var eqNullable = function (__dict_Eq_2) {
    return new Prelude.Eq(Data_Function.on(Prelude.eq(Data_Maybe.eqMaybe(__dict_Eq_2)))(toMaybe));
};
var ordNullable = function (__dict_Ord_1) {
    return new Prelude.Ord(function () {
        return eqNullable(__dict_Ord_1["__superclass_Prelude.Eq_0"]());
    }, Data_Function.on(Prelude.compare(Data_Maybe.ordMaybe(__dict_Ord_1)))(toMaybe));
};
module.exports = {
    toNullable: toNullable, 
    toMaybe: toMaybe, 
    showNullable: showNullable, 
    eqNullable: eqNullable, 
    ordNullable: ordNullable
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Nullable/foreign.js","Data.Function":"/Users/maximko/Projects/mine/guppi/output/Data.Function/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Profunctor.Choice/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Either = require("Data.Either");
var Data_Profunctor = require("Data.Profunctor");
var Choice = function (__superclass_Data$dotProfunctor$dotProfunctor_0, left, right) {
    this["__superclass_Data.Profunctor.Profunctor_0"] = __superclass_Data$dotProfunctor$dotProfunctor_0;
    this.left = left;
    this.right = right;
};
var right = function (dict) {
    return dict.right;
};
var left = function (dict) {
    return dict.left;
};
var $plus$plus$plus = function (__dict_Category_0) {
    return function (__dict_Choice_1) {
        return function (l) {
            return function (r) {
                return Prelude[">>>"](__dict_Category_0["__superclass_Prelude.Semigroupoid_0"]())(left(__dict_Choice_1)(l))(right(__dict_Choice_1)(r));
            };
        };
    };
};
var $bar$bar$bar = function (__dict_Category_2) {
    return function (__dict_Choice_3) {
        return function (l) {
            return function (r) {
                var join = Data_Profunctor.dimap(__dict_Choice_3["__superclass_Data.Profunctor.Profunctor_0"]())(Data_Either.either(Prelude.id(Prelude.categoryFn))(Prelude.id(Prelude.categoryFn)))(Prelude.id(Prelude.categoryFn))(Prelude.id(__dict_Category_2));
                return Prelude[">>>"](__dict_Category_2["__superclass_Prelude.Semigroupoid_0"]())($plus$plus$plus(__dict_Category_2)(__dict_Choice_3)(l)(r))(join);
            };
        };
    };
};
var choiceFn = new Choice(function () {
    return Data_Profunctor.profunctorFn;
}, function (a2b) {
    return function (_0) {
        if (_0 instanceof Data_Either.Left) {
            return Data_Either.Left.create(a2b(_0.value0));
        };
        if (_0 instanceof Data_Either.Right) {
            return new Data_Either.Right(_0.value0);
        };
        throw new Error("Failed pattern match at Data.Profunctor.Choice line 17, column 1 - line 22, column 1: " + [ a2b.constructor.name, _0.constructor.name ]);
    };
}, Prelude["<$>"](Data_Either.functorEither));
module.exports = {
    Choice: Choice, 
    "|||": $bar$bar$bar, 
    "+++": $plus$plus$plus, 
    right: right, 
    left: left, 
    choiceFn: choiceFn
};

},{"Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Profunctor":"/Users/maximko/Projects/mine/guppi/output/Data.Profunctor/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Profunctor/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Profunctor = function (dimap) {
    this.dimap = dimap;
};
var profunctorFn = new Profunctor(function (a2b) {
    return function (c2d) {
        return function (b2c) {
            return Prelude[">>>"](Prelude.semigroupoidFn)(a2b)(Prelude[">>>"](Prelude.semigroupoidFn)(b2c)(c2d));
        };
    };
});
var dimap = function (dict) {
    return dict.dimap;
};
var lmap = function (__dict_Profunctor_0) {
    return function (a2b) {
        return dimap(__dict_Profunctor_0)(a2b)(Prelude.id(Prelude.categoryFn));
    };
};
var rmap = function (__dict_Profunctor_1) {
    return function (b2c) {
        return dimap(__dict_Profunctor_1)(Prelude.id(Prelude.categoryFn))(b2c);
    };
};
var arr = function (__dict_Category_2) {
    return function (__dict_Profunctor_3) {
        return function (f) {
            return rmap(__dict_Profunctor_3)(f)(Prelude.id(__dict_Category_2));
        };
    };
};
module.exports = {
    Profunctor: Profunctor, 
    arr: arr, 
    rmap: rmap, 
    lmap: lmap, 
    dimap: dimap, 
    profunctorFn: profunctorFn
};

},{"Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.String.Unsafe/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Data.String.Unsafe

exports.charCodeAt = function (i) {
  return function (s) {
    if (i >= 0 && i < s.length) return s.charCodeAt(i);
    throw new Error("Data.String.Unsafe.charCodeAt: Invalid index.");
  };
};

exports.charAt = function (i) {
  return function (s) {
    if (i >= 0 && i < s.length) return s.charAt(i);
    throw new Error("Data.String.Unsafe.charAt: Invalid index.");
  };
};

exports.char = function (s) {
  if (s.length === 1) return s.charAt(0);
  throw new Error("Data.String.Unsafe.char: Expected string of length 1.");
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Data.String.Unsafe/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
module.exports = {
    charCodeAt: $foreign.charCodeAt, 
    charAt: $foreign.charAt, 
    "char": $foreign["char"]
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Data.String.Unsafe/foreign.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.String/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Data.String

exports._charAt = function (just) {
  return function (nothing) {
    return function (i) {
      return function (s) {
        return i >= 0 && i < s.length ? just(s.charAt(i)) : nothing;
      };
    };
  };
};

exports._charCodeAt = function (just) {
  return function (nothing) {
    return function (i) {
      return function (s) {
        return i >= 0 && i < s.length ? just(s.charCodeAt(i)) : nothing;
      };
    };
  };
};

exports._toChar = function (just) {
  return function (nothing) {
    return function (s) {
      return s.length === 1 ? just(s) : nothing;
    };
  };
};

exports.fromCharArray = function (a) {
  return a.join("");
};

exports._indexOf = function (just) {
  return function (nothing) {
    return function (x) {
      return function (s) {
        var i = s.indexOf(x);
        return i === -1 ? nothing : just(i);
      };
    };
  };
};

exports["_indexOf'"] = function (just) {
  return function (nothing) {
    return function (x) {
      return function (startAt) {
        return function (s) {
          if (startAt < 0 || startAt > s.length) return nothing;
          var i = s.indexOf(x, startAt);
          return i === -1 ? nothing : just(i);
        };
      };
    };
  };
};

exports._lastIndexOf = function (just) {
  return function (nothing) {
    return function (x) {
      return function (s) {
        var i = s.lastIndexOf(x);
        return i === -1 ? nothing : just(i);
      };
    };
  };
};

exports["_lastIndexOf'"] = function (just) {
  return function (nothing) {
    return function (x) {
      return function (startAt) {
        return function (s) {
          if (startAt < 0 || startAt > s.length) return nothing;
          var i = s.lastIndexOf(x, startAt);
          return i === -1 ? nothing : just(i);
        };
      };
    };
  };
};

exports.length = function (s) {
  return s.length;
};

exports._localeCompare = function (lt) {
  return function (eq) {
    return function (gt) {
      return function (s1) {
        return function (s2) {
          var result = s1.localeCompare(s2);
          return result < 0 ? lt : result > 0 ? gt : eq;
        };
      };
    };
  };
};

exports.replace = function (s1) {
  return function (s2) {
    return function (s3) {
      return s3.replace(s1, s2);
    };
  };
};

exports.take = function (n) {
  return function (s) {
    return s.substr(0, n);
  };
};

exports.drop = function (n) {
  return function (s) {
    return s.substr(n);
  };
};

exports.count = function (p) {
  return function (s) {
    for (var i = 0; i < s.length && p(s.charAt(i)); i++); {}
    return i;
  };
};

exports.split = function (sep) {
  return function (s) {
    return s.split(sep);
  };
};

exports.toCharArray = function (s) {
  return s.split("");
};

exports.toLower = function (s) {
  return s.toLowerCase();
};

exports.toUpper = function (s) {
  return s.toUpperCase();
};

exports.trim = function (s) {
  return s.trim();
};

exports.joinWith = function (s) {
  return function (xs) {
    return xs.join(s);
  };
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Data.String/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Data_Char = require("Data.Char");
var Data_Maybe = require("Data.Maybe");
var Data_Monoid = require("Data.Monoid");
var Data_String_Unsafe = require("Data.String.Unsafe");
var uncons = function (_0) {
    if (_0 === "") {
        return Data_Maybe.Nothing.value;
    };
    return new Data_Maybe.Just({
        head: Data_String_Unsafe.charAt(0)(_0), 
        tail: $foreign.drop(1)(_0)
    });
};
var toChar = $foreign._toChar(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var takeWhile = function (p) {
    return function (s) {
        return $foreign.take($foreign.count(p)(s))(s);
    };
};
var $$null = function (s) {
    return $foreign.length(s) === 0;
};
var localeCompare = $foreign._localeCompare(Prelude.LT.value)(Prelude.EQ.value)(Prelude.GT.value);
var lastIndexOf$prime = $foreign["_lastIndexOf'"](Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var lastIndexOf = $foreign._lastIndexOf(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var stripSuffix = function (suffix) {
    return function (str) {
        var _2 = lastIndexOf(suffix)(str);
        if (_2 instanceof Data_Maybe.Just && _2.value0 === $foreign.length(str) - $foreign.length(suffix)) {
            return Data_Maybe.Just.create($foreign.take(_2.value0)(str));
        };
        return Data_Maybe.Nothing.value;
    };
};
var indexOf$prime = $foreign["_indexOf'"](Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var indexOf = $foreign._indexOf(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var stripPrefix = function (prefix) {
    return function (str) {
        var _4 = indexOf(prefix)(str);
        if (_4 instanceof Data_Maybe.Just && _4.value0 === 0) {
            return Data_Maybe.Just.create($foreign.drop($foreign.length(prefix))(str));
        };
        return Data_Maybe.Nothing.value;
    };
};
var fromChar = Data_Char.toString;
var singleton = fromChar;
var dropWhile = function (p) {
    return function (s) {
        return $foreign.drop($foreign.count(p)(s))(s);
    };
};
var contains = function (x) {
    return function (s) {
        return Data_Maybe.isJust(indexOf(x)(s));
    };
};
var charCodeAt = $foreign._charCodeAt(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
var charAt = $foreign._charAt(Data_Maybe.Just.create)(Data_Maybe.Nothing.value);
module.exports = {
    stripSuffix: stripSuffix, 
    stripPrefix: stripPrefix, 
    dropWhile: dropWhile, 
    takeWhile: takeWhile, 
    localeCompare: localeCompare, 
    singleton: singleton, 
    uncons: uncons, 
    "null": $$null, 
    "lastIndexOf'": lastIndexOf$prime, 
    lastIndexOf: lastIndexOf, 
    "indexOf'": indexOf$prime, 
    indexOf: indexOf, 
    contains: contains, 
    toChar: toChar, 
    fromChar: fromChar, 
    charCodeAt: charCodeAt, 
    charAt: charAt, 
    joinWith: $foreign.joinWith, 
    trim: $foreign.trim, 
    toUpper: $foreign.toUpper, 
    toLower: $foreign.toLower, 
    toCharArray: $foreign.toCharArray, 
    split: $foreign.split, 
    drop: $foreign.drop, 
    take: $foreign.take, 
    count: $foreign.count, 
    replace: $foreign.replace, 
    length: $foreign.length, 
    fromCharArray: $foreign.fromCharArray
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Data.String/foreign.js","Data.Char":"/Users/maximko/Projects/mine/guppi/output/Data.Char/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.String.Unsafe":"/Users/maximko/Projects/mine/guppi/output/Data.String.Unsafe/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Traversable/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Data.Traversable

// jshint maxparams: 3

exports.traverseArrayImpl = function () {
  function Cont (fn) {
    this.fn = fn;
  }

  var emptyList = {};

  var ConsCell = function (head, tail) {
    this.head = head;
    this.tail = tail;
  };

  function consList (x) {
    return function (xs) {
      return new ConsCell(x, xs);
    };
  }

  function listToArray (list) {
    var arr = [];
    while (list !== emptyList) {
      arr.push(list.head);
      list = list.tail;
    }
    return arr;
  }

  return function (apply) {
    return function (map) {
      return function (pure) {
        return function (f) {
          var buildFrom = function (x, ys) {
            return apply(map(consList)(f(x)))(ys);
          };

          var go = function (acc, currentLen, xs) {
            if (currentLen === 0) {
              return acc;
            } else {
              var last = xs[currentLen - 1];
              return new Cont(function () {
                return go(buildFrom(last, acc), currentLen - 1, xs);
              });
            }
          };

          return function (array) {
            var result = go(pure(emptyList), array.length, array);
            while (result instanceof Cont) {
              result = result.fn();
            }

            return map(listToArray)(result);
          };
        };
      };
    };
  };
}();

},{}],"/Users/maximko/Projects/mine/guppi/output/Data.Traversable/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Data_Foldable = require("Data.Foldable");
var Data_Maybe = require("Data.Maybe");
var Data_Maybe_First = require("Data.Maybe.First");
var Data_Maybe_Last = require("Data.Maybe.Last");
var Data_Monoid_Additive = require("Data.Monoid.Additive");
var Data_Monoid_Conj = require("Data.Monoid.Conj");
var Data_Monoid_Disj = require("Data.Monoid.Disj");
var Data_Monoid_Dual = require("Data.Monoid.Dual");
var Data_Monoid_Multiplicative = require("Data.Monoid.Multiplicative");
var StateL = function (x) {
    return x;
};
var StateR = function (x) {
    return x;
};
var Traversable = function (__superclass_Data$dotFoldable$dotFoldable_1, __superclass_Prelude$dotFunctor_0, sequence, traverse) {
    this["__superclass_Data.Foldable.Foldable_1"] = __superclass_Data$dotFoldable$dotFoldable_1;
    this["__superclass_Prelude.Functor_0"] = __superclass_Prelude$dotFunctor_0;
    this.sequence = sequence;
    this.traverse = traverse;
};
var traverse = function (dict) {
    return dict.traverse;
};
var traversableMultiplicative = new Traversable(function () {
    return Data_Foldable.foldableMultiplicative;
}, function () {
    return Data_Monoid_Multiplicative.functorMultiplicative;
}, function (__dict_Applicative_1) {
    return function (_17) {
        return Prelude["<$>"]((__dict_Applicative_1["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Monoid_Multiplicative.Multiplicative)(_17);
    };
}, function (__dict_Applicative_0) {
    return function (f) {
        return function (_16) {
            return Prelude["<$>"]((__dict_Applicative_0["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Monoid_Multiplicative.Multiplicative)(f(_16));
        };
    };
});
var traversableMaybe = new Traversable(function () {
    return Data_Foldable.foldableMaybe;
}, function () {
    return Data_Maybe.functorMaybe;
}, function (__dict_Applicative_3) {
    return function (_3) {
        if (_3 instanceof Data_Maybe.Nothing) {
            return Prelude.pure(__dict_Applicative_3)(Data_Maybe.Nothing.value);
        };
        if (_3 instanceof Data_Maybe.Just) {
            return Prelude["<$>"]((__dict_Applicative_3["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Maybe.Just.create)(_3.value0);
        };
        throw new Error("Failed pattern match at Data.Traversable line 76, column 1 - line 82, column 1: " + [ _3.constructor.name ]);
    };
}, function (__dict_Applicative_2) {
    return function (f) {
        return function (_2) {
            if (_2 instanceof Data_Maybe.Nothing) {
                return Prelude.pure(__dict_Applicative_2)(Data_Maybe.Nothing.value);
            };
            if (_2 instanceof Data_Maybe.Just) {
                return Prelude["<$>"]((__dict_Applicative_2["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Maybe.Just.create)(f(_2.value0));
            };
            throw new Error("Failed pattern match at Data.Traversable line 76, column 1 - line 82, column 1: " + [ f.constructor.name, _2.constructor.name ]);
        };
    };
});
var traversableDual = new Traversable(function () {
    return Data_Foldable.foldableDual;
}, function () {
    return Data_Monoid_Dual.functorDual;
}, function (__dict_Applicative_5) {
    return function (_11) {
        return Prelude["<$>"]((__dict_Applicative_5["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Monoid_Dual.Dual)(_11);
    };
}, function (__dict_Applicative_4) {
    return function (f) {
        return function (_10) {
            return Prelude["<$>"]((__dict_Applicative_4["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Monoid_Dual.Dual)(f(_10));
        };
    };
});
var traversableDisj = new Traversable(function () {
    return Data_Foldable.foldableDisj;
}, function () {
    return Data_Monoid_Disj.functorDisj;
}, function (__dict_Applicative_7) {
    return function (_15) {
        return Prelude["<$>"]((__dict_Applicative_7["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Monoid_Disj.Disj)(_15);
    };
}, function (__dict_Applicative_6) {
    return function (f) {
        return function (_14) {
            return Prelude["<$>"]((__dict_Applicative_6["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Monoid_Disj.Disj)(f(_14));
        };
    };
});
var traversableConj = new Traversable(function () {
    return Data_Foldable.foldableConj;
}, function () {
    return Data_Monoid_Conj.functorConj;
}, function (__dict_Applicative_9) {
    return function (_13) {
        return Prelude["<$>"]((__dict_Applicative_9["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Monoid_Conj.Conj)(_13);
    };
}, function (__dict_Applicative_8) {
    return function (f) {
        return function (_12) {
            return Prelude["<$>"]((__dict_Applicative_8["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Monoid_Conj.Conj)(f(_12));
        };
    };
});
var traversableAdditive = new Traversable(function () {
    return Data_Foldable.foldableAdditive;
}, function () {
    return Data_Monoid_Additive.functorAdditive;
}, function (__dict_Applicative_11) {
    return function (_9) {
        return Prelude["<$>"]((__dict_Applicative_11["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Monoid_Additive.Additive)(_9);
    };
}, function (__dict_Applicative_10) {
    return function (f) {
        return function (_8) {
            return Prelude["<$>"]((__dict_Applicative_10["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Monoid_Additive.Additive)(f(_8));
        };
    };
});
var stateR = function (_1) {
    return _1;
};
var stateL = function (_0) {
    return _0;
};
var sequenceDefault = function (__dict_Traversable_12) {
    return function (__dict_Applicative_13) {
        return function (tma) {
            return traverse(__dict_Traversable_12)(__dict_Applicative_13)(Prelude.id(Prelude.categoryFn))(tma);
        };
    };
};
var traversableArray = new Traversable(function () {
    return Data_Foldable.foldableArray;
}, function () {
    return Prelude.functorArray;
}, function (__dict_Applicative_15) {
    return sequenceDefault(traversableArray)(__dict_Applicative_15);
}, function (__dict_Applicative_14) {
    return $foreign.traverseArrayImpl(Prelude.apply(__dict_Applicative_14["__superclass_Prelude.Apply_0"]()))(Prelude.map((__dict_Applicative_14["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]()))(Prelude.pure(__dict_Applicative_14));
});
var sequence = function (dict) {
    return dict.sequence;
};
var traversableFirst = new Traversable(function () {
    return Data_Foldable.foldableFirst;
}, function () {
    return Data_Maybe_First.functorFirst;
}, function (__dict_Applicative_17) {
    return function (_5) {
        return Prelude["<$>"]((__dict_Applicative_17["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Maybe_First.First)(sequence(traversableMaybe)(__dict_Applicative_17)(_5));
    };
}, function (__dict_Applicative_16) {
    return function (f) {
        return function (_4) {
            return Prelude["<$>"]((__dict_Applicative_16["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Maybe_First.First)(traverse(traversableMaybe)(__dict_Applicative_16)(f)(_4));
        };
    };
});
var traversableLast = new Traversable(function () {
    return Data_Foldable.foldableLast;
}, function () {
    return Data_Maybe_Last.functorLast;
}, function (__dict_Applicative_19) {
    return function (_7) {
        return Prelude["<$>"]((__dict_Applicative_19["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Maybe_Last.Last)(sequence(traversableMaybe)(__dict_Applicative_19)(_7));
    };
}, function (__dict_Applicative_18) {
    return function (f) {
        return function (_6) {
            return Prelude["<$>"]((__dict_Applicative_18["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Maybe_Last.Last)(traverse(traversableMaybe)(__dict_Applicative_18)(f)(_6));
        };
    };
});
var traverseDefault = function (__dict_Traversable_20) {
    return function (__dict_Applicative_21) {
        return function (f) {
            return function (ta) {
                return sequence(__dict_Traversable_20)(__dict_Applicative_21)(Prelude.map(__dict_Traversable_20["__superclass_Prelude.Functor_0"]())(f)(ta));
            };
        };
    };
};
var functorStateR = new Prelude.Functor(function (f) {
    return function (k) {
        return function (s) {
            var _46 = stateR(k)(s);
            return {
                accum: _46.accum, 
                value: f(_46.value)
            };
        };
    };
});
var functorStateL = new Prelude.Functor(function (f) {
    return function (k) {
        return function (s) {
            var _49 = stateL(k)(s);
            return {
                accum: _49.accum, 
                value: f(_49.value)
            };
        };
    };
});
var $$for = function (__dict_Applicative_26) {
    return function (__dict_Traversable_27) {
        return function (x) {
            return function (f) {
                return traverse(__dict_Traversable_27)(__dict_Applicative_26)(f)(x);
            };
        };
    };
};
var applyStateR = new Prelude.Apply(function () {
    return functorStateR;
}, function (f) {
    return function (x) {
        return function (s) {
            var _52 = stateR(x)(s);
            var _53 = stateR(f)(_52.accum);
            return {
                accum: _53.accum, 
                value: _53.value(_52.value)
            };
        };
    };
});
var applyStateL = new Prelude.Apply(function () {
    return functorStateL;
}, function (f) {
    return function (x) {
        return function (s) {
            var _58 = stateL(f)(s);
            var _59 = stateL(x)(_58.accum);
            return {
                accum: _59.accum, 
                value: _58.value(_59.value)
            };
        };
    };
});
var applicativeStateR = new Prelude.Applicative(function () {
    return applyStateR;
}, function (a) {
    return function (s) {
        return {
            accum: s, 
            value: a
        };
    };
});
var mapAccumR = function (__dict_Traversable_22) {
    return function (f) {
        return function (s0) {
            return function (xs) {
                return stateR(traverse(__dict_Traversable_22)(applicativeStateR)(function (a) {
                    return function (s) {
                        return f(s)(a);
                    };
                })(xs))(s0);
            };
        };
    };
};
var scanr = function (__dict_Traversable_23) {
    return function (f) {
        return function (b0) {
            return function (xs) {
                return (mapAccumR(__dict_Traversable_23)(function (b) {
                    return function (a) {
                        var b$prime = f(a)(b);
                        return {
                            accum: b$prime, 
                            value: b$prime
                        };
                    };
                })(b0)(xs)).value;
            };
        };
    };
};
var applicativeStateL = new Prelude.Applicative(function () {
    return applyStateL;
}, function (a) {
    return function (s) {
        return {
            accum: s, 
            value: a
        };
    };
});
var mapAccumL = function (__dict_Traversable_24) {
    return function (f) {
        return function (s0) {
            return function (xs) {
                return stateL(traverse(__dict_Traversable_24)(applicativeStateL)(function (a) {
                    return function (s) {
                        return f(s)(a);
                    };
                })(xs))(s0);
            };
        };
    };
};
var scanl = function (__dict_Traversable_25) {
    return function (f) {
        return function (b0) {
            return function (xs) {
                return (mapAccumL(__dict_Traversable_25)(function (b) {
                    return function (a) {
                        var b$prime = f(b)(a);
                        return {
                            accum: b$prime, 
                            value: b$prime
                        };
                    };
                })(b0)(xs)).value;
            };
        };
    };
};
module.exports = {
    Traversable: Traversable, 
    mapAccumR: mapAccumR, 
    mapAccumL: mapAccumL, 
    scanr: scanr, 
    scanl: scanl, 
    "for": $$for, 
    sequenceDefault: sequenceDefault, 
    traverseDefault: traverseDefault, 
    sequence: sequence, 
    traverse: traverse, 
    traversableArray: traversableArray, 
    traversableMaybe: traversableMaybe, 
    traversableFirst: traversableFirst, 
    traversableLast: traversableLast, 
    traversableAdditive: traversableAdditive, 
    traversableDual: traversableDual, 
    traversableConj: traversableConj, 
    traversableDisj: traversableDisj, 
    traversableMultiplicative: traversableMultiplicative
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Traversable/foreign.js","Data.Foldable":"/Users/maximko/Projects/mine/guppi/output/Data.Foldable/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Maybe.First":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe.First/index.js","Data.Maybe.Last":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe.Last/index.js","Data.Monoid.Additive":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Additive/index.js","Data.Monoid.Conj":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Conj/index.js","Data.Monoid.Disj":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Disj/index.js","Data.Monoid.Dual":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Dual/index.js","Data.Monoid.Multiplicative":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid.Multiplicative/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Biapplicative = require("Control.Biapplicative");
var Control_Biapply = require("Control.Biapply");
var Control_Comonad = require("Control.Comonad");
var Control_Extend = require("Control.Extend");
var Control_Lazy = require("Control.Lazy");
var Data_Bifoldable = require("Data.Bifoldable");
var Data_Bifunctor = require("Data.Bifunctor");
var Data_Bitraversable = require("Data.Bitraversable");
var Data_Foldable = require("Data.Foldable");
var Data_Functor_Invariant = require("Data.Functor.Invariant");
var Data_Maybe = require("Data.Maybe");
var Data_Maybe_First = require("Data.Maybe.First");
var Data_Monoid = require("Data.Monoid");
var Data_Traversable = require("Data.Traversable");
var Tuple = (function () {
    function Tuple(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Tuple.create = function (value0) {
        return function (value1) {
            return new Tuple(value0, value1);
        };
    };
    return Tuple;
})();
var uncurry = function (f) {
    return function (_5) {
        return f(_5.value0)(_5.value1);
    };
};
var swap = function (_6) {
    return new Tuple(_6.value1, _6.value0);
};
var snd = function (_4) {
    return _4.value1;
};
var showTuple = function (__dict_Show_2) {
    return function (__dict_Show_3) {
        return new Prelude.Show(function (_7) {
            return "Tuple (" + (Prelude.show(__dict_Show_2)(_7.value0) + (") (" + (Prelude.show(__dict_Show_3)(_7.value1) + ")")));
        });
    };
};
var semiringTuple = function (__dict_Semiring_4) {
    return function (__dict_Semiring_5) {
        return new Prelude.Semiring(function (_16) {
            return function (_17) {
                return new Tuple(Prelude.add(__dict_Semiring_4)(_16.value0)(_17.value0), Prelude.add(__dict_Semiring_5)(_16.value1)(_17.value1));
            };
        }, function (_18) {
            return function (_19) {
                return new Tuple(Prelude.mul(__dict_Semiring_4)(_18.value0)(_19.value0), Prelude.mul(__dict_Semiring_5)(_18.value1)(_19.value1));
            };
        }, new Tuple(Prelude.one(__dict_Semiring_4), Prelude.one(__dict_Semiring_5)), new Tuple(Prelude.zero(__dict_Semiring_4), Prelude.zero(__dict_Semiring_5)));
    };
};
var semigroupoidTuple = new Prelude.Semigroupoid(function (_12) {
    return function (_13) {
        return new Tuple(_13.value0, _12.value1);
    };
});
var semigroupTuple = function (__dict_Semigroup_6) {
    return function (__dict_Semigroup_7) {
        return new Prelude.Semigroup(function (_14) {
            return function (_15) {
                return new Tuple(Prelude["<>"](__dict_Semigroup_6)(_14.value0)(_15.value0), Prelude["<>"](__dict_Semigroup_7)(_14.value1)(_15.value1));
            };
        });
    };
};
var ringTuple = function (__dict_Ring_8) {
    return function (__dict_Ring_9) {
        return new Prelude.Ring(function () {
            return semiringTuple(__dict_Ring_8["__superclass_Prelude.Semiring_0"]())(__dict_Ring_9["__superclass_Prelude.Semiring_0"]());
        }, function (_24) {
            return function (_25) {
                return new Tuple(Prelude.sub(__dict_Ring_8)(_24.value0)(_25.value0), Prelude.sub(__dict_Ring_9)(_24.value1)(_25.value1));
            };
        });
    };
};
var monoidTuple = function (__dict_Monoid_14) {
    return function (__dict_Monoid_15) {
        return new Data_Monoid.Monoid(function () {
            return semigroupTuple(__dict_Monoid_14["__superclass_Prelude.Semigroup_0"]())(__dict_Monoid_15["__superclass_Prelude.Semigroup_0"]());
        }, new Tuple(Data_Monoid.mempty(__dict_Monoid_14), Data_Monoid.mempty(__dict_Monoid_15)));
    };
};
var moduloSemiringTuple = function (__dict_ModuloSemiring_17) {
    return function (__dict_ModuloSemiring_18) {
        return new Prelude.ModuloSemiring(function () {
            return semiringTuple(__dict_ModuloSemiring_17["__superclass_Prelude.Semiring_0"]())(__dict_ModuloSemiring_18["__superclass_Prelude.Semiring_0"]());
        }, function (_20) {
            return function (_21) {
                return new Tuple(Prelude.div(__dict_ModuloSemiring_17)(_20.value0)(_21.value0), Prelude.div(__dict_ModuloSemiring_18)(_20.value1)(_21.value1));
            };
        }, function (_22) {
            return function (_23) {
                return new Tuple(Prelude.mod(__dict_ModuloSemiring_17)(_22.value0)(_23.value0), Prelude.mod(__dict_ModuloSemiring_18)(_22.value1)(_23.value1));
            };
        });
    };
};
var lookup = function (__dict_Foldable_19) {
    return function (__dict_Eq_20) {
        return function (a) {
            return function (f) {
                return Data_Maybe_First.runFirst(Data_Foldable.foldMap(__dict_Foldable_19)(Data_Maybe_First.monoidFirst)(function (_2) {
                    var _105 = Prelude["=="](__dict_Eq_20)(a)(_2.value0);
                    if (_105) {
                        return new Data_Maybe.Just(_2.value1);
                    };
                    if (!_105) {
                        return Data_Maybe.Nothing.value;
                    };
                    throw new Error("Failed pattern match at Data.Tuple line 173, column 1 - line 174, column 1: " + [ _105.constructor.name ]);
                })(f));
            };
        };
    };
};
var functorTuple = new Prelude.Functor(function (f) {
    return function (_31) {
        return new Tuple(_31.value0, f(_31.value1));
    };
});
var invariantTuple = new Data_Functor_Invariant.Invariant(Data_Functor_Invariant.imapF(functorTuple));
var fst = function (_3) {
    return _3.value0;
};
var lazyTuple = function (__dict_Lazy_21) {
    return function (__dict_Lazy_22) {
        return new Control_Lazy.Lazy(function (f) {
            return new Tuple(Control_Lazy.defer(__dict_Lazy_21)(function (_0) {
                return fst(f(Prelude.unit));
            }), Control_Lazy.defer(__dict_Lazy_22)(function (_1) {
                return snd(f(Prelude.unit));
            }));
        });
    };
};
var foldableTuple = new Data_Foldable.Foldable(function (__dict_Monoid_23) {
    return function (f) {
        return function (_41) {
            return f(_41.value1);
        };
    };
}, function (f) {
    return function (z) {
        return function (_40) {
            return f(z)(_40.value1);
        };
    };
}, function (f) {
    return function (z) {
        return function (_39) {
            return f(_39.value1)(z);
        };
    };
});
var traversableTuple = new Data_Traversable.Traversable(function () {
    return foldableTuple;
}, function () {
    return functorTuple;
}, function (__dict_Applicative_1) {
    return function (_46) {
        return Prelude["<$>"]((__dict_Applicative_1["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Tuple.create(_46.value0))(_46.value1);
    };
}, function (__dict_Applicative_0) {
    return function (f) {
        return function (_45) {
            return Prelude["<$>"]((__dict_Applicative_0["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Tuple.create(_45.value0))(f(_45.value1));
        };
    };
});
var extendTuple = new Control_Extend.Extend(function () {
    return functorTuple;
}, function (f) {
    return function (_38) {
        return new Tuple(_38.value0, f(_38));
    };
});
var eqTuple = function (__dict_Eq_24) {
    return function (__dict_Eq_25) {
        return new Prelude.Eq(function (_8) {
            return function (_9) {
                return Prelude["=="](__dict_Eq_24)(_8.value0)(_9.value0) && Prelude["=="](__dict_Eq_25)(_8.value1)(_9.value1);
            };
        });
    };
};
var ordTuple = function (__dict_Ord_10) {
    return function (__dict_Ord_11) {
        return new Prelude.Ord(function () {
            return eqTuple(__dict_Ord_10["__superclass_Prelude.Eq_0"]())(__dict_Ord_11["__superclass_Prelude.Eq_0"]());
        }, function (_10) {
            return function (_11) {
                var _150 = Prelude.compare(__dict_Ord_10)(_10.value0)(_11.value0);
                if (_150 instanceof Prelude.EQ) {
                    return Prelude.compare(__dict_Ord_11)(_10.value1)(_11.value1);
                };
                return _150;
            };
        });
    };
};
var divisionRingTuple = function (__dict_DivisionRing_26) {
    return function (__dict_DivisionRing_27) {
        return new Prelude.DivisionRing(function () {
            return moduloSemiringTuple(__dict_DivisionRing_26["__superclass_Prelude.ModuloSemiring_1"]())(__dict_DivisionRing_27["__superclass_Prelude.ModuloSemiring_1"]());
        }, function () {
            return ringTuple(__dict_DivisionRing_26["__superclass_Prelude.Ring_0"]())(__dict_DivisionRing_27["__superclass_Prelude.Ring_0"]());
        });
    };
};
var numTuple = function (__dict_Num_12) {
    return function (__dict_Num_13) {
        return new Prelude.Num(function () {
            return divisionRingTuple(__dict_Num_12["__superclass_Prelude.DivisionRing_0"]())(__dict_Num_13["__superclass_Prelude.DivisionRing_0"]());
        });
    };
};
var curry = function (f) {
    return function (a) {
        return function (b) {
            return f(new Tuple(a, b));
        };
    };
};
var comonadTuple = new Control_Comonad.Comonad(function () {
    return extendTuple;
}, snd);
var boundedTuple = function (__dict_Bounded_28) {
    return function (__dict_Bounded_29) {
        return new Prelude.Bounded(new Tuple(Prelude.bottom(__dict_Bounded_28), Prelude.bottom(__dict_Bounded_29)), new Tuple(Prelude.top(__dict_Bounded_28), Prelude.top(__dict_Bounded_29)));
    };
};
var boundedOrdTuple = function (__dict_BoundedOrd_30) {
    return function (__dict_BoundedOrd_31) {
        return new Prelude.BoundedOrd(function () {
            return boundedTuple(__dict_BoundedOrd_30["__superclass_Prelude.Bounded_0"]())(__dict_BoundedOrd_31["__superclass_Prelude.Bounded_0"]());
        }, function () {
            return ordTuple(__dict_BoundedOrd_30["__superclass_Prelude.Ord_1"]())(__dict_BoundedOrd_31["__superclass_Prelude.Ord_1"]());
        });
    };
};
var booleanAlgebraTuple = function (__dict_BooleanAlgebra_32) {
    return function (__dict_BooleanAlgebra_33) {
        return new Prelude.BooleanAlgebra(function () {
            return boundedTuple(__dict_BooleanAlgebra_32["__superclass_Prelude.Bounded_0"]())(__dict_BooleanAlgebra_33["__superclass_Prelude.Bounded_0"]());
        }, function (_26) {
            return function (_27) {
                return new Tuple(Prelude.conj(__dict_BooleanAlgebra_32)(_26.value0)(_27.value0), Prelude.conj(__dict_BooleanAlgebra_33)(_26.value1)(_27.value1));
            };
        }, function (_28) {
            return function (_29) {
                return new Tuple(Prelude.disj(__dict_BooleanAlgebra_32)(_28.value0)(_29.value0), Prelude.disj(__dict_BooleanAlgebra_33)(_28.value1)(_29.value1));
            };
        }, function (_30) {
            return new Tuple(Prelude.not(__dict_BooleanAlgebra_32)(_30.value0), Prelude.not(__dict_BooleanAlgebra_33)(_30.value1));
        });
    };
};
var bifunctorTuple = new Data_Bifunctor.Bifunctor(function (f) {
    return function (g) {
        return function (_32) {
            return new Tuple(f(_32.value0), g(_32.value1));
        };
    };
});
var bifoldableTuple = new Data_Bifoldable.Bifoldable(function (__dict_Monoid_37) {
    return function (f) {
        return function (g) {
            return function (_42) {
                return Prelude["<>"](__dict_Monoid_37["__superclass_Prelude.Semigroup_0"]())(f(_42.value0))(g(_42.value1));
            };
        };
    };
}, function (f) {
    return function (g) {
        return function (z) {
            return function (_44) {
                return g(f(z)(_44.value0))(_44.value1);
            };
        };
    };
}, function (f) {
    return function (g) {
        return function (z) {
            return function (_43) {
                return f(_43.value0)(g(_43.value1)(z));
            };
        };
    };
});
var bitraversableTuple = new Data_Bitraversable.Bitraversable(function () {
    return bifoldableTuple;
}, function () {
    return bifunctorTuple;
}, function (__dict_Applicative_35) {
    return function (_48) {
        return Prelude["<*>"](__dict_Applicative_35["__superclass_Prelude.Apply_0"]())(Prelude["<$>"]((__dict_Applicative_35["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Tuple.create)(_48.value0))(_48.value1);
    };
}, function (__dict_Applicative_34) {
    return function (f) {
        return function (g) {
            return function (_47) {
                return Prelude["<*>"](__dict_Applicative_34["__superclass_Prelude.Apply_0"]())(Prelude["<$>"]((__dict_Applicative_34["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Tuple.create)(f(_47.value0)))(g(_47.value1));
            };
        };
    };
});
var biapplyTuple = new Control_Biapply.Biapply(function () {
    return bifunctorTuple;
}, function (_35) {
    return function (_36) {
        return new Tuple(_35.value0(_36.value0), _35.value1(_36.value1));
    };
});
var biapplicativeTuple = new Control_Biapplicative.Biapplicative(function () {
    return biapplyTuple;
}, Tuple.create);
var applyTuple = function (__dict_Semigroup_38) {
    return new Prelude.Apply(function () {
        return functorTuple;
    }, function (_33) {
        return function (_34) {
            return new Tuple(Prelude["<>"](__dict_Semigroup_38)(_33.value0)(_34.value0), _33.value1(_34.value1));
        };
    });
};
var bindTuple = function (__dict_Semigroup_36) {
    return new Prelude.Bind(function () {
        return applyTuple(__dict_Semigroup_36);
    }, function (_37) {
        return function (f) {
            var _214 = f(_37.value1);
            return new Tuple(Prelude["<>"](__dict_Semigroup_36)(_37.value0)(_214.value0), _214.value1);
        };
    });
};
var applicativeTuple = function (__dict_Monoid_39) {
    return new Prelude.Applicative(function () {
        return applyTuple(__dict_Monoid_39["__superclass_Prelude.Semigroup_0"]());
    }, Tuple.create(Data_Monoid.mempty(__dict_Monoid_39)));
};
var monadTuple = function (__dict_Monoid_16) {
    return new Prelude.Monad(function () {
        return applicativeTuple(__dict_Monoid_16);
    }, function () {
        return bindTuple(__dict_Monoid_16["__superclass_Prelude.Semigroup_0"]());
    });
};
module.exports = {
    Tuple: Tuple, 
    lookup: lookup, 
    swap: swap, 
    uncurry: uncurry, 
    curry: curry, 
    snd: snd, 
    fst: fst, 
    showTuple: showTuple, 
    eqTuple: eqTuple, 
    ordTuple: ordTuple, 
    boundedTuple: boundedTuple, 
    boundedOrdTuple: boundedOrdTuple, 
    semigroupoidTuple: semigroupoidTuple, 
    semigroupTuple: semigroupTuple, 
    monoidTuple: monoidTuple, 
    semiringTuple: semiringTuple, 
    moduloSemiringTuple: moduloSemiringTuple, 
    ringTuple: ringTuple, 
    divisionRingTuple: divisionRingTuple, 
    numTuple: numTuple, 
    booleanAlgebraTuple: booleanAlgebraTuple, 
    functorTuple: functorTuple, 
    invariantTuple: invariantTuple, 
    bifunctorTuple: bifunctorTuple, 
    applyTuple: applyTuple, 
    biapplyTuple: biapplyTuple, 
    applicativeTuple: applicativeTuple, 
    biapplicativeTuple: biapplicativeTuple, 
    bindTuple: bindTuple, 
    monadTuple: monadTuple, 
    extendTuple: extendTuple, 
    comonadTuple: comonadTuple, 
    lazyTuple: lazyTuple, 
    foldableTuple: foldableTuple, 
    bifoldableTuple: bifoldableTuple, 
    traversableTuple: traversableTuple, 
    bitraversableTuple: bitraversableTuple
};

},{"Control.Biapplicative":"/Users/maximko/Projects/mine/guppi/output/Control.Biapplicative/index.js","Control.Biapply":"/Users/maximko/Projects/mine/guppi/output/Control.Biapply/index.js","Control.Comonad":"/Users/maximko/Projects/mine/guppi/output/Control.Comonad/index.js","Control.Extend":"/Users/maximko/Projects/mine/guppi/output/Control.Extend/index.js","Control.Lazy":"/Users/maximko/Projects/mine/guppi/output/Control.Lazy/index.js","Data.Bifoldable":"/Users/maximko/Projects/mine/guppi/output/Data.Bifoldable/index.js","Data.Bifunctor":"/Users/maximko/Projects/mine/guppi/output/Data.Bifunctor/index.js","Data.Bitraversable":"/Users/maximko/Projects/mine/guppi/output/Data.Bitraversable/index.js","Data.Foldable":"/Users/maximko/Projects/mine/guppi/output/Data.Foldable/index.js","Data.Functor.Invariant":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Invariant/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Maybe.First":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe.First/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Traversable":"/Users/maximko/Projects/mine/guppi/output/Data.Traversable/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Unfoldable/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Maybe = require("Data.Maybe");
var Data_Tuple = require("Data.Tuple");
var Data_Array_ST = require("Data.Array.ST");
var Data_Traversable = require("Data.Traversable");
var Control_Monad_Eff = require("Control.Monad.Eff");
var Control_Monad_ST = require("Control.Monad.ST");
var Unfoldable = function (unfoldr) {
    this.unfoldr = unfoldr;
};
var unfoldr = function (dict) {
    return dict.unfoldr;
};
var unfoldableArray = new Unfoldable(function (f) {
    return function (b) {
        return Control_Monad_Eff.runPure(Data_Array_ST.runSTArray(function __do() {
            var _2 = Data_Array_ST.emptySTArray();
            var _1 = Control_Monad_ST.newSTRef(b)();
            (function () {
                while (!(function __do() {
                    var _0 = Control_Monad_ST.readSTRef(_1)();
                    return (function () {
                        var _6 = f(_0);
                        if (_6 instanceof Data_Maybe.Nothing) {
                            return Prelude["return"](Control_Monad_Eff.applicativeEff)(true);
                        };
                        if (_6 instanceof Data_Maybe.Just) {
                            return function __do() {
                                Data_Array_ST.pushSTArray(_2)(_6.value0.value0)();
                                Control_Monad_ST.writeSTRef(_1)(_6.value0.value1)();
                                return Prelude["return"](Control_Monad_Eff.applicativeEff)(false)();
                            };
                        };
                        throw new Error("Failed pattern match at Data.Unfoldable line 29, column 1 - line 49, column 1: " + [ _6.constructor.name ]);
                    })()();
                })()) {

                };
                return {};
            })();
            return Prelude["return"](Control_Monad_Eff.applicativeEff)(_2)();
        }));
    };
});
var replicate = function (__dict_Unfoldable_0) {
    return function (n) {
        return function (v) {
            var step = function (i) {
                var _10 = i <= 0;
                if (_10) {
                    return Data_Maybe.Nothing.value;
                };
                if (!_10) {
                    return new Data_Maybe.Just(new Data_Tuple.Tuple(v, i - 1));
                };
                throw new Error("Failed pattern match at Data.Unfoldable line 52, column 5 - line 53, column 5: " + [ _10.constructor.name ]);
            };
            return unfoldr(__dict_Unfoldable_0)(step)(n);
        };
    };
};
var replicateA = function (__dict_Applicative_1) {
    return function (__dict_Unfoldable_2) {
        return function (__dict_Traversable_3) {
            return function (n) {
                return function (m) {
                    return Data_Traversable.sequence(__dict_Traversable_3)(__dict_Applicative_1)(replicate(__dict_Unfoldable_2)(n)(m));
                };
            };
        };
    };
};
var singleton = function (__dict_Unfoldable_4) {
    return replicate(__dict_Unfoldable_4)(1);
};
var none = function (__dict_Unfoldable_5) {
    return unfoldr(__dict_Unfoldable_5)(Prelude["const"](Data_Maybe.Nothing.value))(Prelude.unit);
};
module.exports = {
    Unfoldable: Unfoldable, 
    singleton: singleton, 
    none: none, 
    replicateA: replicateA, 
    replicate: replicate, 
    unfoldr: unfoldr, 
    unfoldableArray: unfoldableArray
};

},{"Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","Control.Monad.ST":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.ST/index.js","Data.Array.ST":"/Users/maximko/Projects/mine/guppi/output/Data.Array.ST/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Traversable":"/Users/maximko/Projects/mine/guppi/output/Data.Traversable/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Data.Void/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Functor_Contravariant = require("Data.Functor.Contravariant");
var Void = function (x) {
    return x;
};
var showVoid = new Prelude.Show(function (_2) {
    return "Void";
});
var eqVoid = new Prelude.Eq(function (_0) {
    return function (_1) {
        return true;
    };
});
var absurd = function (a) {
    var spin = function (__copy__3) {
        var _3 = __copy__3;
        tco: while (true) {
            var __tco__3 = _3;
            _3 = __tco__3;
            continue tco;
        };
    };
    return spin(a);
};
var coerce = function (__dict_Contravariant_0) {
    return function (__dict_Functor_1) {
        return function (a) {
            return Prelude["<$>"](__dict_Functor_1)(absurd)(Data_Functor_Contravariant[">$<"](__dict_Contravariant_0)(absurd)(a));
        };
    };
};
module.exports = {
    Void: Void, 
    absurd: absurd, 
    coerce: coerce, 
    eqVoid: eqVoid, 
    showVoid: showVoid
};

},{"Data.Functor.Contravariant":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Contravariant/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Guppi.Component/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Halogen_Component = require("Halogen.Component");
var Halogen_HTML_Elements_Indexed = require("Halogen.HTML.Elements.Indexed");
var Halogen_HTML = require("Halogen.HTML");
var Halogen_HTML_Events = require("Halogen.HTML.Events");
var Halogen_HTML_Elements = require("Halogen.HTML.Elements");
var Halogen_Query = require("Halogen.Query");
var Prelude = require("Prelude");
var Data_Functor = require("Data.Functor");
var Halogen = require("Halogen");
var Halogen_HTML_Core = require("Halogen.HTML.Core");
var Halogen_HTML_Events_Indexed = require("Halogen.HTML.Events.Indexed");
var Halogen_HTML_Indexed = require("Halogen.HTML.Indexed");
var Halogen_HTML_Properties_Indexed = require("Halogen.HTML.Properties.Indexed");
var Guppi_Effects = require("Guppi.Effects");
var Control_Monad_Free = require("Control.Monad.Free");
var Inc = (function () {
    function Inc(value0) {
        this.value0 = value0;
    };
    Inc.create = function (value0) {
        return new Inc(value0);
    };
    return Inc;
})();
var Dec = (function () {
    function Dec(value0) {
        this.value0 = value0;
    };
    Dec.create = function (value0) {
        return new Dec(value0);
    };
    return Dec;
})();
var render = function (state) {
    var navbar = Halogen_HTML_Elements_Indexed.div([ Halogen_HTML_Properties_Indexed.classes([ Halogen_HTML_Core.className("bar"), Halogen_HTML_Core.className("bar-header"), Halogen_HTML_Core.className("bar-dark") ]) ])([ Halogen_HTML_Elements_Indexed.h1([ Halogen_HTML_Properties_Indexed.classes([ Halogen_HTML_Core.className("title") ]) ])([ Halogen_HTML.text(Prelude.show(Prelude.showInt)(state.count)) ]) ]);
    var buttons = Halogen_HTML_Elements_Indexed.div([ Halogen_HTML_Properties_Indexed.classes([ Halogen_HTML_Core.className("button-bar") ]) ])([ Halogen_HTML_Elements_Indexed.button([ Halogen_HTML_Events_Indexed.onClick(Halogen_HTML_Events.input_(Inc.create)), Halogen_HTML_Properties_Indexed.classes([ Halogen_HTML_Core.className("button"), Halogen_HTML_Core.className("button-positive"), Halogen_HTML_Core.className("button-outline") ]) ])([ Halogen_HTML_Elements_Indexed.i([ Halogen_HTML_Properties_Indexed.classes([ Halogen_HTML_Core.className("icon"), Halogen_HTML_Core.className("ion-plus-round") ]) ])([  ]) ]), Halogen_HTML_Elements_Indexed.button([ Halogen_HTML_Events_Indexed.onClick(Halogen_HTML_Events.input_(Dec.create)), Halogen_HTML_Properties_Indexed.classes([ Halogen_HTML_Core.className("button"), Halogen_HTML_Core.className("button-royal"), Halogen_HTML_Core.className("button-outline") ]) ])([ Halogen_HTML_Elements_Indexed.i([ Halogen_HTML_Properties_Indexed.classes([ Halogen_HTML_Core.className("icon"), Halogen_HTML_Core.className("ion-minus-round") ]) ])([  ]) ]) ]);
    return Halogen_HTML_Elements.div_([ navbar, buttons ]);
};
var initialState = {
    count: 0
};
var $$eval = function (_0) {
    if (_0 instanceof Inc) {
        return Data_Functor["$>"](Control_Monad_Free.freeFunctor)(Halogen_Query.modify(function (x) {
            var _2 = {};
            for (var _3 in x) {
                if (x.hasOwnProperty(_3)) {
                    _2[_3] = x[_3];
                };
            };
            _2.count = x.count + 1 | 0;
            return _2;
        }))(_0.value0);
    };
    if (_0 instanceof Dec) {
        return Data_Functor["$>"](Control_Monad_Free.freeFunctor)(Halogen_Query.modify(function (x) {
            var _5 = {};
            for (var _6 in x) {
                if (x.hasOwnProperty(_6)) {
                    _5[_6] = x[_6];
                };
            };
            _5.count = x.count - 1;
            return _5;
        }))(_0.value0);
    };
    throw new Error("Failed pattern match at Guppi.Component line 83, column 1 - line 84, column 1: " + [ _0.constructor.name ]);
};
var comp = Halogen_Component.component(render)($$eval);
module.exports = {
    Inc: Inc, 
    Dec: Dec, 
    "eval": $$eval, 
    render: render, 
    comp: comp, 
    initialState: initialState
};

},{"Control.Monad.Free":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Free/index.js","Data.Functor":"/Users/maximko/Projects/mine/guppi/output/Data.Functor/index.js","Guppi.Effects":"/Users/maximko/Projects/mine/guppi/output/Guppi.Effects/index.js","Halogen":"/Users/maximko/Projects/mine/guppi/output/Halogen/index.js","Halogen.Component":"/Users/maximko/Projects/mine/guppi/output/Halogen.Component/index.js","Halogen.HTML":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML/index.js","Halogen.HTML.Core":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Core/index.js","Halogen.HTML.Elements":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Elements/index.js","Halogen.HTML.Elements.Indexed":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Elements.Indexed/index.js","Halogen.HTML.Events":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events/index.js","Halogen.HTML.Events.Indexed":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events.Indexed/index.js","Halogen.HTML.Indexed":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Indexed/index.js","Halogen.HTML.Properties.Indexed":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Properties.Indexed/index.js","Halogen.Query":"/Users/maximko/Projects/mine/guppi/output/Halogen.Query/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Guppi.Effects/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Control_Monad_Aff = require("Control.Monad.Aff");
var Control_Monad_Aff_AVar = require("Control.Monad.Aff.AVar");
var Control_Monad_Eff_Exception = require("Control.Monad.Eff.Exception");
var DOM = require("DOM");
module.exports = {};

},{"Control.Monad.Aff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff/index.js","Control.Monad.Aff.AVar":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff.AVar/index.js","Control.Monad.Eff.Exception":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Exception/index.js","DOM":"/Users/maximko/Projects/mine/guppi/output/DOM/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.Component.ChildPath/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Either = require("Data.Either");
var Data_Functor_Coproduct = require("Data.Functor.Coproduct");
var Data_Injector = require("Data.Injector");
var Data_Maybe = require("Data.Maybe");
var Data_NaturalTransformation = require("Data.NaturalTransformation");
var ChildPath = (function () {
    function ChildPath(value0, value1, value2) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
    };
    ChildPath.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return new ChildPath(value0, value1, value2);
            };
        };
    };
    return ChildPath;
})();
var prjState = function (_3) {
    return Data_Injector.prj(function (__dict_Choice_0) {
        return function (__dict_Applicative_1) {
            return _3.value0(__dict_Choice_0)(__dict_Applicative_1);
        };
    });
};
var prjSlot = function (_7) {
    return Data_Injector.prj(function (__dict_Choice_2) {
        return function (__dict_Applicative_3) {
            return _7.value2(__dict_Choice_2)(__dict_Applicative_3);
        };
    });
};
var prjQuery = function (_5) {
    return Data_Injector.prj(function (__dict_Choice_4) {
        return function (__dict_Applicative_5) {
            return _5.value1(__dict_Choice_4)(__dict_Applicative_5);
        };
    });
};
var injState = function (_2) {
    return Data_Injector.inj(function (__dict_Choice_6) {
        return function (__dict_Applicative_7) {
            return _2.value0(__dict_Choice_6)(__dict_Applicative_7);
        };
    });
};
var injSlot = function (_6) {
    return Data_Injector.inj(function (__dict_Choice_8) {
        return function (__dict_Applicative_9) {
            return _6.value2(__dict_Choice_8)(__dict_Applicative_9);
        };
    });
};
var injQuery = function (_4) {
    return Data_Injector.inj(function (__dict_Choice_10) {
        return function (__dict_Applicative_11) {
            return _4.value1(__dict_Choice_10)(__dict_Applicative_11);
        };
    });
};
var cpR = new ChildPath(function (__dict_Choice_12) {
    return function (__dict_Applicative_13) {
        return Data_Injector.injRE(__dict_Choice_12)(__dict_Applicative_13);
    };
}, function (__dict_Choice_14) {
    return function (__dict_Applicative_15) {
        return Data_Injector.injRC(__dict_Choice_14)(__dict_Applicative_15);
    };
}, function (__dict_Choice_16) {
    return function (__dict_Applicative_17) {
        return Data_Injector.injRE(__dict_Choice_16)(__dict_Applicative_17);
    };
});
var cpL = new ChildPath(function (__dict_Choice_18) {
    return function (__dict_Applicative_19) {
        return Data_Injector.injLE(__dict_Choice_18)(__dict_Applicative_19);
    };
}, function (__dict_Choice_20) {
    return function (__dict_Applicative_21) {
        return Data_Injector.injLC(__dict_Choice_20)(__dict_Applicative_21);
    };
}, function (__dict_Choice_22) {
    return function (__dict_Applicative_23) {
        return Data_Injector.injLE(__dict_Choice_22)(__dict_Applicative_23);
    };
});
var cpI = new ChildPath(function (__dict_Choice_24) {
    return function (__dict_Applicative_25) {
        return Data_Injector.injI(__dict_Choice_24)(__dict_Applicative_25);
    };
}, function (__dict_Choice_26) {
    return function (__dict_Applicative_27) {
        return Data_Injector.injI(__dict_Choice_26)(__dict_Applicative_27);
    };
}, function (__dict_Choice_28) {
    return function (__dict_Applicative_29) {
        return Data_Injector.injI(__dict_Choice_28)(__dict_Applicative_29);
    };
});
var compose = function (_0) {
    return function (_1) {
        return new ChildPath(function (__dict_Choice_30) {
            return function (__dict_Applicative_31) {
                return function (_40) {
                    return _0.value0(__dict_Choice_30)(__dict_Applicative_31)(_1.value0(__dict_Choice_30)(__dict_Applicative_31)(_40));
                };
            };
        }, function (__dict_Choice_32) {
            return function (__dict_Applicative_33) {
                return function (_41) {
                    return _0.value1(__dict_Choice_32)(__dict_Applicative_33)(_1.value1(__dict_Choice_32)(__dict_Applicative_33)(_41));
                };
            };
        }, function (__dict_Choice_34) {
            return function (__dict_Applicative_35) {
                return function (_42) {
                    return _0.value2(__dict_Choice_34)(__dict_Applicative_35)(_1.value2(__dict_Choice_34)(__dict_Applicative_35)(_42));
                };
            };
        });
    };
};
var $colon$greater = compose;
module.exports = {
    ChildPath: ChildPath, 
    prjSlot: prjSlot, 
    injSlot: injSlot, 
    prjQuery: prjQuery, 
    injQuery: injQuery, 
    prjState: prjState, 
    injState: injState, 
    cpI: cpI, 
    cpR: cpR, 
    cpL: cpL, 
    ":>": $colon$greater, 
    compose: compose
};

},{"Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Functor.Coproduct":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Coproduct/index.js","Data.Injector":"/Users/maximko/Projects/mine/guppi/output/Data.Injector/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.NaturalTransformation":"/Users/maximko/Projects/mine/guppi/output/Data.NaturalTransformation/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.Component/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Apply = require("Control.Apply");
var Control_Bind = require("Control.Bind");
var Control_Monad_Free = require("Control.Monad.Free");
var Control_Monad_Free_Trans = require("Control.Monad.Free.Trans");
var Control_Monad_State = require("Control.Monad.State");
var Control_Monad_State_Class = require("Control.Monad.State.Class");
var Control_Monad_State_Trans = require("Control.Monad.State.Trans");
var Data_Bifunctor = require("Data.Bifunctor");
var Data_Functor_Coproduct = require("Data.Functor.Coproduct");
var Data_List = require("Data.List");
var Data_Map = require("Data.Map");
var Data_Maybe = require("Data.Maybe");
var Data_Maybe_Unsafe = require("Data.Maybe.Unsafe");
var Data_NaturalTransformation = require("Data.NaturalTransformation");
var Data_Traversable = require("Data.Traversable");
var Data_Tuple = require("Data.Tuple");
var Data_Void = require("Data.Void");
var Halogen_Component_ChildPath = require("Halogen.Component.ChildPath");
var Halogen_HTML_Core = require("Halogen.HTML.Core");
var Halogen_Query = require("Halogen.Query");
var Halogen_Query_EventSource = require("Halogen.Query.EventSource");
var Halogen_Query_HalogenF = require("Halogen.Query.HalogenF");
var Halogen_Query_StateF = require("Halogen.Query.StateF");
var Data_Identity = require("Data.Identity");
var Control_Coroutine_Stalling = require("Control.Coroutine.Stalling");
var Component = function (x) {
    return x;
};
var SlotConstructor = (function () {
    function SlotConstructor(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    SlotConstructor.create = function (value0) {
        return function (value1) {
            return new SlotConstructor(value0, value1);
        };
    };
    return SlotConstructor;
})();
var ChildF = (function () {
    function ChildF(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    ChildF.create = function (value0) {
        return function (value1) {
            return new ChildF(value0, value1);
        };
    };
    return ChildF;
})();
var InstalledState = function (x) {
    return x;
};
var transform = function (__dict_Functor_0) {
    return function (reviewS) {
        return function (previewS) {
            return function (reviewQ) {
                return function (previewQ) {
                    return function (_15) {
                        var render$prime = function (st) {
                            return function (_12) {
                                return Prelude["<$>"](Data_Identity.functorIdentity)(Data_Bifunctor.bimap(Data_Tuple.bifunctorTuple)(Prelude.map(Halogen_HTML_Core.functorHTML)(reviewQ))(reviewS))(Control_Monad_State_Trans.runStateT(_15.render)(st));
                            };
                        };
                        var modifyState = function (f) {
                            return function (s$prime) {
                                return Data_Maybe.maybe(s$prime)(function (_90) {
                                    return reviewS(f(_90));
                                })(previewS(s$prime));
                            };
                        };
                        var go = function (_23) {
                            if (_23 instanceof Halogen_Query_HalogenF.StateHF && _23.value0 instanceof Halogen_Query_StateF.Get) {
                                return Control_Bind["=<<"](Control_Monad_Free.freeBind)(function (_91) {
                                    return Control_Monad_Free.liftF(Data_Maybe.maybe(Halogen_Query_HalogenF.HaltHF.value)(function (st$prime) {
                                        return new Halogen_Query_HalogenF.StateHF(new Halogen_Query_StateF.Get(function (_92) {
                                            return _23.value0.value0(Prelude["const"](st$prime)(_92));
                                        }));
                                    })(previewS(_91)));
                                })(Halogen_Query.get);
                            };
                            if (_23 instanceof Halogen_Query_HalogenF.StateHF && _23.value0 instanceof Halogen_Query_StateF.Modify) {
                                return Control_Monad_Free.liftF(new Halogen_Query_HalogenF.StateHF(new Halogen_Query_StateF.Modify(modifyState(_23.value0.value0), _23.value0.value1)));
                            };
                            if (_23 instanceof Halogen_Query_HalogenF.SubscribeHF) {
                                return Control_Monad_Free.liftF(new Halogen_Query_HalogenF.SubscribeHF(Control_Monad_Free_Trans.interpret(Control_Coroutine_Stalling.functorStallF)(__dict_Functor_0)(Data_Bifunctor.lmap(Control_Coroutine_Stalling.bifunctorStallF)(reviewQ))(Halogen_Query_EventSource.runEventSource(_23.value0)), _23.value1));
                            };
                            if (_23 instanceof Halogen_Query_HalogenF.QueryHF) {
                                return Control_Monad_Free.liftF(new Halogen_Query_HalogenF.QueryHF(_23.value0));
                            };
                            if (_23 instanceof Halogen_Query_HalogenF.HaltHF) {
                                return Control_Monad_Free.liftF(Halogen_Query_HalogenF.HaltHF.value);
                            };
                            throw new Error("Failed pattern match at Halogen.Component line 408, column 1 - line 417, column 1: " + [ _23.constructor.name ]);
                        };
                        return {
                            render: Control_Bind["=<<"](Control_Monad_State_Trans.bindStateT(Data_Identity.monadIdentity))(function (_93) {
                                return Data_Maybe.maybe(Prelude.pure(Control_Monad_State_Trans.applicativeStateT(Data_Identity.monadIdentity))(new Halogen_HTML_Core.Text("")))(render$prime)(previewS(_93));
                            })(Control_Monad_State_Class.get(Control_Monad_State_Trans.monadStateStateT(Data_Identity.monadIdentity))), 
                            "eval": function (_94) {
                                return Data_Maybe.maybe(Control_Monad_Free.liftF(Halogen_Query_HalogenF.HaltHF.value))(function (_95) {
                                    return Control_Monad_Free.foldFree(Control_Monad_Free.freeMonadRec)(go)(_15["eval"](_95));
                                })(previewQ(_94));
                            }
                        };
                    };
                };
            };
        };
    };
};
var transformChild = function (__dict_Functor_1) {
    return function (i) {
        return transform(__dict_Functor_1)(Halogen_Component_ChildPath.injState(i))(Halogen_Component_ChildPath.prjState(i))(Halogen_Component_ChildPath.injQuery(i))(Halogen_Component_ChildPath.prjQuery(i));
    };
};
var runChildF = function (_13) {
    return _13.value1;
};
var renderComponent = function (_17) {
    return Control_Monad_State.runState(_17.render);
};
var render = function (__dict_Ord_2) {
    return function (rc) {
        var renderChild$prime = function (p) {
            return function (c) {
                return function (s) {
                    var _43 = renderComponent(c)(s);
                    return Prelude.bind(Control_Monad_State_Trans.bindStateT(Data_Identity.monadIdentity))(Control_Monad_State_Class.modify(Control_Monad_State_Trans.monadStateStateT(Data_Identity.monadIdentity))(function (_10) {
                        return {
                            parent: _10.parent, 
                            children: Data_Map.insert(__dict_Ord_2)(p)(new Data_Tuple.Tuple(c, _43.value1))(_10.children), 
                            memo: _10.memo
                        };
                    }))(function () {
                        return Prelude.pure(Control_Monad_State_Trans.applicativeStateT(Data_Identity.monadIdentity))(Prelude["<$>"](Halogen_HTML_Core.functorHTML)(function (_96) {
                            return Data_Functor_Coproduct.right(ChildF.create(p)(_96));
                        })(_43.value0));
                    });
                };
            };
        };
        var renderChild = function (_21) {
            return function (_22) {
                var childState = Data_Map.lookup(__dict_Ord_2)(_22.value0)(_21.children);
                var _49 = Data_Map.lookup(__dict_Ord_2)(_22.value0)(_21.memo);
                if (_49 instanceof Data_Maybe.Just) {
                    return Prelude.bind(Control_Monad_State_Trans.bindStateT(Data_Identity.monadIdentity))(Control_Monad_State_Class.modify(Control_Monad_State_Trans.monadStateStateT(Data_Identity.monadIdentity))(function (_9) {
                        return {
                            parent: _9.parent, 
                            children: Data_Map.alter(__dict_Ord_2)(Prelude["const"](childState))(_22.value0)(_9.children), 
                            memo: Data_Map.insert(__dict_Ord_2)(_22.value0)(_49.value0)(_9.memo)
                        };
                    }))(function () {
                        return Prelude.pure(Control_Monad_State_Trans.applicativeStateT(Data_Identity.monadIdentity))(_49.value0);
                    });
                };
                if (_49 instanceof Data_Maybe.Nothing) {
                    if (childState instanceof Data_Maybe.Just) {
                        return renderChild$prime(_22.value0)(childState.value0.value0)(childState.value0.value1);
                    };
                    if (childState instanceof Data_Maybe.Nothing) {
                        var def$prime = _22.value1(Prelude.unit);
                        return renderChild$prime(_22.value0)(def$prime.component)(def$prime.initialState);
                    };
                    throw new Error("Failed pattern match at Halogen.Component line 306, column 1 - line 311, column 1: " + [ childState.constructor.name ]);
                };
                throw new Error("Failed pattern match at Halogen.Component line 306, column 1 - line 311, column 1: " + [ _49.constructor.name ]);
            };
        };
        return Prelude.bind(Control_Monad_State_Trans.bindStateT(Data_Identity.monadIdentity))(Control_Monad_State_Class.get(Control_Monad_State_Trans.monadStateStateT(Data_Identity.monadIdentity)))(function (_3) {
            var html = rc(_3.parent);
            return Prelude.bind(Control_Monad_State_Trans.bindStateT(Data_Identity.monadIdentity))(Control_Monad_State_Class.put(Control_Monad_State_Trans.monadStateStateT(Data_Identity.monadIdentity))({
                parent: _3.parent, 
                children: Data_Map.empty, 
                memo: Data_Map.empty
            }))(function () {
                return Halogen_HTML_Core.fillSlot(Control_Monad_State_Trans.applicativeStateT(Data_Identity.monadIdentity))(renderChild(_3))(Data_Functor_Coproduct.left)(html);
            });
        });
    };
};
var queryComponent = function (_18) {
    return _18["eval"];
};
var mapStateFParent = Halogen_Query_StateF.mapState(function (_5) {
    return _5.parent;
})(function (f) {
    return function (_6) {
        return {
            parent: f(_6.parent), 
            children: _6.children, 
            memo: _6.memo
        };
    };
});
var mergeParentStateF = function (_97) {
    return Control_Monad_Free.liftF(Halogen_Query_HalogenF.StateHF.create(mapStateFParent(_97)));
};
var mapStateFChild = function (__dict_Ord_3) {
    return function (p) {
        return Halogen_Query_StateF.mapState(function (_7) {
            return Data_Maybe_Unsafe.fromJust(Prelude["<$>"](Data_Maybe.functorMaybe)(Data_Tuple.snd)(Data_Map.lookup(__dict_Ord_3)(p)(_7.children)));
        })(function (f) {
            return function (_8) {
                return {
                    parent: _8.parent, 
                    children: Data_Map.update(__dict_Ord_3)(function (_98) {
                        return Data_Maybe.Just.create(Data_Bifunctor.rmap(Data_Tuple.bifunctorTuple)(f)(_98));
                    })(p)(_8.children), 
                    memo: _8.memo
                };
            };
        });
    };
};
var mkQueries$prime = function (__dict_Functor_4) {
    return function (__dict_Ord_5) {
        return function (__dict_Ord_6) {
            return function (i) {
                return function (q) {
                    var mkChildQuery = function (_20) {
                        return Data_Traversable["for"](Control_Monad_Free.freeApplicative)(Data_Traversable.traversableMaybe)(Halogen_Component_ChildPath.prjSlot(i)(_20.value0))(function (p) {
                            return Prelude["<$>"](Control_Monad_Free.freeFunctor)(Data_Tuple.Tuple.create(p))(Control_Monad_Free.mapF(Halogen_Query_HalogenF.transformHF(__dict_Functor_4)(__dict_Functor_4)(mapStateFChild(__dict_Ord_5)(_20.value0))(ChildF.create(_20.value0))(Prelude.id(Prelude.categoryFn)))(queryComponent(_20.value1.value0)(Halogen_Component_ChildPath.injQuery(i)(q))));
                        });
                    };
                    return Prelude.bind(Control_Monad_Free.freeBind)(Halogen_Query.get)(function (_2) {
                        return Prelude["<$>"](Control_Monad_Free.freeFunctor)(function (_99) {
                            return Data_Map.fromList(__dict_Ord_6)(Data_List.catMaybes(_99));
                        })(Data_Traversable.traverse(Data_List.traversableList)(Control_Monad_Free.freeApplicative)(mkChildQuery)(Data_Map.toList(_2.children)));
                    });
                };
            };
        };
    };
};
var mkQueries = function (__dict_Functor_7) {
    return function (__dict_Ord_8) {
        return mkQueries$prime(__dict_Functor_7)(__dict_Ord_8)(__dict_Ord_8)(new Halogen_Component_ChildPath.ChildPath(function (__dict_Choice_9) {
            return function (__dict_Applicative_10) {
                return Prelude.id(Prelude.categoryFn);
            };
        }, function (__dict_Choice_11) {
            return function (__dict_Applicative_12) {
                return Prelude.id(Prelude.categoryFn);
            };
        }, function (__dict_Choice_13) {
            return function (__dict_Applicative_14) {
                return Prelude.id(Prelude.categoryFn);
            };
        }));
    };
};
var mkQuery = function (__dict_Functor_15) {
    return function (__dict_Ord_16) {
        return function (p) {
            return function (q) {
                return Prelude.bind(Control_Monad_Free.freeBind)(Halogen_Query.get)(function (_1) {
                    return Data_Traversable["for"](Control_Monad_Free.freeApplicative)(Data_Traversable.traversableMaybe)(Data_Map.lookup(__dict_Ord_16)(p)(_1.children))(function (_4) {
                        return Control_Monad_Free.mapF(Halogen_Query_HalogenF.transformHF(__dict_Functor_15)(__dict_Functor_15)(mapStateFChild(__dict_Ord_16)(p))(ChildF.create(p))(Prelude.id(Prelude.categoryFn)))(queryComponent(_4.value0)(q));
                    });
                });
            };
        };
    };
};
var mkQuery$prime = function (__dict_Functor_17) {
    return function (__dict_Ord_18) {
        return function (i) {
            return function (p) {
                return function (q) {
                    return mkQuery(__dict_Functor_17)(__dict_Ord_18)(Halogen_Component_ChildPath.injSlot(i)(p))(Halogen_Component_ChildPath.injQuery(i)(q));
                };
            };
        };
    };
};
var queryChild = function (__dict_Functor_19) {
    return function (__dict_Ord_20) {
        return function (_14) {
            return Prelude.bind(Control_Monad_Free.freeBind)(Halogen_Query.modify(function (_11) {
                return {
                    parent: _11.parent, 
                    children: _11.children, 
                    memo: Data_Map["delete"](__dict_Ord_20)(_14.value0)(_11.memo)
                };
            }))(function () {
                return Prelude[">>="](Control_Monad_Free.freeBind)(Control_Monad_Free.mapF(Halogen_Query_HalogenF.transformHF(__dict_Functor_19)(__dict_Functor_19)(Prelude.id(Prelude.categoryFn))(Data_Functor_Coproduct.right)(Prelude.id(Prelude.categoryFn)))(mkQuery(__dict_Functor_19)(__dict_Ord_20)(_14.value0)(_14.value1)))(Data_Maybe.maybe(Control_Monad_Free.liftF(Halogen_Query_HalogenF.HaltHF.value))(Prelude.pure(Control_Monad_Free.freeApplicative)));
            });
        };
    };
};
var liftQuery = function (__dict_Functor_21) {
    return Halogen_Query.liftH;
};
var query = function (__dict_Functor_22) {
    return function (__dict_Ord_23) {
        return function (p) {
            return function (q) {
                return liftQuery(__dict_Functor_22)(mkQuery(__dict_Functor_22)(__dict_Ord_23)(p)(q));
            };
        };
    };
};
var query$prime = function (__dict_Functor_24) {
    return function (__dict_Ord_25) {
        return function (i) {
            return function (p) {
                return function (q) {
                    return liftQuery(__dict_Functor_24)(mkQuery$prime(__dict_Functor_24)(__dict_Ord_25)(i)(p)(q));
                };
            };
        };
    };
};
var queryAll = function (__dict_Functor_26) {
    return function (__dict_Ord_27) {
        return function (q) {
            return liftQuery(__dict_Functor_26)(mkQueries(__dict_Functor_26)(__dict_Ord_27)(q));
        };
    };
};
var queryAll$prime = function (__dict_Functor_28) {
    return function (__dict_Ord_29) {
        return function (__dict_Ord_30) {
            return function (i) {
                return function (q) {
                    return liftQuery(__dict_Functor_28)(mkQueries$prime(__dict_Functor_28)(__dict_Ord_30)(__dict_Ord_29)(i)(q));
                };
            };
        };
    };
};
var liftChildF = function (__dict_Functor_31) {
    return Control_Monad_Free.mapF(Halogen_Query_HalogenF.transformHF(__dict_Functor_31)(__dict_Functor_31)(Prelude.id(Prelude.categoryFn))(Data_Functor_Coproduct.right)(Prelude.id(Prelude.categoryFn)));
};
var queryParent = function (__dict_Functor_32) {
    return function (f) {
        return Prelude[">>>"](Prelude.semigroupoidFn)(f)(Control_Monad_Free.foldFree(Control_Monad_Free.freeMonadRec)(function (h) {
            if (h instanceof Halogen_Query_HalogenF.StateHF) {
                return mergeParentStateF(h.value0);
            };
            if (h instanceof Halogen_Query_HalogenF.SubscribeHF) {
                return Control_Monad_Free.liftF(new Halogen_Query_HalogenF.SubscribeHF(Control_Monad_Free_Trans.interpret(Control_Coroutine_Stalling.functorStallF)(__dict_Functor_32)(Data_Bifunctor.lmap(Control_Coroutine_Stalling.bifunctorStallF)(Data_Functor_Coproduct.left))(Halogen_Query_EventSource.runEventSource(Halogen_Query_EventSource.fromParentEventSource(h.value0))), h.value1));
            };
            if (h instanceof Halogen_Query_HalogenF.QueryHF) {
                return liftChildF(__dict_Functor_32)(h.value0);
            };
            if (h instanceof Halogen_Query_HalogenF.HaltHF) {
                return Control_Monad_Free.liftF(Halogen_Query_HalogenF.HaltHF.value);
            };
            throw new Error("Failed pattern match at Halogen.Component line 361, column 1 - line 366, column 1: " + [ h.constructor.name ]);
        }));
    };
};
var parentComponent = function (__dict_Functor_33) {
    return function (__dict_Ord_34) {
        return function (r) {
            return function (e) {
                var $$eval = Data_Functor_Coproduct.coproduct(queryParent(__dict_Functor_33)(e))(queryChild(__dict_Functor_33)(__dict_Ord_34));
                return {
                    render: render(__dict_Ord_34)(r), 
                    "eval": $$eval
                };
            };
        };
    };
};
var parentComponent$prime = function (__dict_Functor_35) {
    return function (__dict_Ord_36) {
        return function (r) {
            return function (e) {
                return function (p) {
                    var $$eval = Data_Functor_Coproduct.coproduct(queryParent(__dict_Functor_35)(e))(function (q) {
                        return Control_Apply["<*"](Control_Monad_Free.freeApply)(queryChild(__dict_Functor_35)(__dict_Ord_36)(q))(queryParent(__dict_Functor_35)(p)(q));
                    });
                    return {
                        render: render(__dict_Ord_36)(r), 
                        "eval": $$eval
                    };
                };
            };
        };
    };
};
var interpret = function (__dict_Functor_37) {
    return function (nat) {
        return function (_16) {
            return {
                render: _16.render, 
                "eval": function (_100) {
                    return Control_Monad_Free.mapF(Halogen_Query_HalogenF.hoistHalogenF(__dict_Functor_37)(nat))(_16["eval"](_100));
                }
            };
        };
    };
};
var installedState = function (__dict_Ord_38) {
    return function (st) {
        return {
            parent: st, 
            children: Data_Map.empty, 
            memo: Data_Map.empty
        };
    };
};
var functorChildF = function (__dict_Functor_39) {
    return new Prelude.Functor(function (f) {
        return function (_19) {
            return new ChildF(_19.value0, Prelude["<$>"](__dict_Functor_39)(f)(_19.value1));
        };
    });
};
var component = function (r) {
    return function (e) {
        return {
            render: Control_Monad_State_Class.gets(Control_Monad_State_Trans.monadStateStateT(Data_Identity.monadIdentity))(r), 
            "eval": e
        };
    };
};
var childSlots = function (__dict_Functor_40) {
    return function (__dict_Ord_41) {
        return Prelude.bind(Control_Monad_Free.freeBind)(Halogen_Query.get)(function (_0) {
            return Prelude.pure(Control_Monad_Free.freeApplicative)(Data_Map.keys(_0.children));
        });
    };
};
module.exports = {
    ChildF: ChildF, 
    SlotConstructor: SlotConstructor, 
    queryComponent: queryComponent, 
    renderComponent: renderComponent, 
    interpret: interpret, 
    transformChild: transformChild, 
    transform: transform, 
    childSlots: childSlots, 
    "queryAll'": queryAll$prime, 
    queryAll: queryAll, 
    "query'": query$prime, 
    query: query, 
    liftQuery: liftQuery, 
    "mkQueries'": mkQueries$prime, 
    mkQueries: mkQueries, 
    "mkQuery'": mkQuery$prime, 
    mkQuery: mkQuery, 
    runChildF: runChildF, 
    installedState: installedState, 
    "parentComponent'": parentComponent$prime, 
    parentComponent: parentComponent, 
    component: component, 
    functorChildF: functorChildF
};

},{"Control.Apply":"/Users/maximko/Projects/mine/guppi/output/Control.Apply/index.js","Control.Bind":"/Users/maximko/Projects/mine/guppi/output/Control.Bind/index.js","Control.Coroutine.Stalling":"/Users/maximko/Projects/mine/guppi/output/Control.Coroutine.Stalling/index.js","Control.Monad.Free":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Free/index.js","Control.Monad.Free.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Free.Trans/index.js","Control.Monad.State":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State/index.js","Control.Monad.State.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State.Class/index.js","Control.Monad.State.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State.Trans/index.js","Data.Bifunctor":"/Users/maximko/Projects/mine/guppi/output/Data.Bifunctor/index.js","Data.Functor.Coproduct":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Coproduct/index.js","Data.Identity":"/Users/maximko/Projects/mine/guppi/output/Data.Identity/index.js","Data.List":"/Users/maximko/Projects/mine/guppi/output/Data.List/index.js","Data.Map":"/Users/maximko/Projects/mine/guppi/output/Data.Map/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Maybe.Unsafe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe.Unsafe/index.js","Data.NaturalTransformation":"/Users/maximko/Projects/mine/guppi/output/Data.NaturalTransformation/index.js","Data.Traversable":"/Users/maximko/Projects/mine/guppi/output/Data.Traversable/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Data.Void":"/Users/maximko/Projects/mine/guppi/output/Data.Void/index.js","Halogen.Component.ChildPath":"/Users/maximko/Projects/mine/guppi/output/Halogen.Component.ChildPath/index.js","Halogen.HTML.Core":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Core/index.js","Halogen.Query":"/Users/maximko/Projects/mine/guppi/output/Halogen.Query/index.js","Halogen.Query.EventSource":"/Users/maximko/Projects/mine/guppi/output/Halogen.Query.EventSource/index.js","Halogen.Query.HalogenF":"/Users/maximko/Projects/mine/guppi/output/Halogen.Query.HalogenF/index.js","Halogen.Query.StateF":"/Users/maximko/Projects/mine/guppi/output/Halogen.Query.StateF/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.Cordova/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Monad_Eff = require("Control.Monad.Eff");
var Control_Monad_Eff_Class = require("Control.Monad.Eff.Class");
var DOM = require("DOM");
var DOM_Event_EventTarget = require("DOM.Event.EventTarget");
var DOM_HTML = require("DOM.HTML");
var DOM_HTML_Window = require("DOM.HTML.Window");
var DOM_HTML_Types = require("DOM.HTML.Types");
var Cordova_EventTypes = require("Cordova.EventTypes");
var onDeviceReady = function (__dict_MonadEff_0) {
    return function (callback) {
        return Control_Monad_Eff_Class.liftEff(__dict_MonadEff_0)(Prelude[">>="](Control_Monad_Eff.bindEff)(Prelude[">>="](Control_Monad_Eff.bindEff)(DOM_HTML.window)(DOM_HTML_Window.document))(Prelude[">>>"](Prelude.semigroupoidFn)(DOM_HTML_Types.htmlDocumentToEventTarget)(DOM_Event_EventTarget.addEventListener(Cordova_EventTypes.deviceready)(DOM_Event_EventTarget.eventListener(function (_0) {
            return callback;
        }))(false))));
    };
};
module.exports = {
    onDeviceReady: onDeviceReady
};

},{"Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","Control.Monad.Eff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Class/index.js","Cordova.EventTypes":"/Users/maximko/Projects/mine/guppi/output/Cordova.EventTypes/index.js","DOM":"/Users/maximko/Projects/mine/guppi/output/DOM/index.js","DOM.Event.EventTarget":"/Users/maximko/Projects/mine/guppi/output/DOM.Event.EventTarget/index.js","DOM.HTML":"/Users/maximko/Projects/mine/guppi/output/DOM.HTML/index.js","DOM.HTML.Types":"/Users/maximko/Projects/mine/guppi/output/DOM.HTML.Types/index.js","DOM.HTML.Window":"/Users/maximko/Projects/mine/guppi/output/DOM.HTML.Window/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.Driver/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Bind = require("Control.Bind");
var Control_Coroutine = require("Control.Coroutine");
var Control_Coroutine_Stalling = require("Control.Coroutine.Stalling");
var Control_Monad_Aff = require("Control.Monad.Aff");
var Control_Monad_Aff_AVar = require("Control.Monad.Aff.AVar");
var Control_Monad_Eff_Class = require("Control.Monad.Eff.Class");
var Control_Monad_Free = require("Control.Monad.Free");
var Control_Monad_Rec_Class = require("Control.Monad.Rec.Class");
var Control_Monad_State = require("Control.Monad.State");
var Control_Monad_Trans = require("Control.Monad.Trans");
var Control_Plus = require("Control.Plus");
var Data_NaturalTransformation = require("Data.NaturalTransformation");
var Data_Tuple = require("Data.Tuple");
var DOM_HTML_Types = require("DOM.HTML.Types");
var Halogen_Component = require("Halogen.Component");
var Halogen_Effects = require("Halogen.Effects");
var Halogen_HTML_Renderer_VirtualDOM = require("Halogen.HTML.Renderer.VirtualDOM");
var Halogen_Internal_VirtualDOM = require("Halogen.Internal.VirtualDOM");
var Halogen_Query = require("Halogen.Query");
var Halogen_Query_StateF = require("Halogen.Query.StateF");
var Halogen_Query_EventSource = require("Halogen.Query.EventSource");
var Halogen_Query_HalogenF = require("Halogen.Query.HalogenF");
var Control_Monad_State_Trans = require("Control.Monad.State.Trans");
var Data_Identity = require("Data.Identity");
var Control_Monad_Free_Trans = require("Control.Monad.Free.Trans");
var runUI = function (c) {
    return function (s) {
        var render = function (ref) {
            return Prelude.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.takeVar(ref))(function (_3) {
                var _6 = !_3.renderPending;
                if (_6) {
                    return Control_Monad_Aff_AVar.putVar(ref)(_3);
                };
                if (!_6) {
                    var _7 = Halogen_Component.renderComponent(c)(_3.state);
                    var vtree$prime = Halogen_HTML_Renderer_VirtualDOM.renderHTML(driver(ref))(_7.value0);
                    return Prelude.bind(Control_Monad_Aff.bindAff)(Control_Monad_Eff_Class.liftEff(Control_Monad_Aff.monadEffAff)(Halogen_Internal_VirtualDOM.patch(Halogen_Internal_VirtualDOM.diff(_3.vtree)(vtree$prime))(_3.node)))(function (_2) {
                        return Control_Monad_Aff_AVar.putVar(ref)({
                            node: _2, 
                            vtree: vtree$prime, 
                            state: _7.value1, 
                            renderPending: false
                        });
                    });
                };
                throw new Error("Failed pattern match at Halogen.Driver line 56, column 1 - line 61, column 1: " + [ _6.constructor.name ]);
            });
        };
        var $$eval = function (ref) {
            return function (h) {
                if (h instanceof Halogen_Query_HalogenF.StateHF) {
                    return Prelude.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.takeVar(ref))(function (_1) {
                        var _13 = Control_Monad_State.runState(Halogen_Query_StateF.stateN(Control_Monad_State_Trans.monadStateT(Data_Identity.monadIdentity))(Control_Monad_State_Trans.monadStateStateT(Data_Identity.monadIdentity))(h.value0))(_1.state);
                        return Prelude.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.putVar(ref)({
                            node: _1.node, 
                            vtree: _1.vtree, 
                            state: _13.value1, 
                            renderPending: true
                        }))(function () {
                            return Prelude.pure(Control_Monad_Aff.applicativeAff)(_13.value0);
                        });
                    });
                };
                if (h instanceof Halogen_Query_HalogenF.SubscribeHF) {
                    var producer = Halogen_Query_EventSource.runEventSource(h.value0);
                    var consumer = Control_Monad_Rec_Class.forever(Control_Monad_Free_Trans.monadRecFreeT(Control_Coroutine.functorAwait)(Control_Monad_Aff.monadAff))(Control_Bind["=<<"](Control_Monad_Free_Trans.bindFreeT(Control_Coroutine.functorAwait)(Control_Monad_Aff.monadAff))(function (_25) {
                        return Control_Monad_Trans.lift(Control_Monad_Free_Trans.monadTransFreeT(Control_Coroutine.functorAwait))(Control_Monad_Aff.monadAff)(driver(ref)(_25));
                    })(Control_Coroutine.await(Control_Monad_Aff.monadAff)));
                    return Prelude.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff.forkAff(Control_Coroutine_Stalling.runStallingProcess(Control_Monad_Aff.monadRecAff)(Control_Coroutine_Stalling["$$?"](Control_Monad_Aff.monadRecAff)(producer)(consumer))))(function () {
                        return Prelude.pure(Control_Monad_Aff.applicativeAff)(h.value1);
                    });
                };
                if (h instanceof Halogen_Query_HalogenF.QueryHF) {
                    return Prelude.bind(Control_Monad_Aff.bindAff)(render(ref))(function () {
                        return h.value0;
                    });
                };
                if (h instanceof Halogen_Query_HalogenF.HaltHF) {
                    return Control_Plus.empty(Control_Monad_Aff.plusAff);
                };
                throw new Error("Failed pattern match at Halogen.Driver line 56, column 1 - line 61, column 1: " + [ h.constructor.name ]);
            };
        };
        var driver = function (ref) {
            return function (q) {
                return Prelude.bind(Control_Monad_Aff.bindAff)(Control_Monad_Free.runFreeM(Halogen_Query_HalogenF.functorHalogenF(Control_Monad_Aff.functorAff))(Control_Monad_Aff.monadRecAff)($$eval(ref))(Halogen_Component.queryComponent(c)(q)))(function (_0) {
                    return Prelude.bind(Control_Monad_Aff.bindAff)(render(ref))(function () {
                        return Prelude.pure(Control_Monad_Aff.applicativeAff)(_0);
                    });
                });
            };
        };
        var _21 = Halogen_Component.renderComponent(c)(s);
        return Prelude.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.makeVar)(function (_4) {
            var vtree = Halogen_HTML_Renderer_VirtualDOM.renderHTML(driver(_4))(_21.value0);
            var node = Halogen_Internal_VirtualDOM.createElement(vtree);
            return Prelude.bind(Control_Monad_Aff.bindAff)(Control_Monad_Aff_AVar.putVar(_4)({
                node: node, 
                vtree: vtree, 
                state: _21.value1, 
                renderPending: false
            }))(function () {
                return Prelude.pure(Control_Monad_Aff.applicativeAff)({
                    node: node, 
                    driver: driver(_4)
                });
            });
        });
    };
};
module.exports = {
    runUI: runUI
};

},{"Control.Bind":"/Users/maximko/Projects/mine/guppi/output/Control.Bind/index.js","Control.Coroutine":"/Users/maximko/Projects/mine/guppi/output/Control.Coroutine/index.js","Control.Coroutine.Stalling":"/Users/maximko/Projects/mine/guppi/output/Control.Coroutine.Stalling/index.js","Control.Monad.Aff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff/index.js","Control.Monad.Aff.AVar":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff.AVar/index.js","Control.Monad.Eff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Class/index.js","Control.Monad.Free":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Free/index.js","Control.Monad.Free.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Free.Trans/index.js","Control.Monad.Rec.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Rec.Class/index.js","Control.Monad.State":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State/index.js","Control.Monad.State.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State.Trans/index.js","Control.Monad.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Trans/index.js","Control.Plus":"/Users/maximko/Projects/mine/guppi/output/Control.Plus/index.js","DOM.HTML.Types":"/Users/maximko/Projects/mine/guppi/output/DOM.HTML.Types/index.js","Data.Identity":"/Users/maximko/Projects/mine/guppi/output/Data.Identity/index.js","Data.NaturalTransformation":"/Users/maximko/Projects/mine/guppi/output/Data.NaturalTransformation/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Halogen.Component":"/Users/maximko/Projects/mine/guppi/output/Halogen.Component/index.js","Halogen.Effects":"/Users/maximko/Projects/mine/guppi/output/Halogen.Effects/index.js","Halogen.HTML.Renderer.VirtualDOM":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Renderer.VirtualDOM/index.js","Halogen.Internal.VirtualDOM":"/Users/maximko/Projects/mine/guppi/output/Halogen.Internal.VirtualDOM/index.js","Halogen.Query":"/Users/maximko/Projects/mine/guppi/output/Halogen.Query/index.js","Halogen.Query.EventSource":"/Users/maximko/Projects/mine/guppi/output/Halogen.Query.EventSource/index.js","Halogen.Query.HalogenF":"/Users/maximko/Projects/mine/guppi/output/Halogen.Query.HalogenF/index.js","Halogen.Query.StateF":"/Users/maximko/Projects/mine/guppi/output/Halogen.Query.StateF/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.Effects/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Control_Monad_Aff_AVar = require("Control.Monad.Aff.AVar");
var Control_Monad_Eff_Exception = require("Control.Monad.Eff.Exception");
var DOM = require("DOM");
module.exports = {};

},{"Control.Monad.Aff.AVar":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff.AVar/index.js","Control.Monad.Eff.Exception":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Exception/index.js","DOM":"/Users/maximko/Projects/mine/guppi/output/DOM/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Core/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Bifunctor = require("Data.Bifunctor");
var Data_Exists = require("Data.Exists");
var Data_ExistsR = require("Data.ExistsR");
var Data_Maybe = require("Data.Maybe");
var Data_Traversable = require("Data.Traversable");
var Data_Tuple = require("Data.Tuple");
var DOM_HTML_Types = require("DOM.HTML.Types");
var Halogen_HTML_Events_Handler = require("Halogen.HTML.Events.Handler");
var Halogen_HTML_Events_Types = require("Halogen.HTML.Events.Types");
var TagName = function (x) {
    return x;
};
var PropName = function (x) {
    return x;
};
var Namespace = function (x) {
    return x;
};
var EventName = function (x) {
    return x;
};
var HandlerF = (function () {
    function HandlerF(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    HandlerF.create = function (value0) {
        return function (value1) {
            return new HandlerF(value0, value1);
        };
    };
    return HandlerF;
})();
var ClassName = function (x) {
    return x;
};
var AttrName = function (x) {
    return x;
};
var PropF = (function () {
    function PropF(value0, value1, value2) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
    };
    PropF.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return new PropF(value0, value1, value2);
            };
        };
    };
    return PropF;
})();
var Prop = (function () {
    function Prop(value0) {
        this.value0 = value0;
    };
    Prop.create = function (value0) {
        return new Prop(value0);
    };
    return Prop;
})();
var Attr = (function () {
    function Attr(value0, value1, value2) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
    };
    Attr.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return new Attr(value0, value1, value2);
            };
        };
    };
    return Attr;
})();
var Key = (function () {
    function Key(value0) {
        this.value0 = value0;
    };
    Key.create = function (value0) {
        return new Key(value0);
    };
    return Key;
})();
var Handler = (function () {
    function Handler(value0) {
        this.value0 = value0;
    };
    Handler.create = function (value0) {
        return new Handler(value0);
    };
    return Handler;
})();
var Initializer = (function () {
    function Initializer(value0) {
        this.value0 = value0;
    };
    Initializer.create = function (value0) {
        return new Initializer(value0);
    };
    return Initializer;
})();
var Finalizer = (function () {
    function Finalizer(value0) {
        this.value0 = value0;
    };
    Finalizer.create = function (value0) {
        return new Finalizer(value0);
    };
    return Finalizer;
})();
var Text = (function () {
    function Text(value0) {
        this.value0 = value0;
    };
    Text.create = function (value0) {
        return new Text(value0);
    };
    return Text;
})();
var Element = (function () {
    function Element(value0, value1, value2, value3) {
        this.value0 = value0;
        this.value1 = value1;
        this.value2 = value2;
        this.value3 = value3;
    };
    Element.create = function (value0) {
        return function (value1) {
            return function (value2) {
                return function (value3) {
                    return new Element(value0, value1, value2, value3);
                };
            };
        };
    };
    return Element;
})();
var Slot = (function () {
    function Slot(value0) {
        this.value0 = value0;
    };
    Slot.create = function (value0) {
        return new Slot(value0);
    };
    return Slot;
})();
var IsProp = function (toPropString) {
    this.toPropString = toPropString;
};
var toPropString = function (dict) {
    return dict.toPropString;
};
var tagName = TagName;
var stringIsProp = new IsProp(function (_10) {
    return function (_11) {
        return function (s) {
            return s;
        };
    };
});
var runTagName = function (_3) {
    return _3;
};
var runPropName = function (_4) {
    return _4;
};
var runNamespace = function (_2) {
    return _2;
};
var runEventName = function (_6) {
    return _6;
};
var runClassName = function (_7) {
    return _7;
};
var runAttrName = function (_5) {
    return _5;
};
var propName = PropName;
var prop = function (__dict_IsProp_0) {
    return function (name) {
        return function (attr) {
            return function (v) {
                return new Prop(Data_Exists.mkExists(new PropF(name, v, Prelude["<$>"](Data_Maybe.functorMaybe)(Prelude.flip(Data_Tuple.Tuple.create)(toPropString(__dict_IsProp_0)))(attr))));
            };
        };
    };
};
var numberIsProp = new IsProp(function (_14) {
    return function (_15) {
        return function (n) {
            return Prelude.show(Prelude.showNumber)(n);
        };
    };
});
var namespace = Namespace;
var intIsProp = new IsProp(function (_12) {
    return function (_13) {
        return function (i) {
            return Prelude.show(Prelude.showInt)(i);
        };
    };
});
var handler$prime = function (name) {
    return function (k) {
        return new Handler(Data_ExistsR.mkExistsR(new HandlerF(name, k)));
    };
};
var handler = function (name) {
    return function (k) {
        return new Handler(Data_ExistsR.mkExistsR(new HandlerF(name, function (_56) {
            return Prelude.map(Halogen_HTML_Events_Handler.functorEventHandler)(Data_Maybe.Just.create)(k(_56));
        })));
    };
};
var functorProp = new Prelude.Functor(function (f) {
    return function (_9) {
        if (_9 instanceof Prop) {
            return new Prop(_9.value0);
        };
        if (_9 instanceof Key) {
            return new Key(_9.value0);
        };
        if (_9 instanceof Attr) {
            return new Attr(_9.value0, _9.value1, _9.value2);
        };
        if (_9 instanceof Handler) {
            return Data_ExistsR.runExistsR(function (_0) {
                return new Handler(Data_ExistsR.mkExistsR(new HandlerF(_0.value0, function (_57) {
                    return Prelude.map(Halogen_HTML_Events_Handler.functorEventHandler)(Prelude.map(Data_Maybe.functorMaybe)(f))(_0.value1(_57));
                })));
            })(_9.value0);
        };
        if (_9 instanceof Initializer) {
            return new Initializer(function (_58) {
                return f(_9.value0(_58));
            });
        };
        if (_9 instanceof Finalizer) {
            return new Finalizer(function (_59) {
                return f(_9.value0(_59));
            });
        };
        throw new Error("Failed pattern match at Halogen.HTML.Core line 101, column 1 - line 111, column 1: " + [ f.constructor.name, _9.constructor.name ]);
    };
});
var fillSlot = function (__dict_Applicative_1) {
    return function (f) {
        return function (g) {
            return function (_1) {
                if (_1 instanceof Text) {
                    return Prelude.pure(__dict_Applicative_1)(new Text(_1.value0));
                };
                if (_1 instanceof Element) {
                    return Prelude["<$>"]((__dict_Applicative_1["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Element.create(_1.value0)(_1.value1)(Prelude["<$>"](Prelude.functorArray)(Prelude["<$>"](functorProp)(g))(_1.value2)))(Data_Traversable.traverse(Data_Traversable.traversableArray)(__dict_Applicative_1)(fillSlot(__dict_Applicative_1)(f)(g))(_1.value3));
                };
                if (_1 instanceof Slot) {
                    return f(_1.value0);
                };
                throw new Error("Failed pattern match: " + [ f.constructor.name, g.constructor.name, _1.constructor.name ]);
            };
        };
    };
};
var eventName = EventName;
var element = Element.create(Data_Maybe.Nothing.value);
var className = ClassName;
var booleanIsProp = new IsProp(function (name) {
    return function (_16) {
        return function (_17) {
            if (_17) {
                return runAttrName(name);
            };
            if (!_17) {
                return "";
            };
            throw new Error("Failed pattern match at Halogen.HTML.Core line 146, column 1 - line 151, column 1: " + [ name.constructor.name, _16.constructor.name, _17.constructor.name ]);
        };
    };
});
var bifunctorHTML = new Data_Bifunctor.Bifunctor(function (f) {
    return function (g) {
        var go = function (_8) {
            if (_8 instanceof Text) {
                return new Text(_8.value0);
            };
            if (_8 instanceof Element) {
                return new Element(_8.value0, _8.value1, Prelude["<$>"](Prelude.functorArray)(Prelude["<$>"](functorProp)(g))(_8.value2), Prelude["<$>"](Prelude.functorArray)(go)(_8.value3));
            };
            if (_8 instanceof Slot) {
                return new Slot(f(_8.value0));
            };
            throw new Error("Failed pattern match at Halogen.HTML.Core line 62, column 1 - line 69, column 1: " + [ _8.constructor.name ]);
        };
        return go;
    };
});
var functorHTML = new Prelude.Functor(Data_Bifunctor.rmap(bifunctorHTML));
var attrName = AttrName;
module.exports = {
    HandlerF: HandlerF, 
    PropF: PropF, 
    Prop: Prop, 
    Attr: Attr, 
    Key: Key, 
    Handler: Handler, 
    Initializer: Initializer, 
    Finalizer: Finalizer, 
    Text: Text, 
    Element: Element, 
    Slot: Slot, 
    IsProp: IsProp, 
    runClassName: runClassName, 
    className: className, 
    runEventName: runEventName, 
    eventName: eventName, 
    runAttrName: runAttrName, 
    attrName: attrName, 
    runPropName: runPropName, 
    propName: propName, 
    runTagName: runTagName, 
    tagName: tagName, 
    runNamespace: runNamespace, 
    namespace: namespace, 
    toPropString: toPropString, 
    "handler'": handler$prime, 
    handler: handler, 
    prop: prop, 
    fillSlot: fillSlot, 
    element: element, 
    bifunctorHTML: bifunctorHTML, 
    functorHTML: functorHTML, 
    functorProp: functorProp, 
    stringIsProp: stringIsProp, 
    intIsProp: intIsProp, 
    numberIsProp: numberIsProp, 
    booleanIsProp: booleanIsProp
};

},{"DOM.HTML.Types":"/Users/maximko/Projects/mine/guppi/output/DOM.HTML.Types/index.js","Data.Bifunctor":"/Users/maximko/Projects/mine/guppi/output/Data.Bifunctor/index.js","Data.Exists":"/Users/maximko/Projects/mine/guppi/output/Data.Exists/index.js","Data.ExistsR":"/Users/maximko/Projects/mine/guppi/output/Data.ExistsR/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Traversable":"/Users/maximko/Projects/mine/guppi/output/Data.Traversable/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Halogen.HTML.Events.Handler":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events.Handler/index.js","Halogen.HTML.Events.Types":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events.Types/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Elements.Indexed/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Halogen_HTML_Core = require("Halogen.HTML.Core");
var Halogen_HTML_Properties_Indexed = require("Halogen.HTML.Properties.Indexed");
var Halogen_HTML_Elements = require("Halogen.HTML.Elements");
var Unsafe_Coerce = require("Unsafe.Coerce");
var wbr = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.wbr);
var video = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.video);
var $$var = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements["var"]);
var ul = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.ul);
var u = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.u);
var tt = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.tt);
var track = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.track);
var tr = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.tr);
var title = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.title);
var time = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.time);
var thead = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.thead);
var th = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.th);
var tfoot = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.tfoot);
var textarea = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.textarea);
var td = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.td);
var tbody = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.tbody);
var table = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.table);
var sup = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.sup);
var summary = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.summary);
var sub = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.sub);
var style = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.style);
var strong = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.strong);
var span = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.span);
var source = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.source);
var small = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.small);
var select = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.select);
var section = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.section);
var script = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.script);
var samp = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.samp);
var s = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.s);
var ruby = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.ruby);
var rt = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.rt);
var rp = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.rp);
var q = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.q);
var progress = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.progress);
var pre = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.pre);
var param = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.param);
var p = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.p);
var output = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.output);
var option = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.option);
var optgroup = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.optgroup);
var ol = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.ol);
var object = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.object);
var noscript = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.noscript);
var noframes = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.noframes);
var nav = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.nav);
var meter = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.meter);
var meta = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.meta);
var menuitem = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.menuitem);
var menu = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.menu);
var mark = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.mark);
var map = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.map);
var main = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.main);
var link = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.link);
var li = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.li);
var legend = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.legend);
var label = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.label);
var keygen = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.keygen);
var kbd = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.kbd);
var ins = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.ins);
var input = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.input);
var img = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.img);
var iframe = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.iframe);
var i = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.i);
var html = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.html);
var hr = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.hr);
var header = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.header);
var head = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.head);
var h6 = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.h6);
var h5 = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.h5);
var h4 = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.h4);
var h3 = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.h3);
var h2 = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.h2);
var h1 = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.h1);
var form = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.form);
var footer = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.footer);
var figure = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.figure);
var figcaption = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.figcaption);
var fieldset = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.fieldset);
var embed = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.embed);
var em = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.em);
var dt = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.dt);
var dl = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.dl);
var div = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.div);
var dir = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.dir);
var dialog = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.dialog);
var dfn = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.dfn);
var details = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.details);
var del = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.del);
var dd = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.dd);
var datalist = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.datalist);
var command = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.command);
var colgroup = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.colgroup);
var col = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.col);
var code = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.code);
var cite = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.cite);
var center = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.center);
var caption = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.caption);
var canvas = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.canvas);
var button = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.button);
var br = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.br);
var body = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.body);
var blockquote = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.blockquote);
var big = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.big);
var bdo = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.bdo);
var bdi = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.bdi);
var basefont = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.basefont);
var base = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.base);
var b = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.b);
var audio = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.audio);
var aside = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.aside);
var article = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.article);
var area = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.area);
var applet = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.applet);
var address = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.address);
var acronym = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.acronym);
var abbr = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.a);
var a = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Elements.a);
module.exports = {
    wbr: wbr, 
    video: video, 
    "var": $$var, 
    ul: ul, 
    u: u, 
    tt: tt, 
    track: track, 
    tr: tr, 
    title: title, 
    time: time, 
    thead: thead, 
    th: th, 
    tfoot: tfoot, 
    textarea: textarea, 
    td: td, 
    tbody: tbody, 
    table: table, 
    sup: sup, 
    summary: summary, 
    sub: sub, 
    style: style, 
    strong: strong, 
    span: span, 
    source: source, 
    small: small, 
    select: select, 
    section: section, 
    script: script, 
    samp: samp, 
    s: s, 
    ruby: ruby, 
    rt: rt, 
    rp: rp, 
    q: q, 
    progress: progress, 
    pre: pre, 
    param: param, 
    p: p, 
    output: output, 
    option: option, 
    optgroup: optgroup, 
    ol: ol, 
    object: object, 
    noscript: noscript, 
    noframes: noframes, 
    nav: nav, 
    meter: meter, 
    meta: meta, 
    menuitem: menuitem, 
    menu: menu, 
    mark: mark, 
    map: map, 
    main: main, 
    link: link, 
    li: li, 
    legend: legend, 
    label: label, 
    keygen: keygen, 
    kbd: kbd, 
    ins: ins, 
    input: input, 
    img: img, 
    iframe: iframe, 
    i: i, 
    html: html, 
    hr: hr, 
    header: header, 
    head: head, 
    h6: h6, 
    h5: h5, 
    h4: h4, 
    h3: h3, 
    h2: h2, 
    h1: h1, 
    form: form, 
    footer: footer, 
    figure: figure, 
    figcaption: figcaption, 
    fieldset: fieldset, 
    embed: embed, 
    em: em, 
    dt: dt, 
    dl: dl, 
    div: div, 
    dir: dir, 
    dialog: dialog, 
    dfn: dfn, 
    details: details, 
    del: del, 
    dd: dd, 
    datalist: datalist, 
    command: command, 
    colgroup: colgroup, 
    col: col, 
    code: code, 
    cite: cite, 
    center: center, 
    caption: caption, 
    canvas: canvas, 
    button: button, 
    br: br, 
    body: body, 
    blockquote: blockquote, 
    big: big, 
    bdo: bdo, 
    bdi: bdi, 
    basefont: basefont, 
    base: base, 
    b: b, 
    audio: audio, 
    aside: aside, 
    article: article, 
    area: area, 
    applet: applet, 
    address: address, 
    acronym: acronym, 
    abbr: abbr, 
    a: a
};

},{"Halogen.HTML.Core":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Core/index.js","Halogen.HTML.Elements":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Elements/index.js","Halogen.HTML.Properties.Indexed":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Properties.Indexed/index.js","Unsafe.Coerce":"/Users/maximko/Projects/mine/guppi/output/Unsafe.Coerce/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Elements/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Halogen_HTML_Core = require("Halogen.HTML.Core");
var wbr = function (props) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("wbr"))(props)([  ]);
};
var video = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("video"))(xs);
};
var video_ = video([  ]);
var $$var = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("var"))(xs);
};
var var_ = $$var([  ]);
var ul = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("ul"))(xs);
};
var ul_ = ul([  ]);
var u = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("u"))(xs);
};
var u_ = u([  ]);
var tt = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("tt"))(xs);
};
var tt_ = tt([  ]);
var track = function (props) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("track"))(props)([  ]);
};
var tr = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("tr"))(xs);
};
var tr_ = tr([  ]);
var title = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("title"))(xs);
};
var title_ = title([  ]);
var time = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("time"))(xs);
};
var time_ = time([  ]);
var thead = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("thead"))(xs);
};
var thead_ = thead([  ]);
var th = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("th"))(xs);
};
var th_ = th([  ]);
var tfoot = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("tfoot"))(xs);
};
var tfoot_ = tfoot([  ]);
var textarea = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("textarea"))(xs)([  ]);
};
var td = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("td"))(xs);
};
var td_ = td([  ]);
var tbody = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("tbody"))(xs);
};
var tbody_ = tbody([  ]);
var table = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("table"))(xs);
};
var table_ = table([  ]);
var sup = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("sup"))(xs);
};
var sup_ = sup([  ]);
var summary = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("summary"))(xs);
};
var summary_ = summary([  ]);
var sub = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("sub"))(xs);
};
var sub_ = sub([  ]);
var style = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("style"))(xs);
};
var style_ = style([  ]);
var strong = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("strong"))(xs);
};
var strong_ = strong([  ]);
var strike = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("strike"))(xs);
};
var strike_ = strike([  ]);
var span = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("span"))(xs);
};
var span_ = span([  ]);
var source = function (props) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("source"))(props)([  ]);
};
var small = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("small"))(xs);
};
var small_ = small([  ]);
var select = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("select"))(xs);
};
var select_ = select([  ]);
var section = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("section"))(xs);
};
var section_ = section([  ]);
var script = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("script"))(xs);
};
var script_ = script([  ]);
var samp = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("samp"))(xs);
};
var samp_ = samp([  ]);
var s = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("s"))(xs);
};
var s_ = s([  ]);
var ruby = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("ruby"))(xs);
};
var ruby_ = ruby([  ]);
var rt = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("rt"))(xs);
};
var rt_ = rt([  ]);
var rp = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("rp"))(xs);
};
var rp_ = rp([  ]);
var q = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("q"))(xs);
};
var q_ = q([  ]);
var progress = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("progress"))(xs);
};
var progress_ = progress([  ]);
var pre = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("pre"))(xs);
};
var pre_ = pre([  ]);
var param = function (props) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("param"))(props)([  ]);
};
var p = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("p"))(xs);
};
var p_ = p([  ]);
var output = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("output"))(xs);
};
var output_ = output([  ]);
var option = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("option"))(xs);
};
var option_ = option([  ]);
var optgroup = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("optgroup"))(xs);
};
var optgroup_ = optgroup([  ]);
var ol = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("ol"))(xs);
};
var ol_ = ol([  ]);
var object = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("object"))(xs);
};
var object_ = object([  ]);
var noscript = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("noscript"))(xs);
};
var noscript_ = noscript([  ]);
var noframes = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("noframes"))(xs);
};
var noframes_ = noframes([  ]);
var nav = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("nav"))(xs);
};
var nav_ = nav([  ]);
var meter = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("meter"))(xs);
};
var meter_ = meter([  ]);
var meta = function (props) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("meta"))(props)([  ]);
};
var menuitem = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("menuitem"))(xs);
};
var menuitem_ = menuitem([  ]);
var menu = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("menu"))(xs);
};
var menu_ = menu([  ]);
var mark = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("mark"))(xs);
};
var mark_ = mark([  ]);
var map = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("map"))(xs);
};
var map_ = map([  ]);
var main = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("main"))(xs);
};
var main_ = main([  ]);
var link = function (props) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("link"))(props)([  ]);
};
var li = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("li"))(xs);
};
var li_ = li([  ]);
var legend = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("legend"))(xs);
};
var legend_ = legend([  ]);
var label = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("label"))(xs);
};
var label_ = label([  ]);
var keygen = function (props) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("keygen"))(props)([  ]);
};
var kbd = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("kbd"))(xs);
};
var kbd_ = kbd([  ]);
var ins = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("ins"))(xs);
};
var ins_ = ins([  ]);
var input = function (props) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("input"))(props)([  ]);
};
var img = function (props) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("img"))(props)([  ]);
};
var iframe = function (props) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("iframe"))(props)([  ]);
};
var i = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("i"))(xs);
};
var i_ = i([  ]);
var html = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("html"))(xs);
};
var html_ = html([  ]);
var hr = function (props) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("hr"))(props)([  ]);
};
var hr_ = hr([  ]);
var header = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("header"))(xs);
};
var header_ = header([  ]);
var head = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("head"))(xs);
};
var head_ = head([  ]);
var h6 = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("h6"))(xs);
};
var h6_ = h6([  ]);
var h5 = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("h5"))(xs);
};
var h5_ = h5([  ]);
var h4 = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("h4"))(xs);
};
var h4_ = h4([  ]);
var h3 = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("h3"))(xs);
};
var h3_ = h3([  ]);
var h2 = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("h2"))(xs);
};
var h2_ = h2([  ]);
var h1 = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("h1"))(xs);
};
var h1_ = h1([  ]);
var frameset = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("frameset"))(xs);
};
var frameset_ = frameset([  ]);
var frame = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("frame"))(xs);
};
var frame_ = frame([  ]);
var form = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("form"))(xs);
};
var form_ = form([  ]);
var footer = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("footer"))(xs);
};
var footer_ = footer([  ]);
var font = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("font"))(xs);
};
var font_ = font([  ]);
var figure = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("figure"))(xs);
};
var figure_ = figure([  ]);
var figcaption = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("figcaption"))(xs);
};
var figcaption_ = figcaption([  ]);
var fieldset = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("fieldset"))(xs);
};
var fieldset_ = fieldset([  ]);
var embed = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("embed"))(xs);
};
var embed_ = embed([  ]);
var em = Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("em"));
var em_ = em([  ]);
var dt = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("dt"))(xs);
};
var dt_ = dt([  ]);
var dl = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("dl"))(xs);
};
var dl_ = dl([  ]);
var div = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("div"))(xs);
};
var div_ = div([  ]);
var dir = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("dir"))(xs);
};
var dir_ = dir([  ]);
var dialog = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("dialog"))(xs);
};
var dialog_ = dialog([  ]);
var dfn = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("dfn"))(xs);
};
var dfn_ = dfn([  ]);
var details = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("details"))(xs);
};
var details_ = details([  ]);
var del = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("del"))(xs);
};
var del_ = del([  ]);
var dd = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("dd"))(xs);
};
var dd_ = dd([  ]);
var datalist = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("datalist"))(xs);
};
var datalist_ = datalist([  ]);
var command = function (props) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("command"))(props)([  ]);
};
var colgroup = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("colgroup"))(xs);
};
var colgroup_ = colgroup([  ]);
var col = function (props) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("col"))(props)([  ]);
};
var code = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("code"))(xs);
};
var code_ = code([  ]);
var cite = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("cite"))(xs);
};
var cite_ = cite([  ]);
var center = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("center"))(xs);
};
var center_ = center([  ]);
var caption = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("caption"))(xs);
};
var caption_ = caption([  ]);
var canvas = function (props) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("canvas"))(props)([  ]);
};
var button = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("button"))(xs);
};
var button_ = button([  ]);
var br = function (props) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("br"))(props)([  ]);
};
var br_ = br([  ]);
var body = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("body"))(xs);
};
var body_ = body([  ]);
var blockquote = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("blockquote"))(xs);
};
var blockquote_ = blockquote([  ]);
var big = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("big"))(xs);
};
var big_ = big([  ]);
var bdo = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("bdo"))(xs);
};
var bdo_ = bdo([  ]);
var bdi = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("bdi"))(xs);
};
var bdi_ = bdi([  ]);
var basefont = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("basefont"))(xs);
};
var basefont_ = basefont([  ]);
var base = function (props) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("base"))(props)([  ]);
};
var b = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("b"))(xs);
};
var b_ = b([  ]);
var audio = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("audio"))(xs);
};
var audio_ = audio([  ]);
var aside = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("aside"))(xs);
};
var aside_ = aside([  ]);
var article = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("article"))(xs);
};
var article_ = article([  ]);
var area = function (props) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("area"))(props)([  ]);
};
var applet = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("applet"))(xs);
};
var applet_ = applet([  ]);
var address = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("address"))(xs);
};
var address_ = address([  ]);
var acronym = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("acronym"))(xs);
};
var acronym_ = acronym([  ]);
var abbr = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("abbr"))(xs);
};
var abbr_ = abbr([  ]);
var a = function (xs) {
    return Halogen_HTML_Core.element(Halogen_HTML_Core.tagName("a"))(xs);
};
var a_ = a([  ]);
module.exports = {
    wbr: wbr, 
    video_: video_, 
    video: video, 
    var_: var_, 
    "var": $$var, 
    ul_: ul_, 
    ul: ul, 
    u_: u_, 
    u: u, 
    tt_: tt_, 
    tt: tt, 
    track: track, 
    tr_: tr_, 
    tr: tr, 
    title_: title_, 
    title: title, 
    time_: time_, 
    time: time, 
    thead_: thead_, 
    thead: thead, 
    th_: th_, 
    th: th, 
    tfoot_: tfoot_, 
    tfoot: tfoot, 
    textarea: textarea, 
    td_: td_, 
    td: td, 
    tbody_: tbody_, 
    tbody: tbody, 
    table_: table_, 
    table: table, 
    sup_: sup_, 
    sup: sup, 
    summary_: summary_, 
    summary: summary, 
    sub_: sub_, 
    sub: sub, 
    style_: style_, 
    style: style, 
    strong_: strong_, 
    strong: strong, 
    strike_: strike_, 
    strike: strike, 
    span_: span_, 
    span: span, 
    source: source, 
    small_: small_, 
    small: small, 
    select_: select_, 
    select: select, 
    section_: section_, 
    section: section, 
    script_: script_, 
    script: script, 
    samp_: samp_, 
    samp: samp, 
    s_: s_, 
    s: s, 
    ruby_: ruby_, 
    ruby: ruby, 
    rt_: rt_, 
    rt: rt, 
    rp_: rp_, 
    rp: rp, 
    q_: q_, 
    q: q, 
    progress_: progress_, 
    progress: progress, 
    pre_: pre_, 
    pre: pre, 
    param: param, 
    p_: p_, 
    p: p, 
    output_: output_, 
    output: output, 
    option_: option_, 
    option: option, 
    optgroup_: optgroup_, 
    optgroup: optgroup, 
    ol_: ol_, 
    ol: ol, 
    object_: object_, 
    object: object, 
    noscript_: noscript_, 
    noscript: noscript, 
    noframes_: noframes_, 
    noframes: noframes, 
    nav_: nav_, 
    nav: nav, 
    meter_: meter_, 
    meter: meter, 
    meta: meta, 
    menuitem_: menuitem_, 
    menuitem: menuitem, 
    menu_: menu_, 
    menu: menu, 
    mark_: mark_, 
    mark: mark, 
    map_: map_, 
    map: map, 
    main_: main_, 
    main: main, 
    link: link, 
    li_: li_, 
    li: li, 
    legend_: legend_, 
    legend: legend, 
    label_: label_, 
    label: label, 
    keygen: keygen, 
    kbd_: kbd_, 
    kbd: kbd, 
    ins_: ins_, 
    ins: ins, 
    input: input, 
    img: img, 
    iframe: iframe, 
    i_: i_, 
    i: i, 
    html_: html_, 
    html: html, 
    hr_: hr_, 
    hr: hr, 
    header_: header_, 
    header: header, 
    head_: head_, 
    head: head, 
    h6_: h6_, 
    h6: h6, 
    h5_: h5_, 
    h5: h5, 
    h4_: h4_, 
    h4: h4, 
    h3_: h3_, 
    h3: h3, 
    h2_: h2_, 
    h2: h2, 
    h1_: h1_, 
    h1: h1, 
    frameset_: frameset_, 
    frameset: frameset, 
    frame_: frame_, 
    frame: frame, 
    form_: form_, 
    form: form, 
    footer_: footer_, 
    footer: footer, 
    font_: font_, 
    font: font, 
    figure_: figure_, 
    figure: figure, 
    figcaption_: figcaption_, 
    figcaption: figcaption, 
    fieldset_: fieldset_, 
    fieldset: fieldset, 
    embed_: embed_, 
    embed: embed, 
    em_: em_, 
    em: em, 
    dt_: dt_, 
    dt: dt, 
    dl_: dl_, 
    dl: dl, 
    div_: div_, 
    div: div, 
    dir_: dir_, 
    dir: dir, 
    dialog_: dialog_, 
    dialog: dialog, 
    dfn_: dfn_, 
    dfn: dfn, 
    details_: details_, 
    details: details, 
    del_: del_, 
    del: del, 
    dd_: dd_, 
    dd: dd, 
    datalist_: datalist_, 
    datalist: datalist, 
    command: command, 
    colgroup_: colgroup_, 
    colgroup: colgroup, 
    col: col, 
    code_: code_, 
    code: code, 
    cite_: cite_, 
    cite: cite, 
    center_: center_, 
    center: center, 
    caption_: caption_, 
    caption: caption, 
    canvas: canvas, 
    button_: button_, 
    button: button, 
    br_: br_, 
    br: br, 
    body_: body_, 
    body: body, 
    blockquote_: blockquote_, 
    blockquote: blockquote, 
    big_: big_, 
    big: big, 
    bdo_: bdo_, 
    bdo: bdo, 
    bdi_: bdi_, 
    bdi: bdi, 
    basefont_: basefont_, 
    basefont: basefont, 
    base: base, 
    b_: b_, 
    b: b, 
    audio_: audio_, 
    audio: audio, 
    aside_: aside_, 
    aside: aside, 
    article_: article_, 
    article: article, 
    area: area, 
    applet_: applet_, 
    applet: applet, 
    address_: address_, 
    address: address, 
    acronym_: acronym_, 
    acronym: acronym, 
    abbr_: abbr_, 
    abbr: abbr, 
    a_: a_, 
    a: a
};

},{"Halogen.HTML.Core":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Core/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events.Forms/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Either = require("Data.Either");
var Data_Foreign = require("Data.Foreign");
var Data_Foreign_Class = require("Data.Foreign.Class");
var Data_Maybe = require("Data.Maybe");
var Halogen_HTML_Core = require("Halogen.HTML.Core");
var Halogen_HTML_Events_Handler = require("Halogen.HTML.Events.Handler");
var Data_Foreign_Index = require("Data.Foreign.Index");
var addForeignPropHandler = function (__dict_IsForeign_0) {
    return function (key) {
        return function (prop) {
            return function (f) {
                return Halogen_HTML_Core["handler'"](Halogen_HTML_Core.eventName(key))(function (_1) {
                    return Data_Either.either(Prelude["const"](Prelude.pure(Halogen_HTML_Events_Handler.applicativeEventHandler)(Data_Maybe.Nothing.value)))(function (_2) {
                        return Prelude.map(Halogen_HTML_Events_Handler.functorEventHandler)(Data_Maybe.Just.create)(f(_2));
                    })(Data_Foreign_Class.readProp(__dict_IsForeign_0)(Data_Foreign_Index.indexString)(prop)(Data_Foreign.toForeign((function (_0) {
                        return _0.target;
                    })(_1))));
                });
            };
        };
    };
};
var onChecked = addForeignPropHandler(Data_Foreign_Class.booleanIsForeign)("change")("checked");
var onValueChange = addForeignPropHandler(Data_Foreign_Class.stringIsForeign)("change")("value");
var onValueInput = addForeignPropHandler(Data_Foreign_Class.stringIsForeign)("input")("value");
module.exports = {
    onChecked: onChecked, 
    onValueInput: onValueInput, 
    onValueChange: onValueChange
};

},{"Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Foreign":"/Users/maximko/Projects/mine/guppi/output/Data.Foreign/index.js","Data.Foreign.Class":"/Users/maximko/Projects/mine/guppi/output/Data.Foreign.Class/index.js","Data.Foreign.Index":"/Users/maximko/Projects/mine/guppi/output/Data.Foreign.Index/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Halogen.HTML.Core":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Core/index.js","Halogen.HTML.Events.Handler":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events.Handler/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events.Handler/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Halogen.HTML.Events.Handler

exports.preventDefaultImpl = function (e) {
  return function () {
    e.preventDefault();
  };
};

exports.stopPropagationImpl = function (e) {
  return function () {
    e.stopPropagation();
  };
};

exports.stopImmediatePropagationImpl = function (e) {
  return function () {
    e.stopImmediatePropagation();
  };
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events.Handler/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Control_Apply = require("Control.Apply");
var Control_Monad_Eff = require("Control.Monad.Eff");
var Control_Monad_Eff_Class = require("Control.Monad.Eff.Class");
var Control_Monad_Writer = require("Control.Monad.Writer");
var Control_Monad_Writer_Class = require("Control.Monad.Writer.Class");
var Data_Foldable = require("Data.Foldable");
var Data_Tuple = require("Data.Tuple");
var DOM = require("DOM");
var Halogen_HTML_Events_Types = require("Halogen.HTML.Events.Types");
var Data_Monoid = require("Data.Monoid");
var Control_Monad_Writer_Trans = require("Control.Monad.Writer.Trans");
var Data_Identity = require("Data.Identity");
var PreventDefault = (function () {
    function PreventDefault() {

    };
    PreventDefault.value = new PreventDefault();
    return PreventDefault;
})();
var StopPropagation = (function () {
    function StopPropagation() {

    };
    StopPropagation.value = new StopPropagation();
    return StopPropagation;
})();
var StopImmediatePropagation = (function () {
    function StopImmediatePropagation() {

    };
    StopImmediatePropagation.value = new StopImmediatePropagation();
    return StopImmediatePropagation;
})();
var EventHandler = function (x) {
    return x;
};
var unEventHandler = function (_0) {
    return _0;
};
var stopPropagation = Control_Monad_Writer_Class.tell(Data_Monoid.monoidArray)(Control_Monad_Writer_Trans.monadWriterT(Data_Monoid.monoidArray)(Data_Identity.monadIdentity))(Control_Monad_Writer_Trans.monadWriterWriterT(Data_Monoid.monoidArray)(Data_Identity.monadIdentity))([ StopPropagation.value ]);
var stopImmediatePropagation = Control_Monad_Writer_Class.tell(Data_Monoid.monoidArray)(Control_Monad_Writer_Trans.monadWriterT(Data_Monoid.monoidArray)(Data_Identity.monadIdentity))(Control_Monad_Writer_Trans.monadWriterWriterT(Data_Monoid.monoidArray)(Data_Identity.monadIdentity))([ StopImmediatePropagation.value ]);
var runEventHandler = function (__dict_Monad_0) {
    return function (__dict_MonadEff_1) {
        return function (e) {
            return function (_1) {
                var applyUpdate = function (_6) {
                    if (_6 instanceof PreventDefault) {
                        return $foreign.preventDefaultImpl(e);
                    };
                    if (_6 instanceof StopPropagation) {
                        return $foreign.stopPropagationImpl(e);
                    };
                    if (_6 instanceof StopImmediatePropagation) {
                        return $foreign.stopImmediatePropagationImpl(e);
                    };
                    throw new Error("Failed pattern match at Halogen.HTML.Events.Handler line 88, column 3 - line 89, column 3: " + [ _6.constructor.name ]);
                };
                var _11 = Control_Monad_Writer.runWriter(_1);
                return Control_Monad_Eff_Class.liftEff(__dict_MonadEff_1)(Control_Apply["*>"](Control_Monad_Eff.applyEff)(Data_Foldable.for_(Control_Monad_Eff.applicativeEff)(Data_Foldable.foldableArray)(_11.value1)(applyUpdate))(Prelude["return"](Control_Monad_Eff.applicativeEff)(_11.value0)));
            };
        };
    };
};
var preventDefault = Control_Monad_Writer_Class.tell(Data_Monoid.monoidArray)(Control_Monad_Writer_Trans.monadWriterT(Data_Monoid.monoidArray)(Data_Identity.monadIdentity))(Control_Monad_Writer_Trans.monadWriterWriterT(Data_Monoid.monoidArray)(Data_Identity.monadIdentity))([ PreventDefault.value ]);
var functorEventHandler = new Prelude.Functor(function (f) {
    return function (_2) {
        return Prelude["<$>"](Control_Monad_Writer_Trans.functorWriterT(Data_Identity.functorIdentity))(f)(_2);
    };
});
var applyEventHandler = new Prelude.Apply(function () {
    return functorEventHandler;
}, function (_3) {
    return function (_4) {
        return Prelude["<*>"](Control_Monad_Writer_Trans.applyWriterT(Prelude.semigroupArray)(Data_Identity.applyIdentity))(_3)(_4);
    };
});
var bindEventHandler = new Prelude.Bind(function () {
    return applyEventHandler;
}, function (_5) {
    return function (f) {
        return Prelude[">>="](Control_Monad_Writer_Trans.bindWriterT(Prelude.semigroupArray)(Data_Identity.monadIdentity))(_5)(function (_20) {
            return unEventHandler(f(_20));
        });
    };
});
var applicativeEventHandler = new Prelude.Applicative(function () {
    return applyEventHandler;
}, function (_21) {
    return EventHandler(Prelude.pure(Control_Monad_Writer_Trans.applicativeWriterT(Data_Monoid.monoidArray)(Data_Identity.applicativeIdentity))(_21));
});
var monadEventHandler = new Prelude.Monad(function () {
    return applicativeEventHandler;
}, function () {
    return bindEventHandler;
});
module.exports = {
    runEventHandler: runEventHandler, 
    stopImmediatePropagation: stopImmediatePropagation, 
    stopPropagation: stopPropagation, 
    preventDefault: preventDefault, 
    functorEventHandler: functorEventHandler, 
    applyEventHandler: applyEventHandler, 
    applicativeEventHandler: applicativeEventHandler, 
    bindEventHandler: bindEventHandler, 
    monadEventHandler: monadEventHandler
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events.Handler/foreign.js","Control.Apply":"/Users/maximko/Projects/mine/guppi/output/Control.Apply/index.js","Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","Control.Monad.Eff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Class/index.js","Control.Monad.Writer":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Writer/index.js","Control.Monad.Writer.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Writer.Class/index.js","Control.Monad.Writer.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Writer.Trans/index.js","DOM":"/Users/maximko/Projects/mine/guppi/output/DOM/index.js","Data.Foldable":"/Users/maximko/Projects/mine/guppi/output/Data.Foldable/index.js","Data.Identity":"/Users/maximko/Projects/mine/guppi/output/Data.Identity/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Halogen.HTML.Events.Types":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events.Types/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events.Indexed/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Unsafe_Coerce = require("Unsafe.Coerce");
var Halogen_HTML_Events_Handler = require("Halogen.HTML.Events.Handler");
var Halogen_HTML_Events_Types = require("Halogen.HTML.Events.Types");
var Halogen_HTML_Properties_Indexed = require("Halogen.HTML.Properties.Indexed");
var Halogen_HTML_Events = require("Halogen.HTML.Events");
var Halogen_HTML_Events_Forms = require("Halogen.HTML.Events.Forms");
var onValueInput = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events_Forms.onValueInput);
var onValueChange = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events_Forms.onValueChange);
var onUnload = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onUnload);
var onSubmit = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onSubmit);
var onSelect = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onSelect);
var onSearch = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onSearch);
var onScroll = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onScroll);
var onResize = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onResize);
var onReset = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onReset);
var onPageShow = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onPageShow);
var onPageHide = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onPageHide);
var onMouseUp = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onMouseUp);
var onMouseOver = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onMouseOver);
var onMouseOut = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onMouseOut);
var onMouseMove = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onMouseMove);
var onMouseLeave = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onMouseLeave);
var onMouseEnter = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onMouseEnter);
var onMouseDown = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onMouseDown);
var onLoad = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onLoad);
var onKeyUp = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onKeyUp);
var onKeyPress = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onKeyPress);
var onKeyDown = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onKeyDown);
var onInvalid = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onInvalid);
var onInput = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onInput);
var onHashChange = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onHashChange);
var onFocusOut = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onFocusOut);
var onFocusIn = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onFocusIn);
var onFocus = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onFocus);
var onError = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onError);
var onDoubleClick = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onDoubleClick);
var onContextMenu = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onContextMenu);
var onClick = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onClick);
var onChecked = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events_Forms.onChecked);
var onChange = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onChange);
var onBlur = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onBlur);
var onBeforeUnload = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onBeforeUnload);
var onAbort = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Events.onAbort);
module.exports = {
    onChecked: onChecked, 
    onValueInput: onValueInput, 
    onValueChange: onValueChange, 
    onFocusOut: onFocusOut, 
    onFocusIn: onFocusIn, 
    onFocus: onFocus, 
    onBlur: onBlur, 
    onKeyUp: onKeyUp, 
    onKeyPress: onKeyPress, 
    onKeyDown: onKeyDown, 
    onMouseUp: onMouseUp, 
    onMouseOut: onMouseOut, 
    onMouseOver: onMouseOver, 
    onMouseMove: onMouseMove, 
    onMouseLeave: onMouseLeave, 
    onMouseEnter: onMouseEnter, 
    onMouseDown: onMouseDown, 
    onDoubleClick: onDoubleClick, 
    onContextMenu: onContextMenu, 
    onClick: onClick, 
    onSubmit: onSubmit, 
    onSelect: onSelect, 
    onSearch: onSearch, 
    onReset: onReset, 
    onInvalid: onInvalid, 
    onInput: onInput, 
    onChange: onChange, 
    onUnload: onUnload, 
    onScroll: onScroll, 
    onResize: onResize, 
    onPageHide: onPageHide, 
    onPageShow: onPageShow, 
    onLoad: onLoad, 
    onHashChange: onHashChange, 
    onError: onError, 
    onBeforeUnload: onBeforeUnload, 
    onAbort: onAbort
};

},{"Halogen.HTML.Events":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events/index.js","Halogen.HTML.Events.Forms":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events.Forms/index.js","Halogen.HTML.Events.Handler":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events.Handler/index.js","Halogen.HTML.Events.Types":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events.Types/index.js","Halogen.HTML.Properties.Indexed":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Properties.Indexed/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js","Unsafe.Coerce":"/Users/maximko/Projects/mine/guppi/output/Unsafe.Coerce/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events.Types/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var DOM_HTML_Types = require("DOM.HTML.Types");
module.exports = {};

},{"DOM.HTML.Types":"/Users/maximko/Projects/mine/guppi/output/DOM.HTML.Types/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Halogen_Query = require("Halogen.Query");
var Halogen_HTML_Events_Handler = require("Halogen.HTML.Events.Handler");
var Halogen_HTML_Events_Types = require("Halogen.HTML.Events.Types");
var Halogen_HTML_Core = require("Halogen.HTML.Core");
var onUnload = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("unload"));
var onSubmit = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("submit"));
var onSelect = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("select"));
var onSearch = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("search"));
var onScroll = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("scroll"));
var onResize = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("resize"));
var onReset = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("reset"));
var onPageShow = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("pageshow"));
var onPageHide = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("pagehide"));
var onMouseUp = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("mouseup"));
var onMouseOver = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("mouseover"));
var onMouseOut = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("mouseout"));
var onMouseMove = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("mousemove"));
var onMouseLeave = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("mouseleave"));
var onMouseEnter = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("mouseenter"));
var onMouseDown = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("mousedown"));
var onLoad = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("load"));
var onKeyUp = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("keyup"));
var onKeyPress = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("keypress"));
var onKeyDown = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("keydown"));
var onInvalid = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("invalid"));
var onInput = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("input"));
var onHashChange = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("hashchange"));
var onFocusOut = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("focusout"));
var onFocusIn = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("focusin"));
var onFocus = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("focus"));
var onError = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("error"));
var onDoubleClick = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("dblclick"));
var onContextMenu = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("contextmenu"));
var onClick = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("click"));
var onChange = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("change"));
var onBlur = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("blur"));
var onBeforeUnload = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("beforeunload"));
var onAbort = Halogen_HTML_Core.handler(Halogen_HTML_Core.eventName("abort"));
var input_ = function (f) {
    return function (_0) {
        return Prelude.pure(Halogen_HTML_Events_Handler.applicativeEventHandler)(Halogen_Query.action(f));
    };
};
var input = function (f) {
    return function (x) {
        return Prelude.pure(Halogen_HTML_Events_Handler.applicativeEventHandler)(Halogen_Query.action(f(x)));
    };
};
module.exports = {
    onFocusOut: onFocusOut, 
    onFocusIn: onFocusIn, 
    onFocus: onFocus, 
    onBlur: onBlur, 
    onKeyUp: onKeyUp, 
    onKeyPress: onKeyPress, 
    onKeyDown: onKeyDown, 
    onMouseUp: onMouseUp, 
    onMouseOut: onMouseOut, 
    onMouseOver: onMouseOver, 
    onMouseMove: onMouseMove, 
    onMouseLeave: onMouseLeave, 
    onMouseEnter: onMouseEnter, 
    onMouseDown: onMouseDown, 
    onDoubleClick: onDoubleClick, 
    onContextMenu: onContextMenu, 
    onClick: onClick, 
    onSubmit: onSubmit, 
    onSelect: onSelect, 
    onSearch: onSearch, 
    onReset: onReset, 
    onInvalid: onInvalid, 
    onInput: onInput, 
    onChange: onChange, 
    onUnload: onUnload, 
    onScroll: onScroll, 
    onResize: onResize, 
    onPageHide: onPageHide, 
    onPageShow: onPageShow, 
    onLoad: onLoad, 
    onHashChange: onHashChange, 
    onError: onError, 
    onBeforeUnload: onBeforeUnload, 
    onAbort: onAbort, 
    input_: input_, 
    input: input
};

},{"Halogen.HTML.Core":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Core/index.js","Halogen.HTML.Events.Handler":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events.Handler/index.js","Halogen.HTML.Events.Types":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events.Types/index.js","Halogen.Query":"/Users/maximko/Projects/mine/guppi/output/Halogen.Query/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Indexed/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Halogen_HTML = require("Halogen.HTML");
var Halogen_HTML_Core = require("Halogen.HTML.Core");
var Halogen_HTML_Elements_Indexed = require("Halogen.HTML.Elements.Indexed");
module.exports = {};

},{"Halogen.HTML":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML/index.js","Halogen.HTML.Core":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Core/index.js","Halogen.HTML.Elements.Indexed":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Elements.Indexed/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Properties.Indexed/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Foldable = require("Data.Foldable");
var Data_Tuple = require("Data.Tuple");
var Data_Array = require("Data.Array");
var Unsafe_Coerce = require("Unsafe.Coerce");
var DOM_HTML_Types = require("DOM.HTML.Types");
var Halogen_HTML_Core = require("Halogen.HTML.Core");
var Halogen_HTML_Properties = require("Halogen.HTML.Properties");
var Data_Monoid = require("Data.Monoid");
var MenuitemCommand = (function () {
    function MenuitemCommand() {

    };
    MenuitemCommand.value = new MenuitemCommand();
    return MenuitemCommand;
})();
var MenuitemCheckbox = (function () {
    function MenuitemCheckbox() {

    };
    MenuitemCheckbox.value = new MenuitemCheckbox();
    return MenuitemCheckbox;
})();
var MenuitemRadio = (function () {
    function MenuitemRadio() {

    };
    MenuitemRadio.value = new MenuitemRadio();
    return MenuitemRadio;
})();
var MenuList = (function () {
    function MenuList() {

    };
    MenuList.value = new MenuList();
    return MenuList;
})();
var MenuContext = (function () {
    function MenuContext() {

    };
    MenuContext.value = new MenuContext();
    return MenuContext;
})();
var MenuToolbar = (function () {
    function MenuToolbar() {

    };
    MenuToolbar.value = new MenuToolbar();
    return MenuToolbar;
})();
var InputButton = (function () {
    function InputButton() {

    };
    InputButton.value = new InputButton();
    return InputButton;
})();
var InputCheckbox = (function () {
    function InputCheckbox() {

    };
    InputCheckbox.value = new InputCheckbox();
    return InputCheckbox;
})();
var InputColor = (function () {
    function InputColor() {

    };
    InputColor.value = new InputColor();
    return InputColor;
})();
var InputDate = (function () {
    function InputDate() {

    };
    InputDate.value = new InputDate();
    return InputDate;
})();
var InputDatetime = (function () {
    function InputDatetime() {

    };
    InputDatetime.value = new InputDatetime();
    return InputDatetime;
})();
var InputDatetimeLocal = (function () {
    function InputDatetimeLocal() {

    };
    InputDatetimeLocal.value = new InputDatetimeLocal();
    return InputDatetimeLocal;
})();
var InputEmail = (function () {
    function InputEmail() {

    };
    InputEmail.value = new InputEmail();
    return InputEmail;
})();
var InputFile = (function () {
    function InputFile() {

    };
    InputFile.value = new InputFile();
    return InputFile;
})();
var InputHidden = (function () {
    function InputHidden() {

    };
    InputHidden.value = new InputHidden();
    return InputHidden;
})();
var InputImage = (function () {
    function InputImage() {

    };
    InputImage.value = new InputImage();
    return InputImage;
})();
var InputMonth = (function () {
    function InputMonth() {

    };
    InputMonth.value = new InputMonth();
    return InputMonth;
})();
var InputNumber = (function () {
    function InputNumber() {

    };
    InputNumber.value = new InputNumber();
    return InputNumber;
})();
var InputPassword = (function () {
    function InputPassword() {

    };
    InputPassword.value = new InputPassword();
    return InputPassword;
})();
var InputRadio = (function () {
    function InputRadio() {

    };
    InputRadio.value = new InputRadio();
    return InputRadio;
})();
var InputRange = (function () {
    function InputRange() {

    };
    InputRange.value = new InputRange();
    return InputRange;
})();
var InputReset = (function () {
    function InputReset() {

    };
    InputReset.value = new InputReset();
    return InputReset;
})();
var InputSearch = (function () {
    function InputSearch() {

    };
    InputSearch.value = new InputSearch();
    return InputSearch;
})();
var InputSubmit = (function () {
    function InputSubmit() {

    };
    InputSubmit.value = new InputSubmit();
    return InputSubmit;
})();
var InputTel = (function () {
    function InputTel() {

    };
    InputTel.value = new InputTel();
    return InputTel;
})();
var InputText = (function () {
    function InputText() {

    };
    InputText.value = new InputText();
    return InputText;
})();
var InputTime = (function () {
    function InputTime() {

    };
    InputTime.value = new InputTime();
    return InputTime;
})();
var InputUrl = (function () {
    function InputUrl() {

    };
    InputUrl.value = new InputUrl();
    return InputUrl;
})();
var InputWeek = (function () {
    function InputWeek() {

    };
    InputWeek.value = new InputWeek();
    return InputWeek;
})();
var IProp = function (x) {
    return x;
};
var Uppercase = (function () {
    function Uppercase() {

    };
    Uppercase.value = new Uppercase();
    return Uppercase;
})();
var Lowercase = (function () {
    function Lowercase() {

    };
    Lowercase.value = new Lowercase();
    return Lowercase;
})();
var NumeralDecimal = (function () {
    function NumeralDecimal() {

    };
    NumeralDecimal.value = new NumeralDecimal();
    return NumeralDecimal;
})();
var NumeralRoman = (function () {
    function NumeralRoman(value0) {
        this.value0 = value0;
    };
    NumeralRoman.create = function (value0) {
        return new NumeralRoman(value0);
    };
    return NumeralRoman;
})();
var OrderedListNumeric = (function () {
    function OrderedListNumeric(value0) {
        this.value0 = value0;
    };
    OrderedListNumeric.create = function (value0) {
        return new OrderedListNumeric(value0);
    };
    return OrderedListNumeric;
})();
var OrderedListAlphabetic = (function () {
    function OrderedListAlphabetic(value0) {
        this.value0 = value0;
    };
    OrderedListAlphabetic.create = function (value0) {
        return new OrderedListAlphabetic(value0);
    };
    return OrderedListAlphabetic;
})();
var ButtonButton = (function () {
    function ButtonButton() {

    };
    ButtonButton.value = new ButtonButton();
    return ButtonButton;
})();
var ButtonSubmit = (function () {
    function ButtonSubmit() {

    };
    ButtonSubmit.value = new ButtonSubmit();
    return ButtonSubmit;
})();
var ButtonReset = (function () {
    function ButtonReset() {

    };
    ButtonReset.value = new ButtonReset();
    return ButtonReset;
})();
var width = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.width);
var value = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.value);
var title = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.title);
var target = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.target);
var src = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.src);
var spellcheck = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.spellcheck);
var selected = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.selected);
var rows = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.rows);
var rowSpan = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.rowSpan);
var required = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.required);
var renderOrderedListType = function (ty) {
    if (ty instanceof OrderedListNumeric) {
        if (ty.value0 instanceof NumeralDecimal) {
            return "1";
        };
        if (ty.value0 instanceof NumeralRoman) {
            if (ty.value0.value0 instanceof Lowercase) {
                return "i";
            };
            if (ty.value0.value0 instanceof Uppercase) {
                return "I";
            };
            throw new Error("Failed pattern match at Halogen.HTML.Properties.Indexed line 281, column 1 - line 282, column 1: " + [ ty.value0.value0.constructor.name ]);
        };
        throw new Error("Failed pattern match at Halogen.HTML.Properties.Indexed line 281, column 1 - line 282, column 1: " + [ ty.value0.constructor.name ]);
    };
    if (ty instanceof OrderedListAlphabetic) {
        if (ty.value0 instanceof Lowercase) {
            return "a";
        };
        if (ty.value0 instanceof Uppercase) {
            return "A";
        };
        throw new Error("Failed pattern match at Halogen.HTML.Properties.Indexed line 281, column 1 - line 282, column 1: " + [ ty.value0.constructor.name ]);
    };
    throw new Error("Failed pattern match at Halogen.HTML.Properties.Indexed line 281, column 1 - line 282, column 1: " + [ ty.constructor.name ]);
};
var renderMenuitemType = function (ty) {
    if (ty instanceof MenuitemCommand) {
        return "command";
    };
    if (ty instanceof MenuitemCheckbox) {
        return "checkbox";
    };
    if (ty instanceof MenuitemRadio) {
        return "radio";
    };
    throw new Error("Failed pattern match at Halogen.HTML.Properties.Indexed line 224, column 1 - line 225, column 1: " + [ ty.constructor.name ]);
};
var renderMenuType = function (ty) {
    if (ty instanceof MenuList) {
        return "list";
    };
    if (ty instanceof MenuContext) {
        return "context";
    };
    if (ty instanceof MenuToolbar) {
        return "toolbar";
    };
    throw new Error("Failed pattern match at Halogen.HTML.Properties.Indexed line 209, column 1 - line 210, column 1: " + [ ty.constructor.name ]);
};
var renderMediaType = function (ty) {
    var renderParameter = function (_0) {
        return _0.value0 + ("=" + _0.value1);
    };
    var renderParameters = function (ps) {
        if (Data_Array.length(ps) === 0) {
            return "";
        };
        if (Prelude.otherwise) {
            return ";" + Data_Foldable.intercalate(Data_Foldable.foldableArray)(Data_Monoid.monoidString)(";")(Prelude["<$>"](Prelude.functorArray)(renderParameter)(ps));
        };
        throw new Error("Failed pattern match at Halogen.HTML.Properties.Indexed line 240, column 1 - line 241, column 1: " + [ ps.constructor.name ]);
    };
    return ty.type + ("/" + (ty.subtype + renderParameters(ty.parameters)));
};
var renderInputType = function (ty) {
    if (ty instanceof InputButton) {
        return "button";
    };
    if (ty instanceof InputCheckbox) {
        return "checkbox";
    };
    if (ty instanceof InputColor) {
        return "color";
    };
    if (ty instanceof InputDate) {
        return "date";
    };
    if (ty instanceof InputDatetime) {
        return "datetime";
    };
    if (ty instanceof InputDatetimeLocal) {
        return "datetime-local";
    };
    if (ty instanceof InputEmail) {
        return "email";
    };
    if (ty instanceof InputFile) {
        return "file";
    };
    if (ty instanceof InputHidden) {
        return "hidden";
    };
    if (ty instanceof InputImage) {
        return "image";
    };
    if (ty instanceof InputMonth) {
        return "month";
    };
    if (ty instanceof InputNumber) {
        return "number";
    };
    if (ty instanceof InputPassword) {
        return "password";
    };
    if (ty instanceof InputRadio) {
        return "radio";
    };
    if (ty instanceof InputRange) {
        return "range";
    };
    if (ty instanceof InputReset) {
        return "reset";
    };
    if (ty instanceof InputSearch) {
        return "search";
    };
    if (ty instanceof InputSubmit) {
        return "submit";
    };
    if (ty instanceof InputTel) {
        return "tel";
    };
    if (ty instanceof InputText) {
        return "text";
    };
    if (ty instanceof InputTime) {
        return "time";
    };
    if (ty instanceof InputUrl) {
        return "url";
    };
    if (ty instanceof InputWeek) {
        return "week";
    };
    throw new Error("Failed pattern match at Halogen.HTML.Properties.Indexed line 174, column 1 - line 175, column 1: " + [ ty.constructor.name ]);
};
var renderButtonType = function (ty) {
    if (ty instanceof ButtonButton) {
        return "button";
    };
    if (ty instanceof ButtonSubmit) {
        return "submit";
    };
    if (ty instanceof ButtonReset) {
        return "reset";
    };
    throw new Error("Failed pattern match at Halogen.HTML.Properties.Indexed line 259, column 1 - line 260, column 1: " + [ ty.constructor.name ]);
};
var rel = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.rel);
var readonly = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.readonly);
var placeholder = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.placeholder);
var olType = function (_16) {
    return Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.type_)(renderOrderedListType(_16));
};
var name = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.name);
var menuitemType = function (_17) {
    return Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.type_)(renderMenuitemType(_17));
};
var menuType = function (_18) {
    return Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.type_)(renderMenuType(_18));
};
var mediaType = function (_19) {
    return Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.type_)(renderMediaType(_19));
};
var key = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.key);
var inputType = function (_20) {
    return Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.type_)(renderInputType(_20));
};
var initializer = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.initializer);
var id_ = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.id_);
var href = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.href);
var height = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.height);
var $$for = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties["for"]);
var finalizer = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.finalizer);
var disabled = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.disabled);
var enabled = function (_21) {
    return disabled(!_21);
};
var cols = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.cols);
var colSpan = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.colSpan);
var classes = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.classes);
var class_ = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.class_);
var checked = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.checked);
var charset = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.charset);
var buttonType = function (_22) {
    return Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.type_)(renderButtonType(_22));
};
var autofocus = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.autofocus);
var autocomplete = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.autocomplete);
var alt = Unsafe_Coerce.unsafeCoerce(Halogen_HTML_Properties.alt);
module.exports = {
    Uppercase: Uppercase, 
    Lowercase: Lowercase, 
    NumeralDecimal: NumeralDecimal, 
    NumeralRoman: NumeralRoman, 
    OrderedListNumeric: OrderedListNumeric, 
    OrderedListAlphabetic: OrderedListAlphabetic, 
    MenuitemCommand: MenuitemCommand, 
    MenuitemCheckbox: MenuitemCheckbox, 
    MenuitemRadio: MenuitemRadio, 
    MenuList: MenuList, 
    MenuContext: MenuContext, 
    MenuToolbar: MenuToolbar, 
    InputButton: InputButton, 
    InputCheckbox: InputCheckbox, 
    InputColor: InputColor, 
    InputDate: InputDate, 
    InputDatetime: InputDatetime, 
    InputDatetimeLocal: InputDatetimeLocal, 
    InputEmail: InputEmail, 
    InputFile: InputFile, 
    InputHidden: InputHidden, 
    InputImage: InputImage, 
    InputMonth: InputMonth, 
    InputNumber: InputNumber, 
    InputPassword: InputPassword, 
    InputRadio: InputRadio, 
    InputRange: InputRange, 
    InputReset: InputReset, 
    InputSearch: InputSearch, 
    InputSubmit: InputSubmit, 
    InputTel: InputTel, 
    InputText: InputText, 
    InputTime: InputTime, 
    InputUrl: InputUrl, 
    InputWeek: InputWeek, 
    ButtonButton: ButtonButton, 
    ButtonSubmit: ButtonSubmit, 
    ButtonReset: ButtonReset, 
    IProp: IProp, 
    finalizer: finalizer, 
    initializer: initializer, 
    autofocus: autofocus, 
    autocomplete: autocomplete, 
    placeholder: placeholder, 
    selected: selected, 
    checked: checked, 
    spellcheck: spellcheck, 
    readonly: readonly, 
    required: required, 
    enabled: enabled, 
    disabled: disabled, 
    value: value, 
    olType: olType, 
    menuitemType: menuitemType, 
    menuType: menuType, 
    mediaType: mediaType, 
    inputType: inputType, 
    buttonType: buttonType, 
    title: title, 
    target: target, 
    src: src, 
    rel: rel, 
    name: name, 
    id_: id_, 
    href: href, 
    width: width, 
    height: height, 
    "for": $$for, 
    rowSpan: rowSpan, 
    colSpan: colSpan, 
    rows: rows, 
    cols: cols, 
    classes: classes, 
    class_: class_, 
    charset: charset, 
    alt: alt, 
    key: key
};

},{"DOM.HTML.Types":"/Users/maximko/Projects/mine/guppi/output/DOM.HTML.Types/index.js","Data.Array":"/Users/maximko/Projects/mine/guppi/output/Data.Array/index.js","Data.Foldable":"/Users/maximko/Projects/mine/guppi/output/Data.Foldable/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Tuple":"/Users/maximko/Projects/mine/guppi/output/Data.Tuple/index.js","Halogen.HTML.Core":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Core/index.js","Halogen.HTML.Properties":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Properties/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js","Unsafe.Coerce":"/Users/maximko/Projects/mine/guppi/output/Unsafe.Coerce/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Properties/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_Maybe = require("Data.Maybe");
var Data_String = require("Data.String");
var DOM_HTML_Types = require("DOM.HTML.Types");
var Halogen_HTML_Core = require("Halogen.HTML.Core");
var Pixels = (function () {
    function Pixels(value0) {
        this.value0 = value0;
    };
    Pixels.create = function (value0) {
        return new Pixels(value0);
    };
    return Pixels;
})();
var Percent = (function () {
    function Percent(value0) {
        this.value0 = value0;
    };
    Percent.create = function (value0) {
        return new Percent(value0);
    };
    return Percent;
})();
var value = Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("value"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("value")));
var type_ = Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("type"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("type")));
var title = Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("title"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("title")));
var target = Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("target"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("target")));
var src = Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("src"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("src")));
var spellcheck = Halogen_HTML_Core.prop(Halogen_HTML_Core.booleanIsProp)(Halogen_HTML_Core.propName("spellcheck"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("spellcheck")));
var selected = Halogen_HTML_Core.prop(Halogen_HTML_Core.booleanIsProp)(Halogen_HTML_Core.propName("selected"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("selected")));
var rows = Halogen_HTML_Core.prop(Halogen_HTML_Core.intIsProp)(Halogen_HTML_Core.propName("rows"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("rows")));
var rowSpan = Halogen_HTML_Core.prop(Halogen_HTML_Core.intIsProp)(Halogen_HTML_Core.propName("rowSpan"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("rowspan")));
var required = Halogen_HTML_Core.prop(Halogen_HTML_Core.booleanIsProp)(Halogen_HTML_Core.propName("required"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("required")));
var rel = Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("rel"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("rel")));
var readonly = Halogen_HTML_Core.prop(Halogen_HTML_Core.booleanIsProp)(Halogen_HTML_Core.propName("readonly"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("readonly")));
var printLengthLiteral = function (_0) {
    if (_0 instanceof Pixels) {
        return Prelude.show(Prelude.showInt)(_0.value0);
    };
    if (_0 instanceof Percent) {
        return Prelude.show(Prelude.showNumber)(_0.value0) + "%";
    };
    throw new Error("Failed pattern match at Halogen.HTML.Properties line 52, column 1 - line 53, column 1: " + [ _0.constructor.name ]);
};
var width = function (_5) {
    return Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("width"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("width")))(printLengthLiteral(_5));
};
var placeholder = Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("placeholder"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("placeholder")));
var name = Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("name"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("name")));
var key = Halogen_HTML_Core.Key.create;
var initializer = Halogen_HTML_Core.Initializer.create;
var id_ = Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("id"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("id")));
var href = Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("href"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("href")));
var height = function (_6) {
    return Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("height"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("height")))(printLengthLiteral(_6));
};
var $$for = Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("htmlFor"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("for")));
var finalizer = Halogen_HTML_Core.Finalizer.create;
var disabled = Halogen_HTML_Core.prop(Halogen_HTML_Core.booleanIsProp)(Halogen_HTML_Core.propName("disabled"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("disabled")));
var enabled = function (_7) {
    return disabled(!_7);
};
var cols = Halogen_HTML_Core.prop(Halogen_HTML_Core.intIsProp)(Halogen_HTML_Core.propName("cols"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("cols")));
var colSpan = Halogen_HTML_Core.prop(Halogen_HTML_Core.intIsProp)(Halogen_HTML_Core.propName("colSpan"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("colspan")));
var classes = function (_8) {
    return Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("className"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("class")))(Data_String.joinWith(" ")(Prelude.map(Prelude.functorArray)(Halogen_HTML_Core.runClassName)(_8)));
};
var class_ = function (_9) {
    return Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("className"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("class")))(Halogen_HTML_Core.runClassName(_9));
};
var checked = Halogen_HTML_Core.prop(Halogen_HTML_Core.booleanIsProp)(Halogen_HTML_Core.propName("checked"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("checked")));
var charset = Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("charset"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("charset")));
var autofocus = Halogen_HTML_Core.prop(Halogen_HTML_Core.booleanIsProp)(Halogen_HTML_Core.propName("autofocus"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("autofocus")));
var autocomplete = function (_10) {
    return Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("autocomplete"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("autocomplete")))((function (b) {
        if (b) {
            return "on";
        };
        if (!b) {
            return "off";
        };
        throw new Error("Failed pattern match at Halogen.HTML.Properties line 146, column 1 - line 147, column 1: " + [ b.constructor.name ]);
    })(_10));
};
var alt = Halogen_HTML_Core.prop(Halogen_HTML_Core.stringIsProp)(Halogen_HTML_Core.propName("alt"))(Data_Maybe.Just.create(Halogen_HTML_Core.attrName("alt")));
module.exports = {
    Pixels: Pixels, 
    Percent: Percent, 
    finalizer: finalizer, 
    initializer: initializer, 
    autofocus: autofocus, 
    autocomplete: autocomplete, 
    placeholder: placeholder, 
    selected: selected, 
    checked: checked, 
    enabled: enabled, 
    spellcheck: spellcheck, 
    readonly: readonly, 
    required: required, 
    disabled: disabled, 
    width: width, 
    value: value, 
    type_: type_, 
    title: title, 
    target: target, 
    src: src, 
    rel: rel, 
    name: name, 
    id_: id_, 
    href: href, 
    height: height, 
    "for": $$for, 
    rowSpan: rowSpan, 
    colSpan: colSpan, 
    rows: rows, 
    cols: cols, 
    classes: classes, 
    class_: class_, 
    charset: charset, 
    alt: alt, 
    key: key
};

},{"DOM.HTML.Types":"/Users/maximko/Projects/mine/guppi/output/DOM.HTML.Types/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.String":"/Users/maximko/Projects/mine/guppi/output/Data.String/index.js","Halogen.HTML.Core":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Core/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Renderer.VirtualDOM/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Monad_Aff = require("Control.Monad.Aff");
var Control_Monad_Eff = require("Control.Monad.Eff");
var Control_Monad_Eff_Exception = require("Control.Monad.Eff.Exception");
var Data_Exists = require("Data.Exists");
var Data_ExistsR = require("Data.ExistsR");
var Data_Foldable = require("Data.Foldable");
var Data_Function = require("Data.Function");
var Data_Maybe = require("Data.Maybe");
var Data_Monoid = require("Data.Monoid");
var Data_Nullable = require("Data.Nullable");
var Halogen_Effects = require("Halogen.Effects");
var Halogen_HTML_Core = require("Halogen.HTML.Core");
var Halogen_HTML_Events_Handler = require("Halogen.HTML.Events.Handler");
var Halogen_Internal_VirtualDOM = require("Halogen.Internal.VirtualDOM");
var handleAff = Control_Monad_Aff.runAff(Control_Monad_Eff_Exception.throwException)(Prelude["const"](Prelude.pure(Control_Monad_Eff.applicativeEff)(Prelude.unit)));
var renderProp = function (dr) {
    return function (_2) {
        if (_2 instanceof Halogen_HTML_Core.Prop) {
            return Data_Exists.runExists(function (_0) {
                return Halogen_Internal_VirtualDOM.prop(Halogen_HTML_Core.runPropName(_0.value0), _0.value1);
            })(_2.value0);
        };
        if (_2 instanceof Halogen_HTML_Core.Attr) {
            var attrName = Data_Maybe.maybe("")(function (ns$prime) {
                return Halogen_HTML_Core.runNamespace(ns$prime) + ":";
            })(_2.value0) + Halogen_HTML_Core.runAttrName(_2.value1);
            return Halogen_Internal_VirtualDOM.attr(attrName, _2.value2);
        };
        if (_2 instanceof Halogen_HTML_Core.Handler) {
            return Data_ExistsR.runExistsR(function (_1) {
                return Halogen_Internal_VirtualDOM.handlerProp(Halogen_HTML_Core.runEventName(_1.value0), function (ev) {
                    return handleAff(Prelude[">>="](Control_Monad_Aff.bindAff)(Halogen_HTML_Events_Handler.runEventHandler(Control_Monad_Aff.monadAff)(Control_Monad_Aff.monadEffAff)(ev)(_1.value1(ev)))(Data_Maybe.maybe(Prelude.pure(Control_Monad_Aff.applicativeAff)(Prelude.unit))(dr)));
                });
            })(_2.value0);
        };
        if (_2 instanceof Halogen_HTML_Core.Initializer) {
            return Halogen_Internal_VirtualDOM.initProp(function (_31) {
                return handleAff(dr(_2.value0(_31)));
            });
        };
        if (_2 instanceof Halogen_HTML_Core.Finalizer) {
            return Halogen_Internal_VirtualDOM.finalizerProp(function (_32) {
                return handleAff(dr(_2.value0(_32)));
            });
        };
        return Data_Monoid.mempty(Halogen_Internal_VirtualDOM.monoidProps);
    };
};
var findKey = function (r) {
    return function (_3) {
        if (_3 instanceof Halogen_HTML_Core.Key) {
            return new Data_Maybe.Just(_3.value0);
        };
        return r;
    };
};
var renderHTML = function (f) {
    var go = function (_4) {
        if (_4 instanceof Halogen_HTML_Core.Text) {
            return Halogen_Internal_VirtualDOM.vtext(_4.value0);
        };
        if (_4 instanceof Halogen_HTML_Core.Element) {
            var tag = Halogen_HTML_Core.runTagName(_4.value1);
            var ns$prime = Data_Nullable.toNullable(Prelude["<$>"](Data_Maybe.functorMaybe)(Halogen_HTML_Core.runNamespace)(_4.value0));
            var key = Data_Nullable.toNullable(Data_Foldable.foldl(Data_Foldable.foldableArray)(findKey)(Data_Maybe.Nothing.value)(_4.value2));
            return Halogen_Internal_VirtualDOM.vnode(ns$prime)(tag)(key)(Data_Foldable.foldMap(Data_Foldable.foldableArray)(Halogen_Internal_VirtualDOM.monoidProps)(renderProp(f))(_4.value2))(Prelude.map(Prelude.functorArray)(go)(_4.value3));
        };
        if (_4 instanceof Halogen_HTML_Core.Slot) {
            return Halogen_Internal_VirtualDOM.vtext("");
        };
        throw new Error("Failed pattern match at Halogen.HTML.Renderer.VirtualDOM line 27, column 1 - line 28, column 1: " + [ _4.constructor.name ]);
    };
    return go;
};
module.exports = {
    renderHTML: renderHTML
};

},{"Control.Monad.Aff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff/index.js","Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","Control.Monad.Eff.Exception":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Exception/index.js","Data.Exists":"/Users/maximko/Projects/mine/guppi/output/Data.Exists/index.js","Data.ExistsR":"/Users/maximko/Projects/mine/guppi/output/Data.ExistsR/index.js","Data.Foldable":"/Users/maximko/Projects/mine/guppi/output/Data.Foldable/index.js","Data.Function":"/Users/maximko/Projects/mine/guppi/output/Data.Function/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Nullable":"/Users/maximko/Projects/mine/guppi/output/Data.Nullable/index.js","Halogen.Effects":"/Users/maximko/Projects/mine/guppi/output/Halogen.Effects/index.js","Halogen.HTML.Core":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Core/index.js","Halogen.HTML.Events.Handler":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Events.Handler/index.js","Halogen.Internal.VirtualDOM":"/Users/maximko/Projects/mine/guppi/output/Halogen.Internal.VirtualDOM/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Halogen_Component = require("Halogen.Component");
var Halogen_Component_ChildPath = require("Halogen.Component.ChildPath");
var Halogen_HTML_Core = require("Halogen.HTML.Core");
var Halogen_HTML_Elements = require("Halogen.HTML.Elements");
var text = Halogen_HTML_Core.Text.create;
var slot$prime = function (__dict_Functor_0) {
    return function (i) {
        return function (p) {
            return function (l) {
                var transform = function (def) {
                    return {
                        component: Halogen_Component.transformChild(__dict_Functor_0)(i)(def.component), 
                        initialState: Halogen_Component_ChildPath.injState(i)(def.initialState)
                    };
                };
                return new Halogen_HTML_Core.Slot(new Halogen_Component.SlotConstructor(Halogen_Component_ChildPath.injSlot(i)(p), Prelude["<$>"](Prelude.functorFn)(transform)(l)));
            };
        };
    };
};
var slot = function (p) {
    return function (l) {
        return new Halogen_HTML_Core.Slot(new Halogen_Component.SlotConstructor(p, l));
    };
};
module.exports = {
    "slot'": slot$prime, 
    slot: slot, 
    text: text
};

},{"Halogen.Component":"/Users/maximko/Projects/mine/guppi/output/Halogen.Component/index.js","Halogen.Component.ChildPath":"/Users/maximko/Projects/mine/guppi/output/Halogen.Component.ChildPath/index.js","Halogen.HTML.Core":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Core/index.js","Halogen.HTML.Elements":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Elements/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.Internal.VirtualDOM/foreign.js":[function(require,module,exports){
/* global exports, require */
"use strict";

// module Halogen.Internal.VirtualDOM

// jshint maxparams: 2
exports.prop = function (key, value) {
  var props = {};
  props[key] = value;
  return props;
};

// jshint maxparams: 2
exports.attr = function (key, value) {
  var props = { attributes: {} };
  props.attributes[key] = value;
  return props;
};

function HandlerHook (key, f) {
  this.key = key;
  this.callback = function (e) {
    f(e)();
  };
}

HandlerHook.prototype = {
  hook: function (node) {
    node.addEventListener(this.key, this.callback);
  },
  unhook: function (node) {
    node.removeEventListener(this.key, this.callback);
  }
};

// jshint maxparams: 2
exports.handlerProp = function (key, f) {
  var props = {};
  props["halogen-hook-" + key] = new HandlerHook(key, f);
  return props;
};

// jshint maxparams: 3
function ifHookFn (node, prop, diff) {
  // jshint validthis: true
  if (typeof diff === "undefined") {
    this.f(node)();
  }
}

// jshint maxparams: 1
function InitHook (f) {
  this.f = f;
}

InitHook.prototype = {
  hook: ifHookFn
};

exports.initProp = function (f) {
  return { "halogen-init": new InitHook(f) };
};

function FinalHook (f) {
  this.f = f;
}

FinalHook.prototype = {
  unhook: ifHookFn
};

exports.finalizerProp = function (f) {
  return { "halogen-final": new FinalHook(f) };
};

exports.concatProps = function () {
  // jshint maxparams: 2
  var hOP = Object.prototype.hasOwnProperty;
  var copy = function (props, result) {
    for (var key in props) {
      if (hOP.call(props, key)) {
        if (key === "attributes") {
          var attrs = props[key];
          var resultAttrs = result[key] || (result[key] = {});
          for (var attr in attrs) {
            if (hOP.call(attrs, attr)) {
              resultAttrs[attr] = attrs[attr];
            }
          }
        } else {
          result[key] = props[key];
        }
      }
    }
    return result;
  };
  return function (p1, p2) {
    return copy(p2, copy(p1, {}));
  };
}();

exports.emptyProps = {};

exports.createElement = function () {
  var vcreateElement = require("virtual-dom/create-element");
  return function (vtree) {
    return vcreateElement(vtree);
  };
}();

exports.diff = function () {
  var vdiff = require("virtual-dom/diff");
  return function (vtree1) {
    return function (vtree2) {
      return vdiff(vtree1, vtree2);
    };
  };
}();

exports.patch = function () {
  var vpatch = require("virtual-dom/patch");
  return function (p) {
    return function (node) {
      return function () {
        return vpatch(node, p);
      };
    };
  };
}();

exports.vtext = function () {
  var VText = require("virtual-dom/vnode/vtext");
  return function (s) {
    return new VText(s);
  };
}();

exports.vnode = function () {
  var VirtualNode = require("virtual-dom/vnode/vnode");
  var SoftSetHook = require("virtual-dom/virtual-hyperscript/hooks/soft-set-hook");
  return function (namespace) {
    return function (name) {
      return function (key) {
        return function (props) {
          return function (children) {
            if (name === "input" && props.value !== undefined) {
              props.value = new SoftSetHook(props.value);
            }
            return new VirtualNode(name, props, children, key, namespace);
          };
        };
      };
    };
  };
}();

},{"virtual-dom/create-element":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/create-element.js","virtual-dom/diff":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/diff.js","virtual-dom/patch":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/patch.js","virtual-dom/virtual-hyperscript/hooks/soft-set-hook":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/virtual-hyperscript/hooks/soft-set-hook.js","virtual-dom/vnode/vnode":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/vnode.js","virtual-dom/vnode/vtext":"/Users/maximko/Projects/mine/guppi/node_modules/virtual-dom/vnode/vtext.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.Internal.VirtualDOM/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Prelude = require("Prelude");
var Control_Monad_Eff = require("Control.Monad.Eff");
var Data_Monoid = require("Data.Monoid");
var Data_Nullable = require("Data.Nullable");
var Data_Function = require("Data.Function");
var DOM = require("DOM");
var DOM_HTML_Types = require("DOM.HTML.Types");
var semigroupProps = new Prelude.Semigroup(Data_Function.runFn2($foreign.concatProps));
var monoidProps = new Data_Monoid.Monoid(function () {
    return semigroupProps;
}, $foreign.emptyProps);
module.exports = {
    semigroupProps: semigroupProps, 
    monoidProps: monoidProps, 
    vnode: $foreign.vnode, 
    vtext: $foreign.vtext, 
    patch: $foreign.patch, 
    diff: $foreign.diff, 
    createElement: $foreign.createElement, 
    finalizerProp: $foreign.finalizerProp, 
    initProp: $foreign.initProp, 
    handlerProp: $foreign.handlerProp, 
    attr: $foreign.attr, 
    prop: $foreign.prop
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Halogen.Internal.VirtualDOM/foreign.js","Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","DOM":"/Users/maximko/Projects/mine/guppi/output/DOM/index.js","DOM.HTML.Types":"/Users/maximko/Projects/mine/guppi/output/DOM.HTML.Types/index.js","Data.Function":"/Users/maximko/Projects/mine/guppi/output/Data.Function/index.js","Data.Monoid":"/Users/maximko/Projects/mine/guppi/output/Data.Monoid/index.js","Data.Nullable":"/Users/maximko/Projects/mine/guppi/output/Data.Nullable/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.Query.EventSource/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Bind = require("Control.Bind");
var Control_Coroutine_Aff = require("Control.Coroutine.Aff");
var Control_Coroutine_Stalling = require("Control.Coroutine.Stalling");
var Control_Monad_Aff_AVar = require("Control.Monad.Aff.AVar");
var Control_Monad_Aff_Class = require("Control.Monad.Aff.Class");
var Control_Monad_Eff = require("Control.Monad.Eff");
var Control_Monad_Rec_Class = require("Control.Monad.Rec.Class");
var Control_Monad_Free = require("Control.Monad.Free");
var Data_Const = require("Data.Const");
var Data_Either = require("Data.Either");
var Data_Functor_Coproduct = require("Data.Functor.Coproduct");
var Data_Maybe = require("Data.Maybe");
var Unsafe_Coerce = require("Unsafe.Coerce");
var EventSource = function (x) {
    return x;
};
var toParentEventSource = Unsafe_Coerce.unsafeCoerce;
var runEventSource = function (_0) {
    return _0;
};
var fromParentEventSource = Unsafe_Coerce.unsafeCoerce;
var eventSource_ = function (__dict_Monad_0) {
    return function (__dict_MonadAff_1) {
        return function (attach) {
            return function (handle) {
                return EventSource(Control_Coroutine_Stalling.producerToStallingProducer(((__dict_Monad_0["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Control_Coroutine_Aff["produce'"](__dict_Monad_0)(__dict_MonadAff_1)(function (emit) {
                    return attach(Control_Bind["=<<"](Control_Monad_Eff.bindEff)(function (_4) {
                        return emit(Data_Either.Left.create(_4));
                    })(handle));
                })));
            };
        };
    };
};
var eventSource = function (__dict_Monad_2) {
    return function (__dict_MonadAff_3) {
        return function (attach) {
            return function (handle) {
                return EventSource(Control_Coroutine_Stalling.producerToStallingProducer(((__dict_Monad_2["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Control_Coroutine_Aff["produce'"](__dict_Monad_2)(__dict_MonadAff_3)(function (emit) {
                    return attach(Control_Bind["<=<"](Control_Monad_Eff.bindEff)(function (_5) {
                        return emit(Data_Either.Left.create(_5));
                    })(handle));
                })));
            };
        };
    };
};
var catEventSource = function (__dict_MonadRec_4) {
    return function (_1) {
        return EventSource(Control_Coroutine_Stalling.catMaybes(__dict_MonadRec_4)(Control_Coroutine_Stalling.mapStallingProducer((((__dict_MonadRec_4["__superclass_Prelude.Monad_0"]())["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Data_Functor_Coproduct.coproduct(Prelude["const"](Data_Maybe.Nothing.value))(Data_Maybe.Just.create))(_1)));
    };
};
module.exports = {
    EventSource: EventSource, 
    fromParentEventSource: fromParentEventSource, 
    toParentEventSource: toParentEventSource, 
    catEventSource: catEventSource, 
    eventSource_: eventSource_, 
    eventSource: eventSource, 
    runEventSource: runEventSource
};

},{"Control.Bind":"/Users/maximko/Projects/mine/guppi/output/Control.Bind/index.js","Control.Coroutine.Aff":"/Users/maximko/Projects/mine/guppi/output/Control.Coroutine.Aff/index.js","Control.Coroutine.Stalling":"/Users/maximko/Projects/mine/guppi/output/Control.Coroutine.Stalling/index.js","Control.Monad.Aff.AVar":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff.AVar/index.js","Control.Monad.Aff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff.Class/index.js","Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","Control.Monad.Free":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Free/index.js","Control.Monad.Rec.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Rec.Class/index.js","Data.Const":"/Users/maximko/Projects/mine/guppi/output/Data.Const/index.js","Data.Either":"/Users/maximko/Projects/mine/guppi/output/Data.Either/index.js","Data.Functor.Coproduct":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Coproduct/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js","Unsafe.Coerce":"/Users/maximko/Projects/mine/guppi/output/Unsafe.Coerce/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.Query.HalogenF/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Alt = require("Control.Alt");
var Control_Plus = require("Control.Plus");
var Control_Monad_Free_Trans = require("Control.Monad.Free.Trans");
var Data_Bifunctor = require("Data.Bifunctor");
var Data_Functor_Aff = require("Data.Functor.Aff");
var Data_Functor_Eff = require("Data.Functor.Eff");
var Data_Inject = require("Data.Inject");
var Data_Maybe = require("Data.Maybe");
var Data_NaturalTransformation = require("Data.NaturalTransformation");
var Halogen_Query_StateF = require("Halogen.Query.StateF");
var Halogen_Query_EventSource = require("Halogen.Query.EventSource");
var Control_Coroutine_Stalling = require("Control.Coroutine.Stalling");
var StateHF = (function () {
    function StateHF(value0) {
        this.value0 = value0;
    };
    StateHF.create = function (value0) {
        return new StateHF(value0);
    };
    return StateHF;
})();
var SubscribeHF = (function () {
    function SubscribeHF(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    SubscribeHF.create = function (value0) {
        return function (value1) {
            return new SubscribeHF(value0, value1);
        };
    };
    return SubscribeHF;
})();
var QueryHF = (function () {
    function QueryHF(value0) {
        this.value0 = value0;
    };
    QueryHF.create = function (value0) {
        return new QueryHF(value0);
    };
    return QueryHF;
})();
var HaltHF = (function () {
    function HaltHF() {

    };
    HaltHF.value = new HaltHF();
    return HaltHF;
})();
var transformHF = function (__dict_Functor_0) {
    return function (__dict_Functor_1) {
        return function (sigma) {
            return function (phi) {
                return function (gamma) {
                    return function (h) {
                        if (h instanceof StateHF) {
                            return new StateHF(sigma(h.value0));
                        };
                        if (h instanceof SubscribeHF) {
                            return new SubscribeHF(Control_Monad_Free_Trans.bimapFreeT(Control_Coroutine_Stalling.functorStallF)(__dict_Functor_1)(Data_Bifunctor.lmap(Control_Coroutine_Stalling.bifunctorStallF)(phi))(gamma)(Halogen_Query_EventSource.runEventSource(h.value0)), h.value1);
                        };
                        if (h instanceof QueryHF) {
                            return new QueryHF(gamma(h.value0));
                        };
                        if (h instanceof HaltHF) {
                            return HaltHF.value;
                        };
                        throw new Error("Failed pattern match at Halogen.Query.HalogenF line 65, column 1 - line 72, column 1: " + [ h.constructor.name ]);
                    };
                };
            };
        };
    };
};
var injectStateHF = new Data_Inject.Inject(StateHF.create, function (_0) {
    if (_0 instanceof StateHF) {
        return new Data_Maybe.Just(_0.value0);
    };
    return Data_Maybe.Nothing.value;
});
var injectQueryHF = new Data_Inject.Inject(QueryHF.create, function (_1) {
    if (_1 instanceof QueryHF) {
        return new Data_Maybe.Just(_1.value0);
    };
    return Data_Maybe.Nothing.value;
});
var hoistHalogenF = function (__dict_Functor_3) {
    return function (eta) {
        return function (h) {
            if (h instanceof StateHF) {
                return new StateHF(h.value0);
            };
            if (h instanceof SubscribeHF) {
                return new SubscribeHF(Control_Monad_Free_Trans.hoistFreeT(Control_Coroutine_Stalling.functorStallF)(__dict_Functor_3)(eta)(Halogen_Query_EventSource.runEventSource(h.value0)), h.value1);
            };
            if (h instanceof QueryHF) {
                return new QueryHF(eta(h.value0));
            };
            if (h instanceof HaltHF) {
                return HaltHF.value;
            };
            throw new Error("Failed pattern match at Halogen.Query.HalogenF line 80, column 1 - line 85, column 1: " + [ h.constructor.name ]);
        };
    };
};
var functorHalogenF = function (__dict_Functor_4) {
    return new Prelude.Functor(function (f) {
        return function (h) {
            if (h instanceof StateHF) {
                return new StateHF(Prelude.map(Halogen_Query_StateF.functorStateF)(f)(h.value0));
            };
            if (h instanceof SubscribeHF) {
                return new SubscribeHF(h.value0, f(h.value1));
            };
            if (h instanceof QueryHF) {
                return new QueryHF(Prelude.map(__dict_Functor_4)(f)(h.value0));
            };
            if (h instanceof HaltHF) {
                return HaltHF.value;
            };
            throw new Error("Failed pattern match at Halogen.Query.HalogenF line 33, column 1 - line 41, column 1: " + [ h.constructor.name ]);
        };
    });
};
var functorEffHalogenF = function (__dict_FunctorEff_5) {
    return new Data_Functor_Eff.FunctorEff(function () {
        return functorHalogenF(__dict_FunctorEff_5["__superclass_Prelude.Functor_0"]());
    }, function (_24) {
        return QueryHF.create(Data_Functor_Eff.liftEff(__dict_FunctorEff_5)(_24));
    });
};
var functorAffHalogenF = function (__dict_FunctorAff_6) {
    return new Data_Functor_Aff.FunctorAff(function () {
        return functorHalogenF(__dict_FunctorAff_6["__superclass_Prelude.Functor_0"]());
    }, function (_25) {
        return QueryHF.create(Data_Functor_Aff.liftAff(__dict_FunctorAff_6)(_25));
    });
};
var altHalogenF = function (__dict_Functor_7) {
    return new Control_Alt.Alt(function () {
        return functorHalogenF(__dict_Functor_7);
    }, function (_2) {
        return function (h) {
            if (_2 instanceof HaltHF) {
                return h;
            };
            return _2;
        };
    });
};
var plusHalogenF = function (__dict_Functor_2) {
    return new Control_Plus.Plus(function () {
        return altHalogenF(__dict_Functor_2);
    }, HaltHF.value);
};
module.exports = {
    StateHF: StateHF, 
    SubscribeHF: SubscribeHF, 
    QueryHF: QueryHF, 
    HaltHF: HaltHF, 
    hoistHalogenF: hoistHalogenF, 
    transformHF: transformHF, 
    functorHalogenF: functorHalogenF, 
    functorEffHalogenF: functorEffHalogenF, 
    functorAffHalogenF: functorAffHalogenF, 
    injectStateHF: injectStateHF, 
    injectQueryHF: injectQueryHF, 
    altHalogenF: altHalogenF, 
    plusHalogenF: plusHalogenF
};

},{"Control.Alt":"/Users/maximko/Projects/mine/guppi/output/Control.Alt/index.js","Control.Coroutine.Stalling":"/Users/maximko/Projects/mine/guppi/output/Control.Coroutine.Stalling/index.js","Control.Monad.Free.Trans":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Free.Trans/index.js","Control.Plus":"/Users/maximko/Projects/mine/guppi/output/Control.Plus/index.js","Data.Bifunctor":"/Users/maximko/Projects/mine/guppi/output/Data.Bifunctor/index.js","Data.Functor.Aff":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Aff/index.js","Data.Functor.Eff":"/Users/maximko/Projects/mine/guppi/output/Data.Functor.Eff/index.js","Data.Inject":"/Users/maximko/Projects/mine/guppi/output/Data.Inject/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.NaturalTransformation":"/Users/maximko/Projects/mine/guppi/output/Data.NaturalTransformation/index.js","Halogen.Query.EventSource":"/Users/maximko/Projects/mine/guppi/output/Halogen.Query.EventSource/index.js","Halogen.Query.StateF":"/Users/maximko/Projects/mine/guppi/output/Halogen.Query.StateF/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.Query.StateF/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Control_Monad_State_Class = require("Control.Monad.State.Class");
var Prelude = require("Prelude");
var Control_Monad_State = require("Control.Monad.State");
var Data_Functor = require("Data.Functor");
var Data_NaturalTransformation = require("Data.NaturalTransformation");
var Get = (function () {
    function Get(value0) {
        this.value0 = value0;
    };
    Get.create = function (value0) {
        return new Get(value0);
    };
    return Get;
})();
var Modify = (function () {
    function Modify(value0, value1) {
        this.value0 = value0;
        this.value1 = value1;
    };
    Modify.create = function (value0) {
        return function (value1) {
            return new Modify(value0, value1);
        };
    };
    return Modify;
})();
var stateN = function (__dict_Monad_0) {
    return function (__dict_MonadState_1) {
        return function (_3) {
            if (_3 instanceof Get) {
                return Prelude[">>="](__dict_Monad_0["__superclass_Prelude.Bind_1"]())(Control_Monad_State_Class.get(__dict_MonadState_1))(function (_20) {
                    return Prelude.pure(__dict_Monad_0["__superclass_Prelude.Applicative_0"]())(_3.value0(_20));
                });
            };
            if (_3 instanceof Modify) {
                return Data_Functor["$>"](((__dict_Monad_0["__superclass_Prelude.Bind_1"]())["__superclass_Prelude.Apply_0"]())["__superclass_Prelude.Functor_0"]())(Control_Monad_State_Class.modify(__dict_MonadState_1)(_3.value0))(_3.value1);
            };
            throw new Error("Failed pattern match at Halogen.Query.StateF line 33, column 1 - line 34, column 1: " + [ _3.constructor.name ]);
        };
    };
};
var mapState = function (_0) {
    return function (_1) {
        return function (_2) {
            if (_2 instanceof Get) {
                return new Get(function (_21) {
                    return _2.value0(_0(_21));
                });
            };
            if (_2 instanceof Modify) {
                return new Modify(_1(_2.value0), _2.value1);
            };
            throw new Error("Failed pattern match at Halogen.Query.StateF line 27, column 1 - line 28, column 1: " + [ _0.constructor.name, _1.constructor.name, _2.constructor.name ]);
        };
    };
};
var functorStateF = new Prelude.Functor(function (f) {
    return function (_4) {
        if (_4 instanceof Get) {
            return new Get(function (_22) {
                return f(_4.value0(_22));
            });
        };
        if (_4 instanceof Modify) {
            return new Modify(_4.value0, f(_4.value1));
        };
        throw new Error("Failed pattern match at Halogen.Query.StateF line 21, column 1 - line 27, column 1: " + [ f.constructor.name, _4.constructor.name ]);
    };
});
module.exports = {
    Get: Get, 
    Modify: Modify, 
    stateN: stateN, 
    mapState: mapState, 
    functorStateF: functorStateF
};

},{"Control.Monad.State":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State/index.js","Control.Monad.State.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.State.Class/index.js","Data.Functor":"/Users/maximko/Projects/mine/guppi/output/Data.Functor/index.js","Data.NaturalTransformation":"/Users/maximko/Projects/mine/guppi/output/Data.NaturalTransformation/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.Query/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Alt = require("Control.Alt");
var Control_Monad_Aff = require("Control.Monad.Aff");
var Control_Monad_Aff_Class = require("Control.Monad.Aff.Class");
var Control_Monad_Eff = require("Control.Monad.Eff");
var Control_Monad_Eff_Class = require("Control.Monad.Eff.Class");
var Control_Monad_Free = require("Control.Monad.Free");
var Data_Inject = require("Data.Inject");
var Halogen_Query_EventSource = require("Halogen.Query.EventSource");
var Halogen_Query_HalogenF = require("Halogen.Query.HalogenF");
var Halogen_Query_StateF = require("Halogen.Query.StateF");
var subscribe$prime = function (es) {
    return Control_Monad_Free.liftF(new Halogen_Query_HalogenF.SubscribeHF(Halogen_Query_EventSource.toParentEventSource(es), Prelude.unit));
};
var subscribe = function (es) {
    return Control_Monad_Free.liftF(new Halogen_Query_HalogenF.SubscribeHF(es, Prelude.unit));
};
var request = function (req) {
    return req(Prelude.id(Prelude.categoryFn));
};
var modify = function (f) {
    return Control_Monad_Free.liftF(new Halogen_Query_HalogenF.StateHF(new Halogen_Query_StateF.Modify(f, Prelude.unit)));
};
var set = function (_0) {
    return modify(Prelude["const"](_0));
};
var liftH = function (_1) {
    return Control_Monad_Free.liftF(Halogen_Query_HalogenF.QueryHF.create(_1));
};
var liftEff$prime = function (__dict_MonadEff_0) {
    return function (_2) {
        return liftH(Control_Monad_Eff_Class.liftEff(__dict_MonadEff_0)(_2));
    };
};
var liftAff$prime = function (__dict_MonadAff_1) {
    return function (_3) {
        return liftH(Control_Monad_Aff_Class.liftAff(__dict_MonadAff_1)(_3));
    };
};
var gets = function (_4) {
    return Control_Monad_Free.liftF(Halogen_Query_HalogenF.StateHF.create(Halogen_Query_StateF.Get.create(_4)));
};
var get = gets(Prelude.id(Prelude.categoryFn));
var action = function (act) {
    return act(Prelude.unit);
};
module.exports = {
    "liftEff'": liftEff$prime, 
    "liftAff'": liftAff$prime, 
    liftH: liftH, 
    "subscribe'": subscribe$prime, 
    subscribe: subscribe, 
    set: set, 
    modify: modify, 
    gets: gets, 
    get: get, 
    request: request, 
    action: action
};

},{"Control.Alt":"/Users/maximko/Projects/mine/guppi/output/Control.Alt/index.js","Control.Monad.Aff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff/index.js","Control.Monad.Aff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff.Class/index.js","Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","Control.Monad.Eff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Class/index.js","Control.Monad.Free":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Free/index.js","Data.Inject":"/Users/maximko/Projects/mine/guppi/output/Data.Inject/index.js","Halogen.Query.EventSource":"/Users/maximko/Projects/mine/guppi/output/Halogen.Query.EventSource/index.js","Halogen.Query.HalogenF":"/Users/maximko/Projects/mine/guppi/output/Halogen.Query.HalogenF/index.js","Halogen.Query.StateF":"/Users/maximko/Projects/mine/guppi/output/Halogen.Query.StateF/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen.Util/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Control_Bind = require("Control.Bind");
var Control_Monad_Eff = require("Control.Monad.Eff");
var Control_Monad_Eff_Class = require("Control.Monad.Eff.Class");
var Data_Maybe = require("Data.Maybe");
var Data_Nullable = require("Data.Nullable");
var DOM = require("DOM");
var DOM_Event_EventTarget = require("DOM.Event.EventTarget");
var DOM_Event_EventTypes = require("DOM.Event.EventTypes");
var DOM_HTML = require("DOM.HTML");
var DOM_HTML_Types = require("DOM.HTML.Types");
var DOM_HTML_Window = require("DOM.HTML.Window");
var DOM_Node_Node = require("DOM.Node.Node");
var DOM_Node_ParentNode = require("DOM.Node.ParentNode");
var DOM_Node_Types = require("DOM.Node.Types");
var onLoad = function (__dict_MonadEff_0) {
    return function (callback) {
        return Control_Monad_Eff_Class.liftEff(__dict_MonadEff_0)(Control_Bind["=<<"](Control_Monad_Eff.bindEff)(function (_6) {
            return DOM_Event_EventTarget.addEventListener(DOM_Event_EventTypes.load)(DOM_Event_EventTarget.eventListener(function (_1) {
                return callback;
            }))(false)(DOM_HTML_Types.windowToEventTarget(_6));
        })(DOM_HTML.window));
    };
};
var appendTo = function (__dict_MonadEff_1) {
    return function (query) {
        return function (elem) {
            return Control_Monad_Eff_Class.liftEff(__dict_MonadEff_1)(function __do() {
                var _0 = Prelude["<$>"](Control_Monad_Eff.functorEff)(Data_Nullable.toMaybe)(Control_Bind["=<<"](Control_Monad_Eff.bindEff)(Control_Bind["<=<"](Control_Monad_Eff.bindEff)(function (_7) {
                    return DOM_Node_ParentNode.querySelector(query)(DOM_HTML_Types.htmlDocumentToParentNode(_7));
                })(DOM_HTML_Window.document))(DOM_HTML.window))();
                return (function () {
                    if (_0 instanceof Data_Maybe.Nothing) {
                        return Prelude.pure(Control_Monad_Eff.applicativeEff)(Prelude.unit);
                    };
                    if (_0 instanceof Data_Maybe.Just) {
                        return Prelude["void"](Control_Monad_Eff.functorEff)(DOM_Node_Node.appendChild(DOM_HTML_Types.htmlElementToNode(elem))(DOM_Node_Types.elementToNode(_0.value0)));
                    };
                    throw new Error("Failed pattern match at Halogen.Util line 28, column 1 - line 30, column 1: " + [ _0.constructor.name ]);
                })()();
            });
        };
    };
};
var appendToBody = function (__dict_MonadEff_2) {
    return appendTo(__dict_MonadEff_2)("body");
};
module.exports = {
    onLoad: onLoad, 
    appendToBody: appendToBody, 
    appendTo: appendTo
};

},{"Control.Bind":"/Users/maximko/Projects/mine/guppi/output/Control.Bind/index.js","Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","Control.Monad.Eff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Class/index.js","DOM":"/Users/maximko/Projects/mine/guppi/output/DOM/index.js","DOM.Event.EventTarget":"/Users/maximko/Projects/mine/guppi/output/DOM.Event.EventTarget/index.js","DOM.Event.EventTypes":"/Users/maximko/Projects/mine/guppi/output/DOM.Event.EventTypes/index.js","DOM.HTML":"/Users/maximko/Projects/mine/guppi/output/DOM.HTML/index.js","DOM.HTML.Types":"/Users/maximko/Projects/mine/guppi/output/DOM.HTML.Types/index.js","DOM.HTML.Window":"/Users/maximko/Projects/mine/guppi/output/DOM.HTML.Window/index.js","DOM.Node.Node":"/Users/maximko/Projects/mine/guppi/output/DOM.Node.Node/index.js","DOM.Node.ParentNode":"/Users/maximko/Projects/mine/guppi/output/DOM.Node.ParentNode/index.js","DOM.Node.Types":"/Users/maximko/Projects/mine/guppi/output/DOM.Node.Types/index.js","Data.Maybe":"/Users/maximko/Projects/mine/guppi/output/Data.Maybe/index.js","Data.Nullable":"/Users/maximko/Projects/mine/guppi/output/Data.Nullable/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Halogen/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var Prelude = require("Prelude");
var Data_NaturalTransformation = require("Data.NaturalTransformation");
var Halogen_Component = require("Halogen.Component");
var Halogen_Driver = require("Halogen.Driver");
var Halogen_Effects = require("Halogen.Effects");
var Halogen_Query = require("Halogen.Query");
var Halogen_HTML_Core = require("Halogen.HTML.Core");
module.exports = {};

},{"Data.NaturalTransformation":"/Users/maximko/Projects/mine/guppi/output/Data.NaturalTransformation/index.js","Halogen.Component":"/Users/maximko/Projects/mine/guppi/output/Halogen.Component/index.js","Halogen.Driver":"/Users/maximko/Projects/mine/guppi/output/Halogen.Driver/index.js","Halogen.Effects":"/Users/maximko/Projects/mine/guppi/output/Halogen.Effects/index.js","Halogen.HTML.Core":"/Users/maximko/Projects/mine/guppi/output/Halogen.HTML.Core/index.js","Halogen.Query":"/Users/maximko/Projects/mine/guppi/output/Halogen.Query/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Main/foreign.js":[function(require,module,exports){
// module Main

exports.alert = function(str) {
    return function() {
        alert(str);
        return {};
    };
};

exports.alertAff = function(str) {
    return function(cb, eb) {
        alert(str);
        return cb({});
    };
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Main/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Halogen_Driver = require("Halogen.Driver");
var Prelude = require("Prelude");
var Control_Monad_Aff = require("Control.Monad.Aff");
var Control_Monad_Eff = require("Control.Monad.Eff");
var Control_Monad_Eff_Class = require("Control.Monad.Eff.Class");
var Control_Monad_Eff_Exception = require("Control.Monad.Eff.Exception");
var Halogen = require("Halogen");
var Halogen_Cordova = require("Halogen.Cordova");
var Halogen_Util = require("Halogen.Util");
var Guppi_Effects = require("Guppi.Effects");
var Guppi_Component = require("Guppi.Component");
var main = Control_Monad_Aff.runAff(function (e) {
    return $foreign.alert(Control_Monad_Eff_Exception.message(e));
})(Prelude["const"](Prelude.pure(Control_Monad_Eff.applicativeEff)(Prelude.unit)))(Prelude.bind(Control_Monad_Aff.bindAff)(Halogen_Driver.runUI(Guppi_Component.comp)(Guppi_Component.initialState))(function (_0) {
    return Halogen_Util.onLoad(Control_Monad_Aff.monadEffAff)(Halogen_Util.appendToBody(Control_Monad_Eff_Class.monadEffEff)(_0.node));
}));
module.exports = {
    main: main, 
    alertAff: $foreign.alertAff, 
    alert: $foreign.alert
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Main/foreign.js","Control.Monad.Aff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Aff/index.js","Control.Monad.Eff":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff/index.js","Control.Monad.Eff.Class":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Class/index.js","Control.Monad.Eff.Exception":"/Users/maximko/Projects/mine/guppi/output/Control.Monad.Eff.Exception/index.js","Guppi.Component":"/Users/maximko/Projects/mine/guppi/output/Guppi.Component/index.js","Guppi.Effects":"/Users/maximko/Projects/mine/guppi/output/Guppi.Effects/index.js","Halogen":"/Users/maximko/Projects/mine/guppi/output/Halogen/index.js","Halogen.Cordova":"/Users/maximko/Projects/mine/guppi/output/Halogen.Cordova/index.js","Halogen.Driver":"/Users/maximko/Projects/mine/guppi/output/Halogen.Driver/index.js","Halogen.Util":"/Users/maximko/Projects/mine/guppi/output/Halogen.Util/index.js","Prelude":"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js"}],"/Users/maximko/Projects/mine/guppi/output/Math/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Math

exports.abs = Math.abs;

exports.acos = Math.acos;

exports.asin = Math.asin;

exports.atan = Math.atan;

exports.atan2 = function (y) {
  return function (x) {
    return Math.atan2(y, x);
  };
};

exports.ceil = Math.ceil;

exports.cos = Math.cos;

exports.exp = Math.exp;

exports.floor = Math.floor;

exports.log = Math.log;

exports.max = function (n1) {
  return function (n2) {
    return Math.max(n1, n2);
  };
};

exports.min = function (n1) {
  return function (n2) {
    return Math.min(n1, n2);
  };
};

exports.pow = function (n) {
  return function (p) {
    return Math.pow(n, p);
  };
};

exports["%"] = function(n) {
  return function(m) {
    return n % m;
  };
};

exports.round = Math.round;

exports.sin = Math.sin;

exports.sqrt = Math.sqrt;

exports.tan = Math.tan;

exports.e = Math.E;

exports.ln2 = Math.LN2;

exports.ln10 = Math.LN10;

exports.log2e = Math.LOG2E;

exports.log10e = Math.LOG10E;

exports.pi = Math.PI;

exports.sqrt1_2 = Math.SQRT1_2;

exports.sqrt2 = Math.SQRT2;

},{}],"/Users/maximko/Projects/mine/guppi/output/Math/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
module.exports = {
    sqrt2: $foreign.sqrt2, 
    sqrt1_2: $foreign.sqrt1_2, 
    pi: $foreign.pi, 
    log10e: $foreign.log10e, 
    log2e: $foreign.log2e, 
    ln10: $foreign.ln10, 
    ln2: $foreign.ln2, 
    e: $foreign.e, 
    "%": $foreign["%"], 
    tan: $foreign.tan, 
    sqrt: $foreign.sqrt, 
    sin: $foreign.sin, 
    round: $foreign.round, 
    pow: $foreign.pow, 
    min: $foreign.min, 
    max: $foreign.max, 
    log: $foreign.log, 
    floor: $foreign.floor, 
    exp: $foreign.exp, 
    cos: $foreign.cos, 
    ceil: $foreign.ceil, 
    atan2: $foreign.atan2, 
    atan: $foreign.atan, 
    asin: $foreign.asin, 
    acos: $foreign.acos, 
    abs: $foreign.abs
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Math/foreign.js"}],"/Users/maximko/Projects/mine/guppi/output/Prelude/foreign.js":[function(require,module,exports){
/* global exports */
"use strict";

// module Prelude

//- Functor --------------------------------------------------------------------

exports.arrayMap = function (f) {
  return function (arr) {
    var l = arr.length;
    var result = new Array(l);
    for (var i = 0; i < l; i++) {
      result[i] = f(arr[i]);
    }
    return result;
  };
};

//- Bind -----------------------------------------------------------------------

exports.arrayBind = function (arr) {
  return function (f) {
    var result = [];
    for (var i = 0, l = arr.length; i < l; i++) {
      Array.prototype.push.apply(result, f(arr[i]));
    }
    return result;
  };
};

//- Monoid ---------------------------------------------------------------------

exports.concatString = function (s1) {
  return function (s2) {
    return s1 + s2;
  };
};

exports.concatArray = function (xs) {
  return function (ys) {
    return xs.concat(ys);
  };
};

//- Semiring -------------------------------------------------------------------

exports.intAdd = function (x) {
  return function (y) {
    /* jshint bitwise: false */
    return x + y | 0;
  };
};

exports.intMul = function (x) {
  return function (y) {
    /* jshint bitwise: false */
    return x * y | 0;
  };
};

exports.numAdd = function (n1) {
  return function (n2) {
    return n1 + n2;
  };
};

exports.numMul = function (n1) {
  return function (n2) {
    return n1 * n2;
  };
};

//- ModuloSemiring -------------------------------------------------------------

exports.intDiv = function (x) {
  return function (y) {
    /* jshint bitwise: false */
    return x / y | 0;
  };
};

exports.intMod = function (x) {
  return function (y) {
    return x % y;
  };
};

exports.numDiv = function (n1) {
  return function (n2) {
    return n1 / n2;
  };
};

//- Ring -----------------------------------------------------------------------

exports.intSub = function (x) {
  return function (y) {
    /* jshint bitwise: false */
    return x - y | 0;
  };
};

exports.numSub = function (n1) {
  return function (n2) {
    return n1 - n2;
  };
};

//- Eq -------------------------------------------------------------------------

exports.refEq = function (r1) {
  return function (r2) {
    return r1 === r2;
  };
};

exports.refIneq = function (r1) {
  return function (r2) {
    return r1 !== r2;
  };
};

exports.eqArrayImpl = function (f) {
  return function (xs) {
    return function (ys) {
      if (xs.length !== ys.length) return false;
      for (var i = 0; i < xs.length; i++) {
        if (!f(xs[i])(ys[i])) return false;
      }
      return true;
    };
  };
};

exports.ordArrayImpl = function (f) {
  return function (xs) {
    return function (ys) {
      var i = 0;
      var xlen = xs.length;
      var ylen = ys.length;
      while (i < xlen && i < ylen) {
        var x = xs[i];
        var y = ys[i];
        var o = f(x)(y);
        if (o !== 0) {
          return o;
        }
        i++;
      }
      if (xlen === ylen) {
        return 0;
      } else if (xlen > ylen) {
        return -1;
      } else {
        return 1;
      }
    };
  };
};

//- Ord ------------------------------------------------------------------------

exports.unsafeCompareImpl = function (lt) {
  return function (eq) {
    return function (gt) {
      return function (x) {
        return function (y) {
          return x < y ? lt : x > y ? gt : eq;
        };
      };
    };
  };
};

//- Bounded --------------------------------------------------------------------

exports.topInt = 2147483647;
exports.bottomInt = -2147483648;

exports.topChar = String.fromCharCode(65535);
exports.bottomChar = String.fromCharCode(0);

//- BooleanAlgebra -------------------------------------------------------------

exports.boolOr = function (b1) {
  return function (b2) {
    return b1 || b2;
  };
};

exports.boolAnd = function (b1) {
  return function (b2) {
    return b1 && b2;
  };
};

exports.boolNot = function (b) {
  return !b;
};

//- Show -----------------------------------------------------------------------

exports.showIntImpl = function (n) {
  return n.toString();
};

exports.showNumberImpl = function (n) {
  /* jshint bitwise: false */
  return n === (n | 0) ? n + ".0" : n.toString();
};

exports.showCharImpl = function (c) {
  var code = c.charCodeAt(0);
  if (code < 0x20 || code === 0x7F) {
    switch (c) {
      case "\a": return "'\\a'";
      case "\b": return "'\\b'";
      case "\f": return "'\\f'";
      case "\n": return "'\\n'";
      case "\r": return "'\\r'";
      case "\t": return "'\\t'";
      case "\v": return "'\\v'";
    }
    return "'\\" + code.toString(10) + "'";
  }
  return c === "'" || c === "\\" ? "'\\" + c + "'" : "'" + c + "'";
};

exports.showStringImpl = function (s) {
  var l = s.length;
  return "\"" + s.replace(
    /[\0-\x1F\x7F"\\]/g,
    function (c, i) { // jshint ignore:line
      switch (c) {
        case "\"":
        case "\\":
          return "\\" + c;
        case "\a": return "\\a";
        case "\b": return "\\b";
        case "\f": return "\\f";
        case "\n": return "\\n";
        case "\r": return "\\r";
        case "\t": return "\\t";
        case "\v": return "\\v";
      }
      var k = i + 1;
      var empty = k < l && s[k] >= "0" && s[k] <= "9" ? "\\&" : "";
      return "\\" + c.charCodeAt(0).toString(10) + empty;
    }
  ) + "\"";
};

exports.showArrayImpl = function (f) {
  return function (xs) {
    var ss = [];
    for (var i = 0, l = xs.length; i < l; i++) {
      ss[i] = f(xs[i]);
    }
    return "[" + ss.join(",") + "]";
  };
};

},{}],"/Users/maximko/Projects/mine/guppi/output/Prelude/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
var Unit = function (x) {
    return x;
};
var LT = (function () {
    function LT() {

    };
    LT.value = new LT();
    return LT;
})();
var GT = (function () {
    function GT() {

    };
    GT.value = new GT();
    return GT;
})();
var EQ = (function () {
    function EQ() {

    };
    EQ.value = new EQ();
    return EQ;
})();
var Semigroupoid = function (compose) {
    this.compose = compose;
};
var Category = function (__superclass_Prelude$dotSemigroupoid_0, id) {
    this["__superclass_Prelude.Semigroupoid_0"] = __superclass_Prelude$dotSemigroupoid_0;
    this.id = id;
};
var Functor = function (map) {
    this.map = map;
};
var Apply = function (__superclass_Prelude$dotFunctor_0, apply) {
    this["__superclass_Prelude.Functor_0"] = __superclass_Prelude$dotFunctor_0;
    this.apply = apply;
};
var Applicative = function (__superclass_Prelude$dotApply_0, pure) {
    this["__superclass_Prelude.Apply_0"] = __superclass_Prelude$dotApply_0;
    this.pure = pure;
};
var Bind = function (__superclass_Prelude$dotApply_0, bind) {
    this["__superclass_Prelude.Apply_0"] = __superclass_Prelude$dotApply_0;
    this.bind = bind;
};
var Monad = function (__superclass_Prelude$dotApplicative_0, __superclass_Prelude$dotBind_1) {
    this["__superclass_Prelude.Applicative_0"] = __superclass_Prelude$dotApplicative_0;
    this["__superclass_Prelude.Bind_1"] = __superclass_Prelude$dotBind_1;
};
var Semigroup = function (append) {
    this.append = append;
};
var Semiring = function (add, mul, one, zero) {
    this.add = add;
    this.mul = mul;
    this.one = one;
    this.zero = zero;
};
var Ring = function (__superclass_Prelude$dotSemiring_0, sub) {
    this["__superclass_Prelude.Semiring_0"] = __superclass_Prelude$dotSemiring_0;
    this.sub = sub;
};
var ModuloSemiring = function (__superclass_Prelude$dotSemiring_0, div, mod) {
    this["__superclass_Prelude.Semiring_0"] = __superclass_Prelude$dotSemiring_0;
    this.div = div;
    this.mod = mod;
};
var DivisionRing = function (__superclass_Prelude$dotModuloSemiring_1, __superclass_Prelude$dotRing_0) {
    this["__superclass_Prelude.ModuloSemiring_1"] = __superclass_Prelude$dotModuloSemiring_1;
    this["__superclass_Prelude.Ring_0"] = __superclass_Prelude$dotRing_0;
};
var Num = function (__superclass_Prelude$dotDivisionRing_0) {
    this["__superclass_Prelude.DivisionRing_0"] = __superclass_Prelude$dotDivisionRing_0;
};
var Eq = function (eq) {
    this.eq = eq;
};
var Ord = function (__superclass_Prelude$dotEq_0, compare) {
    this["__superclass_Prelude.Eq_0"] = __superclass_Prelude$dotEq_0;
    this.compare = compare;
};
var Bounded = function (bottom, top) {
    this.bottom = bottom;
    this.top = top;
};
var BoundedOrd = function (__superclass_Prelude$dotBounded_0, __superclass_Prelude$dotOrd_1) {
    this["__superclass_Prelude.Bounded_0"] = __superclass_Prelude$dotBounded_0;
    this["__superclass_Prelude.Ord_1"] = __superclass_Prelude$dotOrd_1;
};
var BooleanAlgebra = function (__superclass_Prelude$dotBounded_0, conj, disj, not) {
    this["__superclass_Prelude.Bounded_0"] = __superclass_Prelude$dotBounded_0;
    this.conj = conj;
    this.disj = disj;
    this.not = not;
};
var Show = function (show) {
    this.show = show;
};
var $dollar = function (f) {
    return function (x) {
        return f(x);
    };
};
var $hash = function (x) {
    return function (f) {
        return f(x);
    };
};
var zero = function (dict) {
    return dict.zero;
};
var unsafeCompare = $foreign.unsafeCompareImpl(LT.value)(EQ.value)(GT.value);
var unit = {};
var top = function (dict) {
    return dict.top;
};
var sub = function (dict) {
    return dict.sub;
};
var $minus = function (__dict_Ring_0) {
    return sub(__dict_Ring_0);
};
var showUnit = new Show(function (_36) {
    return "unit";
});
var showString = new Show($foreign.showStringImpl);
var showOrdering = new Show(function (_37) {
    if (_37 instanceof LT) {
        return "LT";
    };
    if (_37 instanceof GT) {
        return "GT";
    };
    if (_37 instanceof EQ) {
        return "EQ";
    };
    throw new Error("Failed pattern match at Prelude line 863, column 1 - line 868, column 1: " + [ _37.constructor.name ]);
});
var showNumber = new Show($foreign.showNumberImpl);
var showInt = new Show($foreign.showIntImpl);
var showChar = new Show($foreign.showCharImpl);
var showBoolean = new Show(function (_35) {
    if (_35) {
        return "true";
    };
    if (!_35) {
        return "false";
    };
    throw new Error("Failed pattern match at Prelude line 841, column 1 - line 845, column 1: " + [ _35.constructor.name ]);
});
var show = function (dict) {
    return dict.show;
};
var showArray = function (__dict_Show_1) {
    return new Show($foreign.showArrayImpl(show(__dict_Show_1)));
};
var semiringUnit = new Semiring(function (_8) {
    return function (_9) {
        return unit;
    };
}, function (_10) {
    return function (_11) {
        return unit;
    };
}, unit, unit);
var semiringNumber = new Semiring($foreign.numAdd, $foreign.numMul, 1.0, 0.0);
var semiringInt = new Semiring($foreign.intAdd, $foreign.intMul, 1, 0);
var semigroupoidFn = new Semigroupoid(function (f) {
    return function (g) {
        return function (x) {
            return f(g(x));
        };
    };
});
var semigroupUnit = new Semigroup(function (_5) {
    return function (_6) {
        return unit;
    };
});
var semigroupString = new Semigroup($foreign.concatString);
var semigroupOrdering = new Semigroup(function (_7) {
    return function (y) {
        if (_7 instanceof LT) {
            return LT.value;
        };
        if (_7 instanceof GT) {
            return GT.value;
        };
        if (_7 instanceof EQ) {
            return y;
        };
        throw new Error("Failed pattern match at Prelude line 413, column 1 - line 418, column 1: " + [ _7.constructor.name, y.constructor.name ]);
    };
});
var semigroupArray = new Semigroup($foreign.concatArray);
var ringUnit = new Ring(function () {
    return semiringUnit;
}, function (_12) {
    return function (_13) {
        return unit;
    };
});
var ringNumber = new Ring(function () {
    return semiringNumber;
}, $foreign.numSub);
var ringInt = new Ring(function () {
    return semiringInt;
}, $foreign.intSub);
var pure = function (dict) {
    return dict.pure;
};
var $$return = function (__dict_Applicative_2) {
    return pure(__dict_Applicative_2);
};
var otherwise = true;
var one = function (dict) {
    return dict.one;
};
var not = function (dict) {
    return dict.not;
};
var negate = function (__dict_Ring_3) {
    return function (a) {
        return $minus(__dict_Ring_3)(zero(__dict_Ring_3["__superclass_Prelude.Semiring_0"]()))(a);
    };
};
var mul = function (dict) {
    return dict.mul;
};
var $times = function (__dict_Semiring_4) {
    return mul(__dict_Semiring_4);
};
var moduloSemiringUnit = new ModuloSemiring(function () {
    return semiringUnit;
}, function (_16) {
    return function (_17) {
        return unit;
    };
}, function (_18) {
    return function (_19) {
        return unit;
    };
});
var moduloSemiringNumber = new ModuloSemiring(function () {
    return semiringNumber;
}, $foreign.numDiv, function (_14) {
    return function (_15) {
        return 0.0;
    };
});
var moduloSemiringInt = new ModuloSemiring(function () {
    return semiringInt;
}, $foreign.intDiv, $foreign.intMod);
var mod = function (dict) {
    return dict.mod;
};
var map = function (dict) {
    return dict.map;
};
var $less$dollar$greater = function (__dict_Functor_5) {
    return map(__dict_Functor_5);
};
var $less$hash$greater = function (__dict_Functor_6) {
    return function (fa) {
        return function (f) {
            return $less$dollar$greater(__dict_Functor_6)(f)(fa);
        };
    };
};
var id = function (dict) {
    return dict.id;
};
var functorArray = new Functor($foreign.arrayMap);
var flip = function (f) {
    return function (b) {
        return function (a) {
            return f(a)(b);
        };
    };
};
var eqUnit = new Eq(function (_20) {
    return function (_21) {
        return true;
    };
});
var ordUnit = new Ord(function () {
    return eqUnit;
}, function (_24) {
    return function (_25) {
        return EQ.value;
    };
});
var eqString = new Eq($foreign.refEq);
var ordString = new Ord(function () {
    return eqString;
}, unsafeCompare);
var eqOrdering = new Eq(function (_22) {
    return function (_23) {
        if (_22 instanceof LT && _23 instanceof LT) {
            return true;
        };
        if (_22 instanceof GT && _23 instanceof GT) {
            return true;
        };
        if (_22 instanceof EQ && _23 instanceof EQ) {
            return true;
        };
        return false;
    };
});
var ordOrdering = new Ord(function () {
    return eqOrdering;
}, function (_26) {
    return function (_27) {
        if (_26 instanceof LT && _27 instanceof LT) {
            return EQ.value;
        };
        if (_26 instanceof EQ && _27 instanceof EQ) {
            return EQ.value;
        };
        if (_26 instanceof GT && _27 instanceof GT) {
            return EQ.value;
        };
        if (_26 instanceof LT) {
            return LT.value;
        };
        if (_26 instanceof EQ && _27 instanceof LT) {
            return GT.value;
        };
        if (_26 instanceof EQ && _27 instanceof GT) {
            return LT.value;
        };
        if (_26 instanceof GT) {
            return GT.value;
        };
        throw new Error("Failed pattern match at Prelude line 668, column 1 - line 677, column 1: " + [ _26.constructor.name, _27.constructor.name ]);
    };
});
var eqNumber = new Eq($foreign.refEq);
var ordNumber = new Ord(function () {
    return eqNumber;
}, unsafeCompare);
var eqInt = new Eq($foreign.refEq);
var ordInt = new Ord(function () {
    return eqInt;
}, unsafeCompare);
var eqChar = new Eq($foreign.refEq);
var ordChar = new Ord(function () {
    return eqChar;
}, unsafeCompare);
var eqBoolean = new Eq($foreign.refEq);
var ordBoolean = new Ord(function () {
    return eqBoolean;
}, unsafeCompare);
var eq = function (dict) {
    return dict.eq;
};
var $eq$eq = function (__dict_Eq_7) {
    return eq(__dict_Eq_7);
};
var eqArray = function (__dict_Eq_8) {
    return new Eq($foreign.eqArrayImpl($eq$eq(__dict_Eq_8)));
};
var divisionRingUnit = new DivisionRing(function () {
    return moduloSemiringUnit;
}, function () {
    return ringUnit;
});
var numUnit = new Num(function () {
    return divisionRingUnit;
});
var divisionRingNumber = new DivisionRing(function () {
    return moduloSemiringNumber;
}, function () {
    return ringNumber;
});
var numNumber = new Num(function () {
    return divisionRingNumber;
});
var div = function (dict) {
    return dict.div;
};
var $div = function (__dict_ModuloSemiring_10) {
    return div(__dict_ModuloSemiring_10);
};
var disj = function (dict) {
    return dict.disj;
};
var $bar$bar = function (__dict_BooleanAlgebra_11) {
    return disj(__dict_BooleanAlgebra_11);
};
var $$const = function (a) {
    return function (_3) {
        return a;
    };
};
var $$void = function (__dict_Functor_12) {
    return function (fa) {
        return $less$dollar$greater(__dict_Functor_12)($$const(unit))(fa);
    };
};
var conj = function (dict) {
    return dict.conj;
};
var $amp$amp = function (__dict_BooleanAlgebra_13) {
    return conj(__dict_BooleanAlgebra_13);
};
var compose = function (dict) {
    return dict.compose;
};
var functorFn = new Functor(compose(semigroupoidFn));
var $less$less$less = function (__dict_Semigroupoid_14) {
    return compose(__dict_Semigroupoid_14);
};
var $greater$greater$greater = function (__dict_Semigroupoid_15) {
    return flip(compose(__dict_Semigroupoid_15));
};
var compare = function (dict) {
    return dict.compare;
};
var ordArray = function (__dict_Ord_16) {
    return new Ord(function () {
        return eqArray(__dict_Ord_16["__superclass_Prelude.Eq_0"]());
    }, function (xs) {
        return function (ys) {
            return $dollar(compare(ordInt)(0))($foreign.ordArrayImpl(function (x) {
                return function (y) {
                    var _46 = compare(__dict_Ord_16)(x)(y);
                    if (_46 instanceof EQ) {
                        return 0;
                    };
                    if (_46 instanceof LT) {
                        return 1;
                    };
                    if (_46 instanceof GT) {
                        return negate(ringInt)(1);
                    };
                    throw new Error("Failed pattern match at Prelude line 660, column 1 - line 666, column 1: " + [ _46.constructor.name ]);
                };
            })(xs)(ys));
        };
    });
};
var $less = function (__dict_Ord_17) {
    return function (a1) {
        return function (a2) {
            var _47 = compare(__dict_Ord_17)(a1)(a2);
            if (_47 instanceof LT) {
                return true;
            };
            return false;
        };
    };
};
var $less$eq = function (__dict_Ord_18) {
    return function (a1) {
        return function (a2) {
            var _48 = compare(__dict_Ord_18)(a1)(a2);
            if (_48 instanceof GT) {
                return false;
            };
            return true;
        };
    };
};
var $greater = function (__dict_Ord_19) {
    return function (a1) {
        return function (a2) {
            var _49 = compare(__dict_Ord_19)(a1)(a2);
            if (_49 instanceof GT) {
                return true;
            };
            return false;
        };
    };
};
var $greater$eq = function (__dict_Ord_20) {
    return function (a1) {
        return function (a2) {
            var _50 = compare(__dict_Ord_20)(a1)(a2);
            if (_50 instanceof LT) {
                return false;
            };
            return true;
        };
    };
};
var categoryFn = new Category(function () {
    return semigroupoidFn;
}, function (x) {
    return x;
});
var boundedUnit = new Bounded(unit, unit);
var boundedOrdering = new Bounded(LT.value, GT.value);
var boundedOrdUnit = new BoundedOrd(function () {
    return boundedUnit;
}, function () {
    return ordUnit;
});
var boundedOrdOrdering = new BoundedOrd(function () {
    return boundedOrdering;
}, function () {
    return ordOrdering;
});
var boundedInt = new Bounded($foreign.bottomInt, $foreign.topInt);
var boundedOrdInt = new BoundedOrd(function () {
    return boundedInt;
}, function () {
    return ordInt;
});
var boundedChar = new Bounded($foreign.bottomChar, $foreign.topChar);
var boundedOrdChar = new BoundedOrd(function () {
    return boundedChar;
}, function () {
    return ordChar;
});
var boundedBoolean = new Bounded(false, true);
var boundedOrdBoolean = new BoundedOrd(function () {
    return boundedBoolean;
}, function () {
    return ordBoolean;
});
var bottom = function (dict) {
    return dict.bottom;
};
var boundedFn = function (__dict_Bounded_21) {
    return new Bounded(function (_29) {
        return bottom(__dict_Bounded_21);
    }, function (_28) {
        return top(__dict_Bounded_21);
    });
};
var booleanAlgebraUnit = new BooleanAlgebra(function () {
    return boundedUnit;
}, function (_30) {
    return function (_31) {
        return unit;
    };
}, function (_32) {
    return function (_33) {
        return unit;
    };
}, function (_34) {
    return unit;
});
var booleanAlgebraFn = function (__dict_BooleanAlgebra_22) {
    return new BooleanAlgebra(function () {
        return boundedFn(__dict_BooleanAlgebra_22["__superclass_Prelude.Bounded_0"]());
    }, function (fx) {
        return function (fy) {
            return function (a) {
                return conj(__dict_BooleanAlgebra_22)(fx(a))(fy(a));
            };
        };
    }, function (fx) {
        return function (fy) {
            return function (a) {
                return disj(__dict_BooleanAlgebra_22)(fx(a))(fy(a));
            };
        };
    }, function (fx) {
        return function (a) {
            return not(__dict_BooleanAlgebra_22)(fx(a));
        };
    });
};
var booleanAlgebraBoolean = new BooleanAlgebra(function () {
    return boundedBoolean;
}, $foreign.boolAnd, $foreign.boolOr, $foreign.boolNot);
var $div$eq = function (__dict_Eq_9) {
    return function (x) {
        return function (y) {
            return not(booleanAlgebraBoolean)($eq$eq(__dict_Eq_9)(x)(y));
        };
    };
};
var bind = function (dict) {
    return dict.bind;
};
var liftM1 = function (__dict_Monad_23) {
    return function (f) {
        return function (a) {
            return bind(__dict_Monad_23["__superclass_Prelude.Bind_1"]())(a)(function (_0) {
                return $$return(__dict_Monad_23["__superclass_Prelude.Applicative_0"]())(f(_0));
            });
        };
    };
};
var $greater$greater$eq = function (__dict_Bind_24) {
    return bind(__dict_Bind_24);
};
var asTypeOf = function (x) {
    return function (_4) {
        return x;
    };
};
var applyFn = new Apply(function () {
    return functorFn;
}, function (f) {
    return function (g) {
        return function (x) {
            return f(x)(g(x));
        };
    };
});
var bindFn = new Bind(function () {
    return applyFn;
}, function (m) {
    return function (f) {
        return function (x) {
            return f(m(x))(x);
        };
    };
});
var apply = function (dict) {
    return dict.apply;
};
var $less$times$greater = function (__dict_Apply_25) {
    return apply(__dict_Apply_25);
};
var liftA1 = function (__dict_Applicative_26) {
    return function (f) {
        return function (a) {
            return $less$times$greater(__dict_Applicative_26["__superclass_Prelude.Apply_0"]())(pure(__dict_Applicative_26)(f))(a);
        };
    };
};
var applicativeFn = new Applicative(function () {
    return applyFn;
}, $$const);
var monadFn = new Monad(function () {
    return applicativeFn;
}, function () {
    return bindFn;
});
var append = function (dict) {
    return dict.append;
};
var $plus$plus = function (__dict_Semigroup_27) {
    return append(__dict_Semigroup_27);
};
var $less$greater = function (__dict_Semigroup_28) {
    return append(__dict_Semigroup_28);
};
var semigroupFn = function (__dict_Semigroup_29) {
    return new Semigroup(function (f) {
        return function (g) {
            return function (x) {
                return $less$greater(__dict_Semigroup_29)(f(x))(g(x));
            };
        };
    });
};
var ap = function (__dict_Monad_30) {
    return function (f) {
        return function (a) {
            return bind(__dict_Monad_30["__superclass_Prelude.Bind_1"]())(f)(function (_2) {
                return bind(__dict_Monad_30["__superclass_Prelude.Bind_1"]())(a)(function (_1) {
                    return $$return(__dict_Monad_30["__superclass_Prelude.Applicative_0"]())(_2(_1));
                });
            });
        };
    };
};
var monadArray = new Monad(function () {
    return applicativeArray;
}, function () {
    return bindArray;
});
var bindArray = new Bind(function () {
    return applyArray;
}, $foreign.arrayBind);
var applyArray = new Apply(function () {
    return functorArray;
}, ap(monadArray));
var applicativeArray = new Applicative(function () {
    return applyArray;
}, function (x) {
    return [ x ];
});
var add = function (dict) {
    return dict.add;
};
var $plus = function (__dict_Semiring_31) {
    return add(__dict_Semiring_31);
};
module.exports = {
    LT: LT, 
    GT: GT, 
    EQ: EQ, 
    Show: Show, 
    BooleanAlgebra: BooleanAlgebra, 
    BoundedOrd: BoundedOrd, 
    Bounded: Bounded, 
    Ord: Ord, 
    Eq: Eq, 
    DivisionRing: DivisionRing, 
    Num: Num, 
    Ring: Ring, 
    ModuloSemiring: ModuloSemiring, 
    Semiring: Semiring, 
    Semigroup: Semigroup, 
    Monad: Monad, 
    Bind: Bind, 
    Applicative: Applicative, 
    Apply: Apply, 
    Functor: Functor, 
    Category: Category, 
    Semigroupoid: Semigroupoid, 
    show: show, 
    "||": $bar$bar, 
    "&&": $amp$amp, 
    not: not, 
    disj: disj, 
    conj: conj, 
    bottom: bottom, 
    top: top, 
    unsafeCompare: unsafeCompare, 
    ">=": $greater$eq, 
    "<=": $less$eq, 
    ">": $greater, 
    "<": $less, 
    compare: compare, 
    "/=": $div$eq, 
    "==": $eq$eq, 
    eq: eq, 
    "-": $minus, 
    negate: negate, 
    sub: sub, 
    "/": $div, 
    mod: mod, 
    div: div, 
    "*": $times, 
    "+": $plus, 
    one: one, 
    mul: mul, 
    zero: zero, 
    add: add, 
    "++": $plus$plus, 
    "<>": $less$greater, 
    append: append, 
    ap: ap, 
    liftM1: liftM1, 
    "return": $$return, 
    ">>=": $greater$greater$eq, 
    bind: bind, 
    liftA1: liftA1, 
    pure: pure, 
    "<*>": $less$times$greater, 
    apply: apply, 
    "void": $$void, 
    "<#>": $less$hash$greater, 
    "<$>": $less$dollar$greater, 
    map: map, 
    id: id, 
    ">>>": $greater$greater$greater, 
    "<<<": $less$less$less, 
    compose: compose, 
    otherwise: otherwise, 
    asTypeOf: asTypeOf, 
    "const": $$const, 
    flip: flip, 
    "#": $hash, 
    "$": $dollar, 
    unit: unit, 
    semigroupoidFn: semigroupoidFn, 
    categoryFn: categoryFn, 
    functorFn: functorFn, 
    functorArray: functorArray, 
    applyFn: applyFn, 
    applyArray: applyArray, 
    applicativeFn: applicativeFn, 
    applicativeArray: applicativeArray, 
    bindFn: bindFn, 
    bindArray: bindArray, 
    monadFn: monadFn, 
    monadArray: monadArray, 
    semigroupString: semigroupString, 
    semigroupUnit: semigroupUnit, 
    semigroupFn: semigroupFn, 
    semigroupOrdering: semigroupOrdering, 
    semigroupArray: semigroupArray, 
    semiringInt: semiringInt, 
    semiringNumber: semiringNumber, 
    semiringUnit: semiringUnit, 
    ringInt: ringInt, 
    ringNumber: ringNumber, 
    ringUnit: ringUnit, 
    moduloSemiringInt: moduloSemiringInt, 
    moduloSemiringNumber: moduloSemiringNumber, 
    moduloSemiringUnit: moduloSemiringUnit, 
    divisionRingNumber: divisionRingNumber, 
    divisionRingUnit: divisionRingUnit, 
    numNumber: numNumber, 
    numUnit: numUnit, 
    eqBoolean: eqBoolean, 
    eqInt: eqInt, 
    eqNumber: eqNumber, 
    eqChar: eqChar, 
    eqString: eqString, 
    eqUnit: eqUnit, 
    eqArray: eqArray, 
    eqOrdering: eqOrdering, 
    ordBoolean: ordBoolean, 
    ordInt: ordInt, 
    ordNumber: ordNumber, 
    ordString: ordString, 
    ordChar: ordChar, 
    ordUnit: ordUnit, 
    ordArray: ordArray, 
    ordOrdering: ordOrdering, 
    boundedBoolean: boundedBoolean, 
    boundedUnit: boundedUnit, 
    boundedOrdering: boundedOrdering, 
    boundedInt: boundedInt, 
    boundedChar: boundedChar, 
    boundedFn: boundedFn, 
    boundedOrdBoolean: boundedOrdBoolean, 
    boundedOrdUnit: boundedOrdUnit, 
    boundedOrdOrdering: boundedOrdOrdering, 
    boundedOrdInt: boundedOrdInt, 
    boundedOrdChar: boundedOrdChar, 
    booleanAlgebraBoolean: booleanAlgebraBoolean, 
    booleanAlgebraUnit: booleanAlgebraUnit, 
    booleanAlgebraFn: booleanAlgebraFn, 
    showBoolean: showBoolean, 
    showInt: showInt, 
    showNumber: showNumber, 
    showChar: showChar, 
    showString: showString, 
    showUnit: showUnit, 
    showArray: showArray, 
    showOrdering: showOrdering
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Prelude/foreign.js"}],"/Users/maximko/Projects/mine/guppi/output/Unsafe.Coerce/foreign.js":[function(require,module,exports){
"use strict";

// module Unsafe.Coerce

exports.unsafeCoerce = function(x) { return x; }

},{}],"/Users/maximko/Projects/mine/guppi/output/Unsafe.Coerce/index.js":[function(require,module,exports){
// Generated by psc version 0.7.6.1
"use strict";
var $foreign = require("./foreign");
module.exports = {
    unsafeCoerce: $foreign.unsafeCoerce
};

},{"./foreign":"/Users/maximko/Projects/mine/guppi/output/Unsafe.Coerce/foreign.js"}],"/Users/maximko/Projects/mine/guppi/output/browserify.js":[function(require,module,exports){
require('Main').main();

},{"Main":"/Users/maximko/Projects/mine/guppi/output/Main/index.js"}]},{},["/Users/maximko/Projects/mine/guppi/output/browserify.js"]);
