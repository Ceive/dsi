/**
 * @Created by Alexey Kutuzov <lexus27.khv@gmai.com> on 22.03.2018.
 */
"use strict";
var Types = require('./Type');
var Type_1 = require("./Type");
var Type_2 = require("./Type");
var Type_3 = require("./Type");
var Type_4 = require("./Type");
var Type_5 = require("./Type");
var Vm = require("./ViewModel");
var Type_6 = require("./Type");
var Autocomplete_1 = require("./Autocomplete");
var Template_1 = require("./Template");
var dsi = new Types.TypeObject();
dsi.setMembers({
    profile: new Type_1.Member([
        (new Type_2.TypeObject())
            .setMembers({
            firstname: new Type_1.Member([new Type_3.TypeString(), new Type_4.TypeNull]),
            middlename: new Type_1.Member([new Type_3.TypeString(), new Type_4.TypeNull]),
            lastname: new Type_1.Member([new Type_3.TypeString(), new Type_4.TypeNull]),
            contact_phone: new Type_1.Member([new Type_3.TypeString(), new Type_4.TypeNull]),
            contact_email: new Type_1.Member([new Type_3.TypeString(), new Type_4.TypeNull]),
            "Методами такими": new Type_1.Member([new Type_6.TypeBoolean(), new Type_4.TypeNull]),
            contacts: new Type_1.Member([new Type_5.TypeArray(new Type_1.Member([
                    (new Type_2.TypeObject())
                        .setMembers({
                        type: new Type_1.Member([new Type_3.TypeString(), new Type_4.TypeNull]),
                        address: new Type_1.Member([new Type_3.TypeString(), new Type_4.TypeNull]),
                    }),
                    new Type_3.TypeString(),
                    new Type_4.TypeNull
                ])), new Type_4.TypeNull]),
            user: new Type_1.Member([
                (new Type_2.TypeObject())
                    .setMembers({
                    username: new Type_1.Member([new Type_3.TypeString()]),
                    password: new Type_1.Member([new Type_3.TypeString()]),
                })
            ]),
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
var manager = new Autocomplete_1.AutocompleteManager();
document.querySelector('#autocomplete').appendChild(manager.el);
var type = new Autocomplete_1.ObjectNestable([], dsi._class, [dsi], null);
type.objectManager = new Autocomplete_1.ObjectManager();
manager.setFrame(new Autocomplete_1.Autocomplete(manager, type));
window['_Autocomplete'] = manager;
var te = new Template_1.TemplateEngine;
te.context = type;
document.querySelector('#template-engine').appendChild(te.el);
window['_Template'] = te;
