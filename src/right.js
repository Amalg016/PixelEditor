const LayerContainer=document.getElementById("layers");

function initFiles(fileslength,layerslength){
    files=Array.from({length:fileslength},()=>Array.from({length:layerslength},()=>Array.from({length:Resolution.count},()=>Array(Resolution.count).fill("none"))
    ));
    console.log(files);
}

let layerCount=0;
let bottomBoximages=[];
let LayerCanvases=[];

let layerboxes=[];
let layerCanvasctxes=[];
let lastlayerCanvas=null;

function initLayers(){
    LayerContainer.innerHTML="";
    layerCount=0;
    layerCanvasctxes=[];
    layerboxes=[];
    const n= bottomBoximages[currentFile].getAttribute("data-layercount");
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
   //console.log(Array.from({length:Resolution.count},()=>Array(Resolution.count).fill("none")));
    // imctx.drawImage(canvas,0,0,canvas.width,canvas.height,0,0,im.width,im.height);
    // imctx.clearRect(0,0,im.width,im.height);
    if(!files[currentFile][layerCount]){
      files[currentFile].push(Array.from({length:Resolution.count},()=>Array(Resolution.count).fill("none")));
      if(layerCount!=0){
          files[currentFile][layerCount]=JSON.parse(JSON.stringify(files[currentFile][layerCount-1]));   
      }
    }
    la.setAttribute("data-index",layerCount);
    bottomBoximages[currentFile].setAttribute("data-layercount",layerCount);
    la.classList.add("layer");
    LayerContainer.appendChild(la);
    la.addEventListener("click",layerClicked);
    layerCanvasctxes.push(imctx);
    layerboxes.push(la);
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
    // for(let j=0;j<=i;j++){
        for(let x=0;x<Resolution.count;x++){
            for(let y=0;y<Resolution.count;y++){
                const colr= files[currentFile][i][x][y];
                layerCanvasctxes[i].fillStyle=colr;
                if(colr!="none"){
                    const snapX=x*(100/Resolution.count);
                    const snapY=y*(100/Resolution.count);
                    layerCanvasctxes[i].fillRect(snapX, snapY,(100/Resolution.count), (100/Resolution.count));
                } 
                // else if(colr=="none"&& j==0){
                else if(colr=="none"){
                    const snapX=x*(100/Resolution.count);
                    const snapY=y*(100/Resolution.count);
                    layerCanvasctxes[i].clearRect(snapX,snapY,(100/Resolution.count),(100/Resolution.count));
                }
            }
        }
    }
//    }
}

function selectLayer(){
     layerboxes.forEach(sFile=>sFile.classList.remove("selected"));
    //  console.log(currentlayer);
     layerboxes[currentlayer].classList.add("selected");
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