(function(){
// DOM-nodes:
const field = document.querySelector('.field');
         
// Initial values:
let numberOfRows    = 15,
    numberOfColumns = 15;

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

                let arrowOne = document.createElement("div");
                arrowOne.classList.add('cell__arrowone');
                arrowOne.innerHTML = `<i class="material-icons">trending_flat</i>`;
                cellContent.appendChild(arrowOne);

                let arrowTwo = document.createElement("div");
                arrowTwo.classList.add('cell__arrowtwo');
                arrowTwo.innerHTML = `<i class="material-icons">trending_flat</i>`;
                cellContent.appendChild(arrowTwo);

                let cellCover = document.createElement("div");
                cellCover.classList.add('cell__cover');
                cellContent.appendChild(cellCover);
                cellCover.addEventListener('click', e => e.target.classList.add('cell__cover_opened') );
    }
}

//let x0, y0;
//let x = 0, y = 0;
//let card;

// Events:
//items.forEach(item => {
//    item.addEventListener('mousedown', down);
//});
//window.addEventListener('mousemove', move);

// Functions:
/*function down(e) {
    if (!e.target.matches('.item')) { return; }
    e.preventDefault();

    isHandling = true;
    x = 0, y = 0;
    card = e.target;
    x0 = card.offsetLeft; y0 = card.offsetTop;
    let width = card.clientWidth;

    e.target.style.opacity = 0.3;

    shuttle.style.display = 'block';
    shuttle.style.left = `${x0}px`;
    shuttle.style.top = `${y0}px`;
    shuttle.style.width = `${width}px`;

    shuttle.addEventListener('mouseup', up);
    shuttle.addEventListener('mouseleave', up);
    console.log(e);
}

function up(e) {
    if (!e.target.matches('.item')) { return; }
    e.preventDefault();

    isHandling = false;
    shuttle.style.display = 'none';

    if (e.x > document.body.clientWidth - colLast.clientWidth && x0 < colFirst.clientWidth) {
        colFirst.removeChild(card);
        ( e.relatedTarget === null ) ? colLast.appendChild(card) : colLast.insertBefore(card, e.relatedTarget);
    }
    if (e.x < colFirst.clientWidth && x0 > document.body.clientWidth - colLast.clientWidth) {
        colLast.removeChild(card);
        ( e.relatedTarget === null ) ? colFirst.appendChild(card) : colFirst.insertBefore(card, e.relatedTarget);
    }
    
    card.style.opacity = 1;

    shuttle.removeEventListener('mouseup', up);
    shuttle.removeEventListener('mouseleave', up);
    console.log(e);
}

function move(e) {
    if (!isHandling) { return; }
    e.preventDefault();
    
    x += e.movementX; y += e.movementY;
    shuttle.style.transform = `translate(${x}px, ${y}px) rotate(15deg)`;
}*/
})();