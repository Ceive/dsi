/**
 * @Created by Alexey Kutuzov <lexus27.khv@gmai.com> on 22.03.2018.
 */


import * as Types from './Type';
import {Member} from "./Type";
import {TypeObject} from "./Type";
import {TypeString} from "./Type";
import {TypeNull} from "./Type";
import {TypeArray} from "./Type";
import {TypeNumber} from "./Type";

import * as Vm from "./ViewModel";
import {TypeBoolean} from "./Type";
import {AutocompleteManager, Autocomplete, ObjectNestable, ObjectManager} from "./Autocomplete";
import {TemplateEngine} from "./Template";




let dsi = new Types.TypeObject();
dsi.setMembers({
/*
	profile: new Member([
		(new TypeObject())
			.setMembers({

				firstname: new Member([ new TypeString(), new TypeNull ]),
				middlename: new Member([ new TypeString(), new TypeNull ]),
				lastname: new Member([ new TypeString(), new TypeNull ]),

				contact_phone: new Member([ new TypeString(), new TypeNull ]),
				contact_email: new Member([ new TypeString(), new TypeNull ]),
				"Методами такими": new Member([ new TypeBoolean(), new TypeNull ]),

				contacts: new Member([ new TypeArray( new Member([
					(new TypeObject())
						.setMembers({
							type: new Member([ new TypeString(), new TypeNull ]),
							address: new Member([ new TypeString(), new TypeNull ]),
						}),
					new TypeString(),
					new TypeNull
				]) ), new TypeNull ]),
				user: new Member([
					(new TypeObject())
						.setMembers({
							username: new Member([ new TypeString() ]),
							password: new Member([ new TypeString() ]),
						})
				]),
			})
	])

*/
	car: new Member([
		(new TypeObject())
			.setMembers({
				wheels: new Member([ new TypeNumber() ]), 	// колеса
				doors: new Member([ new TypeNumber() ]),	// двери
				color: new Member([ new TypeString() ]),	// цвет
				engine: new Member([
					(new TypeObject())
						.setMembers({
							cylinders: new Member([ new TypeNumber() ]),
							fuel: new Member([ new TypeString() ]),
							volume: new Member([ new TypeString() ]),
							oil: new Member([ new TypeString() ])
						})
				]),
				passengersMaxCount: new Member([ new TypeNumber() ]),	// цвет
				passengers: new Member([ new TypeArray(  new Member([
					(new TypeObject())
						.setMembers({
							name: new Member([ new TypeString()]),
							role: new Member([ new TypeString()]),
						})
				])/*, {
					dependency: 'passengersMaxCount',
					fn: function(typeArray, passengersMaxCountValue){
						typeArray.setLimit(passengersMaxCountValue);
					}
				}*/ ), new TypeNull ]),

			})
	])
});

let structure = new Vm.TypeObject(dsi);
document.querySelector('#uisi').appendChild( structure.el );
document.querySelector('#getStructureButton').addEventListener('click', () => {

	let str = JSON.stringify(structure.value, null, 2);
	console.log(str);
	document.querySelector('#view-structure').innerHTML = str;

});
window['_Structure'] = structure;





let manager = new AutocompleteManager();

document.querySelector('#autocomplete').appendChild( manager.el );

let type = new ObjectNestable([],dsi._class, [dsi], null);
type.objectManager = new ObjectManager();
manager.setFrame(new Autocomplete(manager, type));

window['_Autocomplete'] = manager;


let te = new TemplateEngine;
te.context = type;
document.querySelector('#template-engine').appendChild( te.el );

window['_Template'] = te;

/*
let editor = new Editor;
document.querySelector('#template-engine').appendChild( editor.el );

window['_EDITOR'] = editor;
*/
/*
let fields = [];
let name = 'passengersMaxCount';
let element = document.createElement('input');
element.type ='number';

element.addEventListener('change', () => {

	for(let field of fields){

		let dependency = field.getDependencyFor(name);
		if(dependency){

			let fn = dependency.fn;
			fn( field , element.value);
		}


	}

});*/

