import { Pipe, PipeTransform } from '@angular/core';
import { XmlParserService } from '../services/xml-parser.service';

@Pipe({
  name: 'input',
  standalone: true
})
export class InputPipe implements PipeTransform {

  constructor(private xmlService: XmlParserService) {
  }

  transform(value: unknown, ...args: unknown[]): unknown {
    return this.xmlService.injectInputFields(value);
  }

}
