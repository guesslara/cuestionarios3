<?php
/** *              
 *  @name                Script que muestra los datos de un perfil
 *  @copyright           Air Logistics & GPS S.A. de C.V.   
 *  @author              Rodwyn Moreno
 *  @modificado          27/03/13
**/
	header('Content-Type: text/html; charset=UTF-8');
	$db = new sql($config_bd['host'],$config_bd['port'],$config_bd['bname'],$config_bd['user'],$config_bd['pass']);
	if(!$userAdmin->u_logged())
		echo '<script>window.location="index.php?m=login"</script>';	
	
	$db ->sqlQuery("SET NAMES 'utf8'");	
	
	$emp = $userAdmin->user_info['ID_EMPRESA'];
	$cte = $userAdmin->user_info['ID_CLIENTE'];
	$qst = $dbf->getRow('CRM2_CUESTIONARIOS','ID_CUESTIONARIO = '.$_GET['cuestionario']);
	
	$iWeekNum = Date('W') - 1;
		$iYear = date("Y");
		$sStartTS = $Positions->WeekToDate($iWeekNum, $iYear);
		$sStartDate = date ("Y-m-d", $sStartTS);
		$sEndDate   = date ("Y-m-d", $sStartTS + (6*24*60*60));		
	
	$tpl->set_filenames(array('mEstadistica' => 'tEstadistica'));
	
	$sd_h = $Functions->cbo_number(24,"00");
	$sd_m = $Functions->cbo_number(60,"00");
	$ed_h = $Functions->cbo_number(24,"23");
	$ed_m = $Functions->cbo_number(60,"59");
	
	$users = $dbf->cbo_from_all("ID_USUARIO","NOMBRE_COMPLETO","ADM_USUARIOS","ID_CLIENTE = ".$cte,"");
	$c_qry = " FROM CRM2_CUESTIONARIO_PREGUNTAS CP INNER JOIN CRM2_PREGUNTAS P ON P.ID_PREGUNTA = CP.ID_PREGUNTA WHERE    CP.ID_CUESTIONARIO = ".$_GET['cuestionario'];
	$pregs = $dbf->cbo_from_query("CP.ID_PREGUNTA","P.DESCRIPCION",$c_qry,"",true);
	//$pregs = $dbf->cbo_from_all("ID_PREGUNTA","DESCRIPCION","CRM2_PREGUNTAS","COD_CLIENT = ".$emp." ORDER BY DESCRIPCION","");
	
	
	$tpl->assign_vars(array(

		'DB_H'          => $config_bd['host'],
		'DB_PORT'       => $config_bd['port'],
		'DB_BN'         => $config_bd['bname'],
		'DB_U'          => $config_bd['user'],
		'DB_PASS'       => $config_bd['pass'],
		'ID_QST'        => $_GET['cuestionario'],
		'STR_DATE'      => $sStartDate,
		'END_DATE'      => $sEndDate,
		'SD_H'      	=> $sd_h,
		'SD_M'      	=> $sd_m,
		'ED_H'      	=> $ed_h,
		'ED_M'      	=> $ed_m,
		'USERS'      	=> $users,
		'PREGS'      	=> $pregs,
		'QSTON'      	=> @$qst['DESCRIPCION']

	));	
	$tpl->pparse('mEstadistica');	
?>	