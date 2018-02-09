$(document).ready(function(){
    
    function reload_js(src) {
        $('script[src="' + src + '"]').remove();
        $('<script>').attr('src', src).appendTo('head');
    }
	
	var delayInMilliseconds = 100000;
	
	setTimeout(function() {
	    
	    reload_js('scripts.js');
	
	}, delayInMilliseconds);

});

var price;
var percentage;

$(document).ready(function(){

    $.ajax({
        url: 'https://api.coinbase.com/v2/prices/ETH-USD/spot',
        dataType: 'json',
        success: function(json) {

	        price = json.data.amount;
			
			if(price) { 
	            console.log(price);
	            $("#ethereum").html('$'+price);
            }
        }
    });
	
	function getYesterdaysDate() {
	    var date = new Date();
	    date.setDate(date.getDate()-1);
	    var theMonth = (date.getMonth()+1);
	    return date.getFullYear() + '-'+ (theMonth < 10 ? '0' : '') + theMonth + '-' + (date.getDate() < 10 ? '0' : '') + date.getDate();
	}
	
	var yesterday = getYesterdaysDate();
	
    $.ajax({
        url: 'https://api.coinbase.com/v2/prices/ETH-USD/spot?date='+yesterday,
        dataType: 'json',
        success: function(json) {
						
		    yesterdayPrice = json.data.amount;
	
			var delayInMilliseconds = 8000;
			
			setTimeout(function() {
				
				if(yesterdayPrice) { 
		            
		            console.log(yesterday+': '+yesterdayPrice);
	            
					priceChange = ( (100 - (yesterdayPrice / price) * 100) );
					var priceChange = Math.round( priceChange * 10 ) / 10;
		            
		            if (priceChange > 0) {
			            $("#arrow").addClass('arrowUp');
			            console.log(priceChange);
			            $("#arrow").html(priceChange);
			            $("#arrow").append('%');
		            } else if (priceChange < 0) {
			            $("#arrow").addClass('arrowDown');
						priceChange = priceChange * (-1);
			            console.log(priceChange);
			            $("#arrow").html(priceChange);
			            $("#arrow").append('%');
		            } else {
			            //do nothing
		            }
		            
		        }
        	}, delayInMilliseconds);
        }
    });


var delayInMilliseconds = 6000;

setTimeout(function() {

    $.ajax({
        url: 'https://api.nanopool.org/v1/eth/balance/[NANOPOOL ADDRESS HERE]',
        dataType: 'json',
        success: function(json) {
			
	        balance = json.data;

			if(balance) { 
	            
	            console.log(balance);
            
	            balanceDollars = balance * price;
	            
	            var shortBalance = balance.toString().slice(0, -8);
	            var shortBalanceDollars = balanceDollars.toString().slice(0, 5);
	            
	            $('#balance').html(shortBalance);
	            $('#balanceDollars').html('$'+shortBalanceDollars);
	            
	            percentage = (balance / .05) * 100;
	            console.log(percentage);
            
            }            
        }
      }, delayInMilliseconds); 
    });
});

$(document).ready(function(){

    $.ajax({
        url: '[EXTERNAL URL FOR CUSTOM PAYPAL PHP SCRIPT]',
        dataType: 'json',
        success: function(json) {

	        ppbalance = json.L_AMT0;
			
			if(ppbalance) { 
	            console.log(ppbalance);
	            $("#paypal").html('$'+ppbalance);
            }
        }
    });
}); 
   
$(document).ready(function(){
	
	var progressSelector = $(".progress-wrap");
	
	var delayInMilliseconds = 10000;
	
	setTimeout(function() {
		
		progressSelector.each(function(){
			var getPercent = percentage;
			var getSpeed = parseInt($(this).attr("data-speed"));
			var getColor = $(this).attr("data-color");
			var getHeight = $(this).attr("data-height");
			var getWidth = $(this).attr("data-width");
			$(this).css({"height":getHeight,"width":getWidth});
			$(this).find(".progress-bar").css({"background-color":"#"+getColor}).animate({ width:getPercent+'%' },getSpeed)
		});
	}, delayInMilliseconds);


	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
	  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
	];
	
	var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri",
	  "Sat"
	];
	
	var d = new Date();
	$('#month').html(monthNames[d.getMonth()]);
	$('#dayofweek').html(dayNames[d.getDay()]);
	
	var theday = d.getDate();
	
	if (theday < 10) {
		theday = '0'+theday;
	}
	
	$('#day').html(theday);
	$('#year').html(d.getFullYear());
	
});
