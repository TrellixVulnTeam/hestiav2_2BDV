// My Awesome (Docking) Panel
// *******************************************
function MyAwesomePanel(viewer, container, id, title, options) {
    this.viewer = viewer;
    Autodesk.Viewing.UI.DockingPanel.call(this, container, id, title, options);
  
    // the style of the docking panel
    // use this built-in style to support Themes on Viewer 4+
    this.container.classList.add('docking-panel-container-solid-color-a');
    this.container.style.top = "10px";
    this.container.style.left = "10px";
    this.container.style.width = "auto";
    this.container.style.height = "auto";
    this.container.style.resize = "auto";
  
    // this is where we should place the content of our panel
    var div = document.createElement('div');
    div.style.margin = '20px';
    div.innerHTML = "<iframe height=\"350px\" width=\"100%\" allowfullscreen=\"true\" src=\"https://momento360.com/e/u/46aed55fb8554c2c8309a15d4248499d?utm_campaign=embed&utm_source=other&heading=35.21&pitch=0.17&field-of-view=75&size=medium\"> </iframe>"
    //div.innerHTML = "<iframe height=\"350px\"width=\"100%\" allowfullscreen=\"true\" src=\"https://app.powerbi.com/reportEmbed?reportId=23fdac47-1c3e-4b2d-850f-9bb9c7d9b5fd&autoAuth=true&ctid=fa24c029-a921-4cbe-aebe-c64b8f24a6c7&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXVzLW5vcnRoLWNlbnRyYWwtZi1wcmltYXJ5LXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0LyJ9\"> </iframe>"  
  
    // TO GET IMAGE USE BELOW
    // div.innerHTML = "<img src=\"images/Ramsey1.jpg\" width=\"500px\" height=\"250px\">"; 
    this.container.appendChild(div);
    // and may also append child elements...
  
  }
  MyAwesomePanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
  MyAwesomePanel.prototype.constructor = MyAwesomePanel;