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
const btnRainbow = document.querySelector("#rainbow");
const btnBucket = document.querySelector("#bucket");
const btnBomb = document.querySelector("#bomb");


const lblSlider = document.querySelector("#lblSlider");
const gridSlider = document.querySelector("#gridSlider");
const colorPicker = document.querySelector("#colorPicker");

let currentColor = colorPicker.value;

console.log(colorPicker);

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
    gridItems.forEach((e) => {
        grid.removeChild(e);
    })
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
    Pencil.setRainbowMode = true;
});

btnBucket.addEventListener('click', (e) => {
    deactivateButtons();
    btnBucket.classList.toggle('active');
    Pencil.setBucketMode = true;
});

btnBomb.addEventListener('click', (e) => {
    deactivateButtons();
    btnBomb.classList.toggle('active');
    Pencil.setBombMode = true;
});

function deactivateButtons() {
    document.querySelectorAll(".btnSettings, .btnToy").forEach((e) => e.classList.remove('active'));
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
    for(let x = 0; x < gridSize; x++){
        let itemSize = (1/gridSize) * 100; 
        for(let y = 0; y < gridSize; y++) {
            let item_id = `${x}${y}`;
            const item = document.createElement('div');
            item.classList.add('gridItem');
            item.style.width = `${itemSize}%`;
            item.style.height = `${itemSize}%`;
            item.addEventListener("mousedown", handleInput);
            item.addEventListener("mouseover", handleInput);
            grid.appendChild(item);
            gridItems.push(item);
        }
    }
}

function draw(gridItem, rainbowMode) {
    if(rainbowMode) {
        let randomColor = Math.floor(Math.random()*16777215).toString(16);
        gridItem.style.backgroundColor = `#${randomColor}`;
        console.log(randomColor);
    } else {
        gridItem.style.backgroundColor = currentColor;
    }
}

function erase(gridItem) {
    gridItem.style.backgroundColor = defaultColor;
}

function bucket(gridItem) {

}

function bomb(gridItem) {

}

function handleInput(e) {
    if(e.type === 'mouseover' && !mouseDown) {return;}
    switch(true) {
        case Pencil.getDrawMode:
            draw(this, false);
            console.log("in draw mode");
            break;
        case Pencil.getEraseMode:
            erase(this)
            console.log("in erase mode");
            break;
        case Pencil.getRainbowMode:
            draw(this, true);
            console.log("in rainbow mode");
            break;
        case Pencil.getBucketMode:
            console.log("in bucket mode");
            break;
        case Pencil.getBombMode:
            console.log("in bomb mode");
            break;
        default:
            console.log("unga bunga you gucked it up.");
    }    
}



//function to draw (event listener)

//function to erase

generateGridItems();

