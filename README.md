# rin-bot
Бот для управления серверами Minecraft

[По всем вопросам](https://vk.com/re1khsempai)

# Получение токена от ВКонтакте
Первый способ:
* Перейти в сообщество от которого Вы хотите получить токен
* Далее в "управление"
* Затем в "работа с API"
* И "создать ключ"

Второй способ:
* Перейти на сайт "[vkhost](https://vkhost.github.io/)"
* Далее в "настройки"
* Затем в "сообщество"
* И ввести ID сообщества в поле "ID сообщества" . _.
* После чего нажать "получить"

# Конфиг
```js
{
    "token": "token", // токен, который Вы получили
    "pollingGroupId": -1 // ИД от сообщества
}
```

# Права
Servers:
  * servers.rcon — право на доступ к команде !rcon
  * servers.use — право на доступ к команде !server
  * servers.add — право на доступ к подкоманде !servers add
  * servers.remove — право на доступ к подкоманде !servers remove

Permissions:
  * permissions.use — право на доступ к команде !permission
  * permissions.add — право на доступ к подкоманде !permission add
  * permissions.remove — право на доступ к подкоманде !permission remove
  
Users:
  * users.use — право на доступ к команде !user
  * users.add — право на доступ к подкоманде !user add
  * users.remove — право на доступ к подкоманде !user remove

System:
  * system.reload — право на доступ к команде !reload
