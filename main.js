const guide=document.getElementById("guide");
const canvas=document.getElementById("canvas");
const shortcutBox=document.getElementById("shortcutBox");
const colorInput=document.getElementById("colorInput");
const ctx=canvas.getContext("2d");
let columns=5;
let rows=5;
let TILE_SIZE=32;
canvas.width=columns*TILE_SIZE;
canvas.width=rows*TILE_SIZE;
console.log(canvas.width+","+canvas.height);
canvas.addEventListener("click",handleMouseClick);
// init();
// init();
function fillRect(){
  
}
function onMouseDragStart(event){
    isDragging=true;
    //handleMouseClick(event);
    }
    
    function onMouseDragStop(){
        isDragging=false;
    }
    let lastY;
    let lastX;
    function onMouseDrag(event){
        if(!isDragging)return;
        rect=canvas.getBoundingClientRect();
        const mouseX=event.clientX-rect.left;
        const mouseY=event.clientY-rect.top-shortcutBox.bottom;
        
        const tileX=Math.floor(mouseX/TILE_SIZE);
        const tileY=Math.floor(mouseY/TILE_SIZE);
        

        ctx.fillStyle=colorInput.value;
        ctx.fillRect(tileX,tileY,TILE_SIZE,TILE_SIZE);
        // if(tileX===lastX&&tileY===lastY)
        // return;
        // lastX=tileX;
        // lastY=tileY;
        // if(selectedImg){
        //     tilemap[tileY][tileX]=selectedImg.index; 
        // }
    
       // handleTileSelection(tileX,tileY);
       // redrawTileMap();
      
    }
    
    function handleMouseClick(event){
        
        rect=canvas.getBoundingClientRect();
        const mouseX=event.clientX-rect.left;
        const mouseY=event.clientY-rect.top;
        
        const tileX=Math.floor(mouseX/TILE_SIZE);
        const tileY=Math.floor(mouseY/TILE_SIZE);

        ctx.fillStyle=colorInput.value;
        ctx.fillRect(tileX,tileY,TILE_SIZE,TILE_SIZE);
        // if(selectedImg){
        //     tilemap[tileY][tileX]=selectedImg.index; 
        // }
    
        // handleTileSelection(tileX,tileY);
        // redrawTileMap();
    }
function init(){
    colorInput.value="#007890"
    
    ctx.fillStyle="#ffffff";
    ctx.fillRect(0,0,canvas.clientWidth,canvas.height);

    
       // guide.clientLeft=canvas.clientLeft;
        guide.style.width="${canvas.width}px";
        guide.style.height="${canvas.height}px";
        guide.style.gridTemplateColumns= 'repeat(${columns}, 1fr)';
        guide.style.gridTemplateRows= 'repeat(${rows}, 1fr)';

        [...Array(columns*rows)].forEach(()=>guide.insertAdjacentHTML("beforeend","<div>1</div>"));
        //guide.style.gr
}