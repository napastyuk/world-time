(function init() {
    let clockEl = document.getElementById('clock');
    let syncInterval = 5 * 60 * 1000; // как часто синхронизировать с внешним API в миллисекундах
    let updatedTime = new Date(); //время обновленное через интернет или локально инкрементом по секундам 
    
    function sendXMLHttpRequest(url) {
        console.log("отправляем запрос на " + url);
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {          
            if (this.readyState == 4 && this.status == 200) {
                parseNewTime(xhr.responseText);
            } else if (this.status == 0) {
                console.log('Отсутствует подключение к интернету');
            } else if (this.status != 200) {
                console.error('Ошибка. Статус: ' + this.status + ' Этап запроса ' + this.readyState); 
            }
        };
        xhr.send();
    }
    
    function syncTime() {
        sendXMLHttpRequest('http://worldtimeapi.org/api/timezone/Europe/Moscow');
    }
    
    function parseNewTime(newTimeStr) {
        let newTimeObj = JSON.parse(newTimeStr);  
        updatedTime = new Date(newTimeObj.datetime); 
    }

    function updateTime() {
        updatedTime.setSeconds(updatedTime.getSeconds() + 1);
        showFormattedTime(); 
    }   

    function showFormattedTime() {
        if (toLocaleStringSupportsLocales() != true) console.log = ('Браузер не поддерживает toLocaleString()');
        var options = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
        clockEl.innerText = updatedTime.toLocaleString('ru-RU', options);
        //document.title = updatedTime.toLocaleString('ru-RU', options);
        // https://jsfiddle.net/yashva/9fuj3pad/
    }

    function toLocaleStringSupportsLocales() {
        try {
            new Date().toLocaleString('i');
        } catch (e) {
            return e.name === 'RangeError';
        }
        return false;
    }
    
    function startClock() {
        updateTime(); //сразу запускаем setInterval callback что бы браузер не ждал одну секунду до первого обновления
        syncTime();  //сразу запускаем синхронизацию, на случай если на клиенте установлено неправильное время 
        let timerId = setInterval(updateTime, 1000);
        let syncId = setInterval(syncTime, syncInterval); 
        
    }
        
    startClock();
}());