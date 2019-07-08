'use babel';

$ = require("../../jquery-3.2.1.min.js");

export default class CacheAtomStudioConf {

	constructor(serializedState) {
		// Create root element
		this.element = document.createElement('div');
		$(this.element).addClass('cache-atom-studio').css({"overflow":"auto"});
		
		let main = document.createElement('div');
		$(main).addClass("settings-view").css({"display":"inherit"});
		
		// Title
		let title = document.createElement('div');
		let titlelabel = document.createElement('div');
		$(titlelabel).text("Local Settings").addClass("section-heading").css({"font-size":"1.75em", "margin-bottom":"10px"});
		$(title).append(titlelabel);
		
		// Host
		let host = document.createElement('div');
		$(host).addClass("section-panel");
		let hostlabel = document.createElement('label');
		let hosttitle = document.createElement('div');
		$(hosttitle).text('Cach\xe9 Server').addClass('setting-title');
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
		$(port).addClass("section-panel");
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
		$(api).addClass("section-panel");
		let apilabel = document.createElement('label');
		let apititle = document.createElement('div');
		$(apititle).text('REST API URL').addClass('setting-title');
		let apiDisc = document.createElement('div');
		$(apiDisc).addClass("setting-description").text("Set the url that defined REST.");
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
		$(namespace).addClass("section-panel");
		let namespacelabel = document.createElement('label');
		let namespacetitle = document.createElement('div');
		$(namespacetitle).text('Namespace').addClass('setting-title');
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
		$(sign).addClass("section-panel");
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
		
		// InsertDesc
		let insertDesc = document.createElement('div');
		$(insertDesc).addClass("section-panel");
		let insertDesclabel = document.createElement('label');
		let insertDesctitle = document.createElement('div');
		$(insertDesctitle).text('Insert Description').addClass('setting-title');
		let insertDescDisc = document.createElement('div');
		$(insertDescDisc).addClass("setting-description").text("Insert in class description.");
		$(insertDesclabel).append(insertDesctitle).append(insertDescDisc);
		let insertDescInp = document.createElement('div');
		let insertDescInput = document.createElement('atom-text-editor');
		this.insertDescTE = atom.workspace.buildTextEditor({
			"mini": true,
			"lineNumberGutterVisible": false,
			"placeholderText": ""
		});
		insertDescInput.setModel(this.insertDescTE);
		$(insertDescInput).css({"width":"100%"}).addClass("cache-atom-studio-conf-insertDescInp");
		$(insertDescInp).append(insertDescInput);
		$(insertDesc).append(insertDesclabel).append(insertDescInp);
		
		// Account
		let account = document.createElement('div');
		$(account).addClass("section-panel");
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
		$(pwd).addClass("section-panel");
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
		$(ssl).addClass("checkbox section-panel");
		let ssllabel = document.createElement('label');
		let sslInp = document.createElement('div');
		$(sslInp).text('SSL Connection').addClass("setting-title");
		let sslInput = document.createElement('input');
		$(sslInput).attr({"type":"checkbox", "id":"cache-atom-studio-conf.ssl"}).addClass("input-checkbox cache-atom-studio-conf-sslInp");
		$(ssllabel).append(sslInput).append(sslInp);
		this.sslInput = $(sslInput);
		let sslDisc = document.createElement('div');
		$(sslDisc).addClass("setting-description")
			.text("Set to True for SSL connection to the Cach\xe9 server.");
		$(ssl).append(ssllabel).append(sslDisc);
		
		// syncSaved
		let syncSaved = document.createElement('div');
		$(syncSaved).addClass("checkbox section-panel");
		let syncSavedlabel = document.createElement('label');
		let syncSavedInp = document.createElement('div');
		$(syncSavedInp).text('Sync File Save').addClass("setting-title");
		let syncSavedInput = document.createElement('input');
		$(syncSavedInput).attr({"type":"checkbox", "id":"cache-atom-studio-conf.syncSaved"}).addClass("input-checkbox cache-atom-studio-conf-syncSavedInp");
		$(syncSavedlabel).append(syncSavedInput).append(syncSavedInp);
		this.syncSavedInput = $(syncSavedInput);
		let syncSavedDisc = document.createElement('div');
		$(syncSavedDisc).addClass("setting-description")
			.text("Synchronize with the Cach\xe9 server at the same time as saving the file.");
		$(syncSaved).append(syncSavedlabel).append(syncSavedDisc);
		
		let footer = document.createElement('div');
		$(footer).addClass("cache-atom-studio-conf-footer");
		let saveBtn = document.createElement('button');
		$(saveBtn).addClass("btn cache-atom-studio-conf-savebtn").text("Save");
		let cancelBtn = document.createElement('button');
		$(cancelBtn).addClass("btn cache-atom-studio-conf-cancelbtn").text("Cancel");
		
		$(footer).append(saveBtn).append(cancelBtn);
		
		$(main).append(title)
			.append(namespace)
			.append(sign)
			.append(insertDesc)
			.append(host)
			.append(port)
			.append(ssl)
			.append(syncSaved)
			.append(account)
			.append(pwd)
			.append(api)
			.append(footer);
		$(this.element).append(main);
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
		
		let insertDesc = (info.insertDesc != undefined) ? info.insertDesc : "";
		this.insertDescTE.setText(insertDesc);
		
		let account = (info.account != undefined) ? info.account : "";
		this.accountTE.setText(account);
		
		let pwd = (info.pwd != undefined) ? info.pwd : "";
		this.pwdTE.setText(pwd);
		
		let ssl = (info.ssl != undefined) ? info.ssl : 0;
		ssl = (ssl != 1) ? false : true;
		this.sslInput.prop({"checked":ssl});
		
		let syncSaved = (info.syncSaved != undefined) ? info.syncSaved : 0;
		syncSaved = (syncSaved != 1) ? false : true;
		this.syncSavedInput.prop({"checked":syncSaved});
	}
	
	saveConfigFile(path) {
		let status = true;
		try {
			let info = {};
			if (this.hostTE.getText() != "") {
				info["host"] = this.hostTE.getText();
			}
			if (this.portTE.getText() != "") {
				info["port"] = this.portTE.getText();
			}
			if (this.apiTE.getText() != "") {
				info["api"] = this.apiTE.getText();
			}
			if (this.namespaceTE.getText() != "") {
				info["namespace"] = this.namespaceTE.getText();
			}
			if (this.signTE.getText() != "") {
				info["sign"] = this.signTE.getText();
			}
			if (this.insertDescTE.getText() != "") {
				info["insertDesc"] = this.insertDescTE.getText();
			}
			if (this.accountTE.getText() != "") {
				info["account"] = this.accountTE.getText();
			}
			if (this.pwdTE.getText() != "") {
				info["pwd"] = this.pwdTE.getText();
			}
			let ssl = (this.sslInput.prop("checked")) ? 1 : 0;
			info["ssl"] = ssl;
			let syncSaved = (this.syncSavedInput.prop("checked")) ? 1 : 0;
			info["syncSaved"] = syncSaved;
			
			let jsonText = JSON.stringify(info, null, '\t');
			
			let tb = atom.workspace.buildTextEditor();
			tb.setText(jsonText);
			tb.saveAs(path+'/cache-atom-studio-config.json');
		} catch(err) {
			status = false;
		}
	}
}
