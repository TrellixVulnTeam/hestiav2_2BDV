var viewer;



function launchViewer(urn) {
  var options = {
    // SVF2 Options
    // env: 'MD20ProdUS',
    // api: 'D3S',

    // SVF options
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
    
  };


  Autodesk.Viewing.Initializer(options, (model) => {
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'),{ extensions: ['Autodesk.VisualClusters','Autodesk.AEC.LevelsExtension','Autodesk.DocumentBrowser','Autodesk.AEC.Minimap3DExtension',"LogoExtension"] });
    
    
    viewer.start();
    var documentId =  urn;
    
    //Set profile settings
    const customProfileSettings = {
      settings: {
        envMapBackground: false, // override existing
        lightPreset: 12,
          // reverseHorizontalLookDirection: true, // override existing
          
      },
      // extensions: {
      //     unload: ['Autodesk.ViewCubeUi', 'Autodesk.BimWalk']
      // }
    };
    const customProfile = new Autodesk.Viewing.Profile(customProfileSettings);
    // Updates viewer settings encapsulated witihn a Profile.
    // This method will also load and unload extensions referenced by the Profile.
    viewer.setProfile(customProfile);
    // viewer.setGhosting(false);


    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
    

    view = new SheetsView(viewer);
    const sheets = [
      //{ id:15, scale:8, x:-102.7, y: -133, z: 1 },
      { id:14, scale:8, x:227.22, y: -184, z: -32 },
      //{ id:13, scale:8, x:-44.5, y:-144.5-52.3, z:-48, vert:false },
    ]
    const viewState = {"objectSet":[{"id":[],"idType":"lmv","seedUrn":urn,"isolated":[],"hidden":[1849,1886,1942,9921,2737],"explodeScale":0},{"id":[],"idType":"lmv","seedUrn":urn,"isolated":[],"allLayers":true,"hidden":[]},{"id":[],"idType":"lmv","seedUrn":urn,"isolated":[],"allLayers":true,"hidden":[]}],"viewport":{"name":"","eye":[122.26747913393116,-193.4735768775284,116.26378009085752],"target":[117.6301309834936,-186.53738917139702,112.21983687766917],"up":[-0.24240958155721073,0.3625775561593251,0.8998750527372062],"worldUpVector":[0,0,1],"pivotPoint":[106.63111877441406,13.21699595451355,11.886348158121109],"distanceToOrbit":207.96606375686454,"aspectRatio":1.07,"projection":"perspective","isOrthographic":false,"fieldOfView":53.13010235415598}};
	  setTimeout(function () {
      view.load(documentId, sheets);
      
  }, 5000); // Viewstate restore has been commented off in the function and a timeout has been set to load sheets AFTER 3d model
    
    
  });
}

async function onDocumentLoadSuccess(doc) {
  await viewer.loadExtension('Autodesk.Viewing.MarkupsCore')
  await viewer.loadExtension("Autodesk.Viewing.MarkupsGui")
  // sprites
  const dataVizExtn = await viewer.loadExtension("Autodesk.DataVisualization");
  const DataVizCore = Autodesk.DataVisualization.Core;
  const viewableType = DataVizCore.ViewableType.SPRITE;
  const spriteColor = new THREE.Color(0xffffff);
  const spriteIconUrl = "images/NewTux.svg";

  const style = new DataVizCore.ViewableStyle(viewableType, spriteColor, spriteIconUrl);

  const viewableData = new DataVizCore.ViewableData();
  viewableData.spriteSize = 24; // Sprites as points of size 24 x 24 pixels

  const myDataList = [{ position: { x: 227.22, y: -184, z: -10 } }, { position: { x: 20, y: 22, z: 3 } }];

  myDataList.forEach((myData, index) => {
      const dbId = 10 + index;
      const position = myData.position;
      const viewable = new DataVizCore.SpriteViewable(position, style, dbId);

      viewableData.addViewable(viewable);
  });

  await viewableData.finish();
  dataVizExtn.addViewables(viewableData);

   /**
   * Called when a user clicks on a Sprite Viewable
   * @param {Event} event 
   */
  
   // THE EVENT.DBID IS THE SPRITE'S ELEMENT ID OF SORTS

  function onItemClick(event) {
    if (event.dbId > 0 ) {
    var panel = new MyAwesomePanel(viewer, viewer.container, 
      'awesomeExtensionPanel', 'Outer 360 Deg Render');
    panel.setVisible(!panel.isVisible());

    let newCameraPosition = new THREE.Vector3(227.22, -184, -10);
    let newCameraTarget = new THREE.Vector3(4.0, -5.0, -10);
    let upVector = viewer.navigation.getWorldUpVector();
    let fov = viewer.navigation.getHorizontalFov();
    viewer.navigation.setRequestTransition(true, newCameraPosition, newCameraTarget, fov,true);
    viewer.navigation.setCameraUpVector (upVector) ;
    }
    console.log(`Sprite clicked: ${event.dbId}`);
  }

  /**
   *  Called when a user hovers over a Sprite Viewable 
   * @param {Event} event 
   */
  function onItemHovering(event) {
      console.log("Show tooltip here", event.dbId);
  }

  
  viewer.addEventListener(DataVizCore.MOUSE_CLICK, onItemClick);
  // viewer.addEventListener(DataVizCore.MOUSE_HOVERING, onItemHovering);



  var masterViews = findMasterViews(doc.getRoot().findAllViewables()[0]);
  

  viewer.loadDocumentNode(doc, /* if any master view */ masterViews.length !== 0 ? /* use first */ masterViews[1] : /* or use default */ doc.getRoot().getDefaultGeometry()).then(i => {
    // documented loaded, any action?
    viewer.loadExtension("NestedViewerExtension", { filter: ["2d"], crossSelection: true })
    viewer.loadExtension("GoogleMapsLocator")
    viewer.loadExtension('Autodesk.Viewing.MemoryLimitedDebug');
    // viewer.loadExtension('SheetsView')
    
    // var a = viewer.loadExtension( 'Autodesk.AEC.Hypermodeling', { hidePaper: false });
    // a.loadSheetFromLevel(0)
    // console.log(a);
    //hyperModelExt.loadSheetFromLevel( 0 );
    viewer.impl.setGhostingBrightness(false);
    viewer.impl.invalidate(true)
    // const root = doc.getRoot();
    // const viewables = root.search({'type':'geometry', 'role': '3d'});
    // console.log('Viewables:', viewables);
    // const phaseViews = viewables.filter(v => v.data.name === v.data.phaseNames && v.getViewableRootPath().includes('08f99ae5-b8be-4f8d-881b-128675723c10'));
    // console.log('Master Views:', phaseViews);

    
  });

  
  doc.downloadAecModelData()
}




// async function onDocumentLoadSuccess(doc) {
//   var aecModelData = await doc.downloadAecModelData();
//   var hyperModelExt = await viewer.loadExtension( 'Autodesk.AEC.Hypermodeling', { hidePaper: false } );
//   //var a = hyperModelExt.loadSheetFromLevel( 0 );
//   console.log('a');
// }

// async function onDocumentLoadSuccess(doc){
//   const aecModelData = await doc.downloadAecModelData();
//   console.log(aecModelData.levels) //if you want to take a look at AEC data
//   const hyperModelExt = await viewer.loadExtension( 'Autodesk.AEC.Hypermodeling', { hidePaper: false } );
// //get available sheets collection of level No #2
//   console.log(aecModelData.levels)
//   var todo = hyperModelExt.getAvailableSheetsForLevel( 1 );  
// // load the #1 sheet of the sheets collection of level #2 
//   hyperModelExt.loadSheetFromLevel( 2, 1 ) 
// }



// Yet to confirm if is safe to assume that Master View will be named
// according to the phase it represents.
function findMasterViews(viewable) {
  var masterViews = [];
  // master views are under the "folder" with this UUID
  if (viewable.data.type === 'folder' && viewable.data.name === '08f99ae5-b8be-4f8d-881b-128675723c10') {
    return viewable.children;
  }
  if (viewable.children === undefined) return;
  viewable.children.forEach((children) => {
    var mv = findMasterViews(children);
    if (mv === undefined || mv.length == 0) return;
    masterViews = masterViews.concat(mv);
  })
  return masterViews;
}

function onDocumentLoadFailure(viewerErrorCode) {
  console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function getForgeToken(callback) {
  fetch('/api/forge/oauth/token').then(res => {
    res.json().then(data => {
      callback(data.access_token, data.expires_in);
      console.log(data.access_token)
    });
    
  });
}

$(document).ready(function () {
  // my test
  //launchViewer('dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bmFzaHZpbGxlb2ZmaWNlL2ZvcmdlJTIwcmVwb3J0JTIwdGVzdC5ydnQ');

  // Ramsey SVF2 
  launchViewer('urn:dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bmFzaHZpbGxlb2ZmaWNlLzQxMTM4LjAyJTIwUmFtc2V5UGhhc2UyQ2VudHJhbFIyMV9kZXRhY2hlZC5ydnQ');
  
});