'use babel';

import CacheAtomStudioView from './cache-atom-studio-view';
import { CompositeDisposable } from 'atom';

export default {

	cacheAtomStudioView: null,
	modalPanel: null,
	subscriptions: null,

	activate(state) {
		this.cacheAtomStudioView = new CacheAtomStudioView(state.cacheAtomStudioViewState);
		this.modalPanel = atom.workspace.addModalPanel({
		item: this.cacheAtomStudioView.getElement(),
			visible: false
		});

		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		this.subscriptions = new CompositeDisposable();

		// Register command that toggles this view
		this.subscriptions.add(atom.commands.add('atom-workspace', {
			'cache-atom-studio:classDocument': () => this.classDocument(),
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
		this.cacheAtomStudioView.destroy();
	},

	serialize() {
		return {
			cacheAtomStudioViewState: this.cacheAtomStudioView.serialize()
		};
	},

	// クラスドキュメントの表示
	classDocument() {
		var _self = this;
		editor = atom.workspace.getActivePaneItem();
		file = editor.buffer.file.path;
		var confInfo = _self.getConfigInfo(file);

		file = editor.getTitle();
		file = file.match("/*(.+?)\.[a-z]+([\?#;].*)?$")[1];
		file = file.match("/*(.+?)\.[a-z]+([\?#;].*)?$")[1];

		var path = "http://"+confInfo.host+":"+confInfo.port+"/csp/documatic/%25CSP.Documatic.cls?LIBRARY="+confInfo.namespace
		path = path+"&CLASSNAME="+file;
		console.log(path);
	},

	// コンパイル
	compiler() {

	},

	// 全ソースの一括コンパイル
	compileAll() {

	},

	// 全ソースの一括エクスポート
	exportAll() {

	},

	// 設定
	configInfo() {

	},

	// コメントの挿入
	insertComment() {

	},

	// 設定値の取得
	getConfigInfo(fullpath) {
		var info = require('C:\\Database\\Ensemble\\Ensemble2017.1\\ASIBINAR\\source\\cache-atom-studio-config.json');
		/*/
		info = {
			"host":"localhost",
			"port":"57772",
			"server":"",
			"api":"/cas-api/",
			"ssl":0,
			"namespace":""
		};
		//*/
		return info;
	}
};
