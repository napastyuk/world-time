(function init() {

    /*configuration options*/
    let citySelectWrapperEl = document.querySelector('.citySelectWrapper');
    let clockEl = document.querySelector('.clock');
    let amPmSwitchEl = document.querySelector('#amPmFormatSwitch');
    let dateEl = document.querySelector('.date');
    let cityListEl = document.querySelector('.citySelectWrapper');

    let syncInterval = 5 * 60 * 1000; // как часто синхронизировать с внешним API в миллисекундах
    let updatedTime = new Date(); //время обновленное через интернет или локально инкрементом по секундам 
    let syncAPIurl = 'http://worldtimeapi.org/api/timezone/Europe/Moscow';
    const cityList = {            //массив городов и названий часовых поясов по IANA
        LED: {
            name: 'Санкт-Петербург, Россия',
            timezoneName: 'Europe/Moscow'
        },
        JFK: {
            name: 'Нью-Йорк, США',
            timezoneName: 'America/New_York'
        },
        NRT: {
            name: 'Токио, Япония',
            timezoneName: 'Asia/Tokyo'
        }
    }

    function startClock() {
        updateTime(); //сразу запускаем setInterval callback что бы браузер не ждал одну секунду до первого обновления
        syncTime();  //сразу запускаем синхронизацию, на случай если на клиенте установлено неправильное время 
        setInterval(updateTime, 1000);
        setInterval(syncTime, syncInterval);
    }

    function syncTime() {
        sendXMLHttpRequest(syncAPIurl);
    }

    function sendXMLHttpRequest(url) {
        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                parseNewTime(xhr.responseText);
            } else if (this.status == 0) {
                console.log('Отсутствует подключение к интернету');
                updatedTime = new Date(); //если не получилось синхронизироватся с интернетом, синхронизируется с локальными часами
            } else if (this.status != 200) {
                console.error('Ошибка. Статус: ' + this.status + ' Этап запроса ' + this.readyState);
            }
        };
        xhr.send();
    }

    function parseNewTime(newTimeStr) {
        let newTimeObj = JSON.parse(newTimeStr);
        //при создании new Date информация о часовом поясе все равно потеряется 
        //поэтому используем поле datetime
        updatedTime = new Date(newTimeObj.datetime); 
    }

    function updateTime() {   //локальное обновление времени
        updatedTime.setSeconds(updatedTime.getSeconds() + 1);
        showFormattedTime();
    }

    /*---------------*/
    /*view functions*/
    /*--------------*/

    function renderView() {
        //сгенерируем селект из тех городов которые есть в объекте cityList        
        let citySelectLabelEl = document.createElement('label');
        citySelectLabelEl.setAttribute('for', 'citySelect');
        citySelectLabelEl.innerText = 'Выберете город: ';
        citySelectWrapperEl.appendChild(citySelectLabelEl);

        let citySelectSelectEl = document.createElement('select');
        citySelectSelectEl.setAttribute('id', 'citySelect');
        for (let prop in cityList) {
            let citySelectOptionEl = document.createElement('option');
            citySelectOptionEl.setAttribute('value', prop);
            citySelectOptionEl.innerText = cityList[prop].name;
            citySelectSelectEl.appendChild(citySelectOptionEl);
        }
        citySelectWrapperEl.appendChild(citySelectSelectEl);

        //запускаем приложение
        startClock();
    }

    function showFormattedTime() {
        let cityListSelectorEl = cityListEl.querySelector('#citySelect');
        let selectedItem = Object.keys(cityList)[cityListSelectorEl.selectedIndex];
        let selectedTimezone = cityList[selectedItem].timezoneName;

        let clockOptions = {
            hour12: amPmSwitchEl.checked,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            timeZone: selectedTimezone
        };
        let dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            timeZone: selectedTimezone
        };

        if (toLocaleStringSupportsLocales() != true) console.log = ('Браузер не поддерживает toLocaleString()');
        clockEl.innerText = document.title = updatedTime.toLocaleString('ru-RU', clockOptions);
        dateEl.innerText = updatedTime.toLocaleString('ru-RU', dateOptions);
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