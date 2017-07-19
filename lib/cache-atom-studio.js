'use babel';

$ = require("../jquery-3.2.1.min.js");

let fs = require('fs');
let shell = require('shell');
let ccnt = require('./cache-connect');

import CacheAtomStudioConf from './cache-atom-studio-Conf';
import CacheAtomStudioConsole from './cache-atom-studio-Console';
import { CompositeDisposable } from 'atom';

export default {
	config:{
		cacheServer:{
			title:"Caché Server",
			description:"Set the name or address of the Caché server.",
			type:"string",
			default:"localhost"
		},
		cacheServerPort:{
			title:"Caché Web Port",
			description:"Set the web port of Caché.",
			type:"string",
			default:"57772"
		},
		api:{
			title:"REST API URL",
			description:"Set the url that defined REST.",
			type:"string",
			default:"/cas-api/"
		},
		ssl:{
			title:"SSL Connection",
			description:"Set to True for SSL connection to the Caché server.",
			type:"boolean",
			default:false
		},
		accounnt:{
			title:"Account",
			description:"Connect to the Caché server with this account",
			type:"string",
			default:""
		},
		pwd:{
			title:"Password",
			description:"Password for authentication",
			type:"string",
			default:""
		},
		sign:{
			title:"Sign",
			description:"Sign of comment",
			type:"string",
			default:""
		},
		syncSaved:{
			title:"Sync File Save",
			description:"Synchronize with the Caché server at the same time as saving the file.",
			type:"boolean",
			default:false
		},
		extensionsPath: {
			title:"Extentions Path",
			description:"",
			type:"string",
			default:""
		}
	},
	
	CacheAtomStudioConf: null,
	CacheAtomStudioConsole: null,
	consolePanel: null,
	modalPanel: null,
	subscriptions: null,

	activate(state) {
		this.cacheAtomStudioConf = new CacheAtomStudioConf(state.cacheAtomStudioConfState);
		this.CacheAtomStudioConsole = new CacheAtomStudioConsole(state.cacheAtomStudioConsoleState);
		
		this.consolePanel = undefined;
		
		this.modalPanel = atom.workspace.addModalPanel({
		item: this.cacheAtomStudioConf.getElement(),
			visible: false
		});
		this.modalPanel.element.style.maxWidth = "40em";
		let _self = this;
		$(this.modalPanel.item).find(".cache-atom-studio-conf-savebtn").on("click.cas", function(e){
			let path = _self.getRootPath();
			if (path == "") {
				atom.notifications.addError("Root path is unknown.");
				return false;
			}
			let p = (path.indexOf("/") != -1) ? "/" : "\\";
			let wpath = _self.getConfigFilePath(path+p+"Class");
			if (wpath != "") {
				path = wpath;
			}
			if (_self.cacheAtomStudioConf.saveConfigFile(path) != false) {
				_self.modalPanel.hide();
				p = (path.indexOf("/") != -1) ? "/" : "\\";
				atom.notifications.addSuccess("Configuration file updated.\n"+path+p+"cache-atom-studio-config.json");
			}
			return false;
		});
		$(this.modalPanel.item).find(".cache-atom-studio-conf-cancelbtn").on("click.cas", function(e){
			_self.modalPanel.hide();
			return false;
		});
		
		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		this.subscriptions = new CompositeDisposable();

		//atom.project.onDidChangePaths(paths) => this.onPathsChanged().bind(this);
		// Register command that toggles this view
		this.subscriptions.add(
			atom.commands.add('atom-workspace', {
				'cache-atom-studio:classDocument': () => this.classDocument(),
				'cache-atom-studio:upload': () => this.update(),
				'cache-atom-studio:upload-all': () => this.updateAll(),
				'cache-atom-studio:download-all': () => this.exportAll(),
				'cache-atom-studio:config': () => this.configInfo(),
				'cache-atom-studio:comment': () => this.insertComment(),
				'core:save': () => this.updateSync(),
				'tree-view:remove': () => this.delete()
			})
			//atom.workspace.getActiveTextEditor().onDidSave(this.updateSync.bind(this)),
		);
	},

	deactivate() {
		this.modalPanel.destroy();
		if (this.consolePanel != undefined) {
			this.consolePanel.destroy();
		}
		this.subscriptions.dispose();
		this.cacheAtomStudioConsole.destroy();
		this.cacheAtomStudioConf.destroy();
	},

	serialize() {
		return {
			cacheAtomStudioConfState: this.cacheAtomStudioConf.serialize(),
			cacheAtomStudioConsoleState: this.CacheAtomStudioConsole.serialize()
		};
	},

	onPathsChanged(paths) {
		console.log(paths);
	},
	
	// クラスドキュメントの表示
	classDocument() {
		var _self = this;
		var pane = atom.workspace.getActivePaneItem();
		
		var path = "";
		if (pane == atom.workspace.getActiveTextEditor()) {
			path = pane.buffer.file.path;
		} else if (pane == this.getTreeView()) {
			path = pane.selectedPath;
		}
		if (path.split('.')[(path.split('.').length-1)].toLowerCase() != "cls") {
			return;
		}
		
		var confInfo = _self.getConfigInfo(path);
		
		var file = this.extractFilename(path);
		file = file.match("/*(.+?)\.[a-z]+([\?#;].*)?$")[1];
		
		let uri = this.getServerUri(confInfo);
		var path = uri+"/csp/documatic/%25CSP.Documatic.cls?LIBRARY="+confInfo.namespace+"&CLASSNAME="+file;
		console.log(path);
		switch(process.platform) {
			case 'darwin':
				exec("open '"+path+"'");
				break;
			case 'linux':
				exec("xdg-open '"+path+"'");
				break;
			case 'win32':
				shell.openExternal(path);
				break;
		}
	},

	// 更新
	update() {
		let path = "";
		let textSource = "";
		let pane = atom.workspace.getActiveTextEditor();
		if (pane != undefined) {
			path = pane.buffer.file.path;
			textSource = pane.getText();
		}
		if ((path == "")||(textSource == "")) {
			return;
		}
		
		filename = this.extractFilename(path);
		console.log(filename);
		console.log(textSource);
		
		let _self = this;
		this.restApi({
			command: "update",
			data: {
				sourceName: filename,
				source: textSource,
				directory: this.getRootPath()
			},
			success: function(response, textStatus, jqXHR){
				console.log(response.log);
				if (response.status != 1) {
					atom.notifications.addError(response.message);
				} else {
					_self.consoleWrite(response.log);
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				atom.notifications.addError(textStatus);
			}
		});
	},
	
	updateSync(e) {
		let ww = (atom.config.get("cache-atom-studio.syncSaved") == true) ? true : false;
		if (ww) {
			let editor = atom.workspace.getActiveTextEditor();
			let path = editor.buffer.file.path;
			let ex = path.split(".")[path.split(".").length - 1];
			if ((ex.toLowerCase() == "cls")||(ex.toLowerCase() == "mac")||(ex.toLowerCase() == "inc")||(ex.toLowerCase() == "int")) {
				this.update();
			}
		}
	},
	
	updateAs(oldpath, newpath) {
		console.log(oldpath, newpath);
	},
	
	// 全ソースの一括更新
	updateAll() {
		var path = this.getRootPath();
		if (path == "") {
			return;
		}
		this.restApi({
			command: "update-all",
			data: {
				directory: path
			},
			success: function(response, textStatus, jqXHR){
				
			},
			error: function(jqXHR, textStatus, errorThrown){
				atom.notifications.addError(textStatus);
			}
		});
	},

	// 全ソースの一括エクスポート
	exportAll() {
		var path = this.getRootPath();
		if (path == "") {
			return;
		}
		this.restApi({
			command: "export-all",
			data: {
				directory: path
			},
			success: function(response, textStatus, jqXHR){
				if (response.status != 1) {
					atom.notifications.addError(response.message);
				} else {
					atom.notifications.addSuccess("Successful download of file.");
				}
				
			},
			error: function(jqXHR, textStatus, errorThrown){
				atom.notifications.addError(textStatus);
			}
		});
	},

	// ファイルの削除
	delete() {
		let pane = this.getTreeView();
		let path = pane.selectedPath;
		/*
		let pane = atom.workspace.getActivePaneItem();
		
		let path = "";
		if (pane == atom.workspace.getActiveTextEditor()) {
			path = pane.buffer.file.path;
		} else {
			console.log("pane", pane);
			path = pane.selectedPath;
		}
		*/
		if (path == "") {
			return;
		}
		
		filename = this.extractFilename(path);
		console.log(filename);
		
		this.restApi({
			command: "delete",
			data: {
				list: [ filename ]
			},
			success: function(response, textStatus, jqXHR){
				if (response.status != 1) {
					atom.notifications.addError(response.message);
				} else {
					atom.notifications.addSuccess(response.message);
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				atom.notifications.addError(textStatus);
			}
		});
	},
	
	// 設定
	configInfo() {
		let path = this.getRootPath();
		if (path == "") {
			return;
		}
		let p = (path.indexOf("/") != -1) ? "/" : "\\";
		let wpath = this.getConfigFilePath(path+p+"Class");
		let info = {};
		if (wpath != "") {
			path = wpath;
			info = JSON.parse(fs.readFileSync(path+'/cache-atom-studio-config.json', 'utf8'));
		}
		if (!this.modalPanel.isVisible()) {
			this.cacheAtomStudioConf.setupInfo(info);
			this.modalPanel.show();
		}
	},

	// コメントの挿入
	insertComment() {
		console.log("insertComment");
	},
	
	// REST API の実行
	restApi(param) {
		var path = this.getRootPath();
		if (path == "") {
			return;
		}
		let p = (path.indexOf("/") != -1) ? "/" : "\\";
		var info = this.getConfigInfo(path+p+"Class");
		let uri = this.getServerUri(info);
		let startUrl = uri+info.api+"start/";
		let endUrl = uri+info.api+"end/";
		ccnt.setParam({
			startUrl: startUrl,
			endUrl: endUrl
		});
		
		let defaults = {
			namespace: info.namespace
		};
		
		let data = $.extend({}, defaults, param.data);
		ccnt.connect({
			url: uri+info.api+param.command+"/",
			data: data
		}).then(function(response, textStatus, jqXHR){
			if (param.success) {
				param.success(response, textStatus, jqXHR);
			}
		}).catch(function(jqXHR, textStatus, errorThrown){
			if (param.error) {
				param.error(jqXHR, textStatus, errorThrown);
			}
		});
	},
	
	consoleWrite(lines) {
		let dock = atom.workspace.getBottomDock();
		let panes = dock.getPanes();
		let doc = undefined;
		for(i in panes) {
			if (panes[i].items.length > 0) {
				if (panes[i].items[0].getTitle() == "Caché Console") {
					doc = panes[i];
					doc.activate();
				}
			}
		}
		if (doc == undefined) {
			const cons = {
				element: this.CacheAtomStudioConsole.getElement(),
				getTitle: () => 'Caché Console',
				getURI: () => '',
				getDefaultLocation: () => 'bottom'
			}
			atom.workspace.open(cons);
			dock = atom.workspace.getBottomDock();
		}
		
		this.CacheAtomStudioConsole.writeLine(lines);
		
		if (!dock.isVisible()) {
			dock.show();
		}
	},
	
	getServerUri(conf) {
		var adh = conf.ssl ? "https://" : "http://";
		var port = (conf.port != "") ? ":"+conf.port : "";
		return adh+conf.host+port;
	},
	
	getRootPath(){
		var pane = this.getTreeView();;
		if (pane == undefined) {
			return "";
		}
		return pane.roots[0].getPath();
	},
	
	// 設定値の取得
	getConfigInfo(fullpath) {
		var path = this.getConfigFilePath(fullpath);
		var info = {
			"host":"localhost",
			"port":"57772",
			"api":"/cas-api/",
			"ssl":0,
			"namespace":"",
			"sign":"",
			"account":"",
			"pwd":"",
			"syncSaved":0
		};
		
		if (atom.config.get("cache-atom-studio.cacheServer") != "") {
			info.host = atom.config.get("cache-atom-studio.cacheServer");
		}
		if (atom.config.get("cache-atom-studio.cacheServerPort") != "") {
			info.port = atom.config.get("cache-atom-studio.cacheServerPort");
		}
		if (atom.config.get("cache-atom-studio.api") != "") {
			info.api = atom.config.get("cache-atom-studio.api");
		}
		if (atom.config.get("cache-atom-studio.ssl") != "") {
			info.ssl = (atom.config.get("cache-atom-studio.ssl") == false) ? 0 : 1;
		}
		if (atom.config.get("cache-atom-studio.syncSaved") != "") {
			info.syncSaved = (atom.config.get("cache-atom-studio.syncSaved") == false) ? 0 : 1;
		}
		if (atom.config.get("cache-atom-studio.account") != "") {
			info.account = atom.config.get("cache-atom-studio.account");
		}
		if (atom.config.get("cache-atom-studio.pwd") != "") {
			info.pwd = atom.config.get("cache-atom-studio.pwd");
		}
		if (atom.config.get("cache-atom-studio.sign") != "") {
			info.sign = atom.config.get("cache-atom-studio.sign");
		}
		
		if (atom.config.get("cache-atom-studio.extensionsPath") != "") {
			let wpath = atom.config.get("cache-atom-studio.extensionsPath");
			if (wpath.substr(0,1) == "~") {
				wpath = this.getUserHome() + wpath.substr(1);
			}
			wpath = wpath.split("\\").join("/");
			if (this.isExistFile(wpath+"/cache-atom-studio-config.json") != false) {
				let infof = JSON.parse(fs.readFileSync(wpath+'/cache-atom-studio-config.json', 'utf8'));
				info = Object.assign(info, infof);
			}
		}
		
		if (path != "") {
			if (this.isExistFile(path+"/cache-atom-studio-config.json") != false) {
				let infof = JSON.parse(fs.readFileSync(path+'/cache-atom-studio-config.json', 'utf8'));
				info = Object.assign(info, infof);
			}
		}

		return info;
	},

	getConfigFilePath(fullpath) {
		var path = "";
		if (fullpath.indexOf("\\") != -1) {
			path = fullpath.split("\\").reverse().slice(1).reverse().join("/");
		} else {
			path = fullpath.split("/").reverse().slice(1).reverse().join("/");
		}
		
		if (path == "") { return ""; }
		
		if (this.isExistFile(path+"/cache-atom-studio-config.json") == false) {
			path = this.getConfigFilePath(path);
		}
		
		return path;
	},
	
	extractFilename(path) {
		if (path == "") { return ""; }
		
		if (path.indexOf("\\") != -1) {
			path = path.split("\\").join("/");
		}
		
		var pos = path.indexOf("/Class/");
		if (pos != -1) {
			pos = pos + 7;
		} else {
			pos = path.indexOf("/Routine/");
			if (pos != -1) { pos = pos + 9; }
		}
		
		var filename = "";
		if (pos != -1) {
			path = path.substr(pos);
			filename = path.split("/").join(".");
		} else {
			filename = path.split("/")[path.split("/").length-1];
		}
		
		return filename;
	},
	
	getTreeView() {
		let pane = undefined;
		let panes = atom.workspace.getPanes();
		for (p in panes) {
			let wpane = panes[p];
			if (wpane == undefined) {
				continue;
			}
			let items = panes[p].getItems();
			for(i in items) {
				if (items[i].element.className.indexOf("tree-view") != -1) {
					pane = items[i];
					break;
				}
			}
			if (pane != undefined) {
				break;
			}
		}
		return pane;
	},
	
	isExistFile(file) {
		try {
			fs.accessSync(file);
			return true;
		} catch(err) {
			if(err.code === 'ENOENT') return false;
		}
	},
	
	getUserHome() {
		if (process.platform == "win32") {
			return process.env.USERPROFILE;
		}
		return process.env.HOME;
	}
};
