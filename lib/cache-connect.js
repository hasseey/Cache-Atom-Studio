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
			$.ajax(options).then(function(response, textStatus, jqXHR){
				defer.resolve(response, textStatus, jqXHR);
			}).catch(function(jqXHR, textStatus, errorThrown){
				defer.reject(jqXHR, textStatus, errorThrown);
			});
		}).catch(function(jqXHR, textStatus, errorThrown){
			defer.reject(jqXHR, textStatus, errorThrown);
		});
		return defer.promise();
	},
	
	ajaxOptions(options){
		options.type = "POST";
		options.url = options.url+"?CSPSHARE=1&CSPCHD="+this.cspSessionCookie;
		options.cache = false;
		options.contentType = "application/json; charset=utf-8";
		options.dataType = "json";
		if (options.data == null) {
			options.data = {};
		}
		options.data = JSON.stringify(options.data);
		
		return options;
	},
	
	endAjax(){
		var opt = this.ajaxOptions({url:this.param.endUrl, timeout:3000});
		$.ajax(opt);
	},
	
	startAjax(){
		var defer = new $.Deferred;
		var startUrl = this.param.startUrl;
		var _self = this;
		if (this.cspSessionCookie != "") {
			startUrl = startUrl+"?CSPSHARE=1&CSPCHD="+this.cspSessionCookie;
		}
		$.ajax({
			type: "POST",
			url: startUrl,
			cache: false,
			timeout: 1000,
			dataType: 'json'
		}).then(function(response, textStatus, jqXHR){
			if (_self.cspSessionCookie !== response.CSPSessionCookie) {
				_self.cspSessionCookie = response.CSPSessionCookie;
			}
			defer.resolve(response, textStatus, jqXHR);
		}).catch(function(jqXHR, textStatus, errorThrown){
			defer.reject(jqXHR, textStatus, errorThrown);
		});
		return defer.promise();
	}
};
