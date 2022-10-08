(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["Tasks"],{"71ee":function(e,t,n){"use strict";n.r(t);n("b0c0");var a=n("7a23"),o={key:0},r=Object(a["createElementVNode"])("h4",null," Please select a user. ",-1),l=[r],c={key:1,class:"tasks-page"};function u(e,t,n,r,u,s){var i=Object(a["resolveComponent"])("Tables");return Object(a["openBlock"])(),Object(a["createElementBlock"])("section",null,[r.assignee.length<1?(Object(a["openBlock"])(),Object(a["createElementBlock"])("article",o,l)):(Object(a["openBlock"])(),Object(a["createElementBlock"])("section",c,[Object(a["createElementVNode"])("h3",null,"Tasks for "+Object(a["toDisplayString"])(r.assignee.name),1),Object(a["createVNode"])(i)]))])}var s=n("5502");function i(e,t,n,o,r,l){var c=Object(a["resolveComponent"])("q-btn-toggle"),u=Object(a["resolveComponent"])("TimeTables"),s=Object(a["resolveComponent"])("ActivityTable");return Object(a["openBlock"])(),Object(a["createElementBlock"])(a["Fragment"],null,[Object(a["createVNode"])(c,{modelValue:o.range,"onUpdate:modelValue":t[0]||(t[0]=function(e){return o.range=e}),"toggle-color":"primary",options:[{label:"Day",value:"day"},{label:"Week",value:"week"}]},null,8,["modelValue"]),Object(a["createVNode"])(u,{range:o.range},null,8,["range"]),Object(a["createVNode"])(s,{range:o.range},null,8,["range"])],64)}var d={class:"tasks-page"},b={class:"demTable"},p=Object(a["createElementVNode"])("thead",null,[Object(a["createElementVNode"])("tr",null,[Object(a["createElementVNode"])("th",null,"Project"),Object(a["createElementVNode"])("th",null,"Task"),Object(a["createElementVNode"])("th",null,"Note"),Object(a["createElementVNode"])("th",null,"Hours")])],-1),m=["id"];function j(e,t,n,o,r,l){return Object(a["openBlock"])(),Object(a["createElementBlock"])("section",d,[Object(a["createElementVNode"])("table",b,[p,Object(a["createElementVNode"])("tbody",null,[(Object(a["openBlock"])(!0),Object(a["createElementBlock"])(a["Fragment"],null,Object(a["renderList"])(o.timeEntriesForUser,(function(e){return Object(a["openBlock"])(),Object(a["createElementBlock"])("tr",{id:e.id,key:e.id},[Object(a["createElementVNode"])("td",null,Object(a["toDisplayString"])(e.project.name),1),Object(a["createElementVNode"])("td",null,Object(a["toDisplayString"])(e.issue.id),1),Object(a["createElementVNode"])("td",null,Object(a["toDisplayString"])(e.comments),1),Object(a["createElementVNode"])("td",null,Object(a["toDisplayString"])(e.hours),1)],8,m)})),128))])])])}var O=n("1da1"),g=(n("96cf"),n("7cc0")),v={name:"TimeTables",components:{},setup:function(e){var t=Object(s["b"])(),n=Object(a["ref"])([]),o=(Object(a["computed"])((function(){return e.range})),new Date((new Date).valueOf()-864e5));new Date((new Date).valueOf()-6048e5);return console.log(o.toISOString()),Object(a["onMounted"])(Object(O["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,g["a"].getTimeEntriesByUser(t.state.user.api_key,t.state.project.id,t.state.assignee[0].id);case 2:n.value=e.sent.data.time_entries;case 3:case"end":return e.stop()}}),e)})))),{timeEntriesForUser:n}}},f=n("6b0d"),k=n.n(f);const B=k()(v,[["render",j]]);var y=B,h={class:"tasks-page"},V=Object(a["createElementVNode"])("h4",null,"Activity table",-1),E={class:"demTable"},w=["id"];function N(e,t,n,o,r,l){return Object(a["openBlock"])(),Object(a["createElementBlock"])("section",h,[V,Object(a["createElementVNode"])("div",null,Object(a["toDisplayString"])(o.range),1),Object(a["createElementVNode"])("table",E,[Object(a["createElementVNode"])("tbody",null,[(Object(a["openBlock"])(!0),Object(a["createElementBlock"])(a["Fragment"],null,Object(a["renderList"])(o.result,(function(e){return Object(a["openBlock"])(),Object(a["createElementBlock"])("tr",{id:e.id,key:e.id},[Object(a["createElementVNode"])("td",null,Object(a["toDisplayString"])(e),1)],8,w)})),128))])])])}n("b64b");var T={name:"ActivityTable",props:{range:{type:String}},components:{},setup:function(e){var t=Object(s["b"])(),n=Object(a["ref"])([]),o=new Date((new Date).valueOf()-864e5),r=new Date((new Date).valueOf()-6048e5),l=Object(a["computed"])((function(){return e.range}));Object(a["watch"])(l,(function(){n.value=[],c("day"===l.value?o:r)}));var c=function(){var e=Object(O["a"])(regeneratorRuntime.mark((function e(a){var o,r,l,c,u;return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:o=0,r=Object.keys(t.state.issues);case 1:if(!(o<r.length)){e.next=13;break}if(l=r[o],c=new Date(t.state.issues[l].updated_on),!(c>a)){e.next=10;break}return e.next=7,g["a"].getIssueJournals(t.state.user.api_key,t.state.issues[l].id);case 7:u=e.sent.data.issue,t.commit({type:"updateIssue",key:l,payload:u}),(null===u||void 0===u?void 0:u.journals.length)>0&&n.value.push(u.journals);case 10:o++,e.next=1;break;case 13:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}();return Object(a["onMounted"])(Object(O["a"])(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){while(1)switch(e.prev=e.next){case 0:c("day"===l.value?o:lastWee);case 1:case"end":return e.stop()}}),e)})))),console.log(n.value),{result:n,range:l}}};const D=k()(T,[["render",N]]);var S=D,C={name:"Tables",components:{TimeTables:y,ActivityTable:S},setup:function(){var e=Object(a["ref"])("day");return{range:e}}},x=n("15fd"),q=n("5530"),R=(n("d3b7"),n("7db0"),n("d81d"),n("0481"),n("4069"),n("9c40")),A=(n("a15b"),n("4de4"),n("050a")),F=n("cdf5"),W=Object(A["a"])({name:"QBtnGroup",props:{unelevated:Boolean,outline:Boolean,flat:Boolean,rounded:Boolean,push:Boolean,stretch:Boolean,glossy:Boolean,spread:Boolean},setup:function(e,t){var n=t.slots,o=Object(a["computed"])((function(){var t=["unelevated","outline","flat","rounded","push","stretch","glossy"].filter((function(t){return!0===e[t]})).map((function(e){return"q-btn-group--".concat(e)})).join(" ");return"q-btn-group row no-wrap".concat(t.length>0?" "+t:"")+(!0===e.spread?" q-btn-group--spread":" inline")}));return function(){return Object(a["h"])("div",{class:o.value},Object(F["d"])(n.default))}}}),U=n("1d8e"),_=["attrs","value","slot"],z=Object(A["a"])({name:"QBtnToggle",props:Object(q["a"])(Object(q["a"])({},U["c"]),{},{modelValue:{required:!0},options:{type:Array,required:!0,validator:function(e){return e.every((function(e){return("label"in e||"icon"in e||"slot"in e)&&"value"in e}))}},color:String,textColor:String,toggleColor:{type:String,default:"primary"},toggleTextColor:String,outline:Boolean,flat:Boolean,unelevated:Boolean,rounded:Boolean,push:Boolean,glossy:Boolean,size:String,padding:String,noCaps:Boolean,noWrap:Boolean,dense:Boolean,readonly:Boolean,disable:Boolean,stack:Boolean,stretch:Boolean,spread:Boolean,clearable:Boolean,ripple:{type:[Boolean,Object],default:!0}}),emits:["update:modelValue","clear","click"],setup:function(e,t){var n=t.slots,o=t.emit,r=Object(a["computed"])((function(){return void 0!==e.options.find((function(t){return t.value===e.modelValue}))})),l=Object(a["computed"])((function(){return{type:"hidden",name:e.name,value:e.modelValue}})),c=Object(U["a"])(l),u=Object(a["computed"])((function(){return e.options.map((function(t,n){var a=t.attrs,o=t.value,r=t.slot,l=Object(x["a"])(t,_);return{slot:r,props:Object(q["a"])(Object(q["a"])(Object(q["a"])({key:n,onClick:function(e){s(o,t,e)},"aria-pressed":o===e.modelValue?"true":"false"},a),l),{},{outline:e.outline,flat:e.flat,rounded:e.rounded,push:e.push,unelevated:e.unelevated,dense:e.dense,disable:!0===e.disable||!0===l.disable,color:o===e.modelValue?i(l,"toggleColor"):i(l,"color"),textColor:o===e.modelValue?i(l,"toggleTextColor"):i(l,"textColor"),noCaps:!0===i(l,"noCaps"),noWrap:!0===i(l,"noWrap"),size:i(l,"size"),padding:i(l,"padding"),ripple:i(l,"ripple"),stack:!0===i(l,"stack"),stretch:!0===i(l,"stretch")})}}))}));function s(t,n,a){!0!==e.readonly&&(e.modelValue===t?!0===e.clearable&&(o("update:modelValue",null,null),o("clear")):o("update:modelValue",t,n),o("click",a))}function i(t,n){return void 0===t[n]?e[n]:t[n]}function d(){var t=u.value.map((function(e){return Object(a["h"])(R["a"],e.props,void 0!==e.slot?n[e.slot]:void 0)}));return void 0!==e.name&&!0!==e.disable&&!0===r.value&&c(t,"push"),Object(F["b"])(n.default,t)}return function(){return Object(a["h"])(W,{class:"q-btn-toggle",outline:e.outline,flat:e.flat,rounded:e.rounded,push:e.push,stretch:e.stretch,unelevated:e.unelevated,glossy:e.glossy,spread:e.spread},d)}}}),I=n("93dc"),J=n.n(I);const Q=k()(C,[["render",i]]);var L=Q;J()(C,"components",{QBtnToggle:z});var M={name:"Tasks",components:{Tables:L},setup:function(){var e=Object(s["b"])(),t=Object(a["computed"])((function(){return e.state.assignee[0]}));return{assignee:t}}};const P=k()(M,[["render",u]]);t["default"]=P}}]);
//# sourceMappingURL=Tasks.fa0a94f7.js.map