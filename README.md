# Pusher

Criação e configuração do projeto angular:  

`ng new pusher --routing --standalone --strict --style scss`

`ng add @angular/pwa`

`ng add @angular/material`


Criação e configuração do projeto nodejs:  

* Instalar as bibliotecas `node-pushnotifications` e `web-push` para mandar push notifications.  

* endpoint 'post' para '/subscribe' serve para cadastrar o browser como receptor de push notifications.  

* endpoint 'get' para '/sendNotification' serve para enviar push notifications usando a biblioteca PushNotifications.  

* endpoint 'get' para '/sendPushNotificationNewsletter' serve para enviar push notifications usando a biblioteca web-push.  

* endpoints "/discounted", "/newproduct", "/reject", "/reserve" servem como páginas do site fictício.  

#### Passos para a inscrição e envio de push notifications

* Entrar em: https://vapidkeys.com/ e gerar as chaves públicas e privadas usando teu email.  

* Editar o arquivo `push.service.ts` e aplicar a chave pública.  

* Compilar o projeto angular: `ng build -c production`  

* Rodar o angular num servidor http, por exemplo o http-server:  `http-server -c-1 ./dist/pusher/browser`  

* Abrir um navegador em localhost:8080, entrar no inspector, ir na aba Application, Service Workers e verificar o registro caso exista, o Service Worker está atrelado a inscrição no servidor nodejs.

* Rodar o servidor nodejs: 

1- Entrar na pasta server.  
2- Rodar o node: `node .`

* Abrir um outro navegador, podendo ser até em outra máquina, e solicitar o envio de push notifications ao servidor nodejs: `http://localhost:3000/sendNotification`  

