import { Directive, ElementRef, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appScrollError]',
  standalone: true
})
export class ScrollErrorDirective implements AfterViewInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private formGroupDirective = inject(FormGroupDirective);
  private submitSubscription?: Subscription;

  ngAfterViewInit() {
    this.submitSubscription = this.formGroupDirective.ngSubmit.subscribe(() => {
      setTimeout(() => {
        this.scrollToFirstError();
      }, 100);
    });
  }

  scrollToFirstError() {
    const formElement = this.elementRef.nativeElement;
    
    const errorElements = Array.from(
      formElement.querySelectorAll('.ng-invalid')
    ) as HTMLElement[];

    const target = errorElements.find(el => {
      if (el.tagName === 'INPUT' || 
          el.tagName === 'TEXTAREA' || 
          el.tagName === 'SELECT') {
        return true;
      }
      
      if (el.classList.contains('ng-select') || 
          el.classList.contains('cp-select') ||
          el.classList.contains('ng-select-container')) {
        return true;
      }
      
      if (el.querySelector('input, textarea, select, .ng-select')) {
        return true;
      }
      
      return false;
    });

    if (!target) {
      return;
    }

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    setTimeout(() => {
      this.focusField(target);
    }, 300);
  }

  private focusField(element: HTMLElement) {
    if (element.tagName === 'INPUT' || 
        element.tagName === 'TEXTAREA' || 
        element.tagName === 'SELECT') {
      element.focus();
      return;
    }

    let input = element.querySelector('input, textarea, select');
    
    if (!input) {
      const ngSelect = element.querySelector('.ng-select');
      if (ngSelect) {
        input = ngSelect.querySelector('input');
      }
    }
    
    if (input) {
      (input as HTMLElement).focus();
      
      const ngSelectComponent = element.querySelector('ng-select');
      if (ngSelectComponent && (ngSelectComponent as any).open) {
        (ngSelectComponent as any).open();
      }
    } else {
      element.focus();
    }
  }

  ngOnDestroy() {
    this.submitSubscription?.unsubscribe();
  }
}