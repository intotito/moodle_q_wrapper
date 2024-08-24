import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  ngOnInit() {
    // set element with id sidebarToggle to display none
    if(document){
      let element = document.getElementById('sidebarToggle');
      if(element){
        element.style.display = 'none';
      }
    }
  }
}
