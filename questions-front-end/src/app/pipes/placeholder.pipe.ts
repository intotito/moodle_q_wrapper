import { Pipe, PipeTransform } from '@angular/core';
import { XmlParserService } from '../services/xml-parser.service';

@Pipe({
  name: 'placeholder',
  standalone: true
})
export class PlaceholderPipe implements PipeTransform {
  constructor(private parser: XmlParserService) {
  }

  transform(value: unknown, ...args: unknown[]): unknown {
    return this.parser.injectTextPlaceholders(value);
  }

}
