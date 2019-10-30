

import {TypeObject, Member, Type} from "./Type";
import {ViewModel} from "./ViewModel";

export class ObjectManager{

	getByLocation(nextPath: Array<string>):ObjectInWay[] {
		return [];
	}
}

export class ObjectInWay extends TypeObject{

	/** @var  string[] */
	locations = [];

	constructor(locations = null, members:{[key: string]: Member} = {}){
		super();
		if(locations)this.setLocation(locations);
		this.setMembers(members);
	}

	hasLocation(locations: string|Array<string>){
		if(typeof location === 'string'){
			locations = [ String(locations) ];
		}
		for(let loc of locations){
			if( this.locations.indexOf( loc ) < 0){
				return false;
			}
		}
		return true;
	}

	setLocation(locations: string|Array<string>, merge:boolean = false){
		if(typeof location === 'string'){
			locations = [ String(locations) ];
		}
		this.locations = merge? Array.prototype.concat.apply(this.locations, locations): locations;
		return this;
	}
}

export class ObjectNestable extends TypeObject {


	path: string[];
	parent: ObjectNestable;
	wrapped: Array<TypeObject> = [];
	objectManager: ObjectManager;

	constructor(path: string[], _class: any, objects: TypeObject[] , parent:ObjectNestable){
		super();
		this.path = path;
		this._class = _class;
		this.wrapped = objects;
		this.parent = parent;

	}

	getMembers(): {[key: string]: Member}{
		let members: {[key: string]: Member} = {};
		for(let o of this.wrapped){
			let _members = o.getMembers();
			for(let key of Object.getOwnPropertyNames(_members)) {
				members[key] = _members[key];
			}
		}
		return members;
	}

	inter(path, type?: Type | number): ObjectNestable{
		let members = this.getMembers();
		if(typeof path === 'string'){
			path = path.split('.');
		}
		let chunk = path.shift();
		let _type = null;
		let nextPath = null;
		if(members.hasOwnProperty(chunk)){
			let member = members[chunk];

			if(!path.length && type!==undefined){
				if(typeof type === 'number'){
					type = member.types[type];
				}
				if(type instanceof TypeReference){
					type = _type.getReferencedType();
				}

				if(type instanceof TypeObject ){
					nextPath = this.path.concat(chunk);
					_type = this._makeNested(type, this.objectManager.getByLocation(nextPath), nextPath);
				}

			}else{
				for(_type of member.types){
					if(_type instanceof TypeReference){
						_type = _type.getReferencedType();
					}

					// Первый вариант с типом TypeObject, то есть другие не беруться во внимание , это нужно решить - так быть не должно
					if(_type instanceof TypeObject){
						nextPath = this.path.concat(chunk);
						_type = this._makeNested(_type, this.objectManager.getByLocation(nextPath), nextPath);
					}
				}
				if(_type instanceof ObjectNestable && path.length){
					return _type.inter(path, type);
				}
			}


		}
		return _type;
	}

	protected _makeNested(type: TypeObject, additionalObjects: TypeObject[], path: string[]): ObjectNestable{
		let t:ObjectNestable = new ObjectNestable(path, type._class, Array.prototype.concat.apply([type], additionalObjects) ,this);
		t.objectManager = this.objectManager;
		return t;
	}

}
export class TypeReference{

	manager;

	reference;

	referencedType;

	getReferencedType(){

	}
}


export class AutocompleteReference{

	reference: string;

	constructor(reference){
		this.reference = reference;
	}
}

export class AutocompleteManager extends ViewModel{

	selectedPath;

	history:any[] = [];
	current: any|null;

	setFrame(autocomplete: Autocomplete){
		let o = this.getHistoryByAutocomplete(autocomplete);
		if(!o){
			o = {
				path: autocomplete.getPath(false),
				autocomplete: autocomplete,
				el: autocomplete.el,
			};
		}
		this.history.push(o);
		this.sync();
	}

	sync(){
		this.render();
		let to = this.history[this.history.length-1] || null;
		if(this.current !== to){
			if(this.current)this.meta.container.removeChild(this.current.el);
			this.current = to;

			this.meta.container.appendChild(to.el);
			this.applyPath(this.current.path, this.meta.breadcrumbPath);
		}
	}

	back(){
		if(this.history.length>1){
			this.history.pop();
			this.sync();
		}
	}


	_render(registry: any) {


		let el = document.createElement('div');
		el.classList.add('autocomplete-frame');

		let container = document.createElement('div');
		container.classList.add('container');

		let breadcrumbs = document.createElement('div');
		breadcrumbs.classList.add('breadcrumbs');

		let bcBack =  document.createElement('button');
		bcBack.classList.add('breadcrumbs-back');
		bcBack.innerHTML = '<';
		bcBack.addEventListener('click', () => {
			this.back();
		});

		let bcPath = document.createElement('div');
		bcPath.classList.add('breadcrumbs-path');
		breadcrumbs.appendChild(bcBack);
		breadcrumbs.appendChild(bcPath);

		let selected = document.createElement('div');
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
	}


	getHistoryByAutocomplete(a: Autocomplete){
		for(let i =0; i < this.history.length; i++){
			let o:any = this.history[i];
			if(o.autocomplete === a){
				return o;
			}
		}
		return null;
	}

	select(autocompleteMember: AutocompleteMember) {
		this.selectedPath = autocompleteMember.getPath(true);
		this.meta.selected.style.display = 'block';
		this.applyPath(this.selectedPath, this.meta.selectedPath);
	}


	applyPath(path, el){
		el.innerHTML = '';

		let chunks = [];

		let prev = null;
		for(let segment of path){
			if(prev){
				let separator = document.createElement('span');
				separator.classList.add('path-separator');
				separator.innerHTML = ' > ';
				el.appendChild(separator);
			}

			let chunk = document.createElement('span');
			chunk.classList.add('path-segment');
			chunk.innerHTML = segment;
			chunks.push(chunk);
			el.appendChild(chunk);
			prev = segment;
		}
	}
}
export class Autocomplete extends ViewModel{

	selectedPath;

	holdsIn: AutocompleteMember;

	type: ObjectNestable;

	members: {[k:string]: AutocompleteMember} = {};

	manager: AutocompleteManager;


	constructor(manager: AutocompleteManager, type: ObjectNestable, holdsIn:AutocompleteMember = null){
		super();
		this.manager = manager;
		this.type = type;
		this.holdsIn = holdsIn;
	}

	getRoot(){
		if(!this.holdsIn){
			return this;
		}else{
			return this.holdsIn.getRoot();
		}
	}

	getPath(asArray = false){
		let p = [];
		if(this.holdsIn){
			p = this.holdsIn.getPath(true)
		}

		if(!asArray){
			p.join('.');
		}
		return p;
	}

	_render(registry: any) {

		let el = document.createElement('div');
		el.classList.add('autocomplete-object');

		let membersEl = document.createElement('div');
		membersEl.classList.add('autocomplete-object-members');
		el.appendChild(membersEl);

		let members = this.type.getMembers();
		for(let key of Object.getOwnPropertyNames(members)){
			let member = members[key];
			this.members[key] = new AutocompleteMember(this, key, member);
			membersEl.appendChild( this.members[key].el );
		}

		return {
			el: el,
			members: membersEl
		};
	}

	interTo(key: string, type: Type|number) {
		let object = this.type.inter(key, type);
		let autocomplete = new Autocomplete(this.manager, object, this.members[key]);
		this.manager.setFrame(autocomplete);
	}

}
export class AutocompleteMember extends ViewModel{

	autocomplete: Autocomplete;

	key:string;

	member: Member;

	constructor(autocomplete, key, member){
		super();
		this.key = key;
		this.member = member;
		this.autocomplete = autocomplete;
	}

	_render(registry: any) {

		let el = document.createElement('div');
		el.classList.add('autocomplete-member');

		let key = document.createElement('div');
		key.classList.add('autocomplete-member-key');
		key.addEventListener('click', () => {
			this.select();
		});
		el.appendChild(key);

		let types = document.createElement('div');
		types.classList.add('autocomplete-member-types');
		el.appendChild(types);

		return {
			el: el,
			key: key,
			types: types,
		};
	}

	afterRender(el: any, meta: any) {
		this.apply();
	}

	apply(){
		this.meta.key.innerHTML = this.key;
		this.meta.types.innerHTML = '';
		for(let type of this.member.types){
			let el = document.createElement('span');
			el.classList.add('type');
			el.classList.add('type-'+type.name);
			el.innerHTML = type.name;
			this.meta.types.appendChild(el);
			if(type instanceof TypeObject){
				el.addEventListener('click', () => {
					this.inter(type);
				});
			}
		}
	}

	inter(type: Type){
		this.autocomplete.interTo(this.key, type);
	}

	select(){
		this.autocomplete.manager.select(this);
	}

	getRoot(){
		return this.autocomplete.getRoot();
	}


	getPath(asArray = false){
		let p = [];
		if(!this.autocomplete){
			p.push(this.key);
		}else{
			p = this.autocomplete.getPath(true).concat([this.key]);
		}
		if(!asArray){
			p.join('.');
		}
		return p;
	}

}



