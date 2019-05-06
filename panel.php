<!doctype html>
<html lang=es>
<head>
	<meta charset="utf-8"></meta>
	<title>Panel Control</title>
</head>

<body>

	<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
	<font color="red" size="5px"> La ultima Url visitada es:</font><br/>
	<section id = "contenedor" style ='border:solid 2px black; height:120px;'>
	</section>

<script type="text/javascript">

	function MostrarDatos() {
		//guardamos en una variable el resultado de la consulta AJAx
		var datos = $.ajax({
			url: 'fichero.txt',
			dataType: 'text',
			async: false
		}).responseText;
		//cargamos en el contenedor el resultado
		document.getElementById("contenedor").innerHTML = datos;
		}
		//llamamos a la funcion MostrarDatos cada 100 milisegundos para actualizar.
	setInterval(MostrarDatos,50);

</script>

</body>

</html>
