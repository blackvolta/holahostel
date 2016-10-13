$(document).ready(function() {
    
	<!-- Initialize Swiper -->
    
    var galleryTop = new Swiper('.gallery-top', {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        autoplay:2000,
        spaceBetween: 10,
    });
    var galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        //centeredSlides: true,
        slidesPerView: 'auto',
        touchRatio: 0.2,
        slideToClickedSlide: true
    });
    galleryTop.params.control = galleryThumbs;
    galleryThumbs.params.control = galleryTop;

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

    $('.btn-ver_mas_detail').click(function(e){
        e.preventDefault();
        var $ht_detail = $(".detail .detail-text");
        var contentHeight = $ht_detail.addClass('heightAuto').height();
        $ht_detail.removeClass('heightAuto').animate({ 
            height: (contentHeight == $ht_detail.height() ? 90 : contentHeight)
        }, 500);

        if ($(this).hasClass('menos_detalle') ) {
            $(this).html('Ver más <span class="icon-keyboard_arrow_down"></span>');
        } else {
            $(this).html('Ver menos <span class="icon-keyboard_arrow_up"></span>');
        };
        $( this ).toggleClass( "menos_detalle" );
    });

    mapHostelDetail();

    $(window).scroll(function(event){
        //console.log($(window).scrollTop());
        getScroll();
    });

    function fbShare(url, title, descr, image, winWidth, winHeight) {

        var winTop = (screen.height / 2) - (winHeight / 2);
        var winLeft = (screen.width / 2) - (winWidth / 2);
        var link = 'http://www.facebook.com/sharer.php?s=100&u=' + url + 'src=sdkpreparse';

        window.open(link, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
    }

    function twShare(url, text, winWidth, winHeight) {

        var winTop = (screen.height / 2) - (winHeight / 2);
        var winLeft = (screen.width / 2) - (winWidth / 2);
        var link = 'https://twitter.com/share?url=' + url + '&text=' + text;

        window.open(link, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
    }

    //https://twitter.com/share?url={{ url('hola_frontend_announcement_detailpage',{'lang':lang,'slug': Hostel.slug}) }}&text={% trans %}HOLA HOSTELS. The Best Hostels. Your quality hostel network in Europe & Latin america {% endtrans %}
    $('.fbShare').click(function() {
        var url = $(this).data('href');
        var title = $(this).data('title');
        var desc = $(this).data('desc');
        var image = $(this).data('image');
        winWidth  = 300;
        winHeight = 300;

        fbShare(url,title,desc, image, winWidth, winHeight);
    });

    $('.twShare').click(function() {
        var url = $(this).data('href');
        var text = $(this).data('text');
        winWidth  = 500;
        winHeight = 500;

        twShare(url,text, winWidth, winHeight);
    });
});// FIN Document Ready

    
    function getScroll() {
        if( $(window).scrollTop() >= 826 ) {
            console.log('pepe');
        };
    };

// ********* MAPS *************
    function mapHostelDetail(){
    var edificios =  {
      "527702":{
      "nombre": "CENTRO SEC SRL",
      "direccion": "AV. CORDOBA 5851",
      "localidad":"CABA",
      "telefono":"4772-7577",
      "zona":"CABA1",
      "provincia":"CIUDAD AUTONOMA BUENOS AIRES",
      "lat": -34.585736,
      "lng": -58.4429689,
      "zindex": 9
      }
    };

    var map;
    var geocoder;
    var image = 'img/point.png';
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
        }       
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
                //background: "url('img/tipbox.gif') no-repeat",
                //opacity: 0.85,
                width: "280px"
            },
            //closeBoxMargin: "10px 2px 2px 2px",
            closeBoxURL: "img/close.png",
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
                                        "<div class='swiper-slide' style='background-image:url(img/hostel1/img-2241.jpg)'></div>"+
                                        "<div class='swiper-slide' style='background-image:url(img/hostel1/img-2236.jpg)'></div>"+
                                        "<div class='swiper-slide' style='background-image:url(img/hostel1/img-2244.jpg)'></div>"+
                                        "<div class='swiper-slide' style='background-image:url(img/hostel1/img-223.jpg)'></div>"+
                                        "<div class='swiper-slide' style='background-image:url(img/hostel1/img-2237.jpg)'></div>"+
                                        "<div class='swiper-slide' style='background-image:url(img/hostel1/img-2238.jpg)'></div>"+
                                        "<div class='swiper-slide' style='background-image:url(img/hostel1/img-2239.jpg)'></div>"+
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


};

    // ********* FIN MAPS *************