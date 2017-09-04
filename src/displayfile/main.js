$ = require( 'jquery' )
AppView = require( 'views/AppView' ).AppView

$(function(){
	var app = new AppView({el:'.divBody'});
	// 关闭
	window.closeit = function() {
		window.opener.location.href = window.opener.location.href;
		window.close();
	}
})
