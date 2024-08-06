import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PrettyPipe } from "../../pipes/pretty.pipe";

@Component({
  selector: 'app-dropdown-item',
  standalone: true,
  imports: [PrettyPipe],
  templateUrl: './dropdown-item.component.html',
  styleUrl: './dropdown-item.component.css'
})
export class DropdownItemComponent {
  @Input()
  public element: any;

  @Input()
  public options: any[] | undefined; // array of options

  @Output()
  public event = new EventEmitter();

  ngOnInit(): void {
    console.log('options:', this.options);
  }

  public selectionChanged(event: any): void {
    event.currentTarget.name = 'answernumbering';    
    this.event.emit(event);
  }
}
