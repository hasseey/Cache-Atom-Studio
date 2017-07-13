'use babel';

export default class CacheAtomStudioConf {

	constructor(serializedState) {
		// Create root element
		this.element = document.createElement('div');
		this.element.classList.add('cache-atom-studio');
		//this.element.style.top = "200px";
		//this.element.parentNode.style.maxWidth = "40em";
		/*
		this.element = $('div').get(0);
		$(this.element).addClass('cache-atom-studio');
		//this.element.parentNode.style.maxWidth = "40em";
		///this.element.parentNode.style.top = "200px";
		
		const title = $('div');
		title.text("Config");
		
		const host = $('div');
		const hostlabel = $('span');
		hostlabel.text('Host Name');
		const hostInp = $('div');
		const hostInput = $('input');
		
		hostInp.append(hostInput);
		host.append(hostlabel).append(hostInp);
		
		$(this.element).append(title).append(host);
		*/
		/*
		// Create message element
		const message = document.createElement('div');
		message.textContent = 'The CacheAtomStudio package is Alive! It\'s ALIVE!';
		message.classList.add('message');
		this.element.appendChild(message);
		*/
	}

	// Returns an object that can be retrieved when package is activated
	serialize() {}

	// Tear down any state and detach
	destroy() {
		this.element.remove();
	}

	getElement() {
		return this.element;
	}
	
	setupInfo(info) {
		
	}
}
