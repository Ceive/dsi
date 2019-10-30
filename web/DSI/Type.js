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
var Type = /** @class */ (function () {
    function Type() {
    }
    return Type;
}());
exports.Type = Type;
var TypeAny = /** @class */ (function (_super) {
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
var TypeNull = /** @class */ (function (_super) {
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
var TypeScalar = /** @class */ (function (_super) {
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
var TypeString = /** @class */ (function (_super) {
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
var TypeNumber = /** @class */ (function (_super) {
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
var TypeBoolean = /** @class */ (function (_super) {
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
var TypeIterable = /** @class */ (function (_super) {
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
var TypeObject = /** @class */ (function (_super) {
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
var TypeArray = /** @class */ (function (_super) {
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
var TypeFunction = /** @class */ (function (_super) {
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
var Member = /** @class */ (function () {
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
var Locator = /** @class */ (function () {
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
