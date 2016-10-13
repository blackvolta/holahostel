$(document).ready(function() {

    //mapHostels();

	$('.subnav a').click(function(e){
		e.preventDefault();
        $('.subnav a').removeClass('active');
        $(this).addClass('active');
        $('.tab').hide();
        var openTab = $(this).attr('data-tab');
        $(openTab).show();
	});

	// IMPRIMIR CREDENCIAL
	function PrintElem(elem)
	{
	    Popup($(elem).text());
	}

	function Popup(data) 
	{
	    var mywindow = window.open('', 'print_div', 'height=400,width=600');
	    mywindow.document.write('<html><head><title>Print Window</title>');
	    mywindow.document.write('</head><body >');
	    mywindow.document.write(data);
	    mywindow.document.write('</body></html>');
	    mywindow.document.close();
	    mywindow.print();
	    return true;
	}

	$('.print-trigger').click(function(){
		Popup($('#tab_hola-card').html());
	});	
/*	$('.print-trigger').click(function(){
		$('#tab_hola-card').printThis({
		  debug: false,              
		  importCSS: true,           
		  printContainer: true,      
		  pageTitle: "",             
		  removeInline: false
		});
	});*/	
	

});// FIN Document Ready