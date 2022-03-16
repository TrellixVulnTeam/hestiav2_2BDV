//works with viewer v7

class SheetsView {

    constructor(viewer) {
        this.viewer = viewer;
        this.sheets = [];  //Model objects for each 2D sheet
        this.model3d = null; // model object for root 3D node
        this.bub3D = null; // viewable for 3D model
    }


        // URN:        urn of primary 3D model
        // sheets:     array of sheets { id: index of 2d sheet, x,y,z, scale,  vert }
        // viewState:  initial camera view state.  viewState = viewer.getState({viewport: true, objectSet: true});
    async load(urn, sheets) {
        this.sheets = sheets;
        // loads 3D base model and select 2D sheets
        Autodesk.Viewing.Document.load( urn, async doc => {
            //this.bub3D = doc.getRoot().search({type:'geometry', role: "2d" });
            let bub3Ds = doc.getRoot().search({type:'geometry', role: "2d" });
            //doc.downloadAecModelData();
            //this.model3d = await this._loadmodel(doc, this.bub3D, this._options());

            for (let sheet of sheets) {
                sheet.model = (await this._loadmodel(doc, bub3Ds[sheet.id], this._options(sheet) )).model;
            };                
            
        })        
    }

        // URN:        urn of primary model
        // sheets:     array of sheets { id: index of 2d sheet, x,y,z, scale,  vert }
        // viewState:  initial camera view state.  viewState = viewer.getState({viewport: true, objectSet: true});
   


    async _loadmodel(doc, viewable, options) {

        let viewer = this.viewer;
        return await new Promise(function (resolve) {
            viewer.loadDocumentNode(doc, viewable, options).then( model => {
                viewable.model = model;
                viewer.addEventListener( Autodesk.Viewing.GEOMETRY_LOADED_EVENT, e => { 
                    resolve(e);
                }, {once : true}); 
            });
        });
    }


  _options(sheet) {

      const options = {
          keepCurrentModels: true,
          //modelspace:true,
          globalOffset: { x:0, y:0, z:0 }
      }

      if (!sheet) 
          return options;

      let Obj = new THREE.Object3D();
      let angle = (Math.PI/2);
      if (sheet) 
        Obj.rotateZ(angle)//.rotateY(angle).rotateZ(angle);
      if (sheet.vert) 
          Obj.rotateZ(angle).rotateX(angle); 
      Obj.position.set( sheet.x, sheet.y, sheet.z ); 
      Obj.scale.multiplyScalar(sheet.scale);
      Obj.updateMatrix();

      options.placementTransform = Obj.matrix;
      return options;
  }


    // Hides the white background of the Sheet
    hideSheetPaper(id, isVisible) {
        let model = this.sheets[id].model;
        model.visibilityManager.setNodeOff(-1, isVisible);
        //model.getFragmentList().vizflags[0] = (isVisible) ? 1 : 0;
    }


    show(id) {

    }

    hide(id) {

    }
    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('allMyAwesomeExtensionsToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('allMyAwesomeExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('myAwesomeExtensionButton');
        this._button.onClick = (ev) => {
            // Execute an action here
        };
        this._button.setToolTip('My Awesome Extension');
        this._button.addClass('myAwesomeExtensionIcon');
        this._group.addControl(this._button);
    }
}
