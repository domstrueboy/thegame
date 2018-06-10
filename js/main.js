(function (){
// DOM-nodes:
const field = document.querySelector('.field');
         
// Initial values:
let numberOfRows    = 15,
    numberOfColumns = 15;
let bombs = 20;

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
putAnArrow(initialCell);

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
        putAnArrow(cellContent);
    }
    else {
        const cells = document.querySelectorAll('.cell__cover');
        cells.forEach(cell => cell.classList.add('cell__cover_opened'));
        alert('Game over!');
    }
}

function toggleAFlag(e) {
    e.preventDefault(); // Чтобы не вылазило контекстное меню по-умолчанию
    const cellContent = e.target.closest('.cell__cover');

    if (cellContent.firstChild) {
        cellContent.removeChild(cellContent.firstChild);
    } else {
        let flag = document.createElement("div");
        flag.classList.add('cell__flag');
        flag.innerHTML = `<i class="material-icons">flag</i>`;   
        cellContent.appendChild(flag);  
    }
}

function putAnArrow(node) {
    getDirections(node);
}

function getDirections(node) {
    // Создаем ссылки на клетки справа, сверху, слева, снизу от выбранной
    const rightWay = document.querySelector(`div[data-row="${ +node.dataset.row }"][data-col="${ +node.dataset.col + 1 }"]`);
    const topWay = document.querySelector(`div[data-row="${ +node.dataset.row - 1 }"][data-col="${ +node.dataset.col }"]`);
    const leftWay = document.querySelector(`div[data-row="${ +node.dataset.row }"][data-col="${ +node.dataset.col - 1 }"]`);
    const bottomWay = document.querySelector(`div[data-row="${ +node.dataset.row + 1 }"][data-col="${ +node.dataset.col }"]`);

    // Если пути по этой ссылке нет (граница поля или уже открыто), то присваиваем null этому направлению в map,
    // затем в reduce создаём массив, содержащий коды возможных направлений, от 0 до 3
    let allowedWays = [rightWay, topWay, leftWay, bottomWay]
                      //.map( el => (el && el.firstChild.matches(`.cell__cover_opened`)) ? null : el)
                      .reduce( (acc, currentValue, currentIndex) => {
                          if (currentValue) {
                               acc.push(currentIndex);
                              return acc;
                          } else {
                              return acc;
                          }
                      }, []);

    const trueDirection = allowedWays.length > 0 ? allowedWays[getRandomInt(0, allowedWays.length)] : null; //Генерируем код случайного направления из возможных
    if (trueDirection === null) { return } // Если нет свободного пути, то пока просто не размещаем стрелок
    
    let destinationCell;   
    if (trueDirection === 0) {
        destinationCell = rightWay;
    } else if (trueDirection === 1) {
        destinationCell = topWay;
    } else if (trueDirection === 2) {
        destinationCell = leftWay;
    } else if (trueDirection === 3) {
        destinationCell = bottomWay;
    }

    const trueArrow = document.createElement("div");
    trueArrow.innerHTML = `<i class="material-icons">trending_flat</i>`;

    if (destinationCell.dataset.bomb === 'yes') {
        trueArrow.classList.add('cell__arrowred');
        var alreadyPut = 'red';
    } else {
        trueArrow.classList.add('cell__arrowgreen');
        var alreadyPut = 'green';
    }
    
    trueArrow.style.transform = `rotate(-${trueDirection*90}deg)`;
    node.appendChild(trueArrow);

    // Теперь ложная стрелка
    const allowedDirections = [(trueDirection > 0) ? trueDirection - 1 : 3,
                               (trueDirection < 3) ? trueDirection + 1 : 0];
    allowedWays = [ [rightWay, topWay, leftWay, bottomWay][allowedDirections[0]],
                    [rightWay, topWay, leftWay, bottomWay][allowedDirections[1]] ]
                  //.map (el => (el && el.firstChild.matches(`.cell__cover_opened`)) ? null : el)
                  .reduce ( (acc, currentValue, currentIndex) => {
                    if (currentValue) {
                        acc.push(allowedDirections[currentIndex]);
                        return acc;
                    } else {
                        return acc;
                    }
                  }, []);

    const falseDirection = allowedWays.length > 0 ? allowedWays[getRandomInt(0, allowedWays.length)] : null; //Генерируем код случайного направления из возможных
    if (falseDirection === null) { return } // Если нет свободного пути, то не размещаем стрелку

    if (falseDirection === 0) {
        destinationCell = rightWay;
    } else if (falseDirection === 1) {
        destinationCell = topWay;
    } else if (falseDirection === 2) {
        destinationCell = leftWay;
    } else if (falseDirection === 3) {
        destinationCell = bottomWay;
    }

    const falseArrow = document.createElement("div");
    falseArrow.innerHTML = `<i class="material-icons">trending_flat</i>`;

    if (destinationCell.dataset.bomb === 'yes') {
        falseArrow.classList.add('cell__arrowgreen');
    } else {
        falseArrow.classList.add('cell__arrowred');
    }
    
    falseArrow.style.transform = `rotate(-${falseDirection*90}deg)`;
    node.appendChild(falseArrow);
}

function getRandomInt(min, max) { // Возвращает случайное целое число между min (включительно) и max (не включая max)
    return Math.floor(Math.random() * (max - min)) + min;
}

})();