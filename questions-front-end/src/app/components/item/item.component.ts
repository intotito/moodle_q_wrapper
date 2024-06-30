import { Component, Input, Output } from '@angular/core';

@Component({
  selector: 'app-item',
  standalone: true,
  imports: [],
  templateUrl: './item.component.html',
  styleUrl: './item.component.css'
})
export class ItemComponent {
  @Input()
  public element: any;

  @Output()
  public event: any;

  constructor(){

  }
  
  public inputValueChanged(event: any){

  }
}
