import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router: Router){
    
  }
  ngOnInit() {
    // set element with id sidebarToggle to display none
    if(document){
      let element = document.getElementById('sidebarToggle');
      if(element){
        element.style.display = 'none';
      }
    }
  }

  public startWizard(event: any){
    console.log('Starting wizard');
    this.router.navigate(['/wizard']);
  }
}
