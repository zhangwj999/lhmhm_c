(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = window.Backbone
},{}],2:[function(require,module,exports){
module.exports = window.$ = window.jQuery
},{}],3:[function(require,module,exports){
module.exports = window._
},{}],4:[function(require,module,exports){
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


},{}],5:[function(require,module,exports){
var FileItemModel;

FileItemModel = (require('models/FileItemModel')).FileItemModel;

exports.FileItemCollection = Backbone.Collection.extend({
  model: FileItemModel
});


},{"models/FileItemModel":6}],6:[function(require,module,exports){
exports.FileItemModel = Backbone.Model.extend({
  url: '',
  initialize: function() {},
  validate: function(attrs) {
    if (!attrs.inputName) {
      return layer.alert('附件名不能为空！');
    }
  }
});


},{}],7:[function(require,module,exports){
var APACHE_BASE;

APACHE_BASE = 'D:/apacheDoc/';

exports.getUrlByAttach = function(attach) {
  var docId, fileName;
  docId = attach.get('fileDocId');
  fileName = attach.get('fileName');
  return (docId + fileName).replace(APACHE_BASE, '');
};


},{}],8:[function(require,module,exports){
var FileItemCollection, FileItemModel, FileItemView, Service;

FileItemView = (require('views/FileItemView')).FileItemView;

FileItemModel = (require('models/FileItemModel')).FileItemModel;

FileItemCollection = (require('collections/FileItemCollection')).FileItemCollection;

Service = require('Service');

exports.AppView = Backbone.View.extend({
  initialize: function(options) {
    var files, self;
    $('#big-img-container').hide();
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
    var _handler, f, idx, xhr;
    _handler = function(event) {
      var data, modTmp, responseText, status;
      console.log(event);
      status = event.target.status;
      responseText = event.target.responseText;
      if (status >= 200 && status < 300) {
        console.log(responseText);
        data = eval('(' + responseText + ')');
        if (data.success) {
          modTmp = new FileItemModel({
            attachId: data.obj.ATTACH_ID,
            src: data.obj.PATH
          });
          layer.msg("上传成功！", {
            icon: 1,
            time: 2000
          });
          return layer.close(idx);
        }
      } else {
        layer.msg("上传失败！", {
          icon: 1,
          time: 2000
        });
        return layer.close(idx);
      }
    };
    f = $('#hid-input-file')[0].files[0];
    idx = layer.load('上传中');
    xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://' + document.domain + "/uploadImg");
    xhr.timeout = 60000;
    xhr.onload = _handler;
    xhr.onerror = _handler;
    xhr.onabort = _handler;
    return xhr.send(f);
  },
  addOne: function(d) {
    var itemView;
    itemView = new FileItemView({
      model: d
    });
    return this.$el.find('.add-file').before(itemView.render().$el);
  },
  addAll: function() {
    return this.files.each(this.addOne, this);
  }
});


},{"Service":4,"collections/FileItemCollection":5,"models/FileItemModel":6,"views/FileItemView":9}],9:[function(require,module,exports){
var $, Backbone, Utils, _;

$ = require('jquery');

_ = require('lodash');

Backbone = require('backbone');

Utils = require('utils');

exports.FileItemView = Backbone.View.extend({
  tagName: 'div',
  initialize: function(options) {
    return this.listenTo(this.model, 'destroy', this.remove);
  },
  events: {
    'click .img': 'showBigImg',
    'click .delFile': 'delFile',
    'click .downloadFile': 'downloadFile'
  },
  render: function() {
    var dom, isImage, reg, rlt, self, src;
    self = this;
    reg = /.*\.((jpeg)|(jpg)|(png)|(gif))/g;
    rlt = reg.exec(self.model.get('fileName'));
    isImage = (rlt != null) && rlt.length;
    src = Utils.getUrlByAttach(self.model);
    dom = "<img class=\"" + (isImage ? 'img' : '') + "\" src=\"/" + src + "\"></img>\n<div class=\"fun-container\">\n	<span class=\"fileName\">" + (self.model.get('fileName')) + "</span>\n	<input type=\"button\" class=\"delFile\" style=\"" + ((typeof readonly !== "undefined" && readonly !== null) && readonly ? 'display:none;' : '') + "\" value=\"删除\"/>\n	<input type=\"button\" class=\"downloadFile\" value=\"下载\"/>\n</div>";
    self.$el.html(dom).addClass('file-item-container');
    return self;
  },
  showBigImg: function(event) {
    var $target, self, src;
    self = this;
    $target = $((event || window.event).target);
    src = $target.attr("src");
    $('#bigImg').attr("src", src);
    $('#big-img-container').show();
    return layer.open({
      type: 1,
      title: '查看大图',
      content: $('#big-img-container'),
      area: ['490px', '650px']
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


},{"backbone":1,"jquery":2,"lodash":3,"utils":7}],10:[function(require,module,exports){
var AppView = require( 'views/AppView' ).AppView
var $ = require( 'jquery' )

$( function(){
	new AppView( { el:'#divBody' } )
})
},{"jquery":2,"views/AppView":8}]},{},[10]);
