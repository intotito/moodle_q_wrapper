import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'placeholder',
  standalone: true
})
export class PlaceholderPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
