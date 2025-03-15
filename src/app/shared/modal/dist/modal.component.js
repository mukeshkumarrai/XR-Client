"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.ModalComponent = void 0;
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var ModalComponent = /** @class */ (function () {
    function ModalComponent(dialogRef, data) {
        this.dialogRef = dialogRef;
        this.data = data;
    }
    ModalComponent.prototype.onNoClick = function () {
        this.dialogRef.close();
    };
    ModalComponent.prototype.ngOnInit = function () {
    };
    ModalComponent = __decorate([
        core_1.Component({
            selector: 'app-modal',
            templateUrl: './modal.component.html',
            styleUrls: ['./modal.component.scss']
        }),
        __param(1, core_1.Optional()), __param(1, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], ModalComponent);
    return ModalComponent;
}());
exports.ModalComponent = ModalComponent;
