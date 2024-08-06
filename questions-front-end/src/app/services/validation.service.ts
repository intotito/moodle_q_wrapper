import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private _structure: any = {
    'partindex': { nested: true, cdata: false, html: false },
    'placeholder': { nested: true, cdata: false, html: false },
    'answermark': { nested: true, cdata: false, html: false },
    'answertype': { nested: true, cdata: false, html: false },
    'numbox': { nested: true, cdata: false, html: false },
    'vars1': { nested: true, cdata: true, html: false },
    'vars2': { nested: true, cdata: true, html: false },
    'correctness': { nested: true, cdata: true, html: false },
    'unitpenalty': { nested: true, cdata: false, html: false },
    'postunit': { nested: true, cdata: false, html: false },
    'ruleid': { nested: true, cdata: false, html: false },
    'otherrule': { nested: true, cdata: false, html: false },
    'subqtext': { nested: true, cdata: true, html: true },
    'feedback': { nested: true, cdata: true, html: true },
    'correctfeedback': { nested: true, cdata: true, html: true },
    'partiallycorrectfeedback': { nested: true, cdata: true, html: true },
    'incorrectfeedback': { nested: true, cdata: true, html: true }
  }
  constructor() { }

  public addAnswer(xmlDocument: any): any[] {
    const report : any[] = [];
    let answers: any[] = xmlDocument.getElementsByTagName('answers');
    console.log('Adding answer:', answers);

    let newAnswer = xmlDocument.createElement('answers');
    // loop over key and value of _structure
    for (const [key, value] of Object.entries<{ nested: boolean, cdata: boolean, html: boolean }>(this._structure)) {
      let element = xmlDocument.createElement(key);
      if (value.html) {
        element.setAttribute('format', 'html');
      }
      let innerElement = xmlDocument.createElement('text');
      const textValue = this.getDefaultValue(key, answers, report);
      if (value.cdata) {
        innerElement.appendChild(xmlDocument.createCDATASection(textValue));
      } else {
        innerElement.textContent = textValue;
      }
      element.appendChild(innerElement);
      newAnswer.appendChild(element);
    }

    if(answers[answers.length - 1].nextSibling == null){
      xmlDocument.getElementsByTagName('question')[0].append(newAnswer, answers[answers.length - 1]);
    } else {
      xmlDocument.getElementsByTagName('question')[0].insertBefore(newAnswer, answers[answers.length - 1].nextSibling);
    }

    let newAnswers: any[] = [];
    var question = xmlDocument.firstElementChild?.firstElementChild;
    question?.childNodes.forEach((node: { nodeType: number; nodeName: string; }) => {
      if (node.nodeType == 1) {
        if (node.nodeName == 'answers') {
          newAnswers.push(node);
        }
      }
    });
    console.log('New answers:', newAnswers);

    
    return newAnswers;

  }

  private getDefaultValue(key: any, answers: any[], report: any[]): any {
    if(key == 'partindex'){
      return answers.length;
    } else if (key == 'placeholder'){
      let suggestions = this.getSuggestion(key, answers).sort();
      let value = suggestions[suggestions.length - 1];
      let lastChar = value.charAt(value.length - 1);
      let increment = String.fromCharCode(lastChar.charCodeAt(0) + 1);
      let newValue = value.slice(0, -1) + increment;
      return newValue;
    }else if(key == 'answermark' || key == 'unitpenalty'){
      let suggestions = this.getSuggestion(key, answers);
      console.log('Suggestons:', suggestions);
      let average = suggestions.reduce((a: any, b: any) => Number(a) + Number(b), 0) / suggestions.length;
      return average;
    } else if(key == 'answertype'){
      let suggestions = this.getSuggestion(key, answers);
      let types = suggestions.filter((value: any, index: number, self: string | any[]) => self.indexOf(value) === index);
      if (types.length > 1) {
        report.push('Multiple answer types detected');
      }
      return types[0];
    } else if(key == 'correctfeedback' || key == 'partiallycorrectfeedback' || key == 'incorrectfeedback'){
      let suggestions = this.getSuggestion(key, answers);
      // select any non empty feedback and report warning if multiple feedbacks are present
      let feedbacks = suggestions.filter((value: any) => value.length > 0);
      if (feedbacks.length > 1) {
        report.push('Multiple feedbacks detected');
      }
      return feedbacks[0];
    }
    else {
      return '';
    }
  }


  private getSuggestion(key: any, answers: any[]): any {
    let suggestions: any[] = [];
    for (let i = 0; i < answers.length; i++) {
      let answer = answers[i];
      let suggestion = answer.getElementsByTagName(key)[0];
      suggestions.push(suggestion.textContent.trim());
    }
 //   console.log('Suggestions:', suggestions);
    return suggestions;
  }

  public validateDocument(document: any): boolean {
    return true;
  }
}
