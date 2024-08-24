import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestService {
  private origin: string;
  constructor(private httpClient: HttpClient) {
    this.origin = window.location.origin;
   }

  public getQuestions() {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    return this.httpClient.get(`${this.origin}/api/questions`, { headers: headers });
  }

  public getOrigin(): string {
    return this.origin;
  }

  public saveQuestion(question: any) {
    // convert quesiton to xmlstring
    const xml = new XMLSerializer().serializeToString(question);
    // create headers with content-type application/xml
    console.log('XML:', question);
    const headers = new HttpHeaders({
      'Content-Type': 'application/xml',  // Set Content-Type to application/xml
      'Accept': 'application/xml'  // Optionally, set Accept to application/xml
    });

    console.log('headers:', headers);
    this.httpClient.post(`${this.origin}/api/questions/create`, xml, { headers: headers }).subscribe((data) => {
      console.log('Data:', data);
    });
  }
}
