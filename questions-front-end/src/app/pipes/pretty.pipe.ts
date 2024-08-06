import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pretty',
  standalone: true
})
export class PrettyPipe implements PipeTransform {
  // create a map of the following characters:
  private interestMap: Map<string, string> = new Map([
    ['correctfeedback', 'Feedback - Correct'],
    ['partiallycorrectfeedback', 'Feedback - Partially Correct'],
    ['incorrectfeedback', 'Feedback - Incorrect'],
    ['questiontext', 'Question Text'],
    ['defaultgrade', 'Default Grade'],
    ['penalty', 'Penalty'],
    ['varsglobal', 'Global Variables'],
    ['varsrandom', 'Random Variables'],
    ['answernumbering', 'Numbering'],
    ['none', 'None - [No Numbering]'],
    ['abc', 'abc - [Alphabetical]'],
    ['123', '123 - [Numerical]'],
  ]);
  transform(value: unknown, ...args: unknown[]): unknown {
    // check if value is an index in the map and return the corresponding value
    if (this.interestMap.has(value as string)) {
      return this.interestMap.get(value as string);
    }
    return value as string;
  }

}
