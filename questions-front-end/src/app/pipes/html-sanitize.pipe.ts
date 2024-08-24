import { Pipe, PipeTransform } from '@angular/core';
import { XmlParserService } from '../services/xml-parser.service';

@Pipe({
  name: 'sanitize',
  standalone: true
})
export class HtmlSanitizePipe implements PipeTransform {

  constructor(private parser: XmlParserService) {
  }
  transform(value: unknown, ...args: unknown[]): unknown {
    return this.parser.byPassHTMLSecurity(value);
  }

}
