# Cache-Atom-Studio package

This is a package for Caché development at Atom.  

Cachéサーバーと連動して、Cache Object Scriptやルーチンの更新が可能になります。

![cache-atom-studio sample-image](https://user-images.githubusercontent.com/19701801/29351193-b5ec005a-829c-11e7-85ae-926fbabd251a.png)

#### Install

1. Create an appropriate namespace on your Cache server and import the "cache-import-classes.xml" file. Three classes will be imported.  
Cacheサーバーに適当なネームスペースを作成し、"cache-import-classes.xml"ファイルをインポートします。3つのクラスがインポートされます。

2. Create a web application and specify the "cas.service.webapi.Broker" class as the dispatch class. Select "None" for "Use cookies for sessions".  
ウェブ・アプリケーションを作成し、"cas.service.webapi.Broker"クラスをディスパッチ・クラスに指定します。この時、「セッションにクッキーを使用する」は”なし”を選択します。

#### Local Setting

In the Atom-tree's root node, open "local Setting" from the context menu and specify the namespace.  
Atom-treeのルートノードでコンテキストメニューから「local Setting」を開き、ネームスペースを指定します。

#### Other
* You can not change the "Class" directory or "Routine" directory directly under the root directory.  
ルートディレクトリ直下の"Class"ディレクトリや"Routine"ディレクトリは変更出来ません。

* Compiling is executed as soon as updating the source.  
ソースを更新すると同時にコンパイルが実行されます。

* Several useful snippets are available.  
いくつかの便利なスニペットが用意されています。

* I will not be responsible if your source fails with this package.  
このパッケージでソースに障害が発生しても当方は責任を負いません。
