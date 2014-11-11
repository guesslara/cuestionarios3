<?php
/**
*Clase para el manejo de las diferentes operaciones en el modulo de cuestionarios
*@copyright         Air Logistics & GPS S.A. de C.V.  
*@author 			Gerardo Lara
*/

class cuestionarios2{

	private $objDb;
	private $host;
	private $port;
	private $bname;
	private $user;
	private $pass;

	function __construct() {
		include "config/database.php";
		$this->host=$config_bd['host'];
		$this->port=$config_bd['port'];
		$this->bname=$config_bd['bname'];
		$this->user=$config_bd['user'];
		$this->pass=$config_bd['pass'];
   	}
	/**
	*@method 			iniciar Conexion con la BD
	*@description 	Funcion para conectar con la base de datos
	*/
   	private function iniciarConexionDbGrid(){
   		$objBd=@mysql_connect($this->host,$this->user,$this->pass);
   		if($objBd){
   			@mysql_select_db($this->bname)or die("Error al conectar con la base de datos");
   		}
   		return $objBd;
   	}
	/**
	*@name 			iniciar Conexion con la BD
	*@description 	Funcion para conectar con la base de datos
	*/
   	private function iniciarConexionDb(){
   		$objBd=new sql($this->host,$this->port,$this->bname,$this->user,$this->pass);
   		return $objBd;
   	}

	/**
	*@name 			Actualiza preguntas cuestionario
	*@description 	Funcion para actualizar las preguntas del cuestionario
	*@paramas 		ID_CUESTIONARIO
	*
	*/
	public function actualizarPreguntasCuestionario($idCuestionario){
		$objDb=$this->iniciarConexionDb();
		$sqlPS="SELECT P.ID_PREGUNTA,P.DESCRIPCION,CP.ORDEN
		FROM CRM2_PREGUNTAS P LEFT JOIN CRM2_CUESTIONARIO_PREGUNTAS CP ON CP.ID_PREGUNTA = P.ID_PREGUNTA 
		WHERE ACTIVO=1 AND COD_CLIENT =".$cte." AND CP.ID_CUESTIONARIO = ".$_GET['idCuestionario']."
		ORDER BY CP.ORDEN";
		$resultPS=$objDb->sqlQuery($sqlPS);
		$pgs="";
		$pgs="<div class='content'><ul id='preguntasSeleccionadasUL'>";
		while($rowPS=$objDb->sqlFetchArray($resultPS)){
			$idDiv=$rowPS["ID_PREGUNTA"];
				// style='float:left;border:1px solid #CCC;min-width:350px;max-width:500px;width:500px;'
			$pgs.="<li class='ui-state-default'>".$rowPS["ORDEN"]." - ".$rowPS["DESCRIPCION"]."
						<div style='float:right;width:40px;margin-top:2px;border:0px solid blue;'>
							<div onclick='form_preg(".$idDiv.",2)' class='divPreguntaEditar' title='Editar pregunta del cuestionario'><img src='./public/images/page_white_edit.png' border='0' /></div>
							<div onclick='quitarPreguntaCuestionario(".$_GET['idCuestionario'].",".$idDiv.")' class='divPreguntaQuitar' title='Quitar pregunta del cuestionario'><img src='./public/images/cross.png' border='0' /></div>
						</div>
					</li>";		
		}
		$pgs.="</ul></div>";
		echo $pgs;
	}

	/**
	*@name 			quitarPreguntasCuestionario
	*@description 	Funcion para quitar una pregunta del cuestionario seleccionado
	*@paramas 		ID_CUESTIONARIO,ID_PREGUNTA
	*
	*/
	public function quitarPreguntasCuestionario($idCuestionario,$idPregunta){
		$objDb=$this->iniciarConexionDb();
		// echo "<pre>";
		// print_r($objDb);
		// echo "</pre>";
		// exit();
		//global $db;
		//$db=new mySqlDriver();
		$sqlBorraPregunta="DELETE FROM CRM2_CUESTIONARIO_PREGUNTAS WHERE ID_PREGUNTA='".$idPregunta."' AND ID_CUESTIONARIO='".$idCuestionario."'";
		$result=$objDb->sqlQuery($sqlBorraPregunta);
		if($result){
			$mensaje = 1;
			//se procede a reordenar el cuestionario
			$sqlOrden="SELECT * FROM CRM2_CUESTIONARIO_PREGUNTAS WHERE ID_CUESTIONARIO='".$idCuestionario."' ORDER BY ORDEN";
			$resultOrden=$objDb->sqlQuery($sqlOrden);
			$j=1;
			while($rowP = $objDb->sqlFetchArray($resultOrden)){
				if($rowP["ORDEN"] != $j){
					//si el valor del campo orden es diferente al contador entonces se modifica el orden de ese campo con otro query
					$sqlOrden1="UPDATE CRM2_CUESTIONARIO_PREGUNTAS SET ORDEN='".$j."' WHERE ID_PREGUNTA='".$rowP["ID_PREGUNTA"]."' AND ID_CUESTIONARIO='".$rowP["ID_CUESTIONARIO"]."'";
					$resultOrden1=$objDb->sqlQuery($sqlOrden1);
				}
				$j+=1;
			}
		}else{
			$mensaje = 0;
		}
		return $mensaje;
	}


	/**
	*@name 			listarPreguntasCuestionario
	*@description 	Funcion para mostrar las preguntas del cuestionario
	*@paramas 		ID_CUESTIONARIO
	*
	*/
	public function cargarCuestionarios($idCliente,$sStartDate,$sEndDate){
		/*$sql="SELECT C.ID_CUESTIONARIO, C.DESCRIPCION,C.ITEM_NUMBER,(SELECT COUNT(R.ID_CUESTIONARIO) FROM CRM2_RESPUESTAS R WHERE R.ID_CUESTIONARIO = C.ID_CUESTIONARIO  AND CAST(R.FECHA AS DATE) BETWEEN '".$sStartDate."' AND '".$sEndDate."') AS RESP 
		FROM CRM2_CUESTIONARIOS C
		WHERE C.COD_CLIENT = ".$idCliente;*/
		/*$sql="SELECT CRM2_CUESTIONARIOS.ID_CUESTIONARIO AS IDCUESTIONARIO, CRM2_CUESTIONARIOS.DESCRIPCION AS Cuestionario,CRM2_CUESTIONARIOS.ITEM_NUMBER AS ITEM_NUMBER,(SELECT COUNT(R.ID_CUESTIONARIO) FROM CRM2_RESPUESTAS R WHERE R.ID_CUESTIONARIO = CRM2_CUESTIONARIOS.ID_CUESTIONARIO AND CAST(R.FECHA AS DATE) BETWEEN '".$sStartDate."' AND '".$sEndDate."') AS RESP
		FROM CRM2_CUESTIONARIOS
		WHERE CRM2_CUESTIONARIOS.COD_CLIENT ='".$idCliente."'";*/

		$sql="SELECT CONCAT('Mostrar') AS Mostrar,CONCAT('Editar') AS Editar,CONCAT('Eliminar') AS Eliminar,CRM2_CUESTIONARIOS.ID_CUESTIONARIO AS IDCUESTIONARIO, CRM2_CUESTIONARIOS.DESCRIPCION AS DESCRIPCION,CRM2_CUESTIONARIOS.ITEM_NUMBER AS ITEM_NUMBER,(SELECT COUNT(R.ID_CUESTIONARIO) FROM CRM2_RESPUESTAS R WHERE R.ID_CUESTIONARIO = CRM2_CUESTIONARIOS.ID_CUESTIONARIO AND CAST(R.FECHA AS DATE) BETWEEN '".$sStartDate."' AND '".$sEndDate."') AS RESP 
		FROM CRM2_CUESTIONARIOS
		WHERE CRM2_CUESTIONARIOS.COD_CLIENT = '".$idCliente."'";

		$col = array();
		$col["title"] = "";
		$col["name"] = "Mostrar";
		$col["width"] = "7";
		$col["search"] = false;
		$col["editable"] = false;
		$col["sortable"] = false; // this column is not sortable 
		$col["align"] = "center";
		//$col["link"] = "http://localhost?id={ID_TAREA}"; // e.g. http://domain.com?id={id} given that, there is a column with $col["name"] = "id" exist
		$col["link"] = "#{IDCUESTIONARIO}"; // e.g. http://domain.com?id={id} given that, there is a column with $col["name"] = "id" exist
		$col["linkoptions"] = "title='Ver detalle de la tarea' onclick='detalleTarea(this.href,this.event)'"; // extra params with <a> tag
		$cols[] = $col;

		$col = array();
		$col["title"] = "";
		$col["name"] = "Editar";
		$col["width"] = "7";
		$col["search"] = false;
		$col["editable"] = false;
		$col["sortable"] = false; // this column is not sortable 
		$col["align"] = "center";
		//$col["link"] = "http://localhost?id={ID_TAREA}"; // e.g. http://domain.com?id={id} given that, there is a column with $col["name"] = "id" exist
		$col["link"] = "#{IDCUESTIONARIO}"; // e.g. http://domain.com?id={id} given that, there is a column with $col["name"] = "id" exist
		$col["linkoptions"] = "title='Editar Registro' onclick='editarTarea(this.href)'"; // extra params with <a> tag
		$cols[] = $col;

		$col = array();
		$col["title"] = "";
		$col["name"] = "Eliminar";
		$col["width"] = "7";
		$col["search"] = false;
		$col["editable"] = false;
		$col["sortable"] = false; // this column is not sortable 
		$col["align"] = "center";
		//$col["link"] = "http://localhost?id={ID_TAREA}"; // e.g. http://domain.com?id={id} given that, there is a column with $col["name"] = "id" exist
		$col["link"] = "#{IDCUESTIONARIO}"; // e.g. http://domain.com?id={id} given that, there is a column with $col["name"] = "id" exist
		$col["linkoptions"] = "title='Eliminar Registro' onclick='eliminarTarea(this.href)'"; // extra params with <a> tag
		$cols[] = $col;

		$col = array();
		$col["title"] = "# Cuestionario"; // caption of column
		$col["name"] = "IDCUESTIONARIO"; // grid column name, same as db field or alias from sql
		$col["dbname"] = "CRM2_CUESTIONARIOS.ID_CUESTIONARIO";
		$col["width"] = "7"; // width on grid
		$col["align"] = "center";
		$col["sortable"] = true; // this column is not sortable 
		$col["resizable"] = true;
		$col["search"] = true;
		$cols[] = $col;
		
		$col = array();
		$col["title"] = "Cuestionario"; // caption of column
		$col["name"] = "DESCRIPCION"; // grid column name, same as db field or alias from sql
		$col["dbname"] = "CRM2_CUESTIONARIOS.DESCRIPCION";
		$col["width"] = "50"; // width on grid
		$col["align"] = "left";
		$col["resizable"] = true;
		$col["search"] = true;
		$cols[] = $col;
		
		$col = array();
		$col["title"] = "Item Number"; // caption of column
		$col["name"] = "ITEM_NUMBER"; // grid column name, same as db field or alias from sql
		$col["dbname"] = "CRM2_CUESTIONARIOS.ITEM_NUMBER";
		$col["width"] = "8"; // width on grid
		$col["align"] = "center";
		$col["resizable"] = true;
		$col["search"] = true;
		$cols[] = $col;
		
		$col = array();
		$col["title"] = "Uso &uacute;ltima semana"; // caption of column
		$col["name"] = "RESP"; // grid column name, same as db field or alias from sql
		$col["width"] = "11"; // width on grid
		$col["align"] = "center";
		$col["resizable"] = true;
		$col["search"] = true;
		$cols[] = $col;

		//conexion hacia la base de datos
		$conn=$this->iniciarConexionDbGrid();
		// set your db encoding -- for ascent chars (if required)
		@mysql_query("SET NAMES 'utf8'",$conn);
		include "public/libs/phpgridv1.5.2/lib/inc/jqgrid_dist.php";
		//definicion de las columnas del grid
		//se instancia el objeto
		$g = new jqgrid();
		// parametros de configuracion
		$grid["caption"] = "<div style='text-align:center;'>Cuestionarios</div>";
		$grid["multiselect"] 	= false;
		$grid["autowidth"] 		= true; // expand grid to screen width
		$grid["resizable"] 		= false;
		$grid["altRows"] 		= true;
		$grid["altclass"] 		="alternarRegistros";
		$grid["scroll"] 		= false;
		$grid["height"] 		= "100%";
		$grid["sortorder"]		="desc";

		$g->set_options($grid);

		$g->set_actions(array(  
                        "add"=>false,
                        "edit"=>false,
                        "delete"=>false,
                        "view"=>false,
                        "rowactions"=>false,
                        "export"=>false,
                        "autofilter" => true,
                        "search" => "advance",
                        "inlineadd" => false,
                        "showhidecolumns" => true
                    )
                );

		// set database table for CRUD operations
		$g->table = "CRM2_CUESTIONARIOS";
		$g->set_columns($cols);

		// subqueries are also supported now (v1.2)
		
		$g->select_command = $sql;
		// render grid
		$out = $g->render("cuestionarios");
		echo $out;
		echo "<script type='text/javascript'> redimensionarCuestionarios(); </script>";
	}

}//fin de la clase Cuestionarios

//ejemplos de instancia con la clase
//	$obj=new cuestionarios2();
?>