<?php
	//datos para bloqueo y redireccion
	if (isset($_POST['NSite']) && !empty($_POST))
	{
		$st = ($_POST['NSite']);
		//almacena en el fichero3
		$file = fopen('fichero3.txt', 'w');
		fwrite ($file, "*://*.$st/*");
		fclose($file);
	}

	if (isset($_POST['NRedi']) && !empty($_POST))
	{
		$rd = ($_POST['NRedi']);
		//almacena en el fichero4
		$file = fopen('fichero4.txt', 'w');
		fwrite ($file, "$rd");
		fclose($file);
	}

?>
