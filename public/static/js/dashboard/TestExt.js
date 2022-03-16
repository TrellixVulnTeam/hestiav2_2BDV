
class LogoExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._width = 48;
        this._height = 48;
        this._url = 'images/Facebook_Post_940x788_px_-_Logo-NoBG.png';
        this._dasherModel = options.dataModel;
        const extSettings = this._dasherModel.extensionSettings(this.constructor.name);
        this._url = options.url || extSettings.url || this._url;
        this._width = options.width || extSettings.width || this._width;
        this._height = options.height || extSettings.height || this._height;
    }
    static adjustLogo() {
        const vdiv = $('#canvas-align')[0].parentElement;
        $('#canvas-align')
            .width(vdiv.clientWidth)
            .height(vdiv.clientHeight);
        $('#logo-overlay')
            .width(vdiv.clientWidth)
            .height(vdiv.clientHeight);
    }
    load() {
        console.log('LogoExtension Loaded')
        logger.log('LogoExtension loaded');
        const onresize = utils$4.debounce(() => {
            LogoExtension.adjustLogo();
        }, 100);
        window.addEventListener('resize', onresize);
        const logo = $('#logo');
        logo.html('<img width="' +
            this._width +
            'px" height="' +
            this._height +
            'px" src="' +
            this._url +
            '">');
        LogoExtension.adjustLogo();
        $('#logo').css('display', 'block');
        return true;
    }
    unload() {
        logger.log('LogoExtension unloaded');
        $('#logo').css('display', 'none');
        return true;
    }
    // onToolbarCreated() {
    //   // Create a new toolbar group if it doesn't exist
    //   this._group = this.viewer.toolbar.getControl('allMyAwesomeExtensionsToolbar');
    //   if (!this._group) {
    //       this._group = new Autodesk.Viewing.UI.ControlGroup('allMyAwesomeExtensionsToolbar');
    //       this.viewer.toolbar.addControl(this._group);
    //   }

    //   // Add a new button to the toolbar group
    //   this._button = new Autodesk.Viewing.UI.Button('myAwesomeExtensionButton');
    //   this._button.onClick = () => {
    //       // Execute an action here
    //   };
    //   this._button.setToolTip('My Awesome Extension');
    //   this._button.addClass('myAwesomeExtensionIcon');
    //   this._group.addControl(this._button);
    // }
}

Autodesk.Viewing.theExtensionManager.registerExtension('LogoExtension', LogoExtension);