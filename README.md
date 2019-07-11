# MitB Chrome Extension

## Extensión del Navegador Google Chrome para capturar información.

### Index

1. [Project description](#project-description)
2. [Disclaimer](#disclaimer)
3. [Features](#features)
4. [How to run](#how-to-run)
5. [Basic usage](#basic-usage)
6. [Architecture](#architecture)
7. [Basic Scheme](#basic-scheme)


## Project description

En este trabajo se pretende desarrollar una herramienta para desplegar Man in the Browser [(MitB).](https://ipfs.io/ipfs/QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco/wiki/Man-in-the-browser.html) 

Está implementado como una extensión del navegador Google Chrome, que intercepta las visitas del navegador donde se instala. También captura las teclas pulsadas y clicks de ratón. Toda esta información es enviada a un servidor y almacenada en una base de datos y dos ficheros.

## Disclaimer

El presente trabajo se realiza en el marco de la seguridad ofensiva. El proyecto tiene fines educativos, éticos y de investigación. No me responsabilizo del mal uso que se pueda hacer de la herramienta.  

## Features

La primera versión envía las URLs de las webs visitadas y la hora de la visita. 

En la segunda versión se ha incluido la captura de la dirección IP que envía las URLs, además de enviar las teclas y clicks de ratón que realiza, a modo de KeyLogger. Por último se ha incluido funcionalidad de almacenamiento y monitorización en una base de datos Mysql. 

En futuras versiones se ampliará funcionalidad.

## How to run

En el servidor adversario.

+ El equipo usado es Ubuntu Server 18.04, con Apache2.0, PHP y MySql.
+ Se deben copiar los ficheros `panel.html`, `gate.php`, `tablaUrl.php` y `tabalaKey.php` en el directorio /var/www/html.
+ Crear dos archivos llamados `fichero1.txt` y `fichero2.txt` en el mismo directorio /var/www/html. Se deben dar permisos totales `chmod 777` a estos ficheros, para que se pueda escribir y leer datos desde `gate.php` y `panel.html` respectivamente.
+ Se debe instalar el panel de administración phpMyAdmin. Seguir el siguiente [tutorial](phpmyadmin.pdf) para instalación, configuración y creación de la base de datos `LastUrl`. 

En el equipo objetivo.

+ Se debe abrir el fichero `/LastUrl/SendModule.js` y sustitur la variable codeSvr (en la línea 3) por una cadena que contenga, codificada en Base 64, la URL del servidor de adversario, al que se envia la información, es decir `http://IP/gate.php`, `http://dominio/gate.php`. Esta herramienta puede ayudar con esa tarea [Codificador Base64](https://www.base64encode.org/) . Es importante que la url contenga el fichero gate.php, ya que éste sera el receptor de la información. 
+ En el navegador de Google Chrome, abrir extensiones (chrome://extensions/) habilitar el modo desarrollador, cargar extensión descomprimida y selecinar la carpeta LastUrl. 


## Basic usage

Realizar navegación en Google Chrome desde el equipo objetivo (donde se haya instalado la extensión) y comprobar desde otro navegador en la dirección del servidor de adversario `http://IP/panel.html` como se registran los datos (con cada transición y cambio de URL en el navegador de la objetivo, deberían mostrarse los datos en `http://IP/panel.html`). Además a traves de la parte inferior de esa página se pueden consultar los datos almacenados.

Adicionalmente se puede comprobar el contenido de las últimas capturas directamente en los ficheros `fichero1.txt`, `fichero2.txt`. Y las capturas almacenadas a través de consultas en el panel de phpMyAdmin.

## Architecture

El servidor adversario.

+ `gate.php`: recibe los datos que envía la extensión y guarda las Urls en `fichero1.txt` y en la tabla `Urls` de la base `LastUrl`, y guarda los datos del KeyLogger en `fichero2.txt` y en la tabla `Tecla` de las base `LastUrl`.
+ `panel.html`: monitoriza la última URL, IP, identidad de la Pestaña (IdTab) y la hora, almacenadas en `fichero1.txt` y las últimas teclas/clicks del KeyLogger, IP, identidad de la Pestaña (IdTab) y la hora, almacenadas en `fichero2.txt` . Más abajo se pueden realizar consultas a la base de datos, mostrando las últimas X capturas o todo el conjuto de datos de las tablas `Tecla` y `Urls`.
+ `tablaKey.php`: Consulta la tabla `Tecla` de la base de datos y muestra los datos solicitados en formato tabla, los parametros de el número de registros los obtiene de `panel.html`.
```plain
    | ID | IP | TECLAS|
```
+ `tablaUrl.php`: Consulta la tabla `Urls` de la base de datos y muestra los datos solicitados en formato tabla, los parametros de el número de registros los obtiene de `panel.html`.
```plain
    | ID | IP | URL|
```

La extensión.

+ `LastUrls.js`: actua como módulo principal, dispara un evento justo antes de producirse una solicitud web, capturando la URL. Además recibe los datos que el KeyLogger ha dejado en el almacenamiento local. Pasa los datos anteriores al módulo de envío.
+ `KeyLogger.js`: es un script de contenido que se inyecta en todas las páginas, dispara eventos que capturan cada tecla y cada click de ratón y los almacena en storage.local.
+ `SendModule.js`: tiene la función sendData que se encarga de recibir los datos del modulo principal y a través del objeto AJAX  XMLHttpRequest, enviarlos por metodo POST al servidor.

## Basic Scheme

![Basic Scheme](Scheme3.png)
