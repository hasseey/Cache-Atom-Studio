module.exports = {
	insert(_self){
		let editor = atom.workspace.getActiveTextEditor();
		if (editor != undefined) {
			path = editor.buffer.file.path;
			textSource = editor.getText();
		}
		if ((editor == "")||(editor == undefined)) {
			return;
		}
		
		let info = _self.getConfigInfo(path);
		
		let selectText = editor.getSelectedText();
		let pos = editor.getCursorBufferPosition();
		let curentRowText = editor.lineTextForBufferRow(pos.row);
		
		var dt = new Date();
		let xdate = dt.getFullYear()+"-"+(101+dt.getMonth()+"").substr(1)+"-"+(100+dt.getDate()+"").substr(1);
		
		let text = "";
		let opt = undefined;
		if (curentRowText.substr(0, "Class ".length) == "Class ") {
			//-- クラスの説明
			text = this.classDescription(editor, info, curentRowText, selectText, xdate);
		} else if ((curentRowText.substr(0, "ClassMethod ".length) == "ClassMethod ") || (curentRowText.substr(0, "Method ".length) == "Method ")) {
			//-- メソッドの説明
			text = this.methodDescription(editor, info, curentRowText, selectText, xdate);
		} else if (curentRowText.substr(0, "Parameter ".length) == "Parameter ") {
			//-- パラメータの説明
			text = this.parameterDescription(editor, info, curentRowText, selectText, xdate);
		} else if (curentRowText.substr(0, "Property ".length) == "Property ") {
			//-- プロパティの説明
			text = this.propertyDescription(editor, info, curentRowText, selectText, xdate);
		} else if (curentRowText.substr(0, "Index ".length) == "Index ") {
			//-- インデックスの説明
			text = this.indexDescription(editor, info, curentRowText, selectText, xdate);
		} else if (curentRowText.substr(0, "Query ".length) == "Query ") {
			//-- クエリの説明
			text = this.queryDescription(editor, info, curentRowText, selectText, xdate);
		} else {
			//-- その他コメントの挿入
			if (selectText == "") {
				opt = {
					"autoIndent": true,
					"autoIndentNewline": true,
					"autoDecreaseIndent": true
				};
				text = this.defaultComment(editor, info, curentRowText, selectText, xdate);
			} else {
				opt = {
					"autoIndent": true,
					"autoIndentNewline": true,
					"autoDecreaseIndent": true
				};
				pos = editor.getSelectedBufferRange().start;
				text = this.changeComment(editor, info, curentRowText, selectText, xdate, pos);
				editor.getLastSelection().deleteSelectedText();
			}
		}
		
		editor.setCursorBufferPosition([pos.row, 0]);
		editor.insertText(text, opt);
	},
	
	classDescription(editor, info, curentRowText, selectText, xdate) {
		let text = "/// <b> クラスの説明 </b> : "+xdate+" : "+info.sign+"<br>\n";
		text += "/// <br>\n";
		text += "/// "+info.insertDesc+"\n";
		return text;
	},
	
	methodDescription(editor, info, curentRowText, selectText, xdate) {
		let text = "/// <b> メソッドの説明 </b> : "+info.sign+"<br>\n";
		let methdName = curentRowText.split("(")[0].split(" ")[1];
		let args = curentRowText.split(")")[0].split("(")[1].split(",");
		let ret = curentRowText.split(")")[curentRowText.split(")").length - 1];
		ret = ret.split("[")[0].trim().split(" ")[1];
		
		text += "/// <br>\n";
		if ((args.length > 0)&&(args[0] != "")) {
			text += "/// <ul>\n";
			for (var c=0; c<args.length; c++) {
				let arg = args[c].trim();
				let argName = arg.split(" ")[0];
				let byref = (argName.toLowerCase() == "byref") ? true : false;
				let byval = (argName.toLowerCase() == "byval") ? true : false;
				let output = (argName.toLowerCase() == "output") ? true : false;
				if ((byref)||(byval)||(output)) {
					argName = arg.split(" ")[1];
				}
				let def = arg.split("=")[1];
				if ((def != "")&&(def != undefined)) {
					def = def.trim();
					def = " (初期値:"+def+")";
				} else {
					def = "";
				}
				text += "///   <li><b>"+argName+"</b>: 引数の説明"+def+" </li>\n";
			}
			text += "/// </ul>\n";
		}
		if ((ret != undefined)&&(ret != "")) {
			text += "/// 戻り値: 戻り値の説明\n";
		}
		return text;
	},
	
	parameterDescription(editor, info, curentRowText, selectText, xdate) {
		let text = "/// パラメータの説明\n";
		return text;
	},
	
	propertyDescription(editor, info, curentRowText, selectText, xdate) {
		let text = "/// プロパティーの説明\n";
		return text;
	},
	
	indexDescription(editor, info, curentRowText, selectText, xdate) {
		let text = "/// インデックスの説明\n";
		return text;
	},
	
	queryDescription(editor, info, curentRowText, selectText, xdate) {
		let text = "/// クエリの説明\n";
		return text;
	},
	
	changeComment(editor, info, curentRowText, selectText, xdate, pos) {
		let wcurent = editor.lineTextForBufferRow(pos.row);
		let p = 0;
		for (p = 0; p < wcurent.length; p++) {
			let d = wcurent.substr(p, 1);
			if ((d != " ")&&(d != "\t")) {
				break;
			}
		}
		let wselect = selectText.split("\n");
		let reg = new RegExp("^\b{"+p+",}|^\t{"+p+",}");
		for (i in wselect){
			if (reg.test(wselect[i])) {
				wselect[i] = wselect[i].substr(p);
			}
		}
		selectText = wselect.join("\n");
		let text = "// --- Start "+xdate+" : "+info.sign+"\n";
		text += "// --- Description : 追記の説明\n";
		text += "/*/\n";
		text += selectText+"\n";
		text += "//*/\n";
		text += selectText+"\n";
		text += "//*/\n";
		text += "// --- End   "+xdate+" : "+info.sign+"\n";
		return text;
	},
	
	defaultComment(editor, info, curentRowText, selectText, xdate) {
		let text = "// --- Start "+xdate+" : "+info.sign+"\n";
		text += "// --- Description : 追記の説明\n";
		text += "// --- End   "+xdate+" : "+info.sign+"\n";
		return text;
	},
	
	insertExample(_self) {
		let editor = atom.workspace.getActiveTextEditor();
		if (editor != undefined) {
			path = editor.buffer.file.path;
		}
		if ((editor == "")||(editor == undefined)) {
			return;
		}
		
		let info = _self.getConfigInfo(path);
		
		let selectText = editor.getSelectedText();
		let pos = editor.getCursorBufferPosition();
		let curentRowText = editor.lineTextForBufferRow(pos.row);
		
		if ((curentRowText.substr(0, "Class ".length) == "Class ") || (curentRowText.substr(0, "ClassMethod ".length) == "ClassMethod ") || (curentRowText.substr(0, "Method ".length) == "Method ") || (curentRowText.substr(0, "Parameter ".length) == "Parameter ") || (curentRowText.substr(0, "Property ".length) == "Property ") || (curentRowText.substr(0, "Index ".length) == "Index ") || (curentRowText.substr(0, "Query ".length) == "Query ")) {
			let text = "/// <example>\n";
			text += "/// </example>\n";
			editor.setCursorBufferPosition([pos.row, 0]);
			editor.insertText(text);
		}
	}
};
