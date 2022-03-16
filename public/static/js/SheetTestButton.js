
class SheetsView1 extends Autodesk.Viewing.Extension {
    
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.sheets = [];  //Model objects for each 2D sheet
        this.model3d = null; // model object for root 3D node
        this.bub3D = null; // viewable for 3D model
        this.urn  = options.urn;
        this.sheets = options.sheets;
        console.log(this.sheets)
    }
    // URN:        urn of primary 3D model
    // sheets:     array of sheets { id: index of 2d sheet, x,y,z, scale,  vert }
    // viewState:  initial camera view state.  viewState = viewer.getState({viewport: true, objectSet: true});


    // async load(urn, sheets) {
    //     // loads 3D base model and select 2D sheets
    //     Autodesk.Viewing.Document.load( this.urn, async doc => {
    //         //this.bub3D = doc.getRoot().search({type:'geometry', role: "2d" });
    //         let bub3Ds = doc.getRoot().search({type:'geometry', role: "2d" });
    //         //doc.downloadAecModelData();
    //         //this.model3d = await this._loadmodel(doc, this.bub3D, this._options());
    //         for (let sheet of this.sheets) {
    //             sheet.model = (await this._loadmodel(doc, bub3Ds[sheet.id], this._options(sheet) )).model;
    //         };                
    //     })        
    // }


    
    // load() {
    //     if (this.viewer.model.getInstanceTree()) {
    //         this.customize();
    //     } else {
    //         this.viewer.addEventListener(Autodesk.Viewing.OBJECT_TREE_CREATED_EVENT, this.customize());
    //     }        
    //     return true;
    // }



    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('customExtensions');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('customExtensions');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('IconExtension1');
        this._button.onClick = (ev) => {
            this._enabled = !this._enabled;
            this.showIcons(this._enabled);
            this._button.setState(this._enabled ? 0 : 1);

        };
        this._button.setToolTip(this.options.button.tooltip);
        this._button.icon.classList.add('fas', this.options.button.icon);
        this._group.addControl(this._button);
    }
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

      if (!this.sheets) 
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

    showIcons(show) {
        
        Autodesk.Viewing.Document.load( this.urn, async doc => {
            let bub3Ds = doc.getRoot().search({type:'geometry', role: "2d" });
            if(show){
                Autodesk.Viewing.Document.load( this.urn, async doc => {
                    for (let sheet of this.sheets) {
                        let sheet1 = await this._loadmodel(doc, bub3Ds[sheet.id], this._options(sheet) );
                        sheet.model = sheet1.model;
                    };                
                })
            }
            else if(!show){
                for (let sheet of this.sheets) {
                    let viewer = this.viewer;
                    viewer.unloadModel(sheet.model)
                };
            }
                            
        })        
        

       
    }

   

    
}

Autodesk.Viewing.theExtensionManager.registerExtension('SheetsView1', SheetsView1);