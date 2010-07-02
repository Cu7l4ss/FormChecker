"use strict";
var FormChecker = function (options, callas) {
	/*
		merge: object merging.
		usage: options consists of 2 fields:
				1.objects, first one is the root.
				2.override - if set to true then will override 
							any fields that the root object has.
	*/
	var	merge = function (options) {
		var temp,
		root = options.objects[0],
		objects = options.objects,
		i = 1,
		name;
		if (!!options.override) {
			for (; i < objects.length; i += 1) {
				temp = objects[i];
				for (name in temp) {
					if (temp.hasOwnProperty(name)) {
						root[name] = temp[name];
					}
				}
			}
		} else {
			for (;i < objects.length; i += 1) {
				temp = objects[i];
				for (name in temp) {
					if (temp.hasOwnProperty(name) && !root.hasOwnProperty(name)) {
						root[name] = temp[name];
					}
				}
			}
		}
		return root;
	},
	fieldset = merge({"objects": [options.fieldset], "override": true}),
	typeOf = this.typeOf = function (value) {
		var s = typeof value;
		if (s === 'object') {
		    if (value) {
		        if (value instanceof Array) {
		            s = 'array';
		        }
		    } else {
		        s = 'null';
		    }
		}
		return s;
	},
	runCallback = (function () {
		var s = typeOf(callas);
		if (s === 'function') {
			return callas;
		} else {
			return function (el) {
				el.className += " " + callas;
			};
		}
	}()),
	phone = this.phone = function (e) {
		return (/^([0]{1})(([2,3,4,9,7,8]{1})|(7[2,7]{1}))-([2-9]{1})(\d{6})$/).test(e);
	},
	email = this.email = function (e) {
		return (/^([\w\-]+(?:\.[\w\-]+)*)@((?:[\w\-]+\.)*\w[\w\-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i).test(e);
	},
	checkObject = (function () {
		var mergedObj = merge({"objects": [{ "email": email, "phone": phone }, options.checks || {} ], "override": true});
		return mergedObj;
	}()),
	fetch_field = function (id) {
		if (typeOf(fetch_field.cache[id]) !== "undefined") {
			return fetch_field.cache[id];
		}
		fetch_field.cache[id] = document.getElementById(id);
		return fetch_field.cache[id];
	},
	that = this,
	check = function () {
		var i = 0,
		key,
		field;
		for (key in fieldset) {
			each(fieldset, function () {
				
			})
		}
		/*for (key in fieldset) {
			if (fieldset.hasOwnProperty(key)) {
				for (i = 0; i < fieldset[key].length; i += 1) {
					console.log(checkObject[key]);
					if (!checkObject[key].call(that, fetch_field(fieldset[key][i]).value)) {
						runCallback(fetch_field.cache[fieldset[key][i]]);
					}
				}
			}
		}*/
	},
	each = function (that , fn) {
		var key;
		that = that || this;
		for (key in that) {
			if(that.hasOwnProperty(key) && typeOf(that[key]) !== 'function')
				fn.apply(that,[that[key]]);
		}
	};
	fetch_field.cache = {};
	return { "check" : check, "each" : each};
};
