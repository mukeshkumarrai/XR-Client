import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { HighlightDirective } from "./highligh.directive";

@NgModule({
  declarations: [HighlightDirective],
  imports: [CommonModule],
  exports: [HighlightDirective]
})
export class HighlightModule {}
