(function init() {

    let syncInterval = 5 * 60 * 1000; // как часто синхронизировать с внешним API в миллисекундах
    let updatedTime = new Date(); //время обновленное через интернет или локально инкрементом по секундам  
    const cityList = {
        LED: {
            name: 'Санкт-Петербург, Россия',
            timezoneName: 'Europe/Moscow'  //имя часовой зоны по IANA
        },
        JFK: {
            name: 'Нью-Йорк, США',
            timezoneName: 'America/New_York'  //имя часовой зоны по IANA
        },
        NRT: {
            name: 'Токио, Япония',
            timezoneName: 'Asia/Tokyo'  //имя часовой зоны по IANA 
        }
    }
    let cityListSelectedItem = cityList.LED;

    function startClock() {
        updateTime(); //сразу запускаем setInterval callback что бы браузер не ждал одну секунду до первого обновления
        syncTime();  //сразу запускаем синхронизацию, на случай если на клиенте установлено неправильное время 
        let timerId = setInterval(updateTime, 1000);
        let syncId = setInterval(syncTime, syncInterval);
    }

    function syncTime() {
        sendXMLHttpRequest('http://worldtimeapi.org/api/timezone/Europe/Moscow');
    }

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

    function parseNewTime(newTimeStr) {
        let newTimeObj = JSON.parse(newTimeStr);
        updatedTime = new Date(newTimeObj.datetime);
    }

    function updateTime() {
        updatedTime.setSeconds(updatedTime.getSeconds() + 1);
        showFormattedTime();
    }

    /*---------------*/
    /*view functions*/
    /*--------------*/

    function renderView() {
        
        startClock();
    }

    function showFormattedTime() {
        let clockEl = document.querySelector('.clock');
        let amPmFormatSwitchEl = document.querySelector('#amPmFormatSwitch');
        let cityNameEl = document.querySelector('.cityName');
        let dateEl = document.querySelector('.date');
        let cityListSelectEl = document.querySelector('.citySelect > #citySelect');
        let cityListSelectedItem = Object.keys(cityList)[cityListSelectEl.selectedIndex];
        // if (cityListSelectedItem!="LED") debugger;

        let clockOptions = {
            hour12: amPmFormatSwitchEl.checked,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit', 
            timeZone: cityList[cityListSelectedItem].timezoneName
        };
        let dateOptions = {
            weekday:'long',
            year:'numeric',
            month:'long',
            day:'numeric',
            timeZone: cityList[cityListSelectedItem].timezoneName
        };
    
        if (toLocaleStringSupportsLocales() != true) console.log = ('Браузер не поддерживает toLocaleString()');

        clockEl.innerText = updatedTime.toLocaleString('ru-RU', clockOptions);
        
        cityNameEl.innerText = cityList[cityListSelectedItem].name + " - точное время";
        
        dateEl.innerText = updatedTime.toLocaleString('ru-RU', dateOptions);

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

    renderView(); //точка входа
}());