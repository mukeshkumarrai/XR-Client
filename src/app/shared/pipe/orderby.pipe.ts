import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';
@Pipe({
  name: 'orderby'
})
export class OrderbyPipe implements PipeTransform {
  transform(array: any, sortBy: string, order ): any[] {
    const sortOrder = order ? order : 'desc'; // setting default deascending order
   
     return orderBy(array, [sortBy], [sortOrder]);
     }
   }