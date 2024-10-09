import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class XmlBuilderService {
  private xmlDocument: XMLDocument | undefined;
  private _question_structure: any = {
    'name': { nested: true, cdata: false, html: false, nullable: false, string: true, symbol: false },
    'questiontext': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: true },
    'generalfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: false },
    'defaultgrade': { nested: false, cdata: false, html: false, nullable: false, string: false, symbol: false },
    'penalty': { nested: false, cdata: false, html: false, nullable: false, string: false, symbol: false },
    'hidden': { nested: false, cdata: false, html: false, nullable: false, string: false, symbol: false },
    'idnumber': { nested: false, cdata: false, html: false, nullable: true, string: true, symbol: false },
    'correctfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: false },
    'partiallycorrectfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: false },
    'incorrectfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: false },
    'shownumcorrect': { nested: false, cdata: false, html: false, nullable: true, string: true, symbol: false },
    'varsrandom': { nested: true, cdata: true, html: false, nullable: true, string: true, symbol: false },
    'varsglobal': { nested: true, cdata: true, html: false, nullable: true, string: true, symbol: false },
    'answernumbering': { nested: true, cdata: false, html: false, nullable: true, string: true, symbol: false },
    'hint': { nested: true, cdata: false, html: true, nullable: true, string: true, symbol: false },
  };

  private _answer_structure: any = {
    'partindex': { nested: true, cdata: false, html: false, nullable: false, string: false, symbol: false },
    'placeholder': { nested: true, cdata: false, html: false, nullable: true, string: true, symbol: false },
    'answermark': { nested: true, cdata: false, html: false, nullable: false, string: false, symbol: false },
    'answertype': { nested: true, cdata: false, html: false, nullable: false, string: false, symbol: false },
    'numbox': { nested: true, cdata: false, html: false, nullable: false, string: false, symbol: false },
    'vars1': { nested: true, cdata: true, html: false, nullable: true, string: true, symbol: false },
    'answer': { nested: true, cdata: true, html: false, nullable: false, string: true, symbol: false },
    'vars2': { nested: true, cdata: true, html: false, nullable: true, string: true, symbol: false },
    'correctness': { nested: true, cdata: true, html: false, nullable: true, string: true, symbol: false },
    'unitpenalty': { nested: true, cdata: false, html: false, nullable: false, string: false, symbol: false },
    'postunit': { nested: true, cdata: false, html: false, nullable: true, string: true, symbol: false },
    'ruleid': { nested: true, cdata: false, html: false, nullable: true, string: true, symbol: false },
    'otherrule': { nested: true, cdata: false, html: false, nullable: true, string: true, symbol: false },
    'subqtext': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: true },
    'feedback': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: false },
    'correctfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: false },
    'partiallycorrectfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: false },
    'incorrectfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true, symbol: false },
  }

  public setPartElement(tagName: string, value: string): void{
    let definition = this._answer_structure[tagName];
    if(!this.xmlDocument){
      return;
    }
    let answers: Element[] = Array.from(this.xmlDocument.documentElement.getElementsByTagName('answers'));
    if(!definition){
      console.log('Invalid tag name');
      return;
    } else {
      let element = this.xmlDocument?.documentElement.getElementsByTagName(tagName)[0];
      if(definition.nested && element){
        element.getElementsByTagName('text')[0].textContent = value;
      } else if(element) {
        element.textContent = value;
      }
    }
  }

  public setElement(tagName: string, value: string): void{
    let definition = this._question_structure[tagName];
    if(!definition){
      console.log('Invalid tag name');
      return;
    } else {
      let element = this.xmlDocument?.documentElement.getElementsByTagName(tagName)[0];
      if(definition.nested && element){
        let text: Element = element.getElementsByTagName('text')[0];
        if(definition.cdata && text){
          text.textContent = '';
          const cdataSection = this.xmlDocument?.createCDATASection(value);
          if (cdataSection) {
            text.appendChild(cdataSection);
          }
        } else {
          text.textContent = value;
        }
      } else if(element) {
        element.textContent = value;
      } else{
        console.log('Element not found');
      }
    }
  }

  public createQuestion(name: string){
    this.xmlDocument = this.getEmptyQuestion();
    this.setElement('name', name); 
  }

  public getEmptyQuestion(ansCount: number = 1): XMLDocument {
    let myDocument: XMLDocument = document.implementation.createDocument(null, 'quiz');
    let question: Element = myDocument.createElement('question');
    question.setAttribute('type', 'formulas');
    myDocument.documentElement.appendChild(question);
    Object.entries(this._question_structure).forEach(([key, value]: [string, any]) => {
      let element: Element = myDocument.createElement(key);
      if (value.html) {
        element.setAttribute('format', 'html');
      }
      if (value.nested) {
        let text: Element = myDocument.createElement('text');
        element.appendChild(text);
        if (value.cdata) {
          text.appendChild(myDocument.createCDATASection(''));
        }
      } else {
        if (value.cdata) {
          element.appendChild(myDocument.createCDATASection(''));
        }
      }
      question.appendChild(element);
    });
    for (let i = 0; i < ansCount; i++) {
      let answer: Element = myDocument.createElement('answers');
      Object.entries(this._answer_structure).forEach(([key, value]: [string, any]) => {
        let element: Element = myDocument.createElement(key);
        if (value.html) {
          element.setAttribute('format', 'html');
        }
        if (value.nested) {
          let text: Element = myDocument.createElement('text');
          element.appendChild(text);
          if (value.cdata) {
            text.appendChild(myDocument.createCDATASection(''));
          }
        } else {
          if (value.cdata) {
            element.appendChild(myDocument.createCDATASection(''));
          }
        }
        answer.appendChild(element);
        // append answer before the last element
      });
      question.insertBefore(answer, question.lastElementChild);
    }
    return myDocument;
  }

  public addPart(): void {
    if(!this.xmlDocument){
      return;
    }
    let question: Element | undefined = this.xmlDocument.documentElement.firstElementChild ?? undefined;
      let answer: Element = this.xmlDocument.createElement('answers');
      Object.entries(this._answer_structure).forEach(([key, value]: [string, any]) => {
        if(!this.xmlDocument){
          return;
        }
        let element: Element = this.xmlDocument.createElement(key);
        if (value.html) {
          element.setAttribute('format', 'html');
        }
        if (value.nested) {
          let text: Element = this.xmlDocument.createElement('text');
          element.appendChild(text);
          if (value.cdata) {
            text.appendChild(this.xmlDocument.createCDATASection(''));
          }
        } else {
          if (value.cdata) {
            element.appendChild(this.xmlDocument.createCDATASection(''));
          }
        }
        answer.appendChild(element);
        // append answer before the last element
      });
      question?.insertBefore(answer, question.lastElementChild);
  }

  public toString(): string {
    console.log('XML:', this.xmlDocument);
    return this.xmlDocument ? new XMLSerializer().serializeToString(this.xmlDocument) : '';
  }
}
