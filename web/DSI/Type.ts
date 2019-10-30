
export abstract class Type{

	name: string;

	abstract check(value): boolean;

}

export class TypeAny extends Type{
	name = 'any';
	check(value): boolean {
		return true;
	}
}
export class TypeNull extends Type{
	name = 'null';
	check(value): boolean {
		return value === null;
	}

}
export class TypeScalar extends Type{
	name = 'scalar';
	check(value): boolean {
		let t = typeof value;
		return (['string','number','boolean','null']).indexOf(t)>=0;
	}

}
export class TypeString extends Type{
	name = 'string';
	check(value){
		return typeof value === 'string';
	}

}
export class TypeNumber extends Type{
	name = 'number';
	check(value){
		return value instanceof Number;
	}

}
export class TypeBoolean extends Type{
	name = 'boolean';
	check(value){
		return typeof value === 'boolean';
	}

}
export class TypeIterable extends Type{
	name = 'iterable';
	check(value): boolean {
		return value instanceof Array || value instanceof Object;
	}

}
export class TypeObject extends Type{

	name = 'object';

	_class: any;

	members: {[key: string]: Member} = {};


	getMembers(): {[key: string]: Member}{
		return this.members;
	}

	setMembers(members: {[key: string]: Member}, merge:boolean = false){
		if(!merge){
			this.members = {};
		}
		for(let key of Object.getOwnPropertyNames(members)){
			this.members[key] = members[key];
		}
		return this;
	}

	check(value){
		if( typeof value !== 'object' ){
			return false;
		}
		if( value instanceof Array ){
			return false;
		}
		if(this._class && !(value instanceof this._class)){
			return false;
		}
		for(let key of Object.getOwnPropertyNames(this.members)){
			let member = this.members[key];
			if(!member.check(value[key])){
				return false;
			}

		}
		return true;
	}

}

export class TypeArray extends Type{
	name = 'array';
	each: Member;

	constructor(each:Member){
		super();

		this.each = each;

	}

	check(value): boolean {
		if(!(value instanceof Array)){
			return false;
		}
		for(let itm of value){
			if(!this.each.check(itm)){
				return false;
			}
		}
		return true;
	}

}
export class TypeFunction extends Type{
	name = 'function';
	check(value){
		return typeof value === 'function';
	}

}
export class Member{

	types: Type[] = [];

	constructor(types: Type[] = []){
		this.types = types;
	}

	check(value){
		let has = false;
		for(let type of this.types){
			if(type.check(value)){
				has = true;
				break;
			}
		}
		return has;
	}

	isNullable(){

	}

}
export class Locator{

	set(container, path, value){

		if(typeof path === 'string'){
			path = path.split('.');
		}
		let chunk = path.shift();
		let segment = null;

		if(path.length){
			if(container.hasOwnProperty(chunk)){
				segment = container[chunk];
			}
			if(!segment){
				throw new Error('Container is not defined');
			}
			this.set(segment,path, value);
		}else{
			container[chunk] = value;
		}
	}

	get(container, path){

		if(typeof path === 'string'){
			path = path.split('.');
		}
		let chunk = path.shift();
		let segment = null;

		if(path.length){
			if(container.hasOwnProperty(chunk)){
				segment = container[chunk];
			}
			if(!segment){
				return undefined;
			}
			this.get(segment,path);
		}else{
			segment = container[chunk];
		}
		return segment;
	}

}