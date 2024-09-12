import { Component, AfterViewInit, ViewChild, OnInit, EventEmitter, Output, Input } from '@angular/core';
import EditorJS, { BlockToolConstructable, ToolConstructable } from '@editorjs/editorjs';
import Paragraph from '@editorjs/paragraph';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Table from '@editorjs/table';
import Delimiter from '@editorjs/delimiter';
import Checklist from '@editorjs/checklist'
import CodeTool from '@editorjs/code';
import { AnswerField } from '../../plugins/answer.field';
import { RandomRange } from '../../plugins/random-range';
import { ArrayVariable } from '../../plugins/arrays-variable';
import TestTune from '../../plugins/test-tune';


@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.css'
})
export class EditorComponent implements AfterViewInit, OnInit {
  @Output()
  public event = new EventEmitter();

  @Input()
  public tools: any[] = [];
  @Input()
  public index: any;
  @Input()
  public show: any = 'paragraph';

  public editor: EditorJS | undefined;

  ngOnInit() {
    console.log('Tools:', this.tools);
    console.log('Index:', this.index);
  }

  public getClass(tool: any):any{
    if(tool === 'header'){
      return Header;
    } else if(tool === 'list'){
      return List;
    } else if(tool === 'table'){
      return Table;
    } else if(tool === 'delimiter'){
      return Delimiter;
    } else if(tool === 'checklist'){
      return Checklist;
    } else if(tool === 'code'){
      return CodeTool;
    } else if(tool === 'answer'){
      return AnswerField;
    } else if(tool === 'range'){
      return RandomRange;
    } else if(tool === 'array'){
      return ArrayVariable;
    } else if(tool === 'test'){
      return TestTune;
    }
  }

  ngAfterViewInit(): void {
    // convert each tool to a block tool
    let toolkit : any = {};

    this.tools.forEach((tool: any) => {
      toolkit[tool] = {
        class: this.getClass(tool) as unknown as BlockToolConstructable,
        inlineToolbar: true
      };
    });

    this.editor = new EditorJS({
      holder: `editorjs${this.index}`,
      inlineToolbar: true,
      autofocus: true,
      minHeight: 0,
      tools: {
        paragraph: {
          class: Paragraph,
          tunes: ['test']
        },
        test: {
          class: TestTune as unknown as ToolConstructable,
        }
      },

      defaultBlock: this.show
    });
      
  }

  public async save() {
    const output = await this.editor?.save();
    const blocks : any[] = output?.blocks || [];
 //   console.log('Editor.js Output:', output);
    let html = '';
    let scripts = '';
    let answerCount: number = 0;
    blocks.forEach((block: any, index: number, array: any[]) => {
      console.log('Block:', block);
      if(block.type === 'header'){
        html += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
      } else if(block.type === 'paragraph'){
        html += `<p>${block.data.text}</p>`;
      } else if(block.type === 'list'){
        html += `<${block.data.style === 'ordered' ? 'o' : 'u'}l>`;
        block.data.items.forEach((item: string) => {
          html += `<li>${item}</li>`;
        });
        html += `</${block.data.style === 'ordered' ? 'o' : 'u'}l>`;
      } else if(block.type === 'table'){
        html += `<table>`;
        block.data.content.forEach((row: any) => {
          html += `<tr>`;
          row.forEach((cell: any) => {
            html += `<td>${cell}</td>`;
          });
          html += `</tr>`;
        });
        html += `</table>`;
      } else if(block.type === 'delimiter'){
        html += `<hr>`;
      } else if(block.type === 'checklist'){
        // make radio buttons if more than one is checked else make a checkbox
        html += `<ul>`;
        let checked : boolean = block.data.items.filter((item: any) => item.checked).length > 1;
        block.data.items.forEach((item: any) => {
          html += `<li>`;
          if(item.checked){
            html += `<input type=${checked ? 'radio' : 'checkbox'} checked>`;
          } else {
            html += `<input type=${checked ? 'radio' : 'checkbox'}>`;
          }
          html += `${item.text}</li>`;
        });
        html += `</ul>`;
      } else if(block.type === 'code'){
        scripts += `<script>${block.data.code}</script>`;
      } else if(block.type === 'answer'){
        // check if position of the last closing tag </*> in the html
        let position = html.lastIndexOf('</');
        let str = block.data.text;
        // replace {_} with {_0}, {_1}, {_2}, ...
        str = str.replace(/{_}/g, `{_${answerCount++}}`);
        html = html.substring(0, position) + str + html.substring(position);
      }
    });
    return {html: html, scripts: scripts};
  }
}
