import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-repo-viewer',
  standalone: true,
  imports: [],
  templateUrl: './repo-viewer.component.html',
  styleUrl: './repo-viewer.component.css'
})
export class RepoViewerComponent {
  public questions: any[] = [];

  constructor(private http: HttpClient, private router: Router, private restService: RestService) {   
    
  }

  ngOnInit(): void {
    this.restService.getQuestions().subscribe((data: any) => {
      this.questions = data.questions;
    });
  }

  public itemClicked(question: any): void {
    console.log('item clicked', question);
    this.router.navigate(['/'], { state: { msg: `${this.restService.getOrigin()}/api/questions/${question.idNumber}`} });
  }
}
