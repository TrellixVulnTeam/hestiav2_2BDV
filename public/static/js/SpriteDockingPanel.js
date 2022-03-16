// My Docking Panel
// *******************************************
function MyAwesomePanel(viewer, container, id, title, RenURL,options) {
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
    var link =  RenURL
    var iframe = document.createElement('iframe');
    iframe.setAttribute("src", link);
    iframe.width="100%";
    iframe.height="100%";
    iframe.setAttribute('allowFullScreen', '');
    
    // TO GET IMAGE USE BELOW
    // div.innerHTML = "<img src=\"images/Ramsey1.jpg\" width=\"500px\" height=\"250px\">"; 
    this.container.appendChild(iframe);
    // and may also append child elements...
  
  }
  MyAwesomePanel.prototype = Object.create(Autodesk.Viewing.UI.DockingPanel.prototype);
  MyAwesomePanel.prototype.constructor = MyAwesomePanel;