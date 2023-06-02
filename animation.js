let play=false;
let animInterval;
let timegap=1000;

const PreviewCanvas=document.getElementById("preview-canvas");
const timeInput=document.getElementById("preview-canvas-time-input");
const previewCtx=PreviewCanvas.getContext("2d");
let PreviewCanvasWidth=PreviewCanvas.width;
let PreviewCanvasHeight=PreviewCanvas.height;

indexInput.value=0;

function toggleAnim(){
    play=!play
  if(play){
     animInterval=setInterval(NextImage,timegap);
  }
  else{
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
    const pCanvas=bottomBoximages[+indexInput.value];
   // console.log(pCanvas,indexInput.value);
    previewCtx.drawImage(pCanvas,0,0,pCanvas.width,pCanvas.height,0,0,PreviewCanvasWidth,PreviewCanvasHeight);
    indexInput.value=(+indexInput.value+1)%bottomBoximages.length;
}