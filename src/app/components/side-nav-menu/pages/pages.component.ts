import { Component, OnInit } from '@angular/core';
import { RxCoreService } from 'src/app/services/rxcore.service';
import { RXCore } from 'src/rxcore';
import { TreeviewConfig } from '../../common/treeview/models/treeview-config';
import { TreeviewItem } from '../../common/treeview/models/treeview-item';

@Component({
  selector: 'rx-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  tabActiveIndex: number = 0;
  thumbnails: Array<any> = [];
  numpages: number = 1;
  selectedPageIndex: number = 0;
  page: number;
  scale: number = 95;
  bookmarks: Array<TreeviewItem> = [];
  search: string;
  viewBookmarks: boolean = false;

  config = TreeviewConfig.create({
    hasFilter: true,
    decoupleChildFromParent: true
  });

  constructor(private readonly rxCoreService: RxCoreService) {}

  ngOnInit(): void {
    this.rxCoreService.guiState$.subscribe(state => {
      this.numpages = state.numpages;
    });

    this.rxCoreService.guiPageThumbs$.subscribe(data => {
      this.thumbnails = data;
    });

    this.rxCoreService.guiPdfBookmarks$.subscribe(data => {
      this.bookmarks = this._getBookmarks(data);
    });
  }

  private _getBookmarks(bookmarks: Array<any>): Array<TreeviewItem> {
    const items: Array<TreeviewItem> = [];

    try {
      for (let bookmark of bookmarks) {
        const item = new TreeviewItem({
          text: bookmark?.title || '',
          value: bookmark,
          collapsed: true,
        });

        if (bookmark.children?.length) {
          item.children = this._getBookmarks(bookmark.children);
        }

        items.push(item);
      }
    } catch {}

    return items;
  }

  onPageSearch(event): void {
    document.getElementById(`page-${this.page - 1}`)?.scrollIntoView({
      behavior: "instant",
      block: "start",
      inline: "start"
    });
  }

  onPageSelect(pageIndex: number): void {
    this.selectedPageIndex = pageIndex;
    RXCore.gotoPage(pageIndex);
  }

  onViewBookmarksChange(onoff: boolean): void {
  }

  onBookmarkClick(item): void {
    RXCore.navigateBookmark(item.value);
  }
}
