let fileIndex=0;
let FilesContainer=document.getElementById("bottom-files");
let currentCanvas=null;


    function addFile(e){
        const im=document.createElement("canvas");
        const imctx=im.getContext("2d");
        im.width=100;
        im.height=100;
        imctx.drawImage(canvas,0,0,canvas.width,canvas.height,0,0,im.width,im.height);
        imctx.clearRect(0,0,im.width,im.height);
        im.setAttribute("data-index",fileIndex);
        im.classList.add("files");
        FilesContainer.appendChild(im);
        im.addEventListener("click",imgClicked);
        canvases.push(im);
        if(fileIndex==0){
            currentCanvas=im;
        }
        fileIndex++;
       // console.log(currentCanvas);
    }
function selectFile(){
  // if(canvases[currentFile].classList.containers) 
   canvases.forEach(sFile=>sFile.classList.remove("selected"));
   canvases[currentFile].classList.add("selected");
}
// imge.crossOrigin = "Anonymous";
// let files=document.querySelectorAll("files");   

function imgClicked(e){
    if(currentCanvas!=e.target){
        ctx.clearRect(0,0,canvas.clientWidth,canvas.height); 
        
        currentFile= e.target.getAttribute("data-index");
        currentCanvas=e.target;
        currentlayer=0;
        selectFile();        
        initLayers();
        render();
  }
}

function updateFileCanvases(){
    if(!currentCanvas)return;
  const ct=currentCanvas.getContext("2d");
  ct.clearRect(0,0,currentCanvas.width,currentCanvas.height);
  ct.drawImage(lastlayerCanvas,0,0,lastlayerCanvas.width,lastlayerCanvas.height,0,0,currentCanvas.width,currentCanvas.height);
}