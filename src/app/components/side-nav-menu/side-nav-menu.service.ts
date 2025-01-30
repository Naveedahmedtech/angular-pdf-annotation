import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideNavMenuService {

  constructor() { }

  private sidebarChanged: Subject<any> = new Subject<any>();
  public sidebarChanged$: Observable<any> = this.sidebarChanged.asObservable();
  toggleSidebar(index: number) {
    this.sidebarChanged.next(index);
  }
}
