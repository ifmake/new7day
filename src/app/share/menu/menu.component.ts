import { Component, OnInit, Input, OnChanges, Output, EventEmitter} from '@angular/core';
import { Router, NavigationEnd, NavigationStart, ActivatedRoute } from '@angular/router';
import { filter, map, mergeMap} from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { ActiveMenus, RightsMenus } from 'src/app/common/interface/menu.interface';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit , OnChanges {

  @Input() Islogin: boolean;
  @Output() menus: EventEmitter<any> = new EventEmitter<any>();
  @Input() RightsMenus: Array<RightsMenus>;
  isCollapsed = false;
  @Input()ActiveMenus: Array<ActiveMenus>;
  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private titleService: Title
  ) {}
  ngOnChanges() {
    console.log('是否变更')
  }
  ngOnInit() {
    this.router.events.pipe(
      filter(event => {
       if (event instanceof NavigationEnd) {
        this.unfoldActiveLink(event);
        return event instanceof NavigationEnd;
       }
      }),
      map(() => this.activatedRoute),
      map(route => {
        while (route.firstChild) { route = route.firstChild; }
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data))
      .subscribe((event) => {
        // 路由data的标题
        const title = event['title'];
        this.ActiveMenus.forEach(p => p.select = false);
        const menu: ActiveMenus = {
          title: title,
          module: event['module'],
          link: '',
          power: event['power'],
          active: 'active',
          select: true
        };
        this.titleService.setTitle(title);
        const exitMenu = this.ActiveMenus.find(info => info.title === title);
        if (exitMenu) {
          // 如果存在不添加，当前表示选中
          this.ActiveMenus.forEach(p => p.select = p.title === title);
          return;
        } else {
          this.ActiveMenus.push(menu);
        }
        this.menus.emit(this.ActiveMenus);
      });
  }
  // 动态控制菜单栏伸缩
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }
  // 默认展开指定菜单
  unfoldActiveLink(route) {
    if (this.RightsMenus.length < 1) { return; }
    for (let i = 0; i < this.RightsMenus.length; i++) {
      if (route.url.search(this.RightsMenus[i].link) !== -1) {
        this.RightsMenus[i].select = true;
        for (let j = 0; j < this.RightsMenus[i].childs.length; j++) {
          if (route.url === this.RightsMenus[i].childs[j].link) {
            this.RightsMenus[i].childs[j].select = true;
          }
        }
      }
    }
  }
}
