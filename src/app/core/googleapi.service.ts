//by maneesh create servic for google api url and remove url index.html
import { Injectable } from '@angular/core';
 // <!-- <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAX0SSqOIIsjEzIiex9leWz5e-vrr8lyHY&libraries=places&language=en&callback=Function.prototype"></script> -->
 const url ="https://maps.googleapis.com/maps/api/js?key=AIzaSyAX0SSqOIIsjEzIiex9leWz5e-vrr8lyHY&libraries=places&language=en&loading=async&callback=Function.prototype";
@Injectable({
  providedIn: 'root'
})
// export class GoogleapiService {

  export class GoogleapiService {
    private static promise;
    public static load() {
      // First time 'load' is called?
      if (!GoogleapiService.promise) {
        // Make promise to load
        GoogleapiService.promise = new Promise((resolve) => {  
          // Set callback for when google maps is loaded.
          window['__onGoogleMapsLoaded'] = (ev) => {
            // console.log('google maps api loaded');
            resolve(window['google']['maps']);
          };
  
          // Add script tag to load google maps, which then triggers the callback, which resolves the promise with windows.google.maps.
          // console.log('loading..');
          let node = document.createElement('script');
          node.src = url;
          // console.log('node.src',node.src);
          
          node.type = 'text/javascript';
          document.getElementsByTagName('head')[0].appendChild(node);
        });
      }
  
      // Always return promise. When 'load' is called many times, the promise is already resolved.
      return GoogleapiService.promise;
    }
  }
