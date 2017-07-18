'use babel';

$ = require("../jquery-3.2.1.min.js");

export default class CacheAtomStudioConf {
	constructor(serializedState) {
		this.element = document.createElement('div');
		$(this.element).addClass('cache-atom-studio-console');
		let panel = document.createElement('div');
		$(panel).addClass('cache-atom-studio-panel');
		$(this.element).append(panel);
	}
	
	serialize() {}
	
	destroy() {
		this.element.remove();
	}
	
	getElement() {
		return this.element;
	}
	
	writeLine(lines) {
		lines.push("");
		for(i in lines) {
			let line = document.createElement('div');
			$(line).text(lines[i]).addClass('cache-atom-studio-log');
			if (lines[i] == "") {
				$(line).height($('.cache-atom-studio-log').eq(0).height());
			}
			$('.cache-atom-studio-panel').append(line);
		}
	}
}
