### Запуск проекта локально через docker-compose
Если возникает ошибка:

ERROR: Network nginx-proxy declared as external, but could not be found. Please create the network manually using `docker network create nginx-proxy` and try again.

Выполните:
docker network create nginx-proxy

Далее
docker-compose up -d

Обратите внимание загруженные файлы хранятся в ./uploads !

# Присоединиться к прод mongo
ssh root@49.12.7.8
docker exec -it prtv-mongo bash
mongo mongodb://root:5eX9axFSDv7dN2PN@127.0.0.1:27017
use prtv
db.slideStream.find().pretty()

# Как выложить
Выполнить:

`sh build_prod.sh`

Важное замечание client/.env (или как то по другому установите переменные среды) должен содержать правильные переменные при сборке


/root/nginx-proxy-ssl там настройка для сборки nginx и сертификатов
