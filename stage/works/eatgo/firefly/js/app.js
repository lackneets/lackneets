"use strict";

var disabledRegions = ['蘭嶼', '金門', '澎湖'];
var regionSort = '基隆,臺北,桃園,新竹,苗栗,臺中,彰化,南投,雲林,嘉義,臺南,高雄,屏東,臺東,花蓮,宜蘭,馬祖,連江,綠島';
var titleSVGString = '臺北桃園新竹苗栗臺中馬祖彰化雲林嘉義臺南高雄屏東臺東綠島花蓮宜蘭南投基隆';

var FirebugView = Backbone.View.extend({

	el: 'body',

	events: {
		'click #content ul.town li': 'selectTown',
		'click #share-btn a': 'shareTo'
	},

	initialize: function () {
		_.bindAll(this, 'initMap', 'render', 'loadOutlineSVG', 'loadData');

		var self = this;

		this.fireflyPlace = {};

		this.loadOutlineSVG(function () {
			self.initMap();
			self.loadData(function () {
				self.render();
			});
		});
		//this.initMap();
		//this.$el.find('#taiwan-map-wrapper').hide();
		this.selectedRegion = null;
		this.selectedTown = null;

	},

	render: function () {
		//this.$el.find('#taiwan-map-wrapper').show();
		this.renderRegionDropdown();
		//choose 苗栗 as default
		$('.jvectormap-container [data-code="苗栗"]').click();

	},

	shareTo: function (ev) {
		var pageUrl = location.protocol + '//' + location.host + '/' + location.pathname;
		switch (ev.currentTarget.getAttribute('class')) {
		case 'btn-fb':
			window.open('//www.facebook.com/sharer.php?u=' + encodeURIComponent(pageUrl + '?from=fb_share_web'));
			break;
		case 'btn-weibo':
			//_gaq.push(['_trackEvent', 'Web-Share','Weibo-Share','http://www.ettoday.net/news/20140430/352037.htm']);
			window.open('http://v.t.sina.com.cn/share/share.php?title='.concat(encodeURIComponent(document.title)).concat('&url=').concat(encodeURIComponent(pageUrl + '?from=weibo_share_web')));
			break;
		}
	},

	renderRegionDropdown: function () {
		var self = this;
		_(this.fireflyPlace).each(function (towns, regionName) {
			var option = $('<option/>', {
				text: regionName,
				value: regionName
			}).appendTo(self.$el.find('#region-select'));
		});
		self.$el.find('#region-select').on('change', function () {
			self.selectRegion(this.value);
		})
	},

	renderPlaces: function () {
		var self = this;
		self.$el.find('#content ul.data').empty();
		_(this.fireflyPlace[this.selectedRegion][this.selectedTown]).each(function (data, townName) {
			data.place = data.place.replace(/逸客/, '');
			var place = $('<li/>', {
				html: $('<a/>', {
					href: '//www.google.com/search?q=' + data.place,
					//href: data.url + '?from=firefly',
					text: data.place,
					target: '_blank'
				})
				//,attr: {'data-town': townName, 'data-region': places && places[0].region}
			}).appendTo(self.$el.find('#content ul.data'))
			if (String(data.url).match('www.eatgovillas.com')) {
				place.addClass('eatgovillas');
			}
		});
		this.$el.find('#content ul.data').mCustomScrollbar({
			scrollInertia: 200,
			autoHideScrollbar: true
		});
	},

	renderTown: function () {
		var self = this;
		self.$el.find('#content ul.town').empty();
		_(this.fireflyPlace[this.selectedRegion]).each(function (places, townName) {
			var town = $('<li/>', {
				html: $('<a>' + townName + '</a>'),
				attr: {
					'data-town': townName,
					'data-region': places && places[0].region
				}
			}).appendTo(self.$el.find('#content ul.town'))
		});
		this.$el.find('#content ul.town').mCustomScrollbar({
			scrollInertia: 200,
			autoHideScrollbar: true
		});
		self.$el.find('#content ul.town li:first').click();
	},

	loadData: function (callback) {
		var self = this;;
		$.getJSON('data/firefly.json', function (data) {
			self.fireflyPlace = _(data).chain()
				.groupBy(function (e) {
					return e.region
				})
				.pairs(function () {})
				.sortBy(function (e) {
					return regionSort.indexOf(e[0]);
				})
				.each(function (e) {
					return e[1] = _(e[1]).groupBy(function (e) {
						return e.town
					})
				})
				.object().value();
			callback && callback();
		});
	},

	loadOutlineSVG: function (callback) {
		$.getJSON('data/taiwan-outline-font.svg.json', function (data) {
			$(data).each(function (i, p) {
				var id = 'svg_' + i
				id = (i == 36) ? '馬祖半島' : id;
				id = (i == 37) ? '金門半島' : id;
				jvm.WorldMap.maps['taiwan-outline'].paths[id] = {
					name: id,
					path: p.path
				}
			});
			callback && callback();
		});
	},

	initMap: function () {

		var self = this;

		var vMap = this.vMap = new jvm.WorldMap({
			container: $('#taiwan-map'),
			map: 'taiwan-outline',
			backgroundColor: 'none',
			zoomMax: 1,
			regionStyle: {
				initial: {
					'fill': '#FFF',
					'fill-opacity': 0,
					'stroke': '#959595',
					'stroke-width': 1,
					'stroke-opacity': 1
				},
				hover: {
					'fill-opacity': 0,
					'stroke-width': 2,
					'stroke': '#99CC00',
				},
				selected: {
					'fill': '#DDD',
					'stroke-width': 2,
					'stroke': '#99CC00',
					'fill-opacity': 1,
				}
			}
		});
		for (var i = 0; i < 36; i++) {
			vMap.regions['svg_' + i].element.setStyle({
				'stroke': '#959595',
				'stroke-width': 0,
				'fill': '#FFF',
				"fill-opacity": 1
			});
			//Eat overlayer event
			$(vMap.regions['svg_' + i].element.node).unbind('mouseover click').bind('mouseover click', function (ev) {
				ev.stopPropagation();
				return false;
			})
		}

		for (var i in {
			'馬祖半島': '',
			'金門半島': ''
		}) {
			vMap.regions[i].element.setStyle({
				'stroke': '#959595',
				'stroke-width': 1
			});
			//Eat overlayer event
			$(vMap.regions[i].element.node).unbind('mouseover click').bind('click', function (ev) {
				if (this.getAttribute('data-code') == '馬祖半島') { //Faward event
					$(vMap.regions['馬祖'].element.node).trigger(ev.type)
				}
				ev.stopPropagation();
				return false;
			})
		}

		// set cursor
		$('.jvectormap-container [data-code]:not([data-code^="svg"])').css('cursor', 'pointer');

		// disabled region
		$([vMap.regions['蘭嶼'].element.node, vMap.regions['金門'].element.node, vMap.regions['澎湖'].element.node]).unbind('mouseover click').bind('click', function (ev) {
			ev.stopPropagation();
			return false;
		});

		// no hover effect on disabled regions, no label by default
		$('.jvectormap-container [data-code]').on('mouseover', function (ev) {
			var code = this.getAttribute('data-code');
			if (code.match(/蘭嶼|金門|澎湖/)) {
				$(this).css('cursor', 'default')
				vMap.regions[code].element.style.hover = vMap.regions[code].element.style.initial
				setTimeout(function () {
					// show label with message on disables regions
					$('.jvectormap-label').text(code + '：這裡沒有螢火蟲相關資訊唷').css('visibility', 'visible');
				}, 50)
			} else {
				$('.jvectormap-label').css('visibility', 'hidden');
			}
		});

		// mouse over hightlight font
		$(document).on('mouseenter mouseleave', '.jvectormap-container [data-code]', function (ev) {
			var code = this.getAttribute('data-code');
			var fonts = self.getFontElements(code);

			if (fonts.current.length == 0) {
				return false
			}

			if (ev.type == 'mouseenter' && code.match(/蘭嶼|金門|澎湖/)) {
				ev.preventDefault();
				return false;
			}

			if (ev.type == 'mouseenter') {
				vMap.regions[code].element.fontStyle = $.extend({}, fonts.current[0].style.current);
			}

			$(fonts.current).each(function (i, el) {
				if (ev.type == 'mouseleave' && !vMap.regions[code].element.isSelected) {
					el.setStyle(vMap.regions[code].element.fontStyle);
				} else if (ev.type == 'mouseleave' && code == '南投')
					el.setStyle({
						'stroke': '#000',
						'fill': '#000'
					});
				else {
					el.setStyle({
						'stroke': ev.type == 'mouseenter' ? '#99CC00' : '#FFFFFF',
						'fill': ev.type == 'mouseenter' ? '#99CC00' : '#FFFFFF'
					});
				}

			});
		});

		// listen click event
		$(document).on('click', '.jvectormap-container [data-code]', function () {
			var region = this.getAttribute('data-code');
			self.selectRegion(region);
		});

	},

	selectTown: function (ev) {

		$(ev.currentTarget).siblings().removeClass('current');
		$(ev.currentTarget).addClass('current');

		this.selectedTown = ev.currentTarget.getAttribute('data-town');
		this.renderPlaces();
	},

	selectRegion: function (region) {
		var self = this;
		if (self.selectedRegion != region) {
			//region changed
			self.selectedRegion = region;
			self.selectedTown = null;
			self.onRegionChanged(region);
			self.vMap.clearSelectedRegions();
			self.vMap.setSelectedRegions(region);

			for (var i = 0, a = titleSVGString.indexOf(region), b = a + region.length; a > -1 && i < titleSVGString.length; i++) {
				if (a == -1) {
					break;
				}
				if (i < a || i >= b) {
					self.vMap.regions['svg_' + i].element.setStyle({
						'stroke': '#444444',
						'fill': '#444444'
					});
				} else {
					self.vMap.regions['svg_' + i].element.setStyle({
						'stroke': (i == 32 || i == 33) ? '#000' : '#FFF',
						'fill': (i == 32 || i == 33) ? '#000' : '#FFF'
					});
				}
			}

			//連動dropdown
			$('#region-select option[value="' + region + '"]').prop('selected', true);
			//render town
			self.renderTown();

		}
	},

	onRegionChanged: function (region) {

	},

	getFontElements: function (region) {
		var el = {
			current: [],
			other: []
		};
		for (var i = 0, a = titleSVGString.indexOf(region), b = a + region.length; a > -1 && i < titleSVGString.length; i++) {
			if (i < a || i >= b) {
				el.other.push(this.vMap.regions['svg_' + i].element);
			} else {
				el.current.push(this.vMap.regions['svg_' + i].element);
			}
		}
		return el;
	}

});

$(function () {

	new FirebugView();

});