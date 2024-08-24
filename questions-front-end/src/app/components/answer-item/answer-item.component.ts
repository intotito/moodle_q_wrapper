import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { InputPipe } from "../../pipes/input.pipe";
declare var MathJax: any;  // Declare MathJax if included via CDN

@Component({
    selector: 'app-answer-item',
    standalone: true,
    templateUrl: './answer-item.component.html',
    styleUrl: './answer-item.component.css',
    imports: [InputPipe]
})
export class AnswerItemComponent {

  @ViewChild('htmlElement') 
  htmlElement: ElementRef | undefined;

  @Input()
  public element: any;

  @Output() 
  public event = new EventEmitter();


  ngAfterViewInit() {
    this.renderMath();
  }

  renderMath() {
    if (MathJax) {
      MathJax.typesetPromise([this.htmlElement?.nativeElement]);
    }
  }

  public getNodeValue(nodeName: string): any {
    console.log('getNodeValue:', nodeName);
    return this.element.getElementsByTagName(nodeName).item(0).firstElementChild.textContent.trim();
  }

  public getIndex(): number {
    const index = this.element.getElementsByTagName('partindex').item(0).firstElementChild.textContent.trim();
    return index;
  }

  public inputValueChanged($event: Event) {
    console.log('Input value changed:', $event);
    const target = $event.target as HTMLInputElement;
    const evnt : any = {
      index: this.getIndex(),
      name: target.name, 
      value: target.value,
    }
    this.event.emit(evnt);
  }
}
