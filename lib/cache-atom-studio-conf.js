'use babel';

$ = require("../jquery-3.2.1.min.js");

export default class CacheAtomStudioConf {

	constructor(serializedState) {
		// Create root element
		this.element = document.createElement('div');
		$(this.element).addClass('cache-atom-studio');
		
		let main = document.createElement('div');
		$(main).addClass("settings-view").css({"display":"inherit"});
		
		// Title
		let title = document.createElement('div');
		let titlelabel = document.createElement('div');
		$(titlelabel).text("Local Config").addClass("section-heading").css({"font-size":"1.75em", "margin-bottom":"10px"});
		$(title).append(titlelabel);
		
		// Host
		let host = document.createElement('div');
		let hostlabel = document.createElement('label');
		let hosttitle = document.createElement('div');
		$(hosttitle).text('Host Name').addClass('setting-title');
		let hostDisc = document.createElement('div');
		$(hostDisc).addClass("setting-description").text("Set the name or address of the Cach\xe9 server.");
		$(hostlabel).append(hosttitle).append(hostDisc);
		let hostInp = document.createElement('div');
		let hostInput = document.createElement('atom-text-editor');
		this.hostTE = atom.workspace.buildTextEditor({
			"mini": true,
			"lineNumberGutterVisible": false,
			"placeholderText": ""
		});
		hostInput.setModel(this.hostTE);
		$(hostInput).css({"width":"100%"}).addClass("cache-atom-studio-conf-hostInp");
		$(hostInp).append(hostInput);
		$(host).append(hostlabel).append(hostInp);
		
		// Port
		let port = document.createElement('div');
		let portlabel = document.createElement('label');
		let porttitle = document.createElement('div');
		$(porttitle).text('Cach\xe9 Web Port').addClass('setting-title');
		let portDisc = document.createElement('div');
		$(portDisc).addClass("setting-description").text("Set the web port of Cach\xe9.");
		$(portlabel).append(porttitle).append(portDisc);
		let portInp = document.createElement('div');
		let portInput = document.createElement('atom-text-editor');
		this.portTE = atom.workspace.buildTextEditor({
			"mini": true,
			"lineNumberGutterVisible": false,
			"placeholderText": ""
		});
		portInput.setModel(this.portTE);
		$(portInput).css({"width":"100%"}).addClass("cache-atom-studio-conf-portInp");
		$(portInp).append(portInput);
		$(port).append(portlabel).append(portInp);
		
		// API
		let api = document.createElement('div');
		let apilabel = document.createElement('label');
		let apititle = document.createElement('div');
		$(apititle).text('REST API Address').addClass('setting-title');
		let apiDisc = document.createElement('div');
		$(apiDisc).addClass("setting-description").text("Set the address that defined REST.");
		$(apilabel).append(apititle).append(apiDisc);
		let apiInp = document.createElement('div');
		let apiInput = document.createElement('atom-text-editor');
		this.apiTE = atom.workspace.buildTextEditor({
			"mini": true,
			"lineNumberGutterVisible": false,
			"placeholderText": ""
		});
		apiInput.setModel(this.apiTE);
		$(apiInput).css({"width":"100%"}).addClass("cache-atom-studio-conf-apiInp");
		$(apiInp).append(apiInput);
		$(api).append(apilabel).append(apiInp);
		
		// Namespace
		let namespace = document.createElement('div');
		let namespacelabel = document.createElement('label');
		let namespacetitle = document.createElement('div');
		$(namespacetitle).text('Target Namespace').addClass('setting-title');
		let namespaceDisc = document.createElement('div');
		$(namespaceDisc).addClass("setting-description").text("Set up a linked namespace.");
		$(namespacelabel).append(namespacetitle).append(namespaceDisc);
		let namespaceInp = document.createElement('div');
		let namespaceInput = document.createElement('atom-text-editor');
		this.namespaceTE = atom.workspace.buildTextEditor({
			"mini": true,
			"lineNumberGutterVisible": false,
			"placeholderText": ""
		});
		namespaceInput.setModel(this.namespaceTE);
		$(namespaceInput).css({"width":"100%"}).addClass("cache-atom-studio-conf-namespaceInp");
		$(namespaceInp).append(namespaceInput);
		$(namespace).append(namespacelabel).append(namespaceInp);
		
		// Sign
		let sign = document.createElement('div');
		let signlabel = document.createElement('label');
		let signtitle = document.createElement('div');
		$(signtitle).text('Sign').addClass('setting-title');
		let signDisc = document.createElement('div');
		$(signDisc).addClass("setting-description").text("Set the sign to insert in the comment.");
		$(signlabel).append(signtitle).append(signDisc);
		let signInp = document.createElement('div');
		let signInput = document.createElement('atom-text-editor');
		this.signTE = atom.workspace.buildTextEditor({
			"mini": true,
			"lineNumberGutterVisible": false,
			"placeholderText": ""
		});
		signInput.setModel(this.signTE);
		$(signInput).css({"width":"100%"}).addClass("cache-atom-studio-conf-signInp");
		$(signInp).append(signInput);
		$(sign).append(signlabel).append(signInp);
		
		// Account
		let account = document.createElement('div');
		let accountlabel = document.createElement('label');
		let accounttitle = document.createElement('div');
		$(accounttitle).text('Account').addClass('setting-title');
		let accountDisc = document.createElement('div');
		$(accountDisc).addClass("setting-description").text("Connect to the Caché server with this account.");
		$(accountlabel).append(accounttitle).append(accountDisc);
		let accountInp = document.createElement('div');
		let accountInput = document.createElement('atom-text-editor');
		this.accountTE = atom.workspace.buildTextEditor({
			"mini": true,
			"lineNumberGutterVisible": false,
			"placeholderText": ""
		});
		accountInput.setModel(this.accountTE);
		$(accountInput).css({"width":"100%"}).addClass("cache-atom-studio-conf-accountInp");
		$(accountInp).append(accountInput);
		$(account).append(accountlabel).append(accountInp);
		
		// Password
		let pwd = document.createElement('div');
		let pwdlabel = document.createElement('label');
		let pwdtitle = document.createElement('div');
		$(pwdtitle).text('Password').addClass('setting-title');
		let pwdDisc = document.createElement('div');
		$(pwdDisc).addClass("setting-description").text("Password for authentication.");
		$(pwdlabel).append(pwdtitle).append(pwdDisc);
		let pwdInp = document.createElement('div');
		let pwdInput = document.createElement('atom-text-editor');
		this.pwdTE = atom.workspace.buildTextEditor({
			"mini": true,
			"lineNumberGutterVisible": false,
			"placeholderText": ""
		});
		pwdInput.setModel(this.pwdTE);
		$(pwdInput).css({"width":"100%"}).addClass("cache-atom-studio-conf-pwdInp");
		$(pwdInp).append(pwdInput);
		$(pwd).append(pwdlabel).append(pwdInp);
		
		// SSL
		let ssl = document.createElement('div');
		$(ssl).addClass("checkbox");
		let ssllabel = document.createElement('label');
		let sslInp = document.createElement('div');
		$(sslInp).text('SSL Connection').addClass("setting-title");
		let sslInput = document.createElement('input');
		$(sslInput).attr({"type":"checkbox", "id":"cache-atom-studio-conf.ssl"}).addClass("input-checkbox cache-atom-studio-conf-sslInp");
		$(ssllabel).append(sslInput).append(sslInp);
		let sslDisc = document.createElement('div');
		$(sslDisc).addClass("setting-description")
			.text("Set to True for SSL connection to the Cach\xe9 server.");
		$(ssl).append(ssllabel).append(sslDisc);
		
		let footer = document.createElement('div');
		$(footer).addClass("cache-atom-studio-conf-footer");
		let saveBtn = document.createElement('button');
		$(saveBtn).addClass("btn cache-atom-studio-conf-savebtn").text("Save");
		let cancelBtn = document.createElement('button');
		$(cancelBtn).addClass("btn cache-atom-studio-conf-cancelbtn").text("Cancel");
		
		$(footer).append(saveBtn).append(cancelBtn);
		
		$(main).append(title)
			.append(host)
			.append(port)
			.append(ssl)
			.append(account)
			.append(pwd)
			.append(api)
			.append(namespace)
			.append(sign)
			.append(footer);
		$(this.element).append(main);
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
		let $body = $(this.element);
		
		let host = (info.host != undefined) ? info.host : "";
		this.hostTE.setText(host);
		
		let port = (info.port != undefined) ? info.port : "";
		this.portTE.setText(port);
		
		let api = (info.api != undefined) ? info.api : "";
		this.apiTE.setText(api);
		
		let namespace = (info.namespace != undefined) ? info.namespace : "";
		this.namespaceTE.setText(namespace);
		
		let sign = (info.sign != undefined) ? info.sign : "";
		this.signTE.setText(sign);
		
		let account = (info.account != undefined) ? info.account : "";
		this.accountTE.setText(account);
		
		let pwd = (info.pwd != undefined) ? info.pwd : "";
		this.pwdTE.setText(pwd);
		
		let ssl = (info.ssl != undefined) ? info.ssl : 0;
		ssl = (ssl == 1) ? false : true;
		$body.find(".cache-atom-studio-conf-sslInp").prop({"checked":ssl});
		
	}
}
