import { Component, Output, EventEmitter } from '@angular/core';
import { SelectEvent, FileInfo } from '@progress/kendo-angular-upload';

export interface ImageInfo {
    src: string;
    width: number;
    height: number;
}


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {

  public uploadSaveUrl = 'saveUrl'; // Has to represent an actual API endpoint.
  public uploadRemoveUrl = 'removeUrl'; // Has to represent an actual API endpoint.

  @Output() public valueChange: EventEmitter<ImageInfo> = new EventEmitter<ImageInfo>();

  public onSelect(ev: SelectEvent): void {
      ev.files.forEach((file: FileInfo) => {
          if (file.rawFile) {
              const reader = new FileReader();

              reader.onloadend = () => {
                  const img = new Image();

                  img.src = <string>reader.result;
                  img.onload = () => {
                      this.valueChange.emit({
                          src: img.src,
                          height: img.height,
                          width: img.width
                      });
                  };
              };

              reader.readAsDataURL(file.rawFile);
          }
      });
  }

  public onRemove(): void {
      this.valueChange.emit(null);
  }

}
