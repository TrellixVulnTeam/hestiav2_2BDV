class BarChart extends DashboardPanelChart {
    constructor(property) {
        super();
        this.propertyToUse = property;
    }

    load(parentDivId, viewer, modelData) {
        if (!super.load(parentDivId, this.constructor.name, viewer, modelData)) return;
        this.drawChart();
    }

    drawChart() {
        var _this = this; // need this for the onClick event

        var ctx = document.getElementById(this.canvasId).getContext('2d');
        if (this.chart !== undefined) this.chart.destroy();
        var colors = this.generateColors(this.modelData.getLabels(this.propertyToUse).length);

        this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.modelData.getLabels(this.propertyToUse),
                datasets: [{
                    data: this.modelData.getCountInstances(this.propertyToUse),
                    backgroundColor: colors.background,
                    borderColor: colors.borders,
                    borderWidth: 1
                }]
                
            },
            
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
                legend: {
                    display: false
                },
                'onClick': function (evt, item) {
                    _this.viewer.isolate(_this.modelData.getIds(_this.propertyToUse, item[0]._model.label));
                    if(_this.propertyToUse==='Name'){
                        let AllLabels = _this.modelData.getLabels(_this.propertyToUse)
                        for (let i of AllLabels){
                    //  THE DBIDS OF ALL ELEMENTS BEING ISOLATED
                    let DbIds = _this.modelData.getIds(_this.propertyToUse, i)
                    
                    // COUNT OF ALL ELEMENTS BEING ISOLATED
                    let AllElemCt = _this.modelData.getCountInstances(_this.propertyToUse);
                    // ALL THE COLORS
                    let AllColors = colors.background
                    // CHOSEN LABEL
                    let ChosenLabel = item[0]._model.label
                    // ALL LABELS IN THE CHOSEN PROPERTY (DROPDOWN SELECTOR)
                    //let AllLabels = _this.modelData.getLabels(_this.propertyToUse)

                    // INDEX OF THE CHOSEN LABEL TO FIND ITS COLOR
                    const Ind = AllLabels.findIndex(xyz => {
                        return xyz === i;
                    })
                    // COLOR OF CHOSEN LABEL
                    const ColorNum = colors.background[Ind].split("rgba(")[1].split(")")[0].split(", ");
                    let VecColor = new THREE.Vector4(ColorNum[0]/255, ColorNum[1]/255, ColorNum[2]/255, ColorNum[3]);
                    for (let x of DbIds) {
                        _this.viewer.setThemingColor(x,VecColor, null, true) // Sets the color for the selected DbIds
                    }
                }
            }
                    _this.viewer.utilities.fitToView();
                }
            }
        });
    }
}