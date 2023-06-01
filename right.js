const LayerContainer=document.getElementById("layers");

function initFiles(fileslength,layerslength){
    files=Array.from({length:fileslength},()=>Array.from({length:layerslength},()=>Array.from({length:Resolution.count},()=>Array(Resolution.count).fill("none"))
    ));
    console.log(files);
}
let layerCount=0;
let canvases=[];
let layerCanvases=[];
let layerCanvasctxes=[];
let lastlayerCanvas=null;

function initLayers(){
    LayerContainer.innerHTML="";
    layerCount=0;
    layerCanvasctxes=[];
    layerCanvases=[];
    const n= canvases[currentFile].getAttribute("data-count");
    for(let i=0;i<=n;i++){
        addLayer();
        // console.log(canvases[currentFile]);
    }
    selectLayer();
}
 
function addLayer(){
    const la=document.createElement("div");
    const im=document.createElement("canvas");
    const imctx=im.getContext("2d");
    la.appendChild(im);
    im.width=100;
    im.height=100;
   la.width=150;
   la.height=150;
    // imctx.drawImage(canvas,0,0,canvas.width,canvas.height,0,0,im.width,im.height);
    // imctx.clearRect(0,0,im.width,im.height);
    la.setAttribute("data-index",layerCount);
    canvases[currentFile].setAttribute("data-count",layerCount);
    la.classList.add("layer");
    LayerContainer.appendChild(la);
    la.addEventListener("click",layerClicked);
    layerCanvasctxes.push(imctx);
    layerCanvases.push(la);
    // if(fileIndex==0){
    //     currentCanvas=im;
    // }
    // fileIndex++;
    lastlayerCanvas=im;
    layerCount++;
    updateLayers();
    //console.log(currentCanvas);
}

function updateLayers(){
   for(let i=0;i<layerCanvasctxes.length;i++){
    layerCanvasctxes[i].clearRect(0,0,100,100);
    for(let j=0;j<=i;j++){
        for(let x=0;x<Resolution.count;x++){
            for(let y=0;y<Resolution.count;y++){
                const colr= files[currentFile][j][x][y];
                layerCanvasctxes[i].fillStyle=colr;
                if(colr!="none"){
                    const snapX=x*10;
                    const snapY=y*10;
                    layerCanvasctxes[i].fillRect(snapX, snapY, 10, 10);
                } 
                else if(colr=="none"&& j==0){
                    const snapX=x*10;
                    const snapY=y*10;
                    layerCanvasctxes[i].clearRect(snapX,snapY, 10,10);
                }
            }
        }
    }
   }
}

function selectLayer(){
     layerCanvases.forEach(sFile=>sFile.classList.remove("selected"));
     console.log(currentlayer);
     layerCanvases[currentlayer].classList.add("selected");
}

function layerClicked(e){
    const n=e.target.getAttribute("data-index");
    if(currentlayer!=n){
        ctx.clearRect(0,0,canvas.clientWidth,canvas.height); 
        currentlayer=n;
        selectLayer();
        render();
   }
}