let fileIndex=0;
let FilesContainer=document.getElementById("bottom-files");
let currentCanvas=null;


    function addFile(e){
        const im=document.createElement("canvas");
        const imctx=im.getContext("2d");
        im.width=100;
        im.height=100;
        if(!files[fileIndex]){
           files.push(Array.from({length:maxLayerCount} ,()=> Array.from({length:Resolution.count},()=>Array(Resolution.count).fill("none"))));
        }
        imctx.drawImage(canvas,0,0,canvas.width,canvas.height,0,0,im.width,im.height);
        imctx.clearRect(0,0,im.width,im.height);
        im.setAttribute("data-index",fileIndex);
        im.classList.add("files");
        FilesContainer.appendChild(im);
        im.addEventListener("click",selectFile);
        bottomBoximages.push(im);
        if(fileIndex==0){
            currentCanvas=im;
        }
        else{
          selectFileWithIndex(fileIndex);
        }
        indexInput.max= fileIndex;        
        fileIndex++;
    }
function highlightFile(){
  // if(canvases[currentFile].classList.containers) 
   bottomBoximages.forEach(sFile=>sFile.classList.remove("selected"));
   bottomBoximages[currentFile].classList.add("selected");
}
// imge.crossOrigin = "Anonymous";
// let files=document.querySelectorAll("files");   

function selectFile(e){
    if(currentCanvas!=e.target){
        ctx.clearRect(0,0,canvas.clientWidth,canvas.height); 
        
        currentFile= e.target.getAttribute("data-index");
        currentCanvas=e.target;
        currentlayer=0;
        highlightFile();        
        initLayers();
        render();
        updateFileCanvases();
  }
}

function selectFileWithIndex(no){
  
      ctx.clearRect(0,0,canvas.clientWidth,canvas.height); 
      
      currentFile= no;
      currentCanvas=bottomBoximages[no];
      currentlayer=0;
      highlightFile();        
      initLayers();
      render();
      updateFileCanvases();
}


function duplicateFile(e){
  const clonedcanv=  bottomBoximages[currentFile].cloneNode(true);
  const clonedCtx=clonedcanv.getContext("2d");
  if(!files[fileIndex]){
    files.push(Array.from({length:maxLayerCount} ,()=> Array.from({length:Resolution.count},()=>Array(Resolution.count).fill("none"))));
 }
 files[fileIndex]=JSON.parse(JSON.stringify(files[currentFile]));
 const n= bottomBoximages[currentFile].getAttribute("data-layercount");
 bottomBoximages[currentFile].setAttribute("data-layercount",n);
 clonedCtx.drawImage(canvas,0,0,canvas.width,canvas.height,0,0,clonedcanv.width,clonedcanv.height);
 clonedCtx.clearRect(0,0,clonedcanv.width,clonedcanv.height);
 clonedcanv.setAttribute("data-index",fileIndex);
 clonedcanv.classList.add("files");
 FilesContainer.appendChild(clonedcanv);
 clonedcanv.addEventListener("click",selectFile);
 bottomBoximages.push(clonedcanv);
 if(fileIndex==0){
     currentCanvas=clonedcanv;
 }else{
   selectFileWithIndex(fileIndex); 
 }
 indexInput.max=fileIndex;
 fileIndex++;
}

function updateFileCanvases(){
    if(!currentCanvas)return;
  const ct=currentCanvas.getContext("2d");
  ct.clearRect(0,0,currentCanvas.width,currentCanvas.height);
  ct.drawImage(lastlayerCanvas,0,0,lastlayerCanvas.width,lastlayerCanvas.height,0,0,currentCanvas.width,currentCanvas.height);
}