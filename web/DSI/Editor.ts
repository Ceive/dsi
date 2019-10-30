

import {ViewModel} from "./ViewModel";

/**
 *
 */
class Element extends ViewModel{

	static registry: Element[] = [];

	tag = 'span';

	parent: Editor = null;

	_content: any;

	s: {
		selection: Selection,
		node: Node,
		offset: number
	} = {
		selection: null,
		node: null,
		offset: null
	};

	constructor(){
		super();
		Element.registry.push(this);
	}

	_render(registry: any) {
		let el = document.createElement(this.tag);
		el.contentEditable = 'true';
		return { el };
	}

	afterRender(el,meta){
		el.addEventListener('keydown', this.onKeyDown.bind(this), false);
		el.addEventListener('keypress', this.onKeyPress.bind(this), false);
		el.addEventListener('keyup', this.onKeyUp.bind(this), false);
	}


	tryDelegateToElement(e,method){
		let focusNode = getSelection().focusNode;
		for(let _el of Element.registry){
			if(focusNode.nodeType == Node.TEXT_NODE){

				if(focusNode.parentNode === _el.el){
					_el[method](e, true);
					return _el;
				}

			}else if(focusNode === _el.el){
				_el[method](e, true);
				return _el;
			}
		}
		return null;
	}

	onKeyDown(e,delegated = false){

		if(!delegated && this.tryDelegateToElement(e,'onKeyDown')){
			return;
		}

		e.stopPropagation();
		e.stopImmediatePropagation();
		e.cancelBubble = true;
		this.updateSelection();

		if(e.keyCode == 13){

			if(e.altKey){
				this.callHelper();
			}else{
				this.explode();
			}

			e.returnValue = false;
			e.preventDefault();
		}

		console.log("Keydown", this);

		if(e.returnValue===false){return false;}
	}
	onKeyPress(e,delegated = false){

		if(!delegated && this.tryDelegateToElement(e,'onKeyPress')){
			return;
		}

		e.stopPropagation();
		e.stopImmediatePropagation();
		e.cancelBubble = true;
		this.updateSelection();



		if(e.returnValue===false){return false;}
	}
	onKeyUp(e,delegated = false){
		if(!delegated && this.tryDelegateToElement(e,'onKeyUp')){
			return;
		}

		e.stopPropagation();
		e.stopImmediatePropagation();
		e.cancelBubble = true;
		this.updateSelection();



		if(e.returnValue===false){return false;}
	}

	updateSelection(){
		let s = getSelection();
		this.s.selection = s;
		this.s.node = s.focusNode;
		this.s.offset = s.focusOffset;
	}

	callHelper(){

	}

	explode(middle?: Element[]) {
		let index = this.parent.children.indexOf(this);
		let pos = this.s.offset;

		let text = this.getContent();
		if(text == "<br>"){
			text = '';
		}
		let beforeText = text.substr(0,pos);
		let afterText = text.substr(pos);

		let beforeEl = this.clone();
		beforeEl.setContent(beforeText || "<br>");

		let afterEl = this;
		afterEl.setContent(afterText || '<br>');

		let replacement = [];
		replacement.push(beforeEl);
		if(middle){
			for(let element of middle){
				replacement.push(element);
			}
		}
		replacement.push(afterEl);


		// meta children insertion
		Array.prototype.splice.apply(
			this.parent.children,
			Array.prototype.concat.apply([index, 1],replacement)
		);

		//elements insertion
		let thisEl = this.el;
		let parentEl = this.parent.el;

		for(let itm of replacement){
			if(itm.el !== thisEl){
				parentEl.insertBefore(itm.el , thisEl);
			}
		}
	}

	setContent(content){
		this._content = content;
		this.el.innerHTML = content;
		return this;
	}

	getContent(){
		return this.el.innerHTML;
	}


	clone(){
		let clone = Object.create(this.constructor.prototype);
		for(let p in this){
			if(this.hasOwnProperty(p)){
				clone[p] = this[p];
			}
		}

		clone._el = null;
		clone.meta = {};
		clone.setContent(clone._content);

		Element.registry.push(clone);

		return clone;
	}

	getRoot(){
		if(this.parent){
			return this.parent.getRoot();
		}
		return null;
	}
}
/**
 *
 */
export class Editor extends Element{

	tag = 'div';

	children: Element[] = [];

	getRoot(){
		if(this.parent){
			return this.parent.getRoot();
		}else{
			return this;
		}
	}

	explode(middle?: Element[]) {
		if(!this.parent){
			let pos = this.s.offset;

			let text = this.getContent();
			let beforeText = text.substr(0,pos);
			let afterText = text.substr(pos);

			let beforeEditor = this.clone();
			beforeEditor.setContent(beforeText || "<br>");

			let afterEditor = this.clone();
			afterEditor.setContent(afterText || "<br>");

			let replacement = [];
			replacement.push(beforeEditor);
			if(middle){
				for(let element of middle){
					replacement.push(element.el);
				}
			}
			replacement.push(afterEditor);

			this.el.innerHTML = '';
			this.children = replacement;

			//elements insertion
			let thisEl = this.el;
			for(let itm of replacement){
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

		}else{
			super.explode(middle);
		}
	}

}
export class RootEditor extends Editor{
	tag = 'section';
}