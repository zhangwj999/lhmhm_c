
$(function() {
	if ( window.JpegCamera ) {
		var camera; // Initialized at the end
		var itemsSelected = [] //已选择
		var itemsSelectedNotUpload = [] //已选择未上传
		var itemsSelectedUploaded = [] //已上传


		// 上传图片
		var upload_snapshot = function() {

		};

		var upload_done = function( response ) {

		};

		var upload_fail = function(code, error, response) {

		};

		var discard_snapshot = function() {
			var element = $(".item.selected").removeClass("item selected");

			var next = element.nextAll(".item").first();

			if (!next.size()) {
				next = element.prevAll(".item").first();
			}

			if (next.size()) {
				next.addClass("selected");
				next.data("snapshot").show();
			}
			else {
				hide_snapshot_controls();
			}

			element.data("snapshot").discard();

			element.hide("slow", function() {$(this).remove()});
		};

		var hide_snapshot_controls = function() {
			$("#discard_snapshot, #upload_snapshot, #api_url").hide();
			$("#upload_result, #upload_status").html("");
		};



	}
});
