$(document).ready(function() {

    mapHostels();

	$('.btn-masfiltros').click(function(e){
		e.preventDefault();
		var $filtros = $(".filtros .sections");
        var contentHeight = $filtros.addClass('heightAuto').height();
        $filtros.removeClass('heightAuto').animate({ 
            height: (contentHeight == $filtros.height() ? 90 : contentHeight)
        }, 500);

        if ($(this).hasClass('menosfiltros') ) {
        	$(this).html('Mas filtros <span class="icon-keyboard_arrow_down"></span>');
        } else {
        	$(this).html('Menos filtros <span class="icon-keyboard_arrow_up"></span>');
        };
        $( this ).toggleClass( "menosfiltros" );
	});


    <!-- Initialize Swiper -->
    
    var galleryTop = new Swiper('.gallery-top', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        autoplay:2000,
        spaceBetween: 10,
    });


});// FIN Document Ready
