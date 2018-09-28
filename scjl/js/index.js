/*
* @des 批次填报
* @author wb
* @date 7/30
* */
(function (mui, utils, fn) {
    fn.call(this, mui, utils)
})( mui, Utils, function ($, utils) {
	
	var $form = $('.form'),
		$submit = $('#submit')[0],
		$preview = $('.img-preview')[0],
		paramVal = {
   			breedsName: '请选择品种',
   			breedsId: '请选择品种',
   			cropArea: '请填写种植面积',
   			cropDate: '请选择种植日期'
       	},
       	$save = $('#save')[0],
       	$del = $('#delete')[0],
       	$pickFinish = $('#pickFinish')[0];
    var $upload = $('.upload');
	
    var Batch = {
    	param: {
			baseinfoId: '',
   			breedsId: '',
   			breedsName: '',
   			cropArea: '',
   			cropDate: '',
   			opId: '',
   			photoBinary:[],
   			status: '待提交',
    	},
        init:function () {
            this.initEvent()
        	this.getInitData()
        },
        initEvent: function () {
        	var self = this, type;
        	
        	$form.on('tap', '.pull', function () {
        		type = this.getAttribute('data-type');
        		type == 'date'?self.showDate():self.showPull(type, self.showPullItem)
        		utils.blur($('input'))
        	})
        	
        	// 提交
        	$submit.addEventListener('tap', function(){
        		self.param.status = '已提交';
        		self.beforeSubmit()
        	})
        	
        	// 暂存
        	$save && $save.addEventListener('tap', function(){
        		self.param.status = '待提交';
        		self.beforeSubmit()
        	})
        	
        	// 删除
        	$del && $del.addEventListener('tap', function(){
        		self.del()
        	})
        	
        	// 上传图片
        	$upload.on('change', 'input', function (){
        		utils.imgToBase64(this, self.setImg)
        	})
        	
        	$upload.on('tap', '.camera', function () {
        		utils.getCameraImg(function(res) {
        			self.setImg(res)
        		})
        	})
        	
        	// 删除图片
//      	$preview.on('longtap', 'img', function () {
//      		
//      	})
        },
        getInitData:function () {
        	var self = this, id = this.id = utils.urlParam('id'),data = utils.getCacheData('userMes');
        	
        	// 品种
    		utils.getBreedsList( data,function (data) {
    			self.breedsList = utils.getNewObj({name: data, keys: ['name', 'id'], new_keys:['text', 'value']})
    		})
    		
    		// 设置公共信息
    		this.param = $.extend(this.param, data);
    		this.param.opId = utils.getAdminId();
    		//$form[0].farmlandId.value = data.farmlandId;
    		
    		// 详情显示
    		id && this.showBatchDetail(id);
       	},
       	
       	// 验证
       	beforeSubmit:function(){
       		var str = utils.validate($form[0], paramVal)
       		typeof str == 'string'? mui.toast(str):this.submit(str);
       	},
       	
       	// 提交
       	submit:function(data){
       		var param = $.extend({}, this.param), form = $form[0];
       		param.cropArea = form.cropArea.value;
       		param.cropDate = form.cropDate.value;
       		param.photoBinary && (param.photoBinary = param.photoBinary.join('&&'));
       		
       		this.id && (param.cropBatchId = this.id)
       		$.showLoading('正在提交');
       		utils.postAjax('record/CropBatchService/save', param, function (res) {
       			$.hideLoading()
       			$.toast(res.message);
       		
       			
       		})
       	},
       	
       	// 删除
       	del: function () {
       		var param = {cropBatchId: this.id};
       		$.showLoading('正在删除')
       		utils.postAjax('record/CropBatchService/del', param, function (res) {
       			$.hideLoading()
       			$.toast(res.message)
       		})
       	},
       	
       	// 显示下拉
       	showPull:function(str, callback) {
       		var picker = new $.PopPicker(), self = this;;
       		
       		picker.setData(this[str]);
       		picker.show(function (item) {
       			callback.call(self, item[0], str)
       			picker.dispose()
       		})
       	},
       	
       	// 设置照片
       	setImg: function (res) {
       		var img = new Image();
       		
       		$.showLoading()
       		img.onload = function () {
       			Batch.param.photoBinary.push(res);
       			$preview.appendChild(img);
       			$.hideLoading();
       		}
       		img.src = res;
      	},
       	
       	// 显示选项
       	showPullItem: function (item, key) {
  			
     		var form = $form[0], param = this.param;
  			form.breedsName.value = param.breedsName = item.text;
   			form.breedsId.value = param.breedsId =  item.value;
   		},
   		
   		// 显示日期
   		showDate: function () {
	   		var dtpicker = new mui.DtPicker({
			    type: "date",
			}), self = this; 
			dtpicker.show(function(e) {
			    $form[0].cropDate.value = self.param.cropDate =  e.value
			    dtpicker.dispose()
			}) 
   		},
   		
   		// 显示详情
   		showBatchDetail: function (id){
			var self = this, param;
   			utils.getAjax('record/CropBatchService/load', {cropBatchId: id}, function (res) {
   				
   				param = res.data;
   				//console.log(param.photoBinary)
   				param.photoBinary = param.photoBinary.split('&&');
   				
   				// 删除不需要的参数
   				delete param.updateDate;
   				delete param.createDate;
   				delete param.farmlandName;
   				delete param.cropBatchId;
   				
				$.extend(self.param, res.data);
				
   				utils.setFormData($form[0], res.data);
   				self.showImg(param.photoBinary);
   				
   				
       			res.data.pickStatus == 'YES' && ($pickFinish.style.display='flex')
   			})
   			
   			this.initDetailPage()
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
   		
   		// 显示图片
   		showImg:function (data) {
   			var str = '';
   			data.forEach(function(v){
   				str+='<img src='+ v + '>'
   			})
   			$preview.innerHTML=str;
   		}
       	
        
    }
    
    Batch.init()
    

  
})