/*
   @Type: File, <html>
   @Name: custom.date-format.ts
   @Who: Adarsh singh
   @When: 21-Mar-2023
   @Why: EWM-10688
   @What: for display date in different different format which user has selected form look and feel
*/

import { Directive, Inject, Input, Optional } from "@angular/core";
import { NgControl } from "@angular/forms";
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { CustomDateFormat, DateDisplay, DateParse } from "./custom-date-format";
import { MomentDateAdapter } from "@angular/material-moment-adapter";

@Directive({
  selector: "[datePickerFormat]",
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter
    },
    {
      provide: MAT_DATE_FORMATS,
      useClass: CustomDateFormat
    }
  ]
})
export class DatePickerFormatDirective {
  @Input() public configDateParse: DateParse;
  @Input() public configDateDisplay: DateDisplay;

  @Input("datePickerFormat")
  set datePickerFormat(format: string) {
    if (this.configDateParse) {
      this.matDateFormat.updateDateFormat(
        this.configDateParse,
        this.configDateDisplay
      );
    } else {
      this.matDateFormat.updateDateFormat({ dateInput: format });
    }

    const value = this.ngControl.value;
    this.ngControl.valueAccessor?.writeValue(value);
  }

  constructor(
    @Inject(MAT_DATE_FORMATS) public matDateFormat: CustomDateFormat,
    @Optional() private ngControl: NgControl
  ) {}
}
