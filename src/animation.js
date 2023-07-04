let play=false;
let animInterval;
let timegap=1000;

const PreviewCanvas=document.getElementById("preview-canvas");
const timeInput=document.getElementById("preview-canvas-time-input");
const previewCtx=PreviewCanvas.getContext("2d");
let PreviewCanvasWidth=PreviewCanvas.width;
let PreviewCanvasHeight=PreviewCanvas.height;

indexInput.value=0;

function toggleAnim(e){
    play=!play
  if(play){
    e.target.classList.remove("unselected");
     animInterval=setInterval(NextImage,timegap);
  }
  else{
    e.target.classList.add("unselected");
    clearInterval(animInterval);
    animInterval=null;
  }
  
}
// function changeIndex(e){
//     timeInput.value;
// }

function changeTimeInterval(e){
    timegap = timeInput.value*1000;
    if(animInterval){
        clearInterval(animInterval); 
        animInterval=null;
    }
    
    if(play){
        animInterval=setInterval(NextImage,timegap);
    }
}

function changeSlidermaxValue(n){
    indexInput.max=n;
}

function NextImage(){
    previewCtx.clearRect(0,0,PreviewCanvasWidth,PreviewCanvasHeight);
    // const pCanvas=bottomBoximages[+indexInput.value];
   // console.log(pCanvas,indexInput.value);
   for(let x=0;x<Resolution.count;x++){
    for(let y=0;y<Resolution.count;y++){
       const colr= files[+indexInput.value][files[+indexInput.value].length-1][x][y];
       ctx.fillStyle=colr;
       if(colr!="none"){
           const snapX=x*PreviewCanvasWidth/Resolution.count;
           const snapY=y* PreviewCanvasHeight/Resolution.count;
           previewCtx.fillRect(snapX, snapY, PreviewCanvasWidth/Resolution.count, PreviewCanvasHeight/Resolution.count);
       } 
       // else if(colr=="none"&&i==0){
       else if(colr=="none"){
           const snapX=x*PreviewCanvasWidth/Resolution.count;
           const snapY=y*PreviewCanvasHeight/Resolution.count;
           previewCtx.clearRect(snapX,snapY, PreviewCanvasWidth/Resolution.count,PreviewCanvasHeight/Resolution.count);
       }
    }
   }
    // previewCtx.drawImage(pCanvas,0,0,pCanvas.width,pCanvas.height,0,0,PreviewCanvasWidth,PreviewCanvasHeight);
    indexInput.value=(+indexInput.value+1)%bottomBoximages.length;
}