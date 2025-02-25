import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileGaleryService {
  constructor() { }

  // ✅ Modal open/close status
  private _modalOpened = new BehaviorSubject<boolean>(false);
  public modalOpened$ = this._modalOpened.asObservable();

  // ✅ Separate BehaviorSubjects for each value (initialized with an empty string instead of null)
  private fileIdSubject = new BehaviorSubject<string>("");
  private userIdSubject = new BehaviorSubject<string>("");
  private projectIdSubject = new BehaviorSubject<string>("");
  private filePathSubject = new BehaviorSubject<string>("");

  // ✅ Expose them as Observables
  fileId$ = this.fileIdSubject.asObservable();
  userId$ = this.userIdSubject.asObservable();
  projectId$ = this.projectIdSubject.asObservable();
  filePath$ = this.filePathSubject.asObservable();

  // ✅ Event handlers
  private _eventUploadFile = new Subject<boolean>();
  private _statusActiveDocument = new BehaviorSubject<string>('');

  // ✅ Use ReplaySubject(1) to ensure new subscribers receive the last emitted value
  private topNavMethodTrigger = new ReplaySubject<void>(1);
  topNavMethodTrigger$ = this.topNavMethodTrigger.asObservable();

  private fileUploadStatus = new ReplaySubject<{ success: boolean; message: string }>(1);
  fileUploadStatus$ = this.fileUploadStatus.asObservable();

  private issueIdSource = new BehaviorSubject<string | null>(null);
  issueId$ = this.issueIdSource.asObservable();

  /** 🔹 Open & Close File Modal */
  public openModal(): void {
    this._modalOpened.next(true);
  }

  public closeModal(): void {
    this._modalOpened.next(false);
  }

  /** 🔹 Upload File Event Handling */
  public sendEventUploadFile(): void {
    this._eventUploadFile.next(true);
  }

  public getEventUploadFile(): Observable<boolean> {
    return this._eventUploadFile.asObservable();
  }

  /** 🔹 Active Document Status */
  public sendStatusActiveDocument(status: string): void {
    this._statusActiveDocument.next(status);
  }

  public getStatusActiveDocument(): Observable<string> {
    return this._statusActiveDocument.asObservable();
  }

  /** 🔹 Set Values with Debugging Logs */
  setFileId(fileId: string) {
    this.fileIdSubject.next(fileId);
  }

  setFilePath(filePath: string) {
    this.filePathSubject.next(filePath);
  }

  setProjectId(projectId: string) {
    this.projectIdSubject.next(projectId);
  }

  setUserId(userId: string) {
    this.userIdSubject.next(userId);
  }

  /** 🔹 Trigger Top Navigation Method */
  triggerTopNavMethod() {
    this.topNavMethodTrigger.next();
  }

  /** 🔹 Emit Upload Success/Failure */
  notifyFileUploadStatus(success: boolean, message: string) {
    this.fileUploadStatus.next({ success, message });
  }

  setIssueId(issueId: string) {
    this.issueIdSource.next(issueId);
  }
}
