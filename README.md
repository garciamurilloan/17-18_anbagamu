# MitB Tool

## Extensión del Navegador Google Chrome para capturar información.

### Index

1. [Project description](#project-description)
2. [Features](#features)
3. [How to run](#how-to-run)
4. [Basic usage](#basic-usage)
4. [Architecture](#architecture)


## Project description

En este trabajo se pretende desarrollar una herramienta para desplegar una ataque Man in the Browser (MitB). 

Esta constituido como una extensión del navegador Google Chrome, que intercepta las visitas del navegador donde se instala. Estas son enviadas a un servidor y almacenadas.

El presente proyecto tiene fines educativos y éticos. No me responsabilizo del mal uso que se pueda hacer de la herramienta.  

## Features

La primera versión envía las URL de la web visitada y la hora de la visita.

En futuras versiones se ampliará funcionalidad.



## How to run

El servidor usado es Ubuntu Server 18.04, con apache, php y MySql.

+ Se deben copiar los ficheros gate.php y panel.php en el directorio /var/www/html.
+ Crear un archivo llamado 'fichero.txt' en el mismo directorio /var/www/html.

Para la extensión.

+ Se debe abrir el fichero LastUrls.js y sustitur la variable codeSvr (en la línea 4) por una cadena que contenga, codificada en Base 64, la URL del servidor al que se envia la información. 
+ En el navegador de Google Chrome, abrir extensiones (chrome://extensions/) habilitar el modo desarrollador, cargar extensión descomprimida y selecinar la carpeta LastUrl. 


## Basic usage

+ `gate.php`: recibe los datos que envía la extensión y los guarda.
+ `panel.php`: monitoriza la ultima URL almacenada y la hora.

Realizar navegación en Google Chrome y comprobar desde panel.php los datos que se registran (con cada transición y cambio de URL en el navegador deberían mostrarse los datos en panel.php).

## Architecture

![Architecture](MitB.png)
