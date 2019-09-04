# MitB Chrome Extension &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;![Icon](MITB_Chrome.png)

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

Otra función es la de bloqueo y redirección de sitios web visitados en el navegador. A través de un panel control, alojado en el servidor adversario, se puede monitorizar e interactuar con la extensión.

Este trabajo se realiza en el contexto de de la versión 2 de manifiesto. No se ha tenido en cuenta el borrador de la próxima actualización del manifiesto de Google Chrome para la versión 3 [(Manifest V3).](https://docs.google.com/document/d/1nPu6Wy4LWR66EFLeYInl3NzzhHzc-qnk4w4PX-0XMw8/preview#heading=h.xgjl2srtytjt)

## Disclaimer

El presente proyecto se realiza en el marco de la seguridad ofensiva. El proyecto tiene fines educativos, éticos y de investigación. No me responsabilizo del mal uso que se pueda hacer de la herramienta.  

## Features

La primera versión envía las URLs de las webs visitadas y la hora de la visita. 

En la segunda versión se ha incluido la captura de la dirección IP que envía las URLs, además de enviar las teclas y clicks de ratón que realiza, a modo de KeyLogger. Por último se ha incluido funcionalidad de almacenamiento y monitorización en una base de datos Mysql. 

En la tercera versión, se ha incluido funcionalidad en el panel de control para interactuar con la extenxión. Pudiéndose introducir sitios web para bloqueo o redirección de webs. 

## How to run

**En el servidor adversario.**

+ El equipo usado es Ubuntu Server 18.04, con Apache2.0, PHP y MySql.
+ Se deben copiar los ficheros `panel.html`, `gate.php`, `tablaUrl.php` , `tabalaKey.php` y `data.php` en el directorio /var/www/html.
+ Crear cuatro archivos llamados `fichero1.txt` , `fichero2.txt` , `fichero3.txt` y `fichero4.txt` en el mismo directorio /var/www/html. Se deben dar permisos totales `chmod 777` a estos ficheros, para que se pueda escribir y leer datos desde `gate.php` , `data.php` y `panel.html` respectivamente.
+ Se debe instalar el panel de administración phpMyAdmin. Seguir el siguiente [tutorial](phpmyadmin.pdf) para instalación, configuración y creación de la base de datos `LastUrl`. 

**En el equipo objetivo.**

+ Se debe abrir el fichero `/LastUrl/SendModule.js` y sustitur la variable codeSvr (en la línea 10) por una cadena que contenga, codificada en Base 64, la URL del servidor de adversario, al que se envia la información. Es decir `http://IP/gate.php` ó `http://dominio/gate.php`. Es importante que la url contenga el fichero gate.php, ya que éste sera el receptor de la información.
+ Además, en el fichero `/LastUrl/SendModule.js` se debe sustitur la variable codeFs (en la línea 2) y la variable codeFr (en la línea 5) por una cadena que contenga, codificada en Base 64, la URL de los ficheros 3 y 4  respectivamente, del servidor adversario. Es decir `http://IP/fichero3.txt` ó `http://dominio/fichero3.php` y `http://IP/fichero4.txt` ó `http://dominio/fichero4.php`. En estos ficheros se reciben los datos para bloqueo y redirección. 
Esta herramienta puede ayudar con la tarea de los apartados anteriores [(Codificador Base64)](https://www.base64encode.org/) . 
+ En el navegador de Google Chrome, abrir extensiones (chrome://extensions/) habilitar el modo desarrollador, cargar extensión descomprimida y selecinar la carpeta LastUrl. 


## Basic usage

Realizar navegación en Google Chrome desde el equipo objetivo (donde se haya instalado la extensión) y comprobar desde otro navegador en la dirección del servidor de adversario `http://IP/panel.html` como se registran los datos (con cada transición y cambio de URL en el navegador del objetivo, deberían mostrarse los datos en `http://IP/panel.html`). Además a traves de la parte inferior de esa página se pueden consultar los datos almacenados.

Adicionalmente se puede comprobar el contenido de las últimas capturas directamente en los ficheros `fichero1.txt`, `fichero2.txt`. Y las capturas almacenadas a través de consultas en el panel de phpMyAdmin.

Para la funcion de bloqueo se debe rellenar el campo *sitio* con el dominio a bloquear (no es necesario completar un pattern de URL valido, lo creará el servidor, es decir bastaria con meter *youtube.com*, *amazon.es*....) el campo de redireccion se quedará en blanco. Todas las solicitudes realizadas desde el navegador objetivo a esos dominios serán bloqueadas.

Para la función de redirección además de completar el campo *sitio* de la manera anterior, se dede completar el campo *redirección*. En este caso de debe introducir un URL completa, que debe esta estar alojada en el servidor adversario u otro servidor. Todas las solicitudes realizadas desde el navegador objetivo a esos dominios serán redirecionadas.

## Architecture

**El servidor adversario.**

+ `gate.php`: recibe los datos que envía la extensión y guarda las Urls en `fichero1.txt` y en la tabla `Urls` de la base `LastUrl`, y guarda los datos del KeyLogger en `fichero2.txt` y en la tabla `Tecla` de las base `LastUrl`.
+ `panel.html`: monitoriza la última URL, IP, identidad de la Pestaña (IdTab) y la hora, almacenadas en `fichero1.txt` y las últimas teclas/clicks del KeyLogger, IP, identidad de la Pestaña (IdTab) y la hora, almacenadas en `fichero2.txt` . Más abajo se pueden realizar consultas a la base de datos, mostrando las últimas X capturas o todo el conjuto de datos de las tablas `Tecla` y `Urls`. Por último se pueden introducir dominios y urls para bloquear y redireccionar.
+ `tablaKey.php`: Consulta la tabla `Tecla` de la base de datos y muestra los datos solicitados en formato tabla, los parametros de el número de registros los obtiene de `panel.html`.
```plain
    | ID | IP | TECLAS|
```
+ `tablaUrl.php`: Consulta la tabla `Urls` de la base de datos y muestra los datos solicitados en formato tabla, los parametros de el número de registros los obtiene de `panel.html`.
```plain
    | ID | IP | URL|
```
+ `data.php`: recibe los datos que envía `panel.html` sobre el dominio y url para bloquear y redireccionar y los guarda en `fichero3.txt` y `fichero4.txt`.

**La extensión.**

+ `LastUrls.js`: actua como módulo principal, dispara un evento justo antes de producirse una solicitud web, capturando la URL. Además recibe los datos que el KeyLogger ha dejado en el almacenamiento local. Pasa los datos anteriores al módulo de envío. Tambien actualiza cada segundo si ha cambiado el contenido de los `fichero3.txt` y `fichero4.txt`, actulizando los datos para las solicitudes web de estos sitios, procediendo a su bloqueo o redirección, según el caso.
+ `KeyLogger.js`: es un script de contenido que se inyecta en todas las páginas, dispara eventos que capturan cada tecla y cada click de ratón y los almacena en storage.local.
+ `SendModule.js`: tiene la función sendData que se encarga de recibir los datos del modulo principal y a través del objeto AJAX  XMLHttpRequest, enviarlos por metodo POST al servidor. Tambien contiene las url de los ficheros 3 y 4 codificadas en Base64. 

## Basic Scheme

![Basic Scheme](Scheme3.png)
