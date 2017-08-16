'use babel';

$ = require("../jquery-3.2.1.min.js");

let fs = require('fs');
let _path = require("path");
let shell = require('shell');
let ccnt = require('./module/cache-connect.js');
let _comment = require('./module/comment.js');

import CacheAtomStudioConf from './view/cache-atom-studio-Conf';
import CacheAtomStudioConsole from './view/cache-atom-studio-Console';
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
		insertDesc:{
			title:"Insert Description",
			description:"Insert in class description",
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
	openRootPath: "",
	
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
			let wpath = _self.getConfigFilePath(_path.join(path, "Class"));
			if (wpath != "") {
				path = wpath;
			}
			if (_self.cacheAtomStudioConf.saveConfigFile(path) != false) {
				_self.modalPanel.hide();
				atom.notifications.addSuccess("Configuration file updated.\n"+_path.join(path, "cache-atom-studio-config.json"));
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
				'cache-atom-studio:example': () => this.insertExample(),
				'core:save': () => this.updateSync()
			}),
			atom.project.onDidChangePaths(function(files){
				for (i in files) {
					fs.watch(files[i], {"recursive":true}, (e, path) => {
						_self.onPathsChanged(e, path, files[i]);
					});
				}
			}),
			atom.workspace.onDidOpen(function(e){
				if (e.uri == "atom://tree-view") {
					if (e.item.roots[0] != undefined) {
						let root = e.item.roots[0].getPath();
						if (this.openRootPath != root) {
							this.openRootPath = root;
							fs.watch(root, {"recursive":true}, (e, path) => {
								_self.onPathsChanged(e, path, root);
							});
						}
					}
				}
			})
		);
	},

	deactivate() {
		this.modalPanel.destroy();
		if (this.consolePanel != undefined) {
			this.consolePanel.destroy();
		}
		this.subscriptions.dispose();
		this.CacheAtomStudioConsole.destroy();
		this.cacheAtomStudioConf.destroy();
	},

	serialize() {
		return {
			cacheAtomStudioConfState: this.cacheAtomStudioConf.serialize(),
			cacheAtomStudioConsoleState: this.CacheAtomStudioConsole.serialize()
		};
	},

	onPathsChanged(e, path, rootPath) {
		if (e == "rename") {
			path = _path.join(rootPath, path);
			if (this.isExistFile(path) == false) {
				this.delete(path);
			}
		}
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
		if (_path.extname(path).toLowerCase() != ".cls") {
			return;
		}
		
		var confInfo = _self.getConfigInfo(path);
		
		var file = this.extractFilename(path);
		file = file.match("/*(.+?)\.[a-z]+([\?#;].*)?$")[1];
		
		let uri = this.getServerUri(confInfo);
		var path = uri+"/csp/documatic/%25CSP.Documatic.cls?LIBRARY="+confInfo.namespace+"&CLASSNAME="+file;
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
			if (pane.buffer.file != undefined) {
				path = pane.buffer.file.path;
				textSource = pane.getText();
			}
		}
		if ((path == "")||(textSource == "")) {
			return;
		}
		
		filename = this.extractFilename(path);
		
		let rootPath = this.getRootPath();
		let _self = this;
		this.restApi({
			command: "update",
			data: {
				sourceName: filename,
				source: textSource
			},
			success: function(response, textStatus, jqXHR){
				if (response.status != 1) {
					atom.notifications.addError(response.message);
				} else {
					_self.updateFiles(rootPath, response.files);
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
			if (editor.buffer.file != undefined) {
				let path = editor.buffer.file.path;
				if (this.checkTargetFile(path)) {
					this.update();
				}
			}
		}
	},
	
	// 全ソースの一括更新
	updateAll() {
		var path = this.getRootPath();
		if (path == "") {
			return;
		}
		
		let files = this.getFileItems(path);
		
		let _self = this;
		this.restApi({
			command: "update-all",
			data: {
				items: files
			},
			success: function(response, textStatus, jqXHR){
				if (response.status != 1) {
					atom.notifications.addError(response.message);
				} else {
					_self.updateFiles(path, response.files);
					_self.consoleWrite(response.log);
				}
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
		
		let _self = this;
		this.restApi({
			command: "export-all",
			data: {},
			success: function(response, textStatus, jqXHR){
				if (response.status != 1) {
					atom.notifications.addError(response.message);
				} else {
					_self.updateFiles(path, response.files);
					atom.notifications.addSuccess("Successful download of file.");
				}
			},
			error: function(jqXHR, textStatus, errorThrown){
				atom.notifications.addError(textStatus);
			}
		});
	},

	// ファイルの削除
	delete(path) {
		if (path == "") {
			return;
		}
		
		filename = this.extractFilename(path);
		
		if (this.checkTargetFile(filename) == false) {
			return;
		}
		
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
		let wpath = this.getConfigFilePath(_path.join(path, "Class"));
		let info = {};
		if (wpath != "") {
			path = wpath;
			info = JSON.parse(fs.readFileSync(_path.join(path, 'cache-atom-studio-config.json'), 'utf8'));
		}
		if (!this.modalPanel.isVisible()) {
			this.cacheAtomStudioConf.setupInfo(info);
			this.modalPanel.show();
		}
	},

	// コメントの挿入
	insertComment() {
		_comment.insert(this);
	},
	
	// サンプルコードの挿入
	insertExample() {
		_comment.insertExample(this);
	},
	
	// REST API の実行
	restApi(param) {
		var path = this.getRootPath();
		if (path == "") {
			return;
		}
		var info = this.getConfigInfo(_path.join(path, "Class"));
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
	
	updateFiles(rootPath, files) {
		if (this.isExistFile(_path.join(rootPath, "Class")) == false) {
			this.mkdirChain(_path.join(rootPath, "Class"));
		}
		if (this.isExistFile(_path.join(rootPath, "Routine")) == false) {
			this.mkdirChain(_path.join(rootPath, "Routine"));
		}
		for(i in files) {
			let filename = _path.normalize(files[i].filename);
			let source = files[i].text;
			let filepath = rootPath+filename;
			if (this.isExistFile(_path.dirname(filepath)) == false) {
				this.mkdirChain(_path.dirname(filepath));
			}
			if ((_path.extname(filepath) != "")&&(source != "")&&(source != undefined)) {
				fs.writeFileSync(filepath, source);
			}
		}
	},
	
	getFileItems(rootPath) {
		let files = [];
		let paths = ["Class", "Routine"];
		
		for(i in paths){
			let path = _path.join(rootPath, paths[i]);
			this.getFileItemEx(path, files);
		}
		
		return files;
	},
	
	getFileItemEx(dir, fileItems) {
		let files = fs.readdirSync(dir);
		let _self = this;
		files.forEach(function(file){
			let filename = _path.join(dir, file)
			if(fs.statSync(filename).isDirectory()) {
				_self.getFileItemEx(filename, fileItems);
			} else {
				if (_self.checkTargetFile(filename)) {
					let text = fs.readFileSync(filename, 'utf8');
					let item = {
						"sourceName": filename,
						"source": text
					};
					fileItems.push(item);
				}
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
			this.CacheAtomStudioConsole.emptyLog();
			dock = atom.workspace.getBottomDock();
		}
		
		if (!dock.isVisible()) {
			dock.show();
		}
		
		this.CacheAtomStudioConsole.writeLine(lines);
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
			"insertDesc":"",
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
		if (atom.config.get("cache-atom-studio.insertDesc") != "") {
			info.insertDesc = atom.config.get("cache-atom-studio.insertDesc");
		}
		
		if (atom.config.get("cache-atom-studio.extensionsPath") != "") {
			let wpath = atom.config.get("cache-atom-studio.extensionsPath");
			if (wpath.substr(0,1) == "~") {
				wpath = this.getUserHome() + wpath.substr(1);
			}
			
			if (this.isExistFile(_path.join(wpath, "cache-atom-studio-config.json")) != false) {
				let infof = JSON.parse(fs.readFileSync(_path.join(wpath, 'cache-atom-studio-config.json'), 'utf8'));
				info = Object.assign(info, infof);
			}
		}
		
		if (path != "") {
			if (this.isExistFile(_path.join(path, "cache-atom-studio-config.json")) != false) {
				let infof = JSON.parse(fs.readFileSync(_path.join(path, 'cache-atom-studio-config.json'), 'utf8'));
				info = Object.assign(info, infof);
			}
		}

		return info;
	},

	getConfigFilePath(fullpath) {
		let path = "";
		path = fullpath.split(_path.sep).reverse().slice(1).reverse().join(_path.sep);
		
		if (path == "") { return ""; }
		
		let confFile = _path.join(path, "cache-atom-studio-config.json");
		if (this.isExistFile(confFile) == false) {
			path = this.getConfigFilePath(path);
		}
		
		return path;
	},
	
	extractFilename(path) {
		if (path == "") { return ""; }
		
		var pos = path.indexOf(_path.sep+"Class"+_path.sep);
		if (pos != -1) {
			pos = pos + 7;
		} else {
			pos = path.indexOf(_path.sep+"Routine"+_path.sep);
			if (pos != -1) { pos = pos + 9; }
		}
		
		var filename = "";
		if (pos != -1) {
			path = path.substr(pos);
			filename = path.split(_path.sep).join(".");
		} else {
			filename = _path.basename(path);
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
		return fs.existsSync(file);
	},
	
	mkdirChain(path) {
		let flag = this.isExistFile(path);
		let wpath = path;
		 while(flag == false) {
			wpath = _path.dirname(wpath);
			if (wpath == "") {
				break;
			}
			flag = this.isExistFile(wpath);
		}
		if (flag == false) {
			return;
		}
		let dirs = path.split(_path.sep);
		let wpaths = wpath.split(_path.sep);
		for(var i = wpaths.length + 1; i < dirs.length + 1; i++) {
			let wpathx = _path.join.apply(null, dirs.slice(0, i));
			fs.mkdirSync(wpathx);
		}
	},
	
	checkTargetFile(file){
		let ex = _path.extname(file).toLowerCase();
		if ((ex != ".cls") && (ex != ".int") && (ex != ".mac") && (ex != ".inc")) {
			return false;
		}
		return true;
	},
	
	getUserHome() {
		if (process.platform == "win32") {
			return process.env.USERPROFILE;
		}
		return process.env.HOME;
	}
};
