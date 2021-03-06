$(document).ready(function() {
    

});// **** Fin Document Ready *****

// ********* SCROLL *************
function scrollHeader() {
	// Hide Header on on scroll down
	var didScroll;
	var lastScrollTop = 0;
	var delta = 5;
	var navbarHeight = $('.header-nav').outerHeight();

	$(window).scroll(function(event){
	    didScroll = true;
	});

	setInterval(function() {
	    if (didScroll) {
	        hasScrolled();
	        didScroll = false;
	    }
	}, 250);

	function hasScrolled() {
	    var st = $(this).scrollTop();
	    
	    // Make sure they scroll more than delta
	    if(Math.abs(lastScrollTop - st) <= delta)
	        return;
	    
	    // If they scrolled down and are past the navbar, add class .nav-up.
	    // This is necessary so you never see what is "behind" the navbar.
	    if (st > lastScrollTop && st > navbarHeight){
	        // Scroll Down
	        $('.header-nav').removeClass('nav-down').addClass('nav-up');
	        $('.listado #map-canvas').css('marginTop','0');
	    } else {
	        // Scroll Up
	        if(st + $(window).height() < $(document).height()) {
	            $('.header-nav').removeClass('nav-up').addClass('nav-down');
	            $('.listado #map-canvas').css('marginTop','57px');
	        }
	    }
	    
	    lastScrollTop = st;
	};
	$( window ).scroll(function(){
		var scroll = $(window).scrollTop();
		if (scroll > 150) {
			$('.header-nav').addClass('nav-bg').removeClass('nav-transp');
		} else {
			$('.header-nav').addClass('nav-transp').removeClass('nav-bg');
		};
	});
};
	// ********* FIN SCROLL *************


// ********* MAPS *************
function mapHostels(){
	var edificios;
	var url = $('#map-canvas').data('json');
	$.ajax({
		url: url,
		dataType: 'json',
		async: false,
		success: function(data) {
			edificios = data;
		}
	});
	
	
	$(function(){
		$('.drawer').slideDrawer({
			showDrawer: false,
			// slideTimeout: true,
			slideSpeed: 600,
			slideTimeoutCount: 3000,
		});
		
		$('#pac-input').keypress(function(e){
			if(e.which == 13){
				codeAddress();
			}
		});
		
		function tog(v){return v?'addClass':'removeClass';} 
		$(document).on('input', '.clearable', function(){
		$(this)[tog(this.value)]('x');
		}).on('mousemove', '.x', function( e ){
		$(this)[tog(this.offsetWidth-18 < e.clientX-this.getBoundingClientRect().left)]('onX');   
		}).on('click', '.onX', function(){
			$(this).removeClass('x onX').val('').change();
			mResult.setVisible(false);
			initialize();
		});

		
	});
	
	var map;
	var geocoder;
	var image = '/img/point.png';
	var mResult; 
	
	function initialize() {
		mResult = new google.maps.Marker({
			map: map
		});
		geocoder = new google.maps.Geocoder();	
		var mapOptions = {
			zoom: 12,
			streetViewControl:false,
			overviewMapControl:false,
			rotateControl:false,
			mapTypeControl:false,
			panControl:false,
			zoomControlOptions: {
			  position:google.maps.ControlPosition.RIGHT_TOP
			}
		};
		map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		
		if(navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				var pos = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
				map.setCenter(pos);
			}, function() {
				handleNoGeolocation(true);
			});
		} else {
			handleNoGeolocation(false);
		}		
		
		var input = /** @type {HTMLInputElement} */(document.getElementById('pac-input'));
		
		var autocomplete = new google.maps.places.Autocomplete(input);
		autocomplete.bindTo('bounds', map);
		
		google.maps.event.addListener(autocomplete, 'place_changed', function() {
			mResult.setVisible(false);
			var place = autocomplete.getPlace();
			if (!place.geometry) {
				return;
			}

			
			if (place.geometry.viewport) {
				map.fitBounds(place.geometry.viewport);
			} else {
				map.setCenter(place.geometry.location);
				map.setZoom(12); 
			}
			mResult.setPosition(place.geometry.location);
			mResult.setVisible(true);
			mResult.setMap(map);
			var address = '';
			if (place.address_components) {
				address = [
					(place.address_components[0] && place.address_components[0].short_name || ''),
					(place.address_components[1] && place.address_components[1].short_name || ''),
					(place.address_components[2] && place.address_components[2].short_name || '')
				].join(' ');
			}
		});
		
		//setMarkers(map,markers);	
		setMarkers(map,edificios);
	}
	
	function handleNoGeolocation(errorFlag) {
	  var options = {
		map: map,
		position: new google.maps.LatLng(-34.5801891,-58.45232964)
	  };
	  map.setCenter(options.position);
	}
	
	function codeAddress() {
		var address = document.getElementById('pac-input').value;
		geocoder.geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				map.setCenter(results[0].geometry.location);
				mResult.setVisible(true);
				mResult.setMap(map);
				mResult.setPosition(results[0].geometry.location);
			}
		});
	}

	if(typeof(google)!=='undefined') {
		var myOptions = {
			disableAutoPan: false,
			maxWidth: 0,
			pixelOffset: new google.maps.Size(-140, 0),
			zIndex: null,
			boxStyle: {
				//background: "url('/img/tipbox.gif') no-repeat",
				//opacity: 0.85,
				width: "280px"
			},
			//closeBoxMargin: "10px 2px 2px 2px",
			closeBoxURL: "/img/close.png",
			infoBoxClearance: new google.maps.Size(1, 1),
			isHidden: false,
			pane: "floatPane",
			enableEventPropagation: true
		};
		var ib = new InfoBox(myOptions);
		var boxText = document.createElement("div");
		boxText.setAttribute("class", "infoboxW");
	}
	
	
	function setMarkers(map, edificios){
		for(var ii in edificios){
			(function(i){
				var m = edificios[i];
				var latlng = new google.maps.LatLng(m.lat,m.lng);
				var marker = new google.maps.Marker({
					position: latlng,
					map: map,
					icon: image,
					animation: google.maps.Animation.DROP,
					title: m.nombre,
					zIndex: m.zindex
				});

				google.maps.event.addListener(marker, 'click', function() {
					boxText.innerHTML = 
										"<p class=\"infoboxT\">"+m.nombre+"</p>"+
					
										"<div class='slider sliderMap'>"+
										"<div class='swiper-container gallery-map'>"+
										"<div class='swiper-wrapper'>"+
										"<div class='swiper-slide' style='background-image:url(/img/hostel1/img-2241.jpg)'></div>"+
										"<div class='swiper-slide' style='background-image:url(/img/hostel1/img-2236.jpg)'></div>"+
										"<div class='swiper-slide' style='background-image:url(/img/hostel1/img-2244.jpg)'></div>"+
										"<div class='swiper-slide' style='background-image:url(/img/hostel1/img-223.jpg)'></div>"+
										"<div class='swiper-slide' style='background-image:url(/img/hostel1/img-2237.jpg)'></div>"+
										"<div class='swiper-slide' style='background-image:url(/img/hostel1/img-2238.jpg)'></div>"+
										"<div class='swiper-slide' style='background-image:url(/img/hostel1/img-2239.jpg)'></div>"+
										"</div>"+
										"<div class='swiper-button-next swiper-button-white'></div>"+
										"<div class='swiper-button-prev swiper-button-white'></div>"+
										"</div>"+
										"</div>"+

										/*"<img src='http://static1.holahostels.com/adjuntos/00/14/001489.png'>"+*/
										"<p class=\"infoboxD\">"+m.direccion+"<p>"+
										"<p class=\"infoboxD\">"+m.localidad+"<p>"+
										"<p class=\"infoboxD\">"+m.telefono+"<p>"+
										"<p class=\"infoboxL\">"+m.zona+"<p>"+
										"<p class=\"infoboxD\">"+m.provincia+"<p>";
					ib.setContent(boxText);	
					ib.close();
					ib.open(map,marker);

					setTimeout(function(){arrancaSlider()}, 1000);


				});
				
			})(ii);
		}
	}

	//Inicializo nuevamente el slider de fotos
	
	/*PARA OBTENER EL LAT LNG
	function setMarkers(map, edificios){
		for (var ii in edificios){
			(function(i){
				var m = edificios[i];
				geocoder.geocode({'address':m.direccion},function(results,status){
					if(status == google.maps.GeocoderStatus.OK){
						var marker = new google.maps.Marker({
							map: map,
							icon: image,
							position: results[0].geometry.location,
							animation: google.maps.Animation.DROP,
							title: m.nombre,
							zIndex: m.zindex
						});
						console.log(m.nombre);
						console.log('"lat": '+results[0].geometry.location.k+',');
						console.log('"lng": '+results[0].geometry.location.B+',');
					}
				});
			})(ii);
		}
	}*/

	if(typeof(google)!=='undefined') {
		google.maps.event.addDomListener(window, 'load', initialize);
	}
};

function arrancaSlider() {
	var galleryTop = new Swiper('.gallery-map', {
	    nextButton: '.swiper-button-next',
	    prevButton: '.swiper-button-prev',
	    spaceBetween: 10,
	});
	//console.log($('.gallery-map'));
};

	// ********* FIN MAPS *************
