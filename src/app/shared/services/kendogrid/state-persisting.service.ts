import { GridSettings } from '../../models/grid-settings.interface';
import { Injectable } from '@angular/core';
import { State } from '@progress/kendo-data-query';

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
        if (typeof value === "object" && value !== null) {
            if (seen.has(value)) {
                return;
            }
            seen.add(value);
        }
        return value;
    };
};

@Injectable()
export class StatePersistingService {
    public get<T>(token: string): T {
        const settings = localStorage.getItem(token);
        return settings ? JSON.parse(settings) : settings;
    }

    public set<T>(token: string, gridConfig: GridSettings): void {
        localStorage.setItem(token, JSON.stringify(gridConfig, getCircularReplacer()));
    }
}
