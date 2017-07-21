'use babel';

$ = require("../jquery-3.2.1.min.js");

export default class CacheAtomStudioConsole {
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
		if (lines == undefined) {
			return;
		}
		if (lines.length > 0) {
			lines.push("");
		}
		for(i in lines) {
			let line = document.createElement('div');
			$(line).text(lines[i]).addClass('cache-atom-studio-log');
			if (lines[i] == "") {
				$(line).height("1em");
			}
			$(this.element).find('.cache-atom-studio-panel').eq(0).append(line);
		}
		$(this.element).find('.cache-atom-studio-panel').eq(0).scrollTop(100000);
	}
	
	emptyLog() {
		$(this.element).find('.cache-atom-studio-panel').eq(0).empty();
	}
}
