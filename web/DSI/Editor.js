"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var ViewModel_1 = require("./ViewModel");
/**
 *
 */
var Element = /** @class */ (function (_super) {
    __extends(Element, _super);
    function Element() {
        var _this = _super.call(this) || this;
        _this.tag = 'span';
        _this.parent = null;
        _this.s = {
            selection: null,
            node: null,
            offset: null
        };
        Element.registry.push(_this);
        return _this;
    }
    Element.prototype._render = function (registry) {
        var el = document.createElement(this.tag);
        el.contentEditable = 'true';
        return { el: el };
    };
    Element.prototype.afterRender = function (el, meta) {
        el.addEventListener('keydown', this.onKeyDown.bind(this), false);
        el.addEventListener('keypress', this.onKeyPress.bind(this), false);
        el.addEventListener('keyup', this.onKeyUp.bind(this), false);
    };
    Element.prototype.tryDelegateToElement = function (e, method) {
        var focusNode = getSelection().focusNode;
        for (var _i = 0, _a = Element.registry; _i < _a.length; _i++) {
            var _el = _a[_i];
            if (focusNode.nodeType == Node.TEXT_NODE) {
                if (focusNode.parentNode === _el.el) {
                    _el[method](e, true);
                    return _el;
                }
            }
            else if (focusNode === _el.el) {
                _el[method](e, true);
                return _el;
            }
        }
        return null;
    };
    Element.prototype.onKeyDown = function (e, delegated) {
        if (delegated === void 0) { delegated = false; }
        if (!delegated && this.tryDelegateToElement(e, 'onKeyDown')) {
            return;
        }
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.cancelBubble = true;
        this.updateSelection();
        if (e.keyCode == 13) {
            if (e.altKey) {
                this.callHelper();
            }
            else {
                this.explode();
            }
            e.returnValue = false;
            e.preventDefault();
        }
        console.log("Keydown", this);
        if (e.returnValue === false) {
            return false;
        }
    };
    Element.prototype.onKeyPress = function (e, delegated) {
        if (delegated === void 0) { delegated = false; }
        if (!delegated && this.tryDelegateToElement(e, 'onKeyPress')) {
            return;
        }
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.cancelBubble = true;
        this.updateSelection();
        if (e.returnValue === false) {
            return false;
        }
    };
    Element.prototype.onKeyUp = function (e, delegated) {
        if (delegated === void 0) { delegated = false; }
        if (!delegated && this.tryDelegateToElement(e, 'onKeyUp')) {
            return;
        }
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.cancelBubble = true;
        this.updateSelection();
        if (e.returnValue === false) {
            return false;
        }
    };
    Element.prototype.updateSelection = function () {
        var s = getSelection();
        this.s.selection = s;
        this.s.node = s.focusNode;
        this.s.offset = s.focusOffset;
    };
    Element.prototype.callHelper = function () {
    };
    Element.prototype.explode = function (middle) {
        var index = this.parent.children.indexOf(this);
        var pos = this.s.offset;
        var text = this.getContent();
        if (text == "<br>") {
            text = '';
        }
        var beforeText = text.substr(0, pos);
        var afterText = text.substr(pos);
        var beforeEl = this.clone();
        beforeEl.setContent(beforeText || "<br>");
        var afterEl = this;
        afterEl.setContent(afterText || '<br>');
        var replacement = [];
        replacement.push(beforeEl);
        if (middle) {
            for (var _i = 0, middle_1 = middle; _i < middle_1.length; _i++) {
                var element = middle_1[_i];
                replacement.push(element);
            }
        }
        replacement.push(afterEl);
        // meta children insertion
        Array.prototype.splice.apply(this.parent.children, Array.prototype.concat.apply([index, 1], replacement));
        //elements insertion
        var thisEl = this.el;
        var parentEl = this.parent.el;
        for (var _a = 0, replacement_1 = replacement; _a < replacement_1.length; _a++) {
            var itm = replacement_1[_a];
            if (itm.el !== thisEl) {
                parentEl.insertBefore(itm.el, thisEl);
            }
        }
    };
    Element.prototype.setContent = function (content) {
        this._content = content;
        this.el.innerHTML = content;
        return this;
    };
    Element.prototype.getContent = function () {
        return this.el.innerHTML;
    };
    Element.prototype.clone = function () {
        var clone = Object.create(this.constructor.prototype);
        for (var p in this) {
            if (this.hasOwnProperty(p)) {
                clone[p] = this[p];
            }
        }
        clone._el = null;
        clone.meta = {};
        clone.setContent(clone._content);
        Element.registry.push(clone);
        return clone;
    };
    Element.prototype.getRoot = function () {
        if (this.parent) {
            return this.parent.getRoot();
        }
        return null;
    };
    Element.registry = [];
    return Element;
}(ViewModel_1.ViewModel));
/**
 *
 */
var Editor = /** @class */ (function (_super) {
    __extends(Editor, _super);
    function Editor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tag = 'div';
        _this.children = [];
        return _this;
    }
    Editor.prototype.getRoot = function () {
        if (this.parent) {
            return this.parent.getRoot();
        }
        else {
            return this;
        }
    };
    Editor.prototype.explode = function (middle) {
        if (!this.parent) {
            var pos = this.s.offset;
            var text = this.getContent();
            var beforeText = text.substr(0, pos);
            var afterText = text.substr(pos);
            var beforeEditor = this.clone();
            beforeEditor.setContent(beforeText || "<br>");
            var afterEditor = this.clone();
            afterEditor.setContent(afterText || "<br>");
            var replacement = [];
            replacement.push(beforeEditor);
            if (middle) {
                for (var _i = 0, middle_2 = middle; _i < middle_2.length; _i++) {
                    var element = middle_2[_i];
                    replacement.push(element.el);
                }
            }
            replacement.push(afterEditor);
            this.el.innerHTML = '';
            this.children = replacement;
            //elements insertion
            var thisEl = this.el;
            for (var _a = 0, replacement_2 = replacement; _a < replacement_2.length; _a++) {
                var itm = replacement_2[_a];
                itm.parent = this;
                thisEl.appendChild(itm.el);
            }
            /*
                        let r = new Range();
                        r.setStart(afterEditor.el, 0);
                        this.s.selection.addRange(r);
            */
            this.s.node = afterEditor.el;
            this.s.offset = 0;
        }
        else {
            _super.prototype.explode.call(this, middle);
        }
    };
    return Editor;
}(Element));
exports.Editor = Editor;
var RootEditor = /** @class */ (function (_super) {
    __extends(RootEditor, _super);
    function RootEditor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.tag = 'section';
        return _this;
    }
    return RootEditor;
}(Editor));
exports.RootEditor = RootEditor;
