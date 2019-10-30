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
define("Type", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Type = (function () {
        function Type() {
        }
        return Type;
    }());
    exports.Type = Type;
    var TypeAny = (function (_super) {
        __extends(TypeAny, _super);
        function TypeAny() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = 'any';
            return _this;
        }
        TypeAny.prototype.check = function (value) {
            return true;
        };
        return TypeAny;
    }(Type));
    exports.TypeAny = TypeAny;
    var TypeNull = (function (_super) {
        __extends(TypeNull, _super);
        function TypeNull() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = 'null';
            return _this;
        }
        TypeNull.prototype.check = function (value) {
            return value === null;
        };
        return TypeNull;
    }(Type));
    exports.TypeNull = TypeNull;
    var TypeScalar = (function (_super) {
        __extends(TypeScalar, _super);
        function TypeScalar() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = 'scalar';
            return _this;
        }
        TypeScalar.prototype.check = function (value) {
            var t = typeof value;
            return (['string', 'number', 'boolean', 'null']).indexOf(t) >= 0;
        };
        return TypeScalar;
    }(Type));
    exports.TypeScalar = TypeScalar;
    var TypeString = (function (_super) {
        __extends(TypeString, _super);
        function TypeString() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = 'string';
            return _this;
        }
        TypeString.prototype.check = function (value) {
            return typeof value === 'string';
        };
        return TypeString;
    }(Type));
    exports.TypeString = TypeString;
    var TypeNumber = (function (_super) {
        __extends(TypeNumber, _super);
        function TypeNumber() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = 'number';
            return _this;
        }
        TypeNumber.prototype.check = function (value) {
            return value instanceof Number;
        };
        return TypeNumber;
    }(Type));
    exports.TypeNumber = TypeNumber;
    var TypeBoolean = (function (_super) {
        __extends(TypeBoolean, _super);
        function TypeBoolean() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = 'boolean';
            return _this;
        }
        TypeBoolean.prototype.check = function (value) {
            return typeof value === 'boolean';
        };
        return TypeBoolean;
    }(Type));
    exports.TypeBoolean = TypeBoolean;
    var TypeIterable = (function (_super) {
        __extends(TypeIterable, _super);
        function TypeIterable() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = 'iterable';
            return _this;
        }
        TypeIterable.prototype.check = function (value) {
            return value instanceof Array || value instanceof Object;
        };
        return TypeIterable;
    }(Type));
    exports.TypeIterable = TypeIterable;
    var TypeObject = (function (_super) {
        __extends(TypeObject, _super);
        function TypeObject() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = 'object';
            _this.members = {};
            return _this;
        }
        TypeObject.prototype.getMembers = function () {
            return this.members;
        };
        TypeObject.prototype.setMembers = function (members, merge) {
            if (merge === void 0) { merge = false; }
            if (!merge) {
                this.members = {};
            }
            for (var _i = 0, _a = Object.getOwnPropertyNames(members); _i < _a.length; _i++) {
                var key = _a[_i];
                this.members[key] = members[key];
            }
            return this;
        };
        TypeObject.prototype.check = function (value) {
            if (typeof value !== 'object') {
                return false;
            }
            if (value instanceof Array) {
                return false;
            }
            if (this._class && !(value instanceof this._class)) {
                return false;
            }
            for (var _i = 0, _a = Object.getOwnPropertyNames(this.members); _i < _a.length; _i++) {
                var key = _a[_i];
                var member = this.members[key];
                if (!member.check(value[key])) {
                    return false;
                }
            }
            return true;
        };
        return TypeObject;
    }(Type));
    exports.TypeObject = TypeObject;
    var TypeArray = (function (_super) {
        __extends(TypeArray, _super);
        function TypeArray(each) {
            var _this = _super.call(this) || this;
            _this.name = 'array';
            _this.each = each;
            return _this;
        }
        TypeArray.prototype.check = function (value) {
            if (!(value instanceof Array)) {
                return false;
            }
            for (var _i = 0, value_1 = value; _i < value_1.length; _i++) {
                var itm = value_1[_i];
                if (!this.each.check(itm)) {
                    return false;
                }
            }
            return true;
        };
        return TypeArray;
    }(Type));
    exports.TypeArray = TypeArray;
    var TypeFunction = (function (_super) {
        __extends(TypeFunction, _super);
        function TypeFunction() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.name = 'function';
            return _this;
        }
        TypeFunction.prototype.check = function (value) {
            return typeof value === 'function';
        };
        return TypeFunction;
    }(Type));
    exports.TypeFunction = TypeFunction;
    var Member = (function () {
        function Member(types) {
            if (types === void 0) { types = []; }
            this.types = [];
            this.types = types;
        }
        Member.prototype.check = function (value) {
            var has = false;
            for (var _i = 0, _a = this.types; _i < _a.length; _i++) {
                var type = _a[_i];
                if (type.check(value)) {
                    has = true;
                    break;
                }
            }
            return has;
        };
        Member.prototype.isNullable = function () {
        };
        return Member;
    }());
    exports.Member = Member;
    var Locator = (function () {
        function Locator() {
        }
        Locator.prototype.set = function (container, path, value) {
            if (typeof path === 'string') {
                path = path.split('.');
            }
            var chunk = path.shift();
            var segment = null;
            if (path.length) {
                if (container.hasOwnProperty(chunk)) {
                    segment = container[chunk];
                }
                if (!segment) {
                    throw new Error('Container is not defined');
                }
                this.set(segment, path, value);
            }
            else {
                container[chunk] = value;
            }
        };
        Locator.prototype.get = function (container, path) {
            if (typeof path === 'string') {
                path = path.split('.');
            }
            var chunk = path.shift();
            var segment = null;
            if (path.length) {
                if (container.hasOwnProperty(chunk)) {
                    segment = container[chunk];
                }
                if (!segment) {
                    return undefined;
                }
                this.get(segment, path);
            }
            else {
                segment = container[chunk];
            }
            return segment;
        };
        return Locator;
    }());
    exports.Locator = Locator;
});
define("ViewModel", ["require", "exports", "Type"], function (require, exports, MType) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var DEFAULT_EL_KEY = 'el';
    var ViewModel = (function () {
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
    var Type = (function (_super) {
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
    var Member = (function (_super) {
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
    var TypeContainer = (function (_super) {
        __extends(TypeContainer, _super);
        function TypeContainer() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TypeContainer;
    }(Type));
    exports.TypeContainer = TypeContainer;
    var TypeObject = (function (_super) {
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
    var TypeArray = (function (_super) {
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
    var ObjectMember = (function (_super) {
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
    var ArrayItem = (function (_super) {
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
    var TypeString = (function (_super) {
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
    var TypeNumber = (function (_super) {
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
    var TypeBoolean = (function (_super) {
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
    var TypeNull = (function (_super) {
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
});
define("Autocomplete", ["require", "exports", "Type", "ViewModel"], function (require, exports, Type_1, ViewModel_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ObjectManager = (function () {
        function ObjectManager() {
        }
        ObjectManager.prototype.getByLocation = function (nextPath) {
            return [];
        };
        return ObjectManager;
    }());
    exports.ObjectManager = ObjectManager;
    var ObjectInWay = (function (_super) {
        __extends(ObjectInWay, _super);
        function ObjectInWay(locations, members) {
            if (locations === void 0) { locations = null; }
            if (members === void 0) { members = {}; }
            var _this = _super.call(this) || this;
            _this.locations = [];
            if (locations)
                _this.setLocation(locations);
            _this.setMembers(members);
            return _this;
        }
        ObjectInWay.prototype.hasLocation = function (locations) {
            if (typeof location === 'string') {
                locations = [String(locations)];
            }
            for (var _i = 0, locations_1 = locations; _i < locations_1.length; _i++) {
                var loc = locations_1[_i];
                if (this.locations.indexOf(loc) < 0) {
                    return false;
                }
            }
            return true;
        };
        ObjectInWay.prototype.setLocation = function (locations, merge) {
            if (merge === void 0) { merge = false; }
            if (typeof location === 'string') {
                locations = [String(locations)];
            }
            this.locations = merge ? Array.prototype.concat.apply(this.locations, locations) : locations;
            return this;
        };
        return ObjectInWay;
    }(Type_1.TypeObject));
    exports.ObjectInWay = ObjectInWay;
    var ObjectNestable = (function (_super) {
        __extends(ObjectNestable, _super);
        function ObjectNestable(path, _class, objects, parent) {
            var _this = _super.call(this) || this;
            _this.wrapped = [];
            _this.path = path;
            _this._class = _class;
            _this.wrapped = objects;
            _this.parent = parent;
            return _this;
        }
        ObjectNestable.prototype.getMembers = function () {
            var members = {};
            for (var _i = 0, _a = this.wrapped; _i < _a.length; _i++) {
                var o = _a[_i];
                var _members = o.getMembers();
                for (var _b = 0, _c = Object.getOwnPropertyNames(_members); _b < _c.length; _b++) {
                    var key = _c[_b];
                    members[key] = _members[key];
                }
            }
            return members;
        };
        ObjectNestable.prototype.inter = function (path, type) {
            var members = this.getMembers();
            if (typeof path === 'string') {
                path = path.split('.');
            }
            var chunk = path.shift();
            var _type = null;
            var nextPath = null;
            if (members.hasOwnProperty(chunk)) {
                var member = members[chunk];
                if (!path.length && type !== undefined) {
                    if (typeof type === 'number') {
                        type = member.types[type];
                    }
                    if (type instanceof TypeReference) {
                        type = _type.getReferencedType();
                    }
                    if (type instanceof Type_1.TypeObject) {
                        nextPath = this.path.concat(chunk);
                        _type = this._makeNested(type, this.objectManager.getByLocation(nextPath), nextPath);
                    }
                }
                else {
                    for (var _i = 0, _a = member.types; _i < _a.length; _i++) {
                        _type = _a[_i];
                        if (_type instanceof TypeReference) {
                            _type = _type.getReferencedType();
                        }
                        if (_type instanceof Type_1.TypeObject) {
                            nextPath = this.path.concat(chunk);
                            _type = this._makeNested(_type, this.objectManager.getByLocation(nextPath), nextPath);
                        }
                    }
                    if (_type instanceof ObjectNestable && path.length) {
                        return _type.inter(path, type);
                    }
                }
            }
            return _type;
        };
        ObjectNestable.prototype._makeNested = function (type, additionalObjects, path) {
            var t = new ObjectNestable(path, type._class, Array.prototype.concat.apply([type], additionalObjects), this);
            t.objectManager = this.objectManager;
            return t;
        };
        return ObjectNestable;
    }(Type_1.TypeObject));
    exports.ObjectNestable = ObjectNestable;
    var TypeReference = (function () {
        function TypeReference() {
        }
        TypeReference.prototype.getReferencedType = function () {
        };
        return TypeReference;
    }());
    exports.TypeReference = TypeReference;
    var AutocompleteReference = (function () {
        function AutocompleteReference(reference) {
            this.reference = reference;
        }
        return AutocompleteReference;
    }());
    exports.AutocompleteReference = AutocompleteReference;
    var AutocompleteManager = (function (_super) {
        __extends(AutocompleteManager, _super);
        function AutocompleteManager() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.history = [];
            return _this;
        }
        AutocompleteManager.prototype.setFrame = function (autocomplete) {
            var o = this.getHistoryByAutocomplete(autocomplete);
            if (!o) {
                o = {
                    path: autocomplete.getPath(false),
                    autocomplete: autocomplete,
                    el: autocomplete.el,
                };
            }
            this.history.push(o);
            this.sync();
        };
        AutocompleteManager.prototype.sync = function () {
            this.render();
            var to = this.history[this.history.length - 1] || null;
            if (this.current !== to) {
                if (this.current)
                    this.meta.container.removeChild(this.current.el);
                this.current = to;
                this.meta.container.appendChild(to.el);
                this.applyPath(this.current.path, this.meta.breadcrumbPath);
            }
        };
        AutocompleteManager.prototype.back = function () {
            if (this.history.length > 1) {
                this.history.pop();
                this.sync();
            }
        };
        AutocompleteManager.prototype._render = function (registry) {
            var _this = this;
            var el = document.createElement('div');
            el.classList.add('autocomplete-frame');
            var container = document.createElement('div');
            container.classList.add('container');
            var breadcrumbs = document.createElement('div');
            breadcrumbs.classList.add('breadcrumbs');
            var bcBack = document.createElement('button');
            bcBack.classList.add('breadcrumbs-back');
            bcBack.innerHTML = '<';
            bcBack.addEventListener('click', function () {
                _this.back();
            });
            var bcPath = document.createElement('div');
            bcPath.classList.add('breadcrumbs-path');
            breadcrumbs.appendChild(bcBack);
            breadcrumbs.appendChild(bcPath);
            var selected = document.createElement('div');
            selected.classList.add('selected');
            selected.style.display = 'none';
            selected.innerHTML = 'Результат: <span class="selected-path"></span>';
            el.appendChild(breadcrumbs);
            el.appendChild(container);
            el.appendChild(selected);
            return {
                el: el,
                container: container,
                breadcrumb: breadcrumbs,
                breadcrumbBack: bcBack,
                breadcrumbPath: bcPath,
                selected: selected,
                selectedPath: selected.querySelector('.selected-path'),
            };
        };
        AutocompleteManager.prototype.getHistoryByAutocomplete = function (a) {
            for (var i = 0; i < this.history.length; i++) {
                var o = this.history[i];
                if (o.autocomplete === a) {
                    return o;
                }
            }
            return null;
        };
        AutocompleteManager.prototype.select = function (autocompleteMember) {
            this.selectedPath = autocompleteMember.getPath(true);
            this.meta.selected.style.display = 'block';
            this.applyPath(this.selectedPath, this.meta.selectedPath);
        };
        AutocompleteManager.prototype.applyPath = function (path, el) {
            el.innerHTML = '';
            var chunks = [];
            var prev = null;
            for (var _i = 0, path_1 = path; _i < path_1.length; _i++) {
                var segment = path_1[_i];
                if (prev) {
                    var separator = document.createElement('span');
                    separator.classList.add('path-separator');
                    separator.innerHTML = ' > ';
                    el.appendChild(separator);
                }
                var chunk = document.createElement('span');
                chunk.classList.add('path-segment');
                chunk.innerHTML = segment;
                chunks.push(chunk);
                el.appendChild(chunk);
                prev = segment;
            }
        };
        return AutocompleteManager;
    }(ViewModel_1.ViewModel));
    exports.AutocompleteManager = AutocompleteManager;
    var Autocomplete = (function (_super) {
        __extends(Autocomplete, _super);
        function Autocomplete(manager, type, holdsIn) {
            if (holdsIn === void 0) { holdsIn = null; }
            var _this = _super.call(this) || this;
            _this.members = {};
            _this.manager = manager;
            _this.type = type;
            _this.holdsIn = holdsIn;
            return _this;
        }
        Autocomplete.prototype.getRoot = function () {
            if (!this.holdsIn) {
                return this;
            }
            else {
                return this.holdsIn.getRoot();
            }
        };
        Autocomplete.prototype.getPath = function (asArray) {
            if (asArray === void 0) { asArray = false; }
            var p = [];
            if (this.holdsIn) {
                p = this.holdsIn.getPath(true);
            }
            if (!asArray) {
                p.join('.');
            }
            return p;
        };
        Autocomplete.prototype._render = function (registry) {
            var el = document.createElement('div');
            el.classList.add('autocomplete-object');
            var membersEl = document.createElement('div');
            membersEl.classList.add('autocomplete-object-members');
            el.appendChild(membersEl);
            var members = this.type.getMembers();
            for (var _i = 0, _a = Object.getOwnPropertyNames(members); _i < _a.length; _i++) {
                var key = _a[_i];
                var member = members[key];
                this.members[key] = new AutocompleteMember(this, key, member);
                membersEl.appendChild(this.members[key].el);
            }
            return {
                el: el,
                members: membersEl
            };
        };
        Autocomplete.prototype.interTo = function (key, type) {
            var object = this.type.inter(key, type);
            var autocomplete = new Autocomplete(this.manager, object, this.members[key]);
            this.manager.setFrame(autocomplete);
        };
        return Autocomplete;
    }(ViewModel_1.ViewModel));
    exports.Autocomplete = Autocomplete;
    var AutocompleteMember = (function (_super) {
        __extends(AutocompleteMember, _super);
        function AutocompleteMember(autocomplete, key, member) {
            var _this = _super.call(this) || this;
            _this.key = key;
            _this.member = member;
            _this.autocomplete = autocomplete;
            return _this;
        }
        AutocompleteMember.prototype._render = function (registry) {
            var _this = this;
            var el = document.createElement('div');
            el.classList.add('autocomplete-member');
            var key = document.createElement('div');
            key.classList.add('autocomplete-member-key');
            key.addEventListener('click', function () {
                _this.select();
            });
            el.appendChild(key);
            var types = document.createElement('div');
            types.classList.add('autocomplete-member-types');
            el.appendChild(types);
            return {
                el: el,
                key: key,
                types: types,
            };
        };
        AutocompleteMember.prototype.afterRender = function (el, meta) {
            this.apply();
        };
        AutocompleteMember.prototype.apply = function () {
            var _this = this;
            this.meta.key.innerHTML = this.key;
            this.meta.types.innerHTML = '';
            var _loop_1 = function (type) {
                var el = document.createElement('span');
                el.classList.add('type');
                el.classList.add('type-' + type.name);
                el.innerHTML = type.name;
                this_1.meta.types.appendChild(el);
                if (type instanceof Type_1.TypeObject) {
                    el.addEventListener('click', function () {
                        _this.inter(type);
                    });
                }
            };
            var this_1 = this;
            for (var _i = 0, _a = this.member.types; _i < _a.length; _i++) {
                var type = _a[_i];
                _loop_1(type);
            }
        };
        AutocompleteMember.prototype.inter = function (type) {
            this.autocomplete.interTo(this.key, type);
        };
        AutocompleteMember.prototype.select = function () {
            this.autocomplete.manager.select(this);
        };
        AutocompleteMember.prototype.getRoot = function () {
            return this.autocomplete.getRoot();
        };
        AutocompleteMember.prototype.getPath = function (asArray) {
            if (asArray === void 0) { asArray = false; }
            var p = [];
            if (!this.autocomplete) {
                p.push(this.key);
            }
            else {
                p = this.autocomplete.getPath(true).concat([this.key]);
            }
            if (!asArray) {
                p.join('.');
            }
            return p;
        };
        return AutocompleteMember;
    }(ViewModel_1.ViewModel));
    exports.AutocompleteMember = AutocompleteMember;
});
define("Template", ["require", "exports", "ViewModel", "Autocomplete"], function (require, exports, ViewModel_2, Autocomplete_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Keyboard = (function () {
        function Keyboard(el) {
            this.el = el;
            var that = this;
            el.addEventListener('keydown', function (e) {
                var key = e.which || e.keyCode;
                return that.onKeyDown(this, e, key);
            });
            el.addEventListener('keypress', function (e) {
                var key = e.which || e.keyCode;
                return that.onKeyPress(this, e, key);
            });
            el.addEventListener('keyup', function (e) {
                var key = e.which || e.keyCode;
                return that.onKeyUp(this, e, key);
            });
        }
        Keyboard.prototype.onKeyDown = function (target, e, key) {
        };
        Keyboard.prototype.onKeyPress = function (target, e, key) {
        };
        Keyboard.prototype.onKeyUp = function (target, e, key) {
        };
        return Keyboard;
    }());
    var TemplateEngine = (function (_super) {
        __extends(TemplateEngine, _super);
        function TemplateEngine() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.currentPosition = 0;
            _this.chunks = [];
            return _this;
        }
        TemplateEngine.prototype._render = function (registry) {
            var el = document.createElement('div');
            var area = document.createElement('article');
            area.classList.add('template-area');
            var ac = document.createElement('div');
            ac.classList.add('template-autocomplete');
            ac.style.display = 'none';
            area.contentEditable = "true";
            var that = this;
            area.addEventListener('keydown', function (e) {
                return that.onKeyDown(this, e.target, e);
            });
            area.addEventListener('keypress', function (e) {
                return that.onKeyPress(this, e.target, e);
            });
            area.addEventListener('keyup', function (e) {
                return that.onKeyUp(this, e.target, e);
            });
            el.appendChild(area);
            el.appendChild(ac);
            return {
                el: el,
                area: area,
                autocompleteWrapper: ac
            };
        };
        TemplateEngine.prototype.decomposite = function (el, position) {
            var parent = el.parentNode;
            var content;
            if (el.nodeType == Node.TEXT_NODE) {
                content = el.nodeValue;
                var textBefore = content.substr(0, position), textAfter = content.substr(position);
                var elBefore = document.createElement('div');
                var cNode = void 0;
                if (textBefore) {
                    var nodeBefore = document.createTextNode(textBefore);
                    elBefore.appendChild(nodeBefore);
                }
                else {
                    elBefore.appendChild(document.createElement('br'));
                }
                var elAfter = document.createElement('div');
                if (textAfter) {
                    var nodeAfter = document.createTextNode(textAfter || " ");
                    elAfter.appendChild(nodeAfter);
                    cNode = nodeAfter;
                }
                else {
                    elAfter.appendChild(document.createElement('br'));
                    cNode = elAfter;
                }
                this._replace(el, [elBefore, elAfter]);
                elAfter.focus();
                this.currentNode = cNode;
                this.currentOffset = 0;
            }
            else {
                content = el.innerHTML;
            }
        };
        TemplateEngine.prototype._replace = function (el, replacement) {
            var parent = el.parentNode;
            for (var _i = 0, replacement_1 = replacement; _i < replacement_1.length; _i++) {
                var item = replacement_1[_i];
                parent.insertBefore(item, el);
            }
            parent.removeChild(el);
            while (parent !== this.meta.area) {
                el = parent;
                parent = el.parentNode;
                replacement = [];
                for (var _a = 0, _b = el.childNodes; _a < _b.length; _a++) {
                    var item = _b[_a];
                    replacement.push(item);
                }
                for (var _c = 0, replacement_2 = replacement; _c < replacement_2.length; _c++) {
                    var item = replacement_2[_c];
                    parent.insertBefore(item, el);
                }
                parent.removeChild(el);
            }
        };
        TemplateEngine.prototype.onKeyDown = function (element, target, event) {
            this.currentSelection = getSelection();
            this.currentNode = this.currentSelection.focusNode;
            this.currentOffset = this.currentSelection.focusOffset;
            this.currentPosition = this.getCaretPosition(this.meta.area);
            if (event.keyCode == 13) {
                if (event.altKey) {
                    var ac = this.getAutocomplete();
                }
                return false;
            }
        };
        TemplateEngine.prototype.onKeyPress = function (element, target, event) {
            if (event.keyCode == 13) {
            }
            else {
            }
        };
        TemplateEngine.prototype.onKeyUp = function (element, target, event) {
        };
        TemplateEngine.prototype.getAutocomplete = function () {
            if (!this.autocomplete) {
                var manager = new Autocomplete_1.AutocompleteManager();
                manager.setFrame(new Autocomplete_1.Autocomplete(manager, this.context));
                this.autocomplete = manager;
                this.meta.autocompleteWrapper.appendChild(this.autocomplete.el);
                var _this_1 = this;
                var _oldSelect_1 = manager.select;
                manager.select = function (autocompleteMember) {
                    _oldSelect_1.call(this, autocompleteMember);
                    _this_1.insertPlaceholder(this.selectedPath);
                    _this_1.meta.autocompleteWrapper.style.display = 'none';
                };
            }
            this.meta.autocompleteWrapper.style.display = 'block';
            return this.autocomplete;
        };
        TemplateEngine.prototype.makePlaceholderEl = function (path) {
            var elPlaceholder = document.createElement('span');
            elPlaceholder.classList.add('path-segment');
            elPlaceholder.contentEditable = 'false';
            elPlaceholder.innerHTML = path.join('.');
            return elPlaceholder;
        };
        TemplateEngine.prototype.insertPlaceholder = function (path) {
            var chunks = this.chunks;
            var el = this.currentNode;
            var pos = this.currentOffset;
            var parent = el.parentNode;
            if (el.nodeType === Node.TEXT_NODE) {
                var text = el.nodeValue;
                var textBefore = text.substr(0, pos), textAfter = text.substr(pos);
                var nodeBefore = document.createTextNode(textBefore);
                var nodeAfter = document.createTextNode(textAfter);
                var elPlaceholder = this.makePlaceholderEl(path);
                parent.insertBefore(nodeBefore, el);
                parent.insertBefore(elPlaceholder, el);
                parent.insertBefore(nodeAfter, el);
                parent.removeChild(el);
            }
            else {
                var brs = el.querySelectorAll('br');
                if (brs.length) {
                    for (var _i = 0, brs_1 = brs; _i < brs_1.length; _i++) {
                        var br = brs_1[_i];
                        br.parentNode.removeChild(br);
                    }
                    var elPlaceholder = this.makePlaceholderEl(path);
                    el.appendChild(elPlaceholder);
                }
            }
        };
        TemplateEngine.prototype.getCaretPosition = function (editableDiv) {
            var caretPos = 0, range;
            if (this.currentSelection) {
                if (this.currentSelection.rangeCount) {
                    range = this.currentSelection.getRangeAt(0);
                    if (range.commonAncestorContainer.parentNode == editableDiv) {
                        caretPos = range.endOffset;
                    }
                }
            }
            return caretPos;
        };
        Object.defineProperty(TemplateEngine.prototype, "tmp", {
            get: function () {
                if (!this._tmpEl) {
                    this._tmpEl = document.createElement('div');
                }
                return this._tmpEl;
            },
            enumerable: true,
            configurable: true
        });
        TemplateEngine.prototype.decodeHtmlEntity = function (str) {
            var _this = this;
            str = str.replace(/&nbsp;/g, function (match, dec) {
                _this.tmp.innerHTML = match;
                return ' ';
            });
            return str;
        };
        TemplateEngine.prototype.encodeHtmlEntity = function (str) {
            return str;
        };
        return TemplateEngine;
    }(ViewModel_2.ViewModel));
    exports.TemplateEngine = TemplateEngine;
    var Placeholder = (function () {
        function Placeholder(reference) {
            this.reference = null;
            this.reference = reference;
        }
        return Placeholder;
    }());
});
define("main", ["require", "exports", "Type", "Type", "Type", "Type", "Type", "Type", "Type", "ViewModel", "Autocomplete", "Template"], function (require, exports, Types, Type_2, Type_3, Type_4, Type_5, Type_6, Type_7, Vm, Autocomplete_2, Template_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dsi = new Types.TypeObject();
    dsi.setMembers({
        car: new Type_2.Member([
            (new Type_3.TypeObject())
                .setMembers({
                wheels: new Type_2.Member([new Type_7.TypeNumber()]),
                doors: new Type_2.Member([new Type_7.TypeNumber()]),
                color: new Type_2.Member([new Type_4.TypeString()]),
                engine: new Type_2.Member([
                    (new Type_3.TypeObject())
                        .setMembers({
                        cylinders: new Type_2.Member([new Type_7.TypeNumber()]),
                        fuel: new Type_2.Member([new Type_4.TypeString()]),
                        volume: new Type_2.Member([new Type_4.TypeString()]),
                        oil: new Type_2.Member([new Type_4.TypeString()])
                    })
                ]),
                passengersMaxCount: new Type_2.Member([new Type_7.TypeNumber()]),
                passengers: new Type_2.Member([new Type_6.TypeArray(new Type_2.Member([
                        (new Type_3.TypeObject())
                            .setMembers({
                            name: new Type_2.Member([new Type_4.TypeString()]),
                            role: new Type_2.Member([new Type_4.TypeString()]),
                        })
                    ])), new Type_5.TypeNull]),
            })
        ])
    });
    var structure = new Vm.TypeObject(dsi);
    document.querySelector('#uisi').appendChild(structure.el);
    document.querySelector('#getStructureButton').addEventListener('click', function () {
        var str = JSON.stringify(structure.value, null, 2);
        console.log(str);
        document.querySelector('#view-structure').innerHTML = str;
    });
    window['_Structure'] = structure;
    var manager = new Autocomplete_2.AutocompleteManager();
    document.querySelector('#autocomplete').appendChild(manager.el);
    var type = new Autocomplete_2.ObjectNestable([], dsi._class, [dsi], null);
    type.objectManager = new Autocomplete_2.ObjectManager();
    manager.setFrame(new Autocomplete_2.Autocomplete(manager, type));
    window['_Autocomplete'] = manager;
    var te = new Template_1.TemplateEngine;
    te.context = type;
    document.querySelector('#template-engine').appendChild(te.el);
    window['_Template'] = te;
});
//# sourceMappingURL=ceive.dsi.js.map