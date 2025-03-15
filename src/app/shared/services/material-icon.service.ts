import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MaterialIcon } from "../enums/material-icon";
import { Injectable } from '@angular/core';
@Injectable({
    providedIn:'root',
})
export class MaterialIconService{
    constructor(
        private matIconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
    ){}

    registerIcon():void{
        this.load(MaterialIcon, '/assets/material-icons');
    }

    private load(icons: typeof MaterialIcon, url:string ):void{
        Object.keys(icons).forEach((icon)=>{
            this.matIconRegistry.addSvgIcon(
                icon,
                this.sanitizer.bypassSecurityTrustResourceUrl(
                    `${url}/${icon}.svg`
                )
            )
        })
    }
}