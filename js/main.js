(function(){
// DOM-nodes:
const field = document.querySelector('.field');
         
// Initial values:
let numberOfRows    = 15,
    numberOfColumns = 15;
let bombs = 10;

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
            cell.appendChild(cellContent);
    }
}

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

    bombs--;
} while(bombs > 0);

for (let i = 0; i < numberOfRows; i++) {
    for (let j = 0; j < numberOfColumns; j++) {

        if (i === centerRow && j === centerColumn) { // Не закрываем центральное поле
            continue;
        }

        let cellContent = document.querySelector(`.row${i} > .column${j} > .cell__content`);

        let cellCover = document.createElement("div");
        cellCover.classList.add('cell__cover');
        cellContent.appendChild(cellCover);
        cellCover.addEventListener('click', step );
    }
}

// Размещение стрелок на начальном поле
let initialCell = document.querySelector(`.row${centerRow} > .column${centerColumn} > .cell__content`);
putAnArrow(initialCell);

function putABomb(node) {
    const layers = ['one', 'two', 'three'];

    for (let layer of layers) {
        let bang = document.createElement('div');
        bang.classList.add(`cell__bang${layer}`);
        bang.innerHTML = '<i class="material-icons">grade</i>';
        node.appendChild(bang);
    }
}

function step(e) {
    e.target.classList.add('cell__cover_opened');
    let cellContent = e.target.parentNode;

    let cellAlreadyHasABomb = cellContent.children.length > 1; // потом переделать через поиск класса

    if ( !cellAlreadyHasABomb ) {
        putAnArrow(cellContent);
    }
    else {
        alert('Game over!');
    }

}

function putAnArrow(node) {
    let arrowOne = document.createElement("div");
    arrowOne.classList.add('cell__arrowone');
    arrowOne.innerHTML = `<i class="material-icons">trending_flat</i>`;
    let directionOne = getRandomInt(0, 4);
    arrowOne.style.transform = `rotate(${directionOne*90}deg)`;
    node.appendChild(arrowOne);

    let arrowTwo = document.createElement("div");
    arrowTwo.classList.add('cell__arrowtwo');
    arrowTwo.innerHTML = `<i class="material-icons">trending_flat</i>`;
    let directionTwo = getRandomInt(0, 4);
    arrowTwo.style.transform = `rotate(${directionTwo*90}deg)`;
    node.appendChild(arrowTwo);
}

function getDirection(node) {
    let directionOne = getRandomInt(0, 4);
    arrowOne.style.transform = `rotate(${directionOne*90}deg)`;
}

function getRandomInt(min, max) { // Возвращает случайное целое число между min (включительно) и max (не включая max)
    return Math.floor(Math.random() * (max - min)) + min;
}

})();


/*document.querySelectorAll('cell__content') // то же, что предыдущий цикл, но в другом стиле, правда не работает, ну и ладно, потом разберусь
        .forEach(el => {
            console.log(el);
            cellCover = document
                        .createElement("div")
                        .classList
                        .add('cell__cover');
            el.appendChild(cellCover);
            cellCover.addEventListener('click', e => e.target.classList.add('cell__cover_opened') );
        });*/