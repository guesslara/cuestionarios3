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
//variables mapa



$(document).ready(function () {
	//crear botones
	//Definir botnes editar
	$( ".edit" ).button({
      icons: {
        primary: "ui-icon-pencil"
      },
      text: false
    })
	//Definir botnes gear
	$( ".gear" ).button({
      icons: {
        primary: "ui-icon-gear"
      },
      text: false
    })	
	//Definir botnes note
	$( ".note" ).button({
      icons: {
        primary: "ui-icon-note"
      },
      text: false
    })		
	$(".boton").button();
	//Cargar tabla principal
	qst_load_datatable();
	//Crear dialog grafica,respuestas,mapa
	/*
	 *@description Se realiza la correccion para el funcionamiento en internet explorer
	 *@author Gerardo Lara / Edgar Alfonso Reynoso
	 *@date 13 de marzo 2014
	 *
	*/	
	w = $(document).width();
	h = $(document).height();
	/*
	 *fin de la modificacion
	*/
	//alert(w+"/"+h)
	
	//Declara dialog editar preguntas respuestas
	$("#qst_dialog_pr" ).dialog({
		modal: true,
		autoOpen:false,
		overlay: { opacity: 0.2, background: "cyan" },
		width:  900,
		height: 400,
		buttons: {
			"Guardar": function(){
				qst_validar_pr();
				},
			"Cancelar": function(){
				if($("#qst_dialog_pr" ).dialog('isOpen')){
					$("#dialog_message").dialog('close');
					}
					$("#qst_dialog_pr" ).dialog('close');
				}
				},
		show: "blind",
		hide: "blind"
		});	
	//Declara dialog editar preguntas respuestas
	$("#qst_dia_log" ).dialog({
		modal: true,
		autoOpen:false,
		overlay: { opacity: 0.2, background: "cyan" },
		width:  680,
		height: 400,
		buttons: {
			"Cancelar": function(){
				if($("#qst_dia_log" ).dialog('isOpen')){
					$("#dialog_message").dialog('close');
					}
					$("#qst_dia_log" ).dialog('close');
				}
				},
		show: "blind",
		hide: "blind"
		});			
		
	//-------------------------------------------------------
	$( "#qst_dialog_chart" ).dialog({
		autoOpen:false,
		title:"Estad\u00edstica",
		modal: true,
		width: w*0.55,
		height: h*0.75,
		
		/*buttons: {
			Cancelar: function() {
				$("#eqp_dialog" ).dialog( "close" );
			},
			Editar: function() {				
				eqp_validar_ed();
			}
		}*/
	});
		
	//Crear dialog formulario
	$( "#qst_dialog_formu" ).dialog({
		autoOpen:false,
		//title:"Estad\u00edstica",
		modal: true,
		width:800,
		height: 600,
		buttons: {
			Cancelar: function() {
				$(this).dialog( "close" );
			},
			Guardar: function() {				
				val_all_pes();
			}
		}
	});
	//Crear dialog formulario agregar pregunta
	$( "#qst_dialog_formp" ).dialog({
		autoOpen:false,
		//title:"Estad\u00edstica",
		modal: true,
		width: 500,
		height: 350,
		buttons: {
			Cancelar: function() {
				$(this).dialog( "close" );
			},
			Guardar: function() {				
				val_data_preg();
			}
		}
	});	
	//Crear dialog formulario configurar cuestionarios
	$( "#qst_dialog_formg" ).dialog({
		autoOpen:false,
		title:"Configurar cuestionarios",
		modal: true,
		width:  450,
		height: 450,
		buttons: {
			Cancelar: function() {
				$(this).dialog( "close" );
			},
			Guardar: function() {				
				//val_data_preg();
				//alert("gardar config")
				qst_save_config();
			}
		}
	});		
	//--------------------------------------
	//DECLARAR DIALOG IMAGEN	
	$( "#qst_dialog_img" ).dialog({
		autoOpen:false,
		title:"Rotar imagen",
		modal: true,
		width: 800,
		height: 600,
		buttons: {
			Cancelar: function() {
				$(this).dialog( "close" );
			},
			Guardar: function() {				
				qst_save_img();
			}
		}
	});	


	
	});
//----------------------------
function qst_load_datatable(){
	scroll_table=($("#qst_main").height()-125)+"px";
	wtd = ($("#qst_main").width()*.45)+"px"
    qstTable = $('#qst_table').dataTable({
	  "sScrollY": scroll_table,
      "bDestroy": true,
      "bLengthChange": true,
      "bPaginate": false,
      "bFilter": true,
      "bSort": true,
      "bJQueryUI": true,
      "iDisplayLength": 20,      
      "bProcessing": true,
      "bAutoWidth": false,
      "bSortClasses": false,
      "sAjaxSource": "index.php?m=mCuestionario2&c=mCuestionario",
      "aoColumns": [
	    { "mData": " ", sDefaultContent: "" },
		{ "mData": "ID_CUESTIONARIO", sDefaultContent: "","bSearchable": false,"bVisible":    false },
        { "mData": "DESCRIPCION", sDefaultContent: "" },
        { "mData": "RESP", sDefaultContent: "","bSearchable": false },
		{ "mData": "ITEM_NUMBER", sDefaultContent: "","bSearchable": false }
      ] , 
      "aoColumnDefs": [
        {"aTargets": [0],
          "sWidth": "65px",
          "bSortable": false,        
          "mRender": function (data, type, full) {
            var edit  = '';
            var del   = '';
			var gra   = '';
			var dsc = '"'+full.DESCRIPCION+'"';
            edit = "<td><div onclick='qst_abrir_formulario("+full.ID_CUESTIONARIO+","+dsc+");' class='custom-icon-edit-custom'>"+
                    "<img class='total_width total_height' src='data:image/gif;base64,R0lGODlhAQABAJH/AP///wAAAMDAwAAAACH5BAEAAAIALAAAAAABAAEAQAICVAEAOw=='/>"+
                    "</div></td>";

            del = "<td><div onclick='qst_delete_function("+full.ID_CUESTIONARIO+");' class='custom-icon-delete-custom'>"+
                    "<img class='total_width total_height' src='data:image/gif;base64,R0lGODlhAQABAJH/AP///wAAAMDAwAAAACH5BAEAAAIALAAAAAABAAEAQAICVAEAOw=='/>"+
                    "</div></td>";
			gra = "<td><div onclick='qst_chart_function("+full.ID_CUESTIONARIO+");' class='custom-icon-copy'>"+
                    "<img class='total_width total_height' src='data:image/gif;base64,R0lGODlhAQABAJH/AP///wAAAMDAwAAAACH5BAEAAAIALAAAAAABAAEAQAICVAEAOw=='/>"+
                    "</div></td>";		

            return '<table><tr>'+gra+edit+del+'</tr></table>';
        }}	
      ],
      "oLanguage": {
          "sInfo": "Mostrando _TOTAL_ registros (_START_ a _END_)",
          "sEmptyTable": "No hay registros.",
          "sInfoEmpty" : "No hay registros.",
          "sInfoFiltered": " - Filtrado de un total de  _MAX_ registros",
          "sLoadingRecords": "Leyendo información",
          "sProcessing": "Procesando",
          "sSearch": "Buscar:",
          "sZeroRecords": "No hay registros",
      }
    }); 
	}
//------------------------------------------
function qst_load_table_rdts(){
	//alert(data_qst_resp)
	
	qst = $("#id_qst").val();
	st_dt = $("#start_date_resp").val()+" "+$("#hri_resp").val()+":"+$("#mni_resp").val()+":00";
	nd_dt = $("#end_date_resp").val()+" "+$("#hrf_resp").val()+":"+$("#mnf_resp").val()+":59";
	scroll_table=($("#qst_tabs").height()-180)+"px";
	//alert(scroll_table);
	//wtd = ($("#qst_main").width()*.45)+"px"
    qstTable = $('#qst_table_resp_dates').dataTable({
	  "sScrollY": scroll_table,
      "bDestroy": true,
      "bLengthChange": true,
      "bPaginate": false,
      "bFilter": true,
      "bSort": true,
      "bJQueryUI": true,
      "iDisplayLength": 20,      
      "bProcessing": true,
      "bAutoWidth": false,
      "bSortClasses": false,
      //"sAjaxSource": "index.php?m=mCuestionario&c=mFechas&st_dt="+st_dt+"&nd_dt="+nd_dt+"&qst="+qst,
	  "aaData" :data_qst_resp,
      "aoColumns": [
	    { "mData": " ", sDefaultContent: "" },
		{ "mData": "IDRC"    , sDefaultContent: "","bSearchable": false,"bVisible":    false },
        { "mData": "FECHA"   , sDefaultContent: "" },
		{ "mData": "USR"     , sDefaultContent: ""  },
		{ "mData": "LATIT" , sDefaultContent: "","bSearchable": false,"bVisible":    false },
        { "mData": "LONGI", sDefaultContent: "","bSearchable": false,"bVisible":    false },
		{ "mData": "DIREC", sDefaultContent: "","bSearchable": false,"bVisible":    false }
      ] , 
      "aoColumnDefs": [
        {"aTargets": [0],
          "bSortable": false,        
          "mRender": function (data, type, full) {
			var gra   = '';
			fch = '"'+full.FECHA+'"';
			us  = '"'+full.USR+'"';
			dr  = '"'+full.DIREC+'"';
			gra = "<td><div onclick='qst_position("+fch+","+us+","+full.LATIT+","+full.LONGI+","+dr+");qst_load_preg_resp("+full.IDRC+");qst_set_idq("+full.IDRC+");' class='custom-icon-copy'>"+
                    "<img class='total_width total_height' src='data:image/gif;base64,R0lGODlhAQABAJH/AP///wAAAMDAwAAAACH5BAEAAAIALAAAAAABAAEAQAICVAEAOw=='/>"+
                    "</div></td>";		

            return '<table><tr>'+gra+'</tr></table>';
        }}	
      ],
      "oLanguage": {
          "sInfo": "Mostrando _TOTAL_ registros (_START_ a _END_)",
          "sEmptyTable": "No hay registros.",
          "sInfoEmpty" : "No hay registros.",
          "sInfoFiltered": " - Filtrado de un total de  _MAX_ registros",
          "sLoadingRecords": "Leyendo información",
          "sProcessing": "Procesando",
          "sSearch": "Buscar:",
          "sZeroRecords": "No hay registros",
      }
    }); 
	}
//------------------------------------------
function qst_chart_function(c){
	      $.ajax({
          url: "index.php?m=mCuestionario2&c=mEstadistica",
          type: "GET",
          data: {
			  cuestionario : c
			    },
          success: function(data) {
            var result = data; 
            $('#qst_dialog_chart').html('');
            $('#qst_dialog_chart').dialog('open');
			$('#qst_dialog_chart').html(result); 
          }
      });
	}
//-------------------------------------------
function select_all(sel){
	var s="";
	$('#'+sel+' option').each(function(i) {
		if(s==''){
			if($(this).val()!= -1){
				s=$(this).val();
				}
				//alert(s);
				}
				else{
					if($(this).val()!= -1){
						s+=','+$(this).val();
						}
					}
			});
		//alert(s);
		return s;
	}
//--------------------------------------------
function qst_tabla_resp_data(qst){
	
	st_dt = $("#start_date_resp").val()+" "+$("#hri_resp").val()+":"+$("#mni_resp").val()+":00";
	nd_dt = $("#end_date_resp").val()+" "+$("#hrf_resp").val()+":"+$("#mnf_resp").val()+":59";
	  //qst = $("#id_qst_gral").val;
	  
	  //alert(st_dt+"/"+nd_dt+"/"+qst);
	
	$.ajax({
		url: "index.php?m=mCuestionario2&c=mFechas",
        type: "GET",
        //dataType : 'json',
		async : false,
        data: {
			st_dt : st_dt,
			nd_dt : nd_dt,
			qst : qst
			},
        success: function(data) {
			var result = data; 
			//alert(result)
            $('#div_qst_rsp_f').html('');
			$('#div_qst_rsp_f').html(result); 
			}
    });
	}
//--------------------------------------------
function qst_tabla_resp(){
	qstTable= $('#qst_table_resp').dataTable( { 
                "aaData" :data_qst_resp,               
                "bDestroy": true,
                "bLengthChange": false,
                "bPaginate": true,
                "bFilter": true,
                "bSort": true,
                "bJQueryUI": true,
                "iDisplayLength": 10,
                "bAutoWidth": false,
                "bSortClasses": false,    
                "aoColumns": [
				  { "mData": "IDRC"  ,  sDefaultContent: "","bSearchable": false,"bVisible": false},
                  { "mData": "FECHA" , sDefaultContent: "", "sWidth": "15%" },
                  { "mData": "DATOS" , sDefaultContent: "" },
                ] ,           
                "oLanguage": {
                    "sInfo": "Mostrando _TOTAL_ registros (_START_ a _END_)",
                    "sEmptyTable": "No hay registros.",
                    "sInfoEmpty" : "No hay registros.",
                    "sInfoFiltered": " - Filtrado de un total de  _MAX_ registros",
                    "sLoadingRecords": "Leyendo información",
                    "sProcessing": "Procesando",
                    "sSearch": "Buscar:",
                    "sZeroRecords": "No hay registros",
                }/*,"aoColumnDefs": [
                  {"aTargets": [0],
                    "sWidth": "10%",
                    "bSortable": false,        
                    "mRender": function (data, type, full) {
                      return '<span id="'+full.IDS+'|'+full.IDE+'" class="ui-icon ui-icon-trash delEnqBtn"></span>';
                  }}
                ]*/
              });
	}	
//--------------------------------------------------------------------------	
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
//--------------------------------------------------------------------------
function qst_position(fecha,usr,lat,lon,dir){
	//alert(f)
clearOverlays();	

//direccion="direcci\u00f3n";
			 
			  //alert(data)
			  if(lat!=0 && lon!=0){

				   

				  //alert(record.DIRE)
				  var info 	  		= "<table><tr><td>Fecha :</td><td>"+fecha +"</td></tr><tr><td>Usuario:</td><td>"+usr+"</tr><tr><td>Direcci\u00f3n:</td><td>"+dir+"</td></tr></table>";
				  /*var info = '<div class="div_unit_info ui-widget-content ui-corner-all">'+
					'<div class="ui-widget-header ui-corner-all" align="center">Información de la Unidad</div>'+
				  			'<table><tr><th colspan="2">'+
				  			'<tr><td align="left">Fecha  :</td><td align="left">'	+ fecha	+'</td></tr>'+
							'<tr><td align="left">Usuario:</td><td align="left">'	+ usr	+'</td></tr>'+
							'<tr><td align="left">Dirección:</td><td align="left">'	+ direccion	+'</td></tr>'+
		  					'</table>'+
		  				'</div>';*/
				  /*if(index==0){
					  var last 			= "<table width='100%'><tr><td colspan='8' style='background:#cccccc'><b>&Uacute;ltima posici&oacute;n</b></td></tr><tr><td><b>Fecha: </b></td><td>"+fecha +"</td><td><b>Velocidad: </b></td><td>"+velocidad+" km/h</td><td><b>Latitud: </b></td><td>"+unitLatitude+"</td><td><b>Longitud: </b></td><td>"+unitLong+"</td></tr><tr><td><b>Direcci&oacute;n: </b></td><td colspan='7'>"+direccion+"</td></tr></table>";
										  if(o==1){
											  $("#ser_last_nvo").html(last).css("width","660px");
											  }
										  if(o==2){
											  $("#ser_last_edt").html(last).css("width","660px");
											  }
										  
					  }*/
				  
				  
				  qst_info_a.push(info);
				  qst_lats.push(lat);
				  qst_lons.push(lon);
				  qst_points.push(new google.maps.LatLng(lat, lon));
				  //var parliament = new google.maps.LatLng(19.435113686545755,-99.13316173010253);
				  var point = new google.maps.LatLng(lat,lon);
				  //var icon = "public/images/green_car.png";
				  var marker = new google.maps.Marker({
					  position: point, 
					  map: map_qst,
					  title: fecha,
					  //icon: icon
					  animation: google.maps.Animation.DROP,
					  //position: parliament
					  });
					  
				 var infowindow = new google.maps.InfoWindow({
					 content: info,
					 size: new google.maps.Size(200, 200)
					 });  
				  google.maps.event.addListener(marker, 'click', function() {
					  infowindow.open(map_qst,marker);
					  });
				  qst_marcadores.push(marker);
				  
				  //alert(points.length)
				  	  /*trayecto = new google.maps.Polyline({
					  path: points,
					  strokeColor: "#FF0000",
					  strokeOpacity: 1.0,
					  strokeWeight: 2
					  });

  trayecto.setMap(map_qst);
  poly.push(trayecto);*/
  var latlngbounds = new google.maps.LatLngBounds();
  	for ( var i = 0; i < qst_points.length; i++ ){
	    latlngbounds.extend( qst_points[ i ] );
  	}
 	//map.setCenter( latlngbounds.getCenter( ), map.getBoundsZoomLevel( latlngbounds ) );
	map_qst.fitBounds(latlngbounds);	
	map_qst.setCenter(latlngbounds.getCenter());
	
	
			  }
			  else{
				  /*if(op==1){
					  $("#ser_last_nvo").html("").css("width","0px");
					  }
				  if(op==2){
					  $("#ser_last_edt").html("").css("width","0px");
					  }*/
				  
				  var center = new google.maps.LatLng(19.435113686545755,-99.13316173010253);
				  map_qst.setCenter(center);
				  map_qst.setZoom(3);
				  google.maps.event.trigger(map_qst, "resize");
				  //$('#ser_dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Sin datos disponibles para esta unidad.</p>');
				  //$("#ser_dialog_message" ).dialog('open');
				  }
		  
	}
//---------------------------------------------------------------	
function clearOverlays() {
  for (var i = 0; i < qst_marcadores.length; i++ ) {
    qst_marcadores[i].setMap(null);
  }
  //alert(poly.length);
  for (var i = 0; i < qst_poly.length; i++ ) {
    qst_poly[i].setMap(null);
  }
  //trayecto.setMap(null);
  //reiniciar variables
  qst_points=[];
  qst_marcadores=[];
  qst_poly=[];
}	
//---------------------------------------------------------------
function add_info_marker(marker,content){	
    google.maps.event.addListener(marker, 'click',function() {
      if(qst_infowindow){qst_infowindow.close();qst_infowindow.setMap(null);}
      var marker = this;
      var latLng = marker.getPosition();
      qst_infowindow.setContent(content);
      qst_infowindow.open(map_qst, marker);
      map_qst.setZoom(18);
	  map_qst.setCenter(latLng);      
	});
}
//-------------------------------------------------------------
function qst_center_map(lat,lon,info,title,show_info){
	var unit_info = info.split("|");	
	var info = '<br><div class="div_unit_info ui-widget-content ui-corner-all">'+
					'<div class="ui-widget-header ui-corner-all" align="center">Información de la Evidencia</div>'+
				  			'<table><tr><th colspan="2">'+
				  			'<tr><td align="left">Evento :</td><td align="left">'	+ unit_info[0]	+'</td></tr>'+
				  			'<tr><td align="left">Fecha  :</td><td align="left">'	+ unit_info[1]	+'</td></tr>'+
							'<tr><td align="left">Velocidad:</td><td align="left">'	+ unit_info[2]	+' Km/h.</td></tr>'+
							'<tr><td align="left">Dirección:</td><td align="left">'	+ unit_info[3]	+'</td></tr>'+
		  					'</table>'+
		  				'</div>';	
	var image = new google.maps.MarkerImage('public/images/car.png',
		new google.maps.Size(1, 1),
		new google.maps.Point(0,0),
		new google.maps.Point(0, 32));
    var myLatLng 	= new google.maps.LatLng(lat,lon);
    var beachMarker = new google.maps.Marker({
        position: myLatLng,
        map: 	map_qst,
        title: 	title,
        icon:   image,
    });

    marcadores.push(beachMarker);    
	if(infowindow){infoWindow.close();infowindow.setMap(null);}
		infowindow = new google.maps.InfoWindow({
	    content: info
	});
	
	if(show_info){infowindow.open(map_qst,beachMarker);map_qst.setZoom(18);}

	var positon = new google.maps.LatLng(lat, lon);
	/*if(show_info){map_qst.setZoom(18);}*/
	map_qst.setCenter(positon);	
}
//------------------------------------------
function qst_load_preg_resp(idrc){
	
	//Definir botnes editar
	$( ".edit" ).button({
      icons: {
        primary: "ui-icon-pencil"
      },
      text: false
    })	
	//Definir botnes note
	$( ".note" ).button({
      icons: {
        primary: "ui-icon-note"
      },
      text: false
    })	
	
	scroll_table=($("#qst_cnt_tbl_rsp").height()-75)+"px";
	//alert(scroll_table);
    qstTable = $('#qst_table_preg_resp').dataTable({
	  "sScrollY": scroll_table,
      "bDestroy": true,
      "bLengthChange": true,
      "bPaginate": false,
      "bFilter": true,
      "bSort": true,
      "bJQueryUI": true,
      "iDisplayLength": 20,      
      "bProcessing": true,
      "bAutoWidth": false,
      "bSortClasses": false,
      "sAjaxSource": "index.php?m=mCuestionario2&c=mPregResp&idrc="+idrc,
      "aoColumns": [
		{ "mData": "PREGUNTA"    , sDefaultContent: "" },
        { "mData": "RESPUESTA"   , sDefaultContent: "" }
      ] , 
      "oLanguage": {
          "sInfo": "Mostrando _TOTAL_ registros (_START_ a _END_)",
          "sEmptyTable": "No hay registros.",
          "sInfoEmpty" : "No hay registros.",
          "sInfoFiltered": " - Filtrado de un total de  _MAX_ registros",
          "sLoadingRecords": "Leyendo información",
          "sProcessing": "Procesando",
          "sSearch": "Buscar:",
          "sZeroRecords": "No hay registros"
      }
    }); 
	}
//-----------------------------------------------------------------------
function qst_abrir_formulario(q,d){
	if(q==""){$("#qst_dialog_formu").dialog('option', 'title', 'Agregar Cuestionario');}
	if(q!=""){$("#qst_dialog_formu").dialog('option', 'title', 'Editar Cuestionario ('+d+')');}
	      $.ajax({
          url: "index.php?m=mCuestionario2&c=mFormulario",
          type: "GET",
          data: {
			  cuestionario : q
			    },
          success: function(data) {
            var result = data; 
			//$('#qst_dialog_formu').dialog( "destroy" );
            $('#qst_dialog_formu').html('');
            $('#qst_dialog_formu').dialog('open');
			$('#qst_dialog_formu').html(result); 
          }
      });
	}
//-----------------------------------------------------------------------
function qst_abrir_formulario_gear(){
	//alert("qst_abrir_formulario_gear")
	//if(q==""){$("#qst_dialog_formu").dialog('option', 'title', 'Agregar Cuestionario');}
	//if(q!=""){$("#qst_dialog_formu").dialog('option', 'title', 'Editar Cuestionario');}
	      $.ajax({
          url: "index.php?m=mCuestionario2&c=mFormularioGear",
          type: "GET",
          //data: {
			  //cuestionario : q
			   // },
          success: function(data) {
            var result = data; 
			//$('#qst_dialog_formu').dialog( "destroy" );
            $('#qst_dialog_formg').html('');
            $('#qst_dialog_formg').dialog('open');
			$('#qst_dialog_formg').html(result); 
          }
      });
	}	
//-------------------------------------------------------------------------
function validar_nombre_qst(n){
	$.ajax({
          url: "index.php?m=mCuestionario2&c=mNcuestionario",
          type: "GET",
          data: {
			  qst : n
			    },
          success: function(data) {
            var result = data; 
			//alert(result);
			if(result>0){
				$("#qst_tit_val").html('<font color = "red">El cuestionario ya existe.</font>');
				}
			else{
				$("#qst_tit_val").html('');
				}	
          }
      });
	}
//-------------------------------------------------------------------------
function validar_nip_qst(n){
	$.ajax({
          url: "index.php?m=mCuestionario2&c=mGetNip",
          type: "GET",
          data: {
			  nip : n
			    },
          success: function(data) {
            var result = data; 
			//alert(result);
			if(result>0){
				$("#qst_nip_val").html('<font color = "red">El identificador de cuestionario ya existe.</font>');
				}
			else{
				$("#qst_nip_val").html('');
				}	
          }
      });
	}	
//-------------------------------------------------------------------------
function val_pes_pro(){
	var ifs = 0;

	if($("#qst_title").val().length == 0){
		ifs=ifs+1;
		$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe escribir un titulo del cuestionario.</p>');
		$("#dialog_message" ).dialog('open');		
		return false;
		}
	if($("#qst_tit_val").html() != ""){
		ifs=ifs+1;
		$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>El cuestionario ya existe. Escriba un titulo diferente.</p>');
		$("#dialog_message" ).dialog('open');		
		return false;
		}
	if($("#qst_nip").val().length == 0){
		ifs=ifs+1;
		$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe escribir un identificador del cuestionario.</p>');
		$("#dialog_message" ).dialog('open');		
		return false;
		}
	if($("#qst_nip_val").html() != ""){
		ifs=ifs+1;
		$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>El identificador del cuestionario ya existe. Escriba un identificador diferente.</p>');
		$("#dialog_message" ).dialog('open');		
		return false;
		}				
	}
//---------------------------------------------------------------------------
function val_pes_tma(){
	var ifs = 0;

	if($("input[type='radio'][name='tema']:checked").val() === undefined){
		ifs=ifs+1;
		$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe seleccionar un tema.</p>');
		$("#dialog_message" ).dialog('open');		
		return false;
		}
	}
//------------------------------------------------------------------------
function val_all_pes(){
	var ifs = 0;

	if($("#qst_title").val().length == 0){
		ifs=ifs+1;
		$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe escribir un titulo del cuestionario.</p>');
		$("#dialog_message" ).dialog('open');		
		return false;
	}
		
	if($("#qst_tit_val").html() != ""){
		ifs=ifs+1;
		$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>El cuestionario ya existe. Escriba un titulo diferente.</p>');
		$("#dialog_message" ).dialog('open');		
		return false;
	}
		
	if($("#qst_nip").val().length == 0){
		ifs=ifs+1;
		$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe escribir un identificador del cuestionario.</p>');
		$("#dialog_message" ).dialog('open');		
		return false;
	}
	if($("#qst_nip_val").html() != ""){
		ifs=ifs+1;
		$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>El identificador del cuestionario ya existe. Escriba un identificador diferente.</p>');
		$("#dialog_message" ).dialog('open');		
		return false;
	}
				
	if($("#qst_type").val()==3){
		if($("#qst_Y").val() < 1){
			ifs=ifs+1;
			$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe seleccionar un elemento del eje y.</p>');
			$("#dialog_message" ).dialog('open');		
			return false;
		}
		if($("#qst_Z").val() < 1){
			ifs=ifs+1;
			$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe seleccionar un elemento del eje z.</p>');
			$("#dialog_message" ).dialog('open');		
			return false;
		}			
		if($("#qst_X").val() < 1){
			ifs=ifs+1;
			$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe seleccionar un elemento del eje x.</p>');
			$("#dialog_message" ).dialog('open');		
			return false;
		}			
	}
		
	if($("input[type='radio'][name='tema']:checked").val() === undefined){
		ifs=ifs+1;
		$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe seleccionar un tema.</p>');
		$("#dialog_message" ).dialog('open');		
		return false;
	}
	
	var qst_preguntas = $('#qst_preg_sel div').map(function() {
		//alert(this.id)
		return this.id;
		//return $(this).val();
	}).get();	
	if(qst_preguntas.length==0){
		ifs=ifs+1;
		$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe seleccionar una o mas preguntas.</p>');
		$("#dialog_message" ).dialog('open');		
		return false;
	}
	
	var qst_users = $('#qst_user_sel div').map(function() {
		//alert(this.id)
		return this.id;
		//return $(this).val();
	}).get();	
	if(qst_users.length==0){
		ifs=ifs+1;
		$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe seleccionar un o mas usuarios.</p>');
		$("#dialog_message" ).dialog('open');		
		return false;
	}
		
	if(ifs==0){
		qst_guardar_form($("#qst_op").val());
	}
		
		
}	
//------------------------------------------------------------------------------
function qst_guardar_form(op){
	gral_cargando();
	var x = ($("#qst_type").val()==3)?$("#qst_X").val():"";
	var y = ($("#qst_type").val()==3)?$("#qst_Y").val():"";
	var mlt = ($('#qst_multi_resp').is(':checked'))?1:0;
	var off = ($('#qst_offline').is(':checked'))?1:0;
	//alert(mlt+"/"+off)
	var omlt = $('#qst_old_mlt').val();
	var ooff = $('#qst_old_off').val();
	
	var pre ="";
	var qst_preguntas = $('#qst_preg_sel div').map(function() {
		return this.id;
		}).get();	
	for(i=0; i<qst_preguntas.length; i++){
		pre = (pre=="")?qst_preguntas[i]:pre+","+qst_preguntas[i];
		}
		
	var usr = "";
	var qst_users = $("#qst_user_sel div").map(function(){
		return this.id;
		}).get();
	for(i=0; i<qst_users.length; i++){
		usr += (usr=="")?qst_users[i]:","+qst_users[i];
		}
	var qst_parval = $('.qst_selpar').map(function() {
		val = this.id+','+this.value
		return val;
		}).get();
	var parval = "";	
	for(i=0; i<qst_parval.length; i++){
		str = qst_parval[i];
		str = str.replace("qst_p","")
		parval += (parval=="")?str:'|'+str;
		}
	//alert(parval);
		$.ajax({
          url: "index.php?m=mCuestionario2&c=mSaveForm",
          type: "GET",
          data: {
			  tit : $("#qst_title").val(),
			  nip : $("#qst_nip").val(),
			  typ : $("#qst_type").val(),
			  mlt : mlt,
			  off : off,
			  tma : $("input[type='radio'][name='tema']:checked").val(),
			  pre : pre,
			  usr : usr,
			  op  : op,
			  idq : $("#qst_id").val(),
			  x   : x,
			  y   : y,
			  fun : $("#qst_idf").val(),
			  prm : parval,
			  
			  ofun : $("#qst_old_fun").val(),
			  oprm : $("#qst_old_par").val(),
			  otit : $("#qst_old_tit").val(),
			  onip : $("#qst_old_nip").val(),
			  otyp : $("#qst_old_typ").val(),
			  omlt : omlt,
			  ooff : ooff,
			  otma : $("#qst_old_tma").val(),
			  opre : $("#qst_old_pre").val(),
			  ousr : $("#qst_old_usr").val(),
			  ox : $("#qst_old_x").val(),
			  oy : $("#qst_old_y").val() 
			    },
          success: function(data) {
            var result = data; 
			//alert(result);
			$("body").css("cursor", "default");
			if(result>0 && result!=""){
				message = (op==1)?"El cuestionario ha sido almacenado satisfactoriamente.":"El cuestionario ha sido actualizado satisfactoriamente";
				$('#qst_dialog_formu').dialog('close');
				$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>'+message+'</p>');
				$("#dialog_message" ).dialog('open');
				qst_load_datatable();
				}
			else{
				message = (op==1)?"El cuestionario no ha sido almacenado. Vuelva a int\u00e9ntelo posteriormente.":"Los cambios en el cuestionario no han sido almacenados. Vuelva a int\u00e9ntelo posteriormente.";
				$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>'+message+'</p>');
				$("#dialog_message" ).dialog('open');
				}	
          }
      });
				

	}
//----------------------------------------------------
function form_preg(id,op){
	var html = '';
	var txto = '';
	if($("#qst_preg_sel").html() != ''){
		 html = 'v'; 
	}else{
		 html = 'nv'; 
	}
	
	if($("#ban01").val() != ''){
		 txto = 'nv'; 
	}else{
		 txto = 'v'; 
	}
//	alert($("#qst_preg_sel").html()+'-'+ $("#ban01").val()+'-'+html+'-'+txto);
	
	if(op==1){$("#qst_dialog_formp").dialog('option', 'title', 'Agregar Pregunta');}
	if(op==2){$("#qst_dialog_formp").dialog('option', 'title', 'Editar Pregunta');}
	      $.ajax({
          url : "index.php?m=mCuestionario2&c=mFormulariop",
          type: "GET",
		  data: {
			  id:id,
			  op:op,
			  htm:html,
			  tx :txto
			  },
          success: function(data) {
            var result = data; 
			//$('#qst_dialog_formu').dialog( "destroy" );
            $('#qst_dialog_formp').html('');
            $('#qst_dialog_formp').dialog('open');
			$('#qst_dialog_formp').html(result); 
          }
      });
	}	
//-----------------------------------------------------
function selec_preg(p){
	$.ajax({
		url: "index.php?m=mCuestionario2&c=mComplemento",
        type: "GET",
		data:{
			idt : p
			},
        success: function(data) {
        var result = data; 
			//$('#qst_dialog_formu').dialog( "destroy" );
            $('#qst_com_pre').html(result);
            //$('#qst_dialog_formp').dialog('open');
			//$('#qst_dialog_formp').html(result); 
          }
      });
	}
//-------------------------------------------------------
function radio_cercania(){
	radio = 0;	
	ra = '';

	for(r=1;r<1000;r++){
		radio = r * 10;
		if(radio<=1000){
			ra +='<option value="'+radio+'" >'+radio+'</option>';
			}
	 }
	$("#qst_com_pre").html('<form name="compts" id="compts"><p><select name="comp" id="qst_comp" class="caja">'+ra+'</select> mts. de radio de distancia</p></form>'); 		 
		
	}
//-----------------------------------------------------------------------------------------------------------------------//
function select_comple(x){
	if(x==1){
		$("#sis_t").html('<form name="compts" id="compts"><p><select name="comp" id="qst_comp" class="caja">'+
					 '<option value="$Fecha" selected="selected">Fecha</option>'+
					 '<option value="$Hora" >Hora</option>'+
					 '<option value="$IMEI" >IMEI</option>'+
					 '<option value="$Usuario" >Usuario</option>'+
				   '</select></p></form>');
	}else{
		$("#sis_t").html('<form name="compts" id="compts"><p><input type="text" id="qst_comp" class="caja_txt" /></p></form>');
		}	
	}	
//-----------------------------------------
function val_data_preg(){
	
	var ifs = 0;

  if($("#qst_tit_pre").val().length == 0){
	  ifs=ifs+1;
	  $('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe escribir un titulo de pregunta.</p>');
	  $("#dialog_message" ).dialog('open');
	  return false;
  }
  
   if($("#qst_typ_pre").val() == 0){
	  ifs=ifs+1;
	  $('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe seleccionar un tipo de pregunta.</p>');
	  $("#dialog_message" ).dialog('open');
	  return false;
   }
	if($("[name='valid']").length){
	if($("[name='valid']").val().length == 0){
		ifs=ifs+1;
		$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe escribir el n\u00famero de caracteres permitidos.</p>');
		$("#dialog_message" ).dialog('open');
		return false;
		}
	} 
	
	if($("[name='coma']").length){
	if($("[name='coma']").val().length == 0){
		ifs=ifs+1;
		//alert('Debe escribir al menos un par de elementos separados por el car\u00e1cter ","');
		$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe escribir al menos un par de elementos separados por el car\u00e1cter ",".</p>');
		$("#dialog_message" ).dialog('open');
		return false;
		}
	}	
	
	if($("[name='coma']").length){
	if( $("[name='coma']").val().indexOf(",") == -1){
		ifs=ifs+1;
		//alert('Debe separar cada elemento con el car\u00e1cter "," ');
		$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe separar cada elemento con el car\u00e1cter ",".</p>');
		$("#dialog_message" ).dialog('open');
		return false;
		}	
	}
	
	if($("[name='coma']").length){
		var cont=0;
		n=$("[name='coma']").val().split(",");
		for(var x=0; x<$("[name='coma']").val().split(",").length; x++){
			//alert('x:'+x+'n[x]:'+n[x]);
			if(n[x]=='' || n[x].length==0 ){
				cont++;
				}
			}
	if( cont > 0){
		ifs=ifs+1;
		//alert('Debe escribir un elemento despu\u00e9s del car\u00e1cter ","');
		$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe escribir un elemento despu\u00e9s del car\u00e1cter ",".</p>');
		$("#dialog_message" ).dialog('open');
		return false;
		}	
	}		
    
   if($("[name='url']").length){
		if( $("[name='url']").val().indexOf("http://") == -1){
			ifs=ifs+1;
			$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>El campo Url no debe estar vacio y debe iniciar con "http://".</p>');
			$("#dialog_message" ).dialog('open');
			//alert('El campo Url no debe estar vacio y debe iniciar con "http://" ');
		  return false;
		}
	}
	
	
	if(ifs==0){
		qst_save_formp();
		}
}	
//------------------------------------------------------------------------
function qst_save_formp(){
	gral_cargando();
	$.ajax({
		url: "index.php?m=mCuestionario2&c=mSavePregunta",
        type: "GET",
		data:{
			tit : $("#qst_tit_pre").val(),
			typ : $("#qst_typ_pre").val(),
			act : $("#qst_act_pre").val(),
			rec : $("#qst_rec_pre").val(),
			req : $("#qst_req_pre").val(),
			edt : $("#qst_edt_pre").val(),
			com : $("#qst_comp").val(),
			op  : $("#qst_hop").val(),
			id  : $("#qst_hid").val()
			},
        success: function(data) {
        var result = data;
		$("body").css("cursor", "default");
		//alert(result) 
		if(result==1){
			//qst_aps.push(
			//preguntas_seleccionadas();
			/***************************/
			hdnIdCuestionario=$("#hdnIdCuestionario").val();
			actualizaPreguntasCuestionario(hdnIdCuestionario);
			/***************************/

			$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>La pregunta ha sido almacenda satisfactoriamente</p>');
			$("#dialog_message" ).dialog('open');
			$('#qst_dialog_formp').dialog('close');
			}
		else{
			$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>La pregunta no hasido almacenada. Vuelva a int\u00e9ntelo posteriormente.</p>');
			$("#dialog_message" ).dialog('open');
			}
          }
      });	
	}
//---------------------------------------------------------------------------
function preguntas_seleccionadas(){
	/*var qst_preguntas = $('#qst_preg_dsp div').map(function() {
		return this.id;
		}).get();
	pre="";	
	for (i=0; i<qst_preguntas.length; i++){
		pre += (pre=="")?qst_preguntas[i]:","+qst_preguntas[i];
		}*/
	var pre;
	
/*	prs = "";	
	for (i=0; i<qst_aps.length; i++){
		prs += (prs=="")?qst_aps[i]:","+qst_aps[i];
		}	*/
	prd = "";	
	for (i=0; i<qst_apd.length; i++){
		prd += (prd == "")?qst_apd[i]:","+qst_apd[i];
	}
	pre = prd;

	$.ajax({
		url: "index.php?m=mCuestionario2&c=mPreguntaS",
        type: "GET",
		data:{
			pre : pre
			},
        success: function(data) {
        var result = data;
		//alert(result);
		$("#qst_preg_sel").html(result);
          }
     });	
}	
//--------------------------------------------------------------------
function isNumberKey(evt){
var charCode = (evt.which) ? evt.which : event.keyCode
if (charCode > 31 && (charCode < 48 || charCode > 57))
return false;
 
return true;
}	
//--------------------------------------------------------------------
preguntasSeleccionadas="";
function buscador_preguntas(op,txt){
	//qst_apd
	//qst_aps
	var pre;
	prs = "";	
	for (i=0; i<qst_aps.length; i++){
		prs += (prs=="")?qst_aps[i]:","+qst_aps[i];
	}	
	prd = "";	
	for (i=0; i<qst_apd.length; i++){
		prd += (prd == "")?qst_apd[i]:","+qst_apd[i];
	}
		
	/*if(op==1){
		alert(prs);
	}
	else{
		alert(prd);
		}*/
	
	//alert(txt)
	if(op==1){
		pre = prs;
	}
	else{
		pre = prd;
	}	
	//var div = (op==1)?'qst_preg_sel':'qst_preg_dsp';
	//alert(div);
	//var qst_preguntas = $('#'+div+' div').map(function() {
		//return this.id;
		//}).get();
	//pre="";	
	//for (i=0; i<qst_preguntas.length; i++){
		//pre += (pre=="")?qst_preguntas[i]:","+qst_preguntas[i];
		//}
	console.log("txt: "+txt);
	
	if(op==2){
		if(txt.length==0 || txt.length < 3){
			//$("#qst_preg_sel li").css("background","#F0F0F0");
			$("#qst_preg_sel li:contains('"+txt+"')").removeClass("estiloBusquedaCoincidencias");
			//$("#qst_preg_sel div").addClass("estiloPreguntas");
			//$("#resultadosEncontradosBusqueda").hide();
		}else if(txt.length > 3){
			//$("#qst_preg_sel li:contains('"+txt+"')").css("background", "yellow");
			$("#qst_preg_sel li:contains('"+txt+"')").addClass("estiloBusquedaCoincidencias");
			//idElemento=$("#qst_preg_sel div:contains('"+txt+"')").attr("id");
			//$("#"+idElemento).addClass("estiloBusquedaCoincidencias");
		}else{
			//$("#qst_preg_sel li").css("background","#F0F0F0");
			$("#qst_preg_sel li:contains('"+txt+"')").removeClass("estiloBusquedaCoincidencias");
			//$("#qst_preg_sel div").addClass("estiloPreguntas");
			//$("#resultadosEncontradosBusqueda").hide();
		}
		//se lanza una funcion para buscar cuantos elementos estan resaltados
		mostrarElementosconClaseCSS();
	}else{
		//url: "index.php?m=mCuestionario2&c=mPreguntaS",


		hdnIdCuestionario=$("#hdnIdCuestionario").val();
		
		$.ajax({
			url: "index.php?m=mCuestionario2&c=mGetPreguntasDisponibles",
	        type: "GET",
			data:{
				idCuestionario : hdnIdCuestionario,
				txt : txt
			},
	        success: function(data) {
	        	var result = data;
				if(op==1){
					$("#qst_preg_dsp").html(result);
				}else{
					//$("#qst_preg_sel").html(result);
					//$("#qst_preg_sel").hide();
					//$("#qst_preg_sel_Copia").show();
					//$("#qst_preg_sel_Copia").html(result);
				}	
	        }
	    });
	}
	/*
	*Probando una nueva manera de buscar sin quitar los elementos del formulario
	*/
//cantidad=$("#qst_preg_sel div").length;//cantidad total de preguntas
//console.log(cantidad);

	/*
	$("#qst_preg_sel div").each(function(index){
		//console.log($(this).attr("id"));
		if(preguntasSeleccionadas==""){
			preguntasSeleccionadas=$(this).attr("id");
		}else{
			preguntasSeleccionadas=preguntasSeleccionadas+"|"+$(this).attr("id");
		}
	})
	console.log(preguntasSeleccionadas);
	*/
	
	//$("div:contains('León')").css("font-weight", "bold");
	
	//metodo con sombreado de la palabra en el div donde coincidan las palabras
	

	/*
	if(txt.length==0 || txt.length < 3){
		$("#qst_preg_sel div").css("background","#F0F0F0");
		$("#qst_preg_sel div").show();
	}else if(txt.length > 3){
		$("#qst_preg_sel div:contains('"+txt+"')").css("background", "yellow");
		idElemento=$("#qst_preg_sel div:contains('"+txt+"')").attr("id");
		//console.log(idElemento);
		
	}else{
		$("#qst_preg_sel div").css("background","#F0F0F0");
		
	}
	*/

	

}



//-------------------------------------------------------------------------
function mostrarElementosconClaseCSS(){
	//$("#resultadosEncontradosBusqueda").show();
	var elementosCss = $(".estiloBusquedaCoincidencias");
	$("#resultadosEncontradosBusqueda").html("Coincidencias encontradas: "+elementosCss.length);
}

function filtrarPreguntas(){
	filtro=$("#cboFiltroPregunta").val();
	alert(filtro);
}

function qst_delete_function(q){
	  $( "#qst_dialog_confirm" ).dialog({
      autoOpen:false,   
      resizable: false, 
      height:140,
      modal: true,
      buttons: {
        "Aceptar": function() {         
          qst_send_delete(q);
          $( this ).dialog( "close" );
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });

    $('#qst_dialog_confirm').html('<p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>&iquest;Desea borrar este cuestionario?</p>');
    $("#qst_dialog_confirm").dialog("open");		
	}
//-----------------------------------------------------------------------
function qst_send_delete(q){	
      $.ajax({
          url: "index.php?m=mCuestionario2&c=mDelCuestionario",
          type: "GET",
          data: { 
		  qst_id : q
		  },
          success: function(data) {
            var result = data; 
            if(result==1){
				//$('#eqp_dialog').dialog('close');
				$('#eqp_dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Los datos han sido eliminados correctamente.</p>');
				$("#eqp_dialog_message" ).dialog('open');
				qst_load_datatable();
				}
			else{
				//alert(result);
				$('#eqp_dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Ha ocurrido un error intentelo nuevamente.</p>');
				$("#eqp_dialog_message" ).dialog('open');
				}	
          }
      });
	 }	
//--------------------------------------------------------------
function buscador_users(op,txt){
	//alert(txt)
	if(op==1){
		$("#qst_bscdr_us").val("");
		}
	else{
		$("#qst_bscdr_ud").val("");
		}	
	var div = (op==1)?'qst_user_sel':'qst_user_dsp';
	//alert(div);
	var qst_users = $('#'+div+' div').map(function() {
		return this.id;
		}).get();
	us = "";	
	for (i=0; i<qst_users.length; i++){
		us += (us == "")?qst_users[i]:","+qst_users[i];
		}
	$.ajax({
		url: "index.php?m=mCuestionario2&c=mUsuario",
        type: "GET",
		data:{
			us : us,
			txt : txt
			},
        success: function(data) {
        var result = data;
		//alert(result)
		if(op==1){
			$("#qst_user_dsp").html(result);
			}
		else{
			$("#qst_user_sel").html(result);
			}	
          }
      });	
	}	 
//--------------------------------------------------------------------------------------------------------
function qst_edt_pre(idp){
	$( "#qst_dialog_formp" ).dialog('open');
	}
//-----------------------------------------------------------
//---------------------------------------
function qst_ver_img(img,id){
	//alert(img+"/"+id)
	$.ajax({
		url: "index.php?m=mCuestionario2&c=mImage",
		data : {
			img:img,
			id:id
			},
		type: "GET",
		success: function(data) {
			var result = data; 
				
				$("#qst_dialog_img").dialog("open");
				$('#qst_dialog_img').html(""); 
				$('#qst_dialog_img').html(result); 
				
				}
		});		

	}	
//-------------------------------------------------
function qst_save_img(){
	//alert($("#qst_src_val").val())
	$.ajax({
		url: "index.php?m=mCuestionario2&c=mSaveImg",
		data : {
			img : $("#qst_src_val").val(),
			grd : $("#qst_grd_val").val()
			},
		type: "GET",
		success: function(data) {
			var result = data; 
			//alert(result)
			/*if(result==1){
				$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>La imagen ha sido almacenada correctamente.</p>');
				$("#dialog_message" ).dialog('open');
				//alert(ide)
				//rev_get_preg_resp(ide);
				$("#qst_dialog_img").dialog("close");
				}
			else{
				$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>La imagen no ha podido ser almacenada.</p>');
				$("#dialog_message" ).dialog('open');		
				}		*/
				$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>La imagen ha sido almacenada correctamente.</p>');
				$("#dialog_message" ).dialog('open');
				$("#qst_dialog_img").dialog("close");
				$("#qst_dialog_img img").children().remove()
				$("#qst_dialog_chart img").children().remove()
				
				qst_load_preg_resp($("#qst_img_id").val());
				}
				
		});		

	}	
//------------------------------------------------------------
function qst_fedit_pr(){
	//alert("qst_fedit_pr");
	//alert($("#qst_hidpr").val());
	$.ajax({
		url: "index.php?m=mCuestionario2&c=mPregrespE",
		type: "GET",
		data: {
			idq : qst_idq
			},
		success: function(data) {
			var result = data; 
			//alert(op)
			
			
			$("#qst_dialog_pr").dialog("open");
			$("#qst_dialog_pr").dialog('option', 'title', 'Editar Respuestas');
			$('#qst_dialog_pr').html(""); 
			$('#qst_dialog_pr').html(result); 
				}
		});	
	}	
//--------------------------------------------------------------
function qst_set_idq(idq){
	qst_idq = idq;
	}	
//--------------------------------------------------------------
function qst_validar_pr(){
	var ifs = 0;
	$('.pr').each(function(index){
		 //alert($(this).val()); 
		 if($(this).val()==""){
			 qstp =  $(this).attr('title');
			 $('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>La pregunta "'+qstp+'" no ha sido contestada.</p>');
			 $("#dialog_message" ).dialog('open');
			 ifs++;
			 }
		 });
		if(ifs == 0) {
			save_set_pr();
			}
	}
//--------------------------------------------------------------
function save_set_pr(){
	// set modal dialog
	$("#dialog_message").dialog( "option", "modal", true );	
	$('#dialog_message').html('<p align="center"><img src="public/images/cargando.gif" > Procesando datos.Espere un momento, por favor.</p>');
	$("#dialog_message").dialog('open');
	$("body").css("cursor", "progress");
	var vls = "";
	$('.pr').each(function(index){
		idp = $(this).attr("name");
		//vls += (vls == "")?'('+idp+',"'+$(this).val()+'",'+qst_idq+')':',('+idp+',"'+$(this).val()+'",'+qst_idq+')';
		vls += (vls == "")?idp+',"'+$(this).val()+'",'+qst_idq:'|'+idp+',"'+$(this).val()+'",'+qst_idq;
	});
	//alert(vls)
	$.ajax({
		url: "index.php?m=mCuestionario2&c=mSaveSetpr",
		type: "GET",
		data: {
			idq  : qst_idq,
			vls  : vls,
			vl2  : $("#qst_dold").val()
			},
		success: function(data) {
			$("body").css("cursor", "default");
			var result = data; 
			//alert(result)
			if(result>0){
				$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Los cambios han sido almacenados correctamente.</p>');
				$("#dialog_message" ).dialog('open');
				$("#qst_dialog_pr").dialog("close");
				qst_load_preg_resp(qst_idq);
				}
			else{
				$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Los cambios no han sido almacenados intentelo mas tarde.</p>');
				$("#dialog_message" ).dialog('open');
				}	
			}
		});	
	}		
//-------------------------------------------
function qst_get_log(){
	$.ajax({
		url: "index.php?m=mCuestionario2&c=mGetLog",
		type: "GET",
		data: {
			idq  : qst_idq
			},
		success: function(data) {
			var result = data; 
			//alert(result)
			$("#qst_dia_log").dialog("open");
			$("#qst_dia_log").dialog('option', 'title', 'Editar Respuestas');
			$('#qst_dia_log').html(""); 
			$('#qst_dia_log').html(result); 
			}
		});		
	}
//---------------------------------------------------------------
function qst_sb_combo(t,x,z){
	//alert(z)
	if(t==3){
		$.ajax({
			url: "index.php?m=mCuestionario2&c=mGetCbos",
			type: "GET",
			data: {
				type  : t,
				z : z,
				x : x
			},
			success: function(data) {
				var result = data; 
				//alert(result)
				$('#qst_combos').html(result); 
			}
		});	
		}
	else{
		$('#qst_combos').html("");
		$('#qst_dcbox').html("");
		}	
	}	
//---------------------------------------------------------------
function qst_cbo_y(t,y){
	//alert(t)
	if(t>0){
		$.ajax({
			url: "index.php?m=mCuestionario2&c=mGetCbox",
			type: "GET",
			data: {
				type  : t,
				y : y
			},
			success: function(data) {
				var result = data; 
				//alert(result)
				$('#qst_dcbox').html(result); 
			}
		});	
		}
	else{
		$('#qst_dcbox').html("");
		}		
	}
//-------------------------------------------------------------------	
function qst_save_config(){
	var ordn = 1;
	var txt = "";
	$('#qst_cuestionarios div').each(function(index){
		var def = ($("#d_"+this.id).attr("checked"))?'S':'N';
		var act = ($("#a_"+this.id).attr("checked"))?'S':'N';
		//alert(ordn+"/"+this.id+"/"+def+"/"+act);
		txt += (txt=="")?'ORDEN = '+ordn+' , XDEFECTO = ['+def+'], ACTIVO = ['+act+'] WHERE ID_CUESTIONARIO = '+this.id:';ORDEN = '+ordn+' , XDEFECTO = ['+def+'], ACTIVO = ['+act+'] WHERE ID_CUESTIONARIO = '+this.id;
		ordn++;
		});
	//alert(txt);
	$.ajax({
			url: "index.php?m=mCuestionario2&c=mSaveConfig",
			type: "GET",
			data: {
				txt  : txt
			},
			success: function(data) {
				var result = data; 
				//alert(result)
				if(result > 0){
					$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Los cambios no han sido almacenados intentelo mas tarde.</p>');
					$("#dialog_message" ).dialog('open');
					}
				else{
					$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Los cambios han sido almacenados correctamente.</p>');
					$("#dialog_message" ).dialog('open');
					$('#qst_dialog_formg').dialog('close');
					//Cargar tabla principal
					qst_load_datatable();
					}	
				//$('#qst_dcbox').html(result); 
			}
		});
	
	}
//------------------------------------------------------------------------
function qst_get_param(id){
	var pregs = "";
	var qst_pregs = $("#qst_preg_sel div").map(function(){
		return this.id;
		}).get();
	for(i=0; i < qst_pregs.length; i++){
		pregs += (pregs=="")?qst_pregs[i]:","+qst_pregs[i];
		}
	//alert($("#qst_id").val())	
	$.ajax({
			url: "index.php?m=mCuestionario2&c=mGetParam",
			type: "GET",
			data: {
				id  : id,
				pr	: pregs,
				idq : $("#qst_id").val()
			},
			success: function(data) {
				var result = data; 
				//alert(result)
				if(result == 0){
					$('a[href="#qst_tab_pregunta"]').trigger('click');
					$('#dialog_message').html('<p align="center"><span class="ui-icon ui-icon-alert" style="float:left; margin:0 1px 25px 0;"></span>Debe seleccionar las preguntas que formaran el cuestionario antes de seleccionar una funci\u00f3n.</p>');
					$("#dialog_message" ).dialog('open');
					$('#qst_idf option:eq(-1)').attr('selected', 'selected')
					$('#qst_idf option:eq(-1)').prop('selected', true)
					}
				else{
					$('#qst_list_param').html(result); 	
					}	
					
					//Cargar tabla principal
					
				
				
			}
		});
	}
//------------------------------------------------------------------------
function qst_edt_op(idt){
	$.ajax({
		url: "index.php?m=mCuestionario2&c=mGetTipo",
        type: "GET",
		data:{
			idt : idt
			},
        success: function(data) {
        var result = data;
		//alert(result) 
		if(result=='N'){
			$('#qst_edt_pre option[value="S"]').prop('selected', true);
			$("#qst_edt_pre").prop('disabled',true);
			}
		if(result=='S'){
			$('#qst_edt_pre option[value="S"]').prop('selected', false);
			$("#qst_edt_pre").prop('disabled',false);
			}
	
          }
      });
	}	

// ---------------------------------  funcion que visualiza las caracteristcas condicionales.

function ver_condiciones(x_con){

if(x_con == 'S'){	

	 var ruta = "index.php?m=mCuestionario2&c=mPreguntasCondicionadas";
	
      $.ajax({
          url: ruta,
          type: "GET",
		  /*data: { 
		  id : id
		  },*/
          success: function(data) {
            var result = data; 
			 $("#configuracion").html(result);
			//$('#pdis').html(result);
          }
      });
	
	/*var tablita = '<table border="0" width="100%">'+
       ' <tr>'+
        '<td width="45%">'+
         '<div class="divs" id="conte_2">'+
            '     <select name="origen[]" id="destino" multiple="multiple" size="25" class="caja_stxt" style="width:100%; height:90%;">'+
                
            '    </select>'+
         '</div>'+
         '</td>'+
        '</tr>'+
        '</table>';*/
}else{
	var tablita = '';
}

	

}

//----------------------------------------

/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////                   Logica y bifurcacion                /////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 *@name Funciones de la modificaciones Logica y Bifurcacion
 *@function Carga las preguntas iniciales para las preguntas padre
 *@date	2013-03-25
 */

function cargaPreguntasPadre(idPregunta,pregunta){
	$("#pruebaLB").html(""); $("#preguntasPadreLB").hide();
	$("#nombre_padre").html(pregunta);
	url="index.php?m=mCuestionario2&c=mLogicaF";
	parametros="idPregunta="+idPregunta;
	$("#idPreguntaHija").attr("value",idPregunta);
	$.ajax({
		async:true,
		type: "GET",
		dataType: "html",
		contentType: "application/x-www-form-urlencoded",
		url:url,
		data:parametros,
		beforeSend:function(){ 
			$("#cargadorMensajes").show().html("Buscando..."); 
		},
		success:function(datos){ 
			$("#cargadorMensajes").hide();
			//$("#pruebaLB").show().html(datos);			
			//alert(datos);
			//console.log(datos);
			var result=datos.split("|");
			if(result[0]=='N'){
				$("#preguntasPadreLB input").each(function(index){
					var idElementoLB=this.id;
					//se extrae la parte del id
					if(parseInt(idPregunta)==parseInt(idElementoLB.substring(6))){
						$("#"+idElementoLB).hide();
					}else{
						$("#"+idElementoLB).show();
					}
				});

				$("#preguntasPadreLB").show();
				//$("#preguntasH1").css("background","red");
			}else{
				$("#pruebaLB").show().html("<strong>YA ESTA CONDICIONADO</strong>");
			}
		},
		timeout:90000000,
		error:function() { $("#pruebaLB").show().html('<center>Error. </center>'); }
	});	
}
/**
 *@function Se activa al dar clicl en el boton Guardar
 *@description Recupera el radiobutton asi como el disparador el titulo y el id del cuestionario
 *@param OPT1 radiobutton elegido
 *@param disparador valor del select dependiendo del radiobutton seleccionado
 *@param tit Titulo del cuestionario
 *@param idc ID del cuestionario
 */
function funcion_radio(){
	OPT1 = $('input:radio[name=preguntaSeleccionada]:checked').val();	
	check="nombreSelect"+OPT1;
	disparador=$("#"+check).val();
	tit=$("#hdnTit").val();
	idc=$("#hdnCID").val();
	
	if(disparador == "" || disparador==undefined || disparador==null){
		$("#dialog_error").dialog({
			modal:true,
			width:200,
			title:"Atención",
			height: 'auto',
			buttons:{
				Aceptar:function(){
					$("#dialog_error").dialog("close");
				}
			}
		})
	}else{
		//se recupera el id de la pregunta hija
		idPreguntaHija=$("#idPreguntaHija").val();
		$.ajax({
			url: "index.php?m=mCuestionario2&c=mOpcion",
			type: "GET",
			data: {
				idp : OPT1,
				dsp : disparador,
				iph : idPreguntaHija
			},
			success: function(data) {
				$("#preguntasPadreLB").hide();
				$("#pruebaLB").html(data);
				var result = data;

				actualizaPreguntasHijas(idPreguntaHija);
			}
		});	
	}
	
}
/**
 *@name Mostrar Select
 *@description Muestra el select correspondiente dependiendo del radiobutton seleccionado
 *
 **/
function mostrar_select(idPregunta){
	nombresSelect=$("#hdnNombresSelect").val();
	//alert(nombresSelect);
	nombresSelect=nombresSelect.split(" ");
	
	for(var i=0;i<nombresSelect.length;i++){		
		$("#"+nombresSelect[i]).hide();
	}
	$("#nombreSelect"+idPregunta).show();	
}

function nombreSelect(idPregunta,pregunta){		
	$("#preguntasPadreLB").hide();
	$("#nombre_padre").html(pregunta);
	$.ajax({
		url: "index.php?m=mCuestionario2&c=mValidar",
		type: "GET",
		data: {
			idp : idPregunta			
		},
		success: function(data) {		
			$("#pruebaLB").html(data);
			var result = data;
		}
	});	
}

function actualizar(){		
	idp=$("#hdnIdPreguntaEliminar").val();
	idc=$("#hdnciD").val();
	if(confirm != 0){
		//alert(idp);	
		//$("#dialog_preg").dialog();
			$("#dialog_preg").dialog({
			modal:true,
			width:350,
			title:"Atención",
			height: 'auto',
			buttons:{
				Aceptar:function(){
					$.ajax({
						url: "index.php?m=mCuestionario2&c=mActualizar",
						type: "GET",
						data: {
							idp : idp			
						},
						success: function(data) {
							$("#pruebaLB").html(data);
							var result = data;
							actualizaPreguntasHijas(idp);
						}
					});
					$("#dialog_preg").dialog("close");
				},
				Cancelar:function(){
					$("#dialog_preg").dialog("close");
				}
			}
			})
	}
}
/**
 *@name Actualiza lista de Preguntas Hijas
 *@description Actualiza dentro del div las preguntas que ya tienen un disparador asignado y cambia la funcion en su parametro onclick
 *
 **/
function actualizaPreguntasHijas(idP){
	//se recuperan los valores que son el idPregunta, y su descripcion
	valorPH=$.trim($("#"+idP).html());//valor de la pregunta seleccionada
	if($("#"+idP).hasClass('divPreguntas')){
		$("#"+idP).removeClass('divPreguntas');
		$("#"+idP).addClass('divPreguntasSeleccionadas');
		//se cambia la funcion para generar el siguiente onclick
		$("#"+idP).attr("onclick","nombreSelect('"+idP+"','"+valorPH+"')");
	}else if($("#"+idP).hasClass('divPreguntasSeleccionadas')){
		$("#"+idP).removeClass('divPreguntasSeleccionadas');
		$("#"+idP).addClass('divPreguntas');
		//se cambia la funcion para generar el siguiente onclick
		$("#"+idP).attr("onclick","cargaPreguntasPadre('"+idP+"','"+valorPH+"')");
	}
}
/**
*@name Actualiza el listado de preguntas padre
*@description Actualiza el listado de las preguntas padre para la actualizacion
**/
function actualizarPreguntasDisponibles(){
	var hdnciD=$("#hdnciD").val();
	//divPreguntasHijas
	url="index.php?m=mCuestionario2&c=actualizaPreguntasDisponibles";
	parametros="idCuestionario="+hdnciD;
	$.ajax({
		async:true,
		type: "GET",
		dataType: "html",
		contentType: "application/x-www-form-urlencoded",
		url:url,
		data:parametros,
		beforeSend:function(){ 
			$("#cargadorMensajes").show().html("Buscando..."); 
		},
		success:function(datos){ 
			$("#cargadorMensajes").hide();
			$("#divPreguntasHijas").show().html(datos);
		},
		timeout:90000000,
		error:function() { $("#pruebaLB").show().html('<center>Error. </center>'); }
	});	
}
//----------------------------------------
function ajaxCuestionarios(c,parametros,divCarga,divResultado,tipoPeticion){
	$.ajax({
		url: "index.php?m=mCuestionario2&c="+c,
		type: tipoPeticion,
		data: parametros,
		beforeSend:function(){ 
			$("#"+divCarga).show().html("Procesando Informacion ..."); 
		},
		success: function(data) {
			$("#"+divResultado).html(data);
		}
	});
}

/*function ajaxCuestionarios(accion,c,parametros,divCarga,divResultado,tipoPeticion){
	$.ajax({
		url: "index.php?m=mCuestionario2&c="+c,
		type: tipoPeticion,
		data: parametros,
		beforeSend:function(){ 
			$("#"+divCarga).show().html("Procesando Informacion ..."); 
		},
		success: function(data) {
			//$("#"+divResultado).html(data);
			controladorAcciones(accion,data);
		}
	});
}*/

/*function controladorAcciones(accion,data){
	switch(accion){
		case "eliminaPregunta":
			alert(data);
			var mensaje="";
			if(data==1){//se elimino la pregunta
				mensaje="Pregunta eliminada del cuestionario";
			}else{//en caso de generarse un error
				mensaje="Error al eliminar la pregunta";
			}
			$("#dialog_pregElimMensajes").html(mensaje);
			$("#dialog_pregElimMensajes").dialog({
				modal:true,
				width:350,
				title:"Atención",
				height: 'auto',
				buttons:{
					Aceptar:function(){
						$("#dialog_pregElimMensajes").dialog("close");
					}
				}
			});
			hdnIdCuestionario=$("#hdnIdCuestionario").val();
			actualizaPreguntasCuestionario(hdnIdCuestionario);
		break;
		case "actualizaPreguntasCuestionario":

		break;
	}
}*/	

function quitarPreguntaCuestionario(idCuestionario,idPregunta){
	//alert("idCuestionario: "+idCuestionario+"\n\n"+"Pregunta: "+idPregunta);
	$("#dialog_pregElim").dialog({
	 	modal:true,
	 	width:350,
	 	title:"Atención",
	 	height: 'auto',
	 	buttons:{
	 		Aceptar:function(){
	 			$.ajax({
	 				url: "index.php?m=mCuestionario2&c=eliminaPreguntaCuestionarios",
	 				type: "GET",
	 				data: {
	 					idCuestionario : idCuestionario,
	 					idPregunta : idPregunta			
	 				},
	 				beforeSend:function(){ 
	 					$("#dialog_pregElimMensajes").show().html("Ejecutando operaciones..."); 
	 				},
	 				success: function(data) {
	 					$("#dialog_pregElimMensajes").html(data);
	 					$("#dialog_pregElimMensajes").dialog({
	 						modal:true,
	 						width:350,
	 						title:"Atención",
	 						height: 'auto',
	 						buttons:{
	 							Aceptar:function(){
	 								$("#dialog_pregElimMensajes").dialog("close");
	 							}
	 						}
	 					})
	 					$("#dialog_pregElim").dialog("close");
	 					actualizaPreguntasCuestionario(idCuestionario);
	 				}
	 			});
	 			$("#dialog_pregElim").dialog("close");
	 		},
	 		Cancelar:function(){
	 			$("#dialog_pregElim").dialog("close");
	 		}
	 	}
	})

	/*$("#dialog_pregElim").dialog({
		modal:true,
		width:350,
		title:"Atención",
		height: 'auto',
		buttons:{
			Aceptar:function(){
				//funcion ajax
				parametros="action=eliminaPreguntaCuestionarios&idCuestionario="+idCuestionario+"&idPregunta="+idPregunta;
				ajaxCuestionarios("eliminaPregunta","controlador",parametros,"dialog_pregElimMensajes","qst_preg_sel","POST");
				$("#dialog_pregElim").dialog("close");
			},
			Cancelar:function(){
				$("#dialog_pregElim").dialog("close");
			}
		}
	})*/
	
}


function actualizaPreguntasCuestionario(idCuestionario){
	$("#content").remove();
	//parametros="action=actualizaPreguntasCuestionario&idCuestionario="+idCuestionario;
	parametros="idCuestionario="+idCuestionario;
	//alert(parametros);
	ajaxCuestionarios("mActualizaPreguntaCuestionarios",parametros,"qst_preg_sel","qst_preg_sel","GET");	
}

function mostrarPreguntasDisponibles(){
	$("#contenedorPreguntasCuestionario").hide();
	$("#contenedorPreguntasDisponibles").show();
	$("#btnCatalogoPreguntas").attr("value"," Regresar...");
	$("#btnCatalogoPreguntas").attr("onclick","regresarAPreguntas()");
	hdnIdCuestionario=$("#hdnIdCuestionario").val();
	$("#qst_bscdr_d").attr("value","");
	//alert(hdnIdCuestionario);
	parametros="idCuestionario="+hdnIdCuestionario+"&txt=N/A";
	ajaxCuestionarios("mGetPreguntasDisponibles",parametros,"qst_preg_dsp","qst_preg_dsp","GET");
}

function regresarAPreguntas(){
	$("#contenedorPreguntasCuestionario").show();	
	$("#contenedorPreguntasDisponibles").hide();
	$("#btnCatalogoPreguntas").attr("value","Catalogo preguntas");
	$("#btnCatalogoPreguntas").attr("onclick","mostrarPreguntasDisponibles()");	
}

function agregaPreguntasCuestionario(idCuestionario){
	var elementos="";

	for (var i=0;i<document.frmAgregarPreguntas.elements.length;i++){
		if (document.frmAgregarPreguntas.elements[i].type=="checkbox"){
			if (document.frmAgregarPreguntas.elements[i].checked){				
				if (elementos=="")
					elementos=elementos+document.frmAgregarPreguntas.elements[i].value;
				else
					elementos=elementos+",,,"+document.frmAgregarPreguntas.elements[i].value;
					
			}	
		}
	}
	
	if(elementos==""){
		$("#dialog_error").html("Error, debe seleccionar al menos una pregunta");
		$("#dialog_error").dialog({
			modal:true,
			width:350,
			title:"Atención",
			height: 'auto',
			buttons:{
				Aceptar:function(){
					$("#dialog_error").dialog("close");
				}
			}
		});
	}else{
		//se prepara el envio de informacion para enviarlo hacia la base de datos y actualizar el cuestionario
		parametros="idCuestionario="+idCuestionario+"&idPreguntasAgregar="+elementos;
		ajaxCuestionarios("mSetPreguntasCuestionario",parametros,"qst_preg_dsp","qst_preg_dsp","POST");
		regresarAPreguntas();
	}
	actualizaPreguntasCuestionario(idCuestionario);
}
