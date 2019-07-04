# MitB Chrome Extension

## Extensión del Navegador Google Chrome para capturar información.

### Index

1. [Project description](#project-description)
2. [Features](#features)
3. [How to run](#how-to-run)
4. [Basic usage](#basic-usage)
4. [Architecture](#architecture)


## Project description

En este trabajo se pretende desarrollar una herramienta para desplegar una ataque Man in the Browser (MitB). 

Está implementado como una extensión del navegador Google Chrome, que intercepta las visitas del navegador donde se instala. También captura las teclas pulsadas y clicks de ratón. Toda esta información es enviada a un servidor y almacenada en una base de datos y dos ficheros.

El presente proyecto tiene fines educativos y éticos. No me responsabilizo del mal uso que se pueda hacer de la herramienta.  

## Features

La primera versión envía las URLs de las webs visitadas y la hora de la visita. 

En la segunda versión se ha incluido la captura de la dirección IP que envía las URLs, además de enviar las teclas y clicks de ratón que realiza a modo de KeyLogger. Por último funcionalidad de almacenamiento y monitorización en una base de datos Mysql. 

En futuras versiones se ampliará funcionalidad.

## How to run

En el servidor de ataque.

+ El equipo usado es Ubuntu Server 18.04, con Apache, PHP y MySql.
+ Se deben copiar los ficheros panel.html, gate.php, tablaUrl.php y tabalaKey.php en el directorio /var/www/html.
+ Crear dos archivos llamados 'fichero1.txt' y 'fichero2.txt' en el mismo directorio /var/www/html. Se deben dar permisos totales 'chmod 777' a estos ficheros, para que se pueda escribir y leer datos desde gate.php y panel.html respectivamente.
+ Se debe instalar el panel de administración phpMyAdmin. Seguir el siguiente tutorial para instalación, configuración y creación de la base de datos 'LastUrl'. 

En el equipo víctima.

+ Se debe abrir el fichero /LastUrl/SendModule.js y sustitur la variable codeSvr (en la línea 4) por una cadena que contenga, codificada en Base 64, la URL del servidor de ataque, al que se envia la información, es decir `http://IP/gate.php`, `http://dominio/gate.php`. Es importante que la url contenga el fichero gate.php, ya que esté sera el receptor de la información. 
+ En el navegador de Google Chrome, abrir extensiones (chrome://extensions/) habilitar el modo desarrollador, cargar extensión descomprimida y selecinar la carpeta LastUrl. 


## Basic usage

+ `gate.php`: recibe los datos que envía la extensión y guarda las Urls en 'fichero1.txt' y en la tabla 'URL' de la base 'LastUrl', y guarda los datos del KeyLogger en 'fichero2.txt' y en la tabla 'TECLA' de las base 'LastUrl'.
+ `panel.html`: monitoriza la última URL, la hora, IP e identidad de la Pestaña (TabID) almacenada en 'fichero1.txt' y las teclas/clicks de (KeyLogger), la hora, IP e identidad de la Pestaña (TabID) almacenada en 'fichero2.txt' .
+ `tablaKey.php`: Muestra los datos en formato tabla

Realizar navegación en Google Chrome desde el equipo víctima y comprobar desde otro navegador en la dirección del servidor de ataque `http://IP/panel.php` como se registran los datos (con cada transición y cambio de URL en el navegador de la víctima, deberían mostrarse los datos en `http://IP/panel.php`).
Adicionalmente se puede comprobar el contenido de 'fichero.txt'.

## Architecture

![Architecture](MitB.png)
