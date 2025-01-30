// JScript source code

var pagediv, canvaso, contexto;

var PaperHeight = 100;
var PaperWidth = 100;

var dx = 0.0, dy = 0.0;
var dxextent = 0.0, dyextent = 0.0;
var imagewidth = 0, imageheight = 0;
var imagewidthsmall = 0, imageheightsmall = 0;
//var dscale=1;
//var dscaleextent=1;
var drotation = 0;
var widthadjust = 2;
var bannerheight = 140;
var imageloaded = false;
var smallimageloaded = false;
var largeimageloaded = false;
var documentopen = false;
var markuploaded = false;
var bMarkupchanged = false;
var bPrintpageloaded = false;
var printWin;
var canvheight = 1123;
var canvwidth = 794;
//0 = portrait 1 = landscape
var Porientation = 0;
var imageswitchfactor = 3;

var hasnotprinted = true;

var lastTouchdata = -1;
var Canvasheight = 0;
var Canvaswidth = 0;
var xmlurlrel = '';
var dscale = 0.0;
var backgroundColor = "#FFFFFF";

//1 = metric, 2 = Imperial, 3 = System, 4=Custom
var Unitofmeasure = 1;
var Unitlabel = "mm";
var AreaUnitlabel = "mm\u00b2";
var MeasureScale = 1.0;
var nCalibrateScale = 1.0;
var nCalibrateMeasured = 0.0;
var nCalibrateSet = 0.0;

//mm = 1 meter = 1000 for metric units.
var unitscale = 1;
//1 = Millimeter, 2 = Centimeter, 3 = Decimeter, 4=Meter,5=Kilometer,6=Nautical Miles
//1 = Inch,2=Feet,3=Yard,4=Mile,5=Nautical Miles
var SubmeasureUnit = 1;

// 0 = large 1=small
var imagesize = 0;
//array to hold markup objects
var markuplist = new Array();
var markupundolist = new Array();
var markupfiles = new Array();
var Userlist = new Array();
var Stamplist = new Array();
var numUsers = 0;
var Layerlist = new Array();
var numLayers = 0;
var nummarkups = 0;

var SzNoteText = "";

//tool state flags
var bZoomWindow = false;
var bPan = false;
var bMarkupEdit = false;
var bCalibrate = false;
var bMarkupHide = false;
var bMarkuperase = false;
var bMarkupText = false;
var bMarkupNote = false;
var bMarkupStamp = false;
var bMarkupLine = false;
var bMarkupArrow = false;
var bMarkupShape = false;
var bMarkupDimension = false;
var bMarkupArea = false;
var bMarkupMarker = false;
var bMarkupOutline = true;
var bMarkupEdged = false;
var bMarkupFilled = false;
var bMarkupHatched = false;
var bMeasure = false;
var bAllpagesloaded = false;
var nTotalPages = 0;
var aDrawpages = [];
var aDrawmarkup = [];


var markupdrawn = false;
//global configuration variables
var markuplayer = 1;
var markupcolor = "red";
var signature = "Default";
var DisplayName = "Default";
var fontstylevalue = "Arial";
var linewidthvalue = 1;
var Linestylevalue = "_______";
var HatchStyle = 0;
var fillstyle = 0;
var nlinestyle = 0;

var bCanChangeLayer = true;
var bCanChangeSignature = true;

var readonlymode = false;

//var bGetconfig = true;
var bRefreshmarkup = false;
var bReverseScale = false;


var locationSearchSet = false;
var szLocationSearch = "";

var DocObj;
var SzMainImageSRC;
var SzSmallImageSRC;
var SzThumbImageSRC;

var DocumentObject = {}; //Document object
var PageObject = {}; //Document object

//note image
var noteimage = new Image();
noteimage.src = 'images/note.png';


var pattern = document.createElement('canvas');

function getURLPath(s){
    var path = "";
    var sp = s.split('/');
    for (i=0;i<sp.length - 1;i++){
        path += sp[i] + "/";
    }
    //var file = sp[sp.length-1];
    //alert(file);
    return path;
}


function getPath(s) {
    var path = "";
    var sp = s.split('\\');
    for (i = 0; i < sp.length - 1; i++) {
        path += sp[i] + "\\";
    }
    //var file = sp[sp.length-1];
    //alert(file);
    return path;

}

function getFileName(s){
    var path = "";
    var file = "";
    var sp = s.split('\\');
    for (i=0;i<sp.length - 1;i++){
        path += sp[i] + "\\";
    }
    file = sp[sp.length-1];
    //alert(file);
    return file;

}

//Function to convert hex format to a rgb color
function rgb2hex(rgb){
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
}

function rgba2transp(rgba){
    var alpha=rgba.replace(/^.*,(.+)\)/,'$1')
    //rgba = rgba.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return parseFloat(alpha); //(rgba && rgba.length === 6) ? ("0" + parseInt(rgba[4],10).toString(16)).slice(-2) : '';
}

function isEven(value) {
    if (value%2 == 0)
        return true;
    else
        return false;
}

function getHatchsvg(svgctx,type,color){
    //diagonal-forward = 3
    //diagonal-back = 2
    //diagonal-cross = 2
    //hatch-horizontal = 3
    //hatch-vertical = 4
    //hatch-cross = 5




    switch(type){
        case 3:
            var pctx = svgctx.path("M 0 10 L 10 0 M 10 16 L 16 10 M 2 16 L 16 2 M 0 2 L 2 0").attr({
                fill: "none",
                stroke: color,
                strokeWidth: 1
            }).toPattern(0, 0, 16, 16);
  /*
   pctx.moveTo(0.0, 10.0);
   pctx.lineTo(10.0,0.0);
   pctx.moveTo(10.0,16.0);
   pctx.lineTo(16.0,10.0);
   pctx.moveTo(2.0,16.0);
   pctx.lineTo(16.0,2.0);
   pctx.moveTo(0.0,2.0);
   pctx.lineTo(2.0,0.0);

   */
            break;
        case 2:
            pctx = svgctx.path("M 0 14 L 2 16 M 0 6 L 10 16 M 2 0 L 16 14 M 10 0 L 16 6").attr({
                fill: "none",
                stroke: color,
                strokeWidth: 1
            }).toPattern(0, 0, 16, 16);

            /*pctx.beginPath();
            pctx.moveTo(0.0, 14.0);
            pctx.lineTo(2.0,16.0);
            pctx.moveTo(0.0, 6.0);
            pctx.lineTo(10.0,16.0);
            pctx.moveTo(2.0, 0.0);
            pctx.lineTo(16.0,14.0);
            pctx.moveTo(10.0, 0.0);
            pctx.lineTo(16.0,6.0);
            pctx.stroke();*/
            break;
        case 5:
            pctx = svgctx.path("M 0 10 L 10 0 M 10 16 L 16 10 M 2 16 L 16 2 M 0 2 L 2 0 M 0 14 L 2 16 M 0 6 L 10 16 M 2 0 L 16 14 M 10 0 L 16 6").attr({
                fill: "none",
                stroke: color,
                strokeWidth: 1
            }).toPattern(0, 0, 16, 16);

            /*pctx.beginPath();
            pctx.moveTo(0.0, 10.0);
            pctx.lineTo(10.0,0.0);
            pctx.moveTo(10.0,16.0);
            pctx.lineTo(16.0,10.0);
            pctx.moveTo(2.0,16.0);
            pctx.lineTo(16.0,2.0);
            pctx.moveTo(0.0,2.0);
            pctx.lineTo(2.0,0.0);

            pctx.moveTo(0.0, 14.0);
            pctx.lineTo(2.0,16.0);
            pctx.moveTo(0.0, 6.0);
            pctx.lineTo(10.0,16.0);
            pctx.moveTo(2.0, 0.0);
            pctx.lineTo(16.0,14.0);
            pctx.moveTo(10.0, 0.0);
            pctx.lineTo(16.0,6.0);
            pctx.stroke();*/


            break;
        case 0:
            pctx = svgctx.path("M 0 4 L 16 4 M 0 12 L 16 12").attr({
                fill: "none",
                stroke: color,
                strokeWidth: 1
            }).toPattern(0, 0, 16, 16);


            /*pctx.beginPath();

             pctx.moveTo(0.0, 4.0);
             pctx.lineTo(16.0,4.0);
             pctx.moveTo(0.0, 12.0);
             pctx.lineTo(16.0,12.0);

             pctx.moveTo(0.0, 4.0);
            pctx.lineTo(16.0,4.0);
            pctx.moveTo(0.0, 12.0);
            pctx.lineTo(16.0,12.0);

            pctx.stroke();*/

            break;
        case 1:
            pctx = svgctx.path("M 4 0 L 4 16 M 12 0 L 12 16").attr({
                fill: "none",
                stroke: color,
                strokeWidth: 1
            }).toPattern(0, 0, 16, 16);

            /*pctx.beginPath();
            pctx.moveTo(4.0, 0.0);
            pctx.lineTo(4.0,16.0);
            pctx.moveTo(12.0, 0.0);
            pctx.lineTo(12.0,16.0);

            pctx.stroke();*/

            break;
        case 4:
            pctx = svgctx.path("M 0 4 L 16 4 M 0 12 L 16 12 M 4 0 L 4 16 M 12 0 L 12 16").attr({
                fill: "none",
                stroke: color,
                strokeWidth: 1
            }).toPattern(0, 0, 16, 16);


            /*pctx.beginPath();
            pctx.moveTo(0.0, 4.0);
            pctx.lineTo(16.0,4.0);
            pctx.moveTo(0.0, 12.0);
            pctx.lineTo(16.0,12.0);

            pctx.moveTo(4.0, 0.0);
            pctx.lineTo(4.0,16.0);
            pctx.moveTo(12.0, 0.0);
            pctx.lineTo(12.0,16.0);
            pctx.stroke();*/


            break;
    }

    return pctx;

}

/*function getHatch(ctx,type,color){

    //diagonal-forward = 0
    //diagonal-back = 1
    //diagonal-cross = 2
    //hatch-horizontal = 3
    //hatch-vertical = 4
    //hatch-cross = 5

    pattern.width = 16;
    pattern.height = 16;
    var pctx = pattern.getContext('2d');

    pctx.strokeStyle = color;
    pctx.lineWidth = 1;

    switch(type){
        case 0:
            pctx.beginPath();
            pctx.moveTo(0.0, 10.0);
            pctx.lineTo(10.0,0.0);
            pctx.moveTo(10.0,16.0);
            pctx.lineTo(16.0,10.0);
            pctx.moveTo(2.0,16.0);
            pctx.lineTo(16.0,2.0);
            pctx.moveTo(0.0,2.0);
            pctx.lineTo(2.0,0.0);
            pctx.stroke();
            break;
        case 1:
            pctx.beginPath();
            pctx.moveTo(0.0, 14.0);
            pctx.lineTo(2.0,16.0);
            pctx.moveTo(0.0, 6.0);
            pctx.lineTo(10.0,16.0);
            pctx.moveTo(2.0, 0.0);
            pctx.lineTo(16.0,14.0);
            pctx.moveTo(10.0, 0.0);
            pctx.lineTo(16.0,6.0);
            pctx.stroke();
            break;
        case 2:
            pctx.beginPath();
            pctx.moveTo(0.0, 10.0);
            pctx.lineTo(10.0,0.0);
            pctx.moveTo(10.0,16.0);
            pctx.lineTo(16.0,10.0);
            pctx.moveTo(2.0,16.0);
            pctx.lineTo(16.0,2.0);
            pctx.moveTo(0.0,2.0);
            pctx.lineTo(2.0,0.0);

            pctx.moveTo(0.0, 14.0);
            pctx.lineTo(2.0,16.0);
            pctx.moveTo(0.0, 6.0);
            pctx.lineTo(10.0,16.0);
            pctx.moveTo(2.0, 0.0);
            pctx.lineTo(16.0,14.0);
            pctx.moveTo(10.0, 0.0);
            pctx.lineTo(16.0,6.0);
            pctx.stroke();


            break;
        case 3:
            pctx.beginPath();
            pctx.moveTo(0.0, 4.0);
            pctx.lineTo(16.0,4.0);
            pctx.moveTo(0.0, 12.0);
            pctx.lineTo(16.0,12.0);

            pctx.stroke();

            break;
        case 4:
            pctx.beginPath();
            pctx.moveTo(4.0, 0.0);
            pctx.lineTo(4.0,16.0);
            pctx.moveTo(12.0, 0.0);
            pctx.lineTo(12.0,16.0);

            pctx.stroke();

            break;
        case 5:
            pctx.beginPath();
            pctx.moveTo(0.0, 4.0);
            pctx.lineTo(16.0,4.0);
            pctx.moveTo(0.0, 12.0);
            pctx.lineTo(16.0,12.0);

            pctx.moveTo(4.0, 0.0);
            pctx.lineTo(4.0,16.0);
            pctx.moveTo(12.0, 0.0);
            pctx.lineTo(12.0,16.0);
            pctx.stroke();


            break;
    }

    var HatchPtrn = ctx.createPattern(pattern, "repeat");
    return HatchPtrn;

}*/

function addSlash(s) {
    var path = "";
    var sp = s.split('\\');
    for (i = 0; i < sp.length; i++) {
        if (i < sp.length - 1) {
            path += sp[i] + "\\\\";
        } else {
            //path += sp[i];
        }

    }
    return path;
}

point = function(x,y){
    this.x = x;
    this.y = y;
};

Rectangle = function(x,y,w,h){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
};


function getpage(pagenum) {
    DocObj.GotoPage(pagenum);
}


function parseXML(text){

    var doc;

    if(window.ActiveXObject)
    {
        doc = new ActiveXObject("Microsoft.XMLDOM");
        doc.async = "false";
        doc.loadXML(text);
    }
    else if(window.DOMParser)
    {
        var parser = new DOMParser();
        doc = parser.parseFromString(text, "text/xml");
    }
    else
    {
        throw new Error("Cannot parse XML");
    }
    return doc;
}



/*function getUnitArea(value){
    var dimValue = 0;
    var dpi = DocObj.pages[DocObj.currentpage].DPI;
    var DPmm = dpi / 25.4;
    var DPInch =  dpi;
    //var unit = currentglobalunit;

    var Dpmmsquare = DPmm*DPmm;
    var DPInchSquare = DPInch*DPInch;
    var measureScaleSquared = MeasureScale*MeasureScale;

    var mainimagesquare = DocObj.pages[DocObj.currentpage].MainImageScaling * DocObj.pages[DocObj.currentpage].MainImageScaling;
    var dscalesquare = DocObj.pages[DocObj.currentpage].dscale * DocObj.pages[DocObj.currentpage].dscale;
    if (DocObj.pages[DocObj.currentpage].usevectorxml){
        dscalesquare = DocObj.pages[DocObj.currentpage].dscalevector * DocObj.pages[DocObj.currentpage].dscalevector;
    }
    //var scalefactor = DocObj.pages[DocObj.currentpage].dscale / this.scaling;
    //var scalefactorsquare = scalefactor * scalefactor;
    var orignalscalesquare = DocObj.pages[DocObj.currentpage].OriginalScale * DocObj.pages[DocObj.currentpage].OriginalScale;


    //dimValue = ((value  / mainimagesquare) / dscalesquare)*measureScaleSquared;//*scalefactorsquare;
    //change to make value independent of current zoom factor.
    dimValue = (value  / mainimagesquare)*measureScaleSquared;//*scalefactorsquare;
    dimValue = dimValue / (unitscale*unitscale);


    if (dpi != 0){
        switch(Unitofmeasure){
            case 1:
                dimValue = dimValue / Dpmmsquare;
                break;
            case 2:
                dimValue = dimValue / DPInchSquare;
                break;
            case 3:
                //dimValue = dimValue;
                break;
        }


    }else{
        dimValue = dimValue / orignalscalesquare;
    }
    return dimValue;
}*/

function getUnitArea(value){
    if(opener.RxCore.printhelper().docObj == null){
        return;
    }



    var dimValue = 0;
    var dpi = opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].DPI;
    var DPmm = dpi / 25.4;
    var DPInch =  dpi;
    //var unit = currentglobalunit;


    if(opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].usepdfjs){
        dpi = 72;
        DPmm = dpi / 25.4;
    }


    var Dpmmsquare = DPmm*DPmm;
    var DPInchSquare = DPInch*DPInch;
    var measureScaleSquared = MeasureScale*MeasureScale;
    if (opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].usevectorxml){
        var mainimagesquare = opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].OriginalScale * opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].OriginalScale;
    }else if(opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].usepdfjs){
        mainimagesquare = opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].OriginalScale * opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].OriginalScale;
    }else{
        mainimagesquare = opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].MainImageScaling * opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].MainImageScaling;
    }



    var dscalesquare = opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].dscale * opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].dscale;

    if (opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].usevectorxml){
        dscalesquare = opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].dscalevector * opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].dscalevector;
    }else if (opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].usepdfjs){
        dscalesquare = (opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].curpagescale*opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].dscalepdf) * (opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].curpagescale*opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].dscalepdf);
    }

    //var scalefactor = opener.RxCore.printhelper().docObj.pages[DocObj.currentpage].dscale / this.scaling;
    //var scalefactorsquare = scalefactor * scalefactor;
    var orignalscalesquare = opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].OriginalScale * opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].OriginalScale;


    //dimValue = ((value  / mainimagesquare) / dscalesquare)*measureScaleSquared;//*scalefactorsquare;
    //change to make value independent of current zoom factor.
    dimValue = (value  / mainimagesquare)*measureScaleSquared;//*scalefactorsquare;
    dimValue = dimValue / (unitscale*unitscale);


    if (dpi != 0){
        switch(Unitofmeasure){
            case 1:
                dimValue = dimValue / Dpmmsquare;
                break;
            case 2:
                dimValue = dimValue / DPInchSquare;
                break;
            case 3:
                //dimValue = dimValue;
                break;
        }


    }else{
        if (!opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].usevectorxml){
            dimValue = dimValue / orignalscalesquare;
        }

    }
    return dimValue;
}


function getUnitlength(value){
    if(opener.RxCore.printhelper().docObj == null){
        return;
    }


    var dimValue = 0;
    var dpi = opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].DPI;
    var DPmm = dpi / 25.4;
    var DPInch =  dpi;

    if(opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].usepdfjs){
        dpi = 72;
        DPmm = dpi / 25.4;
    }


    //var scalefactor = DocObj.pages[DocObj.currentpage].dscale / this.scaling;

    //dimValue = ((value  / DocObj.pages[DocObj.currentpage].MainImageScaling) / DocObj.pages[DocObj.currentpage].dscale)*MeasureScale;// * scalefactor;
    //value without the scale factor to estblish value independent from zoom factor.
    dimValue = ((value  / opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].MainImageScaling))*MeasureScale;// * scalefactor;
    if (opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].usevectorxml || opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].usepdfjs){
        dimValue = ((value  / opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].OriginalScale))*MeasureScale;// * scalefactor;
    }
    dimValue = dimValue / unitscale;

    if (dpi != 0){
        switch(Unitofmeasure){
            case 1:
                dimValue = dimValue / DPmm;
                break;
            case 2:
                dimValue = dimValue / DPInch;
                break;
            case 3:
                //dimvalue= dimvalue;
                break;
        }


    }else{
        if (!opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].usevectorxml){
            dimValue = dimValue / opener.RxCore.printhelper().docObj.pages[opener.RxCore.printhelper().docObj.currentpage].OriginalScale;
        }


    }
    return dimValue;
}



function getDocObj() {
    return DocObj;
}

function PrintWindow() {
    window.print();

    setTimeout("opener.RxCore.printhelper().printfocus()", 100);
    /*window.onfocus=function(){
        window.close();
    }*/
    //opener.printfocus();
    //CheckWindowState();
    //opener.printfocus();

}

function CheckWindowState()    {
    if(document.readyState=="complete") {

        //alert('closing');
        //opener.printfocus();
        //window.focus();
    } else {
        setTimeout("CheckWindowState()", 2000);

    }

}



function doprintcheck(){
    var canprint = true;


    for (var i = 0; i < aDrawpages.length;i++){
        if(!aDrawpages[i]){
            canprint = false;
        }
        /*reinstate this when markup is implemented.*/
        for(var j = 0;j < opener.RxCore.printhelper().docObj.markuplist.length;j++){
            if(opener.RxCore.printhelper().docObj.markuplist){
                if(!aDrawpages[i] || !opener.RxCore.printhelper().docObj.markuplist[j].drawn){

                    canprint = false;

                }

            }else{
                if(!aDrawpages[i]){
                    canprint = false;
                }

            }

        }

    }

    /*for(var j = 0;aDrawmarkup.length;j++){
        if(!aDrawmarkup[j]){
            console.log(aDrawmarkup[j]);
            //canprint = false;
        }
    }*/


    if (canprint && hasnotprinted){

        hasnotprinted = false;
        PrintWindow();

    }
}






function copyDocObj(){
    DocObj = new DocObject(opener.RxCore.printhelper().docObj);

}




function SetPageSize(width,height){
    canvwidth = width;
    canvheight = height;

    //pagediv.style.width = canvwidth + "px";
    //pagediv.style.height = canvheight + "px";

    //canvaso.width = canvwidth;
    //canvaso.height = canvheight;
    if (width > height){
        Porientation = 1;
    }else {
        Porientation = 0;
    }

}








function get_image(url, image) {
    image.addEventListener('load', imageload, false);
    image.src = url;

}


function svgtext(pathobj,svgdiv,scalefactor,offsetx,offsety,x,y,h){
    var x1scaled = (pathobj.x1-x) * scalefactor;
    var y1scaled = (h - pathobj.y1) * scalefactor;
    var height = pathobj.height * scalefactor;
    y1scaled += height;

    x1scaled += offsetx;
    y1scaled += offsety;

    var strokecolor = pathobj.strokecolor;
    var fillcolor = pathobj.fillcolor;

    if(strokecolor == backgroundColor){
        if(backgroundColor == "#FFFFFF"){
            strokecolor = "#000000";
            fillcolor = "#000000";
        }
        if(backgroundColor == "#000000"){
            strokecolor = "#FFFFFF";
            fillcolor = "#000000";
        }
    }

    var textout = svgdiv.text(x1scaled, y1scaled, pathobj.text).attr({
        fill: fillcolor,
        fontFamily:pathobj.fontname,
        fontSize: height
    });
    
    var roty = y1scaled-height; 
    
    if(pathobj.rotation != 0){
        var rotation = pathobj.rotation * 180 / Math.PI;
        var trstr = 'r' + rotation + ',' + x1scaled + ',' + roty;
        textout.transform(trstr);
     }


}

function svgimage(pathobj,svgdiv,scalefactor,offsetx,offsety,x,y,h){

    var x1scaled = (pathobj.x1-x) * scalefactor;
    var y1scaled = (h - pathobj.y1) * scalefactor;
    var x2scaled = (pathobj.x2-x) * scalefactor;
    var y2scaled = (h - pathobj.y2) * scalefactor;

    x1scaled += offsetx;
    y1scaled += offsety;
    x2scaled += offsetx;
    y2scaled += offsety;

    var height = y1scaled - y2scaled;
    var width = x2scaled - x1scaled;

    //var image = ctxsvg.image(this.image, width, height).x(x1scaled).y(y2scaled);
    var image = svgdiv.image(pathobj.image.src,x1scaled,y2scaled, width, height);
    //image.x(x1scaled);
    //image.y(y2scaled);


}
//this.drawmesvg = function(ctxsvg,scalefactor,offsetx,offsety, mediax, mediay,mediah){

function svgsubpath(pathobj,svgdiv,scalefactor,offsetx,offsety,x,y,h){
    var lineWidth = 1;

    var absxscaled = (pathobj.points[0]-x) * scalefactor;
    var absyscaled = (h - pathobj.points[1]) * scalefactor;
    var relxscaled = 0;
    var relyscaled = 0;

    var strokecolor = pathobj.strokecolor;
    var fillcolor = pathobj.fillcolor;


    absxscaled += offsetx;
    absyscaled += offsety;

    if(strokecolor == backgroundColor){
        if(backgroundColor == "#FFFFFF"){
            strokecolor = "#000000";
            fillcolor = "#000000";
        }
        if(backgroundColor == "#000000"){
            strokecolor = "#FFFFFF";
            fillcolor = "#000000";
        }
    }


    if (pathobj.linewidth * scalefactor < 0.3 && pathobj.filled == 0){
        lineWidth = 0.3;
    }else{
        lineWidth = pathobj.linewidth * scalefactor;
        //var linew = (0.5 + (this.linewidth * scalefactor)) | 0;
        //ctx.lineWidth = linew;

    }

    pathobj.svgpathstr = pathobj.parentpath.svgpathstr;

    pathobj.svgpathstr += ' M ' + absxscaled.toFixed(2) + ' ' + absyscaled.toFixed(2);

    for (var counter=2;counter<pathobj.points.length;counter+=2){
//            ctx.lineTo(markupobject.points[counter].x, markupobject.points[counter].y);
        relxscaled = ((pathobj.points[counter]-x) * scalefactor);
        relyscaled = ((h - pathobj.points[counter+1]) * scalefactor);
        relxscaled += offsetx;
        relyscaled += offsety;
        //xscaled = xscaled + offsetx;
        //yscaled = yscaled + offsety;
        pathobj.svgpathstr += ' L ' + relxscaled.toFixed(2) + ' ' + relyscaled.toFixed(2);
        //ctx.lineTo(relxscaled, relyscaled);

    }


    if(pathobj.last){
        //this.svgpathstr += ' z';
        if (pathobj.filled == 1){

            //this.svgpath = ctxsvg.path(this.svgpathstr).attr({ fill: this.fillcolor, stroke: this.strokecolor });
            //this.svgpath = ctxsvg.path(pathHandle.svgpathstr).fill({ color: this.fillcolor}).stroke({ color: this.strokecolor, width: lineWidth });

            var svgpath = svgdiv.path(pathobj.svgpathstr).attr({
                fill: fillcolor,
                stroke: strokecolor,
                'stroke-linecap':'round',
                'stroke-linejoin':'round',
                strokeWidth: lineWidth
            });

            //ctx.fillStyle = this.fillcolor;
            //ctx.fill();
        }else{
            //ctx.closePath();
            //this.svgpath = ctxsvg.path(pathHandle.svgpathstr).stroke({ color: this.strokecolor, width: lineWidth });
            //this.svgpath = ctxsvg.path(pathHandle.svgpathstr).fill('none').stroke({ color: this.strokecolor, width: lineWidth });

            svgpath = svgdiv.path(pathobj.svgpathstr).attr({
                fill: 'none',
                stroke: strokecolor,
                'stroke-linecap':'round',
                'stroke-linejoin':'round',
                strokeWidth: lineWidth
            });

            //ctx.fillStyle = this.fillcolor;
            //ctx.fill();

        }
        pathobj.svgpathstr = '';
        pathobj.parentpath.svgpathstr = pathobj.svgpathstr;
        //ctx.closePath();

        //ctx.stroke();

    }else{
        //parentpath.svgpathstr = pathHandle.svgpathstr;
        pathobj.parentpath.svgpathstr = pathobj.svgpathstr;
    }




}

function svgpath(pathobj,svgdiv,scalefactor,offsetx,offsety,x,y,h){
    var lineWidth = 1;
    var absxscaled = (pathobj.points[0]-x) * scalefactor;
    var absyscaled = (h - pathobj.points[1]) * scalefactor;
    var relxscaled = 0;
    var relyscaled = 0;

    absxscaled += offsetx;
    absyscaled += offsety;


    var strokecolor = pathobj.strokecolor;
    var fillcolor = pathobj.fillcolor;


    if(strokecolor == backgroundColor){
        if(backgroundColor == "#FFFFFF"){
            strokecolor = "#000000";
            fillcolor = "#000000";
        }
        if(backgroundColor == "#000000"){
            strokecolor = "#FFFFFF";
            fillcolor = "#000000";
        }
    }



    //ctx.beginPath();
    pathobj.svgpathstr = 'M ' + absxscaled.toFixed(2) + ' ' + absyscaled.toFixed(2);

    if (pathobj.linewidth * scalefactor < 0.3 && pathobj.filled == 0){
        lineWidth = 0.3;
    }else{
        lineWidth = pathobj.linewidth * scalefactor;
        //var linew = (0.5 + (this.linewidth * scalefactor)) | 0;
        //ctx.lineWidth = linew;


    }


//      ctx.moveTo(markupobject.points[0].x, markupobject.points[0].y);
    //replace with SVG M bsxscaled, absyscaled
    //ctx.moveTo(absxscaled, absyscaled);
    var count = 0;
    for (counter=2;counter<pathobj.points.length;counter+=2){
//            ctx.lineTo(markupobject.points[counter].x, markupobject.points[counter].y);
        relxscaled = ((pathobj.points[counter]-x) * scalefactor);
        relyscaled = ((h - pathobj.points[counter+1]) * scalefactor);
        relxscaled += offsetx;
        relyscaled += offsety;
        //xscaled = xscaled + offsetx;
        //yscaled = yscaled + offsety;
        //replace with SVG L relxscaled, relyscaled
        pathobj.svgpathstr += ' L ' + relxscaled.toFixed(2) + ' ' +  relyscaled.toFixed(2);
        //ctx.lineTo(relxscaled, relyscaled);

    }


    if(!pathobj.gotsubpath){
        //this.svgpathstr += ' z';
        if (pathobj.filled == 1){

            //this.svgpath = ctxsvg.path(pathHandle.svgpathstr).fill({ color: this.fillcolor }).stroke({ color: this.strokecolor, width: lineWidth });

            var svgpath = svgdiv.path(pathobj.svgpathstr).attr({
                fill: fillcolor,
                stroke: strokecolor,
                'stroke-linecap':'round',
                'stroke-linejoin':'round',
                strokeWidth: lineWidth
            });

        }else{

            //this.svgpath = ctxsvg.path(pathHandle.svgpathstr).fill('none').stroke({ color: this.strokecolor, width: lineWidth });

            svgpath = svgdiv.path(pathobj.svgpathstr).attr({
                fill: 'none',
                stroke: strokecolor,
                'stroke-linecap':'round',
                'stroke-linejoin':'round',
                strokeWidth: lineWidth
            });


        }
        pathobj.svgpathstr = '';
    }else{
        for(var scount = 0;scount < pathobj.subpaths.length;scount++){

            //pathobj.subpaths[scount].drawme(svgdiv,scalefactor,offsetx,offsety, x, y,h);
            svgsubpath(pathobj.subpaths[scount],svgdiv,scalefactor,offsetx,offsety,x,y,h);
        }

        //this.resultstr = this.svgpathstr;
    }


}

function svgcircle(pathobj,svgdiv,scalefactor,offsetx,offsety,x,y,h){
    var lineWidth = 1;
    var absxscaled = (pathobj.cx-x) * scalefactor;
    var absyscaled = (h - pathobj.cy) * scalefactor;
    var absradius = pathobj.r * scalefactor;

    absxscaled += offsetx;
    absyscaled += offsety;

    var strokecolor = pathobj.strokecolor;
    var fillcolor = pathobj.fillcolor;


    if(strokecolor == backgroundColor){
        if(backgroundColor == "#FFFFFF"){
            strokecolor = "#000000";
            fillcolor = "#000000";
        }
        if(backgroundColor == "#000000"){
            strokecolor = "#FFFFFF";
            fillcolor = "#000000";
        }
    }

    if (pathobj.linewidth * scalefactor < 1){
        lineWidth = 1;
    }else{
        lineWidth = pathobj.linewidth * scalefactor;
    }

    //ctxsvg.circle(absxscaled, absyscaled, absradius, 0, 2 * Math.PI, false);

    if (pathobj.filled ==1){
        //this.circle = ctxsvg.circle(absradius*2).cx(absxscaled.toFixed(2)).cy(absyscaled.toFixed(2)).fill({ color: this.fillcolor }).stroke({ color: this.strokecolor, width: lineWidth });
        //circle(150, 150, 100)
        var svgpath = svgdiv.circle(absxscaled.toFixed(2),absyscaled.toFixed(2),absradius.toFixed(2)).attr({
            fill: fillcolor,
            stroke: strokecolor,
            strokeWidth: lineWidth
        });

        //circle.('fill', this.fillcolor);
    }else{
        //this.circle = ctxsvg.circle(absradius*2).cx(absxscaled.toFixed(2)).cy(absyscaled.toFixed(2)).stroke({ color: this.strokecolor, width: lineWidth });


        svgpath = svgdiv.circle(absxscaled.toFixed(2),absyscaled.toFixed(2),absradius.toFixed(2)).attr({
            fill: 'none',
            stroke: strokecolor,
            strokeWidth: lineWidth
        });

    }


}


function svgline(pathobj,svgdiv,scalefactor,offsetx,offsety,x,y,h){
    var lineWidth = 1;
    var x1scaled = (pathobj.x1-x) * scalefactor;
    var y1scaled = (h - pathobj.y1) * scalefactor;
    var x2scaled = (pathobj.x2-x) * scalefactor;
    var y2scaled = (h - pathobj.y2) * scalefactor;

    x1scaled += offsetx;
    y1scaled += offsety;
    x2scaled += offsetx;
    y2scaled += offsety;

    var strokecolor = pathobj.strokecolor;



    if(strokecolor == backgroundColor){
        if(backgroundColor == "#FFFFFF"){
            strokecolor = "#000000";

        }
        if(backgroundColor == "#000000"){
            strokecolor = "#FFFFFF";

        }
    }

    if (pathobj.linewidth * scalefactor < 1){
        lineWidth = 1;
    }else{
        lineWidth = pathobj.linewidth * scalefactor;
    }

    //this.line = ctxsvg.line(x1scaled.toFixed(2), y1scaled.toFixed(2), x2scaled.toFixed(2), y2scaled.toFixed(2)).stroke({ color: this.strokecolor, width: lineWidth });

    //line(50, 50, 100, 100);

    var line = svgdiv.line(x1scaled.toFixed(2), y1scaled.toFixed(2), x2scaled.toFixed(2), y2scaled.toFixed(2)).attr({
        stroke: strokecolor,
        'stroke-linecap':'round',
        strokeWidth: lineWidth
    });


}


function drawallsvg(VectorPageObj,svgdiv,scalefactor,offsetx,offsety,pagenum){




    for (var i=0; i<VectorPageObj.pathlist.length;i++){
        var localoffsetx = VectorPageObj.x * scalefactor;
        var localoffsety = VectorPageObj.x * scalefactor;

        if (VectorPageObj.pathlist[i].layerstate == 1 && VectorPageObj.pathlist[i].blockstate == 1){

            if(VectorPageObj.pathlist[i].type == "image"){
                svgimage(VectorPageObj.pathlist[i],svgdiv,scalefactor,offsetx,offsety,VectorPageObj.x, VectorPageObj.y,VectorPageObj.h);

            }
            if(VectorPageObj.pathlist[i].type == "path"){
                svgpath(VectorPageObj.pathlist[i],svgdiv,scalefactor,offsetx,offsety,VectorPageObj.x, VectorPageObj.y,VectorPageObj.h);

            }

            if(VectorPageObj.pathlist[i].type == "circle"){

                svgcircle(VectorPageObj.pathlist[i],svgdiv,scalefactor,offsetx,offsety,VectorPageObj.x, VectorPageObj.y,VectorPageObj.h);
            }

            if(VectorPageObj.pathlist[i].type == "line"){

                svgline(VectorPageObj.pathlist[i],svgdiv,scalefactor,offsetx,offsety,VectorPageObj.x, VectorPageObj.y,VectorPageObj.h);

            }
            if(VectorPageObj.pathlist[i].type == "text"){

                svgtext(VectorPageObj.pathlist[i],svgdiv,scalefactor,offsetx,offsety,VectorPageObj.x, VectorPageObj.y,VectorPageObj.h);

            }



        }

    }

    aDrawpages[pagenum] = true;

    doprintcheck();


}

function dimvaluedraw(svgctx,markupobject,scalefactor){
    var dimwidth = markupobject.wscaled - markupobject.xscaled;
    var dimheight = markupobject.hscaled - markupobject.yscaled;
    var dimdiag = markupobject.getdiag(dimwidth,dimheight);

    var dimanglerad = Math.atan2(dimheight,dimwidth);

    var scaletextheight = markupobject.measuretextheight*scalefactor;

    var dimtextx = markupobject.xscaled + (dimwidth / 2);// - (dimtextwidth / 2);
    var dimtexty = markupobject.yscaled + (dimheight / 2) + (scaletextheight / 2);// - (markupobject.measuretextheight / 2);



    var txtbox = svgctx.rect(markupobject.xscaled,markupobject.yscaled,100,100).attr({
        fill: "white",
        stroke: markupobject.color,
        strokeWidth: 1
    });

    var dimtext = svgctx.text(dimtextx,dimtexty,markupobject.dimtext).attr({
        fontFamily: 'Helvetica',
        'font-size': scaletextheight
    });

    //textwidth = dimtext.node.clientWidth;

    var bbox = dimtext.getBBox();
    var textwidth = bbox.width;
    var textheight = bbox.height;


    dimtext.attr({
        x : (dimtextx - (textwidth / 2))
    });

    var yrect = dimtexty - scaletextheight;
    txtbox.attr({
        width: (textwidth + (20*scalefactor)),
        height: (textheight + (10*scalefactor)),
        x : ((dimtextx -(10*scalefactor))-(textwidth / 2)),
        y : (yrect-(5*scalefactor))
    });


    bbox = txtbox.getBBox();
    var labelwidth = bbox.width;
    var labelheight = bbox.height;
    var lblcenterx = bbox.cx;
    var lblcentery = bbox.cy;




    var dimgroup = svgctx.group( txtbox,dimtext);

    if (dimanglerad > (Math.PI*0.5) || dimanglerad < -(Math.PI*0.5) ){
        dimanglerad += Math.PI;
        var rotation = dimanglerad * (180 / Math.PI);
    }else{
        rotation = dimanglerad * (180 / Math.PI);
    }

    var tx = (labelwidth / 2);
    var ty = (labelheight / 2);
    var trstr = 'r' + rotation + ',' + lblcenterx + ',' + lblcentery;
    dimgroup.transform(trstr);


    /*if(markupobj.rotation != 0){
        var rotation = markupobj.rotation * (180 / Math.PI);
        var centerx = markupobj.xscaled + (markupobj.wscaled / 2);
        var centery = markupobj.yscaled + markupobj.hscaled / 2;
        var trstr = 'r' + dimanglerad + ',' + centerx + ',' + centery;
        stampgroup.transform(trstr);
    }*/

    //ctx.fillRect(dimtextx-(10*scalefactor), yrect-(5*scalefactor),dimtextwidth + (20*scalefactor),scaletextheight + (10*scalefactor));
    //ctx.textAlign  = "start";
    //var scaletextheight = this.measuretextheight*scalefactor;
    //ctx.font = this.measuretextheight + "pt " + "Helvetica";
    //var dimt = ctx.measureText(this.dimtext);
    //var dimtextwidth = dimt.width;


    //var yrect = dimtexty - scaletextheight;
    //ctx.fillStyle = "white";
    //ctx.fillRect(dimtextx-(10*scalefactor), yrect-(5*scalefactor),dimtextwidth + (20*scalefactor),scaletextheight + (10*scalefactor));


    //ctx.fillStyle = color;
    //ctx.fillText(markupobject.dimtext, dimtextx, dimtexty);


    //ctx.restore();

}

/*dimvaluedraw=function(svgctx,markupobject,scalefactor){
    //ctx.save();

    var dimwidth = markupobject.width - markupobject.x;
    var dimheight = markupobject.height - markupobject.y;
    var dimdiag = markupobject.getdiag(dimwidth,dimheight);

    var dimtextx = markupobject.x + (dimwidth / 2);// - (dimtextwidth / 2);
    var dimtexty = markupobject.y + (dimheight / 2);// - (markupobject.measuretextheight / 2);


    var txtbox = svgctx.rect(markupobject.x,markupobject.y,100,100).attr({
        fill: "white",
        stroke: "white",
        strokeWidth: 1
    });

    var dimtext = svgctx.text(dimtextx,dimtexty,markupobject.dimtext).attr({
        fontFamily: 'Helvetica',
        'font-size': markupobject.measuretextheight
    });

    txtbox.attr({
        width: (dimtext.node.clientWidth + (20*scalefactor)),
        height: (dimtext.node.clientHeight + (10*scalefactor)),
        x : (dimtext.x -(10*scalefactor)),
        y : ((dimtext.y - (dimtext.node.clientHeight*scalefactor))-(5*scalefactor))
    });


    //ctx.textAlign  = "start";
    //var scaletextheight = this.measuretextheight*scalefactor;
    //ctx.font = this.measuretextheight + "pt " + "Helvetica";
    //var dimt = ctx.measureText(this.dimtext);
    //var dimtextwidth = dimt.width;


    //var yrect = dimtexty - scaletextheight;
    //ctx.fillStyle = "white";
    //ctx.fillRect(dimtextx-(10*scalefactor), yrect-(5*scalefactor),dimtextwidth + (20*scalefactor),scaletextheight + (10*scalefactor));


    //ctx.fillStyle = color;
    //ctx.fillText(markupobject.dimtext, dimtextx, dimtexty);


    //ctx.restore();
};*/




function markupArrowsvg(svgctx,markupobj,lineWidth){
    var arrowangle = 22.5;
    var arrowlength = 30;

    var arrwidth = markupobj.wscaled - markupobj.xscaled;
    var arrheight = markupobj.hscaled - markupobj.yscaled;

    var baranglerad = 90 / (180/Math.PI);
    var arrowanglerad = arrowangle /(180/Math.PI);

    //angle of diagonal in radians
    var arrdiagrad = Math.atan2(arrheight,arrwidth);


    //arrowhead length
    var arrowhead = Math.abs(arrowlength/Math.cos(arrowanglerad));

    //bar length
    var barhead = arrowlength / 2;

    //negative angle of diagonal
    var arrangleradneg = Math.PI + arrdiagrad;
    //angle of end barb lines relative to line
    var aarrowupperangle = arrangleradneg + arrowanglerad;
    var aarrowlowerangle = arrangleradneg - arrowanglerad;

    //angle of end bar lines relative to line
    var abarupperangle = arrangleradneg + baranglerad;
    var abarlowerangle = arrangleradneg - baranglerad;


    //calculated points of the line end barbs
    var arrtopx = markupobj.wscaled + Math.cos(aarrowupperangle)*arrowhead;
    var arrtopy = markupobj.hscaled + Math.sin(aarrowupperangle)*arrowhead;
    var arrbotx = markupobj.wscaled + Math.cos(aarrowlowerangle)*arrowhead;
    var arrboty = markupobj.hscaled + Math.sin(aarrowlowerangle)*arrowhead;

    //calculated points of the line end bar
    var bartopx = markupobj.wscaled + Math.cos(abarupperangle)*barhead;
    var bartopy = markupobj.hscaled + Math.sin(abarupperangle)*barhead;
    var barbotx = markupobj.wscaled + Math.cos(abarlowerangle)*barhead;
    var barboty = markupobj.hscaled + Math.sin(abarlowerangle)*barhead;




    //angle of start barb lines relative to line
    var asarrowupperangle = arrdiagrad + arrowanglerad;
    var asarrowlowerangle = arrdiagrad - arrowanglerad;

    //angle of start bar lines relative to line
    var asbarupperangle = arrdiagrad + baranglerad;
    var asbarlowerangle = arrdiagrad - baranglerad;


    //calculated points of the line start barbs
    var arrstopx = markupobj.xscaled + Math.cos(asarrowupperangle)*arrowhead;
    var arrstopy = markupobj.yscaled + Math.sin(asarrowupperangle)*arrowhead;
    var arrsbotx = markupobj.xscaled + Math.cos(asarrowlowerangle)*arrowhead;
    var arrsboty = markupobj.yscaled + Math.sin(asarrowlowerangle)*arrowhead;

    //calculated points of the line start bar
    var barstopx = markupobj.xscaled + Math.cos(asbarupperangle)*barhead;
    var barstopy = markupobj.yscaled + Math.sin(asbarupperangle)*barhead;
    var barsbotx = markupobj.xscaled + Math.cos(asbarlowerangle)*barhead;
    var barsboty = markupobj.yscaled + Math.sin(asbarlowerangle)*barhead;

    //ctx.beginPath();


    //ctx.moveTo(x, y);

    var strokecolor = rgb2hex(markupobj.strokecolor);


    var svgline = svgctx.line(markupobj.xscaled.toFixed(2), markupobj.yscaled.toFixed(2), markupobj.wscaled.toFixed(2), markupobj.hscaled.toFixed(2)).attr({
        stroke: strokecolor,
        'stroke-linecap':'round',
        strokeWidth: lineWidth
    });


    //ctx.lineTo(width, height);
    //ctx.closePath();
    //ctx.stroke();
    if (markupobj.type == 6){
        var type = markupobj.subtype;
    }else if (markupobj.type == 7){
        type = markupobj.subtype + 4;
    }



    if (type == 0){

        //ctx.beginPath();
        //ctx.moveTo(width, height);
        var pathstrah = 'M ' + markupobj.wscaled + ' ' + markupobj.hscaled;
        pathstrah += ' L ' + arrtopx + ' ' + arrtopy;
        //ctx.lineTo(arrtopx, arrtopy);
        //ctx.closePath();
        //ctx.stroke();

        //ctx.beginPath();
        //ctx.moveTo(width, height);
        pathstrah += ' M ' + markupobj.wscaled + ' ' + markupobj.hscaled;
        pathstrah += ' L ' + arrbotx + ' ' + arrboty;
        //ctx.lineTo(arrbotx, arrboty);

        var svgpath = svgctx.path(pathstrah).attr({
            fill: 'none',
            stroke: strokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });


        //ctx.closePath();
        //ctx.stroke();

    }
    if (type == 1){

        //ctx.beginPath();
        //ctx.moveTo(width, height);
        var pathstrac = 'M ' + markupobj.wscaled + ' ' + markupobj.hscaled;
        pathstrac += ' L ' + arrtopx + ' ' + arrtopy;
        pathstrac += ' L ' + arrbotx + ' ' + arrboty + ' z';

        svgpath = svgctx.path(pathstrac).attr({
            fill: strokecolor,
            stroke: strokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });


        //ctx.lineTo(arrtopx, arrtopy);
        //ctx.lineTo(arrbotx, arrboty);
        //ctx.closePath();
        //ctx.stroke();
        //ctx.fill();

    }
    if (type == 2){

        //ctx.beginPath();
        //ctx.moveTo(x, y);
        //ctx.lineTo(arrstopx, arrstopy);
        var pathstrt2a1 = 'M ' + markupobj.xscaled + ' ' + markupobj.yscaled;
        pathstrt2a1 += ' L ' + arrstopx + ' ' + arrstopy;


        //ctx.closePath();
        //ctx.stroke();

        //ctx.beginPath();
        //ctx.moveTo(x, y);
        //ctx.lineTo(arrsbotx, arrsboty);
        pathstrt2a1 += ' M ' + markupobj.xscaled + ' ' + markupobj.yscaled;
        pathstrt2a1 += ' L ' + arrsbotx + ' ' + arrsboty;


        var svgpathau = svgctx.path(pathstrt2a1).attr({
            fill: 'none',
            stroke: strokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });

        //ctx.closePath();
        //ctx.stroke();


        //ctx.beginPath();
        //ctx.moveTo(width, height);
        var pathstrt2a2 = 'M ' + markupobj.wscaled + ' ' + markupobj.hscaled;
        pathstrt2a2 += ' L ' + arrtopx + ' ' + arrtopy;

        //ctx.lineTo(arrtopx, arrtopy);
        //ctx.closePath();
        //ctx.stroke();

        //ctx.beginPath();
        //ctx.moveTo(width, height);
        //ctx.lineTo(arrbotx, arrboty);
        pathstrt2a2 += ' M ' + markupobj.wscaled + ' ' + markupobj.hscaled;
        pathstrt2a2 += ' L ' + arrbotx + ' ' + arrboty;


        var svgpathal = svgctx.path(pathstrt2a2).attr({
            fill: 'none',
            stroke: strokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });


        //ctx.closePath();
        //ctx.stroke();

    }

    if (type == 3){

        //ctx.beginPath();
        //ctx.moveTo(x, y);
        //ctx.lineTo(arrstopx, arrstopy);
        //ctx.lineTo(arrsbotx, arrsboty);

        var pathstrt3a1 = 'M ' + markupobj.xscaled + ' ' + markupobj.yscaled;
        pathstrt3a1 += ' L ' + arrstopx + ' ' + arrstopy;
        pathstrt3a1 += ' L ' + arrsbotx + ' ' + arrsboty + ' z';

        var uasvgpath = svgctx.path(pathstrt3a1).attr({
            fill: strokecolor,
            stroke: strokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });


        //ctx.closePath();
        //ctx.fill();
        //ctx.stroke();


        //ctx.beginPath();
        //ctx.moveTo(width, height);
        //ctx.lineTo(arrtopx, arrtopy);
        //ctx.lineTo(arrbotx, arrboty);
        var pathstrt3a2 = 'M ' + markupobj.wscaled + ' ' + markupobj.hscaled;
        pathstrt3a2 += ' L ' + arrtopx + ' ' + arrtopy;
        pathstrt3a2 += ' L ' + arrbotx + ' ' + arrboty + ' z';

        //ctx.closePath();
        //ctx.fill();
        //ctx.stroke();

        var lasvgpath = svgctx.path(pathstrt3a2).attr({
            fill: strokecolor,
            stroke: strokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });


    }
    //bars both ends
    if (type == 4){


        /*ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(barstopx, barstopy);
        ctx.closePath();
        ctx.stroke();*/

        var pathstrt4a1 = 'M ' + markupobj.xscaled + ' ' + markupobj.yscaled;
        pathstrt4a1 += ' L ' + barstopx + ' ' + barstopy;



        /*ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(barsbotx, barsboty);
        ctx.closePath();
        ctx.stroke();*/

        pathstrt4a1 += ' M ' + markupobj.xscaled + ' ' + markupobj.yscaled;
        pathstrt4a1 += ' L ' + barsbotx + ' ' + barsboty;


        uasvgpath = svgctx.path(pathstrt4a1).attr({
            fill: 'none',
            stroke: strokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });


        /*ctx.beginPath();
        ctx.moveTo(width, height);
        ctx.lineTo(bartopx, bartopy);
        ctx.closePath();
        ctx.stroke();*/

        var pathstrt4a2 = 'M ' + markupobj.wscaled + ' ' + markupobj.hscaled;
        pathstrt4a2 += ' L ' + bartopx + ' ' + bartopy;


        /*ctx.beginPath();
        ctx.moveTo(width, height);
        ctx.lineTo(barbotx, barboty);
        ctx.closePath();
        ctx.stroke();*/

        pathstrt4a2 += 'M ' + markupobj.wscaled + ' ' + markupobj.hscaled;
        pathstrt4a2 += ' L ' + barbotx + ' ' + barboty;

        lasvgpath = svgctx.path(pathstrt4a2).attr({
            fill: 'none',
            stroke: strokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });



    }
    //bars and open arrows
    if (type == 5){

        //first arrow head
        /*ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(arrstopx, arrstopy);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(arrsbotx, arrsboty);
        ctx.closePath();
        ctx.stroke();*/

        var pathstrt5a1 = 'M ' + markupobj.xscaled + ' ' + markupobj.yscaled;
        pathstrt5a1 += ' L ' + arrstopx + ' ' + arrstopy;

        pathstrt5a1 += ' M ' + markupobj.xscaled + ' ' + markupobj.yscaled;
        pathstrt5a1 += ' L ' + arrsbotx + ' ' + arrsboty;

        uasvgpath = svgctx.path(pathstrt5a1).attr({
            fill: 'none',
            stroke: strokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });


        //second arrow head
        /*ctx.beginPath();
        ctx.moveTo(width, height);
        ctx.lineTo(arrtopx, arrtopy);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width, height);
        ctx.lineTo(arrbotx, arrboty);
        ctx.closePath();
        ctx.stroke();*/

        var pathstrt5a2 = 'M ' + markupobj.wscaled + ' ' + markupobj.hscaled;
        pathstrt5a2 += ' L ' + arrtopx + ' ' + arrtopy;

        pathstrt5a2 += ' M ' + markupobj.wscaled + ' ' + markupobj.hscaled;
        pathstrt5a2 += ' L ' + arrbotx + ' ' + arrboty;

        lasvgpath = svgctx.path(pathstrt5a2).attr({
            fill: 'none',
            stroke: strokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });


        //first arrow bar
        /*ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(barstopx, barstopy);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(barsbotx, barsboty);
        ctx.closePath();
        ctx.stroke();*/

        var pathstrt5b1 = 'M ' + markupobj.xscaled + ' ' + markupobj.yscaled;
        pathstrt5b1 += ' L ' + barstopx + ' ' + barstopy;

        pathstrt5b1 += ' M ' + markupobj.xscaled + ' ' + markupobj.yscaled;
        pathstrt5b1 += ' L ' + barsbotx + ' ' + barsboty;

        lasvgpath = svgctx.path(pathstrt5b1).attr({
            fill: 'none',
            stroke: strokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });


        //second arrow bar
        /*ctx.beginPath();
        ctx.moveTo(width, height);
        ctx.lineTo(bartopx, bartopy);
        ctx.closePath();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(width, height);
        ctx.lineTo(barbotx, barboty);
        ctx.closePath();
        ctx.stroke();*/


        var pathstrt5b2 = 'M ' + markupobj.wscaled + ' ' + markupobj.hscaled;
        pathstrt5b2 += ' L ' + bartopx + ' ' + bartopy;

        pathstrt5b2 += ' M ' + markupobj.wscaled + ' ' + markupobj.hscaled;
        pathstrt5b2 += ' L ' + barbotx + ' ' + barboty;

        lasvgpath = svgctx.path(pathstrt5b2).attr({
            fill: 'none',
            stroke: strokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });


    }

    if(!markupobj.drawn){
        markupobj.drawn = true;
        doprintcheck();
    }


}


function markupOvalsvg(svgctx,markupobj,lineWidth){
    var centerx = markupobj.xscaled + (markupobj.wscaled/2);
    var centery = markupobj.yscaled + (markupobj.hscaled/2);
    var radiusx = markupobj.wscaled/2;
    var radiusy = markupobj.hscaled/2;


    var fillcolor = rgb2hex(markupobj.fillcolor);
    var opacity = rgba2transp(markupobj.fillcolor);
    var strokecolor = rgb2hex(markupobj.strokecolor);
    //var opacity = markupobj.transparency;
    //opacity /= 100;


    //markupobject.fillcolor, markupobject.strokecolor

    if (markupobj.alternative == 0){
        var ellipse = svgctx.ellipse(centerx, centery, radiusx, radiusy).attr({
            fill: 'none',
            stroke: strokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });

        //markupobject.Rect(ctx,this.x, this.y,this.w,this.h,this.linewidth,false,true,this.color,this.color);
    }
    if (markupobj.alternative == 1){
        ellipse = svgctx.ellipse(centerx, centery, radiusx, radiusy).attr({
            fill: fillcolor,
            'fill-opacity':opacity,
            stroke: strokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });

        //markupobject.Rect(ctx,this.x, this.y,this.w,this.h,this.linewidth,true,true,this.color,this.color);

    }
    if (markupobj.alternative == 2){
        ellipse = svgctx.ellipse(centerx, centery, radiusx, radiusy).attr({
            fill: 'white',
            stroke: markupobj.color,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });

        //markupobject.Rect(ctx,this.x, this.y,this.w,this.h,this.linewidth,true,true,"white",this.color);
    }
    if(markupobj.alternative >= 3){
        //var ptrn = ctx.createPattern(pattern,'repeat');

        ellipse = svgctx.ellipse(centerx, centery, radiusx, radiusy).attr({
            fill: getHatchsvg(svgctx,markupobj.alternative - 3,markupobj.color),
            stroke: markupobj.color,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });

        //markupobject.Rect(ctx,this.x, this.y,this.w,this.h,this.linewidth,true,true,ptrn,this.color);
    }

    if(markupobj.rotation !=0){
        var rotation = markupobj.rotation * (180 / Math.PI);
        var trstr = 'r' + rotation + ',' + centerx + ',' + centery;
        ellipse.transform(trstr);

        /*var trstr = 'r' + markupobj.rotation + ',' + centerx + ',' + centery;
        rectangle.transform(trstr);*/

    }


    if(!markupobj.drawn){
        markupobj.drawn = true;
        doprintcheck();
    }


}

function markupStampsvg(svgctx,markupobj,lineWidth,scalefactor){

    var fillcolor = rgb2hex(markupobj.fillcolor);
    var opacity = rgba2transp(markupobj.fillcolor);
    var strokecolor = rgb2hex(markupobj.strokecolor);
    //var opacity = transp;
    //opacity /= 100;


    var tx = 0;
    var ty = 0;

    var rrectangle = svgctx.rect(markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled,10*scalefactor,10*scalefactor).attr({
        fill: fillcolor,
        'fill-opacity': opacity,
        stroke: strokecolor,
        'stroke-linecap':'round',
        'stroke-linejoin':'round',
        strokeWidth: 3*scalefactor
    });



    //var textstampscaled = markupobj.textheight * scalefactor;
    var textstampscaled = markupobj.font.height * scalefactor;
    var textsmallstampscaled = markupobj.stampsmalltheight * scalefactor;

    var Displayname = opener.RxCore.printhelper().getDisplayName(markupobj.signature);

    var datetext = markupobj.GetDateTime(false);
    var smalltext = "By " + Displayname + "," + " ";
    smalltext = smalltext + datetext;

    if(markupobj.subtype != 100){
        markupobj.text = Stamplist[markupobj.subtype];
    }
    if (Stamplist[markupobj.subtype] == 'Date') {
      markupobj.text = markupobj.GetDateTime(false);
    }
    if (Stamplist[markupobj.subtype] == 'User Name') {
      markupobj.text = markupobj.GetDisplayName(markupobj.signature);
    }
    tx = markupobj.xscaled+(markupobj.wscaled/2);

    if(markupobj.alternative == 0){
        ty = markupobj.yscaled + ((markupobj.hscaled / 4) + (textstampscaled / 2));

    }else{
        ty = markupobj.yscaled + (markupobj.hscaled / 2);
        ty += (textstampscaled / 4);
    }





    var stampmaintext = svgctx.text(tx,ty,markupobj.text).attr({
        fill : markupobj.strokecolor,
        fontFamily: 'Times New Roman',
        'font-weight':'bold',
        'font-size': textstampscaled * 1.33
    });

    var bbox = stampmaintext.getBBox();
    var textwidth = bbox.width;
    var textheight = bbox.height;



    //var textwidth = stampmaintext.node.clientWidth;

    stampmaintext.attr({
        x : (tx - (textwidth / 2))
    });

    if(markupobj.alternative == 0 ){
        ty = markupobj.yscaled +((markupobj.hscaled/4)*3);

        var stampsmalltext = svgctx.text(tx,ty,smalltext).attr({
            fill : markupobj.color,
            fontFamily: 'Times New Roman',
            'font-weight':'bold',
            'font-size': textsmallstampscaled * 1.33
        });

        bbox = stampsmalltext.getBBox();
        textwidth = bbox.width;
        textheight = bbox.height;

        //textwidth = stampsmalltext.node.clientWidth;

        stampsmalltext.attr({
            x : (tx - (textwidth / 2))
        });
        var stampgroup = svgctx.group( rrectangle,stampmaintext, stampsmalltext);
    }else{
        stampgroup = svgctx.group( rrectangle,stampmaintext);
    }



    if(markupobj.rotation != 0){
        var rotation = markupobj.rotation * (180 / Math.PI);
        var centerx = markupobj.xscaled + (markupobj.wscaled / 2);
        var centery = markupobj.yscaled + markupobj.hscaled / 2;
        var trstr = 'r' + rotation + ',' + centerx + ',' + centery;
        stampgroup.transform(trstr);
    }


    if(!markupobj.drawn){
        markupobj.drawn = true;
        doprintcheck();
    }


}

function clipRect(svgctx,markupobj,lineWidth,scalefactor){
    var rectangle = svgctx.rect(markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled).attr({
            fill : 'none',
            stroke : 'none'
        });
    
    
    
    if(markupobj.rotation !=0){
        var centerx = markupobj.xscaled + (markupobj.wscaled / 2);
        var centery = markupobj.yscaled + markupobj.hscaled / 2;
        var rotation = markupobj.rotation * (180 / Math.PI);
        var trstr = 'r' + rotation + ',' + centerx + ',' + centery;
        rectangle.transform(trstr);
   }
   
    //var mask = svgctx.mask(rectangle);
    return rectangle;

}

function markupRectsvg(svgctx,markupobj,lineWidth,scalefactor){

    //markupobject.fillcolor, markupobject.strokecolor

    var fillcolor = rgb2hex(markupobj.fillcolor);
    var opacity = rgba2transp(markupobj.fillcolor);
    var strokecolor = rgb2hex(markupobj.strokecolor);
    //var opacity = markupobj.transparency;
    
    //opacity /= 100;

    if(markupobj.type == 9){


        //opacity = markupobj.fillcolor.replace(/^.*,(.+)\)/,'$1');
        //console.log(opacity);

        rectangle = svgctx.rect(markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled).attr({
            fill: fillcolor,
            'fill-opacity': opacity,
            stroke: strokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });

        return rectangle;
    }else{
        if (markupobj.subtype == 3){
            var rectangle = svgctx.rect(markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled).attr({
                fill: fillcolor,
                'opacity': opacity,
                stroke: fillcolor,
                'stroke-linecap':'round',
                'stroke-linejoin':'round',
                strokeWidth: lineWidth
            });
            //markupobject.fillcolor, markupobject.fillcolor
        }


        if (markupobj.subtype == 0){

            if (markupobj.alternative == 0){
                rectangle = svgctx.rect(markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled).attr({
                    fill: 'none',
                    stroke: strokecolor,
                    'stroke-linecap':'round',
                    'stroke-linejoin':'round',
                    strokeWidth: lineWidth
                });

                //markupobject.Rect(ctx,this.x, this.y,this.w,this.h,this.linewidth,false,true,this.color,this.color);
            }
            if (markupobj.alternative == 1){
                rectangle = svgctx.rect(markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled).attr({
                    fill: fillcolor,
                    'fill-opacity': opacity,
                    stroke: strokecolor,
                    'stroke-linecap':'round',
                    'stroke-linejoin':'round',
                    strokeWidth: lineWidth
                });

                //markupobject.Rect(ctx,this.x, this.y,this.w,this.h,this.linewidth,true,true,this.color,this.color);

            }
            if (markupobj.alternative == 2){
                rectangle = svgctx.rect(markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled).attr({
                    fill: 'white',
                    stroke: markupobj.color,
                    'stroke-linecap':'round',
                    'stroke-linejoin':'round',
                    strokeWidth: lineWidth
                });

                //markupobject.Rect(ctx,this.x, this.y,this.w,this.h,this.linewidth,true,true,"white",this.color);
            }
            if(markupobj.alternative >= 3){
                //var ptrn = ctx.createPattern(pattern,'repeat');
                rectangle = svgctx.rect(markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled).attr({
                    fill: getHatchsvg(svgctx,markupobj.alternative - 3,markupobj.color),
                    stroke: markupobj.color,
                    'stroke-linecap':'round',
                    'stroke-linejoin':'round',
                    strokeWidth: lineWidth
                });

                //markupobject.Rect(ctx,this.x, this.y,this.w,this.h,this.linewidth,true,true,ptrn,this.color);
            }


        }
        if (markupobj.subtype == 1){

            var radius = 10;

            if(markupobj.alternative == 0){
                var rrectangle = svgctx.rect(markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled,10,10).attr({
                    fill: 'none',
                    stroke: markupobj.color,
                    'stroke-linecap':'round',
                    'stroke-linejoin':'round',
                    strokeWidth: lineWidth
                });
            }
            if (markupobj.alternative == 1){
                rrectangle = svgctx.rect(markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled,10,10).attr({
                    fill: markupobj.color,
                    stroke: markupobj.color,
                    'stroke-linecap':'round',
                    'stroke-linejoin':'round',
                    strokeWidth: lineWidth
                });

                //markupobject.roundedRect(ctx,this.x,this.y,this.w,this.h,0,radius,this.linewidth,true,true,this.color,this.color);

            }
            if (markupobj.alternative == 2){
                rrectangle = svgctx.rect(markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled,10,10).attr({
                    fill: 'white',
                    stroke: markupobj.color,
                    'stroke-linecap':'round',
                    'stroke-linejoin':'round',
                    strokeWidth: lineWidth
                });

                //markupobject.roundedRect(ctx,this.x,this.y,this.w,this.h,0,radius,this.linewidth,true,true,"white",this.color);
            }
            if (markupobj.alternative >= 3){
                rrectangle = svgctx.rect(markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled,10,10).attr({
                    fill: getHatchsvg(svgctx,markupobj.alternative - 3,markupobj.color),
                    stroke: markupobj.color,
                    'stroke-linecap':'round',
                    'stroke-linejoin':'round',
                    strokeWidth: lineWidth
                });

                //markupobject.roundedRect(ctx,this.x,this.y,this.w,this.h,0,radius,this.linewidth,true,true,ptrn,this.color);
            }



        }
    }


    //svgctx,x,y,width,height,linewidth,fill,stroke,fillcolor,strokecolor



    if(markupobj.rotation !=0){
        var centerx = markupobj.xscaled + (markupobj.wscaled / 2);
        var centery = markupobj.yscaled + markupobj.hscaled / 2;
        var rotation = markupobj.rotation * (180 / Math.PI);
        var trstr = 'r' + rotation + ',' + centerx + ',' + centery;
        if( markupobj.type == 12 || markupobj.subtype == 1 ){
            rrectangle.transform(trstr);
        }else{
            rectangle.transform(trstr);
        }



    }



    if(!markupobj.drawn){
        markupobj.drawn = true;
        doprintcheck();
    }

}


function markuppolygonsvg(svgctx,markupobj,linewidth,fill,stroke,fillcolor,strokecolor,scalefactor,pxoffset,pyoffset){
    var counter = 0;

    var localfillcolor = rgb2hex(markupobj.fillcolor);
    var localstrokecolor = rgb2hex(markupobj.strokecolor);
    var opacity = rgba2transp(markupobj.fillcolor);
    //var opacity = markupobj.transparency;
    //opacity /= 100;


    var xscaled = (markupobj.points[0].x - markupobj.xoffset) * scalefactor;
    var yscaled = (markupobj.points[0].y - markupobj.yoffset)  * scalefactor;


    xscaled += pxoffset;
    yscaled += pyoffset;

    var lineWidth = linewidth * scalefactor;


    var pathstr = "M " + xscaled + " " + yscaled;
    for (counter=1;counter<markupobj.points.length;counter++){

        xscaled = (markupobj.points[counter].x - markupobj.xoffset) * scalefactor;
        yscaled = (markupobj.points[counter].y - markupobj.yoffset) * scalefactor;
        xscaled += pxoffset;
        yscaled += pyoffset;

        pathstr += " L " + xscaled + " " + yscaled;

    }

    pathstr += ' z';

    if(fill){
        var svgpath = svgctx.path(pathstr).attr({
            fill: localfillcolor,
            'fill-opacity':opacity,
            stroke: localstrokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });

    }else{
        svgpath = svgctx.path(pathstr).attr({
            fill: 'none',
            stroke: localstrokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });

    }


    /*if(stroke){
        svgpath = svgctx.path(pathstr).stroke({ color: strokecolor, width: linewidth });
    }*/


    if(!markupobj.drawn){
        if( markupobj.type != 8){
            markupobj.drawn = true;
            doprintcheck();
        }
    }
}
function markuppolycurvesvg(svgctx,markupobj,linewidth,strokecolor,scalefactor,pxoffset,pyoffset){

    var counter = 0;
    var controlx = 0;
    var controly = 0;


    var xscaled = (markupobj.points[0].x - markupobj.xoffset) * scalefactor;
    var yscaled = (markupobj.points[0].y - markupobj.yoffset)  * scalefactor;


    xscaled += pxoffset;
    yscaled += pyoffset;

    var lineWidth = linewidth * scalefactor;

    var pathstr = "M " + xscaled + " " + yscaled;

    for (var counter=1;counter<markupobj.points.length;counter++){

        xscaled = (markupobj.points[counter].x - markupobj.xoffset) * scalefactor;
        yscaled = (markupobj.points[counter].y - markupobj.yoffset) * scalefactor;
        xscaled += pxoffset;
        yscaled += pyoffset;

        if (isEven(counter)){
            pathstr += " Q " + controlx + " " + controly + " " + xscaled + " " + yscaled;
        }else{
            controlx = xscaled;
            controly = yscaled;
        }



    }

    var svgpath = svgctx.path(pathstr).attr({
        fill: 'none',
        stroke: strokecolor,
        'stroke-linecap':'round',
        'stroke-linejoin':'round',
        strokeWidth: lineWidth
    });



    if(!markupobj.drawn){
        markupobj.drawn = true;
        doprintcheck();
    }


    /*
     var counter = 0;
     var control = new point();
     var start = new point();
     var xscaled = (this.points[0].x - this.xoffset) * scalefactor;
     var yscaled = (this.points[0].y - this.yoffset)  * scalefactor;




     ctx.save();

     ctx.strokeStyle = strokecolor;



     ctx.beginPath();

     //      ctx.moveTo(markupobject.points[0].x, markupobject.points[0].y);
     ctx.moveTo(xscaled, yscaled);
     start.x = xscaled;
     start.y = yscaled;

     for (counter=1;counter<markupobject.points.length;counter++){

     xscaled = (this.points[counter].x - this.xoffset) * scalefactor;
     yscaled = (this.points[counter].y - this.yoffset) * scalefactor;

     if (isEven(counter)){

     ctx.moveTo(start.x,start.y);
     ctx.quadraticCurveTo(control.x, control.y, xscaled, yscaled);
     start.x = xscaled;
     start.y = yscaled;

     }else{
     //dont draw if converted to curve.
     if (counter + 1 == markupobject.points.length){
     ctx.lineTo(xscaled, yscaled);
     }
     control.x = xscaled;
     control.y = yscaled;

     }

     //ctx.lineTo(xscaled, yscaled);

     }
     //ctx.closePath();



    */

    if(!markupobj.drawn){
        markupobj.drawn = true;
        doprintcheck();
    }

}

function markuppolylinesvg(svgctx,markupobj,linewidth,strokecolor,scalefactor,pxoffset,pyoffset){

        var counter = 0;

        var xscaled = (markupobj.points[0].x - markupobj.xoffset) * scalefactor;
        var yscaled = (markupobj.points[0].y - markupobj.yoffset)  * scalefactor;


        xscaled += pxoffset;
        yscaled += pyoffset;

        var lineWidth = linewidth * scalefactor;


        var pathstr = "M " + xscaled + " " + yscaled;
        for (counter=1;counter<markupobj.points.length;counter++){

            xscaled = (markupobj.points[counter].x - markupobj.xoffset) * scalefactor;
            yscaled = (markupobj.points[counter].y - markupobj.yoffset) * scalefactor;
            xscaled += pxoffset;
            yscaled += pyoffset;

            pathstr += " L " + xscaled + " " + yscaled;

        }

        var svgpath = svgctx.path(pathstr).attr({
            fill: 'none',
            stroke: strokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });



        if(!markupobj.drawn){
            markupobj.drawn = true;
            doprintcheck();
        }

}

function markupCloudsvg(svgctx,markupobj,lineWidth,scalefactor){

    var x = markupobj.xscaled;
    var y = markupobj.yscaled;
    var width = markupobj.wscaled;
    var height = markupobj.hscaled;
    var doscale = false;
    var xscale = 1;
    var yscale = 1;

    var diameter = 20;
    var numdiamh = Math.floor(width / diameter);
    var numdiamv = Math.floor(height / diameter);
    var diamwidth = diameter * numdiamh;
    var diamheight = diameter * numdiamv;

    var fillcolor = rgb2hex(markupobj.fillcolor);
    var opacity = rgba2transp(markupobj.fillcolor);
    var strokecolor = rgb2hex(markupobj.strokecolor);
    //var opacity = markupobj.transparency;
    //opacity /= 100;

    if(width <= 0 || height <= 0){
        if(width < 0){
            x += width;
            width = Math.abs(width);

        }
        if (height < 0){
            y += height;
            height = Math.abs(height);
        }

    }

    var lNumX = 8;
    var dRadX = width / lNumX;
    var lNumY = height / dRadX;

    if (lNumY < 6){
        dRadX = height / 6;
        lNumY = 6;
        lNumX = width / dRadX;
    }
    var dRadY = height / lNumY;

    var localradiusx = dRadX;
    var diameterx = localradiusx*2;
    var localradiusy = dRadY;
    var diametery = localradiusy*2;

    numdiamh = Math.floor(width / diameterx);
    var doublediamh = (width / diameterx);
    numdiamv = Math.floor(height / diameterx);
    var doublediamv = (height / diameterx);


    var doublediamwidth = diameterx * doublediamh;
    var doublediamheight = diameterx * doublediamv;

    diamwidth = diameterx * numdiamh;
    diamheight = diameterx * numdiamv;

    if(width > diamwidth ){
        xscale = width / diamwidth;
        localradiusx *= xscale;
        diameterx = localradiusx * 2;
        doscale = true;
    }

    if(height > diamheight ){
        yscale = height / diamheight;
        localradiusy *= yscale;
        diametery = localradiusy * 2;
        doscale = true;
    }

    //A rx ry x-axis-rotation large-arc-flag sweep-flag x y
    //A 45 45, 0, 0, 0, 125 125
    var startx = x + localradiusx;
    var starty = y + diametery;
    var endx = x + diameterx;
    var endy = y + localradiusy;
    var pathstr = "M " + startx + " " + starty;
    //upper left bubble
    pathstr += " A " + localradiusx + " " + localradiusy + ", 0, 1, 1, " + endx + " " + endy;
    for (var i = 2;i<numdiamh;i++){
        var vertoffsett = endx + (diameterx * (i - 1));

        pathstr += " A " + localradiusx + " " + localradiusy + ", 0, 0, 1, " + vertoffsett + " " + endy;
    }

    //upper right bubble

    endx = x + width - localradiusx;
    endy = y + diametery;
    //upper right bubble
    pathstr += " A " + localradiusx + " " + localradiusy + ", 0, 1, 1, " + endx + " " + endy;
    for (i = 2;i<numdiamv;i++){
        var horoffsetr = endy +  (diametery  * (i-1));

        pathstr += " A " + localradiusx + " " + localradiusy + ", 0, 0, 1, " + endx + " " + horoffsetr;

    }

    endx = x + width - diameterx;
    endy = y + height - localradiusy;

    //lower right bubble
    pathstr += " A " + localradiusx + " " + localradiusy + ", 0, 1, 1, " + endx + " " + endy;
    for (i = 2;i<numdiamh;i++){
        var vertoffsetb = endx - (diameterx * (i-1));
        pathstr += " A " + localradiusx + " " + localradiusy + ", 0, 0, 1, " + vertoffsetb + " " + endy;


    }

    endx = x + localradiusx;
    endy = y + height - diametery;

    //lower left bubble
    pathstr += " A " + localradiusx + " " + localradiusy + ", 0, 1, 1, " + endx + " " + endy;

    for (i = 2;i<numdiamh;i++){
        var horoffsetl = endy - (diametery  * (i-1));
        pathstr += " A " + localradiusx + " " + localradiusy + ", 0, 0, 1, " + endx + " " + horoffsetl;
    }

    if (markupobj.alternative == 0){

        var svgpath = svgctx.path(pathstr).attr({
            fill: 'none',
            stroke: strokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });


        //markupobject.Rect(ctx,this.x, this.y,this.w,this.h,this.linewidth,false,true,this.color,this.color);
    }
    if (markupobj.alternative == 1){

        svgpath = svgctx.path(pathstr).attr({
            fill: fillcolor,
            'fill-opacity':opacity,
            stroke: strokecolor,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });




    //markupobject.Rect(ctx,this.x, this.y,this.w,this.h,this.linewidth,true,true,this.color,this.color);

    }
    if (markupobj.alternative == 2){

        svgpath = svgctx.path(pathstr).attr({
            fill: 'white',
            stroke: markupobj.color,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });

        //markupobject.Rect(ctx,this.x, this.y,this.w,this.h,this.linewidth,true,true,"white",this.color);
    }
    if(markupobj.alternative >= 3){
        //var ptrn = ctx.createPattern(pattern,'repeat');

        svgpath = svgctx.path(pathstr).attr({
            fill: getHatchsvg(svgctx,markupobj.alternative - 3,markupobj.color),
            stroke: markupobj.color,
            'stroke-linecap':'round',
            'stroke-linejoin':'round',
            strokeWidth: lineWidth
        });


        //markupobject.Rect(ctx,this.x, this.y,this.w,this.h,this.linewidth,true,true,ptrn,this.color);
    }


    if(!markupobj.drawn){
        markupobj.drawn = true;
        doprintcheck();
    }




}

function drawmarkupsvg(markupobj,svgctx,pscale,pxoffset,pyoffset){

    var scalefactor = pscale / markupobj.scaling;
    var xscalepoint = 0;
    var yscalepoint = 0;

    if(markupobj.alternative >= 3){
        markupobj.hatchStyle = markupobj.alternative - 3;
    }else{
        markupobj.hatchprt = 0;
    }


    var linewidthScaled = markupobj.linewidth * scalefactor;
    var radiusScaled = 10 * scalefactor;
    var textoffsetScaled = (markupobj.h / 10) * scalefactor;

    var tx = 0;
    var ty = 0;


    switch(markupobj.type){
        case 0: //pencil, marker, eraser

            var counter = 0;
            var lcounter = 0;

            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);


            /*xscalepoint = (markupobj.points[0].x - markupobj.xoffset) * scalefactor;
            yscalepoint = (markupobj.points[0].y - markupobj.yoffset) * scalefactor;

            xscalepoint += pxoffset;
            yscalepoint += pyoffset;

            var freepenpathstr = 'M ' + xscalepoint.toFixed(2) + ' ' + yscalepoint.toFixed(2);*/

            if (markupobj.subtype == 1){
                var strokeStyle = "white";
                var lineWidth = markupobj.linewidth * 10 * scalefactor;

            }else{
                strokeStyle = markupobj.strokecolor;
                lineWidth = markupobj.linewidth * scalefactor;
            }
            var freepenpathstr = "";

            for (lcounter = 0; lcounter < markupobj.pointlist.length; lcounter++) {
                for (counter=0;counter<markupobj.pointlist[lcounter].length;counter++){
                    xscalepoint = (markupobj.pointlist[lcounter][counter].x - markupobj.xoffset) * scalefactor;
                    yscalepoint = (markupobj.pointlist[lcounter][counter].y - markupobj.yoffset) * scalefactor;

                    xscalepoint += pxoffset;
                    yscalepoint += pyoffset;

                    if (counter == 0){
                        //ctx.moveTo(xscalepoint, yscalepoint);
                        freepenpathstr += 'M ' + xscalepoint.toFixed(2) + ' ' + yscalepoint.toFixed(2);
                    }else{
                        freepenpathstr += ' L ' + xscalepoint.toFixed(2) + ' ' + yscalepoint.toFixed(2);
                        //ctx.lineTo(xscalepoint, yscalepoint);
                    }

                    //freepenpathstr += ' L ' + xscalepoint.toFixed(2) + ' ' + yscalepoint.toFixed(2);

                }
            }

            var svgpath = svgctx.path(freepenpathstr).attr({
                fill: 'none',
                stroke: strokeStyle,
                'stroke-linecap':'round',
                'stroke-linejoin':'round',
                strokeWidth: lineWidth
            });

            if(!markupobj.drawn){
                markupobj.drawn = true;
                doprintcheck();
            }


            break;
        case 1:
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);
            switch(markupobj.subtype){
                case 1:

                    //markupobject.polyline(ctx,markupobject.linewidth,markupobject.color,scalefactor);
                    markuppolylinesvg(svgctx,markupobj,markupobj.linewidth,markupobj.strokecolor,scalefactor,pxoffset,pyoffset);
                    break;


                case 2:
                    if (markupobj.alternative == 0){
                        //markupobject.polygon(ctx,markupobject.linewidth,false,true,markupobject.color,markupobject.color,scalefactor);
                        markuppolygonsvg(svgctx,markupobj,markupobj.linewidth,false,true,markupobj.fillcolor,markupobj.strokecolor,scalefactor,pxoffset,pyoffset);
                        //markupobject.fillcolor, markupobject.strokecolor
                    }

                    if (markupobj.alternative == 1){
                        //markupobject.polygon(ctx,markupobject.linewidth,true,true,markupobject.color,markupobject.color,scalefactor);
                        markuppolygonsvg(svgctx,markupobj,markupobj.linewidth,true,true,markupobj.fillcolor,markupobj.strokecolor,scalefactor,pxoffset,pyoffset);
                    }
                    if (markupobj.alternative == 2){
                        //markupobject.polygon(ctx,markupobject.linewidth,true,true,"white",markupobject.color,scalefactor);
                        markuppolygonsvg(svgctx,markupobj,markupobj.linewidth,true,true,"white",markupobj.color,scalefactor,pxoffset,pyoffset);
                    }
                    if (markupobj.alternative >= 3){

                        markupobj.hatchStyle = markupobj.alternative - 3;

                        markuppolygonsvg(svgctx,markupobj,markupobj.linewidth,true,true,getHatchsvg(svgctx,markupobj.alternative - 3,markupobj.color),markupobj.color,scalefactor,pxoffset,pyoffset);
                        //getHatchsvg(svgctx,markupobj.hatchStyle,markupobj.color);
                    }

                    break;
            }
            break;
        case 2:
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);
            markuppolycurvesvg(svgctx,markupobj,markupobj.linewidth,markupobj.color, scalefactor,pxoffset,pyoffset);
            //(svgctx,markupobj,linewidth,strokecolor,scalefactor,pxoffset,pyoffset)

            break;
        case 3:
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);
            var markercolor = "rgba(255, 255, 0, 0.3)";

            markupRectsvg(svgctx,markupobj,linewidthScaled,scalefactor);

            /*if (this.subtype == 3){

            }
            if (this.subtype == 1){
                if (this.alternative == 0){
                    roundedRectsvg(svgctx,markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled,markupobj.rotation,radiusScaled,linewidthScaled,false,true,markupobj.color,markupobj.color);
                }
                if (this.alternative == 1){
                    roundedRectsvg(svgctx,markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled,markupobj.rotation,radiusScaled,linewidthScaled,true,true,markupobj.color,markupobj.color);

                }
                if (this.alternative == 2){
                    roundedRectsvg(svgctx,markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled,markupobj.rotation,radiusScaled,linewidthScaled,true,true,"white",markupobj.color);
                }
                if (this.alternative == 3){
                    roundedRectsvg(svgctx,markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled,markupobj.rotation,radiusScaled,linewidthScaled,true,true,getHatchsvg(svgctx,markupobj.hatchStyle,markupobj.color),markupobj.color);
                }

            }*/

            break;
        case 4:
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);
            markupOvalsvg(svgctx,markupobj,linewidthScaled);

            break;
        case 5:
           //new cloud
            //markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);

            //markupOvalsvg(svgctx,markupobj,linewidthScaled);
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);

            markupCloudsvg(svgctx,markupobj,linewidthScaled);
            /*if(!markupobj.drawn){
                markupobj.drawn = true;
                doprintcheck();
            }*/


            break;
        case 6:
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);
            markupArrowsvg(svgctx,markupobj,linewidthScaled);

            break;
        case 7:
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);
            markupArrowsvg(svgctx,markupobj,linewidthScaled);

            markupobj.setdimvalue(markupobj.x,markupobj.y,markupobj.w,markupobj.h);
            dimvaluedraw(svgctx,markupobj,scalefactor);

            if(!markupobj.drawn){
                markupobj.drawn = true;
                doprintcheck();
            }

            break;
        case 8:
            var acounter = 0;
            var dimarea = 0;
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);

            if (markupobj.alternative == 0){
                //markupobject.polygon(ctx,markupobject.linewidth,false,true,markupobject.color,markupobject.color,scalefactor);
                markuppolygonsvg(svgctx,markupobj,markupobj.linewidth,false,true,markupobj.color,markupobj.color,scalefactor,pxoffset,pyoffset);
            }

            if (markupobj.alternative == 1){
                //markupobject.polygon(ctx,markupobject.linewidth,true,true,markupobject.color,markupobject.color,scalefactor);
                markuppolygonsvg(svgctx,markupobj,markupobj.linewidth,true,true,markupobj.color,markupobj.color,scalefactor,pxoffset,pyoffset);
            }
            if (markupobj.alternative == 2){
                //markupobject.polygon(ctx,markupobject.linewidth,true,true,"white",markupobject.color,scalefactor);
                markuppolygonsvg(svgctx,markupobj,markupobj.linewidth,true,true,"white",markupobj.color,scalefactor,pxoffset,pyoffset);
            }
            if (markupobj.alternative >= 3){
                markuppolygonsvg(svgctx,markupobj,markupobj.linewidth,true,true,getHatchsvg(svgctx,markupobj.alternative - 3,markupobj.color),markupobj.color,scalefactor,pxoffset,pyoffset);
                //getHatchsvg(svgctx,markupobj.hatchStyle,markupobj.color);
            }

            var markupscalesq = markupobj.scaling*markupobj.scaling;
            dimarea = markupobj.PolygonArea();

            markupobj.dimtext = getUnitArea(dimarea/markupscalesq);
            markupobj.dimtext = markupobj.dimtext.toFixed(2);
            markupobj.dimtext = markupobj.dimtext + " " + AreaUnitlabel;

            var areatextx = markupobj.PolygonCentre('x');
            var areatexty = markupobj.PolygonCentre('y');

            var areatextxscaled = (areatextx - markupobj.xoffset) * scalefactor;
            var areatextyscaled = (areatexty - markupobj.yoffset) * scalefactor;

            areatextxscaled += pxoffset;
            areatextyscaled += pyoffset;

            var areatextscaled = markupobj.measuretextheight * scalefactor;

            /* code from original  */
            /*ctx.textAlign  = "start";
            ctx.font = areatextscaled + "pt " + "Helvetica";*/


            /*var areat = ctx.measureText(this.dimtext);
            var areatextwidth = areat.width;
            ctx.fillStyle = "white";
            ctx.fillRect(areatextxscaled-(10*scalefactor), areatextyscaled-(20*scalefactor),areatextwidth + (20*scalefactor),areatextscaled + (15*scalefactor));*/

            //ctx.fillStyle = this.color;
            //ctx.fillText(this.dimtext, areatextxscaled, areatextyscaled);

            /*  code from original  */

            /* code from dimvaluedraw*/
            var txtbox = svgctx.rect(areatextxscaled-(10*scalefactor), areatextyscaled-(20*scalefactor),100 + (20*scalefactor),areatextscaled + (15*scalefactor)).attr({
                fill: "white",
                stroke: markupobj.color,
                strokeWidth: 1
            });

            var dimtext = svgctx.text(areatextxscaled,areatextyscaled,markupobj.dimtext).attr({
                fontFamily: 'Helvetica',
                'font-size': areatextscaled
            });

            var bbox = dimtext.getBBox();
            var dimtextwidth = bbox.width;
            var dimtextheight = bbox.height;


            //var dimtextwidth = dimtext.node.clientWidth;

            dimtext.attr({
                x : (areatextxscaled - (dimtextwidth / 2))
            });


            //ctx.fillRect(areatextxscaled-(10*scalefactor), areatextyscaled-(20*scalefactor),areatextwidth + (20*scalefactor),areatextscaled + (15*scalefactor));
            txtbox.attr({
                width: (dimtextwidth + (20*scalefactor)),
                height: (dimtextheight + (15*scalefactor)),
                x : ((areatextxscaled -(10*scalefactor))-(dimtextwidth / 2)),
                y : (((areatextyscaled - (dimtextheight*scalefactor))-(5*scalefactor))+(areatextscaled / 2))
            });
            /* code from dimvaluedraw*/

            if(!markupobj.drawn){
                markupobj.drawn = true;
                doprintcheck();
            }



            break;
        case 9:
            var textscaled = markupobj.textheight * scalefactor;
            //var textscaled = markupobj.font.height * scalefactor;

            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);

            markupobj.font.setScale(scalefactor);


            if(markupobj.subtype == 1){
                textscaled = markupobj.font.height * scalefactor;

                var toffsetx = 4*scalefactor;
                var toffsety = 8*scalefactor;

                var textrect = markupRectsvg(svgctx,markupobj,linewidthScaled,scalefactor);
                var cliprect = clipRect(svgctx,markupobj,linewidthScaled,scalefactor);

                var textarray = markupobj.text.split('\n');
                var ystart = markupobj.yscaled + toffsety;
                var xstart = markupobj.xscaled + toffsetx;


                if(markupobj.rotation != 0){
                    rotation = markupobj.rotation * (180 / Math.PI);
                    centerx = markupobj.xscaled + (markupobj.wscaled / 2);
                    centery = markupobj.yscaled + markupobj.hscaled / 2;
                    trstr = 'r' + rotation + ',' + centerx + ',' + centery;
                    //cliprect.transform(trstr);
                }

                var markuptext = svgctx.text(xstart, ystart, textarray).attr({
                    mask:cliprect,
                    fill : markupobj.textcolor,
                    fontFamily: markupobj.font.fontName,
                    'font-size': textscaled * 1.33
                });
                //mask:cliprect,
                //textgroup.appendTo(markuptext);


                var textgroup = svgctx.group(textrect,markuptext);

                textgroup.selectAll("tspan").forEach(function(tspan){
                    ystart += textscaled + toffsety;
                    tspan.attr({x:xstart, y:ystart});
                });


                if(markupobj.rotation != 0){
                    rotation = markupobj.rotation * (180 / Math.PI);
                    centerx = markupobj.xscaled + (markupobj.wscaled / 2);
                    centery = markupobj.yscaled + markupobj.hscaled / 2;
                    trstr = 'r' + rotation + ',' + centerx + ',' + centery;
                    textgroup.transform(trstr);
                }



                /*
                 paper.text({text:["Line1", "Line2", "Line3"]})
                 .attr({fill:"black", fontSize:"18px"})
                 .selectAll("tspan").forEach(function(tspan, i){
                 tspan.attr({x:0, y:25*(i+1)});
                 });
                */


                /*var textarray = markupobj.text.split('\n');
                var ystart = markupobj.yscaled + textscaled + toffsety;

                for (var i = 0; i < textarray.length; i++) {


                    ystart += textscaled + toffsety;


                }*/

                //ctx.font = this.font.fontstringScaled;




            }else{
                markuptext = svgctx.text(markupobj.xscaled,markupobj.yscaled,markupobj.text).attr({
                    fill : markupobj.color,
                    fontFamily: markupobj.font.fontName,
                    'font-size': textscaled * 1.33
                });

                var textbbox = markuptext.getBBox();
                var textwidth = textbbox.width;
                var textheight = textbbox.height;

                var centerx = markupobj.xscaled + textwidth / 2;
                var centery = markupobj.yscaled - textheight / 2;

                if(markupobj.rotation != 0){
                    var rotation = markupobj.rotation * 180 / Math.PI;

                    var trstr = 'r' + rotation + ',' + centerx + ',' + centery;
                    markuptext.transform(trstr);
                }

            }





            if(!markupobj.drawn){
                markupobj.drawn = true;
                doprintcheck();
            }

            break;
        case 10:
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);

            //svgctx.image(noteimage,this.xscaled,this.yscaled,this.wscaled,this.hscaled);
            var image = svgctx.image(noteimage.src,markupobj.xscaled,markupobj.yscaled,markupobj.wscaled,markupobj.hscaled);

            if(!markupobj.drawn){
                markupobj.drawn = true;
                doprintcheck();
            }

            break;
        case 11:
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);
            image = svgctx.image(markupobj.image.src,markupobj.xscaled,markupobj.yscaled,markupobj.wscaled,markupobj.hscaled);

            if(!markupobj.drawn){
                markupobj.drawn = true;
                doprintcheck();
            }

            break;
        case 12:
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);


            markupStampsvg(svgctx,markupobj,linewidthScaled,scalefactor);


            break;

    }

}

function printDocObj(doc,paperwidth,paperheight){
    var px = 0;
    var py = 0;
    var pscale = 0;

    var yscale = 0;
    var xscale = 0;
    var svgpages = [];

    //var thisDoc = opener.RxCore.printhelper().docObj;

    var pwidth = (paperwidth / 25.4)* 86;
    var pheight = (paperheight / 25.4)* 86;



    for (var pagecnt = 0;pagecnt<doc.pages.length;pagecnt++){
        if(doc.pages[pagecnt].usevectorxml && doc.pages[pagecnt].vectorloaded){
            yscale = pheight / doc.pages[pagecnt].VectorPageObj.height;
            xscale = pwidth / doc.pages[pagecnt].VectorPageObj.width;
            pscale = Math.min(xscale,yscale);
            px = (pwidth - (doc.pages[pagecnt].VectorPageObj.width*pscale)) / 2;
            py = (pheight - (doc.pages[pagecnt].VectorPageObj.height*pscale)) / 2;

            svgpages.push(Snap(pwidth,pheight));

            drawallsvg(doc.pages[pagecnt].VectorPageObj,svgpages[pagecnt],pscale,px,py,doc.pages[pagecnt].pagenumber);

            //drawallmarkup()

            //this.VectorPageObj.drawallsvg(svgpages[pagecnt],pscale,px,py,thisDoc.pages[pagecnt].pagenumber);

            aDrawpages[pagecnt] = true;
        }

    }
    for (var markupcnt = 0;markupcnt<doc.markuplist.length;markupcnt++){
        if(doc.markuplist[markupcnt] != null){

            if (doc.markuplist[markupcnt].display){
                //aDrawmarkup[markupcnt] = false;
                doc.markuplist[markupcnt]['drawn'] = false;
                yscale = pheight / doc.pages[doc.markuplist[markupcnt].pagenumber].VectorPageObj.height;
                xscale = pwidth / doc.pages[doc.markuplist[markupcnt].pagenumber].VectorPageObj.width;
                pscale = Math.min(xscale,yscale);
                px = (pwidth - (doc.pages[doc.markuplist[markupcnt].pagenumber].VectorPageObj.width*pscale)) / 2;
                py = (pheight - (doc.pages[doc.markuplist[markupcnt].pagenumber].VectorPageObj.height*pscale)) / 2;

                drawmarkupsvg(doc.markuplist[markupcnt],svgpages[doc.markuplist[markupcnt].pagenumber],pscale,px,py);
                doc.markuplist[markupcnt].drawn = true;
            }

        }

    }







}




if(window.addEventListener) {
window.addEventListener('load', function () {

  // The active tool instance.
  //var tool;
  //var tool_default = 'pan';


  function init () {

    //find container and get size.
    /*var Containerdiv = document.getElementById('container');
    var col1 = document.getElementById('leftcol');
    var colwidth = col1.clientWidth;
    //szcolwidth = szcolwidth.replace("px","");
    var szcanvwidth = Containerdiv.style.width;
    var szcanheight = Containerdiv.style.height;
    szcanvwidth = szcanvwidth.replace("px","");
    szcanheight = szcanheight.replace("px","");

      Canvaswidth = szcanvwidth;
      Canvasheight = szcanheight;*/


      // Find the canvas element.
//replace with svg div
      /*canvaso = document.getElementById('printview');
    if (!canvaso) {
      alert('Error: I cannot find the canvas element!');
      return;
    }*/

      /*pagediv = document.createElement("div");
      //pagediv.style.width = "100px";
      //pagediv.style.height = "100px";
      pagediv.style.background = "white";
      //pagediv.style.color = "white";
      pagediv.id = 'printview';
      //div.innerHTML = "Hello";

      document.body.appendChild(pagediv);*/


    /*if (!canvaso.getContext) {
      alert('Error: no canvas.getContext!');
      return;
    }*/

    // Get the 2D canvas context.
    /*contexto = canvaso.getContext('2d');
    if (!contexto) {
      alert('Error: failed to getContext!');
      return;
    }*/

      try {
          xmlurlrel = opener.RxCore.printhelper().xmlurlrel;
      }
      catch (e) {
          xmlurlrel = '';
      }


      try {
         PaperHeight = opener.RxCore.printhelper().getPaperHeight();

          //PaperHeight = 3480;
      }
      catch (e) {
          PaperHeight = 3480;
      }

      try {
          PaperWidth = opener.RxCore.printhelper().getPaperWidth();

          //PaperWidth = 2460;
      }
      catch (e) {
          PaperWidth = 2460;
      }

      SetPageSize(PaperWidth,PaperHeight);
      try {
          //var PageObjectXML = opener.GetPageObject();

      }
      catch (e) {
          PageObjectXML = 0;
      }

      try {
          for(var stampcnt = 0;stampcnt<opener.RxCore.printhelper().stampList.length;stampcnt++){
              Stamplist[stampcnt] = opener.RxCore.printhelper().stampList[stampcnt];
          }




      }
      catch (e) {
          Stamplist = ["Approved","Draft","Received","Rejected","Reviewed","Revised"];
      }


      if(opener.RxCore.printhelper().docObj != null){
          printDocObj(opener.RxCore.printhelper().docObj,PaperWidth,PaperHeight);
          MeasureScale = opener.RxCore.printhelper().measureScale;
          Unitlabel = opener.RxCore.printhelper().unitLabel;
          AreaUnitlabel = opener.RxCore.printhelper().areaUnitlabel;
          unitscale = opener.RxCore.printhelper().unitscale;
          Unitofmeasure  = opener.RxCore.printhelper().unitOfMeasure;

      }


      /*if(PageObjectXML != 0){
          //setDocObj(PageObjectXML);
          //copyDocObj();
          //var thisDoc = opener.RxCore.printhelper().docObj;
          printDocObj(opener.RxCore.printhelper().docObj,PaperWidth,PaperHeight);
          //PageObjectXML = null;
          MeasureScale = opener.MeasureScale;
          Unitlabel = opener.Unitlabel;
          AreaUnitlabel = opener.AreaUnitlabel;
          unitscale = opener.unitscale;
          Unitofmeasure  = opener.Unitofmeasure;
          //console.log(Unitlabel);
          //console.log(MeasureScale);
          //console.log(AreaUnitlabel);
          //console.log(unitscale);
          //console.log(Unitofmeasure);



      }*/



      try {
          Stamplist = opener.RxCore.printhelper().stampList;

      }
      catch (e) {
          Stamplist = ["Approved","Draft","Received","Rejected","Reviewed","Revised"];
      }

      try{
          var id = 0;
          //DocObj.markuplist = opener.markupprintlist.slice(0);
          /*need to reinstate when new svg markup object is finished
          for (var i = 0;i<opener.markupprintlist.length;i++){
              var type = opener.markupprintlist[i].type;
              var subtype = opener.markupprintlist[i].subtype;
              var alternative = opener.markupprintlist[i].alternative;
              var markupobject = new MarkupObject(type,subtype,alternative);
              markupobject.SetFromArray(opener.markupprintlist[i]);
              markupobject.savemetolist();
              aDrawmarkup[i] = false;

          }*/
          //var PageObjectXML = opener.markupprintlist.length;
      }
      catch (e) {
          //PageObjectXML = 0;
      }






      /*try{
          dscale = opener.RxCore.printhelper().docObj.pages[DocObj.currentpage].dscale;
      }
      catch (e) {
          dscale = 1.0;
      }*/









      /*var container = canvaso.parentNode;
      canvpage2 = document.createElement('canvas');
      if(!canvpage2){
       alert('Error: I cannot create a new canvas element!');
      return;
      }
      canvpage2.id     = 'page2';
      canvpage2.width  = canvaso.width;
      canvpage2.height = canvaso.height;
      container.appendChild(canvpage2);

      contextpg2 = canvpage2.getContext('2d');
      if (!contextpg2) {
          alert('Error: failed to getContext!');
          return;
      }*/
      //canvpage2,contextpg2,
      /*canvpage2 = document.getElementById('page2');
      if (!canvpage2) {
          alert('Error: I cannot find the canvas element!');
          return;
      }

      if (!canvpage2.getContext) {
          alert('Error: no canvas.getContext!');
          return;
      }

      // Get the 2D canvas context.
      contextpg2 = canvpage2.getContext('2d');
      if (!contextpg2) {
          alert('Error: failed to getContext!');
          return;
      }*/



      /*if (Canvaswidth == "" && Canvasheight == ""){
          if (canvaso.width != window.innerWidth-widthadjust-colwidth-2)
          {
              canvaso.width  = window.innerWidth-widthadjust-colwidth-2;
          }

          if (canvaso.height != window.innerHeight-bannerheight-2)
          {
              canvaso.height = window.innerHeight-bannerheight-2;
          }

      }else{
          canvaso.width  = Canvaswidth;
          canvaso.height = Canvasheight-bannerheight;
      }*/


      // Add temporary draw and markup display canvas.
      //var container = canvaso.parentNode;
      // Add markup display canvas.

      /*canvimg = document.createElement('canvas');
      if(!canvimg){
          alert('Error: I cannot create a new canvas element!');
          return;
      }
      canvimg.id     = 'imageDisp';
      canvimg.width  = canvaso.width;
      canvimg.height = canvaso.height;
      container.appendChild(canvimg);

      cntximg = canvimg.getContext('2d');*/



      //sprite = document.getElementById("sprite");

      // Add the temporary draw canvas.
      /*canvas = document.createElement('canvas');
      if (!canvas) {
          alert('Error: I cannot create a new canvas element!');
          return;
      }

      canvas.id     = 'imageTemp';
      canvas.width  = canvaso.width;
      canvas.height = canvaso.height;
      container.appendChild(canvas);

      context = canvas.getContext('2d');*/

      //getFile('http://viewserver.rasterex.com/rxweb/Upload/Volvo_Drawing_Standards.pdf');

       


  } //end init



  // The general-purpose event handler. This function just determines the mouse 
  // position relative to the canvas element.
  /*function ev_canvas (ev) {
    //var touch_event = document.getElementById('shape');
    if (ev.layerX || ev.layerY == 0) { // Firefox
      ev._x = ev.layerX;
      ev._y = ev.layerY;
    } else if (ev.offsetX || ev.offsetY == 0) { // Opera
      ev._x = ev.offsetX;
      ev._y = ev.offsetY;
    }

    //touch_event.value = ev.type;

    // Call the event handler of the tool.
    var func = tool[ev.type];
    if (func) {
      func(ev);
    }
  }*/


  // This function draws the #imageTemp canvas on top of #imageView, after which 
  // #imageTemp is cleared. This function is called each time when the user 
  // completes a drawing operation.
    /*function zoom_update (sx,sy,sWide,sHi) {
       var factorwh = canvaso.height / canvaso.width;


       var tempx = 0.0;
       var tempy = 0.0;
       var tempxext = 0.0;
       var tempyext = 0.0;

       var ox1 = sx / dscale;
       var oy1 = sy / dscale;
       var ox2 = (sx + sWide) / dscale;
       var oy2 = (sy + sHi) / dscale;

      var ox1ext = sx / dscaleextent;
      var oy1ext = sy / dscaleextent;
      var ox2ext = (sx + sWide) / dscaleextent;
      var oy2ext = (sy + sHi) / dscaleextent;

      imagesize = 0;
      SetImageDim(myimage);

       var yscale = canvaso.height / imageheight;
       var xscale = canvaso.width / imagewidth;

       // var yscaleext = canvaso.height / imageheight;
        //var xscaleext = canvaso.width / imagewidth;


      tempx=(sx/dscale)-(dx/dscale);
      tempy=(sy/dscale)-(dy/dscale);

      tempxext = (sx/dscaleextent)-(dxextent/dscaleextent);
      tempyext = (sy/dscaleextent)-(dyextent/dscaleextent);


      if(Math.abs(oy2 - oy1) > 0 && Math.abs(ox2 - ox1) > 0 ){
          yscale = dscale * canvaso.height / sHi;
          xscale = dscale * canvaso.width / sWide;
      }

      dscale = Math.min(yscale, xscale);

      //SetImageDim(myimagesmall);
      //yscale = canvaso.height / imageheight;
      //xscale = canvaso.width / imagewidth;


        if(Math.abs(oy2ext - oy1ext) > 0 && Math.abs(ox2ext - ox1ext) > 0 ){
            yscale = dscaleextent * canvaso.height / sHi;
            xscale = dscaleextent * canvaso.width / sWide;
      }
      dscaleextent = Math.min(yscale, xscale);


      dx=-(tempx*dscale);
      dy=-(tempy*dscale);

      dxextent=-(tempxext*dscaleextent);
      dyextent=-(tempyext*dscaleextent);

        switch(imagesize){
            case 0:
                draw_image(myimage);
                break;
            case 1:
                draw_image(myimagesmall);
                break;
        }


       //draw_image(myimage);

      drawmarkupAll(cntximg);

      context.clearRect(0, 0, canvas.width, canvas.height);
  }*/


    /*function pan_update (sx,sy) {

        switch(drotation){
            case 0:
                dx = dx - sx;
                dy = dy - sy;
                dxextent = dxextent - sx;
                dyextent = dyextent - sy;

                break;
            case 90:
                dx = dx - sy;
                dy = dy + sx;
                dxextent = dxextent - sx;
                dyextent = dyextent + sy;
                break;
            case 180:
                dx = dx + sx;
                dy = dy + sy;
                dxextent = dxextent + sx;
                dyextent = dyextent + sy;
                break;
            case 270:
                dx = dx - sy;
                dy = dy - sx;
                dxextent = dxextent - sx;
                dyextent = dyextent - sy;
                break;

        }


        switch(imagesize){
            case 0:
                draw_image(myimage);
                break;
            case 1:
                draw_image(myimagesmall);
                break;
        }

        //draw_image(myimage);

        drawmarkupAll(cntximg);

    }*/






 
    

    init();

}, false);
    window.addEventListener('resize', function () {
       function init () {

           /*var col1 = document.getElementById('leftcol');
           var colwidth = col1.clientWidth;


           if (canvaso.width != window.innerWidth-widthadjust-colwidth)
           {
               canvaso.width  = window.innerWidth-widthadjust-colwidth;
           }

           if (canvaso.height != window.innerHeight-bannerheight)
           {
               canvaso.height = window.innerHeight-bannerheight;
           }*/



           //calculate zoom to extent initial scaling and offset
           //zoom to fit centered
           /*var yscale = canvaso.height / imageheight;
           var xscale = canvaso.width / imagewidth;
           dscale = Math.min(xscale,yscale);

           dx = (canvaso.width - (imagewidth*dscale)) / 2;
           dy = (canvaso.height - (imageheight*dscale)) / 2;*/


           //draw_image(myimage);

           /*canvimg.width  = canvaso.width;
           canvimg.height = canvaso.height;

           canvas.width  = canvaso.width;
           canvas.height = canvaso.height;
           if(documentopen){
               DocObj.pages[DocObj.currentpage].resize();
           }*/
           //if(DocObj.pages[DocObj.currentpage] != undefined){
               //DocObj.pages[DocObj.currentpage].resize();
           //}

           //drawmarkupAll(cntximg);

       }
       init();
    },false);
}
