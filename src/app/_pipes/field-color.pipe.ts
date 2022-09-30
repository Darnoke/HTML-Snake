import { Pipe, PipeTransform } from '@angular/core';
import { FieldType } from '../_enum/field-type';

@Pipe({
  name: 'fieldColor'
})
export class FieldColorPipe implements PipeTransform {

  colors: string[] = ['#565656', '#048f4a', '#069c06', '#b51626']

  transform(value: FieldType): string {
    return this.colors[value];
  }

}
