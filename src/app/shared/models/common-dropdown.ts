export interface DRP_CONFIG {
  API: string; // API end point
  MANAGE: string; // redirect URL
  BINDBY: string; // name of key which we want to bind
  REQUIRED: boolean; // True and false
  DISABLED: boolean; // True and false
  IMG_SHOW:boolean;// IMAGE PROFILE
  FIND_BY_INDEX: string; // passing value for find selected data like, ID, USERID, JOBID
  IMG_BIND_VALUE:string //Image value key
  PLACEHOLDER: string; // which we want to show label
  SHORTNAME_SHOW: boolean; // short name with color
  EXTRA_BIND_VALUE:string; // multiplrr bind value
  SINGLE_SELECETION:boolean; // use single or multiple selection
  AT_LEAST_ONE_IS_NOT_REMOVABLE:boolean;  // at least one should not be removable
  ONLOAD_ERROR_SHOW?:boolean //when by default show error of required (currently it is on push EOH only)
 
}

export interface DRP_CONFIG_CLIENT_SIDE {
  LIST_ARRAY_DATA: [Object]; // API end point
  MANAGE: string; // redirect URL
  BINDBY: string; // name of key which we want to bind
  REQUIRED: boolean; // True and false
  DISABLED: boolean; // True and false
  PLACEHOLDER: string; // which we want to show label
  SHORTNAME_SHOW: boolean; // short name with color
  EXTRA_BIND_VALUE:string; // multiplrr bind value
  SINGLE_SELECETION:boolean; // use single or multiple selection
  AT_LEAST_ONE_IS_NOT_REMOVABLE:boolean;  // at least one should not be removable
}