(function(){
// DOM-nodes:
const field = document.querySelector('.field');
         
// Initial values:
let numberOfRows    = 15,
    numberOfColumns = 15;
let bombs = 100;

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

do {
    let randRow = getRandomInt(0, numberOfRows);
    let randCol = getRandomInt(0, numberOfColumns);

    let cellContent = document.querySelector(`.row${randRow} > .column${randCol} > .cell__content`);
    let cellAlreadyHasABomb = cellContent.children.length > 0;

    if ( !cellAlreadyHasABomb ) {
        putABomb(cellContent);
    }

    bombs--;
} while(bombs > 0);

for (let i = 0; i < numberOfRows; i++) {
    for (let j = 0; j < numberOfColumns; j++) {

        let cellContent = document.querySelector(`.row${i} > .column${j} > .cell__content`);

        let cellCover = document.createElement("div");
        cellCover.classList.add('cell__cover');
        cellContent.appendChild(cellCover);
        cellCover.addEventListener('click', e => e.target.classList.add('cell__cover_opened') );
    }
}

function putABomb(node) {
    const layers = ['one', 'two', 'three'];

    for (let layer of layers) {
        let bang = document.createElement('div');
        bang.classList.add(`cell__bang${layer}`);
        bang.innerHTML = '<i class="material-icons">grade</i>';
        node.appendChild(bang);
    }
}

function putAnArrow() {
    let arrowOne = document.createElement("div");
    arrowOne.classList.add('cell__arrowone');
    arrowOne.innerHTML = `<i class="material-icons">trending_flat</i>`;
    cellContent.appendChild(arrowOne);

    let arrowTwo = document.createElement("div");
    arrowTwo.classList.add('cell__arrowtwo');
    arrowTwo.innerHTML = `<i class="material-icons">trending_flat</i>`;
    cellContent.appendChild(arrowTwo);
}

function getRandomInt(min, max) { // Возвращает случайное целое число между min (включительно) и max (не включая max)
    return Math.floor(Math.random() * (max - min)) + min;
}

})();