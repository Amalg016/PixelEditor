  // Get the canvas element
  let activeTool="pen";
  const colorInput=document.getElementById("colorInput");
  const canvasContainer=document.getElementById("canvas-container");
  const toolbar = document.getElementById('toolbox');
  const indexInput=document.getElementById("timeline");
  const tools=document.querySelectorAll(".tool");
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  colorInput.value="#000000";
 
  let colorMap=[];
  let files=[];
  let Resolution={x:32,y:32,count:10};
  let currentFile=0;
  let currentlayer=0;
  
let maxFileCount=1;
let maxLayerCount=1;

  initFiles(maxFileCount,maxLayerCount);
  addFile();
  addLayer();
  highlightFile();
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
            for(let i=+currentlayer+1;i<layerCount;i++){
              console.log(i);
               console.log(files[currentFile]);
               console.log(files[currentFile][i][x][y],files[currentFile][i]);
              if(files[currentFile][+i][x][y]=="none"){
                files[currentFile][+i][x][y]=color;
              }
            }
            render();       
            break;
        case "eraser":
           // ctx.clearRect(snapX, snapY, Resolution.x, Resolution.y);
           files[currentFile][currentlayer][x][y]="none";  
           render();
            break;
        case "filler":
          
          if(canFill){
            canFill=false;
            const targetCol=files[currentFile][currentlayer][x][y];
            if(targetCol==color)break;
            floodfill(x,y,targetCol,color);
            while(stack.length>0){
              const[ex,ey]=stack.pop();
              for(let i=+currentlayer+1;i<layerCount;i++){
                if(files[currentFile][i][ex][ey]=="none"){
                  files[currentFile][i][ex][ey]=color;
                }
              }
            }
            
            render();
          }
           // exportSpritesheet();
           break;
    }
    updateLayers();
    updateFileCanvases();
  }
let stack=[];
let canFill=true;

function floodfill(startX,startY,targetCol,fillcolor){
   const pixelStck=[[startX,startY]];

   while(pixelStck.length>0){
    const[x,y]=pixelStck.pop();
    console.log(x,y);
    console.log(targetCol);
    if(x>=0&&x<Resolution.count&&y>=0&&y<Resolution.count) {
      if(files[currentFile][currentlayer][x][y]==targetCol){
        files[currentFile][currentlayer][x][y]=fillcolor;
        stack.push([x,y]);
        pixelStck.push([x+1,y])
        pixelStck.push([x-1,y])
        pixelStck.push([x,y+1])
        pixelStck.push([x,y-1])
      }
    }
   }
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
    // for(let i=0;i<=currentlayer;i++){
        for(let x=0;x<Resolution.count;x++){
         for(let y=0;y<Resolution.count;y++){
            const colr= files[currentFile][currentlayer][x][y];
            ctx.fillStyle=colr;
            if(colr!="none"){
                const snapX=x*Resolution.x;
                const snapY=y*Resolution.y;
                ctx.fillRect(snapX, snapY, Resolution.x, Resolution.y);
            } 
            // else if(colr=="none"&&i==0){
            else if(colr=="none"){
                const snapX=x*Resolution.x;
                const snapY=y*Resolution.y;
                ctx.clearRect(snapX,snapY, Resolution.x, Resolution.y);
            }
         }
        }
      // }
    }
    let candowload=true;

    function exportSpritesheet(){
      if(!candowload)return;
      candowload=false;
      
          //  event.target.disabled=true;
      // Determine the width and height of each thumbnail canvas
        const thumbnailWidth = 100; // Adjust this value based on your thumbnail size
        const thumbnailHeight = 100; // Adjust this value based on your thumbnail size
        const gap=10;
        // Calculate the number of rows and columns needed for the spritesheet
        const numCols = Math.min(bottomBoximages.length, 5); // Adjust the maximum number of columns as needed
        const numRows = Math.ceil(bottomBoximages.length / numCols);
        
        // Create a canvas for the spritesheet
        const spritesheetCanvas = document.createElement('canvas');
        spritesheetCanvas.width = numCols * thumbnailWidth+(numCols-1)*gap;
        spritesheetCanvas.height = numRows * thumbnailHeight+(numRows-1)*gap;
        const imctx = spritesheetCanvas.getContext('2d');
      
        
        // Iterate through the thumbnail canvases and draw them onto the spritesheet
        bottomBoximages.forEach((thumbnailCanvas, index) => {
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
        const fileName=  "spriteheet.png";  
        const downloadlink=document.createElement("a");
            downloadlink.href=dataURL;
            downloadlink.download=fileName;
        

            var progressElement = document.createElement('div');
            progressElement.classList.add('progress-popup');
            progressElement.innerHTML = `
              <div class="progress-bar"></div>
              <span class="progress-text">0%</span>
            `;
      
            // Append the progress element to the document body
            document.body.appendChild(progressElement);
      
            // Show the progress element
            progressElement.style.display = 'block';
      
            // Create a new XMLHttpRequest to track the download progress
            var xhr = new XMLHttpRequest();
            xhr.open('GET', downloadlink.href, true);
            xhr.responseType = 'blob';
            var bob;
            // Track the progress using the onprogress event
            xhr.onprogress = function(e) {
              if (e.lengthComputable) {
                var percent = Math.floor((e.loaded / e.total) * 100);
                var progressBar = progressElement.querySelector('.progress-bar');
                var progressText = progressElement.querySelector('.progress-text');
                progressBar.style.width = percent + '%';
                progressText.innerText = percent + '%';
              }
            };
      
            // When the download is complete
            xhr.onload = function() {
              if (xhr.status === 200) {
                blob = new Blob([this.response]);     
              }
            };
            xhr.onloadend = function(e){
              var tempEl = document.createElement("a");
              document.body.appendChild(tempEl);
              tempEl.style = "display: none";
             const url = window.URL.createObjectURL(blob);
              tempEl.href = url;
              tempEl.download = fileName;
              tempEl.click();
              window.URL.revokeObjectURL(url);
               // Remove the progress element from the document body
               document.body.removeChild(progressElement);
               candowload=true;
          }
      
            // Start the download
            xhr.send();

    }
      // Function to stop drawing
    function stopDrawing() {
         isDrawing = false;
         canFill=true;
    }