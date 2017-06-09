'use babel';

import CacheAtomStudioView from './cache-atom-studio-view';
import { CompositeDisposable } from 'atom';

export default {

	config:{
		cacheServerAddress:{
			title:"Cache Server Address",
			description:"Specify the REST URL to connect with Cache.",
			type:"string",
			default:"localhost"
		},
		cacheServerPort:{
			title:"Web Port",
			description:"Specify the REST URL to connect with Cache.",
			type:"string",
			default:"57772"
		},
		cacheApiPath:{
			title:"REST API Path",
			description:"Specify the REST URL to connect with Cache.",
			type:"string",
			default:"/cas-api"
		},
		cacheSecuaFlag:{
			title:"SSL Switch",
			description:"Specify the REST URL to connect with Cache.",
			type:"boolean",
			default:"false"
		}
	},

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
		atom.workspace.observeTextEditors(function(editor){
			var uri = editor.getPath();
			var path = "http://"+atom.config.get("cache-atom-studio.cacheServerAddress")+":"+atom.config.get("cache-atom-studio.cacheServerPort")+"/csp/documatic/%25CSP.Documatic.cls?LIBRARY="
			path = path+"&CLASSNAME="+uri;
			console.log(path);
		});
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

	}

};
