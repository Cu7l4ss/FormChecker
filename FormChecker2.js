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
	each = this.each = function (that, fn) {
		var key;
		that = that || this;
		for (key in that) {
			if (that.hasOwnProperty(key) && typeOf(that[key]) !== 'function') {
				fn.apply(that, [that[key]]);
			}
		}
	}, 
	runCallback = (function () {
		var s = typeOf(callas);
		if (s === 'function') {
			return callas;
		} else {
			return function (els) {
				each(els, function (el) {
					el.className += " " + callas;
					el.onfocus = function () {
						this.value = "";
						el.className = "";
						this.onfocus = "";
					};
				});
			};
		}
	}()),
	phone = this.phone = function (fields) {
		var rexp = (/^([0]{1})(([2,3,4,9,7,8]{1})|(7[2,7]{1}))-([2-9]{1})(\d{6})$/),
		rottenFields = [];
		each(fields, function (field) { 
			if (!rexp.test(field.value)) {
				rottenFields.push(field);
			}
		});
		return rottenFields;
	},
	email = this.email = function (fields) {
		var rexp = (/^([\w\-]+(?:\.[\w\-]+)*)@((?:[\w\-]+\.)*\w[\w\-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i),
		rottenFields = [];
		each(fields, function (field) { 
			if (!rexp.test(field.value)) {
				rottenFields.push(field);
			}
		});
		return rottenFields;
	},
	checkObject = (function () {
		var mergedObj = merge({"objects": [{ "email": email, "phone": phone }, options.checks || {} ], "override": true});
		return mergedObj;
	}()),
	fetch_field = function (ids) {
		var arrFields = [];
		each(ids, function (a) {
			if (typeOf(fetch_field.cache[a]) !== "undefined") {
				arrFields.push(fetch_field.cache[a]);
			}
			else {
				fetch_field.cache[a] = document.getElementById(a);
				arrFields.push(fetch_field.cache[a]);
			}
		});
		return arrFields;
	},
	that = this,
	check = function () {
		var	key,
		fields,
		rottenFields = [];
		for (key in fieldset) {
			if (fieldset.hasOwnProperty(key)) {
				fields = fetch_field(fieldset[key]);
				rottenFields = checkObject[key].call(that, fields);
				runCallback(rottenFields);
			}
		}
	};
	fetch_field.cache = {};
	return { "check" : check, "each" : each};
};
