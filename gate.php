<?php
if (isset($_POST) && !empty($_POST))
	{
		//decodificamos la informacion recibida
		$url = base64_decode($_POST['url']);
		echo "La Url Visitada es : $url";
		$file = fopen('fichero.txt', 'w');
		fwrite ($file, "$url \r\n");
		fclose($file);
	}
?>

