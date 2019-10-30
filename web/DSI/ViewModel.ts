import * as MType from "./Type";

const DEFAULT_EL_KEY = 'el';

export abstract class ViewModel{

	_el: Element;

	meta:any = {};

	render(){
		if(!this._el){

			this.meta = {};

			let meta = this._render(this.meta);
			if(!meta){
				this._el = this.meta[DEFAULT_EL_KEY];
			}else if(meta instanceof Element) {
				this._el = meta;
				this.meta[DEFAULT_EL_KEY] = meta;
			} else if( meta instanceof Object){
				this.meta = meta;
				this._el = this.meta[DEFAULT_EL_KEY];
			}
			this.afterRender(this.meta[DEFAULT_EL_KEY], this.meta);
		}
		return this._el;
	}

	get el(): Element|Node|any{
		return this.render();
	}

	abstract _render(registry: any);

	afterRender(el: any, meta: any) {

	}
}

export abstract class Type extends ViewModel{

	type: MType.Type;

	holdsIn: Member;

	_path: string = null;

	value: any;

	constructor(type: MType.Type, holdsIn: Member = null){
		super();
		this.type = type;
		this.holdsIn = holdsIn;
	}

	get path(){
		if(!this._path){
			if(this.holdsIn){
				this._path = this.holdsIn.path;
			}else{
				this._path = null;
			}
		}
		return this._path;
	}

	abstract reset();

	setValue(value){
		this.value = value;
		this.sync();
	}

	sync() {
		this.holdsIn.setValue(this.value);
	}

}
export abstract class Member extends ViewModel{

	key: string | number;

	container: TypeContainer;

	_path: string;

	typeElements: Array<Element|Node> = [];

	selected: number;

	typesMeta:any = {};

	abstract member;


	constructor(container: TypeContainer){
		super();
		this.container = container;
	}


	get path(){
		if(!this._path){
			if(this.container){
				this._path = this.container.path + '.' + this.key;
			}else{
				this._path = String(this.key);
			}
		}
		return this._path;
	}

	reset() {
		let selected = this.getSelectedType();
		if(selected){
			let el = this.getTypeMeta(this.selected).el;
			this.selected = undefined;
			this.meta.value.removeChild(el);
		}
	}

	_render(r) {
		let member = this.member;



		let meta = {
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
		let index = 0;
		for(let type of member.types){
			let typeEl = document.createElement('span');

			typeEl.classList.add('type');
			typeEl.classList.add('type-' + type.name);
			typeEl.innerHTML = type.name;
			typeEl.dataset['typeIndex'] = String(index);

			typeEl.addEventListener('click', (e)=>{
				let clickedEl:Element|any = e.target;
				this.select(Number(clickedEl.dataset['typeIndex']));
			});

			meta.types.appendChild(typeEl);
			this.typeElements.push(typeEl);

			index++;
		}
		meta.value.classList.add('member-value');

		return meta;
	}

	getSelectedType(){
		return this.member.types[this.selected];
	}

	select(index: number){
		let oldIndex = this.selected;
		if(this.selected !== index){
			this.selected = index;

			let meta = this.getTypeMeta(index);

			if(oldIndex !== undefined){
				let oldMeta = this.getTypeMeta(oldIndex);
				this.meta.value.removeChild(oldMeta.el);

			}
			this.meta.value.appendChild(meta.el);

			meta.el.focus();
			meta.type.sync();
		}else if(this.selected !== undefined){
			let meta = this.getTypeMeta(index);
			meta.type.reset();
			meta.type.sync();
			meta.el.focus();
		}

	}

	getTypeMeta(index: number){
		let _index = String(index);
		let mType = this.member.types[index];
		let type, typeEl;
		if(!this.typesMeta[_index]){
			switch(true){
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
	}

	abstract setValue(value);

}


export abstract class TypeContainer extends Type{

}


export class TypeObject extends TypeContainer{

	type: MType.TypeObject;

	members: { [key: string]: ObjectMember} = {};

	value: any = {};

	constructor(type: MType.TypeObject, holdsIn: Member = null){
		super(type, holdsIn);
	}

	_render(r) {

		let el = document.createElement('div');

		r.members = document.createElement('div');
		r.el = el;

		el.appendChild(r.members);
		el.classList.add('value');
		el.classList.add('value-object');

		for(let key of Object.getOwnPropertyNames(this.type.members)){
			let member = this.members[key] = new ObjectMember(this, key, this.type.members[key]);
			r.members.appendChild(member.el);
		}

		return r;
	}

	reset() {
		for(let k of Object.getOwnPropertyNames(this.members)){
			this.members[k].reset();
		}
		this.value = {};
	}

}
export class TypeArray extends TypeContainer{

	type: MType.TypeArray;

	items: ArrayItem[] = [];


	value = [];

	constructor(type: MType.TypeArray, holdsIn: Member = null){
		super(type, holdsIn);
	}

	_render(r) {
		let meta = {
			el: document.createElement('div'),
			items: document.createElement('div'),
			button: document.createElement('button'),
			members: {}
		};

		meta.button.innerHTML = 'Добавить';
		meta.button.addEventListener('click', () => {
			this.addItem();
		});


		meta.el.appendChild(meta.items);
		meta.el.appendChild(meta.button);
		meta.el.classList.add('value');
		meta.el.classList.add('value-array');

		return meta;
	}

	addItem(){
		let item = new ArrayItem(this);
		this.items.push(item);
		this.meta.items.appendChild(item.el);
	}

	reset() {
		this.items = [];
		this.meta.items.innerHTML = '';
	}

}

export class ObjectMember extends Member{

	key: string;

	container: TypeObject;

	member: MType.Member;

	constructor(container: TypeObject, key: string, member: MType.Member){
		super(container);
		this.key = key;
		this.member = member;
	}

	setValue(value){
		this.container.value[this.key] = value;
	}

}


export class ArrayItem extends Member{


	container: TypeArray;

	constructor(container: TypeArray){
		super(container);
	}

	get key(): number | string{
		return this.container.items.indexOf(this);
	}

	get member() {
		return this.container.type.each;
	}

	setValue(value){
		this.container.value[this.key] = value;
	}

}














export class TypeString extends Type{

	type: MType.TypeString;

	value = '';

	constructor(type: MType.TypeString, holdsIn: Member = null){
		super(type, holdsIn);
	}

	_render(r) {
		let el = document.createElement('input');
		el.type = 'text';
		el.classList.add('value');
		el.classList.add('value-string');
		el.addEventListener('blur', () => {
			this.setValue(el.value);
		});
		return el;
	}


	reset() {
		this.setValue('');
		this.el.value = '';
		this.sync();
	}

}
export class TypeNumber extends Type{

	type: MType.TypeString;

	value = 0;

	constructor(type: MType.TypeString, holdsIn: Member = null){
		super(type, holdsIn);
	}

	_render(r) {
		let el = document.createElement('input');
		el.type = 'number';
		el.classList.add('value');
		el.classList.add('value-string');
		el.addEventListener('blur', () => {
			this.setValue(el.value);
		});
		return el;
	}

	reset() {
		this.el.value = '';
	}

}
export class TypeBoolean extends Type{

	type: MType.TypeString;

	value = false;

	constructor(type: MType.TypeString, holdsIn: Member = null){
		super(type, holdsIn);
	}

	_render(r) {
		let el = document.createElement('select');
		el.innerHTML = "<option value='true'>TRUE</option><option value='false'>FALSE</option>";
		el.classList.add('value');
		el.classList.add('value-boolean');
		el.addEventListener('blur', () => {
			this.setValue(el.value === 'true');
		});
		return el;
	}

	reset() {
		this.el.value = '';
	}

}
export class TypeNull extends Type{


	type: MType.TypeString;

	value = null;

	constructor(type: MType.TypeString, holdsIn: Member = null){
		super(type, holdsIn);
	}

	_render(r) {
		let el = document.createElement('span');
		el.classList.add('value');
		el.classList.add('value-null');
		el.innerHTML = 'null';
		return el;
	}


	reset() {}

}
