'use babel';

let fs = require('fs');
let shell = require('shell');

import CacheAtomStudioConf from './cache-atom-studio-Conf';
import { CompositeDisposable } from 'atom';

export default {
	config:{
		cacheServerPort:{
			title:"Cache Web Port",
			description:"Specify the web port of Caché",
			type:"string",
			default:"57772"
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
		this.modalPanel.element.style.top = "200px";
		this.modalPanel.element.style.maxWidth = "40em";
		
		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		this.subscriptions = new CompositeDisposable();

		// Register command that toggles this view
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'cache-atom-studio:classDocument': () => this.classDocument(),
			'cache-atom-studio:update': () => this.update(),
			'cache-atom-studio:update-all': () => this.updateAll(),
			'cache-atom-studio:compile': () => this.compiler(),
			'cache-atom-studio:compile-all': () => this.compileAll(),
			'cache-atom-studio:export-all': () => this.exportAll(),
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

		var adh = confInfo.ssl ? "https://" : "http://";
		var port = (confInfo.port != "") ? ":"+confInfo.port : "";
		var path = adh+confInfo.host+port+"/csp/documatic/%25CSP.Documatic.cls?LIBRARY="+confInfo.namespace+"&CLASSNAME="+file;
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

	},

	// 全ソースの一括エクスポート
	exportAll() {
		var path = this.getRootPath();
		if (path == "") {
			return;
		}
		
		
	},

	// 設定
	configInfo() {
		var path = this.getRootPath();
		if (path == "") {
			return;
		}
		
		var info = {};
		if (this.isExistFile(path+"/cache-atom-studio-config.json") != false) {
			info = JSON.parse(fs.readFileSync(path+'/cache-atom-studio-config.json', 'utf8'));
		}
		console.log(info);
		
		if (!this.modalPanel.isVisible()) {
			this.cacheAtomStudioConf.setupInfo(info);
			this.modalPanel.show();
		}
	},

	// コメントの挿入
	insertComment() {

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
			"server":"",
			"api":"/cas-api/",
			"ssl":0,
			"namespace":"",
			"sign":"",
			"account":"",
			"pwd":""
		};
		
		if (atom.config.get("cache-atom-studio.cacheServerPort") != "") {
			info.port = atom.config.get("cache-atom-studio.cacheServerPort");
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
			/*
			var infof = require(path+'/cache-atom-studio-config.json');
			delete require.cache[path+'/cache-atom-studio-config.json'];
			*/
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
