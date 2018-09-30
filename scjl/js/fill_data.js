/*
* @des 数据填报
* @author wb
* @date 7/30
* */
(function (mui, utils, fn) {
    fn.call(this, mui, utils)
})( mui, Utils, function ($, utils) {
	
	var $form = $('.form'),
		$page = $('.fill-data'),
		$tabNav = $('.tab-nav'),
		$smallForm = $('.small-form'),
		$submit = $('#submit')[0],
		$breedsId = $('#breedsId')[0],
		$cropBatchId = $('#cropBatchId')[0],
		$cropBatchCode = $('#cropBatchCode')[0],
		$upload = $('.upload'),
		$detail = $('.detail'),
		$pickFinish = $('#pickFinish')[0],
		$preview  = $('.img-preview');
		
	// 验证表单配置
	var validateOptions = {
		fertilizerParamVal: {
   			fertilizerName: '请选择肥料名称',
   			amount: '请填写施肥量',
   			fertilizerMethodId: '请选择施肥方法',
   			fertilizerMan: '请填写施肥人',
   			fertilizerDate: '请选择施用日期'
      	},
      	PesticideParamVal:{
      		pesticideName: '请选择农药名称',
      		controlObjectId: '请选择防治对象',
      		safeDay: '请填写安全间隔期',
      		pesticideAmount: '请填写施药量',
      		pesticideConcentrationId: '请选择药物浓度',
      		pesticideMethodId: '请选择施药方式',
      		pesticideMan: '请填写施用人',
      		pesticideDate: '请填写施用日期'
      	},
      	PickParamVal:{
      		pickDate: '请选择采收日期',
      		pickAmount: '请填写才收量'
      	}
      	
	}
	
    var FillData = {
    	
    	// 填报的公共参数
    	commonParam: {
    		baseinfoId: '', // 基地id
    		farmlandId: '', // 地块id
    		breedsId: '', // 品种id
    		cropBatchId: '',// 批次id
    		opId: utils.getAdminId(), // 用户adminId
    		photoBinary: []
    	},
        init:function () {
            this.initEvent()
        	this.getInitData()
        },
        initEvent: function () {
        	var self = this, type;
        	
        	$smallForm.on('tap', '.pull', function () {
        		type = this.getAttribute('data-type');
        		self.showPull(type, self.showPullItem)
        	})
        	$form.on('tap', '.pull', function(){
        		type = this.getAttribute('data-type');
        		type == 'date'?self.showDate(this.getAttribute('data-label'), this.getAttribute('data-index')):self.showPull(type, self.showPullItem)
        		utils.blur($('input'))
        	})
        	
        	// 提交
        	$page.on('tap', '.submit', function(){
        		self['before' + this.getAttribute('data-Type')]('已提交')
        	})
        	
        	// 详情提交
        	$detail.on('tap', '.submit', function(){
        		self['before' + this.getAttribute('data-Type')]('已提交')
        	})
        	
        	// 详情删除
        	$detail.on('tap', '.delete', function(){
        		self.deleteDetail(self.id)
        	})
        	
        	// 暂存
        	$page.on('tap', '.save', function () {
        		self['before' + this.getAttribute('data-Type')]('待提交')
        	})
        	
        	$upload.on('change', 'input', function () {
        		utils.imgToBase64(this,self.setImg)
        	})
        	
			$upload.on('tap', '.camera', function () {
				var that = this;
	    		utils.getCameraImg(function(res) {
	    			self.setImg(res, that)
	    		})
			})
			
//			$tabNav.on('tap', '.item', function(){
//				if (this.getAttribute('data-index')== '2') {
//					
//					// 获取当前批次的采收状态
//					self.getCurrentCropStatus();
//				}
//			})
        },
        
        	
	    // 获取当前批次的采收状态
        getCurrentCropStatus: function(){
        	var self = this;
        	utils.getAjax('record/CommonParamService/chedkCropBatch', {cropBatchId: this.commonParam.cropBatchId}, function(res){
        		if (res.pickStatus == 'YES') {
        			$.toast(res.message);
        			$cropBatchId.innerHTML='';
        			$cropBatchCode.innerHTML = '';
        			self.commonParam.cropBatchId = '';
        			
        		}
        	})
        },
        
        getInitData:function () {
        	var self = this, id = this.id = utils.urlParam('id'), data = utils.getCacheData('userMes');
			var param = {
				baseinfoId: data.baseinfoId
			}
        	
        	// 品种
    		utils.getBreedsList({},function (data) {
    			self.breedsList = utils.getNewObj({name: data, keys: ['name', 'id'], new_keys:['text', 'value']})
    		})
    		
    		// 地块编号获取
        	utils.getFarmlandList(param,function (data) {
        		self.farmlandList = utils.getNewObj({name: data, keys: ['code','code', 'id'], new_keys:['text', 'value','id']});
        	})
        	
    		// 施肥
    		utils.getFertilizerParam(function(data){
    			
    			// 肥料名称
    			self.fertilizerList = utils.getNewObj({name: data.fertilizerList, keys:['name', 'id'], new_keys:['text', 'value']}) ; 
    			
    			// 施肥方法
    			self.fertilizerMethodList = utils.getNewObj({name:data.fertilizerMethodList, keys:['name', 'id'], new_keys:['text', 'value']});
    		})
    		
    		// 施药
    		utils.getPesticideParam(function (data) {
    			
    			// 控制对象
    			self.controlObjectList = utils.getNewObj({name: data.controlObjectList, keys:['name', 'id'], new_keys:['text', 'value']})
    			
    			// 施药浓度
    			self.pesticideConcentrationList = utils.getNewObj({name: data.pesticideConcentrationList, keys:['name', 'id'], new_keys:['text', 'value']})
    		
    			// 农药名称
    			self.pesticideList = utils.getNewObj({name: data.pesticideList, keys:['name', 'id','safeDay'], new_keys:['text', 'value','safeDay']})
    		
    			// 施药方法
    			self.pesticideMethodList = utils.getNewObj({name: data.pesticideMethodList, keys:['name', 'id'], new_keys:['text', 'value']})
    		})
    		
    		// 设置公共信息
    		this.commonParam = $.extend(this.commonParam, data);
       	
            // 显示详情信息
            id && this.showDetail(id);
        },
       	
       	// 获取种植批次
       	getCropBatchList: function (value) {
       		var self = this;
       		var param = $.extend({}, {breedsId: value},utils.getCacheData('userMes') )
    		utils.getCropBatchList (param,function (data) {
    			self.batchList = utils.getNewObj({name: data, keys:['cropBatchCode','cropBatchId'], new_keys:['text', 'value']})	
    			console.log(self.batchList)
    		})
    		
       	},
       	
       	// 施肥验证
       	beforeFertilizerParam:function (status) {
       		var str = utils.validate($form[0], validateOptions.fertilizerParamVal);
       		typeof str == 'string'? mui.toast(str):this.submitFertilizerParam(str, status);
       	},
       	
       	// 施肥提交
       	submitFertilizerParam:function (data, status) {
       		if (!this.commonParamValidate()) {
       			return;
       		}
       		console.log(this.commonParam)
       		data = $.extend(data, this.commonParam);
       		console.log(data)
       
       		data.photoBinary && (data.photoBinary = data.photoBinary.join('&&'));
       		
       		data.status = status;
       		$.showLoading('正在提交');
       		utils.postAjax('record/FertilizerRecordService/save', data, function (res) {
       			
       			$.hideLoading();
       			$.toast(res.message);
       			FillData.commonParam.photoBinary = [];
       		})
       	},
       	
       	// 施药验证
       	beforePesticideParam:function(status){
       		
       		var str = utils.validate($form[1]?$form[1]:$form[0], validateOptions.PesticideParamVal);
       		typeof str == 'string'? mui.toast(str):this.submitPesticideParam(str, status);
       	},
       	
       	// 施药提交
       	submitPesticideParam:function (data, status) {
       		if (!this.commonParamValidate()) {
       			return;
       		}
       		data = $.extend(data, this.commonParam);
       		data.photoBinary && (data.photoBinary = data.photoBinary.join('&&'));
       		data.status = status;
       		$.showLoading('正在提交');
       		utils.postAjax('record/PesticideRecordService/save', data, function (res) {
       			$.hideLoading();
       			$.toast(res.message);
       			FillData.commonParam.photoBinary = [];
       		})
       	},
       	
       	// 采收验证
       	beforePickParam:function (status) {
       		var str = utils.validate($form[2]?$form[2]:$form[0], validateOptions.PickParamVal);
       		typeof str == 'string'? mui.toast(str):this.submitPickParam(str, status);
       	},
       	
       	// 采收提交
       	submitPickParam:function (data,status) {
       		if (!this.commonParamValidate()) {
       			return;
       		}
       		
       		if ($pickFinish.checked) {
       			data.pickFinish = 'YES';
       		} else {
       			data.pickFinish = 'NO';
       		}
       		data = $.extend(data, this.commonParam);
       		data.photoBinary && (data.photoBinary = data.photoBinary.join('&&'));
       		data.status = status;
       		$.showLoading('正在提交');
       		utils.postAjax('record/PickRecordService/save', data, function (res) {
       			$.hideLoading();
       			$.toast(res.message);
       			
       		})
       	},
       	
       	// 显示下拉
       	showPull:function(str, callback) {
       		var picker = new $.PopPicker(), self = this;
       		if (str == 'batchList' && !self.commonParam.breedsId ) {
       			$.toast('请选择品种')
       		}
       		picker.setData(this[str]);
       		picker.show(function (item) {
       			
       			callback.call(self, item[0], str)
       			picker.dispose()
       		})
       	},
       	
       	// 显示选择项
       	showPullItem: function (item, str) {
       		
       		if ('text' in item) {
       		   	this['show' + str.substr(0,1).toLocaleUpperCase() + str.substr(1)](item);	
       		}
       		
       	},
       	
       	// 显示品种
   		showBreedsList:function (item) {
			breedsName.innerHTML = item.text;
			breedsName.value = item.text;
		
			$breedsId.value = this.commonParam.breedsId = item.value;
			$cropBatchCode.innerHTML = '';
			$cropBatchCode.value = '';
			$cropBatchId.value = this.commonParam.cropBatchId = '';
			this.getCropBatchList(item.value);
   		},
   		
   		// 显示批次
   		showBatchList:function (item) {
   			$cropBatchCode.innerHTML = item.text;
   			$cropBatchCode.value = item.text;
   			$cropBatchId.value = this.commonParam.cropBatchId = item.value;
   			
   			this.getCurrentCropStatus()
   		},
   		
   		// 显示肥料
   		showFertilizerList:function (item) {
   			var form = $form[0];
   		
   			form.fertilizerName.value = item.text;
   			form.fertilizerId.value = item.value;
   		},
   		
   		// 显示施肥方法
   		showFertilizerMethodList:function(item){
   			var form = $form[0];
   			form.fertilizerMethodName.value = item.text;
   			form.fertilizerMethodId.value = item.value;
   		},
   		
   		// 显示防治对象
   		showControlObjectList:function (item) {
   			var form = $form[1];
   			if (!form) {
   				form = $form[0];
   			}
   			form.controlObjectId.value = item.value;
   			form.controlObjectName.value = item.text;
   		},
   		
   		// 显示农药名称
   		showPesticideList:function(item){
   			var form = $form[1];
   			if (!form) {
   				form = $form[0];
   			}
   			form.pesticideId.value = item.value;
   			form.pesticideName.value = item.text;
   			form.safeDay.value = item.safeDay;
   		},
   		
   		// 显示施药方法
   		showPesticideMethodList:function (item) {
   			var form = $form[1];
   			if (!form) {
   				form = $form[0];
   			}
   			form.pesticideMethodId.value = item.value;
   			form.pesticideMethodName.value = item.text;
   		},
   		
   		// 显示施药浓度
   		showPesticideConcentrationList:function (item) {
   			var form = $form[1];
   			if (!form) {
   				form = $form[0];
   			}
   			form.pesticideConcentrationId.value = item.value;
   			form.pesticideConcentrationName.value = item.text;	
   		},
   		
   		// 显示地块编号
   		showFarmlandList:function(item) {
   		    var form = $form[2];
   		    if (!form) {
   				form = $form[0];
   			}
   			form.farmlandCode.value = this.commonParam.farmlandCode =item.value;
			this.commonParam.farmlandId = item.id;
   		},
   		
   		// 显示日期
   		showDate: function (str, index) {
	   		var dtpicker = new mui.DtPicker({
			    type: "date",
			}) 
			dtpicker.show(function(e) {
			    $form[index][str].value = e.value
			    dtpicker.dispose()
			}) 
   		},
   		
   		// 设置图片
       	setImg: function (res, ele) {
       		var img = new Image();
   
       		$.showLoading()
       		img.onload = function () {
       			FillData.commonParam.photoBinary.push(res);
       			$preview[ele.getAttribute('data-index')].appendChild(img)
       			$.hideLoading();
       		}
       		img.src = res;
       	},
       	
       	// 初始化详情页面
   		initDetailPage: function () {
   			var status = utils.urlParam('status');
// 			
// 			var obj = {
// 				'待提交': 1,
// 				'已提交': 2,
// 				'已核实': 3,
// 				'返回重填': 4
// 			}
  			if (status == '2' || status == '3') { 
  				$('.detail')[0].classList.add('disabled')
  			} else if (status == '1' || status == '4') {
  			
  			}
   		},
   		
       	// 显示详情
       	showDetail:function (id) {
       		var url_arr = ['record/FertilizerRecordService/load', 'record/PesticideRecordService/load','record/PickRecordService/load'];
       		var href_url = ['FertilizerDetail' ,'PesticideDetail','PickDetail'], href = location.href;
       		var self = this;
			this.initDetailPage();
       		for (var i=0 ; i< href_url.length; i ++) {
       			if (href.indexOf(href_url[i]) > -1) {
       				self['show' + href_url[i]](url_arr[i], id);
       				return 
       			}
       		}
       	
       	},
       	
       	// 删除详情
       	deleteDetail:function (id) {
       		var url_arr = ['record/FertilizerRecordService/del', 'record/PesticideRecordService/del','record/PickRecordService/del'];
       		var href_url = ['FertilizerDetail' ,'PesticideDetail','PickDetail'], href = location.href;
       		var self = this;
	
       		for (var i=0 ; i< href_url.length; i ++) {
       			if (href.indexOf(href_url[i]) > -1) {
       				self['del' + href_url[i]](url_arr[i], id);
       				return 
       			}
       		}
       	},
       	
       	// 删除施肥
       	delFertilizerDetail:function (url, id) {
       		$.showLoading('正在删除')
       		utils.getAjax(url, {fertilizerRecordId: id}, function (res) {
       			$.hideLoading()
       			$.toast(res.message)
       		})
       	},
   		showFertilizerDetail:function (url, id) {
       		var self = this, param;
       		utils.getAjax(url, {fertilizerRecordId: id}, function (res) {
       			param = res.data;
       			param.photoBinary = param.photoBinary.split('&&');
       			param = $.extend(self.commonParam,param);
       			utils.setFormData($form[0], param);
       			
       			self.showImg(param.photoBinary)
       		})
       	},
       	// 删除施药
       	delPesticideDetail:function (url, id) {
       		$.showLoading('正在删除')
       		utils.getAjax(url, {pesticideRecordId: id}, function (res) {
       			$.hideLoading()
       			$.toast(res.message)
       		})
       	},
       	showPesticideDetail:function (url, id) {
       		var self = this, param;
       		utils.getAjax(url, {pesticideRecordId: id}, function (res) {
       		
       		    param = res.data;
       			param.photoBinary = param.photoBinary.split('&&');
       			param = $.extend(self.commonParam,param);
       			utils.setFormData($form[0], param);
       			
       			self.showImg(param.photoBinary)
       		})
       	},
       	
       	// 采收删除
       	delPickDetail:function (url, id) {
       		$.showLoading('正在删除')
       		utils.getAjax(url, {pickRecordId: id}, function (res) {
       			$.hideLoading()
       			$.toast(res.message)
       		})
       	},
        showPickDetail:function (url, id) {
        	var self = this;
        	var status = utils.urlParam('status');
       		utils.getAjax(url, {pickRecordId: id}, function (res) {
       			utils.setFormData($form[0], $.extend(self.commonParam, res.data));
       			
       			res.data.pickStatus == 'YES' && $pickFinish.setAttribute('checked', 'true');
     
       			if ((status == '1') || (status == '4')) {
       				$('.mui-checkbox')[0].style.display='block'
       			}
       		})
       		
       	},
       	
        // 显示图片
   		showImg:function (data) {
   			var str = '';
   			data.forEach(function(v){
   				str+='<img src='+ v + '>'
   			})
   			$preview[0].innerHTML=str;
   		},
   		
   		// 验证品种和批次
   		commonParamValidate:function(){
   			if (!this.commonParam.breedsId) {
   				$.toast('请选择品种')
   				return
   			}
   			if (!this.commonParam.cropBatchId) {
   				$.toast('请选择批次')
   				return
   			}
   			return true;
   			
   		}
   		
    }
    
    FillData.init()
    

  
})