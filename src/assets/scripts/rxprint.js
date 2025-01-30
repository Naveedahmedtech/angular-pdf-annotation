// JScript source code

var canvas, context, canvaso, contexto,canvpage2,contextpg2, canvimg, cntximg;

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
var markuploaded = false;
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

function isEven(value) {
    if (value%2 == 0)
        return true;
    else
        return false;
}


function getHatch(ctx,type,color){

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
        case 3:
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
        case 2:
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
        case 5:
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
        case 0:
            pctx.beginPath();
            pctx.moveTo(0.0, 4.0);
            pctx.lineTo(16.0,4.0);
            pctx.moveTo(0.0, 12.0);
            pctx.lineTo(16.0,12.0);

            pctx.stroke();

            break;
        case 1:
            pctx.beginPath();
            pctx.moveTo(4.0, 0.0);
            pctx.lineTo(4.0,16.0);
            pctx.moveTo(12.0, 0.0);
            pctx.lineTo(12.0,16.0);

            pctx.stroke();

            break;
        case 4:
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

}

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
    var dimValue = 0;
    var dpi = DocObj.pages[DocObj.currentpage].DPI;
    var DPmm = dpi / 25.4;
    var DPInch =  dpi;
    //var unit = currentglobalunit;


    if(DocObj.pages[DocObj.currentpage].usepdfjs){
        dpi = 72;
        DPmm = dpi / 25.4;
    }


    var Dpmmsquare = DPmm*DPmm;
    var DPInchSquare = DPInch*DPInch;
    var measureScaleSquared = MeasureScale*MeasureScale;
    if (DocObj.pages[DocObj.currentpage].usevectorxml){
        var mainimagesquare = DocObj.pages[DocObj.currentpage].OriginalScale * DocObj.pages[DocObj.currentpage].OriginalScale;
    }else if(DocObj.pages[DocObj.currentpage].usepdfjs){
        mainimagesquare = DocObj.pages[DocObj.currentpage].OriginalScale * DocObj.pages[DocObj.currentpage].OriginalScale;
    }else{
        mainimagesquare = DocObj.pages[DocObj.currentpage].MainImageScaling * DocObj.pages[DocObj.currentpage].MainImageScaling;
    }



    var dscalesquare = DocObj.pages[DocObj.currentpage].dscale * DocObj.pages[DocObj.currentpage].dscale;

    if (DocObj.pages[DocObj.currentpage].usevectorxml){
        dscalesquare = DocObj.pages[DocObj.currentpage].dscalevector * DocObj.pages[DocObj.currentpage].dscalevector;
    }else if (DocObj.pages[DocObj.currentpage].usepdfjs){
        dscalesquare = (DocObj.pages[DocObj.currentpage].curpagescale*DocObj.pages[DocObj.currentpage].dscalepdf) * (DocObj.pages[DocObj.currentpage].curpagescale*DocObj.pages[DocObj.currentpage].dscalepdf);
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
        if (!DocObj.pages[DocObj.currentpage].usevectorxml){
            dimValue = dimValue / orignalscalesquare;
        }

    }
    return dimValue;
}


function getUnitlength(value){
    var dimValue = 0;
    var dpi = DocObj.pages[DocObj.currentpage].DPI;
    var DPmm = dpi / 25.4;
    var DPInch =  dpi;

    if(DocObj.pages[DocObj.currentpage].usepdfjs){
        dpi = 72;
        DPmm = dpi / 25.4;
    }


    //var scalefactor = DocObj.pages[DocObj.currentpage].dscale / this.scaling;

    //dimValue = ((value  / DocObj.pages[DocObj.currentpage].MainImageScaling) / DocObj.pages[DocObj.currentpage].dscale)*MeasureScale;// * scalefactor;
    //value without the scale factor to estblish value independent from zoom factor.
    dimValue = ((value  / DocObj.pages[DocObj.currentpage].MainImageScaling))*MeasureScale;// * scalefactor;
    if (DocObj.pages[DocObj.currentpage].usevectorxml || DocObj.pages[DocObj.currentpage].usepdfjs){
        dimValue = ((value  / DocObj.pages[DocObj.currentpage].OriginalScale))*MeasureScale;// * scalefactor;
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
        if (!DocObj.pages[DocObj.currentpage].usevectorxml){
            dimValue = dimValue / DocObj.pages[DocObj.currentpage].OriginalScale;
        }


    }
    return dimValue;
}



function getDocObj() {
    return DocObj;
}

function PrintWindow() {
    window.print();
    window.onfocus=function(){
        window.close();
    };
    opener.RxCore.printhelper().printfocus();
    CheckWindowState();

}

function CheckWindowState()    {
    if(document.readyState=="complete") {
        //alert('closing');
        window.focus();
    } else {
        setTimeout("CheckWindowState()", 2000);
    }

}


function markupstamp(ctx,markupobj,linewidthScaled,scalefactor,radius){

    var textstampscaled = markupobj.textheight * scalefactor;
    var textsmallstampscaled = markupobj.stampsmalltheight * scalefactor;
    var stampcolor = "rgba(255,0,0,0.3)";
    markupobj.roundedRect(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, markupobj.rotation, radius, 3 * scalefactor, true, true, stampcolor, markupobj.strokecolor);


    var Displayname = opener.RxCore.printhelper().getDisplayName(markupobj.signature);

    var datetext = markupobj.GetDateTime(false);
    var smalltext = "By " + Displayname + "," + " ";
    smalltext = smalltext + datetext;

    if(markupobj.subtype != 100){
        markupobj.text = Stamplist[markupobj.subtype];
    }

    tx = markupobj.xscaled+(markupobj.wscaled/2);

    if(markupobj.alternative == 0){
        ty = markupobj.yscaled + ((markupobj.hscaled / 4) + (textstampscaled / 2));

    }else{
        ty = markupobj.yscaled + (markupobj.hscaled / 2);
        ty += (textstampscaled / 4);
    }

    ctx.save();

    if (markupobj.rotation != 0) {
        tx = markupobj.xscaled + (markupobj.wscaled / 2);
        ty = markupobj.yscaled + (markupobj.hscaled / 2);

        ctx.translate(tx, ty);
        ctx.rotate(markupobj.rotation);
        ctx.translate(-tx, -ty);
    }

    ctx.fillStyle = markupobj.textcolor;
    ctx.font = "bold " + textstampscaled + "pt " + "Times New Roman";

    var stampdim = ctx.measureText(markupobj.text);
    markupobj.textwidth = stampdim.width;
    tx = markupobj.xscaled + (markupobj.wscaled / 2);

    if(markupobj.alternative == 0){
        ty = markupobj.yscaled + ((markupobj.hscaled / 4) + (textstampscaled / 2));
    }else{
        ty = markupobj.yscaled + (markupobj.hscaled / 2);
        ty += (textstampscaled / 4);
    }

    if (markupobj.textrotate != 0) {
        ctx.translate(tx, ty);
        ctx.rotate(markupobj.textrotate);
        ctx.translate(-tx, -ty);

        tx = markupobj.xscaled + (markupobj.wscaled / 2);
        //ty = this.yscaled+(this.hscaled/2);
        if(markupobj.alternative == 0){
            ty = markupobj.yscaled + ((markupobj.hscaled / 4) + (textstampscaled / 2));
        }else{
            ty = markupobj.yscaled + (markupobj.hscaled / 2);
            ty += (textstampscaled / 4);
        }


    }

    ctx.textAlign = 'center';
    ctx.fillText(markupobj.text, tx, ty);

    if(markupobj.alternative == 0 ){
        //stamp information text.
        //var smalltextsize = markupobject.textheight / 2;
        ctx.fillStyle = markupobj.fillcolor;
        ctx.font = "bold " + textsmallstampscaled + "pt " + "Times New Roman";
        ty = markupobj.yscaled + ((markupobj.hscaled / 4) * 3);
        ctx.fillText(markupobj.smalltext, tx, ty);

    }
    ctx.restore();

    if(!markupobj.drawn){
        markupobj.drawn = true;
        doprintcheck();
    }


}

function polygon (markupobj,ctx, linewidth, fill, stroke, fillcolor, strokecolor, scalefactor,poffsetx,poffsety) {
    var counter = 0;

    //markupobj.polygon(markupobj, ctx,markupobj.linewidth,false,true,markupobj.fillcolor,markupobj.strokecolor,scalefactor);



    ctx.save();

    ctx.strokeStyle = strokecolor;
    ctx.lineWidth = linewidth * scalefactor;
    ctx.fillStyle = fillcolor;

    ctx.beginPath();




    for (counter = 0; counter < markupobj.points.length; counter++) {

        xscaled = (markupobj.points[counter].x - markupobj.xoffset) * scalefactor;
        yscaled = (markupobj.points[counter].y - markupobj.yoffset) * scalefactor;


        xscaled += poffsetx;
        yscaled += poffsety;

        (counter == 0) ? ctx.moveTo(xscaled, yscaled): ctx.lineTo(xscaled, yscaled);

    }
    ctx.closePath();


    if (fill) {
        ctx.fill();
    }
    if (stroke) {
        ctx.stroke();
    }
    ctx.restore();


}


function polyline (markupobj, ctx, linewidth, strokecolor, scalefactor, poffsetx,poffsety) {
    var counter = 0;

    ctx.save();

    ctx.strokeStyle = strokecolor;
    ctx.lineWidth = linewidth * scalefactor;


    ctx.beginPath();



    for (counter = 0; counter < markupobj.points.length; counter++) {


        xscaled = (markupobj.points[counter].x - markupobj.xoffset) * scalefactor;
        yscaled = (markupobj.points[counter].y - markupobj.yoffset) * scalefactor;

        xscaled += poffsetx;
        yscaled += poffsety;

        (counter == 0) ? ctx.moveTo(xscaled, yscaled): ctx.lineTo(xscaled, yscaled);

    }

    ctx.stroke();
    ctx.restore();


}


function drawmarkup(markupobj,ctx,pscale,pxoffset,pyoffset){

    var scalefactor = pscale / markupobj.scaling;
    var xscalepoint = 0;
    var yscalepoint = 0;

    //pxoffset += 50;

    //pxoffset *= pscale;
    //pyoffset *= pscale;
    //pxoffset = 0;

    if(markupobj.alternative >= 3){
        markupobj.hatchStyle = markupobj.alternative - 3;
    }else{
        markupobj.hatchprt = 0;
    }

    var ptrn = getHatch(ctx, markupobj.hatchStyle, markupobj.fillcolor);

    var arrowlengthscaled = markupobj.arrowlength * scalefactor;
    var arrowangle = 22.5;

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

            /*from rxcorefunctions*/
            ctx.save();
            if (markupobj.subtype == 1){
                ctx.strokeStyle = "white";
                ctx.lineWidth = markupobj.linewidth * 10 * scalefactor;
            } else {
                ctx.strokeStyle = markupobj.strokecolor;
                ctx.lineWidth = markupobj.linewidth * scalefactor;
                markupobj.GetLinestyle(markupobj.linestyle,ctx,scalefactor);
            }
            /*from rxcorefunctions*/



            for (lcounter = 0; lcounter < markupobj.pointlist.length; lcounter++) {
                for (counter=0;counter<markupobj.pointlist[lcounter].length;counter++){
                    xscalepoint = (markupobj.pointlist[lcounter][counter].x - markupobj.xoffset) * scalefactor;
                    yscalepoint = (markupobj.pointlist[lcounter][counter].y - markupobj.yoffset) * scalefactor;

                    xscalepoint += pxoffset;
                    yscalepoint += pyoffset;

                    if (counter == 0){
                        ctx.moveTo(xscalepoint, yscalepoint);
                    }else{
                        ctx.lineTo(xscalepoint, yscalepoint);
                    }



                }
            }
            ctx.stroke();
            ctx.restore();

            if(!markupobj.drawn){
                markupobj.drawn = true;
                doprintcheck();
            }


            break;
        case 1:
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);
            switch(markupobj.subtype){
                case 1:

                    //markupobj.polyline(ctx,markupobj.linewidth,markupobj.color,scalefactor);
                   polyline(markupobj, ctx,markupobj.linewidth,markupobj.strokecolor,scalefactor,pxoffset,pyoffset);

                //function polyline (markupobj, ctx, linewidth, strokecolor, scalefactor, poffsetx,poffsety) {
                    //markuppolylinesvg(svgctx,markupobj,markupobj.linewidth,markupobj.strokecolor,scalefactor,pxoffset,pyoffset);
                    break;


                case 2:
                    if (markupobj.alternative == 0){
                        //markupobj.polygon(ctx,markupobj.linewidth,false,true,markupobj.color,markupobj.color,scalefactor);

                        polygon(markupobj, ctx,markupobj.linewidth,false,true,markupobj.fillcolor,markupobj.strokecolor,scalefactor,pxoffset,pyoffset);
                        //function polygon (markupobj,ctx, linewidth, fill, stroke, fillcolor, strokecolor, scalefactor,poffsetx,poffsety) {
                        //markuppolygonsvg(svgctx,markupobj,markupobj.linewidth,false,true,markupobj.fillcolor,markupobj.strokecolor,scalefactor,pxoffset,pyoffset);
                        //markupobj.fillcolor, markupobj.strokecolor
                    }

                    if (markupobj.alternative == 1){
                        //markupobj.polygon(ctx,markupobj.linewidth,true,true,markupobj.color,markupobj.color,scalefactor);
                        polygon(markupobj,ctx,markupobj.linewidth,true,true,markupobj.fillcolor,markupobj.strokecolor,scalefactor,pxoffset,pyoffset);
                        //markuppolygonsvg(svgctx,markupobj,markupobj.linewidth,true,true,markupobj.fillcolor,markupobj.strokecolor,scalefactor,pxoffset,pyoffset);
                    }
                    if (markupobj.alternative == 2){
                        polygon(markupobj,ctx,markupobj.linewidth,true,true,"white",markupobj.strokecolor,scalefactor,pxoffset,pyoffset);
                        //markuppolygonsvg(svgctx,markupobj,markupobj.linewidth,true,true,"white",markupobj.color,scalefactor,pxoffset,pyoffset);
                    }
                    if (markupobj.alternative >= 3){

                        markupobj.hatchStyle = markupobj.alternative - 3;
                        polygon(markupobj,ctx, markupobj.linewidth, true, true, ptrn, markupobj.strokecolor, scalefactor,pxoffset,pyoffset);
                        //markuppolygonsvg(svgctx,markupobj,markupobj.linewidth,true,true,getHatchsvg(svgctx,markupobj.alternative - 3,markupobj.color),markupobj.color,scalefactor,pxoffset,pyoffset);
                        //getHatchsvg(svgctx,markupobj.hatchStyle,markupobj.color);
                    }

                    break;
            }

            if(!markupobj.drawn){
                markupobj.drawn = true;
                doprintcheck();
            }

            break;

        case 2:
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);
            markupobj.polycurves(ctx, markupobj.linewidth, markupobj.strokecolor, scalefactor);
            //markuppolycurvesvg(svgctx,markupobj,markupobj.linewidth,markupobj.color, scalefactor,pxoffset,pyoffset);
            //(svgctx,markupobj,linewidth,strokecolor,scalefactor,pxoffset,pyoffset)

            if(!markupobj.drawn){
                markupobj.drawn = true;
                doprintcheck();
            }


            break;
        case 3:
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);
            if (markupobj.subtype == 2) {

                erasecolor = "white";
                markupobj.Rect(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, linewidthScaled, true, false, erasecolor, erasecolor);


            }

            if (markupobj.subtype == 3) {
                markupobj.Rect(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, linewidthScaled, true, false, markupobj.fillcolor, markupobj.fillcolor);
            }

            if (markupobj.subtype == 1) {
                if (markupobj.alternative == 0) {
                    ctx.save();
                    markupobj.GetLinestyle(markupobj.linestyle,ctx,scalefactor);
                    markupobj.roundedRect(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, markupobj.rotation, radiusScaled, linewidthScaled, false, true, markupobj.fillcolor, markupobj.strokecolor);
                    ctx.restore();


                }
                if (markupobj.alternative == 1) {
                    markupobj.roundedRect(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, markupobj.rotation, radiusScaled, linewidthScaled, true, true, markupobj.fillcolor, markupobj.strokecolor);
                }

                if (markupobj.alternative == 2) {
                    markupobj.roundedRect(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, markupobj.rotation, radiusScaled, linewidthScaled, true, true, "white", markupobj.strokecolor);
                }
                if (markupobj.alternative >= 3) {
                    markupobj.roundedRect(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, markupobj.rotation, radiusScaled, linewidthScaled, true, true, ptrn, markupobj.strokecolor);
                }
            }

            if (markupobj.subtype == 0) {
                if (markupobj.alternative == 0) {
                    ctx.save();
                    markupobj.GetLinestyle(markupobj.linestyle,ctx,scalefactor);
                    markupobj.Rect(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, linewidthScaled, false, true, markupobj.fillcolor, markupobj.strokecolor);
                    ctx.restore();
                }
                if (markupobj.alternative == 1) {
                    markupobj.Rect(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, linewidthScaled, true, true, markupobj.fillcolor, markupobj.strokecolor);
                }
                if (markupobj.alternative == 2) {
                    markupobj.Rect(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, linewidthScaled, true, true, "white", markupobj.strokecolor);
                }
                if (markupobj.alternative >= 3) {
                    markupobj.Rect(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, linewidthScaled, true, true, ptrn, markupobj.strokecolor);
                }

            }

            if(!markupobj.drawn){
                markupobj.drawn = true;
                doprintcheck();
            }

            break;
        case 4:
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);
            //markupOvalsvg(svgctx,markupobj,linewidthScaled);
            if (markupobj.alternative == 0) {
                ctx.save();
                markupobj.GetLinestyle(markupobj.linestyle,ctx,scalefactor);
                markupobj.Oval(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, linewidthScaled, false, true, markupobj.fillcolor, markupobj.strokecolor);
                ctx.restore();
            }
            if (markupobj.alternative == 1) {

                markupobj.Oval(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, linewidthScaled, true, true, markupobj.fillcolor, markupobj.strokecolor);


            }
            if (markupobj.alternative == 2) {

                markupobj.Oval(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, linewidthScaled, true, true, "white", markupobj.color);

            }
            if (markupobj.alternative >= 3) {

                markupobj.Oval(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, linewidthScaled, true, true, ptrn, markupobj.strokecolor);

            }

            if(!markupobj.drawn){
                markupobj.drawn = true;
                doprintcheck();
            }


            break;
        case 5:
            //new cloud
            //markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);

            //markupOvalsvg(svgctx,markupobj,linewidthScaled);
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);
            if (markupobj.alternative == 0) {
                ctx.save();
                markupobj.GetLinestyle(markupobj.linestyle,ctx,scalefactor);
                //markupobj.cloud(ctx,markupobj.xscaled,markupobj.yscaled,markupobj.wscaled,markupobj.hscaled,radiusScaled,linewidthScaled,false,true,markupobj.color,markupobj.color);
                markupobj.newcloud(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, radiusScaled, linewidthScaled, false, true, markupobj.fillcolor, markupobj.strokecolor);
                ctx.restore();
            }
            if (markupobj.alternative == 1) {
                //markupobj.cloud(ctx,markupobj.xscaled,markupobj.yscaled,markupobj.wscaled,markupobj.hscaled,radiusScaled,linewidthScaled,true,true,markupobj.color,markupobj.color);

                markupobj.newcloud(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, radiusScaled, linewidthScaled, true, true, markupobj.fillcolor, markupobj.strokecolor);

            }
            if (markupobj.alternative == 2) {

                //markupobj.cloud(ctx,markupobj.xscaled,markupobj.yscaled,markupobj.wscaled,markupobj.hscaled,radiusScaled,linewidthScaled,true,true,"white",markupobj.color);
                markupobj.newcloud(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, radiusScaled, linewidthScaled, true, true, "white", markupobj.color);

            }
            if (markupobj.alternative >= 3) {
                //markupobj.cloud(ctx,markupobj.xscaled,markupobj.yscaled,markupobj.wscaled,markupobj.hscaled,radiusScaled,linewidthScaled,true,true,ptrn,markupobj.color);
                markupobj.newcloud(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, radiusScaled, linewidthScaled, true, true, ptrn, markupobj.strokecolor);

            }

            //markupCloudsvg(svgctx,markupobj,linewidthScaled);
            if(!markupobj.drawn){
                markupobj.drawn = true;
                doprintcheck();
            }


            break;
        case 6:
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);
            ctx.save();
            markupobj.GetLinestyle(markupobj.linestyle,ctx,scalefactor);
            markupobj.arrow(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, arrowlengthscaled, arrowangle, linewidthScaled, markupobj.subtype, markupobj.strokecolor, markupobj.strokecolor);
            ctx.restore();

            if(!markupobj.drawn){
                markupobj.drawn = true;
                doprintcheck();
            }



            break;
        case 7:
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);


            var dimtype = markupobj.subtype + 4;


            ctx.save();
            markupobj.GetLinestyle(markupobj.linestyle,ctx,scalefactor);
            markupobj.arrow(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, arrowlengthscaled, arrowangle, linewidthScaled, dimtype, markupobj.strokecolor, markupobj.strokecolor);
            ctx.restore();

            markupobj.setdimvalue(markupobj.x,markupobj.y,markupobj.w,markupobj.h);
            markupobj.dimvaluedraw(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, markupobj.strokecolor, scalefactor);



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
                //markupobj.polygon(ctx,markupobj.linewidth,false,true,markupobj.fillcolor,markupobj.strokecolor,scalefactor);
                polygon(markupobj, ctx,markupobj.linewidth,false,true,markupobj.fillcolor,markupobj.strokecolor,scalefactor,pxoffset,pyoffset);

            }

            if (markupobj.alternative == 1){
                //markupobj.polygon(ctx,markupobj.linewidth,true,true,markupobj.fillcolor,markupobj.strokecolor,scalefactor);
                polygon(markupobj, ctx,markupobj.linewidth,true,true,markupobj.fillcolor,markupobj.strokecolor,scalefactor,pxoffset,pyoffset);

            }
            if (markupobj.alternative == 2){
                //markupobj.polygon(ctx,markupobj.linewidth,true,true,"white",markupobj.strokecolor,scalefactor);
                polygon(markupobj, ctx,markupobj.linewidth,true,true,"white",markupobj.strokecolor,scalefactor,pxoffset,pyoffset);

            }
            if (markupobj.alternative >= 3){
                //markupobj.polygon(ctx, markupobj.linewidth, true, true, ptrn, markupobj.strokecolor, scalefactor);
                polygon(markupobj, ctx,markupobj.linewidth,true,true,ptrn,markupobj.strokecolor,scalefactor,pxoffset,pyoffset);

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

            //var areatextxscaled = (areatextx - pxoffset) * scalefactor;
            //var areatextyscaled = (areatexty - pyoffset) * scalefactor;


            areatextxscaled += pxoffset;
            areatextyscaled += pyoffset;

            var areatextscaled = markupobj.measuretextheight * scalefactor;



            /*  code from original  */
            ctx.textAlign = "start";
            ctx.font = areatextscaled + "pt " + "Helvetica";
            markupobj.textheight = markupobj.measuretextheight;

            var areat = ctx.measureText(markupobj.dimtext);
            var areatextwidth = areat.width;
            var areatextheight = areatextscaled;
            areatextxscaled = areatextxscaled - (areatextwidth / 2);
            areatextyscaled = areatextyscaled + (areatextheight / 2);
            ctx.lineWidth = 1;
            ctx.strokeStyle = markupobj.strokecolor;
            ctx.fillStyle = "white";
            ctx.fillRect(areatextxscaled - (10 * scalefactor), areatextyscaled - (20 * scalefactor), areatextwidth + (20 * scalefactor), areatextscaled + (15 * scalefactor));
            ctx.strokeRect(areatextxscaled - (10 * scalefactor), areatextyscaled - (20 * scalefactor), areatextwidth + (20 * scalefactor), areatextscaled + (15 * scalefactor));


            // ctx.fillStyle = this.color;
            ctx.fillStyle = "black";
            ctx.fillText(markupobj.dimtext, areatextxscaled, areatextyscaled);




            /* code from dimvaluedraw*/

            if(!markupobj.drawn){
                markupobj.drawn = true;
                doprintcheck();
            }



            break;
        case 9:
            //var textscaled = markupobj.textheight * scalefactor;
            var textscaled = markupobj.font.height * scalefactor;

            markupobj.font.setScale(scalefactor);

            var textscaled = markupobj.font.height * scalefactor;
            ctx.font = markupobj.font.fontstringScaled;

            var dimsel = ctx.measureText(markupobj.text);
            markupobj.textwidth = dimsel.width;


            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);

            ctx.save();

            tx = markupobj.xscaled;
            ty = markupobj.yscaled;

            if (markupobj.textrotate != 0 && markupobj.subtype == 0) {
                ctx.translate(tx, ty);
                ctx.rotate(markupobj.textrotate);
                ctx.translate(-tx, -ty);

            }

            if (markupobj.rotation != 0) {
                tx = markupobj.xscaled + (markupobj.wscaled / 2);
                if( markupobj.subtype == 0){
                    ty = markupobj.yscaled - (markupobj.hscaled / 2);
                }else{
                    ty = markupobj.yscaled + (markupobj.hscaled / 2);
                }


                ctx.translate(tx, ty);
                ctx.rotate(markupobj.rotation);
                ctx.translate(-tx, -ty);
            }


            ctx.textAlign = "start";
            ctx.fillStyle = markupobj.textcolor;

            if(markupobj.subtype == 1){


                var toffsetx = 4*scalefactor;
                var toffsety = 8*scalefactor;

                markupobj.Rect(ctx, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled, linewidthScaled, true, true, markupobj.fillcolor, markupobj.strokecolor);
                ctx.save();
                ctx.beginPath();
                ctx.rect(markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled);
                ctx.clip();


                var textarray = markupobj.text.split('\n');
                var ystart = markupobj.yscaled + textscaled + toffsety;

                for (var i = 0; i < textarray.length; i++) {
                    ctx.fillText(textarray[i], markupobj.xscaled + toffsetx , ystart);
                    ystart += textscaled + toffsety;
                }
                ctx.restore();



            }else{
                ctx.fillText(markupobj.text, markupobj.xscaled, markupobj.yscaled);



            }

            ctx.restore();


            if(!markupobj.drawn){
                markupobj.drawn = true;
                doprintcheck();
            }

            break;
        case 10:
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);



            ctx.save();

            tx = markupobj.xscaled;
            ty = markupobj.yscaled;
            if (markupobj.rotation != 0) {
                tx = markupobj.xscaled + (markupobj.wscaled / 2);
                ty = markupobj.yscaled - (markupobj.hscaled / 2);

                ctx.translate(tx, ty);
                ctx.rotate(markupobj.rotation);
                ctx.translate(-tx, -ty);
            }

            ctx.drawImage(noteimage, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled);
            ctx.restore();


            if(!markupobj.drawn){
                markupobj.drawn = true;
                doprintcheck();
            }

            break;
        case 11:
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);




            ctx.save();
            tx = markupobj.xscaled;
            ty = markupobj.yscaled;
            if (markupobj.rotation != 0) {
                tx = markupobj.xscaled + (markupobj.wscaled / 2);
                ty = markupobj.yscaled - (markupobj.hscaled / 2);

                ctx.translate(tx, ty);
                ctx.rotate(markupobj.rotation);
                ctx.translate(-tx, -ty);
            }
            ctx.drawImage(markupobj.image, markupobj.xscaled, markupobj.yscaled, markupobj.wscaled, markupobj.hscaled);
            ctx.restore();


            if(!markupobj.drawn){
                markupobj.drawn = true;
                doprintcheck();
            }

            break;
        case 12:
            markupobj.SetDimensions(scalefactor,0,pxoffset,pyoffset);
            markupstamp(ctx,markupobj,linewidthScaled,scalefactor,radiusScaled);




            break;

    }

}





function drawmarkupAll(ctx,page){
    var px = 0;
    var py = 0;
    var pscale = 0;
    var xscale = 0;
    var yscale = 0;

    /*
    this.dxvector=0.0;
    this.dyvector=0.0;
    this.dscalevector = 1.0;

    this.dxpdf=0.0;
    this.dypdf=0.0;
    this.dscalepdf = 1.0;

    */

    if(DocObj.pages[page].usepdfjs){
        px = DocObj.pages[page].dxpdf;
        py = DocObj.pages[page].dypdf;
        pscale = DocObj.pages[page].dscalepdf;
        //DocObj.pages[page].dscale

    }else if(DocObj.pages[page].usevectorxml) {
        px = DocObj.pages[page].dxvector;
        py = DocObj.pages[page].dyvector;
        pscale = DocObj.pages[page].dscalevector;

    }else{
        if(DocObj.pages[page].currentimage == 1){
            px = DocObj.pages[page].dxextent;
            py = DocObj.pages[page].dyextent;
            pscale = DocObj.pages[page].dscale;
        }else{
            px = DocObj.pages[page].dx;
            py = DocObj.pages[page].dy;
            pscale = DocObj.pages[page].dscale;

        }

    }



    var curmarkup = 0;
    //ctx.clearRect(0, 0, canvaso.width, canvaso.height);
    if(DocObj.Drawmarkup){
        for (curmarkup=0;curmarkup<DocObj.markuplist.length;curmarkup++){
            if(DocObj.markuplist[curmarkup] != null){
                if(DocObj.markuplist[curmarkup].pagenumber == page){
                    //if(!DocObj.markuplist[curmarkup].selected && !DocObj.markuplist[curmarkup].selectedit){
                        if (DocObj.markuplist[curmarkup].display){

                            drawmarkup(DocObj.markuplist[curmarkup],ctx,pscale,px,py);
                            //DocObj.markuplist[curmarkup].drawmescaled(ctx);

                            //aDrawmarkup[curmarkup] = true;
                            //console.log('drawmarkup');
                            //console.log(aDrawmarkup[curmarkup]);

                        }

                    //}

                }
            }

        }
        //markupdrawn = true;
        //doprintcheck();

    }else{
        for (curmarkup=0;curmarkup<DocObj.markuplist.length;curmarkup++){
            if(DocObj.markuplist[curmarkup] != null){
                if(DocObj.markuplist[curmarkup].pagenumber == DocObj.currentpage){
                    if (DocObj.markuplist[curmarkup].type == 0 && DocObj.markuplist[curmarkup].subtype == 1){
                        if (DocObj.markuplist[curmarkup].display){
                            drawmarkup(DocObj.markuplist[curmarkup],ctx,pscale,px,py);
                            //DocObj.markuplist[curmarkup].drawmescaled(ctx);
                            //console.log('not drawmarkup');
                            //console.log(curmarkup);
                            //doprintcheck();
                        }

                    }
                }
            }

        }

    }

    //markupdrawn = true;
    //doprintcheck();
}


function doprintcheck(){
    var canprint = true;


    for (var i = 0; i < aDrawpages.length;i++){
        if(!aDrawpages[i]){
            canprint = false;
        }
        for(var j = 0;j < DocObj.markuplist.length;j++){
            if(DocObj.markuplist){
                if(!aDrawpages[i] || !DocObj.markuplist[j].drawn){

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

    //console.log(canprint);
    if (canprint && hasnotprinted){
        //console.log(canprint);
        hasnotprinted = false;
        PrintWindow();

    }
}

/*function GetMarkup(MarkupFileXML){

    var MarkupFilePath = 0;
    var i=0;
    var xmlDoc = MarkupFileXML;
    //var markupType = markupentityobj[i].getElementsByTagName("Type")[0].firstChild.nodeValue;

    //DocObj = new DocumentObject(xmlDoc);
    /*if (xmlDoc.getElementsByTagName('User') != null && xmlDoc.getElementsByTagName('User').length != 0){
        var UserID = xmlDoc.getElementsByTagName('User');
        for (i=0;i<UserID.length;i++){

            var MarkupUserDispName = UserID[i].getElementsByTagName("Name")[0].firstChild.nodeValue;
            var MarkupUserID = UserID[i].getElementsByTagName("ID")[0].firstChild.nodeValue;
            var MarkupUserLayer = UserID[i].getElementsByTagName("Layer")[0].firstChild.nodeValue;
            var MarkupUserColor = UserID[i].getElementsByTagName("Color")[0].firstChild.nodeValue;
            if (Userlist[0].Signature != MarkupUserID){
                Userlist[i] = new Users(MarkupUserID,MarkupUserDispName,MarkupUserLayer,MarkupUserColor);
                numUsers++;
            }
        }
    }else{
        if (xmlDoc.getElementsByTagName('Name') != null){
            var sign = xmlDoc.getElementsByTagName('Name');
            if (Userlist[0].Signature != sign[0].firstChild.nodeValue){
                Userlist[numUsers] = new Users(sign[0].firstChild.nodeValue,sign[0].firstChild.nodeValue,markuplayer,markupcolor);
                numUsers++;

            }
        }
    }*/
    /*if (xmlDoc.getElementsByTagName('Entity') != null){
        var markupentityobj = xmlDoc.getElementsByTagName('Entity');
        for (i=0;i<markupentityobj.length;i++){
            var markupType = markupentityobj[i].getElementsByTagName("Type")[0].firstChild.nodeValue;
            var markupSubtype = markupentityobj[i].getElementsByTagName("Subtype")[0].firstChild.nodeValue;
            var markupAlternative = markupentityobj[i].getElementsByTagName("Alternative")[0].firstChild.nodeValue;
            var markupID = !markupentityobj[i].getAttribute('ID') ? null : markupentityobj[i].getAttribute('ID');
            markupType = parseInt(markupType);
            markupSubtype = parseInt(markupSubtype);
            markupAlternative = parseInt(markupAlternative);
            var xmlmarkupobj = new MarkupObject(markupType,markupSubtype,markupAlternative);
            xmlmarkupobj.markupID = markupID;
            xmlmarkupobj.SetfromXML(markupentityobj[i]);
            xmlmarkupobj.savemetolist();
        }

        drawmarkupAll(cntximg);

    }


}*/



imageObject = function(xmldata,blockname){
    //<image x1='1908247.00' y1='1777044.00' x2='2851685.00' y2='2484622.00' type="png" encoding="base64">
    this.blockname = blockname;
    this.blockstate = 1;
    this.layerstate = 1;
    //this.layer = parseInt(xmldata.attributes.getNamedItem('la').value);
    //this.layerstate = 1;

    this.x1 = parseFloat(xmldata.attributes.getNamedItem('x1').value);
    this.y1 = parseFloat(xmldata.attributes.getNamedItem('y1').value);
    this.x2 = parseFloat(xmldata.attributes.getNamedItem('x2').value);
    this.y2 = parseFloat(xmldata.attributes.getNamedItem('y2').value);


    var createimage = new Image();
    createimage.src = xmldata.childNodes[1].data;

    this.image = createimage;


    this.drawemecompare = function(ctx,scalefactor,offsetx,offsety, mediax, mediay,mediah,color){
        this.drawcompare = true;
        this.comparecolor = color;
        this.drawme(ctx,scalefactor,offsetx,offsety, mediax, mediay,mediah);

    };


    this.drawme = function(ctx,scalefactor,offsetx,offsety, mediax, mediay,mediah){
        var x1scaled = (this.x1-mediax) * scalefactor;
        var y1scaled = (mediah - this.y1) * scalefactor;
        var x2scaled = (this.x2-mediax) * scalefactor;
        var y2scaled = (mediah - this.y2) * scalefactor;

        x1scaled += offsetx;
        y1scaled += offsety;
        x2scaled += offsetx;
        y2scaled += offsety;

        var height = y1scaled - y2scaled;
        var width = x2scaled - x1scaled;


        ctx.drawImage(this.image, x1scaled, y2scaled,width, height);
        //ctx.save();


    }


};



lineObject = function(xmldata,blockname){
    // <line x1="1108602768.00" y1="-433854298.00" x2="1108602767.00" y2="-433830557.00" fs='0' ls='0' lc="#FF69B4" lw='0.00' pen='2' la='41'/>

    this.blockname = blockname;
    this.blockstate = 1;
    this.layer = parseInt(xmldata.attributes.getNamedItem('la').value);
    this.layerstate = 1;
    /*if(xmldata.attributes.getNamedItem('fs') != undefined){
        this.filled = parseInt(xmldata.attributes.getNamedItem('fs').value);
    }*/

    if (xmldata.attributes.getNamedItem('pen') != undefined){
        this.pen = parseInt(xmldata.attributes.getNamedItem('pen').value);
    }else{
        this.pen = 0;
    }


    //this.pen = parseInt(xmldata.attributes.getNamedItem('pen').value);


    this.strokecolor = xmldata.attributes.getNamedItem('lc').value;
    this.fillcolor = xmldata.attributes.getNamedItem('lc').value;


    var lw = parseFloat(xmldata.attributes.getNamedItem('lw').value);
    if (lw == 0 ){
        this.linewidth = 1;
    }else{
        this.linewidth = lw;
    }

    this.x1 = parseFloat(xmldata.attributes.getNamedItem('x1').value);
    this.y1 = parseFloat(xmldata.attributes.getNamedItem('y1').value);
    this.x2 = parseFloat(xmldata.attributes.getNamedItem('x2').value);
    this.y2 = parseFloat(xmldata.attributes.getNamedItem('y2').value);

    this.drawemecompare = function(ctx,scalefactor,offsetx,offsety, mediax, mediay,mediah,color){
        this.drawcompare = true;
        this.comparecolor = color;
        this.drawme(ctx,scalefactor,offsetx,offsety, mediax, mediay,mediah);

    };


    this.drawme = function(ctx,scalefactor,offsetx,offsety, mediax, mediay,mediah){
        var x1scaled = (this.x1-mediax) * scalefactor;
        var y1scaled = (mediah - this.y1) * scalefactor;
        var x2scaled = (this.x2-mediax) * scalefactor;
        var y2scaled = (mediah - this.y2) * scalefactor;

        x1scaled += offsetx;
        y1scaled += offsety;
        x2scaled += offsetx;
        y2scaled += offsety;

        //ctx.save();
        ctx.lineCap = 'round';
        //ctx.imageSmoothingEnabled = false;
        if(this.strokecolor == backgroundColor){
            if(backgroundColor == "#FFFFFF"){
                this.strokecolor = "#000000";
            }
            if(backgroundColor == "#000000"){
                this.strokecolor = "#FFFFFF";
            }
        }

        if(this.drawcompare){
            ctx.strokeStyle = this.comparecolor;
        }else{
            ctx.strokeStyle = this.strokecolor;
        }

        if (this.linewidth * scalefactor < 1){
            ctx.lineWidth = 1;
        }else{
            ctx.lineWidth = this.linewidth * scalefactor;
        }
        //ctx.lineWidth = this.linewidth * scalefactor;


        ctx.beginPath();
        ctx.moveTo(x1scaled, y1scaled);
        ctx.lineTo(x2scaled, y2scaled);
        ctx.stroke();

        this.drawcompare = false;
    };

};

circleObject = function(xmldata,blockname){
    var circleHandle = this;
    //circle cx="388466.18" cy="1351977.86" r="10152.93"  fs='0' ls='0' lc="#808080" lw='0.00' wt='25' pen='8' la='3'/>

    this.blockname = blockname;
    this.blockstate = 1;
    this.layer = parseInt(xmldata.attributes.getNamedItem('la').value);
    this.layerstate = 1;
    this.filled = parseInt(xmldata.attributes.getNamedItem('fs').value);


    this.strokecolor = xmldata.attributes.getNamedItem('lc').value;
    this.fillcolor = xmldata.attributes.getNamedItem('lc').value;


    var lw = parseFloat(xmldata.attributes.getNamedItem('lw').value);
    if (lw == 0 ){
        this.linewidth = 1;
    }else{
        this.linewidth = lw;
    }

    this.cx = parseFloat(xmldata.attributes.getNamedItem('cx').value);
    this.cy = parseFloat(xmldata.attributes.getNamedItem('cy').value);
    this.r = parseFloat(xmldata.attributes.getNamedItem('r').value);

    this.drawemecompare = function(ctx,scalefactor,offsetx,offsety, mediax, mediay,mediah,color){
        this.drawcompare = true;
        this.comparecolor = color;
        this.drawme(ctx,scalefactor,offsetx,offsety, mediax, mediay,mediah);

    };


    this.drawme = function(ctx,scalefactor,offsetx,offsety, mediax, mediay,mediah){
        var absxscaled = (this.cx-mediax) * scalefactor;
        var absyscaled = (mediah - this.cy) * scalefactor;
        var absradius = this.r * scalefactor;

        absxscaled += offsetx;
        absyscaled += offsety;
        ctx.lineCap = 'round';
        if(this.strokecolor == backgroundColor){
            if(backgroundColor == "#FFFFFF"){
                this.strokecolor = "#000000";
            }
            if(backgroundColor == "#000000"){
                this.strokecolor = "#FFFFFF";
            }
        }


        if(this.drawcompare){
            ctx.strokeStyle = this.comparecolor;
        }else{
            ctx.strokeStyle = this.strokecolor;
        }


        if (this.linewidth * scalefactor < 1){
            ctx.lineWidth = 1;
        }else{
            ctx.lineWidth = this.linewidth * scalefactor;
        }

        ctx.beginPath();
        ctx.arc(absxscaled, absyscaled, absradius, 0, 2 * Math.PI, false);
        if (this.filled ==1){
            if(this.drawcompare){
                ctx.fillStyle = this.comparecolor;
            }else{
                ctx.fillStyle = this.fillcolor;
            }
            ctx.fill();
            //ctx.lineWidth = 5;
            //ctx.strokeStyle = '#003300';

        }
        ctx.stroke();

        this.drawcompare = false;

    };

};

subPathObject = function(points,parentpath,last){
    var pathHandle = this;
    this.blockname = parentpath.blockname;
    this.blockstate = parentpath.blockstate;
    this.layer = parentpath.layer;
    this.layerstate = parentpath.layerstate;
    this.strokecolor = parentpath.strokecolor;
    this.fillcolor = parentpath.fillcolor;
    this.filled = parentpath.filled;
    this.linewidth = parentpath.linewidth;
    this.points = new Float32Array(points.length*2);
    this.last = last;

    var firstpointpair = points[0].trim();
    var firstpoint = firstpointpair.split(',');
    this.points[0] = parseFloat(firstpoint[0]);
    this.points[1] = parseFloat(firstpoint[1]);
    var prevfloat1 = this.points[0];
    var prevfloat2 = this.points[1];


    var count = 0;
    for(var i= 1;i<points.length;i++ ){
        var relpoint = points[i].trim();
        var relpoints = relpoint.split(',');
        var tempfloat1 = parseFloat(relpoints[0]);
        var tempfloat2 = parseFloat(relpoints[1]);
        this.points[i+1+count] = prevfloat1 + tempfloat1;
        this.points[i+2+count] = prevfloat2 + tempfloat2;
        prevfloat1 = this.points[i+1+count];
        prevfloat2 = this.points[i+2+count];

        count ++;
    }

    this.findsnapPoint = function (x,y,scalefactor,offsetx,offsety,mediax,mediay,mediah){

        var absxscaled = (this.points[0]-mediax) * scalefactor;
        var absyscaled = (mediah - this.points[1]) * scalefactor;

        var relxscaled = 0;
        var relyscaled = 0;

        absxscaled += offsetx;
        absyscaled += offsety;
        var snapradius = 10;
        if (absxscaled > x - snapradius && absxscaled < x + snapradius){
            if(absyscaled > y - snapradius && absyscaled < y + snapradius){


                return {
                    found:true,
                    x:absxscaled,
                    y:absyscaled
                };
            }

        }
        for (counter=2;counter<this.points.length;counter+=2){

            relxscaled = ((this.points[counter]-mediax) * scalefactor);
            relyscaled = ((mediah - this.points[counter+1]) * scalefactor);
            relxscaled += offsetx;
            relyscaled += offsety;
            if (relxscaled > x - snapradius && relxscaled < x + snapradius){
                if(relyscaled > y - snapradius && relyscaled < y + snapradius){

                    return {
                        found:true,
                        x:relxscaled,
                        y:relyscaled
                    };
                }

            }


        }
        return {
            found:false,
            x:0,
            y:0
        };


    };

    this.drawemecompare = function(ctx,scalefactor,offsetx,offsety, mediax, mediay,mediah,color){
        this.drawcompare = true;
        this.comparecolor = color;
        this.drawme(ctx,scalefactor,offsetx,offsety, mediax, mediay,mediah);

    };

    this.drawme = function(ctx,scalefactor,offsetx,offsety, mediax, mediay,mediah){
        var absxscaled = (this.points[0]-mediax) * scalefactor;
        var absyscaled = (mediah - this.points[1]) * scalefactor;
        var relxscaled = 0;
        var relyscaled = 0;

        absxscaled += offsetx;
        absyscaled += offsety;

        //ctx.save();

        //ctx.imageSmoothingEnabled = false;
        //ctx.globalCompositeOperation = 'destination-out';
        ctx.lineCap = 'round';
        ctx.imageSmoothingEnabled = false;
        if(this.strokecolor == backgroundColor){
            if(backgroundColor == "#FFFFFF"){
                this.strokecolor = "#000000";
            }
            if(backgroundColor == "#000000"){
                this.strokecolor = "#FFFFFF";
            }
        }

        if(this.drawcompare){
            ctx.strokeStyle = this.comparecolor;
        }else{
            ctx.strokeStyle = this.strokecolor;
        }


        if (this.linewidth * scalefactor < 1 && this.filled == 0){
            ctx.lineWidth = 1;
        }else{
            ctx.lineWidth = this.linewidth * scalefactor;


        }


        /*if (this.linewidth * scalefactor < 1){
            ctx.lineWidth = 1;
        }else{
            //ctx.lineWidth = this.linewidth * scalefactor;
            ctx.lineWidth = 1;
        }*/
        //ctx.lineWidth = this.linewidth * scalefactor;


        //ctx.beginPath();


//      ctx.moveTo(markupobject.points[0].x, markupobject.points[0].y);
        ctx.moveTo(absxscaled, absyscaled);
        var count = 0;
        for (counter=2;counter<this.points.length;counter+=2){
//            ctx.lineTo(markupobject.points[counter].x, markupobject.points[counter].y);
            relxscaled = ((this.points[counter]-mediax) * scalefactor);
            relyscaled = ((mediah - this.points[counter+1]) * scalefactor);
            relxscaled += offsetx;
            relyscaled += offsety;
            //xscaled = xscaled + offsetx;
            //yscaled = yscaled + offsety;
            ctx.lineTo(relxscaled, relyscaled);

        }
        ctx.closePath();
        ctx.lineCap = 'round';

        if(this.last){
            if (this.filled == 1){



                if(this.drawcompare){
                    ctx.fillStyle = this.comparecolor;
                }else{
                    ctx.fillStyle = this.fillcolor;
                }

                ctx.fill();
            }else{
                //ctx.closePath();

                //ctx.fillStyle = this.fillcolor;
                //ctx.fill();

            }
            //ctx.closePath();

            ctx.stroke();
            this.drawcompare = false;
        }
        //ctx.clip();
        //ctx.restore();

    };

};


pathObject = function(xmldata,blockname){

    var pathHandle = this;


    //fs='0' ls='0' lc="#FFFFFF" lw='0.00' wt='25' pen='7' la='8'

    this.blockname = blockname;
    this.blockstate = 1;
    this.layer = parseInt(xmldata.attributes.getNamedItem('la').value);
    this.layerstate = 1;
    //this.pennumber = parseInt(xmldata.attributes.getNamedItem('pen').value);
    this.strokecolor = xmldata.attributes.getNamedItem('lc').value;
    //this.strokecolor = 'red';
    this.fillcolor = xmldata.attributes.getNamedItem('lc').value;
    //this.fillcolor = 'red';
    this.filled = parseInt(xmldata.attributes.getNamedItem('fs').value);
    this.gotsubpath = false;
    this.subpaths = [];


    this.startpoint = xmldata.attributes.getNamedItem('d').value;


    var lw = parseFloat(xmldata.attributes.getNamedItem('lw').value);
    if (lw == 0 ){
        this.linewidth = 1;
    }else{
        this.linewidth = lw;
    }

    var firstsplit = this.startpoint.split('M');
    var secondsplit = firstsplit[1].split('l');
    this.points = new Float32Array(secondsplit.length*2);

    var firstpointpair = secondsplit[0].trim();
    var firstpoint = firstpointpair.split(',');
    this.points[0] = parseFloat(firstpoint[0]);
    this.points[1] = parseFloat(firstpoint[1]);
    var prevfloat1 = this.points[0];
    var prevfloat2 = this.points[1];


    var count = 0;
    for(var i= 1;i<secondsplit.length;i++ ){
        var relpoint = secondsplit[i].trim();
        var relpoints = relpoint.split(',');
        var tempfloat1 = parseFloat(relpoints[0]);
        var tempfloat2 = parseFloat(relpoints[1]);
        this.points[i+1+count] = prevfloat1 + tempfloat1;
        this.points[i+2+count] = prevfloat2 + tempfloat2;
        prevfloat1 = this.points[i+1+count];
        prevfloat2 = this.points[i+2+count];

        count ++;
    }

    if(firstsplit.length > 2){

        for(var sp=2;sp<firstsplit.length;sp++){
            this.gotsubpath = true;
            var subpath = firstsplit[sp].split('l');
            this.subpaths.push(subpath);
        }
    }


    this.findsnapPoint = function (x,y,scalefactor,offsetx,offsety,mediax,mediay,mediah){

        var absxscaled = (this.points[0]-mediax) * scalefactor;
        var absyscaled = (mediah - this.points[1]) * scalefactor;

        var relxscaled = 0;
        var relyscaled = 0;

        absxscaled += offsetx;
        absyscaled += offsety;
        var snapradius = 10;
        if (absxscaled > x - snapradius && absxscaled < x + snapradius){
            if(absyscaled > y - snapradius && absyscaled < y + snapradius){


                return {
                    found:true,
                    x:absxscaled,
                    y:absyscaled
                };
            }

        }
        for (counter=2;counter<this.points.length;counter+=2){

            relxscaled = ((this.points[counter]-mediax) * scalefactor);
            relyscaled = ((mediah - this.points[counter+1]) * scalefactor);
            relxscaled += offsetx;
            relyscaled += offsety;
            if (relxscaled > x - snapradius && relxscaled < x + snapradius){
                if(relyscaled > y - snapradius && relyscaled < y + snapradius){

                    return {
                        found:true,
                        x:relxscaled,
                        y:relyscaled
                    };
                }

            }


        }
        return {
            found:false,
            x:0,
            y:0
        };


    };

    this.drawemecompare = function(ctx,scalefactor,offsetx,offsety, mediax, mediay,mediah,color){
        this.drawcompare = true;
        this.comparecolor = color;
        this.drawme(ctx,scalefactor,offsetx,offsety, mediax, mediay,mediah);

    };


    this.drawme = function(ctx,scalefactor,offsetx,offsety, mediax, mediay,mediah){
        var absxscaled = (this.points[0]-mediax) * scalefactor;
        var absyscaled = (mediah - this.points[1]) * scalefactor;
        var relxscaled = 0;
        var relyscaled = 0;

        absxscaled += offsetx;
        absyscaled += offsety;

        //ctx.save();

        //ctx.imageSmoothingEnabled = false;
        //ctx.restore();
        //ctx.globalCompositeOperation = 'source-over';
        ctx.lineCap = 'round';
        ctx.imageSmoothingEnabled = false;
        if(this.fillcolor == backgroundColor){
            if(backgroundColor == "#FFFFFF"){
                this.fillcolor = "#000000";
            }
            if(backgroundColor == "#000000"){
                this.fillcolor = "#FFFFFF";
            }

        }

        if(this.strokecolor == backgroundColor){
            if(backgroundColor == "#FFFFFF"){
                this.strokecolor = "#000000";
            }
            if(backgroundColor == "#000000"){
                this.strokecolor = "#FFFFFF";
            }
        }

        if(this.drawcompare){
            ctx.strokeStyle = this.comparecolor;
        }else{
            ctx.strokeStyle = this.strokecolor;
        }



        if (this.linewidth * scalefactor < 1 && this.filled == 0){
            ctx.lineWidth = 1;
        }else{
            ctx.lineWidth = this.linewidth * scalefactor;


        }


        /*if (this.linewidth * scalefactor < 1){
            ctx.lineWidth = 1;
        }else{
            ctx.lineWidth = 1;
            //ctx.lineWidth = this.linewidth * scalefactor;
        }*/
        //ctx.lineWidth = this.linewidth * scalefactor;


        ctx.beginPath();


//      ctx.moveTo(markupobject.points[0].x, markupobject.points[0].y);
        ctx.moveTo(absxscaled, absyscaled);
        var count = 0;
        for (counter=2;counter<this.points.length;counter+=2){
//            ctx.lineTo(markupobject.points[counter].x, markupobject.points[counter].y);
            relxscaled = ((this.points[counter]-mediax) * scalefactor);
            relyscaled = ((mediah - this.points[counter+1]) * scalefactor);
            relxscaled += offsetx;
            relyscaled += offsety;
            //xscaled = xscaled + offsetx;
            //yscaled = yscaled + offsety;
            ctx.lineTo(relxscaled, relyscaled);

        }


        if(!this.gotsubpath){
            if (this.filled == 1){

                ctx.closePath();
                if(this.drawcompare){
                    ctx.fillStyle = this.comparecolor;
                }else{
                    ctx.fillStyle = this.fillcolor;
                }
                ctx.fill();
            }
            ctx.lineCap = 'round';
            ctx.stroke();

        }

        //ctx.clip();

        //ctx.restore();
        this.drawcompare = false;
    };


};

LayerObject = function (layerxmldata){

    this.index = parseInt(layerxmldata.attributes.getNamedItem('index').value);
    this.name = layerxmldata.attributes.getNamedItem('name').value;
    this.state = parseInt(layerxmldata.attributes.getNamedItem('state').value);
    this.color = layerxmldata.attributes.getNamedItem('color').value;

    var nametd = "<TD>" + this.name + "</TD>";
    var colortd = "<TD bgcolor='" + this.color + "'>" + "</TD>";

    if (this.state == 1){
        var checkboxtd = "<TD>" + "<input type='checkbox' name='layer"+ this.index + "' value='On' checked onChange='VturnLayerOnOff(" + this.index + ")'>"+"</TD>\n";
    }else{
        checkboxtd = "<TD>" + "<input type='checkbox' name='layer"+ this.index + "' value='Off' onChange='VturnLayerOnOff(" + this.index + ")'>"+"</TD>\n";
    }

    this.tableline = '<TR>' + nametd + colortd + checkboxtd + '</TR>';

    this.turnLayerOnOff = function(index){

    };

    /*<layer index="0" name="0" state="1" color="#000000"/>
     <layer index="1" name="VSBOUND2" state="1" color="#52A591"/>
     <layer index="2" name="VTRAF3B" state="1" color="#FF3F00"/>
     <layer index="3" name="VTRAFF" state="1" color="#FF9F7F"/>
     <layer index="4" name="ELEVEXIST" state="1" color="#FFFF00"/>
     <layer index="5" name="VTRAF3HI" state="1" color="#0000FF"/>
     <layer index="6" name="VTRAF3RD" state="1" color="#00FF00"/>
     <layer index="7" name="PEUTXT" state="1" color="#000000"/>
     <layer index="8" name="TEXT" state="1" color="#000000"/>
     <layer index="9" name="T__TEXT" state="1" color="#FFFF00"/>
     <layer index="10" name="T__SCHN" state="1" color="#FF0000"/>
     <layer index="11" name="T__KOPF" state="1" color="#00FF00"/>
     <layer index="12" name="BORDER" state="1" color="#000000"/>*/
};

BlockObject = function(index, name, state){
    this.index = index;
    this.name = name;
    this.state = state;

    var nametd = "<TD>" + this.name + "</TD>";

    if (this.state == 1){
        var checkboxtd = "<TD>" + "<input type='checkbox' name='"+ this.name + "' value='On' checked onChange='VturnBlockOnOff(" + "\"" +  this.name + "\"" + ")'>"+"</TD>\n";
    }else{
        checkboxtd = "<TD>" + "<input type='checkbox' name='"+ this.name + "' value='Off' onChange='VturnBlockOnOff(" + "\"" + this.name + "\"" + ")'>"+"</TD>\n";
    }

    this.tableline = '<TR>' + nametd + checkboxtd + '</TR>';


};

VectorPageObject = function (pagexmldata){

    if (pagexmldata.getElementsByTagName('mediabox')[0] != undefined && pagexmldata.getElementsByTagName('mediabox')[0] != null){

        this.x = parseFloat(pagexmldata.getElementsByTagName('mediabox')[0].attributes.getNamedItem('x1').value);
        this.y = parseFloat(pagexmldata.getElementsByTagName('mediabox')[0].attributes.getNamedItem('y1').value);
        this.w = parseFloat(pagexmldata.getElementsByTagName('mediabox')[0].attributes.getNamedItem('x2').value);
        this.h = parseFloat(pagexmldata.getElementsByTagName('mediabox')[0].attributes.getNamedItem('y2').value);

        this.scale = parseFloat(pagexmldata.getElementsByTagName('scale')[0].firstChild.nodeValue);
        this.offsetx = parseFloat(pagexmldata.getElementsByTagName('offsetx')[0].firstChild.nodeValue);
        this.offsety = parseFloat(pagexmldata.getElementsByTagName('offsety')[0].firstChild.nodeValue);


    }else{
        return;
    }

    this.docompare = false;
    this.isbackground = false;
    this.comparecolor = 'red';

    this.layerlist = [];
    this.numlayers = -1;

    this.blocklist = [];
    this.numblocks = -1;

    this.layerhtml = "<table><tr><td>Name</td><td>Color</td><td>state</td>";
    this.blockhtml = "<table><tr><td>Name</td><td>state</td>";


    var layers = pagexmldata.getElementsByTagName('layer');
    for (i=0;i<layers.length;i++){
        var NewLayer = new LayerObject(layers[i]);
        this.layerlist[NewLayer.index] = NewLayer;
        //this.layerlist.push(new LayerObject(layers[i]));
        this.numlayers ++;
        this.layerhtml += this.layerlist[NewLayer.index].tableline;
    }
    this.layerhtml += "</table>";

    //LayersContainer.innerHTML = this.layerhtml;
    //LayersContainer.parentNode.parentNode.style.height = canvaso.height + "px";


    this.pathlist = [];
    this.numpaths = -1;

    this.width = this.w - this.x;
    this.height = this.h - this.y;


    var blockobj = pagexmldata.getElementsByTagName('block');
    for (i=0;i<blockobj.length;i++){

        var blockname = blockobj[i].attributes.getNamedItem('name').value;
        this.blocklist[i] = new BlockObject(i, blockname, 1);
        this.blockhtml += this.blocklist[i].tableline;

        //this.blocklist[name].state = 1;

        var imageobject = blockobj[i].getElementsByTagName('image');
        for (j=0;j<imageobject.length;j++){
            this.pathlist.push(new imageObject(imageobject[j],blockname));
            this.numpaths ++;
        }


        var pathobject = blockobj[i].getElementsByTagName('path');
        for (var j=0;j<pathobject.length;j++){
            this.pathlist.push(new pathObject(pathobject[j],blockname));
            this.numpaths ++;
            //this.pathlist[this.numpaths].drawme(context,scalefactor,offsetx,offsety,this.x, this.y,this.h);
            var curpathnum = this.numpaths;
            var curpobj = this.pathlist[curpathnum];
            if(curpobj.gotsubpath){
                var islasthole = false;
                for(k=0;k<curpobj.subpaths.length;k++){
                    if(k==curpobj.subpaths.length-1){
                        islasthole = true;
                    }
                    this.pathlist.push(new subPathObject(curpobj.subpaths[k],curpobj,islasthole));
                    this.numpaths ++;
                    //this.pathlist[this.numpaths].drawme(context,scalefactor,offsetx,offsety,this.x, this.y,this.h);
                }

            }
        }
        var circleobject = blockobj[i].getElementsByTagName('circle');
        for (j=0;j<circleobject.length;j++){
            this.pathlist.push(new circleObject(circleobject[j],blockname));
            this.numpaths ++;
        }
        var lineobject = blockobj[i].getElementsByTagName('line');
        for (j=0;j<lineobject.length;j++){
            this.pathlist.push(new lineObject(lineobject[j],blockname));
            this.numpaths ++;
        }


    }
    this.blockhtml += "</table>";
    //BlocksContainer.innerHTML = this.blockhtml;
    //BlocksContainer.parentNode.parentNode.style.height = canvaso.height + "px";


    /*var pathobject = pagexmldata.getElementsByTagName('path');
     for (i=0;i<pathobject.length;i++){
     this.pathlist.push(new pathObject(pathobject[i]));
     this.numpaths ++;
     }*/

    /*var circleobject = pagexmldata.getElementsByTagName('circle');
     for (i=0;i<circleobject.length-1;i++){
     this.pathlist.push(new circleObject(circleobject[i]));
     this.numpaths ++;
     }*/
    /*var lineobject = pagexmldata.getElementsByTagName('line');
     for (i=0;i<lineobject.length-1;i++){
     this.pathlist.push(new lineObject(lineobject[i]));
     this.numpaths ++;
     }*/

    this.drawallcmpre = function(context,scalefactor,offsetx,offsety,refresh,comparecolor,isbackground){

        this.isbackground = isbackground;
        this.docompare = true;
        this.comparecolor = comparecolor;
        //backgroundColor = 'white';
        if(this.isbackground){
            context.globalCompositeOperation = 'source-over';
            context.fillStyle = 'white';
            context.fillRect(offsetx, offsety, this.width*scalefactor, this.height*scalefactor);

        }else{
            context.globalCompositeOperation = 'darken';
        }


        this.drawall(context,scalefactor,offsetx,offsety,refresh);

    };


    this.drawall = function(context,scalefactor,offsetx,offsety,pagenum){


        if(!this.docompare ){
            context.fillStyle = backgroundColor;
            context.fillRect(offsetx, offsety, this.width*scalefactor, this.height*scalefactor);

        }


        for (var i=0; i<this.pathlist.length;i++){
            var localoffsetx = this.x * scalefactor;
            var localoffsety = this.x * scalefactor;

            if (this.pathlist[i].layerstate == 1 && this.pathlist[i].blockstate == 1){
                if(this.docompare){
                    this.pathlist[pindx].drawemecompare(context,scalefactor,offsetx,offsety,this.x, this.y,this.h,this.comparecolor);
                }else{
                    this.pathlist[pindx].drawme(context,scalefactor,offsetx,offsety,this.x, this.y,this.h);
                }

            }


        }

        aDrawpages[pagenum] = true;

        doprintcheck();

        //if(nTotalPages == pagenum + 1 && bAllpagesloaded ){
            //all pages loaded

            //alert('printwindow');
            //PrintWindow();
        //}



    };

    this.turnLayerOnOff = function(layerindex){
        if (this.layerlist[layerindex].state == 1){
            this.layerlist[layerindex].state = 0;

        }else{
            this.layerlist[layerindex].state = 1;

        }

        for (var i=0; i<this.pathlist.length;i++){
            if(layerindex == this.pathlist[i].layer ){
                this.pathlist[i].layerstate = this.layerlist[layerindex].state;
            }

        }
        /*for (i=0;i<this.layerlist.length-1;i++){
         if (this.layerlist[i].index == layerindex){
         if (this.layerlist[i].state == 1){
         this.layerlist[i].state = 0;
         return;
         }else{
         this.layerlist[i].state = 1;
         return;
         }
         }
         }*/
    };

    this.turnBlockOnOff = function(blockName){
        for (i=0;i<this.blocklist.length;i++){
            if (blockName == this.blocklist[i].name && this.blocklist[i].state == 0 ){
                this.blocklist[i].state = 1;
                for (var j=0; j<this.pathlist.length;j++){
                    if(blockName == this.pathlist[j].blockname ){
                        this.pathlist[j].blockstate = 1;
                    }

                }

            }else if (blockName == this.blocklist[i].name && this.blocklist[i].state == 1 ){
                this.blocklist[i].state = 0;
                for (j=0; j<this.pathlist.length;j++){
                    if(blockName == this.pathlist[j].blockname ){
                        this.pathlist[j].blockstate = 0;
                    }

                }

            }



        }
    };



};


PageObject = function(pagexml, LayoutName,pagenumber, firstpage, path){

    var thispage = this;
    // 0 = large 1=small

    this.DocRef = null;
    this.currentimage = 0;
    this.pagenumber = pagenumber;


    //large image scale and offset
    this.dx=0.0;
    this.dy=0.0;
    this.dscale = 1.0;

    //vector image scale and offset
    this.dxvector=0.0;
    this.dyvector=0.0;
    this.dscalevector = 1.0;

    this.dxpdf=0.0;
    this.dypdf=0.0;
    this.dscalepdf = 1.0;
    this.curpagescale = 1.0;
    this.pagewidth = 0;
    this.pageheight = 0;

    this.visible = false;

    //composite properties and reference.
    this.usedincomposite = false;
    this.compositereference = undefined;
    this.isbackground = false;
    this.isoverlay = false;


    //small image scale and offset
    this.dxextent=0.0;
    this.dyextent=0.0;
    this.startx = 0.0;
    this.starty = 0.0;
    this.endx = 0.0;
    this.endy = 0.0;
    this.dscaleextent=1.0;
    this.drotation=0;
    this.usevectorxml=false;
    this.usepdfjs=false;
    this.pageloaded=false;
    this.VectorPageObj = undefined;

    this.largeimage = document.createElement('img');//new Image();
    this.smallimage = document.createElement('img');//new Image();
    this.smallimageloaded = false;
    this.largeimageloaded = false;
    this.thumbnnailloaded = false;
    //this.imagethumb = document.createElement('img');//new Image();

    this.CurrentMarkup = 0;
    //MarkupZoom

    if (pagenumber > 0){
        var container = canvaso.parentNode;
        this.canvpage = document.createElement('canvas');
        if(!this.canvpage){
            alert('Error: I cannot create a new canvas element!');
            return;
        }
        this.canvpage.id     = 'page' + pagenumber;
        this.canvpage.width  = canvaso.width;
        this.canvpage.height = canvaso.height;
        this.canvpage.style.width  = canvaso.style.width;
        this.canvpage.style.height = canvaso.style.height;

        container.appendChild(this.canvpage);

        this.contextpg = this.canvpage.getContext('2d');
        if (!this.contextpg) {
            alert('Error: failed to getContext!');
            return;
        }

    }else{
        this.canvpage = canvaso;
        this.contextpg = contexto;
    }

    this.LayoutName = LayoutName;
    if (pagexml.getElementsByTagName("PageName")[0] != undefined) {
        this.PageName = pagexml.getElementsByTagName("PageName")[0].firstChild.nodeValue;
    } else {
        this.PageName = LayoutName;
    }
    if (pagexml.getElementsByTagName("Compression")[0] != undefined) {
        this.Compression = pagexml.getElementsByTagName("Compression")[0].firstChild.nodeValue;
    }
    if (pagexml.getElementsByTagName("DPI")[0] != undefined) {
        this.DPI = pagexml.getElementsByTagName("DPI")[0].firstChild.nodeValue;
    }

    if (pagexml.getElementsByTagName("OffsetX")[0] != undefined) {
        this.OffsetX = pagexml.getElementsByTagName("OffsetX")[0].firstChild.nodeValue;
    }
    if (pagexml.getElementsByTagName("OffsetY")[0] != undefined) {
        this.OffsetY = pagexml.getElementsByTagName("OffsetY")[0].firstChild.nodeValue;
    }

    if (pagexml.getElementsByTagName("OriginalScale")[0] != undefined) {
        this.OriginalScale = pagexml.getElementsByTagName("OriginalScale")[0].firstChild.nodeValue;
    }

    if (pagexml.getElementsByTagName("Vector2DSRC")[0] != undefined){
        this.Vector2DSRC = encodeURI(xmlurlrel  + pagexml.getElementsByTagName("Vector2DSRC")[0].firstChild.nodeValue);
        this.usevectorxml = true;
        //this.VectorDisplaylist = new VectorDisplaylist(this.Vector2DSRC);
    }

    if(pagexml.getElementsByTagName("PrintImageSRC")[0] != undefined){
        this.PrintImageSRC = encodeURI(xmlurlrel + pagexml.getElementsByTagName("PrintImageSRC")[0].firstChild.nodeValue);
    }else{
        this.PrintImageSRC = '';
    }
    if(pagexml.getElementsByTagName("PrintImageWidth")[0] != undefined){
        this.PrintImageWidth = pagexml.getElementsByTagName("PrintImageWidth")[0].firstChild.nodeValue;
    }else{
        this.PrintImageWidth = 0;
    }
    if(pagexml.getElementsByTagName("PrintImageHeight")[0] != undefined){
        this.PrintImageHeight = pagexml.getElementsByTagName("PrintImageHeight")[0].firstChild.nodeValue;
    }else{
        this.PrintImageHeight = 0;
    }

    if(pagexml.getElementsByTagName("PrintPaperWidth")[0] != undefined){
        this.PrintPaperWidth = pagexml.getElementsByTagName("PrintPaperWidth")[0].firstChild.nodeValue;
    }else{
        this.PrintPaperWidth = 210;
    }
    if(pagexml.getElementsByTagName("PrintPaperHeight")[0] != undefined){
        this.PrintPaperHeight = pagexml.getElementsByTagName("PrintPaperHeight")[0].firstChild.nodeValue;
    }else{
        this.PrintPaperHeight = 297;
    }

    this.paperwidth = (this.PrintPaperWidth / 25.4)* 300;
    this.paperheight = (this.PrintPaperHeight / 25.4)* 300;

    this.paperwidthcss = (this.PrintPaperWidth / 25.4)* 96;
    this.paperheightcss = (this.PrintPaperHeight / 25.4)* 96;


    var szformatshort = DocObj.Format.substring(0,9);
    if (szformatshort == "Adobe PDF"){
        this.usepdfjs=true;
        //this.pagecanvas = document.createElement('canvas');
        //this.pagectx = this.pagecanvas.getContext('2d');
        this.pageRendering = false;
        this.pageNumPending = null;
        this.pagescale = 1.5;
        this.markupscaleadjust = 1.0;
        this.pdfdxtemp = 0.0;
        this.pdfdytemp = 0.0;
        this.pdfdscaletemp = 0.0;
    }else{
        this.MainImageSRC = encodeURI(xmlurlrel  + pagexml.getElementsByTagName("MainImageSRC")[0].firstChild.nodeValue);
        this.SmallImageSRC = encodeURI(xmlurlrel + pagexml.getElementsByTagName("SmallImageSRC")[0].firstChild.nodeValue);
        this.SmallImageWidth = pagexml.getElementsByTagName("SmallImageWidth")[0].firstChild.nodeValue;
        this.SmallImageHeight = pagexml.getElementsByTagName("SmallImageHeight")[0].firstChild.nodeValue;
        this.SmallImageScaling = pagexml.getElementsByTagName("SmallImageScaling")[0].firstChild.nodeValue;

    }

    this.ThumbnailImageSRC = xmlurlrel + pagexml.getElementsByTagName("ThumbnailImageSRC")[0].firstChild.nodeValue;

    this.MainImageWidth = pagexml.getElementsByTagName("MainImageWidth")[0].firstChild.nodeValue;
    this.MainImageHeight = pagexml.getElementsByTagName("MainImageHeight")[0].firstChild.nodeValue;
    this.MainImageScaling = pagexml.getElementsByTagName("MainImageScaling")[0].firstChild.nodeValue;
    this.MainImageOffsetX = pagexml.getElementsByTagName("MainImageOffsetX")[0].firstChild.nodeValue;
    this.MainImageOffsetY = pagexml.getElementsByTagName("MainImageOffsetY")[0].firstChild.nodeValue;
    this.ThumbnailWidth = pagexml.getElementsByTagName("ThumbnailWidth")[0].firstChild.nodeValue;
    this.ThumbnailHeight = pagexml.getElementsByTagName("ThumbnailHeight")[0].firstChild.nodeValue;

    this.smallimageprogress = function(ev){
        if (ev.lengthComputable) {
            //showDownloadDialog();
            var percentComplete = Math.round(ev.loaded * 100 / ev.total);
            if (percentComplete == 100){
                //hideDownloadDialog();
            }
        }
        else {
            //document.getElementById('progressNumber').innerHTML = 'unable to compute';
        }

    };

    this.largeimageprogress = function(ev){
        if (ev.lengthComputable) {
            //showDownloadDialog();
            var percentComplete = Math.round(ev.loaded * 100 / ev.total);
            if (percentComplete == 100){
                //hideDownloadDialog();
            }

        }
        else {
            //document.getElementById('progressNumber').innerHTML = 'unable to compute';
        }


    };

    this.smallimageload = function(ev){
        var yscale = 0.0;
        var xscale = 0.0;
        var dxlocal = 0.0;
        var dylocal = 0.0;
        var dscalelocal = 0.0;
        var imagewidth = 0;
        var imageheight = 0;

        imagewidth = thispage.SmallImageWidth;
        imageheight = thispage.SmallImageHeight;

        yscale = thispage.canvpage.height / thispage.SmallImageHeight;
        xscale = thispage.canvpage.width / thispage.SmallImageWidth;
        dscalelocal = Math.min(xscale,yscale);

        dxlocal = (thispage.canvpage.width - (thispage.SmallImageWidth*dscalelocal)) / 2;
        dylocal = (thispage.canvpage.height - (thispage.SmallImageHeight*dscalelocal)) / 2;

        thispage.setimagedimsmall(dxlocal,dylocal,dscalelocal);

    };

    this.largeimageload = function(ev){
        var yscale = 0.0;
        var xscale = 0.0;
        var dxlocal = 0.0;
        var dylocal = 0.0;
        var dscalelocal = 0.0;
        var imagewidth = 0;
        var imageheight = 0;

        imagewidth = thispage.MainImageWidth;
        imageheight = thispage.MainImageHeight;

        thispage.pagewidth = thispage.MainImageWidth;
        thispage.pageheight = thispage.MainImageHeight;

        yscale = thispage.canvpage.height / thispage.MainImageHeight;
        xscale = thispage.canvpage.width / thispage.MainImageWidth;

        dscalelocal = Math.min(xscale,yscale);

        dxlocal = (thispage.canvpage.width - (thispage.MainImageWidth*dscalelocal)) / 2;
        dylocal = (thispage.canvpage.height - (thispage.MainImageHeight*dscalelocal)) / 2;

        thispage.setimagedimlarge(dxlocal,dylocal,dscalelocal);
        //hideDownloadDialog();
    };

    this.getscaleoffset = function (){

        var yscale = 0;
        var xscale = 0;
        var pscale = 0;
        var px = 0;
        var py = 0;

        if(this.usevectorxml){
            yscale = thispage.canvpage.height / this.VectorPageObj.height;
            xscale = thispage.canvpage.width / this.VectorPageObj.width;
            pscale = Math.min(xscale,yscale);
            px = (thispage.canvpage.width - (this.VectorPageObj.width*pscale)) / 2;
            py = (thispage.canvpage.height - (this.VectorPageObj.height*pscale)) / 2;
        }else if(this.usepdfjs){

        }else{

        }

        return {
         pscale : pscale,
         px : px,
         py : py
        };



    };

    this.turnLayerOnOff = function(index){
        thispage.VectorPageObj.turnLayerOnOff(index);

        if(this.usedincomposite && this.compositereference != undefined ){
            this.compositereference.draw_compare();
        }else{
            this.draw_vector();
        }


        //this.draw_vector();
    };
    this.turnBlockOnOff = function(name){
        thispage.VectorPageObj.turnBlockOnOff(name);

        if(this.usedincomposite && this.compositereference != undefined ){
            this.compositereference.draw_compare();
        }else{
            this.draw_vector();
        }

        //this.draw_vector();
    };


    this.vectorload = function(ev){
        var yscale = 0.0;
        var xscale = 0.0;
        var dxlocal = 0.0;
        var dylocal = 0.0;
        var dscalelocal = 0.0;
        var imagewidth = 0;
        var imageheight = 0;

        if (ev.currentTarget.status == 200) {
            var xmlDoc = ev.currentTarget.responseXML;
            if (xmlDoc == null){
                try{
                 xmlDoc = $.parseXML(ev.currentTarget.responseText).documentElement;
                 }
                 catch(e){
                 alert("Error 1 - " + e);
                 return;
                 }
                console.log('xmldoc created using jquery');

            }
            thispage.VectorPageObj = new VectorPageObject(xmlDoc);

            yscale = thispage.canvpage.height / thispage.VectorPageObj.height; //thispage.MainImageHeight;
            xscale = thispage.canvpage.width / thispage.VectorPageObj.width; // thispage.MainImageWidth;

            dscalelocal = Math.min(xscale,yscale);

            dxlocal = (thispage.canvpage.width - (thispage.VectorPageObj.width*dscalelocal)) / 2;
            dylocal = (thispage.canvpage.height - (thispage.VectorPageObj.height*dscalelocal)) / 2;

            thispage.setvectordim(dxlocal,dylocal,dscalelocal);
        }

    };

    this.vectorprogress = function(ev){
        if (ev.lengthComputable) {
            //showDownloadDialog();
            var percentComplete = Math.round(ev.loaded * 100 / ev.total);
            if (percentComplete == 100){
                //hideDownloadDialog();
            }

        }
        else {
            //document.getElementById('progressNumber').innerHTML = 'unable to compute';
        }

    };


    this.loadvectors = function(){
        //showDownloadDialog();

        var xhr = new XMLHttpRequest();

        try{
            xhr.open('GET', this.Vector2DSRC, true);
        }
        catch(e){
            alert("Error 1 - " + e);
        }
        try{
            xhr.responseType = '';
        }
        catch(e){
            //alert("Error 2 - " + e);
        }
        xhr.addEventListener('load',this.vectorload,false);
        xhr.addEventListener('progress',this.vectorprogress,false);
        xhr.send();
    };

    this.setPDFdim = function(dx, dy,dscale){

        this.pageloaded = true;
        this.dxpdf=dx;
        this.dypdf=dy;

        this.dscalepdf = dscale;
        //this.initialscale = dscale;
        //this.vectorloaded = true;

        this.startx = this.dxpdf;
        this.starty = this.dypdf;
        //dxlocal = (canvaso.width - (thispage.VectorPageObj.width*dscalelocal)) / 2;
        //dylocal = (canvaso.height - (thispage.VectorPageObj.height*dscalelocal)) / 2;


        this.endx = (thispage.canvpage.width*this.dscalepdf) + this.startx;
        this.endy = (thispage.canvpage.height*this.dscalepdf) + this.starty;

        if (firstpage && !markuploaded){
            /*if(bUsemarkupbyref){

                getMarkupbyReference(path);
            }else{
                getMarkupFilelist(path);
            }*/

        }

        if(firstpage){
            //this.draw_canvas(true);
            this.visible = true;
        }

        drawmarkupAll(this.contextpg,pagenumber);
        //usepdfjs
        //hideDownloadDialog();
        //RxCore_default();


    };

    this.ispagevisible = function(){
        var isvisble = false;
        if(thispage.usepdfjs){
            if(thispage.dxpdf < canvaso.width && thispage.endx > 0 ){
                if(thispage.dypdf < canvaso.height && thispage.endy > 0 ){
                    isvisble = true;
                }
            }
        }
        return isvisble;
    };

    this.queRenderPageScaled = function(){
        if (thispage.pageRendering) {
            thispage.pageNumPending = thispage.pagenumber + 1;
            setTimeout(function(){thispage.pageRendering = false},30000);
            //console.log(thispage.pageNumPending);
        } else {
            thispage.renderPDFpagescale(true);
        }

    };

    this.queueRenderPage = function() {
        if (thispage.pageRendering) {
            thispage.pageNumPending = thispage.pagenumber + 1;
        } else {
            thispage.renderPDFpage();
        }
    };

    this.renderPDFpagescale = function(draw){
        this.pageRendering = true;
        // Using promise to fetch the page
        DocObj.pdfDoc.getPage(thispage.pagenumber + 1).then(function(page) {

            //var viewport = page.getViewport(scale);
            //canvas.height = viewport.height;
            //canvas.width = viewport.width;

            //PDFJS page scaling not to be confused with scaling of canvas image.
            //this.pagescale = thispage.pagescale;

            //page.view[0] = -dxlocal/scale;
            //page.view[1] = -dylocal/scale;

            var wscale = (thispage.canvpage.width * thispage.dscalepdf) / page.view[2];
            var hscale = (thispage.canvpage.height * thispage.dscalepdf) / page.view[3];
            var scale = Math.min(wscale,hscale);
            //console.log(scale);

            //thispage.pagecanvas.height *= this.dscalepdf;
            //thispage.pagecanvas.width *= this.dscalepdf;
            //var tempscale = 1 / thispage.pagescale;

            //tempscale *= thispage.dscalepdf;
            //thispage.pagescale *= thispage.dscalepdf;

            var viewport = page.getViewport(scale);
            //thispage.markupscaleadjust = scale / thispage.pagescale;
            if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPad/i))) {
                if (viewport.height * viewport.width < 5000000){
                    thispage.canvpage.height = viewport.height;
                    thispage.canvpage.width = viewport.width;
                    thispage.dscalepdf = 1;
                    thispage.markupscaleadjust = scale / thispage.pagescale;
                }else{
                    thispage.pageRendering = false;
                    //thispage.dscalepdf = scale;
                    return;

                }

            }else{
                thispage.canvpage.height = viewport.height;
                thispage.canvpage.width = viewport.width;
                thispage.dscalepdf = 1;
                thispage.markupscaleadjust = scale / thispage.pagescale;
            }

            if(thispage.canvpage.width <= canvaso.width){
                thispage.dxpdf = (canvaso.width - viewport.width) / 2;
            }


            //var wscale = thispage.pagecanvas.height / viewport.width;
            //var hscale = thispage.pagecanvas.height / viewport.height;
            //thispage.pdfdscaletemp = Math.min(wscale,hscale);

            //thispage.pdfdxtemp = (canvaso.width - (viewport.width*thispage.pdfdscaletemp)) / 2;
            //thispage.pdfdytemp = (canvaso.height - (viewport.height*thispage.pdfdscaletemp)) / 2;


            //canvaso.height = viewport.height;
            //canvaso.width = viewport.width;

            // Render PDF page into canvas context
            //this.pagecanvas = document.createElement('canvas');
            //this.pagectx = this.pagecanvas.getContext('2d');

            thispage.contextpg.clearRect(0, 0, thispage.canvpage.width, thispage.canvpage.height);
            thispage.contextpg.fillStyle = 'white';
            thispage.contextpg.fillRect(0, 0, thispage.canvpage.width, thispage.canvpage.height);

            var renderContext = {
                canvasContext: thispage.contextpg,
                viewport: viewport
            };

            var renderTask = page.render(renderContext);


            // Wait for rendering to finish
            renderTask.promise.then(function () {
                thispage.pageRendering = false;
                if (thispage.pageNumPending !== null) {
                    // New page rendering is pending
                    thispage.renderPDFpagescale(true);
                    thispage.pageNumPending = null;
                    //console.log(thispage.pageNumPending);
                }
                //DocObj.draw_mpagepdf();
                /*if(draw){
                 thispage.draw_canvas(true);
                 }*/

            });

        });

        // Update page counters
        //document.getElementById('page_num').textContent = pageNum;

    };


    this.renderPDFpage = function(){
        this.pageRendering = true;
        // Using promise to fetch the page
        DocObj.pdfDoc.getPage(thispage.pagenumber+1).then(function(page) {
            //var viewport = page.getViewport(scale);
            //canvas.height = viewport.height;
            //canvas.width = viewport.width;

            //PDFJS page scaling not to be confused with scaling of canvas image.
            //this.pagescale = thispage.pagescale;

            //page.view[0] = -dxlocal/scale;
            //page.view[1] = -dylocal/scale;

            //this.pagescale = 1.5;
            //var viewport = page.getViewport(thispage.pagescale);

            //test if current page scale 1.5 fit within canvas if not scale down until it does.
            //drawmarkupAll(this.contextpg,pagenumber);

            thispage.pagewidth = Math.abs(page.view[2]);
            thispage.pageheight = Math.abs(page.view[3]);


            var tempwscale = thispage.canvpage.width / thispage.pagewidth;
            var temphscale = thispage.canvpage.height / thispage.pageheight;




            thispage.pagescale = Math.min(tempwscale,temphscale);
            var viewport = page.getViewport(thispage.pagescale);

            thispage.curpagescale = thispage.pagescale;

            //var tempscale = thispage.pagescale / 1.5;

            //var viewport = page.getViewport(thispage.pagescale);

            /*if (viewport.height > thispage.canvpage.height && viewport.width > thispage.canvpage.width){
                var tempwscale = thispage.canvpage.width / page.view[2];
                var temphscale = thispage.canvpage.height / page.view[3];

                thispage.pagescale = Math.min(tempwscale,temphscale);
                viewport = page.getViewport(thispage.pagescale);
            }*/


            //thispage.pagecanvas.height = viewport.height;
            //thispage.pagecanvas.width = viewport.width;


            /*var wscale = thispage.pagecanvas.height / viewport.width;
            var hscale = thispage.pagecanvas.height / viewport.height;
            thispage.pdfdscaletemp = Math.min(wscale,hscale);*/

            //thispage.pdfdxtemp = ((thispage.canvpage.width*thispage.pagescale) - page.view[2]) / 2;
            //thispage.pdfdytemp = ((thispage.canvpage.height*thispage.pagescale) - page.view[3]) / 2;
            thispage.pdfdxtemp = 0;
            thispage.pdfdytemp = 0;
            //dxlocal = (thispage.canvpage.width - (thispage.VectorPageObj.width*dscalelocal)) / 2;
            //dylocal = (thispage.canvpage.height - (thispage.VectorPageObj.height*dscalelocal)) / 2;


            //canvaso.height = viewport.height;
            //canvaso.width = viewport.width;

            // Render PDF page into canvas context
            //this.pagecanvas = document.createElement('canvas');
            //this.pagectx = this.pagecanvas.getContext('2d');


            thispage.contextpg.clearRect(0, 0, thispage.canvpage.width, thispage.canvpage.height);
            thispage.contextpg.fillStyle = 'white';
            thispage.contextpg.fillRect(0, 0, thispage.canvpage.width, thispage.canvpage.height);


            var renderContext = {
                canvasContext: thispage.contextpg,
                viewport: viewport
            };


            //contexto.fillStyle = 'rgb(62, 62, 62)';
            //contexto.fillRect(0, 0, canvaso.width, canvaso.height);

            var renderTask = page.render(renderContext);


            // Wait for rendering to finish
            renderTask.promise.then(function () {
                thispage.pageRendering = false;
                if (thispage.pageNumPending !== null) {
                    // New page rendering is pending

                    thispage.renderPDFpage();
                    thispage.pageNumPending = null;

                }
                var tempscale = 1 - thispage.pagescale;

                //opener.DocObj.pages[thispage.pagenumber].pagescale
                thispage.markupscaleadjust =  thispage.curpagescale / opener.RxCore.printhelper().docObj.pages[thispage.pagenumber].curpagescale;

                thispage.setPDFdim(thispage.pdfdxtemp,thispage.pdfdytemp,thispage.pagescale);
                aDrawpages[pagenumber] = true;
                doprintcheck();

                //console.log(thispage.pdfdxtemp);
                //console.log(thispage.pdfdytemp);
                //console.log(pagenumber);

            });

        });

        // Update page counters
        //document.getElementById('page_num').textContent = pageNum;

    };

    this.loadimages = function(){
        //get_image(this.SmallImageSRC,this.smallimage);
        //showDownloadDialog();
        this.smallimage.addEventListener('load',this.smallimageload,false);
        this.smallimage.addEventListener('progress', this.smallimageprogress, false);
        this.smallimage.src = this.SmallImageSRC;

        //draw_image(ev.srcElement);
        //get_image(this.MainImageSRC,this.largeimage);
        //showDownloadDialog();
        this.largeimage.addEventListener('load',this.largeimageload,false);
        this.largeimage.addEventListener('progress', this.largeimageprogress, false);
        this.largeimage.src = this.MainImageSRC;

        //get_image(this.ThumbnailImageSRC,this.imagethumb);


    };
    //this.loadvector = function(this.Vector2DSRC){


    //  DrawVectors(this.VectorSRC);
    //};

    this.setvectordim = function(dx, dy,dscale){
        this.dxvector = dx;
        this.dyvector = dy;
        this.dscalevector = dscale;


        this.startx = this.dxvector;
        this.starty = this.dyvector;
        //dxlocal = (this.canvpage.width - (thispage.VectorPageObj.width*dscalelocal)) / 2;
        //dylocal = (this.canvpage.height - (thispage.VectorPageObj.height*dscalelocal)) / 2;

        thispage.pagewidth = thispage.VectorPageObj.width;
        thispage.pageheight = thispage.VectorPageObj.height;

        this.endx = (thispage.pagewidth*this.dscalevector) + this.startx;
        this.endy = (thispage.pageheight*this.dscalevector) + this.starty;

        if (firstpage && !markuploaded){
            //getMarkupFilelist(path);
        }


        //this.draw_vector();
        if(this.usedincomposite && this.compositereference != undefined ){
            this.compositereference.draw_compare();
        }else{
            this.draw_vector();
            drawmarkupAll(this.contextpg,pagenumber);
        }


        //console.log(DocObj.NumPages);
        //console.log(this.pagenumber + 1);


    };

    this.setimagedimlarge = function(dx,dy,dscale){
        this.dx = dx;
        this.dy = dy;
        this.dscale = dscale;
        this.largeimageloaded = true;
        this.zoomall();
        //redraw markup here in case scaling is available after markup is loaded.
        //documentopen = true;
        //drawmarkupAll(cntximg);
        if (firstpage && !markuploaded){
            //getMarkupFilelist(path);
        }
        //drawmarkupAll(this.contextpg,pagenumber);
        /*if(DocObj.NumPages == this.pagenumber + 1){
            //all pages loaded

            PrintWindow();
        }*/

    };
    this.setimagedimsmall = function(dx,dy,dscale){
        this.dxextent = dx;
        this.dyextent = dy;
        this.dscaleextent = dscale;
        this.startx = this.dxextent;
        this.starty = this.dyextent;
        this.endx = (this.SmallImageWidth*this.dscaleextent) + this.startx;
        this.endy = (this.SmallImageHeight*this.dscaleextent) + this.starty;
        this.smallimageloaded = true;
        this.zoomall();
        //draw image on screen for the first time after loading here.
        this.draw_image();


        //drawmarkupAll(this.contextpg,pagenumber);

        aDrawpages[pagenumber] = true;
        doprintcheck();

        drawmarkupAll(this.contextpg,pagenumber);
        //drawmarkupAll(cntximg);


    };

    this.checkimageswitch = function(){
        if(this.dscaleextent < imageswitchfactor){
            this.currentimage = 1;
            this.startx = this.dxextent;
            this.starty = this.dyextent;
            this.endx = (this.SmallImageWidth*this.dscaleextent) + this.startx;
            this.endy = (this.SmallImageHeight*this.dscaleextent) + this.starty;


        }else{
            this.currentimage = 0;
            this.startx = this.dx;
            this.starty = this.dy;
            this.endx = (this.MainImageWidth*this.dscale) + this.startx;
            this.endy = (this.MainImageHeight*this.dscale) + this.starty;

            //alert("switching to large image");
        }

        /*if (this.dscale > 0.3){
         this.currentimage = 0;
         //alert("switching to large image");
         }else{
         this.currentimage = 1;
         }*/

    };

    this.zoomall = function(){
        //SetImageDim(myimage);
        var yscale = this.dscale;
        var xscale = this.dscale;

        switch(this.drotation){
            case 0:
                yscale = this.canvpage.height / this.MainImageHeight;
                xscale = this.canvpage.width / this.MainImageWidth;
                this.dscale = Math.min(xscale,yscale);

                break;
            case 90:
                yscale = this.canvpage.height / this.MainImageWidth;
                xscale = this.canvpage.width / this.MainImageHeight;
                this.dscale = Math.min(xscale,yscale);

                break;
            case 180:
                yscale = this.canvpage.height / this.MainImageHeight;
                xscale = this.canvpage.width / this.MainImageWidth;
                this.dscale = Math.min(xscale,yscale);

                break;
            case 270:
                yscale = this.canvpage.height / this.MainImageWidth;
                xscale = this.canvpage.width / this.MainImageHeight;
                this.dscale = Math.min(xscale,yscale);

                break;

        }

        this.dx = (this.canvpage.width - (this.MainImageWidth*this.dscale)) / 2;
        this.dy = (this.canvpage.height - (this.MainImageHeight*this.dscale)) / 2;

        yscale = this.dscaleextent;
        xscale = this.dscaleextent;
        switch(this.drotation){
            case 0:
                yscale = this.canvpage.height / this.SmallImageHeight;
                xscale = this.canvpage.width / this.SmallImageWidth;
                this.dscaleextent = Math.min(xscale,yscale);

                break;
            case 90:
                yscale = this.canvpage.height / this.SmallImageWidth;
                xscale = this.canvpage.width / this.SmallImageHeight;
                this.dscaleextent = Math.min(xscale,yscale);

                break;
            case 180:
                yscale = this.canvpage.height / this.SmallImageHeight;
                xscale = this.canvpage.width / this.SmallImageWidth;
                this.dscaleextent = Math.min(xscale,yscale);

                break;
            case 270:
                yscale = this.canvpage.height / this.SmallImageWidth;
                xscale = this.canvpage.width / this.SmallImageHeight;
                this.dscaleextent = Math.min(xscale,yscale);

                break;

        }


        this.dxextent = (this.canvpage.width - (this.SmallImageWidth*this.dscaleextent)) / 2;
        this.dyextent = (this.canvpage.height - (this.SmallImageHeight*this.dscaleextent)) / 2;

        //this.dxvector=0.0;
        //this.dyvector=0.0;
        //this.dscalevector = 1.0;
        //yscale = this.canvpage.height / thispage.VectorPageObj.height; //thispage.MainImageHeight;
        //xscale = this.canvpage.width / thispage.VectorPageObj.width; // thispage.MainImageWidth;

        if (this.usevectorxml){
            yscale = this.dyvector;
            xscale = this.dxvector;
            switch(this.drotation){
                case 0:
                    yscale = this.canvpage.height / thispage.VectorPageObj.height;
                    xscale = this.canvpage.width / thispage.VectorPageObj.width;
                    this.dscalevector = Math.min(xscale,yscale);

                    break;
                case 90:
                    yscale = this.canvpage.height / thispage.VectorPageObj.width;
                    xscale = this.canvpage.width / thispage.VectorPageObj.height;
                    this.dscalevector = Math.min(xscale,yscale);

                    break;
                case 180:
                    yscale = this.canvpage.height / thispage.VectorPageObj.height;
                    xscale = this.canvpage.width / thispage.VectorPageObj.width;
                    this.dscalevector = Math.min(xscale,yscale);

                    break;
                case 270:
                    yscale = this.canvpage.height / thispage.VectorPageObj.width;
                    xscale = this.canvpage.width / thispage.VectorPageObj.height;
                    this.dscalevector = Math.min(xscale,yscale);

                    break;

            }


            this.dxvector = (this.canvpage.width - (thispage.VectorPageObj.width*this.dscalevector)) / 2;
            this.dyvector = (this.canvpage.height - (thispage.VectorPageObj.height*this.dscalevector)) / 2;

        }




        //this.currentimage = 1;
        if (!this.usevectorxml){
            this.checkimageswitch();
            this.draw_image();
            //drawmarkupAll(this.contextpg,pagenumber);

        }else{
            if(this.usedincomposite && this.compositereference != undefined ){
                this.compositereference.draw_compare();
            }else{
                this.draw_vector();
                //drawmarkupAll(this.contextpg,pagenumber);

            }
            //this.draw_vector();
        }

    };
    this.ZoomIn = function(factor,center){
        //mainscale
        var prevcenterx = (this.canvpage.width - (this.MainImageWidth*this.dscale)) / 2;
        var prevcentery = (this.canvpage.height - (this.MainImageHeight*this.dscale)) / 2;

        var diffx = prevcenterx - this.dx;
        var diffy = prevcentery - this.dy;


        this.dscale = this.dscale * factor;
        var centerx = ((this.canvpage.width - (this.MainImageWidth*this.dscale)) / 2);
        var centery = ((this.canvpage.height - (this.MainImageHeight*this.dscale)) / 2);

        if(center){

            this.dx = centerx;
            this.dy = centery;

        }else{
            this.dx = centerx - (diffx*factor);
            this.dy = centery - (diffy*factor);
        }

        //smallscale
        var prevcenterxext = (this.canvpage.width - (this.SmallImageWidth*this.dscaleextent)) / 2;
        var prevcenteryext = (this.canvpage.height - (this.SmallImageHeight*this.dscaleextent)) / 2;

        var diffxext = prevcenterxext - this.dxextent;
        var diffyext = prevcenteryext - this.dyextent;


        this.dscaleextent = this.dscaleextent * factor;

        var centerxext = ((this.canvpage.width - (this.SmallImageWidth*this.dscaleextent)) / 2);
        var centeryext = ((this.canvpage.height - (this.SmallImageHeight*this.dscaleextent)) / 2);


        if(center){
            this.dxextent = centerxext;
            this.dyextent = centeryext;
        }else{
            this.dxextent = centerxext - (diffxext*factor);
            this.dyextent = centeryext - (diffyext*factor);
        }
        //vectorscale


        //this.dxvector=0.0;
        //this.dyvector=0.0;
        //this.dscalevector = 1.0;

//        this.dxvector = (this.canvpage.width - (thispage.VectorPageObj.width*this.dscalevector)) / 2;
        //      this.dyvector = (this.canvpage.height - (thispage.VectorPageObj.height*this.dscalevector)) / 2;

        if (this.usevectorxml){
            var prevcenterxv = (this.canvpage.width - (thispage.VectorPageObj.width*this.dscalevector)) / 2;
            var prevcenteryv = (this.canvpage.height - (thispage.VectorPageObj.height*this.dscalevector)) / 2;

            var diffxv = prevcenterxv - this.dxvector;
            var diffyv = prevcenteryv - this.dyvector;


            this.dscalevector = this.dscalevector * factor;

            var centerxv = ((this.canvpage.width - (thispage.VectorPageObj.width*this.dscalevector)) / 2);
            var centeryv = ((this.canvpage.height - (thispage.VectorPageObj.height*this.dscalevector)) / 2);


            if(center){
                this.dxvector = centerxv;
                this.dyvector = centeryv;
            }else{
                this.dxvector = centerxv - (diffxv*factor);
                this.dyvector = centeryv - (diffyv*factor);
            }

        }

        //vectorscale
        if (!this.usevectorxml){
            this.checkimageswitch();
            this.draw_image();
            //drawmarkupAll(this.contextpg,pagenumber);
        }else{

            this.draw_vector();
            //drawmarkupAll(this.contextpg,pagenumber);
        }




    };

    this.ZoomOut = function(factor,center){

        var prevcenterx = (this.canvpage.width - (this.MainImageWidth*this.dscale)) / 2;
        var prevcentery = (this.canvpage.height - (this.MainImageHeight*this.dscale)) / 2;

        var diffx = prevcenterx - this.dx;
        var diffy = prevcentery - this.dy;

        this.dscale = this.dscale / factor;

        var centerx = (this.canvpage.width - (this.MainImageWidth*this.dscale)) / 2;
        var centery = (this.canvpage.height - (this.MainImageHeight*this.dscale)) / 2;


        if(center){
            this.dx = centerx;
            this.dy = centery;
        }else{
            this.dx = centerx - (diffx/factor);
            this.dy = centery - (diffy/factor);
        }

        var prevcenterxext = (this.canvpage.width - (this.SmallImageWidth*this.dscaleextent)) / 2;
        var prevcenteryext = (this.canvpage.height - (this.SmallImageHeight*this.dscaleextent)) / 2;

        var diffxext = prevcenterxext - this.dxextent;
        var diffyext = prevcenteryext - this.dyextent;

        this.dscaleextent = this.dscaleextent / factor;

        var centerxext = (this.canvpage.width - (this.SmallImageWidth*this.dscaleextent)) / 2;
        var centeryext = (this.canvpage.height - (this.SmallImageHeight*this.dscaleextent)) / 2;


        if(center){
            this.dxextent = centerxext;
            this.dyextent = centeryext;

        }else{
            this.dxextent = centerxext - (diffxext/factor);
            this.dyextent = centeryext - (diffyext/factor);

        }
        if (this.usevectorxml){
            var prevcenterxv = (this.canvpage.width - (thispage.VectorPageObj.width*this.dscalevector)) / 2;
            var prevcenteryv = (this.canvpage.height - (thispage.VectorPageObj.height*this.dscalevector)) / 2;

            var diffxv = prevcenterxv - this.dxvector;
            var diffyv = prevcenteryv - this.dyvector;


            this.dscalevector = this.dscalevector / factor;

            var centerxv = ((this.canvpage.width - (thispage.VectorPageObj.width*this.dscalevector)) / 2);
            var centeryv = ((this.canvpage.height - (thispage.VectorPageObj.height*this.dscalevector)) / 2);


            if(center){
                this.dxvector = centerxv;
                this.dyvector = centeryv;
            }else{
                this.dxvector = centerxv - (diffxv/factor);
                this.dyvector = centeryv - (diffyv/factor);
            }

        }

        if (!this.usevectorxml){
            this.checkimageswitch();
            this.draw_image();
        }else{
            this.draw_vector();
        }

        //drawmarkupAll(this.contextpg,pagenumber);



    };


    this.zoomwidth = function(){

        var xscale = 0.0;

        switch(this.drotation){
            case 0:
                xscale = this.canvpage.width / this.MainImageWidth;
                this.dscale = xscale;

                xscale = this.canvpage.width / this.SmallImageWidth;
                this.dscaleextent = xscale;

                if (this.usevectorxml){
                    xscale = this.canvpage.width / thispage.VectorPageObj.width;
                    this.dscalevector = xscale;

                }


                this.dx = (this.canvpage.width - (this.MainImageWidth*this.dscale)) / 2;
                this.dy = (this.canvpage.height - (this.MainImageHeight*this.dscale)) / 2;

                this.dxextent = (this.canvpage.width - (this.SmallImageWidth*this.dscaleextent)) / 2;
                this.dyextent = (this.canvpage.height - (this.SmallImageHeight*this.dscaleextent)) / 2;

                if (this.usevectorxml){
                    this.dxvector = (this.canvpage.width - (thispage.VectorPageObj.width*this.dscalevector)) / 2;
                    this.dyvector = (this.canvpage.height - (thispage.VectorPageObj.height*this.dscalevector)) / 2;

                }


                break;
            case 90:

                xscale = this.canvpage.width / this.MainImageHeight;
                this.dscale = xscale;

                xscale = this.canvpage.width / this.SmallImageHeight;
                this.dscaleextent = xscale;

                if (this.usevectorxml){
                    xscale = this.canvpage.width / thispage.VectorPageObj.height;
                    this.dscalevector = xscale;

                }


                this.dx = (this.canvpage.width - (this.MainImageWidth*this.dscale)) / 2;
                this.dy = (this.canvpage.height - (this.MainImageHeight*this.dscale)) / 2;

                this.dxextent = (this.canvpage.width - (this.SmallImageWidth*this.dscaleextent)) / 2;
                this.dyextent = (this.canvpage.height - (this.SmallImageHeight*this.dscaleextent)) / 2;

                if (this.usevectorxml){
                    this.dxvector = (this.canvpage.width - (thispage.VectorPageObj.width*this.dscalevector)) / 2;
                    this.dyvector = (this.canvpage.height - (thispage.VectorPageObj.height*this.dscalevector)) / 2;

                }



                break;
            case 180:
                xscale = this.canvpage.width / this.MainImageWidth;
                this.dscale = xscale;

                xscale = this.canvpage.width / this.SmallImageWidth;
                this.dscaleextent = xscale;

                if (this.usevectorxml){
                    xscale = this.canvpage.width / thispage.VectorPageObj.width;
                    this.dscalevector = xscale;

                }


                this.dx = (this.canvpage.width - (this.MainImageWidth*this.dscale)) / 2;
                this.dy = (this.canvpage.height - (this.MainImageHeight*this.dscale)) / 2;

                this.dxextent = (this.canvpage.width - (this.SmallImageWidth*this.dscaleextent)) / 2;
                this.dyextent = (this.canvpage.height - (this.SmallImageHeight*this.dscaleextent)) / 2;

                if (this.usevectorxml){
                    this.dxvector = (this.canvpage.width - (thispage.VectorPageObj.width*this.dscalevector)) / 2;
                    this.dyvector = (this.canvpage.height - (thispage.VectorPageObj.height*this.dscalevector)) / 2;

                }


                break;
            case 270:
                xscale = this.canvpage.width / this.MainImageHeight;
                this.dscale = xscale;

                xscale = this.canvpage.width / this.SmallImageHeight;
                this.dscaleextent = xscale;

                if (this.usevectorxml){
                    xscale = this.canvpage.width / thispage.VectorPageObj.height;
                    this.dscalevector = xscale;

                }


                this.dx = (this.canvpage.width - (this.MainImageWidth*this.dscale)) / 2;
                this.dy = (this.canvpage.height - (this.MainImageHeight*this.dscale)) / 2;

                this.dxextent = (this.canvpage.width - (this.SmallImageWidth*this.dscaleextent)) / 2;
                this.dyextent = (this.canvpage.height - (this.SmallImageHeight*this.dscaleextent)) / 2;


                if (this.usevectorxml){
                    this.dxvector = (this.canvpage.width - (thispage.VectorPageObj.width*this.dscalevector)) / 2;
                    this.dyvector = (this.canvpage.height - (thispage.VectorPageObj.height*this.dscalevector)) / 2;

                }



                break;
            default:
                xscale = this.canvpage.width / this.MainImageWidth;
                this.dscale = xscale;

                xscale = this.canvpage.width / this.SmallImageWidth;
                this.dscaleextent = xscale;

                if (this.usevectorxml){
                    xscale = this.canvpage.width / thispage.VectorPageObj.width;
                    this.dscalevector = xscale;

                }


                this.dx = (this.canvpage.width - (this.MainImageWidth*this.dscale)) / 2;
                this.dy = (this.canvpage.height - (this.MainImageHeight*this.dscale)) / 2;

                this.dxextent = (this.canvpage.width - (this.SmallImageWidth*this.dscaleextent)) / 2;
                this.dyextent = (this.canvpage.height - (this.SmallImageHeight*this.dscaleextent)) / 2;

                if (this.usevectorxml){
                    this.dxvector = (this.canvpage.width - (thispage.VectorPageObj.width*this.dscalevector)) / 2;
                    this.dyvector = (this.canvpage.height - (thispage.VectorPageObj.height*this.dscalevector)) / 2;

                }


                break;

        }

        if (!this.usevectorxml){
            this.checkimageswitch();
            this.draw_image();
        }else{
            this.draw_vector();
        }

        //drawmarkupAll(this.contextpg,pagenumber);

    };

    this.zoomheight = function(){
        var yscale = 0.0;
        switch(this.drotation){
            case 0:
                yscale = this.canvpage.height / this.MainImageHeight;
                this.dscale = yscale;

                yscale = this.canvpage.height / this.SmallImageHeight;
                this.dscaleextent = yscale;

                if (this.usevectorxml){
                    yscale = this.canvpage.height / thispage.VectorPageObj.height;
                    this.dscalevector = yscale;

                }


                this.dx = (this.canvpage.width - (this.MainImageWidth*this.dscale)) / 2;
                this.dy = (this.canvpage.height - (this.MainImageHeight*this.dscale)) / 2;

                this.dxextent = (this.canvpage.width - (this.SmallImageWidth*this.dscaleextent)) / 2;
                this.dyextent = (this.canvpage.height - (this.SmallImageHeight*this.dscaleextent)) / 2;

                if (this.usevectorxml){
                    this.dxvector = (this.canvpage.width - (thispage.VectorPageObj.width*this.dscalevector)) / 2;
                    this.dyvector = (this.canvpage.height - (thispage.VectorPageObj.height*this.dscalevector)) / 2;

                }


                break;
            case 90:
                yscale = this.canvpage.height / this.MainImageWidth;
                this.dscale = yscale;

                yscale = this.canvpage.height / this.SmallImageWidth;
                this.dscaleextent = yscale;

                if (this.usevectorxml){
                    yscale = this.canvpage.height / thispage.VectorPageObj.width;
                    this.dscalevector = yscale;

                }


                this.dx = (this.canvpage.width - (this.MainImageWidth*this.dscale)) / 2;
                this.dy = (this.canvpage.height - (this.MainImageHeight*this.dscale)) / 2;

                this.dxextent = (this.canvpage.width - (this.SmallImageWidth*this.dscaleextent)) / 2;
                this.dyextent = (this.canvpage.height - (this.SmallImageHeight*this.dscaleextent)) / 2;

                if (this.usevectorxml){
                    this.dxvector = (this.canvpage.width - (thispage.VectorPageObj.width*this.dscalevector)) / 2;
                    this.dyvector = (this.canvpage.height - (thispage.VectorPageObj.height*this.dscalevector)) / 2;

                }



                break;
            case 180:
                yscale = this.canvpage.height / this.MainImageHeight;
                this.dscale = yscale;

                yscale = this.canvpage.height / this.SmallImageHeight;
                this.dscaleextent = yscale;

                if (this.usevectorxml){
                    yscale = this.canvpage.height / thispage.VectorPageObj.height;
                    this.dscalevector = yscale;

                }


                this.dx = (this.canvpage.width - (this.MainImageWidth*this.dscale)) / 2;
                this.dy = (this.canvpage.height - (this.MainImageHeight*this.dscale)) / 2;

                this.dxextent = (this.canvpage.width - (this.SmallImageWidth*this.dscaleextent)) / 2;
                this.dyextent = (this.canvpage.height - (this.SmallImageHeight*this.dscaleextent)) / 2;

                if (this.usevectorxml){
                    this.dxvector = (this.canvpage.width - (thispage.VectorPageObj.width*this.dscalevector)) / 2;
                    this.dyvector = (this.canvpage.height - (thispage.VectorPageObj.height*this.dscalevector)) / 2;

                }



                break;
            case 270:
                yscale = this.canvpage.height / this.MainImageWidth;
                this.dscale = yscale;

                yscale = this.canvpage.height / this.SmallImageWidth;
                this.dscaleextent = yscale;

                if (this.usevectorxml){
                    yscale = this.canvpage.height / thispage.VectorPageObj.width;
                    this.dscalevector = yscale;

                }


                this.dx = (this.canvpage.width - (this.MainImageWidth*this.dscale)) / 2;
                this.dy = (this.canvpage.height - (this.MainImageHeight*this.dscale)) / 2;

                this.dxextent = (this.canvpage.width - (this.SmallImageWidth*this.dscaleextent)) / 2;
                this.dyextent = (this.canvpage.height - (this.SmallImageHeight*this.dscaleextent)) / 2;

                if (this.usevectorxml){
                    this.dxvector = (this.canvpage.width - (thispage.VectorPageObj.width*this.dscalevector)) / 2;
                    this.dyvector = (this.canvpage.height - (thispage.VectorPageObj.height*this.dscalevector)) / 2;

                }

                break;

        }

        if (!this.usevectorxml){
            this.checkimageswitch();
            this.draw_image();
        }else{
            this.draw_vector();
        }

        //drawmarkupAll(this.contextpg,pagenumber);

    };

    this.mtzoom_update = function(diagdiff,startscalelarge,startscalesmall){

        //change to calculate change factor and maintain centre the same way as with zoom in and out.

        //large
        var curdiffh = (startscalelarge*this.MainImageHeight)-this.canvpage.height;
        var currdiffw = (startscalelarge*this.MainImageWidth)-this.canvpage.width;

        var mainimagediag = Math.sqrt((Math.pow(this.MainImageHeight,2)+Math.pow(this.MainImageWidth,2)));
        var canvasdiag = Math.sqrt((Math.pow(this.canvpage.height,2)+ Math.pow(this.canvpage.width,2)));

        var curdiagdiff =  (startscalelarge*mainimagediag)-canvasdiag;

        this.dscale = (canvasdiag + curdiagdiff + diagdiff)/ mainimagediag;


        //small
        curdiffh = (startscalesmall*this.SmallImageHeight)-this.canvpage.height;
        currdiffw = (startscalesmall*this.SmallImageWidth)-this.canvpage.width;
        var smallimagediag = Math.sqrt((Math.pow(this.SmallImageHeight,2) + Math.pow(this.SmallImageWidth,2)));

        curdiagdiff =  (startscalesmall*smallimagediag)-canvasdiag;

        this.dscaleextent = (canvasdiag + curdiagdiff + diagdiff)/ smallimagediag;


        //vector

        //this.dxvector=0.0;
        //this.dyvector=0.0;
        //this.dscalevector = 1.0;

//        this.dxvector = (this.canvpage.width - (thispage.VectorPageObj.width*this.dscalevector)) / 2;
        //      this.dyvector = (this.canvpage.height - (thispage.VectorPageObj.height*this.dscalevector)) / 2;

        if (this.usevectorxml){
            curdiffh = (startscalesmall*thispage.VectorPageObj.height)-this.canvpage.height;
            currdiffw = (startscalesmall*thispage.VectorPageObj.width)-this.canvpage.width;
            var vectordiag = Math.sqrt((Math.pow(thispage.VectorPageObj.height,2) + Math.pow(thispage.VectorPageObj.width,2)));

            curdiagdiff =  (startscalesmall*vectordiag)-canvasdiag;

            this.dscalevector = (canvasdiag + curdiagdiff + diagdiff)/ vectordiag;

        }

        if (!this.usevectorxml){
            this.checkimageswitch();
            this.draw_image();
        }else{
            this.draw_vector();
        }


        //drawmarkupAll(this.contextpg,pagenumber);
        //context.clearRect(0, 0, canvas.width, canvas.height);

    };

    this.getRotatedPoint = function (width, height,x,y, anglerad){
        var cosangle = Math.cos(anglerad);
        var sinangle = Math.sin(anglerad);

        var hw = x - width;
        var hh = y - height;

        var newx = (hw*cosangle) - (hh*sinangle);
        var newy = (hw*sinangle) + (hh*cosangle);

        var transpoint = new point(newx,newy);
        transpoint.x = width + transpoint.x;
        transpoint.y = height + transpoint.y;
        return transpoint;

    };




    this.zoom_update = function(sx,sy,sWide,sHi){


        var newscale = 1.0;
        var newscaleext = 1.0;
        var newscalev = 1.0;
        var factor = 0.0;

        var pointXtoCenter = 0;
        var pointYtoCenter = 0;


        var canvdiv2H = this.canvpage.height / 2;
        var canvdiv2W = this.canvpage.width / 2;
        var CanvRotRad =  this.drotation*(Math.PI/180);


        //point to align to centre in display coordinates.
        var rectCenterX = sx + (sWide / 2);
        var rectCenterY = sy + (sHi / 2);

        var ox1 = sx / this.dscale;
        var oy1 = sy / this.dscale;
        var ox2 = (sx + sWide) / this.dscale;
        var oy2 = (sy + sHi) / this.dscale;
        var hscale = sHi / this.dscale;
        var wscale = sWide / this.dscale;


        var ox1ext = sx / this.dscaleextent;
        var oy1ext = sy / this.dscaleextent;
        var ox2ext = (sx + sWide) / this.dscaleextent;
        var oy2ext = (sy + sHi) / this.dscaleextent;
        var hscaleext = sHi / this.dscaleextent;
        var wscaleext = sWide / this.dscaleextent;

        var ox1v = sx / this.dscalevector;
        var oy1v = sy / this.dscalevector;
        var ox2v = (sx + sWide) / this.dscalevector;
        var oy2v = (sy + sHi) / this.dscalevector;
        var hscalev = sHi / this.dscalevector;
        var wscalev = sWide / this.dscalevector;



        var yscale = this.canvpage.height / this.MainImageHeight;
        var xscale = this.canvpage.width / this.MainImageWidth;
        var imagescaleheight = this.MainImageHeight * this.dscale;

        switch(this.drotation){
            case 90:

                //move point to center
                // x = y direction for 90 degrees
                pointXtoCenter = rectCenterX - canvdiv2W;
                pointYtoCenter = rectCenterY - canvdiv2H;

                oy1 = (this.dy + pointXtoCenter);
                ox1 = (this.dx - pointYtoCenter);

                oy1ext = (this.dyextent + pointXtoCenter);
                ox1ext = (this.dxextent - pointYtoCenter);

                oy1v = (this.dyvector + pointXtoCenter);
                ox1v = (this.dxvector - pointYtoCenter);


                this.dx = ox1;
                this.dy = oy1;

                this.dxextent = ox1ext;
                this.dyextent = oy1ext;

                this.dxvector = ox1v;
                this.dyvector = oy1v;


                if(hscale > 0 && wscale > 0 ){
                    yscale = this.dscale * this.canvpage.height / sHi;
                    xscale = this.dscale * this.canvpage.width / sWide;
                }
                newscale = Math.min(yscale, xscale);

                if(hscaleext > 0 && wscaleext > 0 ){
                    yscale = this.dscaleextent * this.canvpage.height / sHi;
                    xscale = this.dscaleextent * this.canvpage.width / sWide;
                }
                newscaleext = Math.min(yscale, xscale);

                if(hscalev > 0 && wscalev > 0 ){
                    yscale = this.dscalevector * this.canvpage.height / sHi;
                    xscale = this.dscalevector * this.canvpage.width / sWide;

                }
                newscalev = Math.min(yscale, xscale);

                factor = newscale / this.dscale;
                if(this.usevectorxml){
                    factor = newscalev / this.dscalevector;
                }

                this.ZoomIn(factor,false);


                break;
            case 270:
                //move point to center
                // x = y direction for 270 degrees
                pointXtoCenter = rectCenterX - canvdiv2W;
                pointYtoCenter = rectCenterY - canvdiv2H;

                oy1 = (this.dy - pointXtoCenter);
                ox1 = (this.dx + pointYtoCenter);

                oy1ext = (this.dyextent - pointXtoCenter);
                ox1ext = (this.dxextent + pointYtoCenter);

                oy1v = (this.dyvector - pointXtoCenter);
                ox1v = (this.dxvector + pointYtoCenter);


                this.dx = ox1;
                this.dy = oy1;

                this.dxextent = ox1ext;
                this.dyextent = oy1ext;

                this.dxvector = ox1v;
                this.dyvector = oy1v;


                if(hscale > 0 && wscale > 0 ){
                    yscale = this.dscale * this.canvpage.height / sHi;
                    xscale = this.dscale * this.canvpage.width / sWide;
                }
                newscale = Math.min(yscale, xscale);

                if(hscaleext > 0 && wscaleext > 0 ){
                    yscale = this.dscaleextent * this.canvpage.height / sHi;
                    xscale = this.dscaleextent * this.canvpage.width / sWide;
                }
                newscaleext = Math.min(yscale, xscale);


                if(hscalev > 0 && wscalev > 0 ){
                    yscale = this.dscalevector * this.canvpage.height / sHi;
                    xscale = this.dscalevector * this.canvpage.width / sWide;
                }
                newscalev = Math.min(yscale, xscale);



                factor = newscale / this.dscale;
                if(this.usevectorxml){
                    factor = newscalev / this.dscalevector;
                }


                this.ZoomIn(factor,false);


                break;

            case 180:
                //move point to center
                pointXtoCenter = rectCenterX - canvdiv2W;
                pointYtoCenter = rectCenterY - canvdiv2H;

                oy1 = (this.dy + pointYtoCenter);
                ox1 = (this.dx + pointXtoCenter);

                oy1ext = (this.dyextent + pointYtoCenter);
                ox1ext = (this.dxextent + pointXtoCenter);

                oy1v = (this.dyvector + pointYtoCenter);
                ox1v = (this.dxvector + pointXtoCenter);


                this.dx = ox1;
                this.dy = oy1;

                this.dxextent = ox1ext;
                this.dyextent = oy1ext;

                this.dxvector = ox1v;
                this.dyvector = oy1v;


                if(hscale > 0 && wscale > 0 ){
                    yscale = this.dscale * this.canvpage.height / sHi;
                    xscale = this.dscale * this.canvpage.width / sWide;
                }
                newscale = Math.min(yscale, xscale);

                if(hscaleext > 0 && wscaleext > 0 ){
                    yscale = this.dscaleextent * this.canvpage.height / sHi;
                    xscale = this.dscaleextent * this.canvpage.width / sWide;
                }
                newscaleext = Math.min(yscale, xscale);

                if(hscaleext > 0 && wscaleext > 0 ){
                    yscale = this.dscalevector * this.canvpage.height / sHi;
                    xscale = this.dscalevector * this.canvpage.width / sWide;
                }
                newscalev = Math.min(yscale, xscale);

                factor = newscale / this.dscale;
                if(this.usevectorxml){
                    factor = newscalev / this.dscalevector;
                }

                this.ZoomIn(factor,false);


                break;
            case 0:

                //offset in current scale
                ox1 = -((rectCenterX-this.dx)/this.dscale);
                oy1 = -((rectCenterY-this.dy)/this.dscale);

                //offset in current scale
                ox1ext = -((rectCenterX-this.dxextent)/this.dscaleextent);
                oy1ext = -((rectCenterY-this.dyextent)/this.dscaleextent);

                ox1v = -((rectCenterX-this.dxvector)/this.dscalevector);
                oy1v = -((rectCenterY-this.dyvector)/this.dscalevector);


                if(hscale > 0 && wscale > 0 ){
                    yscale = this.dscale * this.canvpage.height / sHi;
                    xscale = this.dscale * this.canvpage.width / sWide;
                }
                this.dscale = Math.min(yscale, xscale);

                this.dx = (ox1*this.dscale)+(this.canvpage.width/2);
                this.dy = (oy1*this.dscale)+(this.canvpage.height/2);


                if(hscaleext > 0 && wscaleext > 0 ){
                    yscale = this.dscaleextent * this.canvpage.height / sHi;
                    xscale = this.dscaleextent * this.canvpage.width / sWide;
                }
                this.dscaleextent = Math.min(yscale, xscale);

                this.dxextent=(ox1ext*this.dscaleextent)+(this.canvpage.width/2);
                this.dyextent=(oy1ext*this.dscaleextent)+(this.canvpage.height/2);

                if(hscalev > 0 && wscalev > 0 ){
                    yscale = this.dscalevector * this.canvpage.height / sHi;
                    xscale = this.dscalevector * this.canvpage.width / sWide;
                }
                this.dscalevector = Math.min(yscale, xscale);

                this.dxvector=(ox1v*this.dscalevector)+(this.canvpage.width/2);
                this.dyvector=(oy1v*this.dscalevector)+(this.canvpage.height/2);





                break;

        }


        //context.clearRect(0, 0, canvas.width, canvas.height);
        if (!this.usevectorxml){
            this.checkimageswitch();
            this.draw_image();
        }else{
            this.draw_vector();
        }
        //drawmarkupAll(this.contextpg,pagenumber);




    };


    this.MarkupFind = function(SearchExpr){
        var textfound = false;
        while(this.CurrentMarkup < DocObj.nummarkups && !textfound){
            if(DocObj.markuplist[this.CurrentMarkup].FindText(SearchExpr)){
                textfound = true;
                this.zoomall();
                var hscaled = DocObj.markuplist[this.CurrentMarkup].hscaled;
                var wscaled = DocObj.markuplist[this.CurrentMarkup].wscaled;
                var xscaled = DocObj.markuplist[this.CurrentMarkup].xscaled;
                var yscaled = DocObj.markuplist[this.CurrentMarkup].yscaled;
                switch (this.drotation){
                    case  0:
                        switch(DocObj.markuplist[this.CurrentMarkup].type){
                            case 0:

                                wscaled = wscaled - xscaled;
                                hscaled = hscaled - yscaled;

                                break;
                            case 1:

                                wscaled = wscaled - xscaled;
                                hscaled = hscaled - yscaled;
                                break;
                            case 2:

                                wscaled = wscaled - xscaled;
                                hscaled = hscaled - yscaled;
                                break;
                            case 6:

                                wscaled = wscaled - xscaled;
                                hscaled = hscaled - yscaled;

                                break;
                            case 7:

                                wscaled = wscaled - xscaled;
                                hscaled = hscaled - yscaled;

                                break;
                            case 8:
                                wscaled = wscaled - xscaled;
                                hscaled = hscaled - yscaled;

                                break;
                            case 9:

                                yscaled = yscaled - hscaled;
                                break;
                            default:

                                break;
                        }

                        break;
                    case 90:
                        //all values are absolute for all markup types.

                        hscaled = DocObj.markuplist[this.CurrentMarkup].rotatedrect.h;
                        wscaled = DocObj.markuplist[this.CurrentMarkup].rotatedrect.w;
                        xscaled = DocObj.markuplist[this.CurrentMarkup].rotatedrect.x;
                        yscaled = DocObj.markuplist[this.CurrentMarkup].rotatedrect.y;


                        //switch rect values to comply with orientation
                        //switch x and w
                        var wxtemp = xscaled;
                        xscaled = wscaled;
                        wscaled = wxtemp;

                        //change absolute rect values to relative
                        wscaled = wscaled - xscaled;
                        hscaled = hscaled - yscaled;

                        break;
                    case 180:
                        //all values are absolute for all markup types.
                        hscaled = DocObj.markuplist[this.CurrentMarkup].rotatedrect.h;
                        wscaled = DocObj.markuplist[this.CurrentMarkup].rotatedrect.w;
                        xscaled = DocObj.markuplist[this.CurrentMarkup].rotatedrect.x;
                        yscaled = DocObj.markuplist[this.CurrentMarkup].rotatedrect.y;

                        //switch rect values to comply with orientation
                        //both x,w and y,h is switched
                        var xtemp = xscaled;
                        var ytemp = yscaled;
                        xscaled = wscaled;
                        yscaled = hscaled;
                        wscaled = xtemp;
                        hscaled = ytemp;

                        //change absolute rect values to relative
                        wscaled = wscaled - xscaled;
                        hscaled = hscaled - yscaled;

                        break;
                    case 270:
                        //all values are absolute for all markup types.
                        hscaled = DocObj.markuplist[this.CurrentMarkup].rotatedrect.h;
                        wscaled = DocObj.markuplist[this.CurrentMarkup].rotatedrect.w;
                        xscaled = DocObj.markuplist[this.CurrentMarkup].rotatedrect.x;
                        yscaled = DocObj.markuplist[this.CurrentMarkup].rotatedrect.y;

                        //switch rect values to comply with orientation
                        var wytemp = yscaled;
                        yscaled = hscaled;
                        hscaled = wytemp;


                        //yscaled -= wscaled;
                        //var hwtemp = wscaled;
                        //wscaled = hscaled;
                        //hscaled = hwtemp;

                        //change absolute rect values to relative
                        wscaled = wscaled - xscaled;
                        hscaled = hscaled - yscaled;

                        break;
                }

                hscaled = hscaled + 100;
                wscaled = wscaled + 50;
                xscaled = xscaled - 50;
                yscaled = yscaled - 50;


                this.zoom_update(xscaled,yscaled,wscaled,hscaled);
            }
            this.CurrentMarkup++;
        }
        this.CurrentMarkup = 0;

    };

    this.MarkupZoom = function(){
        //get current markup from list
        //GetCurMarkup(this.CurrentMarkup);
        if (this.CurrentMarkup >= DocObj.nummarkups )
        {
            this.CurrentMarkup = 0;
        }
        if (this.CurrentMarkup <= DocObj.nummarkups){
            this.zoomall();


            var scalefactor = this.dscale / DocObj.markuplist[this.CurrentMarkup].scaling;

            if (this.usevectorxml){
                scalefactor = this.dscalevector / DocObj.markuplist[this.CurrentMarkup].scaling;
            }else{
                scalefactor = this.dscale / DocObj.markuplist[this.CurrentMarkup].scaling;
            }



            var xscaled = DocObj.markuplist[this.CurrentMarkup].xscaled;
            var wscaled = DocObj.markuplist[this.CurrentMarkup].wscaled;
            var yscaled = DocObj.markuplist[this.CurrentMarkup].yscaled;
            var hscaled = DocObj.markuplist[this.CurrentMarkup].hscaled;


            switch (this.drotation){
                case  0:
                    switch(DocObj.markuplist[this.CurrentMarkup].type){
                        case 0:
                            xscaled = Math.min(DocObj.markuplist[this.CurrentMarkup].xscaled,DocObj.markuplist[this.CurrentMarkup].wscaled);
                            wscaled = Math.max(DocObj.markuplist[this.CurrentMarkup].xscaled,DocObj.markuplist[this.CurrentMarkup].wscaled);
                            yscaled = Math.min(DocObj.markuplist[this.CurrentMarkup].yscaled,DocObj.markuplist[this.CurrentMarkup].hscaled);
                            hscaled = Math.max(DocObj.markuplist[this.CurrentMarkup].yscaled,DocObj.markuplist[this.CurrentMarkup].hscaled);

                            wscaled = wscaled - xscaled;
                            hscaled = hscaled - yscaled;

                            break;
                        case 1:
                            xscaled = Math.min(DocObj.markuplist[this.CurrentMarkup].xscaled,DocObj.markuplist[this.CurrentMarkup].wscaled);
                            wscaled = Math.max(DocObj.markuplist[this.CurrentMarkup].xscaled,DocObj.markuplist[this.CurrentMarkup].wscaled);
                            yscaled = Math.min(DocObj.markuplist[this.CurrentMarkup].yscaled,DocObj.markuplist[this.CurrentMarkup].hscaled);
                            hscaled = Math.max(DocObj.markuplist[this.CurrentMarkup].yscaled,DocObj.markuplist[this.CurrentMarkup].hscaled);

                            wscaled = wscaled - xscaled;
                            hscaled = hscaled - yscaled;
                            break;
                        case 2:
                            xscaled = Math.min(DocObj.markuplist[this.CurrentMarkup].xscaled,DocObj.markuplist[this.CurrentMarkup].wscaled);
                            wscaled = Math.max(DocObj.markuplist[this.CurrentMarkup].xscaled,DocObj.markuplist[this.CurrentMarkup].wscaled);
                            yscaled = Math.min(DocObj.markuplist[this.CurrentMarkup].yscaled,DocObj.markuplist[this.CurrentMarkup].hscaled);
                            hscaled = Math.max(DocObj.markuplist[this.CurrentMarkup].yscaled,DocObj.markuplist[this.CurrentMarkup].hscaled);

                            wscaled = wscaled - xscaled;
                            hscaled = hscaled - yscaled;
                            break;
                        case 6:
                            xscaled = Math.min(DocObj.markuplist[this.CurrentMarkup].xscaled,DocObj.markuplist[this.CurrentMarkup].wscaled);
                            wscaled = Math.max(DocObj.markuplist[this.CurrentMarkup].xscaled,DocObj.markuplist[this.CurrentMarkup].wscaled);
                            yscaled = Math.min(DocObj.markuplist[this.CurrentMarkup].yscaled,DocObj.markuplist[this.CurrentMarkup].hscaled);
                            hscaled = Math.max(DocObj.markuplist[this.CurrentMarkup].yscaled,DocObj.markuplist[this.CurrentMarkup].hscaled);

                            wscaled = wscaled - xscaled;
                            hscaled = hscaled - yscaled;
                            if(hscaled == 0){hscaled = 1;}
                            if(wscaled == 0){wscaled = 1;}


                            break;
                        case 7:
                            xscaled = Math.min(DocObj.markuplist[this.CurrentMarkup].xscaled,DocObj.markuplist[this.CurrentMarkup].wscaled);
                            wscaled = Math.max(DocObj.markuplist[this.CurrentMarkup].xscaled,DocObj.markuplist[this.CurrentMarkup].wscaled);
                            yscaled = Math.min(DocObj.markuplist[this.CurrentMarkup].yscaled,DocObj.markuplist[this.CurrentMarkup].hscaled);
                            hscaled = Math.max(DocObj.markuplist[this.CurrentMarkup].yscaled,DocObj.markuplist[this.CurrentMarkup].hscaled);

                            wscaled = wscaled - xscaled;
                            hscaled = hscaled - yscaled;
                            if(hscaled == 0){hscaled = 1;}
                            if(wscaled == 0){wscaled = 1;}

                            break;
                        case 8:
                            xscaled = Math.min(DocObj.markuplist[this.CurrentMarkup].xscaled,DocObj.markuplist[this.CurrentMarkup].wscaled);
                            wscaled = Math.max(DocObj.markuplist[this.CurrentMarkup].xscaled,DocObj.markuplist[this.CurrentMarkup].wscaled);
                            yscaled = Math.min(DocObj.markuplist[this.CurrentMarkup].yscaled,DocObj.markuplist[this.CurrentMarkup].hscaled);
                            hscaled = Math.max(DocObj.markuplist[this.CurrentMarkup].yscaled,DocObj.markuplist[this.CurrentMarkup].hscaled);

                            wscaled = wscaled - xscaled;
                            hscaled = hscaled - yscaled;

                            break;
                        case 9:
                            if (DocObj.markuplist[this.CurrentMarkup].textrotate == 0){
                                xscaled = DocObj.markuplist[this.CurrentMarkup].rotatedrect.x;
                                wscaled = DocObj.markuplist[this.CurrentMarkup].rotatedrect.w;
                                yscaled = DocObj.markuplist[this.CurrentMarkup].rotatedrect.y;
                                hscaled = DocObj.markuplist[this.CurrentMarkup].rotatedrect.h;
                            }
                            if(DocObj.markuplist[this.CurrentMarkup].textrotate/(Math.PI/180) == 90){
                                xscaled = DocObj.markuplist[this.CurrentMarkup].xscaled;
                                yscaled = DocObj.markuplist[this.CurrentMarkup].yscaled;
                                wscaled = DocObj.markuplist[this.CurrentMarkup].wscaled;
                                hscaled = DocObj.markuplist[this.CurrentMarkup].hscaled;
                                var switchval = wscaled;
                                wscaled = hscaled;
                                hscaled = switchval;
                                //xscaled = xscaled + wscaled;
                                //yscaled = yscaled + hscaled;


                            }

                            if(DocObj.markuplist[this.CurrentMarkup].textrotate/(Math.PI/180) == 270){
                                xscaled = DocObj.markuplist[this.CurrentMarkup].xscaled;
                                yscaled = DocObj.markuplist[this.CurrentMarkup].yscaled;
                                wscaled = DocObj.markuplist[this.CurrentMarkup].wscaled;
                                hscaled = DocObj.markuplist[this.CurrentMarkup].hscaled;
                                var switchval = wscaled;
                                wscaled = hscaled;
                                hscaled = switchval;
                                xscaled = xscaled - wscaled;
                                yscaled = yscaled - hscaled;
                            }

                            if(DocObj.markuplist[this.CurrentMarkup].textrotate/(Math.PI/180) == 180){
                                xscaled = DocObj.markuplist[this.CurrentMarkup].xscaled;
                                yscaled = DocObj.markuplist[this.CurrentMarkup].yscaled;
                                wscaled = DocObj.markuplist[this.CurrentMarkup].wscaled;
                                hscaled = DocObj.markuplist[this.CurrentMarkup].hscaled;

                                xscaled = xscaled - wscaled;
                                yscaled = yscaled - hscaled;
                            }



                            //yscaled = yscaled - hscaled;
                            break;
                        default:

                            break;
                    }

                    break;
                case 90:
                    //all values are absolute for all markup types.


                    xscaled = Math.min(DocObj.markuplist[this.CurrentMarkup].rotatedrect.x,DocObj.markuplist[this.CurrentMarkup].rotatedrect.w);
                    wscaled = Math.max(DocObj.markuplist[this.CurrentMarkup].rotatedrect.x,DocObj.markuplist[this.CurrentMarkup].rotatedrect.w);
                    yscaled = Math.min(DocObj.markuplist[this.CurrentMarkup].rotatedrect.y,DocObj.markuplist[this.CurrentMarkup].rotatedrect.h);
                    hscaled = Math.max(DocObj.markuplist[this.CurrentMarkup].rotatedrect.y,DocObj.markuplist[this.CurrentMarkup].rotatedrect.h);
                    //switch rect values to comply with orientation
                    //switch x and w
                    /*var wxtemp = xscaled;
                     xscaled = wscaled;
                     wscaled = wxtemp;*/

                    //change absolute rect values to relative
                    wscaled = wscaled - xscaled;
                    hscaled = hscaled - yscaled;

                    if(hscaled == 0){hscaled = 1;}
                    if(wscaled == 0){wscaled = 1;}





                    break;
                case 180:
                    //all values are absolute for all markup types.
                    xscaled = Math.min(DocObj.markuplist[this.CurrentMarkup].rotatedrect.x,DocObj.markuplist[this.CurrentMarkup].rotatedrect.w);
                    wscaled = Math.max(DocObj.markuplist[this.CurrentMarkup].rotatedrect.x,DocObj.markuplist[this.CurrentMarkup].rotatedrect.w);
                    yscaled = Math.min(DocObj.markuplist[this.CurrentMarkup].rotatedrect.y,DocObj.markuplist[this.CurrentMarkup].rotatedrect.h);
                    hscaled = Math.max(DocObj.markuplist[this.CurrentMarkup].rotatedrect.y,DocObj.markuplist[this.CurrentMarkup].rotatedrect.h);

                    //switch rect values to comply with orientation
                    //both x,w and y,h is switched
                    /*var xtemp = xscaled;
                     var ytemp = yscaled;
                     xscaled = wscaled;
                     yscaled = hscaled;
                     wscaled = xtemp;
                     hscaled = ytemp;*/

                    //change absolute rect values to relative
                    wscaled = wscaled - xscaled;
                    hscaled = hscaled - yscaled;
                    if(hscaled == 0){hscaled = 1;}
                    if(wscaled == 0){wscaled = 1;}




                    break;
                case 270:
                    //all values are absolute for all markup types.
                    xscaled = Math.min(DocObj.markuplist[this.CurrentMarkup].rotatedrect.x,DocObj.markuplist[this.CurrentMarkup].rotatedrect.w);
                    wscaled = Math.max(DocObj.markuplist[this.CurrentMarkup].rotatedrect.x,DocObj.markuplist[this.CurrentMarkup].rotatedrect.w);
                    yscaled = Math.min(DocObj.markuplist[this.CurrentMarkup].rotatedrect.y,DocObj.markuplist[this.CurrentMarkup].rotatedrect.h);
                    hscaled = Math.max(DocObj.markuplist[this.CurrentMarkup].rotatedrect.y,DocObj.markuplist[this.CurrentMarkup].rotatedrect.h);

                    //switch rect values to comply with orientation
                    /*var wytemp = yscaled;
                     yscaled = hscaled;
                     hscaled = wytemp;*/


                    //yscaled -= wscaled;
                    //var hwtemp = wscaled;
                    //wscaled = hscaled;
                    //hscaled = hwtemp;

                    //change absolute rect values to relative
                    wscaled = wscaled - xscaled;
                    hscaled = hscaled - yscaled;

                    if(hscaled == 0){hscaled = 1;}
                    if(wscaled == 0){wscaled = 1;}


                    break;

            }
            //Get the x,y,w,h from markup add margin to coordinates
            /*hscaled = hscaled + 100;
             wscaled = wscaled + 50;
             xscaled = xscaled - 50;
             yscaled = yscaled - 50;*/



            //Call zoom update with values.
            this.zoom_update(xscaled,yscaled,wscaled,hscaled);
            this.ZoomOut(1.1,false);
            this.CurrentMarkup++;
            if (this.CurrentMarkup == DocObj.nummarkups ){
                this.CurrentMarkup = 0;
            }

        }




    };

    this.resize = function(){
        var yscale = this.canvpage.height / this.MainImageHeight;
        var xscale = this.canvpage.width / this.MainImageWidth;
        this.dscale = Math.min(xscale,yscale);

        this.dx = (this.canvpage.width - (this.MainImageWidth*this.dscale)) / 2;
        this.dy = (this.canvpage.height - (this.MainImageHeight*this.dscale)) / 2;

        yscale = this.canvpage.height / this.SmallImageHeight;
        xscale = this.canvpage.width / this.SmallImageWidth;
        this.dscaleextent = Math.min(xscale,yscale);


        this.dxextent = (this.canvpage.width - (this.SmallImageWidth*this.dscaleextent)) / 2;
        this.dyextent = (this.canvpage.height - (this.SmallImageHeight*this.dscaleextent)) / 2;


        if (this.usevectorxml){
            yscale = this.canvpage.height / thispage.VectorPageObj.height;
            xscale = this.canvpage.width / thispage.VectorPageObj.width;
            this.dscalevector = Math.min(xscale,yscale);

            this.dxvector = (this.canvpage.width - (thispage.VectorPageObj.width*this.dscalevector)) / 2;
            this.dyvector = (this.canvpage.height - (thispage.VectorPageObj.height*this.dscalevector)) / 2;

        }


        if (!this.usevectorxml){
            this.checkimageswitch();
            this.draw_image();
        }else{
            this.draw_vector();
        }
        //drawmarkupAll(this.contextpg,pagenumber);


    };
    this.pan_update = function(sx,sy){
        switch(this.drotation){
            case 0:
                this.dx = this.dx - sx;
                this.dy = this.dy - sy;
                this.dxextent = this.dxextent - sx;
                this.dyextent = this.dyextent - sy;
                this.dxvector-=sx;
                this.dyvector-=sy;



                break;
            case 90:
                this.dx = this.dx - sy;
                this.dy = this.dy + sx;
                this.dxextent = this.dxextent - sy;
                this.dyextent = this.dyextent + sx;
                this.dxvector-=sy;
                this.dyvector+=sx;


                break;
            case 180:
                this.dx = this.dx + sx;
                this.dy = this.dy + sy;
                this.dxextent = this.dxextent + sx;
                this.dyextent = this.dyextent + sy;
                this.dxvector+=sx;
                this.dyvector+=sx;

                break;
            case 270:
                this.dx = this.dx + sy;
                this.dy = this.dy - sx;
                this.dxextent = this.dxextent + sy;
                this.dyextent = this.dyextent - sx;
                this.dxvector+=sy;
                this.dyvector-=sx;

                break;
        }

        if (!this.usevectorxml){
            this.checkimageswitch();
            this.draw_image();
        }else{
            this.draw_vector();
        }
        //drawmarkupAll(this.contextpg,pagenumber);

    };

    this.rotateCanvas = function(){
        var localdx = 0.0;
        var localdy = 0.0;
        var localdscale = 0.0;



        this.contextpg.save();
        var tx = (this.canvpage.width/2);
        var ty = (this.canvpage.height/2);
        this.contextpg.translate(tx,ty);
        this.contextpg.rotate(this.drotation*(Math.PI/180));
        this.contextpg.translate(-tx,-ty);
        this.contextpg.fillStyle = "rgb(238,243,250)";
        this.contextpg.fillRect(0, 0, this.canvpage.width, this.canvpage.height);


        switch(this.currentimage){
            case 0:
                localdx = this.dx;
                localdy = this.dy;
                localdscale = this.dscale;
                this.contextpg.drawImage(this.largeimage, this.dx, this.dy,this.MainImageWidth*this.dscale, this.MainImageHeight*this.dscale);
                break;
            case 1:
                localdx = this.dxextent;
                localdy = this.dyextent;
                localdscale = this.dscaleextent;
                this.contextpg.drawImage(this.smallimage, this.dxextent, this.dyextent,this.SmallImageWidth*this.dscaleextent, this.SmallImageHeight*this.dscaleextent);
                break;
        }




        this.contextpg.restore();
        //drawmarkupAll(this.contextpg,pagenumber);

    };

    this.rotateimage = function(degree){
        var i = 0;
        switch(this.drotation){
            case 0:
                if (degree == 90){
                    for(i=0;i<=90;i=i+10){
                        this.drotation = i;
                        this.rotateCanvas();
                    }
                }
                if (degree == 180){
                    for(i=0;i<=180;i=i+10){
                        this.drotation = i;
                        this.rotateCanvas();
                    }
                }
                if (degree == 270){
                    for(i=0;i<=270;i=i+10){
                        this.drotation = i;
                        this.rotateCanvas();
                    }
                }
                break;
            case 90:
                if (degree == 0){
                    for(i=90;i>=0;i=i-10){
                        this.drotation = i;
                        this.rotateCanvas();
                    }
                }
                if (degree == 180){
                    for(i=90;i<=180;i=i+10){
                        this.drotation = i;
                        this.rotateCanvas();
                    }
                }
                if (degree == 270){
                    for(i=90;i<=270;i=i+10){
                        this.drotation = i;
                        this.rotateCanvas();
                    }
                }

                break;
            case 180:
                if (degree == 0){
                    for(i=180;i>=0;i=i-10){
                        this.drotation = i;
                        this.rotateCanvas();
                    }
                }
                if (degree == 270){
                    for(i=180;i<=270;i=i+10){
                        this.drotation = i;
                        this.rotateCanvas();
                    }
                }
                if (degree == 90){
                    for(i=180;i>=90;i=i-10){
                        this.drotation = i;
                        this.rotateCanvas();
                    }
                }

                break;
            case 270:
                if (degree == 0){
                    for(i=270;i>=0;i=i-10){
                        this.drotation = i;
                        this.rotateCanvas();
                    }
                }
                if (degree == 180){
                    for(i=270;i>=180;i=i-10){
                        this.drotation = i;
                        this.rotateCanvas();
                    }
                }
                if (degree == 90){
                    for(i=270;i>=90;i=i-10){
                        this.drotation = i;
                        this.rotateCanvas();
                    }
                }

                break;
        }

        //this.draw_image();
        if (!this.usevectorxml){
            //this.checkimageswitch();
            this.draw_image();
        }else{
            this.draw_vector();
        }


    };

    this.get_layers_html = function(){
        return this.VectorPageObj.layerhtml;
    };
    this.draw_vector = function(){
        this.contextpg.fillStyle = "rgb(255,255,255)";
        //contexto.fillStyle = "rgb(160,160,160)";
        this.contextpg.fillRect(0, 0, this.canvpage.width, this.canvpage.height);
        var tx = (this.canvpage.width/2);
        var ty = (this.canvpage.height/2);
        documentopen = true;

        if (this.VectorPageObj == undefined ){
            return;
        }
        //context,scalefactor,offsetx,offsety
        //this.dxvector = dx;
        //this.dyvector = dy;
        //this.dscalevector = dscale;

        if (this.drotation == 0){
            this.VectorPageObj.drawall(this.contextpg,this.dscalevector,this.dxvector,this.dyvector,this.pagenumber);
        }else{
            this.contextpg.save();
            this.contextpg.translate(tx,ty);
            this.contextpg.rotate(this.drotation*(Math.PI/180));
            this.contextpg.translate(-tx,-ty);
            this.VectorPageObj.drawall(this.contextpg,this.dscalevector,this.dxvector,this.dyvector,this.pagenumber);
            this.contextpg.restore();

        }



    };
    this.draw_image = function () {
        //        this.canvpage = canvaso;
        //        this.contextpg = contexto;

        this.contextpg.fillStyle = "rgb(255,255,255)";

        //contexto.fillRect(0, 0, canvaso.width, canvaso.height);
        var tx = (this.canvpage.width / 2);
        var ty = (this.canvpage.height / 2);


        documentopen = true;
        switch (this.currentimage) {
            case 0:
                if (this.drotation == 0) {
                    this.contextpg.save();

                    this.contextpg.scale(this.dscale,this.dscale);
                    this.contextpg.imageSmoothingEnabled = true;
                    //this.contextpg.drawImage(this.largeimage, this.dx, this.dy, this.PrintImageWidth * this.dscale, this.PrintImageHeight * this.dscale);
                    this.contextpg.drawImage(this.largeimage, this.dx/this.dscale, this.dy/this.dscale, this.PrintImageWidth, this.PrintImageHeight);
                    this.contextpg.restore();

                } else {
                    this.contextpg.save();
                    this.contextpg.translate(tx, ty);
                    this.contextpg.rotate(this.drotation * (Math.PI / 180));
                    this.contextpg.translate(-tx, -ty);
                    this.contextpg.drawImage(this.largeimage, this.dx, this.dy, this.PrintImageWidth * this.dscale, this.PrintImageHeight * this.dscale);
                    this.contextpg.restore();

                }
                break;
            case 1:
                if (this.drotation == 0) {
                    this.contextpg.save();
                    this.contextpg.scale(this.dscaleextent,this.dscaleextent);
                    this.contextpg.imageSmoothingEnabled = true;
                    this.contextpg.drawImage(this.smallimage, this.dxextent/this.dscaleextent, this.dyextent/this.dscaleextent, this.SmallImageWidth, this.SmallImageHeight);
                    //this.contextpg.drawImage(this.smallimage, this.dxextent, this.dyextent, this.SmallImageWidth * this.dscaleextent, this.SmallImageHeight * this.dscaleextent);
                    this.contextpg.restore();
                } else {
                    this.contextpg.save();
                    this.contextpg.translate(tx, ty);
                    this.contextpg.rotate(this.drotation * (Math.PI / 180));
                    this.contextpg.translate(-tx, -ty);
                    this.contextpg.drawImage(this.smallimage, this.dxextent, this.dyextent, this.SmallImageWidth * this.dscaleextent, this.SmallImageHeight * this.dscaleextent);
                    this.contextpg.restore();

                }

                break;
        }

    };

    /*this.draw_image = function(){

        contexto.fillStyle = "rgb(238,243,250)";

        contexto.fillRect(0, 0, canvaso.width, canvaso.height);
        var tx = (canvaso.width/2);
        var ty = (canvaso.height/2);

        documentopen = true;

        switch(this.currentimage){
            case 0:
                if (this.drotation == 0){
                    contexto.drawImage(this.largeimage, this.dx, this.dy,this.MainImageWidth*this.dscale, this.MainImageHeight*this.dscale);

                }else{
                    contexto.save();
                    contexto.translate(tx,ty);
                    contexto.rotate(this.drotation*(Math.PI/180));
                    contexto.translate(-tx,-ty);
                    contexto.drawImage(this.largeimage, this.dx, this.dy,this.MainImageWidth*this.dscale, this.MainImageHeight*this.dscale);
                    contexto.restore();

                }
                break;
            case 1:
                if (this.drotation == 0){
                    contexto.drawImage(this.smallimage, this.dxextent, this.dyextent,this.SmallImageWidth*this.dscaleextent, this.SmallImageHeight*this.dscaleextent);

                }else{
                    contexto.save();
                    contexto.translate(tx,ty);
                    contexto.rotate(this.drotation*(Math.PI/180));
                    contexto.translate(-tx,-ty);
                    contexto.drawImage(this.smallimage, this.dxextent, this.dyextent,this.SmallImageWidth*this.dscaleextent, this.SmallImageHeight*this.dscaleextent);
                    contexto.restore();

                }

                break;
        }

    };*/
};




DocumentObject = function(xmlDoc) {

    //File Information section
    var thisdocument = this;

    this.currentpage = 0;

    this.Version = xmlDoc.getElementsByTagName('Version')[0].firstChild.nodeValue;
    this.NumPages = xmlDoc.getElementsByTagName('NumPages')[0].firstChild.nodeValue;
    this.NumLayouts = xmlDoc.getElementsByTagName('NumLayouts')[0].firstChild.nodeValue;
    this.FileName = xmlDoc.getElementsByTagName('FileName')[0].firstChild.nodeValue;
    this.OriginalURL = xmlDoc.getElementsByTagName('OriginalURL')[0].firstChild.nodeValue;
    this.Format = xmlDoc.getElementsByTagName('Format')[0].firstChild.nodeValue;
    this.Filter = xmlDoc.getElementsByTagName('Filter')[0].firstChild.nodeValue;
    this.FileSizeLow = xmlDoc.getElementsByTagName('FileSizeLow')[0].firstChild.nodeValue;
    this.FileSizeHigh = xmlDoc.getElementsByTagName('FileSizeHigh')[0].firstChild.nodeValue;
    this.Type = xmlDoc.getElementsByTagName('Type')[0].firstChild.nodeValue;
    this.Drawmarkup = true;
    this.thumbnailhtmlsource = "";
    this.layerhtmlsource = "";

    //Arrays for layouts and pages
    this.layouts = [];
    this.pages = [];
    this.markuplist = [];
    this.markupundolist = [];
    this.nummarkups = 0;
    this.pdfDoc = null;
    this.pageNum = 1;
    this.pageRendering = false;
    this.pageNumPending = null;
    this.scale = 0.8;

    this.mpzoom = function(dx,dy,dscale){
        for(var i=0;i<this.pages.length;i++){
            this.pages[i].dypdf = dy;
            this.pages[i].dxpdf = dx;
            this.pages[i].dscalepdf = dscale;

        }
    };

    this.renderPDFscale = function(){

        var dscale = this.pages[this.currentpage].dscalepdf;
        var dx = this.pages[this.currentpage].dxpdf;
        var dy = this.pages[this.currentpage].dypdf;
        this.pages[this.currentpage].queRenderPageScaled();
        //this.pages[this.currentpage].renderPDFpagescale(true);


        /*if(this.currentpage == 0){
         this.pages[this.currentpage + 1].dscalepdf = dscale;
         this.pages[this.currentpage + 1].dxpdf = dx;
         this.pages[this.currentpage + 1].queRenderPageScaled();
         }
         if(this.currentpage == this.NumPages - 1){
         this.pages[this.currentpage - 1].dscalepdf = dscale;
         this.pages[this.currentpage - 1].dxpdf = dx;
         this.pages[this.currentpage - 1].queRenderPageScaled();
         }

         if(this.currentpage > 0 && this.currentpage < this.NumPages - 1){

         this.pages[this.currentpage + 1].dscalepdf = dscale;
         this.pages[this.currentpage + 1].dxpdf = dx;
         this.pages[this.currentpage + 1].queRenderPageScaled();

         this.pages[this.currentpage - 1].dscalepdf = dscale;
         this.pages[this.currentpage - 1].dxpdf = dx;
         this.pages[this.currentpage - 1].queRenderPageScaled();

         }*/



        for(var i=0;i<this.pages.length;i++){
            if (i != this.currentpage){
                this.pages[i].dscalepdf = dscale;
                this.pages[i].dxpdf = dx;

                /*if((this.pages[i].dxpdf < canvaso.width && this.pages[i].dxpdf > 0) || (this.pages[i].endx > 0 && this.pages[i].endx < canvaso.width) ){
                 if((this.pages[i].dypdf < canvaso.height && this.pages[i].dypdf > 0) || (this.pages[i].endy > 0 && this.pages[i].endy < canvaso.height)){
                 //thispage.visible = true;
                 console.log('visible ' + this.pages[i].pagenumber);
                 }else{
                 //thispage.visible = false;
                 }
                 }*/


                this.pages[i].queRenderPageScaled();


                //this.pages[i].renderPDFpagescale(false);
            }
        }
        this.draw_mpagepdf();
    };



    this.addpage = function(PageObject){
        this.pages.push(PageObject);
        var pagnum = this.pages.length - 1;
        var loadimage = true;
        //this.thumbnailhtmlsource += "<img src='" + PageObject.ThumbnailImageSRC + "'" + " alt='"+ this.PageName + "' onclick='getpage(" + pagnum + ")'>" + "<br>";
        //PageObject.loadvector();
        if (PageObject.usevectorxml){
            loadimage = false;
            PageObject.loadvectors();
        }else if (PageObject.usepdfjs){
            loadimage = false;
            var file = getFileName(this.FileName);
            var cachfolder = getURLPath(PageObject.ThumbnailImageSRC);
            var fileurl = cachfolder + file;
            if (PageObject.pagenumber == 0){
                PDFJS.getDocument(fileurl).then(function (pdfDoc_) {
                    thisdocument.pdfDoc = pdfDoc_;
                    //document.getElementById('page_count').textContent = pdfDoc.numPages;

                    // Initial/first page rendering
                    PageObject.renderPDFpage();
                    for(var i=0;i<thisdocument.pages.length;i++){
                        if (i != 0){
                            thisdocument.pages[i].queueRenderPage();
                        }

                    }

                    //console.log(PageObject.pagenumber);
                });

            }

        }
        if(loadimage){
            PageObject.loadimages();
        }



    };
    this.addlayout = function(Name){
        this.layouts.push(Name);
    };

    this.PageDown = function(){
        if (this.currentpage+1 <= this.NumPages - 1){
            this.currentpage ++;


            if (!this.pages[this.currentpage].usevectorxml){
                if (!this.pages[this.currentpage].largeimageloaded || !this.pages[this.currentpage].smallimageloaded){
                    this.pages[this.currentpage].loadimages();
                }
                if (this.currentpage != 0){
                    this.pages[this.currentpage].dscale = this.pages[this.currentpage-1].dscale;
                    this.pages[this.currentpage].dx = this.pages[this.currentpage-1].dx;
                    this.pages[this.currentpage].dy = this.pages[this.currentpage-1].dy;
                    this.pages[this.currentpage].dscaleextent = this.pages[this.currentpage-1].dscaleextent;
                    this.pages[this.currentpage].dxextent = this.pages[this.currentpage-1].dxextent;
                    this.pages[this.currentpage].dyextent = this.pages[this.currentpage-1].dyextent;
                    this.pages[this.currentpage].checkimageswitch();
                    //this.pages[this.currentpage].currentimage = this.pages[this.currentpage-1].currentimage;
                }

                this.pages[this.currentpage].draw_image();
            }else{
                this.pages[this.currentpage].draw_vector();
            }


            //drawmarkupAll(this.contextpg,pagenumber);
        }

    };

    this.GotoPage = function(pagenum){
        this.currentpage = pagenum;
        if (!this.pages[this.currentpage].usevectorxml){
            //this.checkimageswitch();
            if (!this.pages[this.currentpage].largeimageloaded || !this.pages[this.currentpage].smallimageloaded){
                this.pages[this.currentpage].loadimages();
            }

            if (this.currentpage != 0){
                this.pages[this.currentpage].dscale = this.pages[0].dscale;
                this.pages[this.currentpage].dx = this.pages[0].dx;
                this.pages[this.currentpage].dy = this.pages[0].dy;
                this.pages[this.currentpage].dscaleextent = this.pages[0].dscaleextent;
                this.pages[this.currentpage].dxextent = this.pages[0].dxextent;
                this.pages[this.currentpage].dyextent = this.pages[0].dyextent;
                this.pages[this.currentpage].checkimageswitch();
                //this.pages[this.currentpage].currentimage = this.pages[this.currentpage-1].currentimage;
            }

            this.pages[this.currentpage].draw_image();
        }else{
            this.pages[this.currentpage].draw_vector();
        }

        //drawmarkupAll(this.contextpg,pagenumber);


    };

    this.PageUp = function(){
        if (this.currentpage-1 >= 0){
            this.currentpage --;

            if (!this.pages[this.currentpage].usevectorxml){
                if (!this.pages[this.currentpage].largeimageloaded || !this.pages[this.currentpage].smallimageloaded){
                    this.pages[this.currentpage].loadimages();
                }
                this.pages[this.currentpage].checkimageswitch();
                //this.checkimageswitch();
                this.pages[this.currentpage].draw_image();
            }else{
                this.pages[this.currentpage].draw_vector();
            }



            //this.pages[this.currentpage].draw_image();
            //drawmarkupAll(this.contextpg);


        }

    };

    this.getpage = function(pagenum){
        return this.pages[pagenum];
    };

    this.getmarkupbynumber = function(markupnumber){
        var i = 0;
        var markupobj = -1;
        for (i=0;i<this.markuplist.length;i++){
            if (this.markuplist[i].markupnumber == markupnumber){
                markupobj = i;
            }
        }
        return markupobj;
    };

    this.draw_mpagepdf = function(){
        var ty = (canvaso.height/2);

        if ( this.NumPages > 1){
            if(this.pages[this.currentpage].dypdf - 10 > ty && this.currentpage > 0){
                /*if (this.pages[this.currentpage].dscalepdf != 1){
                 this.pages[this.currentpage].queRenderPageScaled();
                 }*/

                this.currentpage -= 1;
                /*if (this.pages[this.currentpage].dscalepdf != 1){
                 this.pages[this.currentpage].queRenderPageScaled();
                 }*/

            }else if(this.pages[this.currentpage].endy + 10 < ty && this.currentpage < this.NumPages-1){
                this.currentpage += 1;

            }

            /*if(this.pages[this.currentpage].ispagevisible && this.pages[this.currentpage].dscalepdf != 1){
             this.pages[this.currentpage].queRenderPageScaled();
             }*/

            this.pages[this.currentpage].draw_canvas(true);

            if(this.pages[this.currentpage].endy < canvaso.height && this.currentpage < this.NumPages-1){

                if(this.pages[this.currentpage + 1].pageloaded){

                    /*if (this.pages[this.currentpage + 1].dscalepdf != 1){
                     this.pages[this.currentpage + 1].queRenderPageScaled();
                     }*/

                    this.pages[this.currentpage + 1].dypdf = this.pages[this.currentpage].endy + 10;
                    this.pages[this.currentpage + 1].dxpdf = this.pages[this.currentpage].dxpdf;
                    this.pages[this.currentpage + 1].dscalepdf = this.pages[this.currentpage].dscalepdf;


                    /*if(this.pages[this.currentpage + 1].ispagevisible && this.pages[this.currentpage + 1].dscalepdf != 1){
                     this.pages[this.currentpage + 1].queRenderPageScaled();
                     }*/
                    //this.pages[this.currentpage + 1].renderPDFpagescale();
                    //this.pages[this.currentpage + 1].pagecanvas.height = this.pages[this.currentpage].pagecanvas.height;
                    //this.pages[this.currentpage + 1].pagecanvas.width = this.pages[this.currentpage].pagecanvas.width;
                    this.pages[this.currentpage + 1].draw_canvas(false);
                }else{

                    this.loadpage(this.currentpage + 1);
                    this.currentpage += 1;
                }

            }else if(this.pages[this.currentpage].dypdf > 10 && this.currentpage > 0){

                if(this.pages[this.currentpage - 1].pageloaded){
                    /*if (this.pages[this.currentpage - 1].dscalepdf != 1){
                     this.pages[this.currentpage - 1].queRenderPageScaled();
                     }*/

                    this.pages[this.currentpage - 1].dypdf = this.pages[this.currentpage].dypdf - (this.pages[this.currentpage].canvpage.height*this.pages[this.currentpage].dscalepdf) - 10;
                    this.pages[this.currentpage - 1].dxpdf = this.pages[this.currentpage].dxpdf;
                    this.pages[this.currentpage - 1].dscalepdf = this.pages[this.currentpage].dscalepdf;
                    //this.pages[this.currentpage - 1].renderPDFpagescale();
                    //this.pages[this.currentpage - 1].pagecanvas.height = this.pages[this.currentpage].pagecanvas.height;
                    //this.pages[this.currentpage - 1].pagecanvas.width = this.pages[this.currentpage].pagecanvas.width;
                    /*if(this.pages[this.currentpage - 1].ispagevisible && this.pages[this.currentpage - 1].dscalepdf != 1){
                     this.pages[this.currentpage - 1].queRenderPageScaled();
                     }*/

                    this.pages[this.currentpage - 1].draw_canvas(false);
                }else{
                    this.loadpage(this.currentpage - 1);
                    this.currentpage -= 1;
                }

            }

        }else{
            this.pages[this.currentpage].draw_canvas(true);
        }





    };


};


/*DocumentObject = function (xmlDoc) {

    //File Information section

    this.currentpage = 0;

    this.Version = xmlDoc.getElementsByTagName('Version')[0].firstChild.nodeValue;
    this.NumPages = xmlDoc.getElementsByTagName('NumPages')[0].firstChild.nodeValue;
    this.NumLayouts = xmlDoc.getElementsByTagName('NumLayouts')[0].firstChild.nodeValue;
    this.FileName = xmlDoc.getElementsByTagName('FileName')[0].firstChild.nodeValue;
    this.OriginalURL = xmlDoc.getElementsByTagName('OriginalURL')[0].firstChild.nodeValue;
    this.Format = xmlDoc.getElementsByTagName('Format')[0].firstChild.nodeValue;
    this.Filter = xmlDoc.getElementsByTagName('Filter')[0].firstChild.nodeValue;
    this.FileSizeLow = xmlDoc.getElementsByTagName('FileSizeLow')[0].firstChild.nodeValue;
    this.FileSizeHigh = xmlDoc.getElementsByTagName('FileSizeHigh')[0].firstChild.nodeValue;
    this.Type = xmlDoc.getElementsByTagName('Type')[0].firstChild.nodeValue;
    this.Drawmarkup = true;
    this.thumbnailhtmlsource = "";

    //Arrays for layouts and pages
    this.layouts = new Array();
    this.pages = new Array();
    this.markuplist = new Array();
    this.markupundolist = new Array();
    this.nummarkups = 0;

    this.addpage = function (PageObject) {
        this.pages.push(PageObject);


        /*if (pagnum > 0){
            canvaso.height = canvaso.height + canvheight;
        }*/

        //this.thumbnailhtmlsource += "<img src='" + PageObject.ThumbnailImageSRC + "'" + " alt='" + this.PageName + "' onclick='getpage(" + pagnum + ")'>" + "<br>";

/*        PageObject.loadimages();


    };
    this.addlayout = function (Name) {
        this.layouts.push(Name);
    };

    this.PageDown = function () {
        if (this.currentpage + 1 <= this.NumPages - 1) {
            this.currentpage++;

            if (!this.pages[this.currentpage].largeimageloaded || !this.pages[this.currentpage].smallimageloaded) {
                this.pages[this.currentpage].loadimages();
            }
            if (this.currentpage != 0) {
                this.pages[this.currentpage].dscale = this.pages[this.currentpage - 1].dscale;
                this.pages[this.currentpage].dx = this.pages[this.currentpage - 1].dx;
                this.pages[this.currentpage].dy = this.pages[this.currentpage - 1].dy;
                this.pages[this.currentpage].dscaleextent = this.pages[this.currentpage - 1].dscaleextent;
                this.pages[this.currentpage].dxextent = this.pages[this.currentpage - 1].dxextent;
                this.pages[this.currentpage].dyextent = this.pages[this.currentpage - 1].dyextent;
                this.pages[this.currentpage].checkimageswitch();
                //this.pages[this.currentpage].currentimage = this.pages[this.currentpage-1].currentimage;
            }


            this.pages[this.currentpage].draw_image();
            drawmarkupAll(this.pages[this.currentpage].contextpg,this.currentpage);
        }

    };

    this.GotoPage = function (pagenum) {
        this.currentpage = pagenum;
        if (!this.pages[this.currentpage].largeimageloaded || !this.pages[this.currentpage].smallimageloaded) {
            this.pages[this.currentpage].loadimages();
        }

        if (this.currentpage != 0) {
            this.pages[this.currentpage].dscale = this.pages[0].dscale;
            this.pages[this.currentpage].dx = this.pages[0].dx;
            this.pages[this.currentpage].dy = this.pages[0].dy;
            this.pages[this.currentpage].dscaleextent = this.pages[0].dscaleextent;
            this.pages[this.currentpage].dxextent = this.pages[0].dxextent;
            this.pages[this.currentpage].dyextent = this.pages[0].dyextent;
            this.pages[this.currentpage].checkimageswitch();
            //this.pages[this.currentpage].currentimage = this.pages[this.currentpage-1].currentimage;
        }
        this.pages[this.currentpage].draw_image();
        drawmarkupAll(this.pages[this.currentpage].contextpg,this.currentpage);


    };

    this.PageUp = function () {
        if (this.currentpage - 1 >= 0) {
            this.currentpage--;
            if (!this.pages[this.currentpage].largeimageloaded || !this.pages[this.currentpage].smallimageloaded) {
                this.pages[this.currentpage].loadimages();
            }
            this.pages[this.currentpage].checkimageswitch();
            this.pages[this.currentpage].draw_image();
            drawmarkupAll(this.pages[this.currentpage].contextpg,this.currentpage);


        }

    };

    this.getpage = function (pagenum) {
        return this.pages[pagenum];
    };
    this.getmarkupbynumber = function (markupnumber) {
        var i = 0;
        var markupobj = -1;
        for (i = 0; i < this.markuplist.length; i++) {
            if (this.markuplist[i].markupnumber == markupnumber) {
                markupobj = i;
            }
        }
        return markupobj;
    };
};*/

function setDocObj(xmldoc){

    DocObj = new DocumentObject(xmldoc);
    var path = addSlash(DocObj.FileName);
    var layoutxmlobj = xmldoc.getElementsByTagName('Layout');

    var pages_added = 0;

    for (i = 0; i < layoutxmlobj.length; i++) {
        var layoutname = layoutxmlobj[i].getElementsByTagName("LayoutName")[0].firstChild.nodeValue;
        DocObj.addlayout(layoutname);

        var pagexmlobj = layoutxmlobj[i].getElementsByTagName('Page');
        for (j = 0; j < pagexmlobj.length; j++) {
            if (pages_added == 0) {
                PageObj = new PageObject(pagexmlobj[j], layoutname,pages_added, true, path);
                aDrawpages[pages_added] = false;
                pages_added++;
            } else {
                PageObj = new PageObject(pagexmlobj[j], layoutname,pages_added, false, '');
                aDrawpages[pages_added] = false;
                pages_added++;
            }

            DocObj.addpage(PageObj);


        }

    }
    PageObj.NumPages = pages_added;
    nTotalPages = pages_added;
    bAllpagesloaded = true;
    //DocObj.NumPages = pages_added;
    //DocObj.numpages = pages_added;

    DocObj.currentpage = 0;
    //Thumbnailpopup = DocObj.thumbnailhtmlsource;
    //setContentThumb(Thumbnailpopup);
    //DocObj.pages[DocObj.currentpage].loadimages();
    documentopen = true;

}

function SetPageSizecss(width,height,widthcss,heightcss){
    canvwidth = width;
    canvheight = height;
    canvaso.width = canvwidth;
    canvaso.height = canvheight;
    canvaso.style.width = widthcss + "px";
    canvaso.style.height = heightcss + "px";
    if (width > height){
        Porientation = 1;
    }else {
        Porientation = 0;
    }

    //var pwidth = (paperwidth / 25.4)* 86;
    //var pheight = (paperheight / 25.4)* 86;

}
function SetPageSize(width,height){
    canvwidth = width;
    canvheight = height;
    canvaso.width = canvwidth;
    canvaso.height = canvheight;
    if (width > height){
        Porientation = 1;
    }else {
        Porientation = 0;
    }
    console.log(width);
    console.log(height);

}


function getFile(Filepath) {
    //var TDocObj;
    var PageObj;
    //var pages = new Array();
    //Filepath = "http://download.rasterex.com/111_01.PLT";
    var xhr = new XMLHttpRequest();

    //alert("XMLHttpRequest created");

    var XMLGetFile = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
    XMLGetFile += "<RxViewServer>";
    XMLGetFile += "<Command>GetFile</Command>";
    XMLGetFile += "<LicenseID>" + "1234" + "</LicenseID>";
    XMLGetFile += "<FileURL>" + Filepath + "</FileURL>";
    XMLGetFile += "</RxViewServer>";

    try {
        xhr.open('POST', xmlurl, true);
    }
    catch (e) {
        alert("Error 1 - " + e);
    }
    try {
        xhr.responseType = 'document';
    }
    catch (e) {
        //alert("Error 2 - " + e);
    }


    xhr.onload = function (e) {



        if (this.status == 200) {
            //console.log(this.responseText);
            var i, j = 0;
            var xmlDoc = this.responseXML;
            DocObj = new DocumentObject(xmlDoc);
            var path = addSlash(DocObj.FileName);
            var layoutxmlobj = xmlDoc.getElementsByTagName('Layout');
            for (i = 0; i < layoutxmlobj.length; i++) {
                var layoutname = layoutxmlobj[i].getElementsByTagName("LayoutName")[0].firstChild.nodeValue;
                if (i==0){

                }
                DocObj.addlayout(layoutname);
                var pagexmlobj = layoutxmlobj[i].getElementsByTagName('Page');
                for (j = 0; j < pagexmlobj.length; j++) {
                    if (j == 0) {
                        PageObj = new PageObject(pagexmlobj[j], layoutname,j, true, path);
                    } else {
                        PageObj = new PageObject(pagexmlobj[j], layoutname,j, false, '');
                    }

                    DocObj.addpage(PageObj);

                }

            }
            DocObj.currentpage = 0;
            //Thumbnailpopup = DocObj.thumbnailhtmlsource;
            //setContentThumb(Thumbnailpopup);
            //DocObj.pages[DocObj.currentpage].loadimages();
            documentopen = true;
            /*for (i=0;i<DocObj.NumPages-1;i++){
                DocObj.PageDown();
            }*/
            //DocObj.pages[DocObj.currentpage].zoomwidth();
            //var path = addSlash(DocObj.FileName);
            //var path = getPath(DocObj.FileName);
            //getMarkupFilelist(path);

            //moved to attempt to secure that file is loaded.
            //var path = addSlash(DocObj.FileName);
            //getMarkupFilelist(path);



        }
        else if (this.status == 404) {
            alert("XML could not be found");
        }
        else if (this.status == 503) {
            alert("Server is down");
        }

    };

    xhr.send(XMLGetFile);


}


function imageload(ev) {
    var yscale = 0.0;
    var xscale = 0.0;
    var dxlocal = 0.0;
    var dylocal = 0.0;
    var dscalelocal = 0.0;
    var imagewidth = 0;
    var imageheight = 0;

    var curpage = 0;
    var target = ev.target || ev.srcElement;
    while(curpage < DocObj.NumPages){
        //if (ev.srcElement.src.toLowerCase() == DocObj.pages[curpage].MainImageSRC.toLowerCase()) {
        if (target.src.toLowerCase() == DocObj.pages[curpage].PrintImageSRC.toLowerCase()) {



            imagewidth = DocObj.pages[curpage].PrintImageWidth;
            imageheight = DocObj.pages[curpage].PrintImageHeight;
            yscale = DocObj.pages[curpage].canvpage.height / imageheight;
            xscale = DocObj.pages[curpage].canvpage.width / imagewidth;
            dscalelocal = Math.min(xscale, yscale);


            //needed for correct markup scale
            imagewidth = DocObj.pages[curpage].MainImageWidth;
            imageheight = DocObj.pages[curpage].MainImageHeight;
            yscale = DocObj.pages[curpage].canvpage.height / imageheight;
            xscale = DocObj.pages[curpage].canvpage.width / imagewidth;
            dscale = Math.min(xscale,yscale);


            //DocObj.pages[DocObj.currentpage].dscale = dscalelocal;

            dxlocal = (DocObj.pages[curpage].canvpage.width - (imagewidth * dscalelocal)) / 2;
            //dylocal = (canvaso.height - (imageheight * dscalelocal)) / 2;
            dylocal = 0;

            //DocObj.pages[DocObj.currentpage].dx = dxlocal;
            //DocObj.pages[DocObj.currentpage].dy = dylocal;

            DocObj.pages[curpage].setimagedimlarge(dxlocal, dylocal, dscalelocal);


        }

        if (target.src.toLowerCase() == DocObj.pages[curpage].SmallImageSRC.toLowerCase()) {
            //smallimageloaded = true;
            //SetImageDim(ev.srcElement); //use width and height from xml instead of calculating
            imagewidth = DocObj.pages[curpage].SmallImageWidth;
            imageheight = DocObj.pages[curpage].SmallImageHeight;

            yscale = DocObj.pages[curpage].canvpage.height / imageheight;
            xscale = DocObj.pages[curpage].canvpage.width / imagewidth;
            dscalelocal = Math.min(xscale, yscale);

            dxlocal = (DocObj.pages[curpage].canvpage.width - (imagewidth * dscalelocal)) / 2;
            //dylocal = (canvaso.height - (imageheight * dscalelocal)) / 2;
            dylocal = 0;


            DocObj.pages[curpage].setimagedimsmall(dxlocal, dylocal, dscalelocal);

            //draw_image(ev.srcElement);
            //DocObj.pages[DocObj.currentpage].draw_image();

        }
        curpage++;
    }
    //imageloaded = true;
    //drawmarkupAll(cntximg);


}


function get_image(url, image) {
    image.addEventListener('load', imageload, false);
    image.src = url;

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

      canvaso = document.getElementById('printview');
    if (!canvaso) {
      alert('Error: I cannot find the canvas element!');
      return;
    }

    if (!canvaso.getContext) {
      alert('Error: no canvas.getContext!');
      return;
    }

    // Get the 2D canvas context.
    contexto = canvaso.getContext('2d');
    if (!contexto) {
      alert('Error: failed to getContext!');
      return;
    }

      try {
          xmlurlrel = opener.RxCore.printhelper().xmlurlrel;
      }
      catch (e) {
          xmlurlrel = '';
      }


      try {
         //var PaperHeight = opener.GetPaperHeight();
          //PaperHeight = 3480;
          //this.paperwidth = (this.PrintPaperWidth / 25.4)* 96;
          var PaperHeight = (opener.RxCore.printhelper().getPaperHeight() / 25.4)* 300;
          var PaperHeightcss = (opener.RxCore.printhelper().getPaperHeight() / 25.4)* 88;


      }
      catch (e) {
          PaperHeight = 3480;
      }

      try {
          //var PaperWidth = opener.GetPaperWidth();
          //PaperWidth = 2460;
          var PaperWidth = (opener.RxCore.printhelper().getPaperWidth() / 25.4)* 300;
          var PaperWidthcss = (opener.RxCore.printhelper().getPaperWidth() / 25.4) * 88;
      }
      catch (e) {
          PaperWidth = 2460;
      }
      SetPageSizecss(PaperWidth,PaperHeight,PaperWidthcss,PaperHeightcss);
      //SetPageSize(PaperWidth,PaperHeight);
      try {
          var PageObjectXML = opener.RxCore.printhelper().getPageObject();

      }
      catch (e) {
          PageObjectXML = 0;
      }




      if(PageObjectXML != 0){
          setDocObj(PageObjectXML);
          if(opener.RxCore.printhelper().docObj != null){
              DocObj.markuplist = opener.RxCore.printhelper().docObj.markuplist;
          }
          MeasureScale = opener.RxCore.printhelper().measureScale;
          Unitlabel = opener.RxCore.printhelper().unitLabel;
          AreaUnitlabel = opener.RxCore.printhelper().areaUnitlabel;
          unitscale = opener.RxCore.printhelper().unitscale;
          Unitofmeasure  = opener.RxCore.printhelper().unitOfMeasure;
          //console.log(Unitlabel);
          //console.log(MeasureScale);
          //console.log(AreaUnitlabel);
          //console.log(unitscale);
          //console.log(Unitofmeasure);



      }



      try {
          Stamplist = opener.RxCore.printhelper().stampList;

      }
      catch (e) {
          Stamplist = ["Approved","Draft","Received","Rejected","Reviewed","Revised"];
      }

      try{
          var id = 0;
          //DocObj.markuplist = opener.markupprintlist.slice(0);

          /*for (var i = 0;i<opener.RxCore.printhelper().markupprintlist.length;i++){
              var type = opener.RxCore.printhelper().markupprintlist[i].type;
              var subtype = opener.RxCore.printhelper().markupprintlist[i].subtype;
              var alternative = opener.RxCore.printhelper().markupprintlist[i].alternative;
              var markupobject = new MarkupObject(type,subtype,alternative);
              markupobject.SetFromArray(opener.RxCore.printhelper().markupprintlist[i]);
              markupobject.savemetolist();
              aDrawmarkup[i] = false;

          }*/
          //var PageObjectXML = opener.markupprintlist.length;
      }
      catch (e) {
          //PageObjectXML = 0;
      }






      /*try{
          dscale = opener.DocObj.pages[DocObj.currentpage].dscale;
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
