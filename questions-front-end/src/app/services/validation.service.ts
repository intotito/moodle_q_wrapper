import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  private _question_structure: any = {
    'name': { nested: true, cdata: false, html: false, nullable: false, string: true },
    'questiontext': { nested: true, cdata: true, html: true, nullable: true, string: true },
    'generalfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true },
    'defaultgrade': { nested: false, cdata: false, html: false, nullable: false, string: false },
    'penalty': { nested: false, cdata: false, html: false, nullable: false, string: false },
    'hidden': { nested: false, cdata: false, html: false, nullable: false, string: false },
    'idnumber': { nested: false, cdata: false, html: false, nullable: true, string: true },
    'correctfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true },
    'partiallycorrectfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true },
    'incorrectfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true },
    'shownumcorrect': { nested: false, cdata: false, html: false, nullable: true, string: true },
    'varsrandom': { nested: true, cdata: true, html: false, nullable: true, string: true },
    'varsglobal': { nested: true, cdata: true, html: false, nullable: true, string: true },
    'answernumbering': { nested: true, cdata: false, html: false, nullable: true, string: true },
    'hint': { nested: true, cdata: false, html: true, nullable: true, string: true },
  };

  private _answer_structure: any = {
    'partindex': { nested: true, cdata: false, html: false, nullable: false, string: false },
    'placeholder': { nested: true, cdata: false, html: false, nullable: true, string: true },
    'answermark': { nested: true, cdata: false, html: false, nullable: false, string: false },
    'answertype': { nested: true, cdata: false, html: false, nullable: false, string: false },
    'numbox': { nested: true, cdata: false, html: false, nullable: false, string: false },
    'vars1': { nested: true, cdata: true, html: false, nullable: true, string: true },
    'vars2': { nested: true, cdata: true, html: false, nullable: true, string: true },
    'correctness': { nested: true, cdata: true, html: false, nullable: true, string: true },
    'unitpenalty': { nested: true, cdata: false, html: false, nullable: false, string: false },
    'postunit': { nested: true, cdata: false, html: false, nullable: true, string: true },
    'ruleid': { nested: true, cdata: false, html: false, nullable: true, string: true },
    'otherrule': { nested: true, cdata: false, html: false, nullable: true, string: true },
    'subqtext': { nested: true, cdata: true, html: true, nullable: true, string: true },
    'feedback': { nested: true, cdata: true, html: true, nullable: true, string: true },
    'correctfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true },
    'partiallycorrectfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true },
    'incorrectfeedback': { nested: true, cdata: true, html: true, nullable: true, string: true },
    'answer': { nested: true, cdata: true, html: false, nullable: false, string: true },
  }
  constructor() { }

  public addAnswer(xmlDocument: any): any[] {
    const report: any[] = [];
    let answers: any[] = xmlDocument.getElementsByTagName('answers');
    console.log('Adding answer:', answers);

    let newAnswer = xmlDocument.createElement('answers');
    // loop over key and value of _structure
    for (const [key, value] of Object.entries<{ nested: boolean, cdata: boolean, html: boolean }>(this._answer_structure)) {
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

    if (answers[answers.length - 1].nextSibling == null) {
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
    if (key == 'partindex') {
      return answers.length;
    } else if (key == 'placeholder') {
      let suggestions = this.getSuggestion(key, answers).sort();
      let value = suggestions[suggestions.length - 1];
      let lastChar = value.charAt(value.length - 1);
      let increment = String.fromCharCode(lastChar.charCodeAt(0) + 1);
      let newValue = value.slice(0, -1) + increment;
      return newValue;
    } else if (key == 'answermark' || key == 'unitpenalty') {
      let suggestions = this.getSuggestion(key, answers);
      console.log('Suggestons:', suggestions);
      let average = suggestions.reduce((a: any, b: any) => Number(a) + Number(b), 0) / suggestions.length;
      return average;
    } else if (key == 'answertype') {
      let suggestions = this.getSuggestion(key, answers);
      let types = suggestions.filter((value: any, index: number, self: string | any[]) => self.indexOf(value) === index);
      if (types.length > 1) {
        report.push('Multiple answer types detected');
      }
      return types[0];
    } else if (key == 'correctfeedback' || key == 'partiallycorrectfeedback' || key == 'incorrectfeedback') {
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

  public validateDocument(xmlDoc: any): any {
    // {nested: true, cdata: false, html: false, nullable: false, string: true}
    let report: any[] = [];
    let question = xmlDoc.firstElementChild?.firstElementChild;
    question.childNodes.forEach((node: any) => {
      if (node.nodeType == 1) {
        if (node.nodeName == 'answers') {
          let answer = node.childNodes;
          const badge = `<span span class="col-4 col-md-3 col-lg-2 px-0"><span class="badge bg-secondary">
                  answer-${node.getElementsByTagName('partindex')[0].firstElementChild.textContent.trim()}
                  </span></span> `;
          answer.forEach((answerNode: any) => {
            if(answerNode.nodeType == 1) {
              let nameKey = answerNode.nodeName;
              console.log('NameKey:', nameKey);
              let property = this._answer_structure[nameKey];
              console.log('property:', property);
              let value = property.nested ? answerNode.getElementsByTagName('text')[0].textContent.trim() : answerNode.textContent.trim();
              if (property.cdata == true && value.length > 0) {
                let rp = this.validateCData(value, answerNode);
                rp.summary = badge + rp.summary;
                rp.desc = badge + rp.desc;
                report.push(rp);
              } if (property.html == true && value.length > 0) {
                let rp = this.validateHTML(value, answerNode);
                rp.summary = badge + rp.summary;
                rp.desc = badge + rp.desc;
                report.push(rp);
              } if(property.nullable == false && value.length == 0) {
                report.push({
                  title: answerNode.nodeName,
                  desc: `${badge}Cannot be null. Value not found.`,
                  summary: `${badge}Value not found.`,
                  status: 'danger'
                });
              } if(property.string == false && (value.length > 0 && isNaN(value))) {
                report.push({
                  title: answerNode.nodeName,
                  desc: `${badge}Value is not a number. Must be a valid number.`,
                  summary: `${badge}Value is not a number.`,
                  status: 'danger'
                });
              } 
            }
          });
          
          //         let answerReport = this.validateAnswers(answers);
          //       report.push(answerReport);
        } else {
          let key = node.nodeName;
          let property = this._question_structure[key];
          let value = property.nested ? node.getElementsByTagName('text')[0].textContent.trim() : node.textContent.trim();
          if (property.cdata == true && value.length > 0) {
            report.push(this.validateCData(value, node));
          } if (property.html == true && value.length > 0) {
            report.push(this.validateHTML(value, node));
          } if(property.nullable == false && value.length == 0) {
            report.push({
              title: node.nodeName,
              desc: 'Cannot be null. Value not found.',
              summary: 'Value not found.',
              status: 'danger'
            });
          } if(property.string == false && (value.length > 0 && isNaN(value))) {
            report.push({
              title: node.nodeName,
              desc: 'Value is not a number. Must be a valid number.',
              summary: 'Value is not a number.',
              status: 'danger'
            });
          } if(key == 'defaultgrade') {
            let ans = question.getElementsByTagName('answers');
            let check : boolean = this.validateGrades(Number(value), ans); 
            if(!check){
              report.push({
                title: node.nodeName,
                desc: 'Default grade doesn\'t match.',
                summary: 'Default grade does not match sum of answer marks.',
                status: 'danger'
              });
            }
          }
        }
      }
    });
    // sort report according to status
    report.sort((a: any, b: any) => {
      return a.status.localeCompare(b.status);
    });
    return report;
  }

  private validateGrades(value: number, answers: any): boolean{
    var arr = [].slice.call(answers);
    let sum = arr.reduce((a: number, b: any, index: number) => {
      console.log('A', a, '\nB', b);
      let bMark = Number(b.getElementsByTagName('answermark')[0].textContent.trim());
      return a + bMark;
    }, 0);
    return sum == value;
  }

  private validateHTML(value: any, node: any): any {
    let report: any = {};
    // check if node contains attribute format=html
    if (node.getAttribute('format') == 'html') {
      report = {
        title: node.nodeName,
        desc: 'HTML value for format attribute present.',
        summary: 'HTML format attribute present.',
        status: 'success'
      };
    } else {
      report = {
        title: node.nodeName,
        desc: 'HTML format attribute not found, this could result in malformed data.',
        summary: 'HTML format attribute not found!.',
        status: 'warning'
      };
    }
    return report;
  }

  private validateCData(value: any, node: any): any {
    let report: any = {};
    if (!this.containsCDATA(node)) {
      report = {
        title: node.nodeName,
        desc: 'CDATA Section was not found to be present, this could potentially cause corruption of the xml data.',
        summary: 'CDATA Section not found!.',
        status: 'warning'
      };
    } else {
      report = {
        title: node.nodeName,
        desc: 'CDATA Section was found to be present.',
        summary: 'CDATA Section present.',
        status: 'success'
      };
    }
    return report;
  }

  private containsCDATA(element: any): boolean {
    // Iterate through child nodes
    for (let i = 0; i < element.childNodes.length; i++) {
      const node = element.childNodes[i];
      // Check if the node type is CDATA_SECTION_NODE (nodeType 4)
      if (node.nodeType === Node.CDATA_SECTION_NODE) {
        return true;
      }
    }
    return false;
  }
}
