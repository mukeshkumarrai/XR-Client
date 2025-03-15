// Adarsh singh for storing job details candidate data into index db on 16 Feb 2024 for EWM-14263
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class JobIndexDbService {
  // private dbName = 'commonDB';
  // private storeName = 'timeZone';

  setDataInStorage(dbName: string, data: any) {
    setTimeout(() => {
      if (data) {
        const encodedData = btoa(JSON.stringify(data))
         sessionStorage.setItem(dbName, encodedData);
      }
    }, 500);
  }
  getDataFromStorage(dbName: string) {
    let promise = new Promise<void>((resolve, reject) => {
      let data = sessionStorage.getItem(dbName);
      const decodedData = data ? atob(data) : '';
      resolve(decodedData ? JSON.parse(decodedData) : '');
    });
    return promise;
  }

  async saveData(data: any[], dbName: string, storeName: string) {
    indexedDB.deleteDatabase(dbName)
    const db = await this.openDb(dbName, storeName);
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    for (const item of data) {
      store.add(item);
    }
    await tx.oncomplete;
  }
  // get all data from index db 
  getAllData(dbName: string, storeName: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const tx = db.transaction(storeName, 'readonly');
        const store = tx.objectStore(storeName);
        const getDataRequest = store.getAll();
        getDataRequest.onsuccess = (event: any) => {
          const data = event.target.result;
          resolve(data);
        };
        getDataRequest.onerror = (event: any) => {
          reject('Error retrieving data');
        };
      };
      request.onerror = (event: any) => {
        reject('Error opening database');
      };
    });
  }
  // initialize index db while set or get data from index db 
  private async openDb(dbName: string, storeName: string) {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);
      request.onerror = (event) => {
        reject('Error opening database');
      };
      request.onsuccess = (event) => {
        const db = (event.target as any).result;
        resolve(db);
      };
      request.onupgradeneeded = (event) => {
        const db = (event.target as any).result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { autoIncrement: true });
        }
      };
    });
  }
}