(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = window.$ = window.jQuery
},{}],2:[function(require,module,exports){
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

},{"jquery":1,"views/AppView":6}],3:[function(require,module,exports){
exports.getFilesById = function() {
  return $.ajax({
    url: 'applyController.do?listJpeg',
    data: {
      applyId: applyId
    },
    dataType: 'json',
    method: 'GET'
  });
};


},{}],4:[function(require,module,exports){
var FileItemModel;

FileItemModel = (require('models/FileItemModel')).FileItemModel;

exports.FileItemCollection = Backbone.Collection.extend({
  model: FileItemModel
});


},{"models/FileItemModel":5}],5:[function(require,module,exports){
exports.FileItemModel = Backbone.Model.extend({
  url: '',
  initialize: function() {},
  validate: function(attrs) {
    if (!attrs.inputName) {
      return layer.alert('附件名不能为空！');
    }
  }
});


},{}],6:[function(require,module,exports){
var FileItemCollection, FileItemModel, FileItemView, Service;

FileItemView = (require('views/FileItemView')).FileItemView;

FileItemModel = (require('models/FileItemModel')).FileItemModel;

FileItemCollection = (require('collections/FileItemCollection')).FileItemCollection;

Service = require('Service');

exports.AppView = Backbone.View.extend({
  initialize: function(options) {
    var files, self;
    self = this;
    files = new FileItemCollection();
    self.files = files;
    self.listenTo(files, "add", this.addOne);
    self.listenTo(files, 'reset', this.addAll);
    window.fileChangeCallback = function() {
      return self.fileChangeCallback();
    };
    return Service.getFilesById.apply(self).done(function(data) {
      if (data.success) {
        return files.reset(data.obj);
      } else {
        return layer.alert('根据单号请求附件列表失败！');
      }
    }).fail(function() {
      return layer.alert('根据单号请求附件列表失败！');
    });
  },
  events: {
    'click .add-file': 'addFile'
  },
  addFile: function() {
    return $('#hid-input-file').click();
  },
  fileChangeCallback: function() {
    var f, idx;
    f = $('#hid-input-file')[0].files[0];
    idx = layer.load('上传中');
    return $.ajax({
      url: 'http://' + document.domain + "/uploadImg",
      method: 'POST',
      contentType: 'application/octet-stream',
      dataType: 'json',
      data: f
    }).done(function(data) {
      var modTmp;
      if (data.ok) {
        modTmp = new FileItemModel({
          attachId: data.data.ATTACH_ID,
          src: data.data.PATH
        });
        return self.files.push(modTmp);
      }
    }).always(function() {
      return layer.close(idx);
    });
  },
  addOne: function(d) {
    return this.$el.find('.file-item-container:last').after(new FileItemView({
      model: d
    }).render());
  },
  addAll: function() {
    return this.files.each(this.addOne, this);
  }
});


},{"Service":3,"collections/FileItemCollection":4,"models/FileItemModel":5,"views/FileItemView":7}],7:[function(require,module,exports){
exports.FileItemView = Backbone.View.extend({
  initialize: function(options) {
    return this.listenTo(this.model, 'destroy', this.remove);
  },
  events: {
    'click .img': 'showBigImg',
    'click .delFile': 'delFile',
    'click .downloadFile': 'downloadFile'
  },
  render: function() {
    var isImage, reg, rlt, self;
    self = this;
    reg = /.*\.((jpeg)|(jpg)|(png)|(gif))/g;
    rlt = reg.exec(self.model.get('fileName'));
    isImage = (rlt != null) && rlt.length;
    return "<div class=\"file-item-container\">\n	<img class=\"" + (isImage ? 'img' : '') + "\"></img>\n	<div class=\"fun-container\">\n		<span class=\"fileName\"></span>\n		<input type=\"button\" class=\"delFile\" style=\"" + ((typeof readonly !== "undefined" && readonly !== null) && readonly ? 'display:none;' : '') + "\" value=\"删除\"/>\n		<input type=\"button\" class=\"downloadFile\" value=\"下载\"/>\n	</div>\n</div>";
  },
  showBigImg: function() {
    var self;
    self = this;
    return layer.open({
      type: 1,
      content: '#big-img-container',
      area: ['800px', '600px']
    });
  },
  delFile: function() {
    return this.model.destroy();
  },
  downloadFile: function() {
    return $.ajax({
      url: 'http://' + this.model.src,
      method: 'GET',
      contentType: 'application/octet-stream'
    });
  }
});


},{}]},{},[2]);
