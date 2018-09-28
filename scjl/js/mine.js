/*
* @des 我的
* @author wb
* @date 7/30
* */
(function (mui, utils, fn) {
    fn.call(this, mui, utils)
})( mui, Utils, function ($, utils) {
	
	var $form = $('.form'),
		$name = $('.name')[0],
		$tel = $('.tel')[0],
		$header = $('#header'),
		$footer = $('.footer');

	
    var Mine = {
		baseinfoCode: '',
    	data: utils.getCacheData('userMes'),
        init:function () {
            this.initEvent();
        	this.getInitData();
        },
        initEvent: function () {
        	var self = this;
        	
        	$form.on('tap', '.pull', function () {
        		self.showPull(this.getAttribute('data-type'), self.showPullItem)
        	})
        	
        	$header.on('tap', 'a', function () {
        		self.loginOut()
        	})
        	
        	$footer.on('tap', 'a', function () {
        		self.beforeJump(this)	
        	})
	
        },
        getInitData:function () {
        	
        	var self = this, data = this.data, form = $form[0];
        	//console.log(data)
        	
        	// 基地列表获取
    		utils.getBaseInfoList(function (data) {
    			self.baseInfoList = utils.getNewObj({name: data, keys: ['baseinfoName', 'baseinfoCode','baseinfoId'], new_keys:['text', 'value','id']})
    		})
        	
        	// 显示登录
			loginName.innerHTML = utils.getCookie('adminName');
            // 设置初始信息
            if (data) {
                form.baseinfoCode.value = data.baseinfoCode? data.baseinfoCode:"";
        		form.baseinfoName.value = data.baseinfoName?data.baseinfoName:'';
        		form.farmlandCode.value = data.farmlandCode?data.farmlandCode:'';
				form.adminName.value = data.realname?data.realname:'';
            }
        	
        	$tel.innerHTML = utils.getCookie('account') || '';
        	
        	this.farmlandList = JSON.parse(localStorage.getItem('farmlandList')) 
       
        	
            
        },
       	beforeJump:function (val) {
       		if (!$form[0].baseinfoCode.value || !$form[0].farmlandCode.value) {
       			$.toast('请填写完整的基地信息或地块信息')
       			return;
       		}
       		location.href = val.getAttribute('data-href');
       	},
       	getFarmlandList:function () {
       		var self = this;
       		var data = {
				baseinfoId: this.baseinfoId
       		}
       		// 地块编号获取
        	utils.getFarmlandList(data,function (data) {
        		self.farmlandList = utils.getNewObj({name: data, keys: ['code', 'code', 'realname','id'], new_keys:['text', 'value', 'realname','id']});
        		localStorage.setItem('farmlandList', JSON.stringify(self.farmlandList))
        	})
       	},
       	
       	// 显示下拉
       	showPull:function(str, callback) {
       		var picker = new $.PopPicker(),self = this;;
       		console.log(this.str)
       		picker.setData(this[str]);
       		picker.show(function (item) {
       			callback.call(self, item[0], str)
       			picker.dispose()
       		})
       	},
       	
       	// 显示选项
       	showPullItem: function (item, key) {
			

     		var form = $form[0];
       		if (key == 'baseInfoList') {
       			form.baseinfoName.value = item.text;
       			form.baseinfoCode.value = this.baseinfoCode =  item.value;
       			this.baseinfoId = item.id;
       			utils.setCacheData('userMes', {baseinfoId: item.id,baseinfoName: item.text,baseinfoCode: item.value});
       			this.getFarmlandList();
       			form.farmlandCode.value = '';
       			form.adminName.value = '';
       		} else {
       			form.farmlandCode.value = item.value;
				form.adminName.value = item.realname;
				this.farmlandCode = item.value;
       			utils.setCacheData('userMes', {farmlandCode: item.value,farmlandId:item.id, realname: item.realname})
       		}
       	},
       	
       	// 退出登录
       	loginOut:function () {
       		var param = {
       			mobile: utils.getCookie('account'),
       			verifyCode: utils.getCookie('verifyCode')
       		}
       		
       		utils.postAjax('login/AdminLoginService/logout', param, function(res){
       			if (res.statusCode == 200) {
       		
       				localStorage.clear()
		            console.log(localStorage.getItem('userMes'))                                                     
       				mui.openWindow({
		     			//url: utils.BASE + 'login.html',
		     			url:'login.html',
		     			id: 'login'
		     		})
       			}
       		})
       	}
       	
        
    }
    
    Mine.init()
    

  
})