import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FileGaleryService } from './components/file-galery/file-galery.service';
import { RxCoreService } from './services/rxcore.service';
import { RXCore } from 'src/rxcore';
import { NotificationService } from './components/notification/notification.service';
import { MARKUP_TYPES } from 'src/rxcore/constants';
import { AnnotationToolsService } from './components/annotation-tools/annotation-tools.service';
import { ActivatedRoute } from '@angular/router';
import {TopNavMenuService} from "./components/top-nav-menu/top-nav-menu.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  guiConfig$ = this.rxCoreService.guiConfig$;
  title: string = 'view-Soft';
  numOpenFiles$ = this.rxCoreService.numOpenedFiles$;
  annotation: any;
  rectangle: any;
  isVisible: boolean = true;
  followLink: boolean = false;
  eventUploadFile: boolean = false;
  lists: any[] = [];
  state: any;
  bfoxitreadycalled : boolean = false;
  bguireadycalled : boolean = false;
  binitfileopened : boolean = false;
  timeoutId: any;
  pasteStyle: { [key: string]: string } = { display: 'none' };
  fileId: string | null = null;
  filePath: string | null = null;
  projectId: string | null = null;
  userId: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly rxCoreService: RxCoreService,
    private readonly fileGaleryService: FileGaleryService,
    private readonly notificationService: NotificationService) { }

  ngOnInit() {
    this.fileGaleryService.getEventUploadFile().subscribe(event => this.eventUploadFile = event);
    this.fileGaleryService.modalOpened$.subscribe(opened => {
      if (!opened) {
        this.eventUploadFile = false;
      }
    });
    this.route.queryParams.subscribe((params) => {
      this.fileId = params['fileId'] || null; // Get `fileId`
      this.filePath = params['filePath'] || null; // Get `filePath`
      this.projectId = params['projectId'] || null; // Get `projectId`
      this.userId = params['userId'] || null; // Get `userId`

      if (this.fileId && this.filePath && this.projectId && this.userId) {
        this.openFileGalleryWithFileId(this.fileId, this.filePath, this.projectId, this.userId);
      }
    });
  }

  openFileGalleryWithFileId(fileId: string, filePath:string, projectId:string, userId:string) {
    console.log({filePath, fileId, projectId, userId})
    // Open the file gallery modal
    this.fileGaleryService.setFileId(fileId);
    this.fileGaleryService.setFilePath(filePath);
    this.fileGaleryService.setProjectId(projectId);
    this.fileGaleryService.setUserId(userId);

    this.fileGaleryService.openModal();
  }

  ngAfterViewInit(): void {



    let JSNObj = [
      {
          Command: "GetConfig",
          UserName: "Demo",
          DisplayName : "Demo User"

      }
    ];


    RXCore.setJSONConfiguration(JSNObj);

    RXCore.usePanToMarkup(true);
    RXCore.disablewelcome(true);
    RXCore.forceUniqueMarkup(true);
    RXCore.scaleOnResize(false);
    RXCore.restrictPan(false);
    RXCore.overrideLinewidth(true, 1.0);


    //RXCore.setThumbnailSize(240,334);

    RXCore.setGlobalStyle(true);
    RXCore.setLineWidth(4);
    RXCore.setGlobalStyle(false);

    RXCore.useNoScale(false);
    RXCore.useFixedScale(false);


    RXCore.initialize({ offsetWidth: 0, offsetHeight: 0});


    RXCore.onGuiReady((initialDoc: any) => {

      this.bguireadycalled = true;

      console.log('RxCore GUI_Ready.');
      console.log(`Read Only Mode - ${RXCore.getReadOnly()}.`);
      RXCore.setdisplayBackground(document.documentElement.style.getPropertyValue("--background") || '#D6DADC');
      RXCore.setrxprintdiv(document.getElementById('printdiv'));


      if(this.bfoxitreadycalled){
        this.openInitFile(initialDoc);
      }
      /*if(this.bguireadycalled){
        return;
      }*/



    });

    RXCore.onGuiFoxitReady((initialDoc: any) => {


      this.bfoxitreadycalled = true;


      if(this.bguireadycalled){
        this.openInitFile(initialDoc);
      }



      this.rxCoreService.guiFoxitReady.next();



    });

    RXCore.onGuiState((state: any) => {
      console.log('RxCore GUI_State:', state);
      console.log('RxCore GUI_State:', state.source);

      this.state = state;
      this.rxCoreService.setNumOpenFiles(state?.numOpenFiles);
      this.rxCoreService.setGuiState(state);

      if (this.eventUploadFile) this.fileGaleryService.sendStatusActiveDocument('awaitingSetActiveDocument');
      if ((state.source === 'forcepagesState' && state.isPDF) || (state.source === 'setActiveDocument' && !state.isPDF)) {

        this.fileGaleryService.sendStatusActiveDocument(state.source);
        this.eventUploadFile = false;
      }

      if(state.isPDF && state.numpages > 1){
        RXCore.usePanToMarkup(true);
      }else{
        RXCore.usePanToMarkup(false);
      }

      //

    });

    RXCore.onGuiPage((state) => {
     this.rxCoreService.guiPage.next(state);
    });

    RXCore.onGuiFileLoadComplete(() => {
      this.rxCoreService.guiFileLoadComplete.next();
    });

    RXCore.onGuiMarkup((annotation: any, operation: any) => {
      console.log('RxCore GUI_Markup:', annotation, operation);
      if (annotation !== -1 || this.rxCoreService.lastGuiMarkup.markup !== -1) {
        this.rxCoreService.setGuiMarkup(annotation, operation);
      }

    });

    RXCore.onGuiMarkupIndex((annotation: any, operation: any) => {
      console.log('RxCore GUI_Markup index:', annotation, operation);
      if (annotation !== -1 || this.rxCoreService.lastGuiMarkup.markup !== -1) {
        this.rxCoreService.setGuiMarkupIndex(annotation, operation);
        //this.rxCoreService.setGuiMarkupMeasureRealTimeData(annotation);
      }
    });

    RXCore.onGuiMarkupMeasureRealTimeData((annotation: any) => {
      //console.log('RxCore GUI_MarkupMeasureRealTimeData:', annotation);
      if (annotation !== -1) {
        this.rxCoreService.setGuiMarkupMeasureRealTimeData(annotation);
      }
    });


    RXCore.onGuiMarkupHover((markup, x, y) => {
      this.rxCoreService.setGuiMarkupHover(markup, x, y);
    });

    RXCore.onGuiMarkupUnselect((markup) => {
      this.rxCoreService.setGuiMarkupUnselect(markup);
    });

    RXCore.onGuiMarkupList(list => {

      this.rxCoreService.setGuiMarkupList(list);
      this.lists = list?.filter(markup => markup.type != MARKUP_TYPES.SIGNATURE.type && markup.subtype != MARKUP_TYPES.SIGNATURE.subType);
      this.lists?.forEach(list => {
        setTimeout(() => {
          list.rectangle = { x: list.x + list.w - 20, y: list.y - 20 };
        }, 100);
      });
    });

    /*RXCore.onGuiMarkupPaths((pathlist) => {

      for(var pi = 0;  pi < pathlist.length; pi++)[
        //get each markup url here.
      ]


    });*/

    RXCore.onGuiTextInput((rectangle: any, operation: any) => {
      this.rxCoreService.setGuiTextInput(rectangle, operation);
    });

    RXCore.onGuiVectorLayers((layers) => {
      this.rxCoreService.setGuiVectorLayers(layers);
    });

    RXCore.onGuiVectorBlocks((blocks) => {
      this.rxCoreService.setGuiVectorBlocks(blocks);
    });

    RXCore.onGui3DParts((parts) => {
      this.rxCoreService.setGui3DParts(parts);
    });

    RXCore.onGui3DPartInfo(info => {
      this.rxCoreService.setGui3DPartInfo(info);
    });

    RXCore.onGuiPagethumbs((thumbnails) => {
      this.rxCoreService.setGuiPageThumbs(thumbnails);
    });

    RXCore.onGuiPagethumb((thumbnail) => {
      this.rxCoreService.setGuiPageThumb(thumbnail);
    });

    RXCore.onGuiPDFBookmarks((bookmarks) => {
      this.rxCoreService.setGuiPdfBookmarks(bookmarks);
    });

    RXCore.onGuiMarkupSave(() => {
      this.notificationService.notification({message: 'Markups have been successfully saved.', type: 'success'});
    });

    RXCore.onGuiResize(() => {
      this.rxCoreService.guiOnResize.next();
    });

    RXCore.onGuiExportComplete((fileUrl) => {
      this.rxCoreService.guiOnExportComplete.next(fileUrl);
    });

    RXCore.onGuiCompareMeasure((distance, angle, offset, pagewidth, scaleinfo) => {
      this.rxCoreService.guiOnCompareMeasure.next({distance, angle, offset, pagewidth, scaleinfo});
    });

    RXCore.onGuiMarkupChanged((annotation, operation) => {
      this.rxCoreService.guiOnMarkupChanged.next({annotation, operation});
    });

    RXCore.onGuiPanUpdated((sx, sy, pagerect) => {
      this.rxCoreService.guiOnPanUpdated.next({sx, sy, pagerect});
    });

    RXCore.onGuiZoomUpdate((zoomparams, type) => {
      this.rxCoreService.guiOnZoomUpdate.next({zoomparams, type});
    });


  }

  openInitFile(initialDoc){
    if(initialDoc.open && !this.binitfileopened){

      if(initialDoc.openfileobj != null){

        this.binitfileopened = true;
        RXCore.openFile(initialDoc.openfileobj);

      }


    }
  }

  handleChoiceFileClick() {
    this.fileGaleryService.openModal();
  }

  handleLoginClick(){
    console.log("log in pressed");
  }

  onMouseDown(event): void {
    const isPasteMarkUp = this.pasteStyle['display'] === 'flex';

    if (event.button === 2 || event.type === 'touchstart') {
      this.timeoutId = setTimeout(() => {
        this.pasteStyle = { left: event.clientX - 200 + 'px', top: event.clientY - 100 + 'px', display: 'flex' };
      }, 2000);
    } else if ((event.button === 0 && isPasteMarkUp) || (event.type === 'touchstart' && isPasteMarkUp)) {
      this.pasteStyle = { display: 'none' };
    }
  }

  onMouseUp(event): void {
    if (event.button === 2 || event.type === 'touchend') clearTimeout(this.timeoutId);
  }

  pasteMarkUp(): void {
    RXCore.pasteMarkUp();
    this.pasteStyle = { display: 'none' };
  }

}
