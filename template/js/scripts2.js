var qstTable,qstlogtable;
var data_qst_resp;
var qst_idq = 0;
var data_log;
//var qst_preguntas;

var qst_apd = [];
var qst_aps = [];

//variables mapa
var map_qst;
var qst_points = [];
var qst_poly = [];
var qst_marcadores = [];
var qst_info_a = new Array();
var qst_lats = new Array();
var qst_lons = new Array();
var qst_trayecto;
var qst_infowindow;
$(document).ready(function () {
	cargarCuestionarios();
	redimensionarCuestionarios();

	$( "#qst_dialog_chart" ).dialog({
		autoOpen:false,
		modal: true,
		width: 750,
		height: 500,
		resizable: false,
		/*buttons: {
			Cancelar: function() {
				$("#eqp_dialog" ).dialog( "close" );
			},
			Editar: function() {				
				eqp_validar_ed();
			}
		}*/
	});
});

/*
*Funcion que controla las peticiones ajax
*/
function ajaxCuestionarios(accion,c,parametros,divCarga,divResultado,tipoPeticion){
	$.ajax({
		url: "index.php?m=mCuestionario2&c="+c,
		type: tipoPeticion,
		data: parametros,
		beforeSend:function(){ 
			$("#"+divCarga).show().html("Procesando Informacion ..."); 
		},
		success: function(data) {
			controladorAcciones(accion,data,divResultado);
		}
	});
}
/*
*Funcion que administra las diferentes acciones de las respuestas de las peticiones
*/
function controladorAcciones(accion,data,divResultado){
	switch(accion){
		case "cargarCuestionarios":
			//alert(divResultado);
			$("#"+divResultado).show().html(data);
		break;
		case "estadisticas":
			$("#"+divResultado).show().html(data);
		break;
	}
}

function cargarCuestionarios(){
	idClienteQst=$("#hdnQstCli").val();
	parametros="action=cargarCuestionarios&idCliente="+idClienteQst;
	ajaxCuestionarios("cargarCuestionarios","controlador",parametros,"qst_main","qst_main","GET");
}

function detalleCuestionario(param1,evento){
	//alert(evento);
	evento.preventDefault();
	elementos=param1.split("#");
	//alert(elementos[1]);
	$('#qst_dialog_chart').html('');
    $('#qst_dialog_chart').dialog('open');
    //url: "index.php?m=mCuestionario2&c=mEstadistica",
    parametros="cuestionario="+elementos[1];
    ajaxCuestionarios("estadisticas","mEstadistica",parametros,"qst_dialog_chart","qst_dialog_chart","GET");
}
function qst_tabla_resp_data(qst){
	st_dt = $("#start_date_resp").val()+" "+$("#hri_resp").val()+":"+$("#mni_resp").val()+":00";
	nd_dt = $("#end_date_resp").val()+" "+$("#hrf_resp").val()+":"+$("#mnf_resp").val()+":59";
	//qst = $("#id_qst_gral").val;  
	//alert(st_dt+"/"+nd_dt+"/"+qst);
	parametros="st_dt="+st_dt+"&nd_dt="+nd_dt+"&qst="+qst;
	ajaxCuestionarios("respuestasCuestionarios","mFechas",parametros,"div_qst_rsp_f","div_qst_rsp_f","GET");
}
function qst_mapa(){
	latlng = new google.maps.LatLng(19.435113686545755,-99.13316173010253);
	myOptions = {
		zoom: 3,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map_qst = new google.maps.Map(document.getElementById("qst_cnt_map_rsp"), myOptions);
	qst_infowindow = new google.maps.InfoWindow;
}



function redimensionarCuestionarios(){
	altoCuestionarios=$(document).height();
    $("#qst_main").css("height",(altoCuestionarios-54)+"px");
    
    $("#gbox_cuestionarios").css("height",(altoCuestionarios-86)+"px");
	$("#gbox_cuestionarios").css("width","99.9%");

	//$("#gbox_cuestionarios").css("border","1px solid #FF0000");

	$("#gview_cuestionarios").css("height",(altoCuestionarios-86)+"px");
	$("#gview_cuestionarios").css("width","99.9%");
	$("#cuestionarios_pager").css("width","99.9%");
	
	$(".ui-jqgrid-hdiv").css("width","99.9%");
	$(".ui-jqgrid-bdiv").css("height","90%");
	
}