(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = window.Backbone
},{}],2:[function(require,module,exports){
var App = require( 'AppView' ).AppView

$(function(){
	var app = new App( {el:'#mainForm'} );
})
},{"AppView":3}],3:[function(require,module,exports){
var $curDom, Backbone, camera, layerIdx, options, selDealedLength, selFiledLength, selLength, selUploadedLength;

Backbone = require('backbone');

selLength = 0;

selUploadedLength = 0;

selFiledLength = 0;

selDealedLength = 0;

$curDom = null;

layerIdx = null;

options = {
  shutter_ogg_url: 'http://' + document.domain + ':' + location.port + "/jpeg_camera/shutter.ogg",
  shutter_mp3_url: 'http://' + document.domain + ':' + location.port + "/jpeg_camera/shutter.mp3",
  swf_url: 'http://' + document.domain + ':' + location.port + "/jpeg_camera/jpeg_camera.swf"
};

camera = new JpegCamera("#camera", options).ready(function(info) {
  $("#take_snapshots").show();
  return $("#camera_info").html("Camera resolution: " + info.video_width + " x " + info.video_height);
});

exports.AppView = Backbone.View.extend({
  initialize: function(options) {},
  events: {
    'click #close-btn': 'closeFun',
    'click #take_snapshots': 'take_snapshots',
    'click #select_snapshot_all': 'select_snapshot_all',
    'click #select_snapshot_allunsel': 'select_snapshot_allunsel',
    'click .item': 'select_snapshot',
    'click #upload_snapshot': 'upload_snapshot',
    'click #discard_snapshot': 'discard_snapshot'
  },
  closeFun: function() {
    window.opener.location.href = window.opener.location.href;
    return window.close();
  },
  take_snapshots: function() {
    var image, snapshot;
    snapshot = camera.capture();
    if (JpegCamera.canvas_supported()) {
      return snapshot.get_canvas(this.add_snapshot);
    } else {
      image = document.createElement("img");
      image.src = "no_canvas_photo.jpg";
      return setTimeout((function() {
        return add_snapshot.call(snapshot, image);
      }), 1);
    }
  },
  add_snapshot: function(element) {
    var $camera, $container, camera_ratio, height, scroll;
    $(element).data("snapshot", this).addClass("item");
    $container = $("#snapshots").append(element);
    $camera = $("#camera");
    camera_ratio = $camera.innerWidth() / $camera.innerHeight();
    height = $container.height();
    element.style.height = "" + height + "px";
    element.style.width = "" + Math.round(camera_ratio * height) + "px";
    scroll = $container[0].scrollWidth - $container.innerWidth();
    return $container.animate({
      scrollLeft: scroll
    }, 200);
  },
  select_snapshot: function(e) {
    var $target;
    $target = $((e || window.event).target);
    return $target.toggleClass('selected');
  },
  select_snapshot_all: function() {
    return $('.item').addClass('selected');
  },
  select_snapshot_allunsel: function() {
    return $('.item').removeClass('selected');
  },
  upload_snapshot: function() {
    var $selected, api_url, self;
    self = this;
    $selected = $(".item.selected").not(".item.uploaded");
    if (!$selected || $selected.length === 0) {
      return layer.alert('请先选择一张图片！');
    } else {
      api_url = 'http://' + document.domain + ':' + location.port + $("#api_url").val();
      layerIdx = layer.load('上传中。。。');
      selLength = $selected.length;
      selUploadedLength = 0;
      selFiledLength = 0;
      selDealedLength = 0;
      return $selected.each(function(idx, dom) {
        var snapshot;
        $curDom = $(dom);
        snapshot = $(dom).data("snapshot");
        return snapshot.upload({
          api_url: api_url
        }).done(self.upload_done).fail(self.upload_fail);
      });
    }
  },
  upload_done: function(response) {
    var $canvas, rlt;
    console.log(response);
    rlt = eval('(' + response + ')');
    $canvas = $(this._extra_canvas);
    if (rlt.ok) {
      return $.ajax({
        url: 'applyController.do?upLoadJpeg',
        method: 'GET',
        dataType: 'json',
        data: {
          path: rlt.data,
          applyId: window.applyId,
          type: window.type
        }
      }).done(function(data) {
        if (data.success) {
          selUploadedLength += 1;
          layer.msg("共要上传图片" + selLength + "张，已成功上传" + selUploadedLength + "！", {
            icon: 1,
            time: 3000
          });
          $canvas.addClass('uploaded').data('id', data.obj.ID);
          return $canvas.after("<span class=\"sign\">√</span>");
        } else {
          selFiledLength += 1;
          return layer.msg('上传图片成功，插入附件表失败！', {
            icon: 2,
            time: 1000
          });
        }
      }).fail(function() {
        selFiledLength += 1;
        return layer.msg('上传图片失败！', {
          icon: 2,
          time: 1000
        });
      }).always(function() {
        selDealedLength += 1;
        if (selDealedLength === selLength) {
          layer.msg("共要上传图片" + selLength + "张，已成功上传" + selUploadedLength + "，上传结束！", {
            icon: 1,
            time: 1000
          });
          return layer.close(layerIdx);
        }
      });
    } else {
      selFiledLength += 1;
      selDealedLength += 1;
      if (selDealedLength === selLength) {
        layer.msg("共要上传图片" + selLength + "张，已成功上传" + selUploadedLength + "，上传结束！", {
          icon: 1,
          time: 1000
        });
        return layer.close(layerIdx);
      } else {
        return layer.msg('上传图片失败！', {
          icon: 2,
          time: 1000
        });
      }
    }
  },
  upload_fail: function(code, error, response) {
    selFiledLength += 1;
    selDealedLength += 1;
    if (selDealedLength === selLength) {
      layer.msg("共要上传图片" + selLength + "张，已成功上传" + selUploadedLength + "，上传结束！", {
        icon: 1,
        time: 1000
      });
      return layer.close(layerIdx);
    } else {
      return layer.msg("上传图片失败 " + code + " ( " + error + " ) ！", {
        icon: 1,
        time: 1000
      });
    }
  },
  discard_snapshot: function() {
    return layer.confirm('是否要移除选中的图片，已经上传服务器的文件也将被移除?', {
      icon: 3,
      title: '提示'
    }, function(index) {
      var $selected;
      $selected = $(".item.selected");
      $selected.each(function(idx, dom) {
        var $dom;
        $dom = $(dom);
        if ($dom.data('id')) {
          return $.ajax({
            url: 'applyController.do?deleteJpeg&id=' + $dom.data('id'),
            method: 'GET',
            dataType: 'json'
          }).done(function(data) {
            if (data.success) {
              $dom.data("snapshot").discard();
              return $dom.hide("slow", (function() {
                $(this).remove();
                return $(this).next('span').remove();
              }));
            } else {
              return layer.msg('删除服务器已上传文件失败！', {
                icom: 2,
                time: 1000
              });
            }
          }).fail(function() {
            return layer.msg('删除服务器已上传文件失败！', {
              icom: 2,
              time: 1000
            });
          });
        } else {
          $dom.data("snapshot").discard();
          return $dom.hide("slow", function() {
            return $(this).remove();
          });
        }
      });
      return layer.close(index);
    });
  }
});


},{"backbone":1}]},{},[2]);
