(function (mui, window,fn) {
    fn.call(this, mui, window)
})(mui, window, function (mui, window) {

    var BASE = 'http://218.17.30.34:8099/';
	//var BASE = 'http://127.0.0.1:8080/';
    var local = window.localStorage;

    /*
    * @des 工具类封装
    * */
    var Utils = {
		BASE: BASE,
        // 表单正则
        reg: {
            mobile: /^1[0-9]{10}$/,
            number: /^[0-9]*$/g,
        },
        getAjax:function (url, data, callback) {
            this.ajax(url, data, callback, 'get');
        },
        postAjax:function (url, data, callback) {
            this.ajax(url, data, callback, 'post');
        },
        ajax:function (url, data, callback, type) {
//      	alert(document.cookie)
        	var header = {
        		'TOKEN': this.getToken()
        	},param = {
            	data: data,
            	type: type,
            	dataType: 'json',
            	crossDomain: true,    
            	headers: header,
            	success:function (res) {
            		//console.log(JSON.stringify(res))
            		if (res) {
            			((res.code == '200') || (res.statusCode == '200'))?callback(res):(mui.hideLoading(function () {
            				mui.toast(res.message)
            			}));
            	
            		}else {
            			//mui.toast('请联系系统管理员')
            		}
            	},
            	error:function (){
            		mui.hideLoading();
            		mui.toast('请检查网络')
            	}
           	};
           	
           	!header.TOKEN && delete param.headers;
           	
        	mui.ajax(BASE + url, param)
        },
		
        /*
        * @des 表单验证
        * @param {element} form
        * @param {Object} option
        * @return {Object | str}
        * @eg option = { // 参数中有的都是必填的
        * 	mobile: {
        * 		type: 'mobile',
        * 		reg: '', // 为空时取默认的正则
        * 		isNull: '请输入手机号',
        * 		isReg: '请输入正确的手机号'
        * 	},
        * 	code: '请输入验证码',  
        * }
        * */
        validate: function (form, option) {
          	var validate_obj = {}, str, return_str, self = this;
          	
	        for (var i in option) {
	        	return_str = validate(i, option[i]); 

				if (return_str != 'true') {
					return return_str;
				}
	      	}

	 		function validate(i, val){
	 			var value = form[i].value, err = 'true';
	 	
	 			typeof val == 'string'? (value?(validate_obj[i] = value):(err = val)):
	 				(value?(self.reg[val.type].test(value)?(validate_obj[i] = value):(err = val['isReg'])):(err = val['isNull']))
	 			return err;	
	 		}
	 		
	 		return validate_obj;	       	
        },
        
        // 基地获取
        getBaseInfoList:function (callback) {
            var param = {
                adminId: this.getAdminId()
            }, self = this;
            param.adminId && this.getAjax('record/CommonParamService/getBaseInfoList', param, function (res) {
                callback(res.selectData.baseInfoList)
			})
        },
        
        // 地块编号获取
        getFarmlandList: function (param,callback) {
        	param = mui.extend({}, param, {adminId: this.getAdminId()})
            
            this.getAjax('record/CommonParamService/getFarmlandList', param, function (res) {
                callback(res.selectData.farmlandList)
			})
        },
        
        // 品种获取
        getBreedsList: function (param, callback) {
        
        	param = mui.extend({}, param, {baseinfoId: this.getAdminId()})
        	this.getAjax('record/CommonParamService/getBreedsList',param,function (res) {
                callback(res.selectData.breedsList)
			})
        },
        
        // 种植批次获取
        getCropBatchList: function (param, callback) {
        	this.getAjax('record/CommonParamService/getCropBatchList', param, function (res) {
                callback(res.selectData.cropBatchList)
			})
        },
        
        // 施肥
        getFertilizerParam:function (callback) {
        	this.getAjax('record/CommonParamService/getFertilizerParam', {}, function (res) {
                callback(res.selectData)
			})	
        },
        
        // 施药 
        getPesticideParam:function (callback) {
        	var param = {
                baseinfoId: this.getAdminId()
            }
        
        	this.getAjax('record/CommonParamService/getPesticideParam', param, function (res) {
                callback(res.selectData)
			})
        },
        
        // 上传图片
        uploadImg: function (param, callback) {
        	
        	this.postAjax('imageUploadServlet', param, function (res) {
        		//callback(res, ele)
        	})
        },
        
        // 获取cookie
        getCookie: function (name) {
//          var arr;
//          var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
//          if (arr = document.cookie.match(reg))
//              return unescape(arr[2]);
//          else
//              return '';
            return localStorage.getItem(name)    
        },

        // 设置cookie
        setCookie: function (key, value) {
        	var d = new Date(), expires;
			
			d.setTime(d.getTime()+(365*24*60*60*1000));
			expires = "expires="+d.toGMTString();
            document.cookie = key + '=' + escape(value) + ';path=/;' + expires;
            localStorage.setItem(key, value);
        },
        
        // 清除
        // 获取adminId
        getAdminId: function () {
            return this.adminId?this.adminId:(this.adminId =  this.getCookie('adminId'));
        },
        
        // cookie中获取token
        getToken:function () {
        	return this.TOKEN?this.TOKEN:(this.TOKEN = this.getCookie('TOKEN'));
        },
              
        // 跳转页面
        hrefToPage: function (name) {
            location.href = name + '.html'
        },
        
        /*
         * @des 提取对象指定的key
         * @param {Object} param
         * @return {Object}
         * */
        getNewObj: function(param){
        	var obj = param.name;
        	var keys = param.keys, new_obj, data, new_keys = param.new_keys;
        	
        	Array.isArray(obj) && (new_obj = obj.map(function (v){
        		data = {}
        		keys.forEach(function (i, index) {
        			data[new_keys[index]] = v[i]
        		})
        		return data;
        	}))
        	
        	return new_obj
        },
        
        /*
         * @des 缓存数据
         * */
        setCacheData:function (key, data){
        	var old_data = this.getCacheData(key);
        	data = old_data?mui.extend(old_data, data):data;
        	
        	local.setItem(key, JSON.stringify(data));
        	
        },
        getCacheData:function (key){
        	return JSON.parse(local.getItem(key))
        },
      
        /*
         * @des 图片转base64
         * @param {element} ele
         * @return {string}
         * */
        imgToBase64: function (ele, callback){
        	var file = ele.files[0], self = this;
        	var render = new FileReader();
        	
        	render.onload = function (e) {
        		//self.uploadImg({adminId: self.getAdminId(), photoBinary: render.result}, callback, ele)
        		callback(render.result, ele)
        	}
        	
        	render.readAsDataURL(file);
        	
        },
        
        jumpPag: jumpPage,
        
        urlParam:function (paramName) {
        	
	        paramValue = "", isFound = !1;
	        if (window.location.search.indexOf("?") == 0 && location.search.indexOf("=") > 1) {
	            arrSource = unescape(location.search).substring(1, location.search.length).split("&"), i = 0;
	            while (i < arrSource.length && !isFound) arrSource[i].indexOf("=") > 0 && arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase() && (paramValue = arrSource[i].split("=")[1], isFound = !0), i++
	        }
	        return paramValue == "" && (paramValue = null), paramValue
	    },
	    
	    setFormData: function (form, data) {
	    	for (var i in data) {
	    		if (i in form) {
	    			form[i].value = data[i]
	    		}
	    	}
	    },
	    
	    // 自动登录
	    autoLogin:function (param) {
	    
	    	var account = param?param.mobile:this.getCookie('account') ,
	    		password = param?param.verifyCode:this.getCookie('password'), self = this;
	    	mui.showLoading('正在登录');	
	    	this.getAjax('login/AdminLoginService/login', {mobile: account, password: password}, function (res) {
                self.loginSuccess(res, account, password, param)
            })	
	    		
	    },
	    
	    // 登陆成功
	    loginSuccess: function(res, account, password, param){
        	this.setCookie('adminId', res.adminId);
        	this.setCookie('TOKEN', res.token);
        	this.setCookie('login', true);
        	this.setCookie('adminName', res.adminName);
        	this.setCacheData('userMes', {'opId': res.adminId}); 
        	
        	// cookie保存登录账号及密码
        	this.setCookie('account', account);
        	this.setCookie('password', password);
        	mui.hideLoading();	
        	console.log(document.cookie)
        	console.log(JSON.stringify(res))
        	location.href.indexOf('login')>0 && (
       				mui.openWindow({
		     			//url: Utils.BASE + 'mine.html',
		     			url:'mine.html',
		     			id: 'mine',
		     			createNew: true
		     		}));
       },
       
       // 打开相机
       getCameraImg: function (success, error) {
      		var cmr = plus.camera.getCamera(), self = this;
		    cmr.captureImage(function(p){
		    	console.log(p)
		        plus.io.resolveLocalFileSystemURL(p, function(entry){
		        
					self.imgToBase(entry.toLocalURL(), success)
		        }, function(e){
		            outLine('读取拍照文件错误：'+e.message);
		        });
		    }, function(e){
		
		    }, {filename:'_doc/camera/',index:1});	
       },
       
       imgToBase: function (path, callback) {
		    var img = new Image();
		    img.src = path;
		    img.onload = function(){
		    	var that = this;
		    	// 默认按比例压缩
		    	var w = that.width,
		        h = that.height,
		        scale = 0.8;
		     
		        var quality = 0.5;  // 默认图片质量为0.7
		        //生成canvas
		        var canvas = document.createElement('canvas');
		        var ctx = canvas.getContext('2d');
		        // 创建属性节点
		        var anw = document.createAttribute("width");
		        anw.value = w;
		        var anh = document.createAttribute("height");
		        anh.value = h;
		        canvas.setAttributeNode(anw);
		        canvas.setAttributeNode(anh); 
		        ctx.drawImage(that, 0, 0, w*0.8, h*0.8);
		     
			    // quality值越小，所绘制出的图像越模糊
			    var base64 = canvas.toDataURL('image/jpeg', quality );
			    // 回调函数返回base64的值
			    callback(base64);
		     }	
       },
       
       // 失去焦点
       blur: function (nodeList) {
       		mui.each(nodeList, function(v, i) {
       			i.blur();
       		})
       },
       
       // loading
       loading: function () {
       		var $ = mui;
       		//显示加载框
		    $.showLoading = function(message,type) {
		        if ($.os.plus && type !== 'div') {
		            $.plusReady(function() {
		                plus.nativeUI.showWaiting(message);
		            });
		        } else {
		            var html = '';
		            html += '<i class="mui-spinner mui-spinner-white"></i>';
		            html += '<p class="text">' + (message || "数据加载中") + '</p>';
		
		            //遮罩层
		            var mask=document.getElementsByClassName("mui-show-loading-mask");
		            if(mask.length==0){
		                mask = document.createElement('div');
		                mask.classList.add("mui-show-loading-mask");
		                document.body.appendChild(mask);
		                mask.addEventListener("touchmove", function(e){e.stopPropagation();e.preventDefault();});
		            }else{
		                mask[0].classList.remove("mui-show-loading-mask-hidden");
		            }
		            //加载框
		            var toast=document.getElementsByClassName("mui-show-loading");
		            if(toast.length==0){
		                toast = document.createElement('div');
		                toast.classList.add("mui-show-loading");
		                toast.classList.add('loading-visible');
		                document.body.appendChild(toast);
		                toast.innerHTML = html;
		                toast.addEventListener("touchmove", function(e){e.stopPropagation();e.preventDefault();});
		            }else{
		                toast[0].innerHTML = html;
		                toast[0].classList.add("loading-visible");
		            }
		        }   
		    };
		
		    //隐藏加载框
	      $.hideLoading = function(callback) {
	        if ($.os.plus) {
	            $.plusReady(function() {
	                plus.nativeUI.closeWaiting();
	                callback && callback()
	            });
	        } 
	        var mask=document.getElementsByClassName("mui-show-loading-mask");
	        var toast=document.getElementsByClassName("mui-show-loading");
	        if(mask.length>0){
	            mask[0].classList.add("mui-show-loading-mask-hidden");
	        }
	        if(toast.length>0){
	            toast[0].classList.remove("loading-visible");
	            callback && callback();
	        }
	      }
       }
    }
    
    
    /*
    *
    * @des 跳转详情页面
    * @param source 来源
    * @param status 状态
    * */
    function jumpPage(source, id, status) {
    	arr = ['','BatchDetail.html', 'FertilizerDetail.html', 'PesticideDetail.html', 'PickDetail.html']
    	location.href =arr[source] + '?id=' + id + '&status=' + status 
    };

    // tab切换
    (function($){
		var $tab = $('.tab-nav'), $content = $('.tab-content');
        $('.tab-nav').on('tap', '.item', function () {
        	Array.prototype.forEach.call($('.tab-nav .item'), function(v){
        		v.classList.remove('active');
        	})
        	this.classList.add('active');
        	Array.prototype.forEach.call($content, function(v){
        		v.classList.remove('active');
        	})
        	$content[$tab[0].getElementsByClassName('active')[0].getAttribute('data-index')].classList.add('active')
        });
    })(mui)
    
    ;(function (doc, win) {
	    var docEl = doc.documentElement,
	        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	        recalc = function () {
	            var clientWidth = docEl.clientWidth;
	            if (!clientWidth) return;
	            docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
	        };
	
	    recalc();
	    if (!doc.addEventListener) return;
	    win.addEventListener(resizeEvt, recalc, false);
	    // doc.addEventListener('DOMContentLoaded', recalc, false);
	    // fix by hengchuan 注释监听事件，防止页面多次重绘
	})(document, window);
	

	
    Utils.loading();
    window.Utils = Utils;
   
});