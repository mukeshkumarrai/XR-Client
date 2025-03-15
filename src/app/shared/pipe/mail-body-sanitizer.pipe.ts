// who:maneesh,as discuss with mukesh signalR,when:08/03/2024
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mailBodySanitizer'
})
export class MailBodySanitizerPipe implements PipeTransform {

  transform(value: string): unknown {  
    const regex1 = /html,\s*div\s*\{[^}]*\}/g;
    const regex2 = /html,\s*body\s*\{[^}]*\}/g;
    value = value?.replace(regex1, '');
    value = value?.replace(regex2, '');
    return  value;
  }

}
