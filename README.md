## Задача:
Не используя сторонних библиотек наверстать интерфейс часов. Время брать AJAX запросом из http://worldtimeapi.org/ и раз в 5 минут синхронизироваться. Добавить: 
1. Выбора между несколькими городами
2. Переключения между 24/12 часовыми режимами 
3. Отображение текущуй дата с днем недели
4. Отображение текущего времени на вкладке страницы 

## Выполнение:
1. Синхронизация. После загрузки прилождение пробуем подключится к API , если получается используется время полученое по API. Если нет(допустим в случае локального запуска на устройстве без интернета), используется время установленное на устройстве.  Раз в 5 минут приложение пробует соединится с API для синхронизации. Без интернета часы работают используя setInterval с инкрементом секунд.  Функция setInterval не гарантирует вызов каждую секунду, потому что в эту секунду входит время выполнения самой функции, поэтому в случае неудачной попытки синхронизации с API происходит синхронизация с локальными часами через new Date(). 
2. Для добавления новых городов достаточно дописать их в объект cityList. Список официальных названий всех часовых поясов можно найти в файле zone1970.tab базы IANA Time Zone Database. 
3. Приложение может не всегда корректно обрабатывать время в городах если там используется переход на зимнее/летнее время. Информация о времени в часовом поясе берётся из js функции, т е из системной копии базы IANA, а она не всегда бывает актуальной.

## todo later:
1. Добавить тесты.
2. Вынести глобальные переменные в конфигурационный объект.
3. Добавить режим аналоговых часов и/или вывод нескольких часов одновременно.





