  // Get the canvas element
  let tool="pen";
  const colorInput=document.getElementById("colorInput");
  const canvasContainer=document.getElementById("canvas-container");
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');
  colorInput.value="#565348";
  //canvasContainer.addEventListener("mousemove");
  // Flag to track if mouse button is pressed
  let isDrawing = false;
  let Resolution={x:32,y:32,count:10};
  
  canvas.width=Resolution.x*Resolution.count;
  canvas.height=Resolution.y*Resolution.count;
  // Function to handle pixel editing
  function updatePixel(x, y, color) {
   const snapX=x*Resolution.x;
   const snapY=y*Resolution.y;
    ctx.fillStyle = color;
    if(tool=="pen"){
        ctx.fillRect(snapX, snapY, Resolution.x, Resolution.y);
    }
    else{
      ctx.clearRect(snapX, snapY, Resolution.x, Resolution.y);
    }
  }

  // Event listeners for mouse actions
  canvas.addEventListener('mousedown', startDrawing);
  canvas.addEventListener('mousemove', drawPixel);
  canvas.addEventListener('mouseup', stopDrawing);
  canvas.addEventListener('mouseleave', stopDrawing);

  // Function to start drawing
  function startDrawing(e) {
    isDrawing = true;
    drawPixel(e);
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
     updatePixel(tileX, tileY, colorInput.value);
  }
  
      // Function to stop drawing
      function stopDrawing() {
          isDrawing = false;
      }