$(document).ready(function() {

	$('.append-new-city').click(function(){
		$('.city-selects').clone().removeClass('city-selects').addClass('city-selects-cloned').appendTo($('.select-destino'));
	});


});// FIN Document Ready