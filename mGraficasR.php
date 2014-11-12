 <?php
		include 'mFunciones.php';
		$fun = new mFunciones();
		
		$dti = $_GET['gr_start_date_r']." ".$_GET['gr_hri_r'].":".$_GET['gr_mni_r'].":00";
		$dtf = $_GET['gr_end_date_r']." ".$_GET['gr_hrf_r'].":".$_GET['gr_mnf_r'].":59";
		$rtime =" AND R.FECHA BETWEEN '".$dti."' AND '".$dtf."'";
		$qst = $_GET['id_qst'];
		$nameq = $_GET['name_qst'];
		
		//$user = ($_GET['gr_user']!=-1)?$_GET['gr_user']:$_GET['all_us'];
		$user = ($_GET['gr_user']!=-1)?" AND R.COD_USER IN (".$_GET['gr_user'].") ":"";
		//$preg = ($_GET['gr_preg']!=-1)?$_GET['gr_preg']:$_GET['all_ans'];
		$preg = ($_GET['gr_preg']!=-1)?" AND P.ID_PREGUNTA IN (".$_GET['gr_preg'].") ":"";
		$inn  = ($_GET['gr_preg']!=-1)?" INNER JOIN CRM2_PREG_RES PR ON R.ID_RES_CUESTIONARIO = PR.ID_RES_CUESTIONARIO
INNER JOIN CRM2_PREGUNTAS P ON PR.ID_PREGUNTA=P.ID_PREGUNTA ":"";
		$resp = ($_GET['gr_resp']!="")?" AND PR.RESPUESTA LIKE '%".$_GET['gr_resp']."%' ":"";

		$times=$fun->ngraficas($_GET['dbh'],$_GET['dbuser'],$_GET['dbpass'],$_GET['dbname'],$qst,$rtime,$_GET['gr_start_date_r'],$_GET['gr_end_date_r']);
		
$t=explode("*",$times);
for($i=0; $i<count($t); $i++){
	$t2 = explode("|",$t[$i]);
	$idp = $t2[0];
	$com = $t2[1];
	$tit = $t2[2];
	//echo $t2[0]."/".$t2[1]."<br>";
	$fun->tabla($_GET['dbh'],$_GET['dbuser'],$_GET['dbpass'],$_GET['dbname'],$qst,$rtime,$idp,$com,$_GET['gr_start_date_r'],$_GET['gr_end_date_r']);
	//echo $fun->data;
	$f = explode(",",$fun->data);
	
 ?>
<html>
  <head>
    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <!--<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>-->
    <script type="text/javascript">

      google.load("visualization", "1", {packages:["corechart"]});
      google.setOnLoadCallback(drawChart);
      function drawChart() {
		  var datos  = "<?php echo $fun->data; ?>" ;
		  var nameq  = "<?php echo $nameq; ?>" ;
		  var cab  = "<?php echo $f[0]; ?>" ;
		  var idp = "<?php echo $idp; ?>" ;
		  var tit = "<?php echo $tit; ?>" ;
		  var cabs = cab.split("|");
		  //alert(datos);
		  var len = datos.split(",");
        
       var data = new google.visualization.DataTable();
        data.addColumn('string', 'D\U00eda');
        //data.addColumn('number', 'Respuestas');
		for(i=0; i<cabs.length; i++){
			data.addColumn('number', cabs[i]);
			}
		data.addRows(len.length);
		for(i=1; i<len.length; i++){
			//alert(len[i])
			d=len[i].split("|");
			
			if(d[1]!=""){
				data.setCell(i, 0,d[1]);
				}
			
			//Valores
			//alert(cabs.length)
			for(j=1; j<=cabs.length; j++){
				//alert(i+"/"+j+"="+d[j])
				nuevo=j+1;
			data.setCell(i, j, parseInt(d[nuevo]));
			}
			//data.setCell(i, 1, parseInt(d[1]));
			
			
			
			}
		
        

        var options = {
          title: 'Cuestionario: '+nameq+'  Pregunta: '+tit,
          hAxis: {title: 'D\u00edas',  titleTextStyle: {color: 'red'}}
        };

        var chart = new google.visualization.ColumnChart(document.getElementById('chart_div_'+idp));
        chart.draw(data, options);
      }
    </script>
  </head>
  <body>
 <?php 
echo '<div id="chart_div_'.$idp.'" style="width: 99%; height: 99%; position:relative; top:0%; left:0%;"></div>';	
}
 ?>     
  </body>
</html>


