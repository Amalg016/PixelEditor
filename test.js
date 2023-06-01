  // Get the canvas element
  let activeTool="pen";
  const colorInput=document.getElementById("colorInput");
  const canvasContainer=document.getElementById("canvas-container");
  const toolbar = document.getElementById('toolbox');
  const tools=document.querySelectorAll(".tool");
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  colorInput.value="black";
 
  let colorMap=[];
  let files=[];
  let Resolution={x:32,y:32,count:10};
  let currentFile=0;
  let currentlayer=0;
  
  initFiles(12,10);
  addFile();
  addLayer();
  selectFile();
  selectLayer();
  let isToolbarMoving = false;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let toolbarMinimized=false;
  toolbar.addEventListener('mousedown', startDragging);
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', stopDragging);
  
  function toggleToolboxSize(){
    toolbarMinimized=!toolbarMinimized;
    if(toolbarMinimized){
       tools.forEach(tools=>tools.display="none");
    }
    toolbar.classList.toggle("collapsed");
  }
  
  function startDragging(event) {
    isToolbarMoving = true;
    dragOffsetX = event.clientX - toolbar.offsetLeft;
    dragOffsetY = event.clientY - toolbar.offsetTop;
  }
  
  function drag(event) {
    if (!isToolbarMoving) return;
  
    const newPosX = event.clientX - dragOffsetX;
    const newPosY = event.clientY - dragOffsetY;
  
    toolbar.style.left = `${newPosX}px`;
    toolbar.style.top = `${newPosY}px`;
  }
  
  function stopDragging() {
    isToolbarMoving = false;
  }

  //canvasContainer.addEventListener("mousemove");
  // Flag to track if mouse button is pressed
  let isDrawing = false;
  let isTouching=false;  

  canvas.width=Resolution.x*Resolution.count;
  canvas.height=Resolution.y*Resolution.count;
  // Function to handle pixel editing
  function updatePixel(x, y, color) {
    if(x>=Resolution.count||x<0||y<0||y>=Resolution.count) return;
    // console.log(currentFile,currentlayer,x,y);
   const snapX=x*Resolution.x;
   const snapY=y*Resolution.y;
    switch(activeTool){
        case "pen":
          //  ctx.fillRect(snapX, snapY, Resolution.x, Resolution.y);
            files[currentFile][currentlayer][x][y]=color;    
            render();       
            break;
        case "eraser":
           // ctx.clearRect(snapX, snapY, Resolution.x, Resolution.y);
           files[currentFile][currentlayer][x][y]="none";  
           render();
            break;
        case "filler":
            for(let i=0;i<Resolution.count;i++){
                for(let j=0;j<Resolution.count;j++){
                    files[currentFile][currentlayer][i][j]=colorInput.value;
                }
            }
            render();
           // exportSpritesheet();
           break;
    }
    updateFileCanvases();
    updateLayers();
  }

//   ctx.fillStyle="red";
//   ctx.fillRect(0,0,100,100);

// for (let index = 0; index < ctx.getImageData(0,0,canvas.width,canvas.height); index+=4) {
//     console.log(index);
// }
  tools.forEach(tool=>{
    tool.addEventListener("click",()=>{
        tools.forEach(tool=>tool.classList.remove("active"));
        tool.classList.add("active");
        activeTool=tool.getAttribute("data-tool");
    });
  });


  // Event listeners for mouse actions
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', drawPixel);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);
  canvas.addEventListener('touchmove', drawPixelWithTouch);
  canvas.addEventListener('touchstart', startedtouching);
  canvas.addEventListener('touchend', stopTouching);

  // Function to start drawing
  function startDrawing(e) {
    isDrawing = true;
    drawPixel(e);
  }

  function startedtouching(e){
     isTouching=true;
     drawPixelWithTouch(e);
  }
  function stopTouching(){
    isTouching=false;
  }
  // Function to draw pixel on mousemove
  function drawPixel(e) {
      e.preventDefault();
    if (!isDrawing) return;
     const rect = canvas.getBoundingClientRect();
     const x = e.clientX - rect.left;
     const y = e.clientY - rect.top;
     const tileX=Math.floor(x/Resolution.x);
     const tileY=Math.floor(y/Resolution.y);
    switch (activeTool) {
        case "specialfiller":
            exportSpritesheet();
            break;
        default:
            updatePixel(tileX, tileY, colorInput.value);
            break;
    }
  }

  function drawPixelWithTouch(e) {
    e.preventDefault();
    if(!isTouching)return;
   const touchEvent=e.changedTouches[0];
   const rect = canvas.getBoundingClientRect();
   const x = touchEvent.clientX - rect.left;
   const y = touchEvent.clientY - rect.top;
   const tileX=Math.floor(x/Resolution.x);
   const tileY=Math.floor(y/Resolution.y);
   updatePixel(tileX, tileY, colorInput.value);
}

  function render(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    for(let i=0;i<=currentlayer;i++){
        for(let x=0;x<Resolution.count;x++){
         for(let y=0;y<Resolution.count;y++){
            const colr= files[currentFile][i][x][y];
            ctx.fillStyle=colr;
            if(colr!="none"){
                const snapX=x*Resolution.x;
                const snapY=y*Resolution.y;
                ctx.fillRect(snapX, snapY, Resolution.x, Resolution.y);
            } 
            else if(colr=="none"&& i==0){
                const snapX=x*Resolution.x;
                const snapY=y*Resolution.y;
                ctx.clearRect(snapX,snapY, Resolution.x, Resolution.y);
            }
         }
        }
      }
    }

    function exportSpritesheet(){
            // Determine the width and height of each thumbnail canvas
        const thumbnailWidth = 100; // Adjust this value based on your thumbnail size
        const thumbnailHeight = 100; // Adjust this value based on your thumbnail size
        const gap=10;
        // Calculate the number of rows and columns needed for the spritesheet
        const numCols = Math.min(canvases.length, 5); // Adjust the maximum number of columns as needed
        const numRows = Math.ceil(canvases.length / numCols);
        
        // Create a canvas for the spritesheet
        const spritesheetCanvas = document.createElement('canvas');
        spritesheetCanvas.width = numCols * thumbnailWidth+(numCols-1)*gap;
        spritesheetCanvas.height = numRows * thumbnailHeight+(numRows-1)*gap;
        const imctx = spritesheetCanvas.getContext('2d');
        
        // Iterate through the thumbnail canvases and draw them onto the spritesheet
        canvases.forEach((thumbnailCanvas, index) => {
        const col = index % numCols;
        const row = Math.floor(index / numCols);
        const x = col * (thumbnailWidth+gap);
        const y = row * (thumbnailHeight+gap);
        imctx.drawImage(thumbnailCanvas, 0, 0, thumbnailWidth, thumbnailHeight, x, y, thumbnailWidth, thumbnailHeight);
        });
        
        // Convert the spritesheet canvas to a data URL
        const dataURL = spritesheetCanvas.toDataURL('image/png');
        
        // You can now use the dataURL or save it as an image
        //console.log(dataURL); // Print the dataURL to the console
            const downloadlink=document.createElement("a");
            downloadlink.href=dataURL;
            downloadlink.download="spriteheet.png";
            downloadlink.click();  
    }

      // Function to stop drawing
    function stopDrawing() {
         isDrawing = false;
    }