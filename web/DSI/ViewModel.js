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
var MType = require("./Type");
var DEFAULT_EL_KEY = 'el';
var ViewModel = /** @class */ (function () {
    function ViewModel() {
        this.meta = {};
    }
    ViewModel.prototype.render = function () {
        if (!this._el) {
            this.meta = {};
            var meta = this._render(this.meta);
            if (!meta) {
                this._el = this.meta[DEFAULT_EL_KEY];
            }
            else if (meta instanceof Element) {
                this._el = meta;
                this.meta[DEFAULT_EL_KEY] = meta;
            }
            else if (meta instanceof Object) {
                this.meta = meta;
                this._el = this.meta[DEFAULT_EL_KEY];
            }
            this.afterRender(this.meta[DEFAULT_EL_KEY], this.meta);
        }
        return this._el;
    };
    Object.defineProperty(ViewModel.prototype, "el", {
        get: function () {
            return this.render();
        },
        enumerable: true,
        configurable: true
    });
    ViewModel.prototype.afterRender = function (el, meta) {
    };
    return ViewModel;
}());
exports.ViewModel = ViewModel;
var Type = /** @class */ (function (_super) {
    __extends(Type, _super);
    function Type(type, holdsIn) {
        if (holdsIn === void 0) { holdsIn = null; }
        var _this = _super.call(this) || this;
        _this._path = null;
        _this.type = type;
        _this.holdsIn = holdsIn;
        return _this;
    }
    Object.defineProperty(Type.prototype, "path", {
        get: function () {
            if (!this._path) {
                if (this.holdsIn) {
                    this._path = this.holdsIn.path;
                }
                else {
                    this._path = null;
                }
            }
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    Type.prototype.setValue = function (value) {
        this.value = value;
        this.sync();
    };
    Type.prototype.sync = function () {
        this.holdsIn.setValue(this.value);
    };
    return Type;
}(ViewModel));
exports.Type = Type;
var Member = /** @class */ (function (_super) {
    __extends(Member, _super);
    function Member(container) {
        var _this = _super.call(this) || this;
        _this.typeElements = [];
        _this.typesMeta = {};
        _this.container = container;
        return _this;
    }
    Object.defineProperty(Member.prototype, "path", {
        get: function () {
            if (!this._path) {
                if (this.container) {
                    this._path = this.container.path + '.' + this.key;
                }
                else {
                    this._path = String(this.key);
                }
            }
            return this._path;
        },
        enumerable: true,
        configurable: true
    });
    Member.prototype.reset = function () {
        var selected = this.getSelectedType();
        if (selected) {
            var el = this.getTypeMeta(this.selected).el;
            this.selected = undefined;
            this.meta.value.removeChild(el);
        }
    };
    Member.prototype._render = function (r) {
        var _this = this;
        var member = this.member;
        var meta = {
            el: document.createElement('div'),
            key: document.createElement('div'),
            types: document.createElement('div'),
            value: document.createElement('div'),
        };
        meta.el.appendChild(meta.key);
        meta.el.appendChild(meta.types);
        meta.el.appendChild(meta.value);
        meta.el.classList.add('member');
        meta.key.classList.add('member-key');
        meta.key.innerHTML = String(this.key);
        meta.types.classList.add('member-types');
        var index = 0;
        for (var _i = 0, _a = member.types; _i < _a.length; _i++) {
            var type = _a[_i];
            var typeEl = document.createElement('span');
            typeEl.classList.add('type');
            typeEl.classList.add('type-' + type.name);
            typeEl.innerHTML = type.name;
            typeEl.dataset['typeIndex'] = String(index);
            typeEl.addEventListener('click', function (e) {
                var clickedEl = e.target;
                _this.select(Number(clickedEl.dataset['typeIndex']));
            });
            meta.types.appendChild(typeEl);
            this.typeElements.push(typeEl);
            index++;
        }
        meta.value.classList.add('member-value');
        return meta;
    };
    Member.prototype.getSelectedType = function () {
        return this.member.types[this.selected];
    };
    Member.prototype.select = function (index) {
        var oldIndex = this.selected;
        if (this.selected !== index) {
            this.selected = index;
            var meta = this.getTypeMeta(index);
            if (oldIndex !== undefined) {
                var oldMeta = this.getTypeMeta(oldIndex);
                this.meta.value.removeChild(oldMeta.el);
            }
            this.meta.value.appendChild(meta.el);
            meta.el.focus();
            meta.type.sync();
        }
        else if (this.selected !== undefined) {
            var meta = this.getTypeMeta(index);
            meta.type.reset();
            meta.type.sync();
            meta.el.focus();
        }
    };
    Member.prototype.getTypeMeta = function (index) {
        var _index = String(index);
        var mType = this.member.types[index];
        var type, typeEl;
        if (!this.typesMeta[_index]) {
            switch (true) {
                case mType instanceof MType.TypeObject:
                    type = new TypeObject(mType, this);
                    break;
                case mType instanceof MType.TypeArray:
                    type = new TypeArray(mType, this);
                    break;
                case mType instanceof MType.TypeString:
                    type = new TypeString(mType, this);
                    break;
                case mType instanceof MType.TypeNumber:
                    type = new TypeNumber(mType, this);
                    break;
                case mType instanceof MType.TypeNull:
                    type = new TypeNull(mType, this);
                    break;
                case mType instanceof MType.TypeBoolean:
                    type = new TypeBoolean(mType, this);
                    break;
            }
            typeEl = type.el;
            this.typesMeta[_index] = {
                el: typeEl,
                type: type
            };
        }
        return this.typesMeta[_index];
    };
    return Member;
}(ViewModel));
exports.Member = Member;
var TypeContainer = /** @class */ (function (_super) {
    __extends(TypeContainer, _super);
    function TypeContainer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return TypeContainer;
}(Type));
exports.TypeContainer = TypeContainer;
var TypeObject = /** @class */ (function (_super) {
    __extends(TypeObject, _super);
    function TypeObject(type, holdsIn) {
        if (holdsIn === void 0) { holdsIn = null; }
        var _this = _super.call(this, type, holdsIn) || this;
        _this.members = {};
        _this.value = {};
        return _this;
    }
    TypeObject.prototype._render = function (r) {
        var el = document.createElement('div');
        r.members = document.createElement('div');
        r.el = el;
        el.appendChild(r.members);
        el.classList.add('value');
        el.classList.add('value-object');
        for (var _i = 0, _a = Object.getOwnPropertyNames(this.type.members); _i < _a.length; _i++) {
            var key = _a[_i];
            var member = this.members[key] = new ObjectMember(this, key, this.type.members[key]);
            r.members.appendChild(member.el);
        }
        return r;
    };
    TypeObject.prototype.reset = function () {
        for (var _i = 0, _a = Object.getOwnPropertyNames(this.members); _i < _a.length; _i++) {
            var k = _a[_i];
            this.members[k].reset();
        }
        this.value = {};
    };
    return TypeObject;
}(TypeContainer));
exports.TypeObject = TypeObject;
var TypeArray = /** @class */ (function (_super) {
    __extends(TypeArray, _super);
    function TypeArray(type, holdsIn) {
        if (holdsIn === void 0) { holdsIn = null; }
        var _this = _super.call(this, type, holdsIn) || this;
        _this.items = [];
        _this.value = [];
        return _this;
    }
    TypeArray.prototype._render = function (r) {
        var _this = this;
        var meta = {
            el: document.createElement('div'),
            items: document.createElement('div'),
            button: document.createElement('button'),
            members: {}
        };
        meta.button.innerHTML = 'Добавить';
        meta.button.addEventListener('click', function () {
            _this.addItem();
        });
        meta.el.appendChild(meta.items);
        meta.el.appendChild(meta.button);
        meta.el.classList.add('value');
        meta.el.classList.add('value-array');
        return meta;
    };
    TypeArray.prototype.addItem = function () {
        var item = new ArrayItem(this);
        this.items.push(item);
        this.meta.items.appendChild(item.el);
    };
    TypeArray.prototype.reset = function () {
        this.items = [];
        this.meta.items.innerHTML = '';
    };
    return TypeArray;
}(TypeContainer));
exports.TypeArray = TypeArray;
var ObjectMember = /** @class */ (function (_super) {
    __extends(ObjectMember, _super);
    function ObjectMember(container, key, member) {
        var _this = _super.call(this, container) || this;
        _this.key = key;
        _this.member = member;
        return _this;
    }
    ObjectMember.prototype.setValue = function (value) {
        this.container.value[this.key] = value;
    };
    return ObjectMember;
}(Member));
exports.ObjectMember = ObjectMember;
var ArrayItem = /** @class */ (function (_super) {
    __extends(ArrayItem, _super);
    function ArrayItem(container) {
        return _super.call(this, container) || this;
    }
    Object.defineProperty(ArrayItem.prototype, "key", {
        get: function () {
            return this.container.items.indexOf(this);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ArrayItem.prototype, "member", {
        get: function () {
            return this.container.type.each;
        },
        enumerable: true,
        configurable: true
    });
    ArrayItem.prototype.setValue = function (value) {
        this.container.value[this.key] = value;
    };
    return ArrayItem;
}(Member));
exports.ArrayItem = ArrayItem;
var TypeString = /** @class */ (function (_super) {
    __extends(TypeString, _super);
    function TypeString(type, holdsIn) {
        if (holdsIn === void 0) { holdsIn = null; }
        var _this = _super.call(this, type, holdsIn) || this;
        _this.value = '';
        return _this;
    }
    TypeString.prototype._render = function (r) {
        var _this = this;
        var el = document.createElement('input');
        el.type = 'text';
        el.classList.add('value');
        el.classList.add('value-string');
        el.addEventListener('blur', function () {
            _this.setValue(el.value);
        });
        return el;
    };
    TypeString.prototype.reset = function () {
        this.setValue('');
        this.el.value = '';
        this.sync();
    };
    return TypeString;
}(Type));
exports.TypeString = TypeString;
var TypeNumber = /** @class */ (function (_super) {
    __extends(TypeNumber, _super);
    function TypeNumber(type, holdsIn) {
        if (holdsIn === void 0) { holdsIn = null; }
        var _this = _super.call(this, type, holdsIn) || this;
        _this.value = 0;
        return _this;
    }
    TypeNumber.prototype._render = function (r) {
        var _this = this;
        var el = document.createElement('input');
        el.type = 'number';
        el.classList.add('value');
        el.classList.add('value-string');
        el.addEventListener('blur', function () {
            _this.setValue(el.value);
        });
        return el;
    };
    TypeNumber.prototype.reset = function () {
        this.el.value = '';
    };
    return TypeNumber;
}(Type));
exports.TypeNumber = TypeNumber;
var TypeBoolean = /** @class */ (function (_super) {
    __extends(TypeBoolean, _super);
    function TypeBoolean(type, holdsIn) {
        if (holdsIn === void 0) { holdsIn = null; }
        var _this = _super.call(this, type, holdsIn) || this;
        _this.value = false;
        return _this;
    }
    TypeBoolean.prototype._render = function (r) {
        var _this = this;
        var el = document.createElement('select');
        el.innerHTML = "<option value='true'>TRUE</option><option value='false'>FALSE</option>";
        el.classList.add('value');
        el.classList.add('value-boolean');
        el.addEventListener('blur', function () {
            _this.setValue(el.value === 'true');
        });
        return el;
    };
    TypeBoolean.prototype.reset = function () {
        this.el.value = '';
    };
    return TypeBoolean;
}(Type));
exports.TypeBoolean = TypeBoolean;
var TypeNull = /** @class */ (function (_super) {
    __extends(TypeNull, _super);
    function TypeNull(type, holdsIn) {
        if (holdsIn === void 0) { holdsIn = null; }
        var _this = _super.call(this, type, holdsIn) || this;
        _this.value = null;
        return _this;
    }
    TypeNull.prototype._render = function (r) {
        var el = document.createElement('span');
        el.classList.add('value');
        el.classList.add('value-null');
        el.innerHTML = 'null';
        return el;
    };
    TypeNull.prototype.reset = function () { };
    return TypeNull;
}(Type));
exports.TypeNull = TypeNull;
