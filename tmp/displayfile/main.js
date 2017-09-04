(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
exports = window.Backbone
},{}],2:[function(require,module,exports){
exports = window.$ = window.jQuery
},{}],3:[function(require,module,exports){
exports = window._
},{}],4:[function(require,module,exports){
$ = require( 'jquery' )
AppView = require( 'views/AppView' ).AppView

$(function(){
	var app = new AppView({el:'#files-container'});
	// 关闭
	window.closeit = function() {
		window.opener.location.href = window.opener.location.href;
		window.close();
	}
})

},{"jquery":2,"views/AppView":8}],5:[function(require,module,exports){
var $;

$ = require('jquery');

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


},{"jquery":2}],6:[function(require,module,exports){
var Backbone, FileItemModel;

Backbone = require('backbone');

FileItemModel = (require('models/FileItemModel')).FileItemModel;

exports.FileItemCollection = Backbone.Collection.extend({
  model: FileItemModel
});


},{"backbone":1,"models/FileItemModel":7}],7:[function(require,module,exports){
var Backbone;

Backbone = require('backbone');

exports.FileItemModel = Backbone.Model.extend({
  url: '',
  initialize: function() {},
  validate: function(attrs) {
    if (!attrs.inputName) {
      return layer.alert('附件名不能为空！');
    }
  }
});


},{"backbone":1}],8:[function(require,module,exports){
var $, Backbone, FileItemCollection, FileItemModel, FileItemView, Service, _;

$ = require('jquery');

_ = require('lodash');

Backbone = require('backbone');

FileItemView = (require('views/FileItemView')).FileItemView;

FileItemModel = (require('models/FileItemModel')).FileItemModel;

FileItemCollection = (require('collections/FileItemCollection')).FileItemCollection;

Service = require('Service');

exports.FileItemView = Backbone.View.extend({
  initialize: function(options) {
    var files, self;
    self = this;
    FileItemCollection(files = new FileItemCollection());
    self.files = files;
    self.listenTo(files, "add", this.addOne);
    self.listenTo(Todos, 'reset', this.addAll);
    return Service.getFilesById.apply(self).done(function(data) {
      if (data.ok) {
        return files.set(data.data);
      } else {
        return layer.alert('根据单号请求附件列表失败！');
      }
    }).fail(function() {
      return layer.alert('根据单号请求附件列表失败！');
    });
  },
  events: {
    'click .add-file': 'addFile',
    'change #hid-input-file': 'fileChangeCallback'
  },
  addFile: function() {
    return $('#hid-input-file').click();
  },
  fileChangeCallback: function() {
    var f, idx;
    f = $('#hid-input-file').files[0];
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
    return $el.find('.file-item-container:last').after(new FileItemView({
      model: d
    }).render());
  },
  addAll: function() {
    return this.files.each(this.addOne, this);
  }
});


},{"Service":5,"backbone":1,"collections/FileItemCollection":6,"jquery":2,"lodash":3,"models/FileItemModel":7,"views/FileItemView":9}],9:[function(require,module,exports){
var $, Backbone, _;

$ = require('jquery');

_ = require('lodash');

Backbone = require('backbone');

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
    rlt = reg.exec(self.get('fileName'));
    isImage = (rlt != null) && rlt.length;
    return "<div class=\"file-item-container\">\n	<img class=\"" + (isImage ? 'img' : '') + "\"></img>\n	<div class=\"fun-container\">\n		<span class=\"fileName\"></span>\n		<input type=\"button\" class=\"delFile\" style=\"" + (readonly ? 'display:none;' : '') + "\" value=\"删除\"/>\n		<input type=\"button\" class=\"downloadFile\" value=\"下载\"/>\n	</div>\n</div>";
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


},{"backbone":1,"jquery":2,"lodash":3}]},{},[4]);
