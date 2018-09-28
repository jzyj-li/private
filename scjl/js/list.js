/*
 * @des 数据列表
 * @author wb
 * @date 7/30
 * */
(function(mui, utils, fn) {
	fn.call(this, mui, utils)
})(mui, Utils, function(mui, utils) {
	var muilist = mui('.list'),
		muiform = mui('.small-form'),
		muisearch = mui('.search'),
		muicontent = mui('.tab-content'),
		muitab = mui('.tab-nav'),
		muiClear = mui('.clear');
	var pageSize = 10,
		currentIndex = 0;
	var key = true, swiper;	
	var cacheData = utils.getCacheData('userMes')

	var searchForm = {
			cropBatch: {
				pageSize: pageSize,
				pageCurrent: 0,
				baseinfoCode: cacheData.baseinfoCode,
				baseinfoId: cacheData.baseinfoId,
				farmlandCode: cacheData.farmlandCode,
				farmlandId: cacheData.farmlandId

			},
			Fertilizer: {
				pageSize: pageSize,
				pageCurrent: 0,
				baseinfoCode: cacheData.baseinfoCode,
				baseinfoId: cacheData.baseinfoId,
				farmlandCode: cacheData.farmlandCode,
				farmlandId: cacheData.farmlandId
			},
			Pesticide: {
				pageSize: pageSize,
				pageCurrent: 0,
				baseinfoCode: cacheData.baseinfoCode,
				baseinfoId: cacheData.baseinfoId,
				farmlandCode: cacheData.farmlandCode,
				farmlandId: cacheData.farmlandId
			},
			Pick: {
				pageSize: pageSize,
				pageCurrent: 0,
				baseinfoCode: cacheData.baseinfoCode,
				baseinfoId: cacheData.baseinfoId,
				farmlandCode: cacheData.farmlandCode,
				farmlandId: cacheData.farmlandId
			}

		},
		cropBatch_html = '',
		Fertilizer_html = '',
		Pesticide_html = '',
		Pick_html = '',
		currentIndex = 0,
		searchFormKeys = ['cropBatch', 'Fertilizer', 'Pesticide', 'Pick'];

	var List = {

		init: function() {
			this.initEvent();
			this.getInitData();
			this.setDefaultDate();
			this.initList(0);
		
		},
		initEvent: function() {
			var self = this,
				type, index;

			muilist.on('tap', '.pull', function() {

				type = this.getAttribute('data-type');
				index = this.getAttribute('data-index');
				type == 'date' ? self.showDate(this.getAttribute('data-label'), index) : self.showPull(type, index, self.showPullItem)
			})

			muilist.on('tap', '.search', function() {

				$('#layoutList').html('');
				currentIndex = this.getAttribute('data-index');
				searchForm[searchFormKeys[currentIndex]].pageCurrent = 0;
				self.initList(currentIndex);
			})

			muilist.on('tap', '.right', function() {
				utils.jumpPag(this.getAttribute('source'), this.getAttribute('data-id'), this.getAttribute('status'))
			})

			muitab.on('tap', 'div', function() {

				$('#layoutList').html('');
				currentIndex = this.getAttribute('data-index');
				searchForm[searchFormKeys[currentIndex]].pageCurrent = 0;
				self.initList(currentIndex);
			})
			muilist.on('tap', '.clear', function() {

				$(this).parent().find('input').val('').end().find('label').html('');
				$(this).parent().find('.breedsName').html('品种');
				$(this).parent().find('.cropBatchName').html('种植批次');
				$(this).parent().find('.fertilizerName').html('肥料名称');
				$(this).parent().find('.pesticideName').html('农药名称');

				searchForm[searchFormKeys[currentIndex]].startDate = '';
				searchForm[searchFormKeys[currentIndex]].endDate = '';
				self.setDefaultDate()
			})

		},

		// 加载列表
		initList: function(num) {
			var arr = ['cropBatch', 'Fertilizer', 'Pesticide', 'Pick'],
				self = this;
			num = num || 0;
			self.search(arr[num], num)

		},

		load: function(callback) {
			key = false;
			oriSpeed = 300;
			var self = this;
			swiperAct = new Swiper('.swiper-container', {
				speed: oriSpeed,
				slidesPerView: 'auto',
				freeMode: true,
				direction: 'vertical',
				setWrapperSize: true,
				observer:true,//修改swiper自己或子元素时，自动初始化swiper 
				observeParents:false,
				on: {//加载更多
					momentumBounce: function() { //非正式反弹回调函数，上拉释放加载更多可参考上例
						swiper = swiperAct = this
				
						if(swiper.translate < -100) {
							swiper.allowTouchMove = false; //禁止触摸
							swiper.params.virtualTranslate = true; //定住不给回弹
							searchForm[searchFormKeys[currentIndex]].pageCurrent ++;
							self.initList(currentIndex)
						
						}
					},
				}
			});

		},

		getInitData: function() {
			var self = this;
			var param = {
				baseinfoCode: cacheData.baseinfoCode
			}

			this.cacheData = cacheData;
			// 品种
			utils.getBreedsList( cacheData,function(data) {
				self.breedsList = utils.getNewObj({
					name: data,
					keys: ['name', 'id'],
					new_keys: ['text', 'value']
				})
			})

			// 地块编号获取
			utils.getFarmlandList(param, function(data) {
				self.farmlandList = utils.getNewObj({
					name: data,
					keys: ['code', 'code', 'id'],
					new_keys: ['text', 'value', 'id']
				});
			})

			// 施肥
			utils.getFertilizerParam(function(data) {

				// 肥料名称
				self.fertilizerList = utils.getNewObj({
					name: data.fertilizerList,
					keys: ['name', 'id'],
					new_keys: ['text', 'value']
				});

				// 施肥方法
				self.fertilizerMethodList = utils.getNewObj({
					name: data.fertilizerMethodList,
					keys: ['name', 'id'],
					new_keys: ['text', 'value']
				});
			})

			// 施药
			utils.getPesticideParam(function(data) {

				// 控制对象
				self.controlObjectList = utils.getNewObj({
					name: data.controlObjectList,
					keys: ['name', 'id'],
					new_keys: ['text', 'value']
				})

				// 施药浓度
				self.pesticideConcentrationList = utils.getNewObj({
					name: data.pesticideConcentrationList,
					keys: ['name', 'id'],
					new_keys: ['text', 'value']
				})

				// 农药名称
				self.pesticideList = utils.getNewObj({
					name: data.pesticideList,
					keys: ['name', 'id'],
					new_keys: ['text', 'value']
				})

				// 施药方法
				self.pesticideMethodList = utils.getNewObj({
					name: data.pesticideMethodList,
					keys: ['name', 'id'],
					new_keys: ['text', 'value']
				})
			})

		},

		// 获取种植批次
		getCropBatchList: function(value) {
			var self = this;
			var param = mui.extend({}, {
				breedsId: value
			}, cacheData)
			utils.getCropBatchList(param, function(data) {
				self.cropBatchList = utils.getNewObj({
					name: data,
					keys: ['cropBatchCode', 'cropBatchId'],
					new_keys: ['text', 'value']
				})
			})

		},

		// 查询
		search: function(type, index) {
			var arr = ['record/CropBatchService/list', 'record/FertilizerRecordService/list', 'record/PesticideRecordService/list', 'record/PickRecordService/list'];
			var self = this;
			mui.showLoading('正在查询');
			utils.postAjax(arr[index], searchForm[searchFormKeys[index]], function(res) {

				self['show' + searchFormKeys[index] + 'List'](res, type)
			})
		},

		// 显示批次列表
		showcropBatchList: function(res, type) {

			var list = res.dataList,
				str = '',
				self = this;

			if(!list) {
				//muilist[0].querySelector('.' + type).innerHTML = '';

				mui.hideLoading()
				mui.toast('没有数据')
		
				return;
		
			};
			searchForm[searchFormKeys[currentIndex]].count = res.param.count;
			list.length ? list.forEach(function(v) {
				str += '<div class="item swiper-slide">' +
					'<div class="top">' +
					'<h5 class="title">' +
					v.cropBatchCode +
					'</h5>' +
					'<span class="date">' +
					v.cropDate +
					'</span>' +
					'</div>' +
					'<div class="bottom">' +
					'<div class="left">' +
					'<p>' + v.cropArea + ' 亩</p>' +
					'<p>' + v.status + '</p>' +
					'</div>' +
					'<div class="right" source="1" status=' + self.setDetailStatus(v.status) + ' data-id=' + v.cropBatchId + '>' +
					self.setStatus(v.status) +
					'</div>' +
					'</div>' +
					'</div>'
			}) : mui.toast('没有数据')
			mui.hideLoading();
			if(str) {
				key && $('#layoutList').append(str);

			} else {}
			if (key) {
				this.load();
				console.log('load')
			}else {
				swiperAct.appendSlide(str);
				swiperAct.allowTouchMove= true;
				swiperAct.params.virtualTranslate = false;
				console.log(swiperAct)
			}
	

		},

		// 显示施肥列表
		showFertilizerList: function(res, type) {
			var list = res.dataList,
				str = '',
				self = this;

			mui.hideLoading()
			if(!list) {
				//muilist[0].querySelector('.' + type).innerHTML = '';
				mui.hideLoading()
				mui.toast('没有数据')
				return;
			};
			
			list.length ? list.forEach(function(v) {
				str += '<div class="item swiper-slide">' +
					'<div class="top">' +
					'<h5 class="title">' +
					v.cropBatchCode +
					'</h5>' +
					'<span class="date">' +
					v.fertilizerDate +
					'</span>' +
					'</div>' +
					'<div class="bottom">' +
					'<div class="left">' +
					'<p>肥料：' + v.fertilizerName + '</p>' +
					'<p>状态：' + v.status + '</p>' +
					'</div>' +
					'<div class="right" source="2" status=' + self.setDetailStatus(v.status) + ' data-id=' + v.fertilizerRecordId + '>' +
					self.setStatus(v.status) +
					'</div>' +
					'</div>' +
					'</div>'
			}) : mui.toast('没有数据')
			if(str) {
				key && $('#layoutList').append(str);

			} else {}
			if (key) {
				this.load();
				console.log('load')
			}else {
				swiperAct.appendSlide(str);
				swiperAct.allowTouchMove= true;
				swiperAct.params.virtualTranslate = false;
				console.log(swiperAct)
			}

		},

		// 显示施药列表
		showPesticideList: function(res, type) {
			var list = res.dataList,
				str = '',
				self = this;

			mui.hideLoading()
			if(!list) {
				//muilist[0].querySelector('.' + type).innerHTML = '';
				mui.hideLoading()
				mui.toast('没有数据')
				return;
			};
	
			list.length ? list.forEach(function(v) {
				str += '<div class="item swiper-slide">' +
					'<div class="top">' +
					'<h5 class="title">' +
					v.cropBatchCode +
					'</h5>' +
					'<span class="date">' +
					v.pesticideDate +
					'</span>' +
					'</div>' +
					'<div class="bottom">' +
					'<div class="left">' +
					'<p>农药：' + v.pesticideName + '</p>' +
					'<p>状态：' + v.status + '</p>' +
					'</div>' +
					'<div class="right" source="3" status=' + self.setDetailStatus(v.status) + ' data-id=' + v.pesticideRecordId + '>' +
					self.setStatus(v.status) +
					'</div>' +
					'</div>' +
					'</div>'
			}) : mui.toast('没有数据')

				if(str) {
				key && $('#layoutList').append(str);

			} else {}
			if (key) {
				this.load();
				console.log('load')
			}else {
				swiperAct.appendSlide(str);
				swiperAct.allowTouchMove= true;
				swiperAct.params.virtualTranslate = false;
				console.log(swiperAct)
			}
		},

		// 显示采收列表
		showPickList: function(res, type) {
			var list = res.dataList,
				str = '',
				self = this;
			mui.hideLoading()
			if(!list) {
				//muilist[0].querySelector('.' + type).innerHTML = '';

				mui.hideLoading()
				mui.toast('没有数据')
				return;
			};
		
			list.length && list.forEach(function(v) {
				str += '<div class="item swiper-slide">' +
					'<div class="top">' +
					'<h5 class="title">' +
					v.cropBatchCode +
					'</h5>' +
					'<span class="date">' +
					v.pickDate +
					'</span>' +
					'</div>' +
					'<div class="bottom">' +
					'<div class="left">' +
					'<p>采收量：' + v.pickAmount + '</p>' +
					'<p>状态：' + v.status + '</p>' +
					'</div>' +
					'<div class="right" source="4" status=' + self.setDetailStatus(v.status) + ' data-id=' + v.pickRecordId + '>' +
					self.setStatus(v.status) +
					'</div>' +
					'</div>' +
					'</div>'
			})

				if(str) {
				key && $('#layoutList').append(str);

			} else {}
			if (key) {
				this.load();
				console.log('load')
			}else {
				swiperAct.appendSlide(str);
				swiperAct.allowTouchMove= true;
				swiperAct.params.virtualTranslate = false;
				console.log(swiperAct)
			}
		},

		// 显示下拉
		showPull: function(str, index, callback) {
			var picker = new mui.PopPicker(),
				self = this;
			picker.setData(this[str]);
			picker.show(function(item) {
				callback.call(self, item[0], str, index)
				picker.dispose()
			})
		},

		// 显示选择项
		showPullItem: function(item, str, index) {
			this['set' + str.substr(0, 1).toLocaleUpperCase() + str.substr(1)](item, index);
		},

		// 显示品种
		setBreedsList: function(item, index) {
			var con = muicontent[index],
				form = muiform[index];
			con.querySelector('.breedsName').innerHTML = item.text;
			form.breedsId.avlue = searchForm[searchFormKeys[index]].breedsId = item.value;
			searchForm[searchFormKeys[index]].cropBatchId = '';
			con.querySelector('.cropBatchName') && (con.querySelector('.cropBatchName').innerHTML = '');
			this.getCropBatchList(item.value)
		},
		// 显示地块编号
		setFarmlandList: function(item, index) {
			var con = muicontent[index],
				form = muiform[index];
			con.querySelector('.farmlandName').innerHTML = item.value;
			form.farmlandCode.value = searchForm[searchFormKeys[index]].farmlandCode = item.value;
			searchForm[searchFormKeys[index]].farmlandId = item.id;
		},

		// 显示批次
		setCropBatchList: function(item, index) {
			var con = muicontent[index],
				form = muiform[index];
			con.querySelector('.cropBatchName').innerHTML = item.text;
			form.cropBatchId.value = searchForm[searchFormKeys[index]].cropBatchId = item.value;
		},

		// 显示肥料
		setFertilizerList: function(item, index) {
			var con = muicontent[index],
				form = muiform[index];
			con.querySelector('.fertilizerName').innerHTML = item.text;
			form.fertilizerId.value = searchForm[searchFormKeys[index]].fertilizerId = item.value;
		},

		// 显示施肥方法
		setFertilizerMethodList: function(item) {
			var form = muiform[0];
			form.fertilizerMethodName.value = item.text;
			form.fertilizerMethodId.value = item.value;
		},

		// 显示防治对象
		controlObjectList: function(item) {
			var form = muiform[1];
			form.controlObjectId.value = item.value;
			form.controlObjectName.value = item.text;
		},

		// 显示农药名称
		setPesticideList: function(item, index) {
			var con = muicontent[index],
				form = muiform[index];
			con.querySelector('.pesticideName').innerHTML = item.text;
			form.pesticideId.value = searchForm[searchFormKeys[index]].pesticideId = item.value;
		},

		// 显示施药方法
		setPesticideMethodList: function(item) {
			var form = muiform[1];
			form.pesticideMethodId.value = item.value;
			form.pesticideMethodName.value = item.text;
		},

		// 显示施药浓度
		setPesticideConcentrationList: function(item) {
			var form = muiform[1];
			form.pesticideConcentrationId.value = item.value;
			form.pesticideConcentrationName.value = item.text;
		},

		// 设置列表显示状态
		setStatus: function(str) {
			if(str == '已提交' || str == '已核实' || str == '已审核') {
				return '查看'
			} else {
				return '编辑'
			}
		},

		// 设置详情状态
		setDetailStatus: function(str) {

			var obj = {
				'待提交': 1,
				'已提交': 2,
				'已核实': 3,
				'已审核':3,
				'返回重填': 4
			}

			return obj[str];
		},

		// 显示日期
		showDate: function(str, index) {
			var dtpicker = new mui.DtPicker({
				type: "date",
			})
			dtpicker.show(function(e) {
				muiform[index][str].value = searchForm[searchFormKeys[index]][str] = e.value;
				muicontent[index].querySelector('.' + str).innerHTML = e.value;
				dtpicker.dispose()
			})
		},

		// 设置默认搜索日期
		setDefaultDate: function() {
			var date = new Date(),
				old_date, old_m, old_y, old_d;
			var m = date.getMonth() + 1,
				y = date.getFullYear(),
				d = date.getDate()
			time = date.getTime();

			d = d >= 10 ? d : ('0' + d);
			console.log(time)
			time = time - 24 * 60 * 60 * 7 * 1000;
			console.log(time)
			old_date = new Date(time);
			old_m = old_date.getMonth() + 1;
			old_y = old_date.getFullYear();
			old_d = old_date.getDate();

			date = {
				endDate: y + '-' + m + '-' + d,
				startDate: old_y + '-' + old_m + '-' + old_d
			}

			muiform.each(function(index, v) {
				v.querySelector('.startDate').innerHTML = date.startDate;
				muiform[index].startDate.value = searchForm[searchFormKeys[index]]['startDate'] = date.startDate;

				v.querySelector('.endDate').innerHTML = date.endDate;
				muiform[index].endDate.value = searchForm[searchFormKeys[index]]['endDate'] = date.endDate;

				console.log(searchForm)
			})

		}

	}

	List.init()

})