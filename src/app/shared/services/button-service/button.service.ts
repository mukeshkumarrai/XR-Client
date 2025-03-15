import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ButtonConfig,ClientBtnDetails } from '../../../modules/EWM.core/client/client-detail/share-client-eoh/share-client-model';

@Injectable({
  providedIn: 'root'
})
export class ButtonService {
  
  private buttonConfigs: { [key in ClientBtnDetails]: ButtonConfig } = {
    [ClientBtnDetails.CANCEL]: { label: 'Cancel', visible: false },
    [ClientBtnDetails.SAVE_AND_NEXT]: { label: 'Save & Next', visible: false },
    [ClientBtnDetails.SHARE_CLIENT]: { label: 'Share Client', visible: true },
    [ClientBtnDetails.BACK]: { label: 'Back', visible: true },
  };

  // Store button visibility for each component
  private componentButtonConfigs: { [componentId: string]: Partial<{ [key in ClientBtnDetails]: boolean }> } = {};

  private buttonVisibilitySubject = new BehaviorSubject(this.buttonConfigs);
  buttonVisibility$ = this.buttonVisibilitySubject.asObservable();

  // Method to set button visibility based on the provided configuration
  setButtonVisibility(componentId: string,config: Partial<{ [key in ClientBtnDetails]: boolean }>) {
    
    // Initialize component config if it doesn't exist
    if (!this.componentButtonConfigs[componentId]) {
      this.componentButtonConfigs[componentId] = {};
    }

    // Update the button visibility for the specific component
    for (const key in config) {
      if (config.hasOwnProperty(key)) {
        this.componentButtonConfigs[componentId][key as ClientBtnDetails] = config[key as ClientBtnDetails] || false;
      }
    }

    // Update the main buttonConfigs based on the component's config
    this.updateButtonConfigs();
    // for (const key in config) {
    //   if (config.hasOwnProperty(key)) {
    //     this.buttonConfigs[key as ClientBtnDetails].visible = config[key as ClientBtnDetails] || false;
    //   }
    // }
    // this.buttonVisibilitySubject.next(this.buttonConfigs);
  }

  // Method to get button visibility for a specific component
  getButtonVisibility(componentId: string): { [key in ClientBtnDetails]: ButtonConfig } {
    const componentConfig = this.componentButtonConfigs[componentId] || {};
    const updatedConfigs = { ...this.buttonConfigs };

    for (const key in componentConfig) {
      if (componentConfig.hasOwnProperty(key)) {
        updatedConfigs[key as ClientBtnDetails].visible = componentConfig[key as ClientBtnDetails] || false;
      }
    }

    return updatedConfigs;
  }

  private updateButtonConfigs() {
    // Notify all subscribers with the updated button configurations
    this.buttonVisibilitySubject.next(this.getButtonVisibility('default'));
  }
}
