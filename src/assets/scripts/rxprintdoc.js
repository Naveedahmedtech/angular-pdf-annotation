// JScript source code

var pagediv, canvaso, contexto;
var canvimage = document.createElement('img');
var noteprintimage = new Image();
var bUseFixedScale = false;
var bMarkupNoLabel = false;


var PaperHeight = 100;
var PaperWidth = 100;
var pdfDoc = null;
var canvaspages = [];

var canvheight = 1123;
var canvwidth = 794;
//0 = portrait 1 = landscape
var Porientation = 0;


var hasnotprinted = true;
var xmlurlrel = '';


var Stamplist = new Array();


var pageCanvases = [];
var aDrawpages = [];
var aDrawmarkup = [];
var canvimages = [];
var Userlist = [];


var markupdrawn = false;


var DocObj;




var pattern = document.createElement('canvas');

function getHatch(ctx, type, color) {

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

        switch (type) {
            case 3:
                pctx.beginPath();
                pctx.moveTo(0.0, 10.0);
                pctx.lineTo(10.0, 0.0);
                pctx.moveTo(10.0, 16.0);
                pctx.lineTo(16.0, 10.0);
                pctx.moveTo(2.0, 16.0);
                pctx.lineTo(16.0, 2.0);
                pctx.moveTo(0.0, 2.0);
                pctx.lineTo(2.0, 0.0);
                pctx.stroke();
                break;
            case 2:
                pctx.beginPath();
                pctx.moveTo(0.0, 14.0);
                pctx.lineTo(2.0, 16.0);
                pctx.moveTo(0.0, 6.0);
                pctx.lineTo(10.0, 16.0);
                pctx.moveTo(2.0, 0.0);
                pctx.lineTo(16.0, 14.0);
                pctx.moveTo(10.0, 0.0);
                pctx.lineTo(16.0, 6.0);
                pctx.stroke();
                break;
            case 5:
                pctx.beginPath();
                pctx.moveTo(0.0, 10.0);
                pctx.lineTo(10.0, 0.0);
                pctx.moveTo(10.0, 16.0);
                pctx.lineTo(16.0, 10.0);
                pctx.moveTo(2.0, 16.0);
                pctx.lineTo(16.0, 2.0);
                pctx.moveTo(0.0, 2.0);
                pctx.lineTo(2.0, 0.0);

                pctx.moveTo(0.0, 14.0);
                pctx.lineTo(2.0, 16.0);
                pctx.moveTo(0.0, 6.0);
                pctx.lineTo(10.0, 16.0);
                pctx.moveTo(2.0, 0.0);
                pctx.lineTo(16.0, 14.0);
                pctx.moveTo(10.0, 0.0);
                pctx.lineTo(16.0, 6.0);
                pctx.stroke();


                break;
            case 0:
                pctx.beginPath();
                pctx.moveTo(0.0, 4.0);
                pctx.lineTo(16.0, 4.0);
                pctx.moveTo(0.0, 12.0);
                pctx.lineTo(16.0, 12.0);

                pctx.stroke();

                break;
            case 1:
                pctx.beginPath();
                pctx.moveTo(4.0, 0.0);
                pctx.lineTo(4.0, 16.0);
                pctx.moveTo(12.0, 0.0);
                pctx.lineTo(12.0, 16.0);

                pctx.stroke();

                break;
            case 4:
                pctx.beginPath();
                pctx.moveTo(0.0, 4.0);
                pctx.lineTo(16.0, 4.0);
                pctx.moveTo(0.0, 12.0);
                pctx.lineTo(16.0, 12.0);

                pctx.moveTo(4.0, 0.0);
                pctx.lineTo(4.0, 16.0);
                pctx.moveTo(12.0, 0.0);
                pctx.lineTo(12.0, 16.0);
                pctx.stroke();


                break;
        }


        var HatchPtrn = ctx.createPattern(pattern, "repeat");
        return HatchPtrn;

    }


function GetDisplayName(sign) {
        var signfound = false;
        var displayname = 'default user';
    
        for (var i = 0; i < Userlist.length; i++) {
            if (Userlist[i].Signature == sign) {
                signfound = true;
                displayname = Userlist[i].DisplayName;
    
            }
        }
        return displayname;
}

function splitstring(context, text, maxwidth, resultarray){
        var test = text;
        var bNeedsplit = false;

        var metrics = context.measureText(test);
        while (metrics.width > maxwidth && test.length > 1) {
            // Determine how much of the word will fit
            test = test.substring(0, test.length - 1);
            metrics = context.measureText(test);
        }

        if (text != test) {
            resultarray.push(test);
            var remainer = text.substr(test.length);
            metrics = context.measureText(remainer);
            if(metrics.width > maxwidth){
                bNeedsplit = true;
            }else{
                bNeedsplit = false;
                resultarray.push(remainer);
            }

        }else{
            resultarray.push(test);
            bNeedsplit = false;

        }

        return {
           bNeedSplit : bNeedsplit,
           remainer : remainer,
           resultarray : resultarray     
        };


    }

    function wrapText (context, text, x, y, maxWidth, lineHeight) {

        var bNeedsplit = true;
        var line = '',
            lineCount = 0,
            i,
            test,
            metrics;

        var crlines = text.split('\n');
        var words = [];
        var splitwords = [];
        
        for (var crn = 0;crn < crlines.length;crn++){
            line = '';
            lineCount = 0;
            i = 0;
            var metrics = context.measureText(crlines[crn]);
            if (metrics.width > maxWidth ){
                words = words.concat(crlines[crn].split(' '));
                words.push('\n');
            }else{
                words.push(crlines[crn]);
                words.push('\n');

            }
            

        }
        
        for (i = 0; i < words.length; i++) {

            if(words[i] != '\n'){
                var splitresult = splitstring(context, words[i], maxWidth,splitwords);

                while(splitresult.bNeedSplit){
                    splitresult = splitstring(context, splitresult.remainer, maxWidth,splitwords);
                }
            }else{
                splitwords.push(words[i]);
            }


        }

        var bConcat = true;
        for (i = 0; i < splitwords.length; i++) {
            if(splitwords[i] != '\n'){
                
                test = line + splitwords[i] + ' ';
               
                metrics = context.measureText(test);
    
                if (metrics.width > maxWidth && i > 0) {
                    context.fillText(line, x, y);
                    line = splitwords[i] + ' ';
                    y += lineHeight;
                    lineCount++;
                }
                else {
                    line = test;
                }
    
            }else{
                bConcat = false;
                context.fillText(line, x, y);
                line = '';
                y += lineHeight;
        
            }

        }

        /*context.fillText(line, x, y);
        y += lineHeight;*/

        //var words = text.split(' ');


    }


function drawmarkup(ctx, markupobject, dx,dy,dscale){

            var scalefactor = dscale / markupobject.scaling;

            var printfixedscale  =  dscale / opener.RxCore.printhelper().fixedScale;

            var pagedx = dx;
            var pagedy = dy;

            var xscalepoint = 0;
            var yscalepoint = 0;




            if(bUseFixedScale){
                var arrowlengthscaled = markupobject.arrowlength * printfixedscale;
            }else{
                arrowlengthscaled = markupobject.arrowlength * scalefactor;
            }


            if(bUseFixedScale){
                var radiusScaled = 10 * printfixedscale;
            }else{
                radiusScaled = 10 * scalefactor;
            }


            //var arrowlengthscaled = markupobject.arrowlength * scalefactor;
            //var radiusScaled = 10 * scalefactor;

            var textoffsetScaled = (markupobject.h / 10) * scalefactor;
            
            //var linewidthScaled = markupobject.linewidth * scalefactor;

            if(bUseFixedScale){
                var linewidthScaled = markupobject.linewidth * printfixedscale;
            }else{
                linewidthScaled = markupobject.linewidth * scalefactor;
            }

            
            var tx = 0;
            var ty = 0;
            var ptrn = getHatch(ctx,markupobject.hatchStyle,markupobject.color);
            var arrowangle = 22.5;

            switch(markupobject.type){
                case 0: //pencil, marker, eraser

                    var counter = 0;
                    var lcounter = 0;

                    markupobject.SetDimensions(scalefactor,0,pagedx,pagedy);

                    ctx.save();
                    if (markupobject.subtype == 1){
                        ctx.strokeStyle = "white";
                        /*if(backgroundColor != undefined){
                            ctx.strokeStyle = backgroundColor;
                        }else{
                            ctx.strokeStyle = "white";
                        }*/
                        ctx.lineWidth = linewidthScaled * 10;// * scalefactor;

                    }else{
                        ctx.strokeStyle = markupobject.strokecolor;
                        ctx.lineWidth = linewidthScaled;
                        markupobject.GetLinestyle(markupobject.linestyle,ctx,scalefactor);
                    }

                    ctx.beginPath();

                    for (lcounter = 0; lcounter < markupobject.pointlist.length; lcounter++) {
                        for (counter = 0; counter < markupobject.pointlist[lcounter].length; counter++) {

                            xscalepoint = (markupobject.pointlist[lcounter][counter].x - markupobject.xoffset) * scalefactor;
                            yscalepoint = (markupobject.pointlist[lcounter][counter].y - markupobject.yoffset) * scalefactor;

                            xscalepoint += dx;
                            yscalepoint += dy;


                            if (counter == 0){
                                ctx.moveTo(xscalepoint, yscalepoint);
                            }else{
                                ctx.lineTo(xscalepoint, yscalepoint);
                            }



                        }
                    }

                    ctx.stroke();
                    ctx.restore();


                    break;
                case 1: //polygon
                    var pcounter = 0;

                    markupobject.SetDimensions(scalefactor,0,pagedx,pagedy);

                    switch(markupobject.subtype){
                        case 1:
                            ctx.save();
                            markupobject.GetLinestyle(markupobject.linestyle,ctx,scalefactor);
                            markupobject.polyline(ctx, linewidthScaled, markupobject.strokecolor, scalefactor,false);
                            ctx.restore();

                            break;


                        case 2:
                            if (markupobject.alternative == 0){
                                ctx.save();
                                markupobject.GetLinestyle(markupobject.linestyle,ctx,scalefactor);
                                markupobject.polygon(ctx, linewidthScaled, false, true, markupobject.fillcolor, markupobject.strokecolor, scalefactor,false);
                                ctx.restore();


                            }

                            if (markupobject.alternative == 1){
                                markupobject.polygon(ctx, linewidthScaled, true, true, markupobject.fillcolor, markupobject.strokecolor, scalefactor,false);
                            }
                            if (markupobject.alternative == 2){

                                markupobject.polygon(ctx, linewidthScaled, true, true, "white", markupobject.color, scalefactor,false);
                            }
                            if (markupobject.alternative >= 3){

                                markupobject.polygon(ctx, linewidthScaled, true, true, ptrn, markupobject.color, scalefactor,false);
                            }

                            break;

                        case 3:
                            ctx.save();
                            markupobject.GetLinestyle(markupobject.linestyle,ctx,scalefactor);
                            markupobject.polyline(ctx, linewidthScaled, markupobject.strokecolor, scalefactor, pagedx, pagedy, true);
                            ctx.restore();
                            
                            markupobject.setdimvaluepoly();

                            if(bUseFixedScale){
                                markupobject.dimvaluedraw(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, markupobject.strokecolor, printfixedscale,false);
                            }else{
                                markupobject.dimvaluedraw(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, markupobject.strokecolor, scalefactor,false);
                            }
                            break;    

                    }


                    break;
                case 2:
                    var curvcounter = 0;

                    markupobject.SetDimensions(scalefactor,0,pagedx,pagedy);

                    switch (markupobject.subtype){
                        case 1:
                            markupobject.polycurves(ctx,linewidthScaled,markupobject.color, scalefactor);
                            break;
                    }
                    break;


                case 3: //rectangle

                    markupobject.SetDimensions(scalefactor,0,pagedx,pagedy);

                    if (markupobject.subtype == 2){



                        if(backgroundColor != undefined){
                            var erasecolor  = backgroundColor;
                        }else{
                            erasecolor = "white";
                        }
                        markupobject.Rect(ctx,markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled,linewidthScaled,true,false,erasecolor,erasecolor);
                        //ctx.lineWidth = markupobject.linewidth * 10 * scalefactor;

                    }


                    if (markupobject.subtype == 3){

                        markupobject.Rect(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, linewidthScaled, true, false, markupobject.fillcolor, markupobject.fillcolor);


                    }
                    if (markupobject.subtype == 1){

                        //

                        if (markupobject.alternative == 0){
                            ctx.save();
                            markupobject.GetLinestyle(markupobject.linestyle,ctx,scalefactor);
                            markupobject.roundedRect(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, markupobject.rotation, radiusScaled, linewidthScaled, false, true, markupobject.fillcolor, markupobject.strokecolor);
                            ctx.restore();

                        }
                        if (markupobject.alternative == 1){
                            markupobject.roundedRect(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, markupobject.rotation, radiusScaled, linewidthScaled, true, true, markupobject.fillcolor, markupobject.strokecolor);


                        }
                        if (markupobject.alternative == 2){

                            markupobject.roundedRect(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, markupobject.rotation, radiusScaled, linewidthScaled, true, true, "white", markupobject.color);
                        }
                        if (markupobject.alternative >= 3){

                            markupobject.roundedRect(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, markupobject.rotation, radiusScaled, linewidthScaled, true, true, ptrn, markupobject.color);
                        }



                    }
                    if (markupobject.subtype == 0){
                        if (markupobject.alternative ==0){
                            ctx.save();
                            markupobject.GetLinestyle(markupobject.linestyle,ctx,scalefactor);
                            markupobject.Rect(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, linewidthScaled, false, true, markupobject.fillcolor, markupobject.strokecolor);
                            ctx.restore();

                        }
                        if (markupobject.alternative == 1){

                            markupobject.Rect(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, linewidthScaled, true, true, markupobject.fillcolor, markupobject.strokecolor);
                        }
                        if (markupobject.alternative == 2){

                            markupobject.Rect(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, linewidthScaled, true, true, "white", markupobject.color);
                        }

                        if(markupobject.alternative >= 3){
                            //var ptrn = ctx.createPattern(hatchdiagforw,'repeat');

                            markupobject.Rect(ctx,markupobject.xscaled,markupobject.yscaled,markupobject.wscaled,markupobject.hscaled,linewidthScaled,true,true,ptrn,markupobject.color);
                        }


                    }

                    break;
                case 4: //oval

                    markupobject.SetDimensions(scalefactor,0,pagedx,pagedy);


                    if (markupobject.alternative ==0){


                        ctx.save();
                        markupobject.GetLinestyle(markupobject.linestyle,ctx,scalefactor);
                        markupobject.Oval(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, linewidthScaled, false, true, markupobject.fillcolor, markupobject.strokecolor);
                        ctx.restore();

                    }
                    if (markupobject.alternative == 1){

                        markupobject.Oval(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, linewidthScaled, true, true, markupobject.fillcolor, markupobject.strokecolor);


                    }
                    if (markupobject.alternative == 2){

                        markupobject.Oval(ctx,markupobject.xscaled,markupobject.yscaled,markupobject.wscaled,markupobject.hscaled,linewidthScaled,true,true,"white",markupobject.color);

                    }
                    if (markupobject.alternative >= 3){
                        markupobject.Oval(ctx,markupobject.xscaled,markupobject.yscaled,markupobject.wscaled,markupobject.hscaled,linewidthScaled,true,true,ptrn,markupobject.color);

                    }


                    break;
                case 5:
                    markupobject.SetDimensions(scalefactor,0,pagedx,pagedy);

                    if (markupobject.alternative == 0){
                        ctx.save();
                        markupobject.GetLinestyle(markupobject.linestyle,ctx,scalefactor);
                        markupobject.newcloud(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, radiusScaled, linewidthScaled, false, true, markupobject.fillcolor, markupobject.strokecolor);
                        ctx.restore();

                    }
                    if (markupobject.alternative == 1){
                        markupobject.newcloud(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, radiusScaled, linewidthScaled, true, true, markupobject.fillcolor, markupobject.strokecolor);


                    }
                    if (markupobject.alternative == 2){
                        //markupobject.cloud(ctx,markupobject.xscaled,markupobject.yscaled,markupobject.wscaled,markupobject.hscaled,radiusScaled,linewidthScaled,true,true,"white",markupobject.color);
                        markupobject.newcloud(ctx,markupobject.xscaled,markupobject.yscaled,markupobject.wscaled,markupobject.hscaled,radiusScaled,linewidthScaled,true,true,"white",markupobject.color);

                    }
                    if (markupobject.alternative >= 3){
                        //markupobject.cloud(ctx,markupobject.xscaled,markupobject.yscaled,markupobject.wscaled,markupobject.hscaled,radiusScaled,linewidthScaled,true,true,ptrn,markupobject.color);
                        markupobject.newcloud(ctx,markupobject.xscaled,markupobject.yscaled,markupobject.wscaled,markupobject.hscaled,radiusScaled,linewidthScaled,true,true,ptrn,markupobject.color);

                    }

                    break;
                case 6: //line arrow

                    markupobject.SetDimensions(scalefactor,0,pagedx,pagedy);

                    ctx.save();
                    markupobject.GetLinestyle(markupobject.linestyle,ctx,scalefactor);
                    markupobject.arrow(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, arrowlengthscaled, arrowangle, linewidthScaled, markupobject.subtype, markupobject.strokecolor, markupobject.strokecolor);
                    ctx.restore();



                    break;
                case 7: //dimension line
                    markupobject.SetDimensions(scalefactor,0,pagedx,pagedy);

                    var dimtype = markupobject.subtype + 4;

                    ctx.save();
                    markupobject.GetLinestyle(markupobject.linestyle,ctx,scalefactor);
                    markupobject.arrow(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, arrowlengthscaled, arrowangle, linewidthScaled, dimtype, markupobject.strokecolor, markupobject.strokecolor);
                    ctx.restore();


                    markupobject.setdimvalue(markupobject.x, markupobject.y, markupobject.w, markupobject.h);

                    if (bUseFixedScale){
                        markupobject.dimvaluedraw(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, markupobject.color, printfixedscale, true);
                    }else{
                        markupobject.dimvaluedraw(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, markupobject.color, scalefactor, true);
                    }
                    



                    break;

                case 8:
                    var acounter = 0;
                    var dimarea = 0;
                    markupobject.SetDimensions(scalefactor,0,pagedx,pagedy);

                    if(bUseFixedScale){
                        var localscalefactor = printfixedscale;
                    }else{
                        localscalefactor = scalefactor;
                    }



                    if (markupobject.alternative == 0){
                        ctx.save();
                        markupobject.GetLinestyle(markupobject.linestyle,ctx,scalefactor);
                        markupobject.polygon(ctx, linewidthScaled, false, true, markupobject.fillcolor, markupobject.strokecolor, scalefactor,false);
                        ctx.restore();

                    }

                    if (markupobject.alternative == 1){
                        markupobject.polygon(ctx, linewidthScaled, true, true, markupobject.fillcolor, markupobject.strokecolor, scalefactor,false);
                    }
                    if (markupobject.alternative == 2){
                        markupobject.polygon(ctx,linewidthScaled,true,true,"white",markupobject.color,scalefactor,false);
                    }
                    if (markupobject.alternative >= 3){

                        markupobject.polygon(ctx,linewidthScaled,true,true,ptrn,markupobject.color,scalefactor,false);
                    }


                    var markupscalesq = markupobject.scaling*markupobject.scaling;
                    dimarea = markupobject.PolygonArea();
                    markupobject.dimtext = opener.RxCore.printhelper().getUnitArea(dimarea/markupscalesq);
                    markupobject.dimtext = markupobject.dimtext.toFixed(2);
                    markupobject.dimtext = markupobject.dimtext + " " + opener.RxCore.printhelper().areaUnitlabel;
                    


                    var areatextx = markupobject.PolygonCentre('x');
                    var areatexty = markupobject.PolygonCentre('y');

                    var areatextxscaled = (areatextx - markupobject.xoffset) * scalefactor;
                    var areatextyscaled = (areatexty - markupobject.yoffset) * scalefactor;

                    areatextxscaled += dx;
                    areatextyscaled += dy;

                    if(!bMarkupNoLabel){
                        var areatextscaled = markupobject.measuretextheight * localscalefactor;
                        ctx.textAlign  = "start";
                        ctx.font = areatextscaled + "pt " + "Helvetica";
                        markupobject.textheight = markupobject.measuretextheight;

                        var areat = ctx.measureText(markupobject.dimtext);
                        var areatextwidth = areat.width;
                        var areatextheight = areatextscaled;
                        areatextxscaled = areatextxscaled - (areatextwidth/2);
                        areatextyscaled = areatextyscaled + (areatextheight/2);
                        ctx.lineWidth = 1;
                        ctx.strokeStyle=markupobject.color;
                        ctx.fillStyle = "white";
                        ctx.fillRect(areatextxscaled-(10*localscalefactor), areatextyscaled-(20*localscalefactor),areatextwidth + (20*localscalefactor),areatextscaled + (15*localscalefactor));
                        ctx.strokeRect(areatextxscaled-(10*localscalefactor), areatextyscaled-(20*localscalefactor),areatextwidth + (20*localscalefactor),areatextscaled + (15*localscalefactor));

                        ctx.fillStyle = "black";
                        ctx.fillText(markupobject.dimtext, areatextxscaled, areatextyscaled);

                    }



                    break;
                case 9: //text
                      
                    if(bUseFixedScale){
                        var temptxtscale = printfixedscale;
                    }else{
                        temptxtscale = scalefactor;
                    } 

                    markupobject.font.setScale(temptxtscale);
                    var textscaled = markupobject.font.height * temptxtscale;

                    ctx.font = markupobject.font.fontstringScaled;


                    var dimsel = ctx.measureText(markupobject.text);
                    markupobject.textwidth = dimsel.width;

                    markupobject.SetDimensions(scalefactor,0,pagedx,pagedy);



                    //draw text selected goes here.


                    ctx.save();

                    tx = markupobject.xscaled;
                    ty = markupobject.yscaled;

                    if (markupobject.textrotate != 0 && markupobject.subtype == 0) {
                        ctx.translate(tx,ty);
                        ctx.rotate(markupobject.textrotate);
                        ctx.translate(-tx,-ty);

                    }



                    ctx.textAlign = "start";
                    ctx.fillStyle = markupobject.textcolor;

                    if(markupobject.subtype == 1){
                        var toffsetx = 4*temptxtscale;
                        var toffsety = ((markupobject.font.height / 4) * 2.0) * temptxtscale;
                        //var toffsety = 8*scalefactor;
                        //var toffsety = (markupobject.font.height / 2) * scalefactor;
                        var startx = markupobject.xscaled + toffsetx;

                        if(markupobject.linewidth == 0){
                            markupobject.Rect(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, linewidthScaled, true, false, markupobject.fillcolor, markupobject.strokecolor);
                        }else{
                            markupobject.Rect(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, linewidthScaled, true, true, markupobject.fillcolor, markupobject.strokecolor);
                        }

  
                        ctx.save();
                        ctx.beginPath();
                        ctx.rect(markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled);
                        ctx.clip();

                        var textarray = markupobject.text.split('\n');
                        var ystart = markupobject.yscaled + textscaled + toffsety;
                        
                        var ttx = markupobject.xscaled;// + (this.wscaled);
                        var tty = markupobject.yscaled; //+ (this.hscaled/2);
                        
                        switch(markupobject.pagerotation){
                            case 0:
                                var startx = markupobject.xscaled + toffsetx;
                                var maxwidth = markupobject.wscaled;
                                break;
                            case 90:
                                startx = (markupobject.xscaled + toffsetx) - markupobject.hscaled;
                                ctx.translate(ttx , tty);
                                ctx.rotate(-(markupobject.pagerotation * (Math.PI / 180)));
                                ctx.translate(-ttx, -tty);
                                maxwidth = markupobject.hscaled;
                                break;
                            case 270:
                                //startx = this.xscaled + toffsetx;
                                startx = (markupobject.xscaled + toffsetx);// + this.hscaled;
                                //ystart = (this.yscaled + toffsety) - this.wscaled;
                                ystart = (markupobject.yscaled + textscaled + toffsety) - markupobject.wscaled;
                                ctx.translate(ttx , tty);
                                ctx.rotate(-(markupobject.pagerotation * (Math.PI / 180)));
                                ctx.translate(-ttx, -tty);
                                maxwidth = markupobject.hscaled;
                                break;
                            case 180:
                                startx = markupobject.xscaled + toffsetx;
                                ttx = markupobject.xscaled + (markupobject.wscaled / 2);
                                tty = markupobject.yscaled + (markupobject.hscaled / 2);
                                ctx.translate(ttx, tty);
                                ctx.rotate(-(markupobject.pagerotation * (Math.PI / 180)));
                                ctx.translate(-ttx, -tty);
                                maxwidth = markupobject.wscaled;
                                break;
                        }
                        
                        
                        wrapText(ctx, markupobject.text, startx, ystart, maxwidth, textscaled + toffsety);
                        
                        /*for (var i = 0; i < textarray.length; i++) {

                            ctx.fillText(textarray[i], markupobject.xscaled + toffsetx , ystart);
                            ystart += textscaled + toffsety;

                        }*/
                        ctx.restore();


                    }else{
                        ctx.fillText(markupobject.text, markupobject.xscaled, markupobject.yscaled);
                    }



                    ctx.restore();

                    break;
                case 10:
                    markupobject.SetDimensions(scalefactor,0,pagedx,pagedy);

                    if(bUseFixedScale){
                        markupobject.wscaled = markupobject.w * printfixedscale;
                        markupobject.hscaled = markupobject.h * printfixedscale;
    
                    }else{
                        markupobject.wscaled = markupobject.w * scalefactor;
                        markupobject.hscaled = markupobject.h * scalefactor;

                    } 


                    ctx.drawImage(noteprintimage,markupobject.xscaled,markupobject.yscaled,markupobject.wscaled,markupobject.hscaled);

                    break;
                case 11:
                    var createimage = new Image();
                    
                    if (markupobject.image.href != undefined){
                      createimage.src = markupobject.image.href;
                    }else{
                      createimage.src = markupobject.image.src;
                    }
                    
                
                    markupobject.SetDimensions(scalefactor,0,pagedx,pagedy);

                    //ctx.drawImage(markupobject.image,markupobject.xscaled,markupobject.yscaled,markupobject.wscaled,markupobject.hscaled);
                    ctx.drawImage(createimage,markupobject.xscaled,markupobject.yscaled,markupobject.wscaled,markupobject.hscaled);
                    
                    break;

                case 12:
                    markupobject.SetDimensions(scalefactor,0,pagedx,pagedy);

                    var textstampscaled = markupobject.font.height * scalefactor;
                    markupobject.font.setScale(scalefactor);

                    var textsmallstampscaled = markupobject.stampsmalltheight * scalefactor;

                    if(bUseFixedScale){
                        markupobject.roundedRect(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, markupobject.rotation, radiusScaled, 3 * printfixedscale, true, true, markupobject.fillcolor, markupobject.strokecolor);
                    }else{
                        markupobject.roundedRect(ctx, markupobject.xscaled, markupobject.yscaled, markupobject.wscaled, markupobject.hscaled, markupobject.rotation, radiusScaled, 3 * scalefactor, true, true, markupobject.fillcolor, markupobject.strokecolor);
                    }



                    var Displayname = GetDisplayName(markupobject.signature);

                    var datetext = markupobject.GetDateTime(false);
                    //var smalltext = "By " + markupobject.signature + "," + " ";
                    markupobject.smalltext = "By " + Displayname + "," + " ";
                    markupobject.smalltext += datetext;



                    ctx.save();


                    if(markupobject.rotation !=0){
                        tx = markupobject.xscaled + (markupobject.wscaled/2);
                        ty = markupobject.yscaled + (markupobject.hscaled / 2);

                        ctx.translate(tx,ty);
                        ctx.rotate(markupobject.rotation);
                        ctx.translate(-tx,-ty);
                    }



                    ctx.fillStyle = markupobject.strokecolor;
                    ctx.font = markupobject.font.fontstringScaled;



                    var stampdim = ctx.measureText(markupobject.text);
                    markupobject.textwidth = stampdim.width;

                    tx = markupobject.xscaled+(markupobject.wscaled/2);
                    //ty = markupobject.yscaled+(markupobject.hscaled/2);
                    if(markupobject.alternative == 0){
                        ty = markupobject.yscaled + ((markupobject.hscaled / 4) + (textstampscaled / 2));
                    }else{
                        ty = markupobject.yscaled + (markupobject.hscaled / 2);
                        ty += (textstampscaled / 4);
                    }



                    //tx = markupobject.xscaled+(markupobject.wscaled/2);
                    //ty = markupobject.yscaled+(markupobject.hscaled/2);

                    if (markupobject.textrotate !=0){
                        ctx.translate(tx,ty);
                        ctx.rotate(markupobject.textrotate);
                        ctx.translate(-tx,-ty);

                        tx = markupobject.xscaled+(markupobject.wscaled/2);
                        //ty = markupobject.yscaled+(markupobject.hscaled/2);
                        if(markupobject.alternative == 0){
                            ty = markupobject.yscaled + ((markupobject.hscaled / 4) + (textstampscaled / 2));
                        }else{
                            ty = markupobject.yscaled + (markupobject.hscaled / 2);
                            ty += (textstampscaled / 4);
                        }



                    }
                    ctx.textAlign = 'center';
                    ctx.fillText(markupobject.text, tx, ty);

                    if(markupobject.alternative == 0 ){
                        ctx.fillStyle = markupobject.color;
                        ctx.font = "bold " + textsmallstampscaled + "pt " + "Times New Roman";
                        ty = markupobject.yscaled +((markupobject.hscaled/4)*3);

                        ctx.fillText(markupobject.smalltext, tx, ty);

                    }


                    ctx.restore();
                    break;

            }



        

}

function getpage(pagenum) {
    DocObj.GotoPage(pagenum);
}

function getDocObj() {
    return DocObj;
}

function PrintWindow() {
    var css = `@page { size: ${Porientation == 0 ? 'portrait' : 'landscape'}; }`,
    head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');
    style.type = 'text/css';
    style.media = 'print';
    if (style.styleSheet){
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }
    head.appendChild(style);

    window.print();

    setTimeout("opener.RxCore.printhelper().printfocus()", 100);
    /*window.onfocus=function(){
        window.close();
    }*/
    //opener.RxCore.printhelper().printfocus();
    //CheckWindowState();
    //opener.RxCore.printhelper().printfocus();

}

function CheckWindowState() {
    if(document.readyState=="complete") {

        //alert('closing');
        //opener.RxCore.printhelper().printfocus();
        //window.focus();
    } else {
        setTimeout("CheckWindowState()", 2000);

    }

}

function doprintcheck(){
    var canprint = true;

    for (var i = 0; i < aDrawpages.length;i++) {
        if(!aDrawpages[i]){
            canprint = false;
        }
    }

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



function draw_compare(ctx,Compobj,dscale,dx,dy){
    ctx.save();
    ctx.fillStyle = "white";
    //contexto.fillStyle = "rgb(160,160,160)";
    ctx.fillRect(0, 0, canvaso.width, canvaso.height);
    var tx = (canvaso.width/2);
    var ty = (canvaso.height/2);
    //documentopen = true;


    if (Compobj.pages[1].VectorPageObj == undefined || Compobj.pages[0].VectorPageObj == undefined ){
        return;
    }

    //context,scalefactor,offsetx,offsety
    //this.dxvector = dx;
    //this.dyvector = dy;
    //this.dscalevector = dscale;

    if (Compobj.pages[1].drotation == 0){
        Compobj.pages[0].VectorPageObj.drawallcmpre(ctx,dscale,dx,dy,true,Compobj.backgroundColor,true);
        Compobj.pages[1].VectorPageObj.drawallcmpre(ctx,dscale,dx,dy,true,Compobj.overlayColor,false);
    }else{
        ctx.save();
        ctx.translate(tx,ty);
        ctx.rotate(Compobj.pages[1].drotation*(Math.PI/180));
        contexto.translate(-tx,-ty);
        Compobj.pages[0].VectorPageObj.drawallcmpre(ctx,dscale,dx,dy,true,Compobj.backgroundColor,true);
        Compobj.pages[1].VectorPageObj.drawallcmpre(ctx,dscale,dx,dy,true,Compobj.overlayColor,false);

        ctx.restore();

    }

    ctx.restore();
    doprintcheck();
}

function drawmarkupPrint(ctx,page,dx,dy,dscale){
        var curmarkup = 0;

        for (curmarkup = 0; curmarkup < opener.RxCore.printhelper().docObj.markuplist.length; curmarkup++) {
            if (opener.RxCore.printhelper().docObj.markuplist[curmarkup] != null) {
                if (opener.RxCore.printhelper().docObj.markuplist[curmarkup].pagenumber == page) {
                    if (opener.RxCore.printhelper().docObj.markuplist[curmarkup].display) {
                        try {
                           //opener.RxCore.printhelper().docObj.markuplist[curmarkup].drawprint(ctx,dx,dy,dscale);
                             drawmarkup(ctx,opener.RxCore.printhelper().docObj.markuplist[curmarkup],dx,dy,dscale);
                        }
                        catch(err) {
                          //document.getElementById("demo").innerHTML = err.message;
                          console.log(err.message);
                        }

                    }
                }
            }
        }
        aDrawpages[page] = true;
        doprintcheck();

        
        /*if(RxCore_GUI_printpage != undefined){
            RxCore_GUI_printpage.printpageComplete(DocObj.pages[page].printobj);
        }*/



}


var printpdfpageobject = function(pagenum){
    var thispage = this;
    this.pagenum = pagenum;
    this.pageRendering = true;
    this.pagePrinting = false;
    this.visible = false;
    this.pagescale = 0;
    this.curpagescale = 0;
    this.pageNumPending = 0;
    this.pageloaded = true;
    this.dxprint = 0;
    this.dyprint = 0;
    this.dscaleprint = 1;
    this.startx = 0;
    this.starty = 0;
    this.endx = 0;    
    this.endy = 0;

    
    
    this.setPDFdim = function(dx, dy,dscale){

        thispage.pageloaded = true;
        thispage.dxprint = dx;
        thispage.dyprint = dy;
        thispage.dscaleprint = dscale;
        
        //this.dscalepdf = dscale;
        //this.initialscale = dscale;
        //this.vectorloaded = true;

        thispage.startx = this.dxprint;
        thispage.starty = this.dyprint;
        //dxlocal = (canvaso.width - (thispage.VectorPageObj.width*dscalelocal)) / 2;
        //dylocal = (canvaso.height - (thispage.VectorPageObj.height*dscalelocal)) / 2;


        thispage.endx = (canvaso.width*this.dscaleprint) + this.startx;
        thispage.endy = (canvaso.height*this.dscaleprint) + this.starty;

        /*if (firstpage && !markuploaded){
            if(bUsemarkupbyref){

                getMarkupbyReference(path);
            }else{
                getMarkupFilelist(path);
            }

        }*/

        /*if(firstpage){
            //this.draw_canvas(true);
            thispage.visible = true;
        }*/


        //drawmarkupAll(thispage.contextpg,thispage);
        drawmarkupPrint(pageCanvases[thispage.pagenum],thispage.pagenum,thispage.dxprint,thispage.dyprint,thispage.dscaleprint);
        
        //usepdfjs
        //hideDownloadDialog();
        //RxCore_default();


    };    
    
    
    
    this.queueRenderPage = function () {
            /*if (thispage.pageRendering) {
                thispage.pageNumPending = thispage.pagenum + 1;
            } else {
                thispage.renderPDFpage();
            }*/
            thispage.renderPDFpage();
    };
    
    this.renderPDFpage = function(){
        thispage.pageRendering = true;
        thispage.pagePrinting = true;
        // Using promise to fetch the page
        
        pdfDoc.getPage(thispage.pagenum+1).then(function(page) {


            if(page.view[3] != 0){
                var pagewidth = Math.abs(page.view[2] - page.view[0]);
                var pageheight = Math.abs(page.view[3] - page.view[1]);
                var pagetemp = Math.abs(page.view[2] - page.view[0]);
            }else{
                pagewidth = Math.abs(page.view[2] - page.view[0]);
                pageheight = Math.abs(page.view[3] - page.view[1]);
                pagetemp = Math.abs(page.view[2]- page.view[0]);

            }

            //thispage.PDFpageRotate = page._pageInfo.rotate;
            switch (page._pageInfo.rotate) {
                case 0:
                    break;
                case 90:
                    pagewidth = pageheight;
                    pageheight = pagetemp;
                    break;
                case 180:
                    break;
                case 270:
                    pagewidth = pageheight;
                    pageheight = pagetemp;
                    break;
            }

            thispage.pagewidth = pagewidth;
            thispage.pageheight = pageheight;

            //thispage.printobj.setDocSise(thispage.MainImageWidth,thispage.MainImageHeight);

            var tempwscale = canvaso.width / thispage.pagewidth;
            var temphscale = canvaso.height / thispage.pageheight;
            //var tempwscale = pageCanvases[thispage.pagenum].width / thispage.pagewidth;
            //var temphscale = pageCanvases[thispage.pagenum].height / thispage.pageheight;
            
            thispage.pagescale = Math.min(tempwscale,temphscale);


            var viewport = page.getViewport(thispage.pagescale);

            thispage.curpagescale = thispage.pagescale;

            thispage.pdfdxtemp = 0;
            thispage.pdfdytemp = 0;

            //pageCanvases[thispage.pagenum].clearRect(0, 0, canvaso.width, canvaso.height);
            //thispage.contextpg.clearRect(0, 0, thispage.canvpage.width, thispage.canvpage.height);
            //pageCanvases[thispage.pagenum].fillstyle = 'white';
            //thispage.contextpg.fillStyle = 'white';
            //thispage.contextpg.fillRect(0, 0, thispage.canvpage.width, thispage.canvpage.height);


            var renderContext = {
                canvasContext: pageCanvases[thispage.pagenum],
                viewport: viewport
            };

            var renderTask = page.render(renderContext);


            // Wait for rendering to finish
            renderTask.promise.then(function () {
                thispage.pageRendering = false;
                /*if (thispage.pageNumPending !== null) {
                    // New page rendering is pending

                    thispage.renderPDFpage();
                    thispage.pageNumPending = null;

                }*/
                var tempscale = 1 - thispage.pagescale;

                
                //thispage.markupscaleadjust = thispage.curpagescale / opener.RxCore.printhelper().docObj.pages[thispage.pagenum].curpagescale;

                thispage.setPDFdim(thispage.pdfdxtemp,thispage.pdfdytemp,thispage.pagescale);
                //aDrawpages[pagenum] = true;
                //doprintcheck();


            });

        });

    };    
    

    

};






function onPrintpage(printobj){
    
    
    //var localcanvas = printobj.paperimage;
    canvimages[printobj.pagenumber] = document.createElement('img');
    canvimages[printobj.pagenumber].src = printobj.paperimage.toDataURL();
    canvimages[printobj.pagenumber].addEventListener('load', printimageloaded, false);

    function printimageloaded(ev){
      try{
        pageCanvases[printobj.pagenumber].drawImage(canvimages[printobj.pagenumber],0,0);
      }
    
      catch(err) {
       console.log(err.message);
      }
     aDrawpages[printobj.pagenumber] = true;
     doprintcheck();


    }     
     


}

function ComparePrint(){
       
    //canvimage.src = opener.RxCore.printhelper().compareObj.printref.printobj.paperimage.toDataURL();
    //canvimage.addEventListener('load', printimageloaded, false);

      try{
        pageCanvases[0].drawImage(opener.RxCore.printhelper().compareObj.printref.printobj.paperimage,0,0);
      }
    
      catch(err) {
       console.log(err.message);
      }
     aDrawpages[0] = true;
     doprintcheck();


    function printimageloaded(ev){
      try{
        pageCanvases[0].drawImage(canvimage,0,0);
      }
    
      catch(err) {
       console.log(err.message);
      }
     aDrawpages[0] = true;
     doprintcheck();


    }     

}

function ComparePrintObj(Compobj,paperwidth,paperheight){

    var px = 0;
    var py = 0;
    var pscale = 0;

    var yscale = 0;
    var xscale = 0;
    var svgpages = [];
    var canvaspages = [];
    var ctxpages = [];

    var pwidth = (paperwidth / 25.4)* 96;
    var pheight = (paperheight / 25.4)* 96;

    var canvashireswidth = (paperwidth / 25.4)* 400;
    var canvashiresheight = (paperheight / 25.4)* 400;

    canvaso.width = canvashireswidth;
    canvaso.height = canvashiresheight;

    canvaso.style.width = pwidth + "px";
    canvaso.style.height = pheight + "px";


    var PaperHeight = (opener.RxCore.printhelper().getPaperHeight() / 25.4)* 400;



    if(Compobj.pages[1].VectorPageObj.height >= Compobj.pages[0].VectorPageObj.height){
        var yscale = canvaso.height / Compobj.pages[1].VectorPageObj.height; //thispage.MainImageHeight;
        var xscale = canvaso.width / Compobj.pages[1].VectorPageObj.width; // thispage.MainImageWidth;
        var dscalelocal = Math.min(xscale,yscale);

        var dxlocal = (canvaso.width - (Compobj.pages[1].VectorPageObj.width*dscalelocal)) / 2;
        var dylocal = (canvaso.height - (Compobj.pages[1].VectorPageObj.height*dscalelocal)) / 2;

    }else{
        yscale = canvaso.height / Compobj.pages[0].VectorPageObj.height; //thispage.MainImageHeight;
        xscale = canvaso.width / Compobj.pages[0].VectorPageObj.width; // thispage.MainImageWidth;
        dscalelocal = Math.min(xscale,yscale);

        dxlocal = (canvaso.width - (Compobj.pages[0].VectorPageObj.width*dscalelocal)) / 2;
        dylocal = (canvaso.height - (Compobj.pages[0].VectorPageObj.height*dscalelocal)) / 2;

    }


    //var canvpage = canvaso;
    //var contextpg = contexto;

    draw_compare(contexto,Compobj,dscalelocal,dxlocal,dylocal);


}






if(window.addEventListener) {
window.addEventListener('load', function () {

  // The active tool instance.
  //var tool;
  //var tool_default = 'pan';

  //noteprintimage = opener.RxCore.printhelper().noteimage;

  if (opener.RxCore.printhelper().noteimage.src){
    noteprintimage.src = opener.RxCore.printhelper().noteimage.src;
  }

  bUseFixedScale = opener.RxCore.printhelper().bUseFixedScale;

  Userlist = opener.RxCore.printhelper().Userlist;

  bMarkupNoLabel = opener.RxCore.printhelper().bMarkupNoLabel;

  function init () {
    hasnotprinted = true;
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
      canvaso = document.getElementById('printview');
    if (!canvaso) {
      alert('Error: I cannot find the canvas element!');
      return;
    }

    
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

      //SetPageSize(PaperWidth,PaperHeight);
      try {
          //var PageObjectXML = opener.RxCore.printhelper().GetPageObject();

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

    if(opener.RxCore.printhelper().documentcompare){
        if(opener.RxCore.printhelper().docObj != null){
          var paperobj = {
            width : PaperWidth,
            height : PaperHeight  
          };
          
          var pwidth = (paperobj.width / 25.4)* 96;
          var pheight = (paperobj.height / 25.4)* 96;

          var canvashireswidth = (paperobj.width / 25.4)* 300;
          var canvashiresheight = (paperobj.height / 25.4)* 300;

          canvaso.width = canvashireswidth;
          canvaso.height = canvashiresheight;

          canvaso.style.width = pwidth + "px";
          canvaso.style.height = pheight + "px";

          var canvpage = canvaso;
          var contextpg = contexto;
          var firstpage = true;
          pageCanvases.push(contextpg);
          
          ComparePrint();
          
          //opener.RxCore.printhelper().compareObj.printDocument(paperobj);
          //opener.RxCore.printhelper().compareObj.printDocument(paperobj);
          //printref.printobj.paperimage
          //ComparePrintObj(opener.RxCore.printhelper().compareObj,PaperWidth,PaperHeight);
        }
        
        //printDocObj(opener.RxCore.printhelper().DocObj,PaperWidth,PaperHeight);
        //MeasureScale = opener.RxCore.printhelper().MeasureScale;
        //Unitlabel = opener.RxCore.printhelper().Unitlabel;
        //AreaUnitlabel = opener.RxCore.printhelper().AreaUnitlabel;
        //unitscale = opener.RxCore.printhelper().unitscale;
        //Unitofmeasure  = opener.RxCore.printhelper().Unitofmeasure;

    }else{
        if(opener.RxCore.printhelper().docObj != null){
            const urlParams = new URLSearchParams(window.location.search);
            Porientation = urlParams.get('o');

          var paperobj = {
            width : Porientation == 0 ? PaperWidth : PaperHeight,
            height : Porientation == 0 ? PaperHeight : PaperWidth, PaperHeight,
          };
          
          var pwidth =  (paperobj.width / 25.4)* 96;
          var pheight = (paperobj.height / 25.4)* 96;

          var canvashireswidth = (paperobj.width / 25.4)* 300;
          var canvashiresheight = (paperobj.height / 25.4)* 300;

          canvaso.width = canvashireswidth;
          canvaso.height = canvashiresheight;

          canvaso.style.width = pwidth + "px";
          canvaso.style.height = pheight + "px";

          if (Porientation == 1 && pheight > window.screen.height) {
            canvaso.style.height = window.screen.height + "px";
          }

          if (Porientation == 1 && pwidth > window.screen.width) {
            canvaso.style.width = window.screen.width + "px";
          }

          //var numpages = opener.RxCore.printhelper().docObj.pages.length - 1;
          var numpages = opener.RxCore.printhelper().docObj.pages.length;
          
          for(var i = 0; i < numpages; i++){
                if (i > 0){
                  var container = canvaso.parentNode;
                  var canvpage = document.createElement('canvas');
                  if(!canvpage){
                    alert('Error: I cannot create a new canvas element!');
                    return;
                  }
                  canvpage.id     = 'page' + i;
                  canvpage.width  = canvaso.width;
                  canvpage.height = canvaso.height;
                  canvpage.style.width  = canvaso.style.width;
                  canvpage.style.height = canvaso.style.height;
                  container.appendChild(canvpage);
                  aDrawpages[i] = false;

                  var contextpg = canvpage.getContext('2d');
                  if (!contextpg) {
                      alert('Error: failed to getContext!');
                      return;
                  }
                  pageCanvases.push(contextpg);
                }else{
                  var canvpage = canvaso;
                  var contextpg = contexto;
                  var firstpage = true;
                  pageCanvases.push(contextpg);
                }

            
            
          }
          
          if (opener.RxCore.printhelper().docObj.pdfDoc != null){
            //var file = getFileName(opener.RxCore.printhelper().docObj.FileName);
            //opener.RxCore.printhelper().docObj.pdfURL
            pdfjsLib.getDocument(opener.RxCore.printhelper().docObj.pdfURL).then(function (pdfDoc_) {
                  pdfDoc = pdfDoc_; 
                  for (var pg = 0; pg < numpages; pg++) {
                       
                    canvaspages.push(new printpdfpageobject(pg));
                    canvaspages[pg].queueRenderPage();
                       //var pdfpageobj = new printpdfpageobject(pg);
                       //pdfpageobj.queueRenderPage(pg + 1);
                       //thisdocument.pages[i].queueRenderPage(i + 1);
                       //thisdocument.pages[i].queueRenderPage(i + 1);

                  }

            }).catch(error => {
                console.error(error);
            });
            
          }else{
            opener.RxCore.printhelper().onPrintpage.connect(onPrintpage);
            opener.RxCore.printhelper().docObj.printDocument(paperobj);
          }
                     
        }
    }
    
    
}





      try {
          Stamplist = opener.RxCore.printhelper().stampList;

      }
      catch (e) {
          Stamplist = ["Approved","Draft","Received","Rejected","Reviewed","Revised"];
      }

      try{
          var id = 0;
      }
      catch (e) {

      }

    

    init();

}, false);
    window.addEventListener('resize', function () {
       function init () {

       }
       init();
    },false);
}
