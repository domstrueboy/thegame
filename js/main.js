'use strict';
(function game(){

const field = document.querySelector('.field');
         
// Initial values:
let numberOfRows    = 15,
    numberOfColumns = 15;
let bombs = 50;
const bombsOutput = document.querySelector('.bombs__number');
bombsOutput.innerHTML = bombs + ''; 

let treasures = 0;
const treasuresOutput = document.querySelector('.treasures__number');
treasuresOutput.innerHTML = treasures + '';

let freeCells = numberOfRows*numberOfColumns - bombs;



let centerRow = Math.floor(numberOfRows/2),
    centerColumn = Math.floor(numberOfColumns/2);

// Заполнение поля клетками
for (let i = 0; i < numberOfRows; i++) {
    let row = document.createElement("div");
    row.classList.add('field__row', `row${i}`);
    field.appendChild(row);
    for (let j = 0; j < numberOfColumns; j++) {
        let cell = document.createElement("div");
        cell.classList.add('cell', `column${j}`);

        row.appendChild(cell);
        
            let cellContent = document.createElement("div");
            cellContent.classList.add('cell__content');
            cellContent.dataset.row = `${i}`;
            cellContent.dataset.col = `${j}`;
            cell.appendChild(cellContent);
    }
}

let temp_bombs = bombs;
do { // Размещение бомб
    let randRow = getRandomInt(0, numberOfRows);
    let randCol = getRandomInt(0, numberOfColumns);

    if (randRow === centerRow && randCol === centerColumn) {
        continue;
    }

    let cellContent = document.querySelector(`.row${randRow} > .column${randCol} > .cell__content`);
    let cellAlreadyHasABomb = cellContent.children.length > 0; // потом переделать через поиск класса

    if ( !cellAlreadyHasABomb ) {
        putABomb(cellContent);
    }

    temp_bombs--;
} while(temp_bombs > 0);

for (let i = 0; i < numberOfRows; i++) {
    for (let j = 0; j < numberOfColumns; j++) {
        let cellContent = document.querySelector(`.row${i} > .column${j} > .cell__content`);
        let cellCover = document.createElement("div");
        cellCover.classList.add('cell__cover');
        cellContent.appendChild(cellCover);
        cellCover.addEventListener('click', step);
        cellCover.addEventListener('contextmenu', toggleAFlag);
    }
}

// Размещение стрелки на центральном поле
let initialCell = document.querySelector(`.row${centerRow} > .column${centerColumn} > .cell__content`);
initialCell.firstChild.classList.add('cell__cover_opened');
putArrows(initialCell);

function putABomb(node) {
    const layers = ['one', 'two', 'three'];
    node.dataset.bomb = 'yes';

    for (let layer of layers) {
        let bang = document.createElement('div');
        bang.classList.add(`cell__bang${layer}`);
        bang.innerHTML = '<i class="material-icons">grade</i>';
        node.appendChild(bang);
    }
}

function step(e) {
    e.target.classList.add('cell__cover_opened');
    const cellContent = e.target.parentNode;

    let cellAlreadyHasABomb = cellContent.children.length > 1; // потом переделать через поиск класса

    if ( !cellAlreadyHasABomb ) {
        putArrows(cellContent);
        freeCells--;
        if (freeCells === 0) {
            alert('ПОБЕДА!');
            setTimeout(function(){
                field.innerHTML = '';
                game();
            }, 3000);
        }
    }
    else {
        const cells = document.querySelectorAll('.cell__cover');
        cells.forEach(cell => cell.classList.add('cell__cover_opened'));
        alert('БУУУМ!');
        setTimeout(function(){
            field.innerHTML = '';
            game();
        }, 1000);
    }
}

function toggleAFlag(e) {
    e.preventDefault(); // Чтобы не вылазило контекстное меню по-умолчанию
    const cellContent = e.target.closest('.cell__cover');

    if (cellContent.firstChild) {
        cellContent.removeChild(cellContent.firstChild);
        bombs++;
        bombsOutput.innerHTML = bombs + '';
    } else {
        let flag = document.createElement("div");
        flag.classList.add('cell__flag');
        flag.innerHTML = `<i class="material-icons">flag</i>`;   
        cellContent.appendChild(flag); 
        bombs--;
        bombsOutput.innerHTML = bombs + ''; 
    }
}

function putATreasure(node) {
    const treasure = document.createElement("div");
    treasure.innerHTML = `<i class="material-icons">attach_money</i>`;
    treasure.classList.add('cell__treasure');
    node.appendChild(treasure);
    treasures++;
    treasuresOutput.innerHTML = treasures + '';
}

function putArrows(node) {
    // Создаем ссылки на клетки справа, сверху, слева, снизу от выбранной
    const rightWay = document.querySelector(`div[data-row="${ +node.dataset.row }"][data-col="${ +node.dataset.col + 1 }"]`);
    const topWay = document.querySelector(`div[data-row="${ +node.dataset.row - 1 }"][data-col="${ +node.dataset.col }"]`);
    const leftWay = document.querySelector(`div[data-row="${ +node.dataset.row }"][data-col="${ +node.dataset.col - 1 }"]`);
    const bottomWay = document.querySelector(`div[data-row="${ +node.dataset.row + 1 }"][data-col="${ +node.dataset.col }"]`);
    const crossField = [rightWay, topWay, leftWay, bottomWay];
    
    if (crossField // Проверка на тупик (можно ли разместить сокровище)
        .map( el => (el && el.firstChild.matches(`.cell__cover_opened`)) ? null : el)
        .reduce( (acc, currentValue, currentIndex) => {
            if (currentValue) {
                acc.push(currentIndex);
                return acc;
            } else {
                return acc;
            }
        }, []).length > 0) {
        getRandomInt(0, 4)
    } else {
        putATreasure(node);
        return
    }

    const trueDirection = getRandomInt(0, 4); // Берём случайное направление
    const trueDestinationCell = crossField[trueDirection]; 

    const trueArrow = document.createElement("div");
    trueArrow.innerHTML = `<i class="material-icons">trending_flat</i>`;

    if (trueDestinationCell && trueDestinationCell.dataset.bomb === 'yes') {
        trueArrow.classList.add('cell__arrowred');
    } else {
        trueArrow.classList.add('cell__arrowgreen');
    }
    
    trueArrow.style.transform = `rotate(-${trueDirection*90}deg)`;
    

    // Теперь ложная стрелка
    const falseDirection = getRandomInt(0, 4); // Берём случайное направление
    const falseDestinationCell = crossField[falseDirection];

    const falseArrow = document.createElement("div");
    falseArrow.innerHTML = `<i class="material-icons">trending_flat</i>`;

    if (falseDestinationCell && falseDestinationCell.dataset.bomb === 'yes') {
        falseArrow.classList.add('cell__arrowgreen');
    } else {
        falseArrow.classList.add('cell__arrowred');
    }
    
    falseArrow.style.transform = `rotate(-${falseDirection*90}deg)`;

    if (trueDirection === falseDirection) {
        trueArrow.classList.add('cell__arrow_up');
        falseArrow.classList.add('cell__arrow_down');
    } else if (Math.abs(trueDirection - falseDirection) === 2) {
        trueArrow.classList.add('cell__arrow_up');
        falseArrow.classList.add('cell__arrow_up');
    }

    node.appendChild(trueArrow);
    node.appendChild(falseArrow);
}

function getRandomInt(min, max) { // Возвращает случайное целое число между min (включительно) и max (не включая max)
    return Math.floor(Math.random() * (max - min)) + min;
}

})();