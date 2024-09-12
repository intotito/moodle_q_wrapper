import { Component, ViewChild } from '@angular/core';
import { EditorComponent } from "../editor/editor.component";
import EditorJS from '@editorjs/editorjs';
@Component({
  selector: 'app-wizard',
  standalone: true,
  imports: [EditorComponent],
  templateUrl: './wizard.component.html',
  styleUrl: './wizard.component.css'
})
export class WizardComponent {
  public currentStep: number = 1;
  public questionParts: number = 5;

  @ViewChild('editor3')
  editor3!: EditorComponent;
  @ViewChild('editor2')
  editor2!: EditorComponent;
  public stepDefinitions : any[] = [
    {
      title: 'Step 1: Question Name',
      description: `Name of the question. This will be displayed to the user. It should be a short and descriptive name.
                    A question can be named according to the topic, examination type (quiz or test), or other relevant information.`,
      summary: 'Name',
      tip: 'Exponentiation, Expanding Expression, Chemical Titration, etc.',
      icon: 'fa fa-user'
    },
    {
      title: 'Step 2: Question Parts',
      description: `Number of Sub-Questions. Select the number of sub-questions that will be included in the question.`,
      summary: 'Sub-Questions',
      tip: 'From 1 to 5. ',
      icon: 'fa fa-user'
    },
    {
      title: 'Step 3: Random Variables',
      description: `Random variables in the question. These are the variables that will be randomly generated for each question.
                    Random variables can be used to create unique questions for each student.`,
      summary: 'Random Variables',
      tip: 'Use random variables to create unique questions.',
      icon: 'fa fa-user'
    },
    {
      title: 'Step 4: Question Text',
      description: `Text of the question. This is the main body of the question. It should be clear and concise.`,
      summary: 'Question',
      tip: 'Use widgets provided to format the question text.',
      icon: 'fa fa-user'
    }, 
    {
      title: 'Step 5: Answer',
      description: `Answer to the question. This is the correct answer to the question. It should be clear and concise.`,
      summary: 'Answer',
      tip: 'Use widgets provided to format the answer text.',
      icon: 'fa fa-user'
    },     
  ];

  public nextStep(event: any) {
    console.log('Next step');
    this.processStep(this.currentStep++);
//    this.currentStep++;
  }

  public previousStep(event: any) {
    console.log('Previous step');
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  public finish(event: any) {
    console.log('Finish');
    this.currentStep = 1;
  }

  public editorValueChanged(event: any) {
//    console.log('Editor value changed:', event);
    const html = event.html;
//    console.log('HTML:', html);
//    console.log('Scripts:', event.scripts);
  }

  
  private processStep(step: number) {
      switch(step) {
        case 1:
          console.log('Step 1');
          break;
        case 2:
          console.log('Step 2');
          break;
        case 3:
          console.log('Step 3');
          this.editor2.save().then((output: any) => {
            console.log('Output:', output);
          });
          break;
        case 4:
          console.log('Step 4');
          this.editor3.save().then((output: any) => {
            console.log('Output:', output);
          });
          break;
        case 5:
          console.log('Step 5');
          break;
        default:
          console.log('Invalid step');
      }
  }
}
