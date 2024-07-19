import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PlaceholderPipe } from "../../pipes/placeholder.pipe";
import { InputPipe } from "../../pipes/input.pipe";

@Component({
    selector: 'app-item',
    standalone: true,
    templateUrl: './item.component.html',
    styleUrl: './item.component.css',
    imports: [PlaceholderPipe, InputPipe]
})
export class ItemComponent {
  private nested: boolean = false;
  
  @Input()
  public element: any;

  @Output() 
  public event = new EventEmitter();

  constructor(){

  }

  ngOnInit(): void {
    this.nested = this.element.getElementsByTagName('text').item(0) != null
  }

  public isNested(): boolean {
    return this.nested;
  }

  public isHtml(): boolean {
    return this.element.getAttributeNode('format') != null && this.element.getAttributeNode('format').value == 'html' ? true : false;
  }

  public getTextContent(): string {
    return this.isNested() ? this.element.getElementsByTagName('text').item(0).textContent : this.element.textContent;
  }

  public getName(): string {
    return this.element.nodeName;
  }
  
  public inputValueChanged(event: any){
    this.event.emit(event);
  }
}
