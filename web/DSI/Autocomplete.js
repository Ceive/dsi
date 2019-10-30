"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Type_1 = require("./Type");
var ViewModel_1 = require("./ViewModel");
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
        _super.call(this);
        /** @var  string[] */
        this.locations = [];
        if (locations)
            this.setLocation(locations);
        this.setMembers(members);
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
        _super.call(this);
        this.wrapped = [];
        this.path = path;
        this._class = _class;
        this.wrapped = objects;
        this.parent = parent;
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
                    // Первый вариант с типом TypeObject, то есть другие не беруться во внимание , это нужно решить - так быть не должно
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
        _super.apply(this, arguments);
        this.history = [];
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
        _super.call(this);
        this.members = {};
        this.manager = manager;
        this.type = type;
        this.holdsIn = holdsIn;
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
        _super.call(this);
        this.key = key;
        this.member = member;
        this.autocomplete = autocomplete;
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
        var _loop_1 = function(type) {
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
