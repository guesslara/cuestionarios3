<?php
/** * 
 *  @package             
 *  @name                Pagina default del modulo silver 
 *  @version             1
 *  @copyright           Air Logistics & GPS S.A. de C.V.   
 *  @author              Rodwyn Moreno
 *  @modificado          23-04-2012
**/
 
	$db = new sql($config_bd['host'],$config_bd['port'],$config_bd['bname'],$config_bd['user'],$config_bd['pass']);
	
	if(!$userAdmin->u_logged())
		echo '<script>window.location="index.php?m=login"</script>';
	
	$idCliente   = $userAdmin->user_info['ID_CLIENTE'];

	$tpl->set_filenames(array('default'=>'default'));	
	$idProfile   = $userAdmin->user_info['ID_PROFILE'];	

	$tpl->assign_vars(array(
		'PAGE_TITLE'	=> "Administraci&oacute;n unidades",	
		'PATH'			=> $dir_mod,
		'PATH_IMG'		=> $dir_pimages,	
		'APIKEY'		=> $config['keyapi'],
		'COD_USER' 		=> $userAdmin->user_info['COD_USER'],
		'COD_CLI'	 	=> $idCliente,
		'HEADER'		=> $userAdmin->getHeaderAdmin('Administración de Unidades','units',true)
	));	

	$tpl->pparse('default');
?>