module.exports = {
	defaults: {
		startUrl:"api/connect/start/",
		endUrl:"api/connect/end/"
	},
	
	param: null,
	cspSessionCookie: "",
	
	setParam(option){
		this.param = $.extend({}, this.defaults, option);
	},
	
	connect(options){
		var defer = new $.Deferred;
		var _self = this;
		
		this.startAjax().then(function(response, textStatus, jqXHR){
			options = _self.ajaxOptions(options);
			
			_self.ajax(options).then(function(response, textStatus, jqXHR){
				defer.resolve(response, textStatus, jqXHR);
			}).catch(function(jqXHR, textStatus, errorThrown){
				defer.reject(jqXHR, textStatus, errorThrown);
			});
		}).catch(function(jqXHR, textStatus, errorThrown){
			defer.reject(jqXHR, textStatus, errorThrown);
		});
		
		return defer.promise();
	},
	
	startAjax(){
		var defer = new $.Deferred;
		var startUrl = this.param.startUrl;
		var _self = this;
		if (this.cspSessionCookie != "") {
			startUrl = startUrl+"?CSPSHARE=1&CSPCHD="+this.cspSessionCookie;
		}
		
		this.ajax({
			type: "POST",
			url: startUrl,
			timeout: 1000,
			dataType: "json"
		}).then(function(response, textStatus, jqXHR){
			if (_self.cspSessionCookie !== response.CSPSessionCookie) {
				_self.cspSessionCookie = response.CSPSessionCookie;
			}
			defer.resolve(response, textStatus, jqXHR);
		}).catch(function(jqXHR, textStatus, errorThrown){
			if (textStatus == "timeout") {
				textStatus = "Could not connect to Cache server.";
			}
			defer.reject(jqXHR, textStatus, errorThrown);
		});
		
		return defer.promise();
	},
	
	endAjax(){
		var opt = this.ajaxOptions({url:this.param.endUrl, timeout:3000});
		this.ajax(opt);
	},
	
	ajax(options){
		var defer = new $.Deferred;
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {
			var READYSTATE_COMPLETED = 4;
			var HTTP_STATUS_OK = 200;
			
			if (this.readyState == READYSTATE_COMPLETED) {
				var textStatus = this.statusText;
				var jqXHR = this;
				
				if (this.status == HTTP_STATUS_OK) {
					var response = this.response;
					defer.resolve(response, textStatus, jqXHR);
				} else {
					var errorThrown = "";
					defer.reject(jqXHR, textStatus, errorThrown);
				}
			}
		};
		xhr.ontimeout = function(e) {
			var textStatus = "timeout";
			var jqXHR = this;
			var errorThrown = e;
			defer.reject(jqXHR, textStatus, errorThrown);
		};
		xhr.responseType = options.dataType;
		if (options.timeout != null) {
			xhr.timeout = options.timeout;
		}
		xhr.open(options.type, options.url, true);
		xhr.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		xhr.send(options.data);
		
		return defer.promise();
	},
	
	ajaxOptions(options){
		options.type = "POST";
		options.url = options.url+"?CSPSHARE=1&CSPCHD="+this.cspSessionCookie;
		options.cache = false;
		options.contentType = "application/json; charset=utf-8";
		options.dataType = "json";
		if (options.data != null) {
			options.data = JSON.stringify(options.data);
		}
		
		return options;
	}
};
