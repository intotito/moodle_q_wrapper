import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../services/rest.service';
import { on } from 'node:events';

@Component({
  selector: 'app-repo-viewer',
  standalone: true,
  imports: [],
  templateUrl: './repo-viewer.component.html',
  styleUrl: './repo-viewer.component.css'
})
export class RepoViewerComponent {
  public questions: any[] = [];
  public tag: string = '';
  public nfqLevel: string = '0';

  constructor(private http: HttpClient, private router: Router, private restService: RestService) {

  }

  ngOnInit(): void {
    this.restService.getQuestions().subscribe((data: any) => {
      this.questions = data.questions;
    });
  }

  public itemClicked(question: any): void {
    console.log('item clicked', question);
    this.router.navigate(['/'], { state: { msg: `${this.restService.getOrigin()}/api/questions/${question.idNumber}` } });
  }

  public onTagChanged(event: any): void {
    console.log('tag changed', event.target.value);
    this.tag = event.target.value;
    this.restService.getQuestionsByNfqLevelAndTag(this.tag, this.nfqLevel).subscribe((data: any) => {
      this.questions = data.questions;
    });
  }


  public onNfqLevelChanged(event: any): void {
    console.log('nfq level changed', event.target.value);
    this.nfqLevel = event.target.value === 'all' ? '0' : event.target.value;
    this.restService.getQuestionsByNfqLevelAndTag(this.tag, this.nfqLevel).subscribe((data: any) => {
      this.questions = data.questions;
    });
  }
}
