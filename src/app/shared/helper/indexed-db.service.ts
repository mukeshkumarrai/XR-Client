/*
@Name: IndexedDbService
@Who: Adarsh Singh
@When: 27-Nov-2023
@Why: ROST-15160
@What: use timezone in indexDB
*/

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private dbName = 'commonDB';
  private storeName = 'timeZone';

  constructor() {}

  async saveData(data: any[]) {
    indexedDB.deleteDatabase(this.dbName)
    const db = await this.openDb();
    const tx = db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);

    for (const item of data) {
      store.add(item);
    }

    await tx.oncomplete;
  }

//   async getAllData() {
//     const db = await this.openDb();
//     const tx = db.transaction(this.storeName, 'readonly');
//     const store = tx.objectStore(this.storeName);
//     const data = await store.getAll();

//     return data;
//   }

getAllData(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const tx = db.transaction(this.storeName, 'readonly');
        const store = tx.objectStore(this.storeName);
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

  private async openDb() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = (event) => {
        reject('Error opening database');
      };

      request.onsuccess = (event) => {
        const db = (event.target as any).result;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as any).result;

        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, {autoIncrement: true });
        }
      };
    });
  }
  public async intsetDb(dbName,TableName) {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);

      request.onerror = (event) => {
        reject('Error opening database');
      };
      request.onupgradeneeded = (event) => {
        // Create the object store if it doesn't exist
        const db = (event.target as any).result;
        if (!db.objectStoreNames.contains(TableName)) {
          db.createObjectStore(TableName, { keyPath: 'id', autoIncrement: true });
        }
      };
      request.onsuccess = (event) => {
        const db = (event.target as any).result;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as any).result;

        if (!db.objectStoreNames.contains(TableName)) {
          db.createObjectStore(TableName, {autoIncrement: true });
        }
      };
    });
  }
  async doesDatabaseExist(dbName): Promise<boolean> {
    try {
      // Attempt to open the database
      const db = await this.openDatabase(dbName);
      // If successful, close the database
      db.close();
      return true;
    } catch (error) {
      // If an error occurs, the database likely does not exist
      return false;
    }
  }
  private openDatabase(dbName): Promise<IDBDatabase> {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = window.indexedDB.open(dbName);

      request.onerror = (event) => {
        console.error('Error opening indexedDB:', event);
        reject(event);
      };

      request.onsuccess = (event) => {
        const db = (event.target as any).result;
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        // Do nothing during upgrade, just open the database
        const db = (event.target as any).result;
        db.close();
      };
    });
  }
  getTableData(dbName,tableNmae): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1);

      request.onsuccess = (event: any) => {
        const db = event.target.result;
        const tx = db.transaction(tableNmae, 'readonly');
        const store = tx.objectStore(tableNmae);
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
  async SetData(dbName,TableName,data: any[]) {
    indexedDB.deleteDatabase(dbName)

    const db = await this.intsetDb(dbName,TableName);
    const tx = db.transaction(TableName, 'readwrite');
    const store = tx.objectStore(TableName);

    for (const item of data) {
      store.add(item);
    }
    await tx.oncomplete;
  }
  async SetJobDetails(dbName,TableName,data: any) {
    indexedDB.deleteDatabase(dbName)

    const db = await this.intsetDb(dbName,TableName);
    const tx = db.transaction(TableName, 'readwrite');
    const store = tx.objectStore(TableName);

    for (const item of data) {
      store.add(item);
    }
    await tx.oncomplete;
  }
  async CreateTable(tableName): Promise<void>{
    const db = await this.openDatabase('jobdetails');
    db.createObjectStore(tableName, { keyPath: 'id', autoIncrement: true });
    db.close();
  }

}
