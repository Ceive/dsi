

import {ViewModel} from "./ViewModel";
import {ObjectNestable, AutocompleteManager, Autocomplete, AutocompleteMember} from "./Autocomplete";

class Keyboard{

	el;

	constructor(el){
		this.el = el;
		let that = this;
		el.addEventListener('keydown', function(e){
			let key = e.which || e.keyCode;

			return that.onKeyDown(this, e, key);
		});
		el.addEventListener('keypress', function(e){
			let key = e.which || e.keyCode;
			return that.onKeyPress(this,e, key);
		});
		el.addEventListener('keyup', function(e){
			let key = e.which || e.keyCode;
			return that.onKeyUp(this,e, key);
		});
	}


	onKeyDown(target: any, e: DragEvent, key: number|any) {

	}

	onKeyPress(target: any, e: DragEvent, key: number|any) {

	}

	onKeyUp(target: any, e: DragEvent, key: number|any) {

	}
}

export class TemplateEngine extends ViewModel{

	currentSelection: any|Selection;
	currentNode: Node|Element|any;
	currentOffset: number;

	currentPosition = 0;

	autocomplete: AutocompleteManager;

	context: ObjectNestable;

	chunks = [];

	_render(registry: any) {
		let el = document.createElement('div');
		let area = document.createElement('article');
		area.classList.add('template-area');
		let ac = document.createElement('div');
		//ac.style.position = 'absolute';
		ac.classList.add('template-autocomplete');
		ac.style.display = 'none';

		area.contentEditable = "true";

		let that = this;
		area.addEventListener('keydown', function(e){
			return that.onKeyDown(this, e.target, e);
		});
		area.addEventListener('keypress', function(e){
			return that.onKeyPress(this, e.target, e);
		});
		area.addEventListener('keyup', function(e){
			return that.onKeyUp(this, e.target, e);
		});


		el.appendChild(area);
		el.appendChild(ac);

		return {
			el: el,
			area: area,
			autocompleteWrapper: ac
		};
	}

	decomposite(el, position){
		let parent = el.parentNode;

		let content;
		if(el.nodeType == Node.TEXT_NODE){
			content = el.nodeValue;
			let textBefore = content.substr(0,position),
				textAfter = content.substr(position);
			let elBefore = document.createElement('div');

			let cNode;

			if(textBefore){
				let nodeBefore = document.createTextNode(textBefore);
				elBefore.appendChild(nodeBefore);
			}else{
				elBefore.appendChild(document.createElement('br'));
			}

			let elAfter = document.createElement('div');
			if(textAfter){
				let nodeAfter = document.createTextNode(textAfter||" ");
				elAfter.appendChild(nodeAfter);
				cNode = nodeAfter;
			}else{
				elAfter.appendChild(document.createElement('br'));
				cNode = elAfter;
			}


			this._replace(el, [elBefore, elAfter]);
			elAfter.focus();
			this.currentNode = cNode;
			this.currentOffset = 0;
		}else{
			content = el.innerHTML;




		}

	}

	_replace(el, replacement: Element[]){

		let parent = el.parentNode;

		for(let item of replacement){
			parent.insertBefore(item, el);
		}
		parent.removeChild(el);


		while(parent !== this.meta.area){
			el = parent;
			parent = el.parentNode;
			replacement = [];
			for(let item of el.childNodes){
				replacement.push(item);
			}
			for(let item of replacement){
				parent.insertBefore(item, el);
			}
			parent.removeChild(el);
		}

	}

	onKeyDown(element, target, event: KeyboardEvent){

		this.currentSelection = getSelection();
		this.currentNode = this.currentSelection.focusNode;
		this.currentOffset = this.currentSelection.focusOffset;

		this.currentPosition = this.getCaretPosition(this.meta.area);

		//enter
		if(event.keyCode == 13){

			if(event.altKey){
				let ac = this.getAutocomplete();
			}

			return false;
		}

	}

	onKeyPress(element, target, event: KeyboardEvent){
		if (event.keyCode == 13){

		}else{

		}

	}
	onKeyUp(element, target, event: KeyboardEvent){

	}


	getAutocomplete(){
		if(!this.autocomplete){
			let manager = new AutocompleteManager();
			manager.setFrame(new Autocomplete(manager, this.context));
			this.autocomplete = manager;
			this.meta.autocompleteWrapper.appendChild( this.autocomplete.el );

			let _this = this;
			let _oldSelect = manager.select;
			manager.select = function(autocompleteMember: AutocompleteMember){
				_oldSelect.call(this, autocompleteMember);
				_this.insertPlaceholder(this.selectedPath);
				_this.meta.autocompleteWrapper.style.display = 'none';
			};
		}
		this.meta.autocompleteWrapper.style.display = 'block';
		return this.autocomplete;
	}

	makePlaceholderEl(path){
		let elPlaceholder = document.createElement('span');
		elPlaceholder.classList.add('path-segment');
		elPlaceholder.contentEditable='false';
		elPlaceholder.innerHTML = path.join('.');
		return elPlaceholder;
	}

	insertPlaceholder(path){
		let chunks = this.chunks;
		let el = this.currentNode;
		let pos = this.currentOffset;

		let parent = el.parentNode;

		if(el.nodeType === Node.TEXT_NODE){
			let text = el.nodeValue;
			let textBefore = text.substr(0,pos),
				textAfter = text.substr(pos);

			let nodeBefore = document.createTextNode(textBefore);
			let nodeAfter = document.createTextNode(textAfter);

			let elPlaceholder = this.makePlaceholderEl(path);

			parent.insertBefore(nodeBefore, el);
			parent.insertBefore(elPlaceholder, el);
			parent.insertBefore(nodeAfter, el);
			parent.removeChild(el);

		}else{

			let brs = el.querySelectorAll('br');
			if(brs.length){
				for(let br of brs){
					br.parentNode.removeChild(br);
				}
				let elPlaceholder = this.makePlaceholderEl(path);
				el.appendChild(elPlaceholder);
			}

		}


	}

	getCaretPosition(editableDiv) {
		let caretPos = 0, range;
		if(this.currentSelection){
			if (this.currentSelection.rangeCount) {
				range = this.currentSelection.getRangeAt(0);
				if (range.commonAncestorContainer.parentNode == editableDiv) {
					caretPos = range.endOffset;
				}
			}
		}
		return caretPos;
	}

	_tmpEl;

	get tmp(){
		if(!this._tmpEl){
			this._tmpEl = document.createElement('div');
		}
		return this._tmpEl;
	}

	decodeHtmlEntity(str) {
		str = str.replace(/&nbsp;/g, (match, dec) => {
			this.tmp.innerHTML = match;
			return ' ';
		});
		return str;
	}

	encodeHtmlEntity(str) {
		return str;
		/*if(str.charAt(str.length-1) == " "){
			str = str.substr(0, str.length-1) + "#nbsp";
		}*/
	}
}
class Placeholder{

	reference: string[]|null = null;

	constructor(reference){
		this.reference = reference;
	}

}