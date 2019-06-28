(function init() {
    let clockEl = document.getElementById('clock');
    let currentTime = new Date();
    
    function sendXMLHttpRequest(url) {
        console.log("отправляем запрос на " + url);
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {          
            if (this.readyState == 4 && this.status == 200) {
                parseNewTime(xhr.responseText);
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
        newTime = JSON.parse(newTimeStr);  
        currentTime = new Date(newTime.datetime);
        console.dir(currentTime);
    }

    function updateTime() {         
        //функция setInterval не гарантирует вызов каждую секунду,
        //потому что в расчётный интервал вход время выполнения функции,
        //поэтому можно делать  Date.now() каждую секунду или выполнять синхронихацию через интернет

        let hours = currentTime.getHours();
        if (hours < 10) hours = '0' + hours;
        clockEl.children[0].innerText = hours;

        let minutes = currentTime.getMinutes();
        if (minutes < 10) minutes = '0' + minutes;
        clockEl.children[1].innerText = minutes;

        let seconds = currentTime.getSeconds();
        if (seconds < 10) seconds = '0' + seconds;
        clockEl.children[2].innerText = seconds;

        currentTime.setSeconds(currentTime.getSeconds()+1);
        // document.title = hours + ":" + minutes + ":" + seconds;
    }    
    
    function startClock() {
        updateTime(); 
        let timerId = setInterval(updateTime, 1000);
        let syncId = setInterval(syncTime, 300000);
        // let syncId = setInterval(syncTime, 5000);
    }
        
    startClock();
}());