<?php
/**
*Controlador para las funciones de los cuestionarios
*@copyright         Air Logistics & GPS S.A. de C.V.  
*@author 			Gerardo Lara
*/

if($_SERVER["HTTP_REFERER"]==""){
	echo "0";
}else{
	include "claseCuestionarios.php";
	//se instancia la clase que contiene las funciones de los cuestionarios
	$objC=new cuestionarios2();
	//print_r($_POST);
	//exit();
	switch($_POST["action"]){
		case "eliminaPreguntaCuestionarios":
			echo $resultadoOperacion=$objC->quitarPreguntasCuestionario($_POST["idCuestionario"],$_POST["idPregunta"]);
		break;
		case "actualizaPreguntasCuestionario":
			//echo "Actualiza";
			echo $actualizacion=$objC->actualizarPreguntasCuestionario($_POST["idCuestionario"]);
		break;
	}
	switch($_GET["action"]){
		case "cargarCuestionarios":
			//echo "<pre>";
			//print_r($_GET);
			//echo "</pre>";
			$Positions= new cPositions();
			$iWeekNum = Date('W') - 1;
			$iYear = date("Y");
			$sStartTS = $Positions->WeekToDate($iWeekNum, $iYear);
			$sStartDate = date ("Y-m-d", $sStartTS);
			$sEndDate   = date ("Y-m-d", $sStartTS + (6*24*60*60));
			$objC->cargarCuestionarios($_GET["idCliente"],$sStartDate,$sEndDate);
		break;
	}
}

?>