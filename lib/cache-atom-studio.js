'use babel';

$ = require("../jquery-3.2.1.min.js");

let fs = require('fs');
let shell = require('shell');
let ccnt = require('./cache-connect');

import CacheAtomStudioConf from './cache-atom-studio-Conf';
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
		}
	},
	
	cacheAtomStudioView: null,
	modalPanel: null,
	subscriptions: null,

	activate(state) {
		this.cacheAtomStudioConf = new CacheAtomStudioConf(state.cacheAtomStudioConfState);
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

		// Register command that toggles this view
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'cache-atom-studio:classDocument': () => this.classDocument(),
			'cache-atom-studio:upload': () => this.update(),
			'cache-atom-studio:upload-all': () => this.updateAll(),
			'cache-atom-studio:download-all': () => this.exportAll(),
			'cache-atom-studio:config': () => this.configInfo(),
			'cache-atom-studio:comment': () => this.insertComment()
		}));
	},

	deactivate() {
		this.modalPanel.destroy();
		this.subscriptions.dispose();
		this.cacheAtomStudioConf.destroy();
	},

	serialize() {
		return {
			cacheAtomStudioConfState: this.cacheAtomStudioConf.serialize()
		};
	},

	// クラスドキュメントの表示
	classDocument() {
		var _self = this;
		pane = atom.workspace.getActivePaneItem();
		
		var path = "";
		if (pane == atom.workspace.getActiveTextEditor()) {
			path = pane.buffer.file.path;
		} else {
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

	},

	// 全ソースの一括更新
	updateAll() {
		var path = this.getRootPath();
		if (path == "") {
			return;
		}
		
		
	},

	// コンパイル
	compiler() {

	},

	// 全ソースの一括コンパイル
	compileAll() {
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
		
		ccnt.connect({
			url: uri+info.api+"export-all/",
			data: {
				namespace: info.namespace,
				directory: path
			}
		}).then(function(response, textStatus, jqXHR){
			
		}).catch(function(jqXHR, textStatus, errorThrown){
			
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
				
			},
			error: function(jqXHR, textStatus, errorThrown){
				
			}
		});
		
		/*
		let p = (path.indexOf("/") != -1) ? "/" : "\\";
		var info = this.getConfigInfo(path+p+"Class");
		let uri = this.getServerUri(info);
		let startUrl = uri+info.api+"start/";
		let endUrl = uri+info.api+"end/";
		ccnt.setParam({
			startUrl: startUrl,
			endUrl: endUrl
		});
		
		ccnt.connect({
			url: uri+info.api+"export-all/",
			data: {
				namespace: info.namespace,
				directory: path
			}
		}).then(function(response, textStatus, jqXHR){
			
		}).catch(function(jqXHR, textStatus, errorThrown){
			
		});
		*/
	},

	// ファイルの削除
	delete() {
		
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
			if (textStatus == "timeout") {
				atom.notifications.addError("Could not connect to Caché server.");
			}
			if (param.error) {
				param.error(jqXHR, textStatus, errorThrown);
			}
		});
	},
	
	getServerUri(conf) {
		var adh = conf.ssl ? "https://" : "http://";
		var port = (conf.port != "") ? ":"+conf.port : "";
		return adh+conf.host+port;
	},
	
	getRootPath(){
		var pane = null;
		var panes = atom.workspace.getPanes();
		for (i in panes) {
			var wpane = panes[i];
			if (wpane == undefined) {
				continue;
			}
			if (wpane.activeItem == undefined) {
				continue;
			}
			if (wpane.activeItem.element.className.indexOf("tree-view") != -1) {
				pane = wpane;
				break;
			}
		}
		if (pane == null) {
			return "";
		}
		
		return pane.activeItem.roots[0].getPath();
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
			"pwd":""
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
		if (atom.config.get("cache-atom-studio.account") != "") {
			info.account = atom.config.get("cache-atom-studio.account");
		}
		if (atom.config.get("cache-atom-studio.pwd") != "") {
			info.pwd = atom.config.get("cache-atom-studio.pwd");
		}
		if (atom.config.get("cache-atom-studio.sign") != "") {
			info.sign = atom.config.get("cache-atom-studio.sign");
		}
		
		if (path != "") {
			var infof = JSON.parse(fs.readFileSync(path+'/cache-atom-studio-config.json', 'utf8'));
			info = Object.assign(info, infof);
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
	
	isExistFile(file) {
		try {
			fs.accessSync(file);
			return true;
		} catch(err) {
			if(err.code === 'ENOENT') return false;
		}
	}
};
