$(document).ready(function () {
	cargarCuestionarios();
	redimensionarCuestionarios();
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
	}
}

function cargarCuestionarios(){
	idClienteQst=$("#hdnQstCli").val();
	parametros="action=cargarCuestionarios&idCliente="+idClienteQst;
	ajaxCuestionarios("cargarCuestionarios","controlador",parametros,"qst_main","qst_main","GET");
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