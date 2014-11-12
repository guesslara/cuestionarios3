<?php
/** * 
 *  @package             Consola web
 *  @name                
 *  @version             1.1
 *  @copyright           Air Logistics & GPS S.A. de C.V.   
 *  @author              Enrique Peña 
 *  @modificado          25-03-2011
**/
class mFunciones{
	public $data="";
function ngraficas($dbh,$dbuser,$dbpass,$dbname,$qst,$rtime,$dti,$dtf){
	$conexion = mysqli_connect($dbh,$dbuser,$dbpass,$dbname);
	if($conexion){
		$sql = "SELECT P.ID_PREGUNTA, P.COMPLEMENTO,P.GRAFICABLEDATA,P.DESCRIPCION AS PREGUNTA
		FROM CRM2_PREG_RES PR
		INNER JOIN CRM2_PREGUNTAS P ON P.ID_PREGUNTA=PR.ID_PREGUNTA
		INNER JOIN CRM2_RESPUESTAS R ON R.ID_RES_CUESTIONARIO=PR.ID_RES_CUESTIONARIO
		INNER JOIN CRM2_TIPO_PREG TP ON TP.ID_TIPO = P.ID_TIPO
		WHERE TP.GRAFICABLE = 1 AND R.ID_CUESTIONARIO=".$qst.$rtime." GROUP BY P.ID_PREGUNTA;";
		$query = mysqli_query($conexion, $sql);	
		$count = @mysqli_num_rows($query);
		if($count > 0){
			while($row= @mysqli_fetch_array($query)){
				//$this->graficar($dbh,$dbuser,$dbpass,$dbname,$qst,$rtime,$row['ID_PREGUNTA']);
				//$this->tabla($dbh,$dbuser,$dbpass,$dbname,$qst,$rtime,$row['ID_PREGUNTA'],$row['COMPLEMENTO'],$dti,$dtf);
				$idp_com = ($idp_com=="")?$row['ID_PREGUNTA']."|".$row['COMPLEMENTO']."|".$row['PREGUNTA']: $idp_com."*".$row['ID_PREGUNTA']."|".$row['COMPLEMENTO']."|".$row['PREGUNTA'];
				//$idp_com = ($idp_com=="")?$row['ID_PREGUNTA']."|".$row['GRAFICABLEDATA']."|".$row['PREGUNTA']: $idp_com."*".$row['ID_PREGUNTA']."|".$row['GRAFICABLEDATA']."|".$row['PREGUNTA'];
				
				}
				//echo $idp_com;
				return $idp_com;
			}
		}
	}	
//--------------------------------------------------------------
function tabla($dbh,$dbuser,$dbpass,$dbname,$qst,$rtime,$idp,$complemento, $dti, $dtf){
	$tabla = array();
	$x=0;
	$y=0;
	$d="";
	$com = explode(",",$complemento);
	$d1 = new DateTime($dti);
	$d2 = new DateTime($dtf);
	while($d1<=$d2){
		$d = ($d=="")?$d1->format('d/m'):$d.",".$d1->format('d/m');
		$d1->modify('+1 day');
		}
		//echo $d;
	$dts = explode(",",$d);
	for($i=0; $i<count($dts); $i++){
		 $tabla[$i+1][0]=$dts[$i];
		}
	for($i=0; $i<count($com); $i++){
		 //$tabla[0][$i+1]=$com[$i];
		 $tabla[0][$i+1]= (is_numeric($com[$i]))?"Cantidad":$com[$i];
		 
		}
	$this->llenar_tabla($dbh,$dbuser,$dbpass,$dbname,$qst,$rtime,$idp,$tabla,count($com));
	}
	
//--------------------------------------------------------------
function llenar_tabla($dbh,$dbuser,$dbpass,$dbname,$qst,$rtime,$idp,$tabla,$com){
	$this->data="";
	$conexion = mysqli_connect($dbh,$dbuser,$dbpass,$dbname);
	if($conexion){
		$sql = "SELECT 
		CONCAT( 
		IF(EXTRACT(DAY FROM R.FECHA)<=9,CONCAT(0,EXTRACT(DAY FROM R.FECHA)),EXTRACT(DAY FROM R.FECHA)),'/', 
		IF(EXTRACT(MONTH FROM R.FECHA)<=9,CONCAT(0,EXTRACT(MONTH FROM R.FECHA)),EXTRACT(MONTH FROM R.FECHA)) ) AS D, 
		PR.RESPUESTA 
		FROM CRM2_PREG_RES PR 
		INNER JOIN CRM2_PREGUNTAS P ON P.ID_PREGUNTA=PR.ID_PREGUNTA 
		INNER JOIN CRM2_RESPUESTAS R ON R.ID_RES_CUESTIONARIO=PR.ID_RES_CUESTIONARIO 
		INNER JOIN CRM2_TIPO_PREG TP ON TP.ID_TIPO = P.ID_TIPO 
		WHERE TP.GRAFICABLE = 1 
		AND R.ID_CUESTIONARIO=".$qst."
		AND PR.ID_PREGUNTA= ".$idp."
		".$rtime."  ORDER BY D,RESPUESTA;";
		$query = mysqli_query($conexion, $sql);	
		$count = @mysqli_num_rows($query);
		if($count > 0){
			while($row= @mysqli_fetch_array($query)){
				for($r=0; $r<count($tabla); $r++){
					for($c=0; $c<=$com; $c++){
						if($tabla[$r][0]!=""){
						   if($row['D']==$tabla[$r][0]){
							   //echo $row['D']."==".$tabla[$r][0]."<br>";
							   if($tabla[0][$c]!=""){
								   //echo $row['RESPUESTA']."==".$tabla[0][$c]."<br>";
								   if($row['RESPUESTA']==$tabla[0][$c]){
									   $tabla[$r][$c] =  ($tabla[$r][$c]=="")?1:$tabla[$r][$c]+1;
									}
									else{
										if(is_numeric($row['RESPUESTA'])){
											$tabla[$r][$c] =  $row['RESPUESTA'];
											}
										}
							   }
							}
						  }
						}
					}
				}
				
/*		for($r=0; $r<count($tabla); $r++){
		   for($c=0;$c<=$com;$c++){
			echo "[".$r."][".$c."]=". $tabla[$r][$c].' | ';
		   }
		   echo "<br>";
		}*/
		//echo count($tabla);
		for($r=0; $r<count($tabla); $r++){
		   for($c=0;$c<=$com;$c++){
			//$data =  ($data=="")?$tabla[$r][$c]:$data."|".$tabla[$r][$c];
			if($this->data==""){
				$this->data= ($tabla[$r][$c]!="")?$tabla[$r][$c]:0;
				}
			else{
				$this->data.= ($tabla[$r][$c]!="")?"|".$tabla[$r][$c]:"|".(0);
				}	
		   }
		   if($r<count($tabla)-1){
			   $this->data.=",";
			   }
		}	
		//echo $data;
		//return $data;			
			}
		}
		//echo $data;
		//$this->pintar_grafica($data);
		//return 1;
	}
//--------------------------------------------------------------
function pintar_grafica($data){
	
	}
//--------------------------------------------------------------
function graficar($dbh,$dbuser,$dbpass,$dbname,$qst,$rtime,$idp){
	$c=0;
	$values = array();
	$conexion = mysqli_connect($dbh,$dbuser,$dbpass,$dbname);
	if($conexion){
		$sql = "SELECT 
		CONCAT(
		IF(EXTRACT(DAY   FROM R.FECHA)<=9,CONCAT(0,EXTRACT(DAY   FROM R.FECHA)),EXTRACT(DAY FROM R.FECHA)),'/',
		IF(EXTRACT(MONTH FROM R.FECHA)<=9,CONCAT(0,EXTRACT(MONTH FROM R.FECHA)),EXTRACT(MONTH FROM R.FECHA))
		) AS D,
		P.ID_TIPO,
		P.DESCRIPCION AS PREGUNTA,
		P.COMPLEMENTO,
		PR.RESPUESTA,
		COUNT(RESPUESTA) AS N
		FROM CRM2_PREG_RES PR 
		INNER JOIN CRM2_PREGUNTAS  P ON P.ID_PREGUNTA=PR.ID_PREGUNTA 
		INNER JOIN CRM2_RESPUESTAS R ON R.ID_RES_CUESTIONARIO=PR.ID_RES_CUESTIONARIO 
		INNER JOIN CRM2_TIPO_PREG TP ON TP.ID_TIPO = P.ID_TIPO
		WHERE TP.GRAFICABLE = 1 
		AND R.ID_CUESTIONARIO=".$qst."
		AND PR.ID_PREGUNTA= ".$idp.$rtime." GROUP BY D,RESPUESTA  ORDER BY D;";
		}
		$query = mysqli_query($conexion, $sql);	
		$count = @mysqli_num_rows($query);
		if($count > 0){
			while($row= @mysqli_fetch_array($query)){
				$comp = explode(",",$row['COMPLEMENTO']);
				$cr = count($comp);
				$resp = explode(",",$row['RESPUESTA']);
				for($i=1; $i<=count($comp); $i++){
					if(count($values)==0){
						//echo $comp[$i];
						if(in_array($comp[$i],$resp)){
							$values[$c][0] = $row['D'];
							$values[$c][$i]++;
							}
						}
					else{
						if($values[$c][0]==$row['D']){
							if(in_array($comp[$i],$resp)){
								$values[$c][i]++;
								}	
							}
						else{
							$c++;
							if(in_array($comp[$i],$resp)){
								$values[$c][0]=$row['D'];
								$values[$c][$i]++;
								}
							}	
						}	
					}
				}
			echo count($values);
			echo "<br>";
			echo count($cr);
			echo "<br>";
		echo $values[0][0]."|".$values[0][1]."|".$values[0][2];
			
		}
	}
//--------------------------------------------------------------	
function get_cabecera($dbh,$dbuser,$dbpass,$dbname,$qst,$rtime){
	$cab = array();
	$ids = array();
	$conexion = mysqli_connect($dbh,$dbuser,$dbpass,$dbname);
	if($conexion){
		$sql = "SELECT P.ID_PREGUNTA,P.ID_TIPO,P.DESCRIPCION AS PREGUNTA, P.COMPLEMENTO
		FROM CRM2_PREG_RES PR
		INNER JOIN CRM2_PREGUNTAS P ON P.ID_PREGUNTA=PR.ID_PREGUNTA
		INNER JOIN CRM2_RESPUESTAS R ON R.ID_RES_CUESTIONARIO=PR.ID_RES_CUESTIONARIO
		INNER JOIN CRM2_TIPO_PREG TP ON TP.ID_TIPO = P.ID_TIPO
		WHERE TP.GRAFICABLE = 1 AND R.ID_CUESTIONARIO=".$qst.$rtime." GROUP BY PREGUNTA ORDER BY R.FECHA,P.ID_TIPO,PREGUNTA;";
		$query = mysqli_query($conexion, $sql);	
		$count = @mysqli_num_rows($query);
		if($count > 0){
			while($row= @mysqli_fetch_array($query)){
				if(!in_array($row['ID_PREGUNTA'],$ids)){
							$ids[]=$row['ID_PREGUNTA'];
							}
				switch($row['ID_TIPO']){
						case 1:
						if(!in_array($row['PREGUNTA'],$cab)){
							$cab[]=$row['PREGUNTA'];
							}
						break;
						case 3:
						if(!in_array("SI",$cab)){
							$cab[]="SI";
							}
						if(!in_array("NO",$cab)){
							$cab[]="NO";
							}
						break;
						case 6:
						$r=explode(",",$row['COMPLEMENTO']);
						for($i=0; $i<count($r); $i++){
							if(!in_array($r[$i],$cab)){
							$cab[]=$r[$i];
							}	
						}
						break;
						case 7:
						$r=explode(",",$row['COMPLEMENTO']);
						for($i=0; $i<count($r); $i++){
							if(!in_array($r[$i],$cab)){
							$cab[]=$r[$i];
							}					
						}
						break;						
					}
				}	
				//Convertir array a cadena
				$scab="";
				for($i=0; $i<count($cab); $i++)	{
					$scab = ($scab=="")?$cab[$i]:$scab."|".$cab[$i];
					}
				return $scab;		
			}
		}
	
	}
	
function get_data($dbh,$dbuser,$dbpass,$dbname,$qst,$rtime,$cabs){
	
	$fecha_act = "";
	$fecah_ant = "";
	$cabs_txt  = array();
	$r = explode("|",$cabs);
	
	for($i=0; $i<count($r); $i++){
		$cabs_txt[]=$r[$i];
		if($as==""){
			$as = "'Fecha' => '','".$r[$i]."' => 0";
			}
		else{
			$as .= ",'".$r[$i]."' => 0";
			}	
		}
	$datos = array($as);	
	
	$conexion = mysqli_connect($dbh,$dbuser,$dbpass,$dbname);
	if($conexion){
		$sql = "SELECT 
		CONCAT(
		IF(EXTRACT(DAY   FROM R.FECHA)<=9,CONCAT(0,EXTRACT(DAY   FROM R.FECHA)),EXTRACT(DAY FROM R.FECHA)),'/',
		IF(EXTRACT(MONTH FROM R.FECHA)<=9,CONCAT(0,EXTRACT(MONTH FROM R.FECHA)),EXTRACT(MONTH FROM R.FECHA))
		) AS D,
		P.ID_TIPO,
		P.DESCRIPCION AS PREGUNTA,PR.RESPUESTA 
		FROM CRM2_PREG_RES PR 
		INNER JOIN CRM2_PREGUNTAS  P ON P.ID_PREGUNTA=PR.ID_PREGUNTA 
		INNER JOIN CRM2_RESPUESTAS R ON R.ID_RES_CUESTIONARIO=PR.ID_RES_CUESTIONARIO 
		WHERE P.ID_TIPO IN(3,6,7) 
		AND R.ID_CUESTIONARIO=174 
		AND R.FECHA BETWEEN '2013-06-10 00:00:00' AND '2013-06-16 23:59:59' ORDER BY D,P.ID_TIPO,PREGUNTA";
		$query = mysqli_query($conexion, $sql);	
		$count = @mysqli_num_rows($query);
		$c=0;
		$f=0;
		if($count > 0){
			while($row= @mysqli_fetch_array($query)){
				if($f==0){
				$fecha_act=$row['D'];
				$fecah_ant=$fecha_act;
				}
				
				if($fecah_ant==$fecha_act){
				for($i=0; $i<count($cabs_txt); $i++){
					//echo $fecah_ant."==".$fecha_act."<br><br>";
					
						//echo "datos['Fecha'][".$c."]=".$fecha_act.";<br>";
						//echo $datos['Fecha'][$c]=$fecha_act;
						//echo "<br>";
						switch($row['ID_TIPO']){
							case 3:
							if($row['RESPUESTA']==$cabs_txt[$i]){
								echo "datos['".$cabs_txt[$i]."'][".$c."]++";
								echo $datos["'".$cabs_txt[$i]."'"][$c]++;
								}
							break;
							case 6:
							if($row['RESPUESTA']==$cabs_txt[$i]){
								$datos["'".$cabs_txt[$i]."'"][$c]++;
								}
							break;
							case 7:
							$p = strrpos($row['RESPUESTA'],$cabs_txt[$i]);
							if($p==true){
								$datos["'".$cabs_txt[$i]."'"][$c]++;
								}
							break;	
							}//switch
						}//for
						echo "<br><br>";
					}//if
					else{
							$c++;
						}
					$f++;
					$fecah_ant = $fecha_act;
					$fecha_act = $row['D'];
				}//while
				//Tratamiento de datos
				$data="";
				for($i=0; $i<count($datos); $i++){
					for($j=0; $j<count($cabs_txt); $j++){
						$data = ($data=="")?$datos['Fecha'][$i]."|".$datos["'".$cabs_txt[$j]."'"][$i]:$data."|".$datos["'".$cabs_txt[$j]."'"][$i];
						}
						if(count($cabs_txt)>1){
							$data.= ",";
							}
					}
					echo $data;
				return $data;
			}
		}	
		
	//return($datos);	
	}
	
function get_value($dbh,$dbuser,$dbpass,$dbname,$qst,$rtime, $res){
	$conexion = mysqli_connect($dbh,$dbuser,$dbpass,$dbname);
	if($conexion){
		$sql = "SELECT 
		CONCAT(
		IF(EXTRACT(DAY   FROM R.FECHA)<=9,CONCAT(0,EXTRACT(DAY   FROM R.FECHA)),EXTRACT(DAY FROM R.FECHA)),"/",
		IF(EXTRACT(MONTH FROM R.FECHA)<=9,CONCAT(0,EXTRACT(MONTH FROM R.FECHA)),EXTRACT(MONTH FROM R.FECHA))
		) AS D,
		(SELECT COUNT(RESPUESTA) FROM CRM2_PREG_RES WHERE RESPUESTA='Bueno') AS A,
		(SELECT COUNT(RESPUESTA) FROM CRM2_PREG_RES WHERE RESPUESTA='Malo')  AS B,
		(SELECT COUNT(RESPUESTA) FROM CRM2_PREG_RES WHERE RESPUESTA='Regular')  AS C
		FROM CRM2_PREGUNTAS P
		INNER JOIN CRM2_PREG_RES PR ON PR.ID_PREGUNTA=P.ID_PREGUNTA
		INNER JOIN CRM2_RESPUESTAS R ON R.ID_RES_CUESTIONARIO=PR.ID_RES_CUESTIONARIO
		WHERE R.ID_CUESTIONARIO=173 AND R.FECHA BETWEEN '2013-06-12 00:00:00' AND '2013-06-12 23:59:59' 
		GROUP BY D";
		$query = mysqli_query($conexion, $sql);	
		$count = @mysqli_num_rows($query);
		if($count > 0){
			$row= @mysqli_fetch_array($query);
				return $row['F']."!".$row['D']."!".$row['N'];		
			}
		}
	}	
}
?>