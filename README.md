# Servicio de Gestión de Notificaciones de Error

## Descripción
Este servicio es parte de una aplicación para monitorear el estado de otros servicios y notificar errores a través de correo electrónico. Está desarrollado utilizando TypeScript y Node.js, y emplea una arquitectura basada en el patrón de diseño de repositorio.

## Funcionalidades
- Programa trabajos cron para verificar el estado de los servicios.
- Envía notificaciones por correo electrónico en caso de errores.
- Consume mensajes de una cola de RabbitMQ para recibir notificaciones de errores.
- Guarda registros de errores en diferentes tipos de almacenes de datos, como sistemas de archivos y bases de datos MongoDB y PostgreSQL.

## Dependencias
- `amqp-connection-manager`: Para gestionar la conexión con RabbitMQ.
- `amqplib`: Cliente AMQP para Node.js.
- `cron`: Librería para programar trabajos cron en Node.js.
- `dotenv`: Para cargar variables de entorno desde archivos .env.
- `env-var`: Para validar y acceder a variables de entorno de forma segura.
- `mongoose`: Biblioteca de modelado de objetos MongoDB para Node.js.
- `nodemailer`: Módulo para enviar correos electrónicos desde Node.js.

## Tecnologías
- TypeScript
- Node.js
- MongoDB
- PostgreSQL
- RabbitMQ

## Instalación
1. Clona este repositorio en tu máquina local.
2. Instala las dependencias utilizando el comando `npm install`.
3. Crea un archivo `.env` basado en el archivo `.env.template` proporcionado y configura las variables de entorno según tus necesidades.
4. Ejecuta el servicio utilizando el comando `npm start`.
5. Recuerda tener configuradas las conexiones a los servicios externos, como RabbitMQ y las bases de datos MongoDB y PostgreSQL, en los archivos de configuración correspondientes.
