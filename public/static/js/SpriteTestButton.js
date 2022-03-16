
class SpritesView1 extends Autodesk.Viewing.Extension {
      
    constructor(viewer, options) {
        super(viewer, options);
        this.viewer = viewer;
        this.ViewableData1 =  options.VD1; 
        this.dataVizExtn = options.dataVizExtn;
        console.log(this.ViewableData1)
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
        this._button = new Autodesk.Viewing.UI.Button('SpritesButton');
        this._button.onClick = (ev) => {
            this._enabled = !this._enabled;
            this.showIcons(this._enabled);
            this._button.setState(this._enabled ? 0 : 1);

        };
        this._button.setToolTip(this.options.button.tooltip);
        this._button.icon.classList.add('fas', this.options.button.icon);
        this._group.addControl(this._button);
    }
    

    showIcons(show) {

        if(show){
            dataVizExtn.addViewables(viewableData);
        }
        else if(!show){
            console.log('sprite off')
        }
                        
    }

   

    
}
Autodesk.Viewing.theExtensionManager.registerExtension('SpritesView1', SpritesView1);
