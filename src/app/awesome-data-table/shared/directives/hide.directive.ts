import { Directive, ElementRef, Renderer, Input } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[hide]'
})
export class HideDirective {

  private _prevCondition = false;
  private _displayStyle: string;

  constructor(private _elementRef: ElementRef, private _renderer: Renderer) { }

  @Input()
  set hide(newCondition: boolean) {
    this.initDisplayStyle();

    if (newCondition && (this.isBlank(this._prevCondition) || !this._prevCondition)) {
      this._prevCondition = true;
      this._renderer.setElementStyle(this._elementRef.nativeElement, 'display', 'none');
    } else if (!newCondition && (this.isBlank(this._prevCondition) || this._prevCondition)) {
      this._prevCondition = false;
      this._renderer.setElementStyle(this._elementRef.nativeElement, 'display', this._displayStyle);
    }
  }

  private initDisplayStyle() {
    if (this._displayStyle === undefined) {
      const displayStyle = this._elementRef.nativeElement.style.display;
      if (displayStyle && displayStyle !== 'none') {
        this._displayStyle = displayStyle;
      }
    }
  }

  private isBlank(obj: any): boolean {
    return obj === undefined || obj === null;
  }
}
