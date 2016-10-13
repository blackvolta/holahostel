$(document).ready(function() {

    $("#slider-latam").carouFredSel({
        circular: false,
        infinite: false,
        auto 	: false,
        prev	: {
            button	: "#slider-latam_prev",
            key		: "left"
        },
        next	: {
            button	: "#slider-latam_next",
            key		: "right"
        },
        pagination	: "#slider-latam_pag"
    });
    $("#slider-europa").carouFredSel({
        circular: false,
        infinite: false,
        auto 	: false,
        prev	: {
            button	: "#slider-europa_prev",
            key		: "left"
        },
        next	: {
            button	: "#slider-europa_next",
            key		: "right"
        },
        pagination	: "#slider-europa_pag"
    });

    scrollHeader();

    mapHostels();

    // RANDOM BACKGROUND

    var bgNumber = Math.floor(Math.random() * 4);
    switch (bgNumber) {
        case 0:
            $('.home .header-lider').css("background-image", "url('/img/header1.jpg')");
            break;
        case 1:
            $('.home .header-lider').css("background-image", "url('/img/header2.jpg')");
            break;
        case 2:
            $('.home .header-lider').css("background-image", "url('/img/header3.jpg')");
            break;
        case 3:
            $('.home .header-lider').css("background-image", "url('/img/header4.jpg')");
            break;
    }

    // MODAL CREDENCIAL EN MOBILE
    if ( $(window).width() <= 700 ) {
        $('#tab_hola-card').show();
    };

    $('.close-modal-card').click(function(){
        $('#tab_hola-card').hide();
    });

    //// AUTOCOMPLETE //////

    var substringMatcher = function(strs) {
        return function findMatches(q, cb) {
            var matches, substringRegex;

            // an array that will be populated with substring matches
            matches = [];

            // regex used to determine if a string contains the substring `q`
            substrRegex = new RegExp(q, 'i');

            // iterate through the pool of strings and for any string that
            // contains the substring `q`, add it to the `matches` array
            $.each(strs, function(i, str) {
                if (substrRegex.test(str)) {
                    matches.push(str);
                }
            });

            cb(matches);
        };
    };

    var states;
    var url = $('#autocomplete-input').data('url');
    $.ajax({
        url: url,
        dataType: 'json',
        async: false,
        success: function(data) {
            states = data;
        }
    });

    $('#autocomplete-search .typeahead').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
            name: 'states',
            source: substringMatcher(states)
        });

    //// FIN AUTOCOMPLETE //////


});// FIN Document Ready