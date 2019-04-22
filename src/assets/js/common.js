
const cells = [];
const root = document.getElementById("root");
const daysHeader = document.createElement("div");
const field = document.createElement("div");

const butsWrapper = document.createElement("div");

const monthText = document.createElement("p");
const backMonthBut = document.createElement("div");
const forwardMonthBut = document.createElement("div");

const yearText = document.createElement("p");
const backYearBut = document.createElement("div");
const forwardYearBut = document.createElement("div");

const modalWindow = document.createElement("div");
let   lastCellClicked = {};

// Ширина и высота ячейки
const cellW = 100;
const cellH = 100;

// Количество ячеек
const xNum = 7;
const yNum = 6;
const cellsNum = xNum*yNum;

const days = ["ПН","ВТ","СР","ЧТ","ПТ","СБ","ВС"];
const months = [
                {name:"Январь",n:31},
                {name:"Февраль",n:28},
                {name:"Март",n:31},
                {name:"Апрель",n:30},
                {name:"Май",n:31},
                {name:"Июнь",n:30},
                {name:"Июль",n:31},
                {name:"Август",n:31},
                {name:"Сентябрь",n:30},
                {name:"Октябрь",n:31},
                {name:"Ноябрь",n:30},
                {name:"Декабрь",n:31}
               ];

let curM = 3;
let curY = 2019;

main();

function main() {
    updateFeb();
    renderDaysHeader();
    renderField();
    root.append(field);
    updateCells();
    renderBackForwardButs();
    renderModal();
    console.log(localStorage);
}

// Проверка года на високосность
function isBissextile(year) {
    if (year % 4 === 0) {
        if (year % 100 === 0) {
            if (year % 400 === 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    } else {
        return false;
    }
}

// Рендер шапки календаря с днями недели
function renderDaysHeader() {
    daysHeader.className = "days-header";

    for (let i = 0; i < days.length; i++) {
        const day = document.createElement("div");
        
        // Атрибуты дней недели
        day.className = "day";
        day.textContent = days[i];
        day.style.width = cellW + "px";
        daysHeader.append(day);
    }
    root.append(daysHeader);
}

function showModal() {
    modalWindow.querySelector("textarea").value = localStorage["y" + curY + "m" + curM + "d" + this.querySelector(".cell-num").textContent] || "";
    if (lastCellClicked === this) {
        modalWindow.classList.toggle("modal-showed");
    } else {
        modalWindow.classList.add("modal-showed");
    }
    lastCellClicked = this;
    if (modalWindow.classList.contains("modal-showed")) {
        let coords = this.getBoundingClientRect();
        if (coords.right + modalWindow.offsetWidth < window.innerWidth && coords.top + 30 + modalWindow.offsetHeight < window.innerHeight) {
            modalWindow.style.top = coords.top + 30 + "px";
            modalWindow.style.left = coords.right + "px";
        } else if (coords.right + modalWindow.offsetWidth < window.innerWidth && coords.top + 30 + modalWindow.offsetHeight > window.innerHeight) {
            modalWindow.style.top = coords.top - modalWindow.offsetHeight + 30 + "px";
            modalWindow.style.left = coords.right + "px";
        } else if (coords.top + 30 + modalWindow.offsetHeight > window.innerHeight){
            modalWindow.style.top = coords.top - modalWindow.offsetHeight + 30 + "px";
            modalWindow.style.left = coords.left - modalWindow.offsetWidth + "px";
        } else {
            modalWindow.style.top = coords.top + 30 + "px";
            modalWindow.style.left = coords.left - modalWindow.offsetWidth + "px";
        }
    }
}

function renderField() {
    // Атрибуты поля
    field.className = "field";
    field.style.width = cellW * xNum + "px";
    field.style.height = cellH * yNum + "px";

    for (let i = 0; i < cellsNum; i++) {
        const cell = document.createElement("div");
        const cellText = document.createElement("div");
        const cellNum = document.createElement("div");
        cellText.className = "cell-text";
        cellNum.className = "cell-num";
        cell.append(cellNum);
        cell.append(cellText);

        // Атрибуты ячейки
        cell.style.width = cellW + "px";
        cell.style.height = cellH + "px";
        cell.addEventListener("click",showModal);


        // У первого ряда(кроме первой ячейки) убираем только левую границу
        if (i>0 && i<xNum) cell.style.borderLeft = "0";
        // У всех остальных ячеек кроме крайних левых убирает левую и верхнюю границу
        if (i>6 && (i+1)%xNum!=1) {
            cell.style.borderTop = "0";
            cell.style.borderLeft = "0";
        }
        // У ячеек которые слева убираем только верхнюю границу
        if ((i+1)%xNum==1 && i>6) cell.style.borderTop = "0";


        field.append(cell);
        cells.push(cell);
    }
}

// Обновление дней в феврале если год високосный
function updateFeb() {
    months[1].n = isBissextile(curY) ? 29 : 28;
}

// Получение дня недели первого числа текущего месяца
function getFirstDay(year,month) {
    const num = new Date(year,month,1).getDay() - 1;
    return num < 0 ? 6 : num;
}

function saveEvent() {
    let value = this.parentElement.querySelector("textarea").value,
        month = curM;
    if (lastCellClicked.classList.contains("prev-month-cell")) {
        month = month-1 >= 0 ? month-1 : 11;
    } else if (lastCellClicked.classList.contains("next-month-cell")) {
        month = month+1 <=11 ? month+1 : 0;
    }
    let key = "y"+curY+"m"+month+"d"+lastCellClicked.querySelector(".cell-num").textContent;
    localStorage.setItem(key,value);
    this.parentElement.classList.remove("modal-showed");
    lastCellClicked.querySelector(".cell-text").textContent = value;
}

// Рендер модального окна
function renderModal() {
    const modalInput = document.createElement("textarea");
    const modalButton = document.createElement("button");

    modalInput.placeholder = "Текст события...";
    modalButton.textContent = "Сохранить";
    modalButton.addEventListener("click",saveEvent);

    modalWindow.append(modalInput);
    modalWindow.append(modalButton);
    modalWindow.className = "modal-window";
    root.append(modalWindow);
}

// Рендер кнопок управления
function renderBackForwardButs() {
    // Обертка для блока с кнопками
    butsWrapper.className = "buts-wrapper";

    // Отображение текущего месяца пользователю
    monthText.className = "month-text";
    updateMonth();

    // Предыдущий месяц
    backMonthBut.className = "back-month button";
    backMonthBut.innerHTML = '<i class="fa fa-angle-left" aria-hidden="true"></i>';
    backMonthBut.addEventListener("click",()=>{decrementMonth()});

    // Следующий месяц
    forwardMonthBut.className = "forward-month button";
    forwardMonthBut.innerHTML = '<i class="fa fa-angle-right" aria-hidden="true"></i>';
    forwardMonthBut.addEventListener("click",()=>{incrementMonth()});

    // Отображение текущего года пользователю
    yearText.className = "year-text";
    updateYear();

    // Предыдущий год
    backYearBut.className = "back-year button";
    backYearBut.innerHTML = '<i class="fa fa-angle-left" aria-hidden="true"></i>';
    backYearBut.addEventListener("click",()=>{decrementYear() });

    // Следующий год
    forwardYearBut.className = "forward-year button";
    forwardYearBut.innerHTML = '<i class="fa fa-angle-right" aria-hidden="true"></i>';
    forwardYearBut.addEventListener("click",()=>{incrementYear()});


    butsWrapper.append(backMonthBut,monthText,forwardMonthBut,backYearBut,yearText,forwardYearBut);
    root.append(butsWrapper);
}

// Предыдущий месяц
function decrementMonth() {
    curM--;
    if (curM < 0) curM = 11;
    updateMonth();
    updateCells();
}

// Следующий месяц
function incrementMonth() {
    curM++;
    if (curM > 11) curM = 0;
    updateMonth();
    updateCells();
}

// Предыдущий год
function decrementYear() {
    curY--;
    updateFeb();
    updateYear();
    updateCells();
}

// Следующий год
function incrementYear() {
    curY++;
    updateFeb();
    updateYear();
    updateCells();
}

// Обновление текущего месяца для пользователя
function updateMonth() {
    monthText.textContent = months[curM].name;
}

// Обновление текущего года для пользователя
function updateYear() {
    yearText.textContent = curY;
}

// Обновление ячеек при смене месяца или года
function updateCells() {
    // Узнаем под каким днем недели находится первое число текущего месяца
    let numDay = getFirstDay(curY,curM);
    let prevMonthCounter = curM-1 >= 0 ? months[curM-1].n-numDay+1 : months[11].n-numDay+1,
        nextMonthCounter = 0;
    for (let i = 0;i < cells.length;i++) {
        let cellText = cells[i].querySelector(".cell-text"),
            cellNum  = cells[i].querySelector(".cell-num");
        // Ячейки предыдущего месяца
        if (i<numDay) {
            cellNum.textContent = prevMonthCounter++;
            cellText.textContent = localStorage["y"+curY+"m"+(curM-1 >= 0 ? curM-1 : 11)+"d"+(prevMonthCounter-1)];
            cells[i].className = "cell prev-month-cell";
        }

        // Ячейки текущего месяца
        if (i>=numDay && i<months[curM].n + numDay) {
            let curNum = i - numDay + 1;
            cellText.textContent = localStorage["y"+curY+"m"+curM+"d"+curNum];
            cellNum.textContent = curNum;
            cells[i].className = "cell";
        }

        // Ячейки следующего месяца
        if (i>=months[curM].n + numDay) {
            cellNum.textContent = ++nextMonthCounter;
            cellText.textContent = localStorage["y"+curY+"m"+(curM+1 <= 11 ? curM+1 : 0)+"d"+nextMonthCounter];
            cells[i].className = "cell next-month-cell";
        }
    }
}