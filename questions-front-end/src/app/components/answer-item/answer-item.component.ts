import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InputPipe } from "../../pipes/input.pipe";

@Component({
    selector: 'app-answer-item',
    standalone: true,
    templateUrl: './answer-item.component.html',
    styleUrl: './answer-item.component.css',
    imports: [InputPipe]
})
export class AnswerItemComponent {

  @Input()
  public element: any;

  @Output() 
  public event = new EventEmitter();

  public getNodeValue(nodeName: string): any {
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
