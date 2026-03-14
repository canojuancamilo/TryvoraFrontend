// src/app/core/directives/has-permission.directive.ts
import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit {
  private requiredPermissions: string[] = [];
  private mode: 'all' | 'any' = 'any';
  private isHidden = true;
  
  @Input() set appHasPermission(value: string | string[]) {
    this.requiredPermissions = Array.isArray(value) ? value : [value];
  }
  
  @Input() set appHasPermissionMode(mode: 'all' | 'any') {
    this.mode = mode;
  }
  
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}
  
  ngOnInit() {
    this.updateView();
  }
  
  private updateView() {
    const hasPermission = this.mode === 'all'
      ? this.authService.canAll(this.requiredPermissions)
      : this.authService.canAny(this.requiredPermissions);
    
    if (hasPermission && this.isHidden) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isHidden = false;
    } else if (!hasPermission && !this.isHidden) {
      this.viewContainer.clear();
      this.isHidden = true;
    }
  }
}