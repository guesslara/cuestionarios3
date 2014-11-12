 <?php

		$dti = $_GET['gr_start_date']." ".$_GET['gr_hri'].":".$_GET['gr_mni'].":00";
		$dtf = $_GET['gr_end_date']." ".$_GET['gr_hrf'].":".$_GET['gr_mnf'].":59";
		$rtime =" AND R.FECHA BETWEEN '".$dti."' AND '".$dtf."'";
		$nameq = $_GET['name_qst'];
		

		$user = ($_GET['gr_user']!=-1)?" AND R.COD_USER IN (".$_GET['gr_user'].") ":"";

		$preg = ($_GET['gr_preg']!=-1)?" AND P.ID_PREGUNTA IN (".$_GET['gr_preg'].") ":"";
		$inn  = ($_GET['gr_preg']!=-1)?" INNER JOIN CRM2_PREG_RES PR ON R.ID_RES_CUESTIONARIO = PR.ID_RES_CUESTIONARIO
INNER JOIN CRM2_PREGUNTAS P ON PR.ID_PREGUNTA=P.ID_PREGUNTA ":"";
		$resp = ($_GET['gr_resp']!="")?" AND PR.RESPUESTA LIKE '%".$_GET['gr_resp']."%' ":"";

		
		$conexion = mysqli_connect($_GET['dbh'],$_GET['dbuser'],$_GET['dbpass'],$_GET['dbname']);	
		if($conexion){
			/*$sql = "SELECT CAST(R.FECHA AS DATE) AS F,DAYOFWEEK(CAST(R.FECHA AS DATE)) AS D, COUNT(R.ID_CUESTIONARIO) AS N FROM
			 CRM2_RESPUESTAS R WHERE R.ID_CUESTIONARIO=".$_GET['id_qst']." ".$rtime."  GROUP BY  F;";*/
$sql = "SELECT CAST(R.FECHA AS DATE) AS F,
CONCAT(
IF(EXTRACT(DAY   FROM R.FECHA)<=9,CONCAT(0,EXTRACT(DAY   FROM R.FECHA)),EXTRACT(DAY FROM R.FECHA)),'/',
IF(EXTRACT(MONTH FROM R.FECHA)<=9,CONCAT(0,EXTRACT(MONTH FROM R.FECHA)),EXTRACT(MONTH FROM R.FECHA))
) AS D,
COUNT(R.ID_CUESTIONARIO) AS N
FROM CRM2_RESPUESTAS R 
".$inn."
WHERE R.ID_CUESTIONARIO = ".$_GET['id_qst'].$user.$preg.$resp.$rtime."
GROUP BY F;";
			$query = mysqli_query($conexion, $sql);	
	
			$count = @mysqli_num_rows($query);
			if($count > 0){
				while($row= @mysqli_fetch_array($query)){
					$datos = ($datos=="")?$row['F']."|".$row['D']."|".$row['N']:$datos.",".$row['F']."|".$row['D']."|".$row['N'];
					
					}
					
				}
			}
 ?>
<html>
  <head>
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <!--<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>-->
    <script type="text/javascript">

      google.load("visualization", "1", {packages:["corechart"]});
      google.setOnLoadCallback(drawChart);
      function drawChart() {
		  var datos  = "<?php echo $datos; ?>" ;
		  var nameq  = "<?php echo $nameq; ?>" ;
		  var len = datos.split(",");
        
       var data = new google.visualization.DataTable();
        data.addColumn('string', 'Fecha');
        data.addColumn('number', 'Respuestas');
		data.addRows(len.length);
		for(i=0; i<len.length; i++){
			d=len[i].split("|");
			data.setCell(i, 0,d[1]);
			//Valores
			data.setCell(i, 1, parseInt(d[2]));
			

			
			
			
			}
		
        

        var options = {
          title: 'Estad\u00edstica del cuestionario '+nameq,
          hAxis: {title: 'D\u00edas',  titleTextStyle: {color: 'red'}}
        };
		if(len.length==1){
			var chart = new google.visualization.ColumnChart(document.getElementById('qst_chart_div'));
		}
		else{
			var chart = new google.visualization.AreaChart(document.getElementById('qst_chart_div'));
			}
        chart.draw(data, options);
      }
    </script>
  </head>
  <body>
 <?php 
echo '<div id="qst_chart_div" style="width: 99%; height: 99%; position:relative; top:0%; left:0%;"></div>';	
 ?>     
  </body>
</html>


