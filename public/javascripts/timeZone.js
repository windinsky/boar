var TimeZone = {
	init: function(con,selected){
		$(con).find('td>span').click(function(){
			var self = $(this);
			if (self.hasClass('selected')) {
				self.removeClass('selected');
			}else{
				self.addClass('selected');
			}
		});
		$('#selectBeforeDawn,#selectMorning,#selectAfternoon,#selectNight').mouseover(function(){
			$('tr').find('td:nth('+this.getAttribute('data-index')+')').addClass('hover');
		}).mouseout(function(){
			$('tr').find('td:nth('+this.getAttribute('data-index')+')').removeClass('hover');
		})
		$('#selectBeforeDawn,#selectMorning,#selectAfternoon,#selectNight').change(function(){
			var c = this.checked;
			var eles = $('tr').find('td:nth('+this.getAttribute('data-index')+') span');
			c ? eles.addClass('selected') : eles.removeClass('selected');
		});
		
		$('.select').change(function(){
			var c = this.checked;
			var eles = $(this).parents('tr').find('span');
			c ? eles.addClass('selected') : eles.removeClass('selected');
		});
		$('#selectAll').change(function(){
			var c = this.checked;
			$('.select').each(function(i,ele){
				ele.checked = c;
				$(ele).trigger('change');
			});
		}).mouseover(function(){
			$('tr').find('td:gt(1)').addClass('hover');
		}).mouseout(function(){
			$('tr').find('td:gt(1)').removeClass('hover');
		});
		if (selected) {
			var days = selected.split(',');
			for (var i=0; i < days.length; i++) {
				var str = parseInt(days[i],16).toString('2');
				for (var j = 0; j < str.length; j++){
					if (str[j]=='1') {
						console.log('tr:nth('+(i+1)+') span:nth('+(24-str.length+j)+')');
						$('tr:nth('+(i+1)+') span:nth('+(24-str.length+j)+')').trigger('click');
					};
				};
			};
		};
	},
	save: function(){
		var str = $('tr:gt(0)').map(function(i,tr){
			return parseInt($(tr).find('span').map(function(j,span){
				return $(span).hasClass('selected')? '1':'0'
			}).toArray().join(''),2).toString(16);
		}).toArray().join(',');
		$('#timeZone').val(str);
	}
}