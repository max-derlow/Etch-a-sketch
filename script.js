const defaultColor = "white";

let gridSize = 25;
let gridItems = []; //todo change to dict.
let mouseDown = false;
let eraseMode = false;

let Pencil = {
    
    drawMode:true,
    eraseMode:false,
    rainbowMode:false,
    bucketMode:false,
    bombMode:false,
    
    get print(){
        return [
        {drawMode: this.drawMode}, 
        {eraseMode: this.eraseMode}, 
        {rainbowMode: this.rainbowMode}, 
        {bucketMode: this.bucketMode}, 
        {bombMode: this.bombMode}];
    },

    resetAttributes: function(){
        this.drawMode = false;
        this.eraseMode = false;
        this.rainbowMode = false;
        this.bucketMode = false;
        this.bombMode = false;
    },

    get getDrawMode() {
        return this.drawMode;
    },
    set setDrawMode(boolean){
        this.drawMode = boolean;
    },

    get getEraseMode() {
        return this.eraseMode;
    },
    set setEraseMode(boolean){
        this.eraseMode = boolean;
    },

    get getRainbowMode() {
        return this.rainbowMode;
    },
    set setRainbowMode(boolean){
        this.rainbowMode = boolean;
    },

    get getBucketMode() {
        return this.bucketMode;
    },
    set setBucketMode(boolean){
        this.bucketMode = boolean;
    },

    get getBombMode() {
        return this.bombMode;
    },
    set setBombMode(boolean){
        this.bombMode = boolean;
    }
};

const grid = document.querySelector("#grid");
const btnDraw = document.querySelector("#pencil");
const btnEraser = document.querySelector("#eraser");
const btnSave = document.querySelector("#save");
const btnClear = document.querySelector("#clear");
const btnRainbow = document.querySelector("#btnRainbow");
const btnBucket = document.querySelector("#btnBucket");
const btnBomb = document.querySelector("#btnBomb");
const imgRainbow = document.querySelector("#imgRainbow");
const imgBucket = document.querySelector("#imgBucket");
const imgBomb = document.querySelector("#imgBomb");

const lblSlider = document.querySelector("#lblSlider");
const gridSlider = document.querySelector("#gridSlider");
const colorPicker = document.querySelector("#colorPicker");

let currentColor = colorPicker.value;


//functions
function saveAs(uri, filename) {

    var link = document.createElement('a');

    if (typeof link.download === 'string') {

        link.href = uri;
        link.download = filename;

        //Firefox requires the link to be in the body
        document.body.appendChild(link);

        //simulate click
        link.click();

        //remove the link when done
        document.body.removeChild(link);

    } else {

        window.open(uri);

    }
}

function clearGrid() {
    document.querySelectorAll(".gridItem").forEach((e) => {
        e.remove();
    });
/*
    gridItems.forEach((e) => {
        grid.removeChild(e);
    })
    */
    gridItems = [];
    generateGridItems();

}

//set listeners
gridSlider.addEventListener('input', () => {
    lblSlider.textContent = `${gridSlider.value} x ${gridSlider.value}`;
})

colorPicker.addEventListener('change', ((e) => {
    currentColor = colorPicker.value;
}))

gridSlider.addEventListener('change', () => {
    console.log("test");
    gridSize = gridSlider.value;
    clearGrid();
})

//preview before save

//Button listeners 
btnDraw.addEventListener('click', () => {
    deactivateButtons();
    Pencil.setDrawMode = true;
    btnDraw.classList.toggle('active');
});

btnEraser.addEventListener('click', (e) => {
    deactivateButtons();
    Pencil.setEraseMode = true;
    btnEraser.classList.toggle('active');
});

btnSave.addEventListener("click", function() {
    html2canvas(document.querySelector('#grid')).then(function(canvas) {
        document.body.appendChild(canvas);
        console.log(canvas);
        //saveAs(canvas.toDataURL(), 'file-name.png');
    });
});

btnClear.addEventListener('click', clearGrid);

btnRainbow.addEventListener('click', (e) => {
    deactivateButtons();
    btnRainbow.classList.toggle('active');
    imgRainbow.classList.toggle('invert');
    Pencil.setRainbowMode = true;
});

btnBucket.addEventListener('click', (e) => {
    deactivateButtons();
    btnBucket.classList.toggle('active');
    imgBucket.classList.toggle('invert');
    Pencil.setBucketMode = true;
});

btnBomb.addEventListener('click', (e) => {
    deactivateButtons();
    btnBomb.classList.toggle('active');
    imgBomb.classList.toggle('invert');
    Pencil.setBombMode = true;
});

function deactivateButtons() {
    document.querySelectorAll(".btnSettings, .btnToy").forEach((e) => e.classList.remove('active'));
    document.querySelectorAll(".btnIcon").forEach((e) => e.classList.remove('invert'));
    Pencil.resetAttributes();
}



function mouseDowner(){
    mouseDown = true;
}

window.addEventListener("mousedown", () => {
    mouseDown = true;
})

window.addEventListener("mouseup", () => {
    mouseDown = false;
})



function generateGridItems() {
    for(let y = 0; y < gridSize; y++){
        let itemSize = (1/gridSize) * 100; 
        for(let x = 0; x < gridSize; x++) {
            let item_id = `${(y*gridSize)+x}`;
            const item = document.createElement('div');
            item.classList.add('gridItem');
            item.setAttribute('id', item_id);
            //console.log(item);
            item.style.width = `${itemSize}%`;
            item.style.height = `${itemSize}%`;
            item.addEventListener("mousedown", handleInput);
            item.addEventListener("mouseover", handleInput);
            grid.appendChild(item);
            gridItems.push({x:x, y:y, id:item_id});
        }
    }
}

function draw(itemIndex, rainbowMode) {
    gridItem = document.querySelector(`[id='${itemIndex}']`)
    if(rainbowMode) {
        let randomColor = Math.floor(Math.random()*16777215).toString(16);
        gridItem.style.backgroundColor = `#${randomColor}`;
    } else {
        gridItem.style.backgroundColor = currentColor;
    }
}

function erase(itemIndex) {
    gridItem = document.querySelector(`[id='${itemIndex}']`)
    gridItem.style.backgroundColor = defaultColor;
}

function checkIfSameColor(knownItemIndex, unknownItemIndex){
    knownItemIndex = parseInt(knownItemIndex);
    unknownItemIndex = parseInt(unknownItemIndex);

    console.log(knownItemIndex);
    console.log(unknownItemIndex);
    const knownColor = document.querySelector(`[id='${knownItemIndex}']`).style.backgroundColor;
    console.log("known color:" + knownColor);
    const unknownColor = document.querySelector(`[id='${unknownItemIndex}']`).style.backgroundColor;
    console.log("unknown color:" + unknownColor);

    //draw(knownItemIndex, false);

    if(knownColor === unknownColor) {
        return true;
    } else {
        return false;
    }
}

function findAdjacentsToPaint(itemIndex){
    //console.log("checked indexes:");
    //console.log(checkedIndexes);
    itemIndex = parseInt(itemIndex);
    gridSize = parseInt(gridSize);
    console.log(itemIndex)
    console.log(typeof(itemIndex))
    let adjacentsInfo = {};
    let leftIndex;
    let rightIndex; 
    let topIndex;
    let botIndex;
    let itemX = gridItems[itemIndex].x;
    let itemY = gridItems[itemIndex].y;

    if(itemX - 1 >= 0){
        leftIndex = itemIndex - 1;
        Object.assign(adjacentsInfo, {[leftIndex]: checkIfSameColor(itemIndex, leftIndex)});
    }

    if(itemX + 1 < gridSize){
        rightIndex = itemIndex + 1;
        Object.assign(adjacentsInfo, {[rightIndex]: checkIfSameColor(itemIndex, rightIndex)});
    }

    if(itemY - 1 >= 0){
        topIndex = itemIndex - gridSize;
        Object.assign(adjacentsInfo, {[topIndex]: checkIfSameColor(itemIndex, topIndex)});
    }

    if(itemY + 1 < gridSize){
        botIndex = itemIndex + gridSize;
        Object.assign(adjacentsInfo, {[botIndex]: checkIfSameColor(itemIndex, botIndex)});
    }
    //console.log(adjacentsInfo)
    return adjacentsInfo;
}

/*
    indexesToCheck.push(itemIndex);
    indexesToCheck.push(itemIndex+1);
    console.log("pushing to array");
    console.log(indexesToCheck);*/

function bucket(itemIndex) {
    let checkedIndexes = [];
    let indexesToCheck = [];
    let indexesToPaint = [];
    let itemX = gridItems[itemIndex].x;
    let itemY = gridItems[itemIndex].y;
    let compareIndex;

    indexesToCheck.push(itemIndex);
    indexesToPaint.push(itemIndex);

    let i = 0;
    while(indexesToCheck.length > 0) {
        let index = indexesToCheck[0];

        if(checkedIndexes.includes(index)){
            indexesToCheck.shift();
            console.log("removing value" + i)
            continue;
        } else {
            checkedIndexes.push(index)
            indexesToCheck.shift();
        } 

        console.log("Sending: " + index)
        let adjacentsInfo = findAdjacentsToPaint(index);
        console.log(adjacentsInfo);

        Object.keys(adjacentsInfo).forEach((adjIndex) => {
            console.log("Hero")
            console.log(adjacentsInfo)
            console.log(!checkedIndexes.includes(adjIndex))

            if(adjacentsInfo[adjIndex] && !checkedIndexes.includes(adjIndex)) {
                indexesToPaint.push(adjIndex);
                indexesToCheck.push(adjIndex);
            } else {
                checkedIndexes.push(adjIndex);
            }
        })
    }
    indexesToPaint.forEach((index) => draw(parseInt(index), false))
}


function bomb(gridItem) {

}

function handleInput(e) {
    if(e.type === 'mouseover' && !mouseDown) {return;}
    switch(true) {
        case Pencil.getDrawMode:
            draw(this.id, false);
            //console.log("in draw mode");
            break;
        case Pencil.getEraseMode:
            erase(this.id, false)
            //console.log("in erase mode");
            break;
        case Pencil.getRainbowMode:
            draw(this.id, true);
            //console.log("in rainbow mode");
            break;
        case Pencil.getBucketMode:
            bucket(this.id)
            //console.log("in bucket mode");
            break;
        case Pencil.getBombMode:
            //console.log("in bomb mode");
            break;
        default:
            //console.log("unga bunga you gucked it up.");
    }    
}

generateGridItems();
