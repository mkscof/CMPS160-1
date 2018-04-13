// ClickedPints.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'void main() {\n' +
  '  gl_Position = a_Position;\n' +
  '  gl_PointSize = 10.0;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE =
  'void main() {\n' +
  '  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n' +
  '}\n';

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  initVertexBuffers(gl);

  // // Get the storage location of a_Position
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }
  // Buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = function(ev){ click(ev, gl, canvas, a_Position); };
  //Register function (event handler) for updating mouse position when moved
  canvas.onmousemove = function(ev){ rubberband(ev, gl, canvas, a_Position); };
  //Change color of lines on right click mouse release
  //cbutton.addEventListener("click", colorChange(ev, gl, canvas, a_Position));

  var cbutton = document.getElementById("lineColor");
  cbutton.onclick = function(ev){ colorChange(ev, gl, canvas, a_Position); };

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = []; // The array for the position of a mouse press
var prevX;
var prevY;
var done = 0; //Boolean for ending rubberband
var color = 0;

function click(ev, gl, canvas, a_Position) {
  done = 0;
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect() ;

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  // Store the coordinates to g_points array
  g_points.push(x); 
  g_points.push(y);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_points.length / 2;
  var newArr = new Float32Array(g_points);
  
  // Pass the position of a point to a_Position variable
  gl.bufferData(gl.ARRAY_BUFFER, newArr, gl.STATIC_DRAW);

  // Draw
  gl.drawArrays(gl.POINTS, 0, len);
  gl.drawArrays(gl.LINE_STRIP, 0, len);

  if(ev.button == 2){
    done = 1;
    for(i = 0; i < g_points.length; i ++){
      console.log(g_points[i]);
    }
  }
}

function rubberband(ev, gl, canvas, a_Position){
  if(done){
      return;
  }
  var xPos = ev.clientX;
  var yPos = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  xPos = ((xPos - rect.left) - canvas.width/2)/(canvas.width/2);
  yPos = (canvas.height/2 - (yPos - rect.top))/(canvas.height/2);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  g_points.push(xPos);
  g_points.push(yPos);

  var len = g_points.length / 2;
  var newArr = new Float32Array(g_points);

  // Pass the position of a point to a_Position variable
  gl.bufferData(gl.ARRAY_BUFFER, newArr, gl.STATIC_DRAW);

  //Draw
  gl.vertexAttrib2f(a_Position, newArr[newArr.length - 2], newArr[newArr.length - 1], 0.0);
  gl.drawArrays(gl.POINTS, 0, len);
  gl.drawArrays(gl.LINE_STRIP, 0, len);

  g_points.pop();
  g_points.pop();
}

function colorChange(ev, gl, canvas, a_Position){
 /* if(color % 2 == 0){
    gl_FragColor = (1.0, 0.0, 1.0, 1.0);
    color++;
  }
  else{
    gl_FragColor = (1.0, 0.0, 0.0, 1.0);
    color--;
  }*/
  VSHADER_SOURCE =
    'attribute vec4 a_Position;\n' +
    'void main() {\n' +
    '  gl_Position = a_Position;\n' +
    '  gl_PointSize = 10.0;\n' +
  '}\n';

  FSHADER_SOURCE =
    'void main() {\n' +
    '  gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0);\n' +
  '}\n';

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  var xPos = ev.clientX;
  var yPos = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  xPos = ((xPos - rect.left) - canvas.width/2)/(canvas.width/2);
  yPos = (canvas.height/2 - (yPos - rect.top))/(canvas.height/2);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_points.length / 2;
  var newArr = new Float32Array(g_points);

  // Pass the position of a point to a_Position variable
  gl.bufferData(gl.ARRAY_BUFFER, newArr, gl.STATIC_DRAW);

  //Draw
  gl.drawArrays(gl.POINTS, 0, len);
  gl.drawArrays(gl.LINE_STRIP, 0, len);
}

function initVertexBuffers(gl) {
  var vertices = new Float32Array(g_points);

  var n = g_points.length / 2; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  // Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}