/*
@Type: User.ts, <ts>
@Name: User.ts
@Who: Renu
@When: 26-Oct-2020
@Why: ROST-290
@What: Global data variables for user
*/

export class User {
    id: number;
    email: String;
    password: String;
    FirstName: String;  
    LastName:String
    Token: String;
}

export enum SCREEN_SIZE {
    small,
    large
  }


  export class InviteusersReq {
    FirstName:string;
    LastName: string;
    Email: string;
    UserType: string;
    OrganizationName: string;
    OrganizationAddress: string;
    Password: string;
    Provider: string;
    TenantId: string;
    CorrelationId: string;
    loginType:Number;
    domainSignUp:string
  }

  export class InviteusersRes {
    FirstName:string;
    LastName: string;
    Email: string;
    UserType: string;
    OrganizationName: string;
    OrganizationAddress: string;
    Password: string;
    Provider: string;
    TenantId: string;
    CorrelationId: string;
  }

     
export interface Welcome {​​​​​​​
    FirstName:    string;
    LastName:     string;
    MiddleName:   null;
    Token:        string;
    RefreshToken: string;
    TimeZone:     null;
    Language:     null;
    ProfileUrl:   string;
    Colors:       Colors;
    Urls:         Urls;
    MFA:          number;
    Tenants:      Tenant[];
}​​​​​​​


export interface Colors {​​​​​​​
    HeaderBackground:    string;
    HeaderColor:         string;
    HighlightBackground: string;
    HighlightColor:      string;
}​​​​​​​


export interface Tenant {​​​​​​​
    TenantName: string;
    TenantUrl:  string;
    DomainName: string;
}​​​​​​​


export interface Urls {​​​​​​​
    FaviconUrl: string;
    LogoUrl:    string;
}​​​​​​​


// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {​​​​​​​
    public static toWelcome(json: string): Welcome {​​​​​​​
        return cast(JSON.parse(json), r("Welcome"));
    }​​​​​​​


    public static welcomeToJson(value: Welcome): string {​​​​​​​
        return JSON.stringify(uncast(value, r("Welcome")), null, 2);
    }​​​​​​​
}​​​​​​​


function invalidValue(typ: any, val: any, key: any = ''): never {​​​​​​​
    if (key) {​​​​​​​
        throw Error(`Invalid value for key "${​​​​​​​key}​​​​​​​". Expected type ${​​​​​​​JSON.stringify(typ)}​​​​​​​ but got ${​​​​​​​JSON.stringify(val)}​​​​​​​`);
    }​​​​​​​
    throw Error(`Invalid value ${​​​​​​​JSON.stringify(val)}​​​​​​​ for type ${​​​​​​​JSON.stringify(typ)}​​​​​​​`, );
}​​​​​​​


function jsonToJSProps(typ: any): any {​​​​​​​
    if (typ.jsonToJS === undefined) {​​​​​​​
        const map: any = {​​​​​​​}​​​​​​​;
        typ.props.forEach((p: any) => map[p.json] = {​​​​​​​ key: p.js, typ: p.typ }​​​​​​​);
        typ.jsonToJS = map;
    }​​​​​​​
    return typ.jsonToJS;
}​​​​​​​


function jsToJSONProps(typ: any): any {​​​​​​​
    if (typ.jsToJSON === undefined) {​​​​​​​
        const map: any = {​​​​​​​}​​​​​​​;
        typ.props.forEach((p: any) => map[p.js] = {​​​​​​​ key: p.json, typ: p.typ }​​​​​​​);
        typ.jsToJSON = map;
    }​​​​​​​
    return typ.jsToJSON;
}​​​​​​​


function transform(val: any, typ: any, getProps: any, key: any = ''): any {​​​​​​​
    function transformPrimitive(typ: string, val: any): any {​​​​​​​
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }​​​​​​​


    function transformUnion(typs: any[], val: any): any {​​​​​​​
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {​​​​​​​
            const typ = typs[i];
            try {​​​​​​​
                return transform(val, typ, getProps);
            }​​​​​​​ catch (_) {​​​​​​​}​​​​​​​
        }​​​​​​​
        return invalidValue(typs, val);
    }​​​​​​​


    function transformEnum(cases: string[], val: any): any {​​​​​​​
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }​​​​​​​


    function transformArray(typ: any, val: any): any {​​​​​​​
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }​​​​​​​


    function transformDate(val: any): any {​​​​​​​
        if (val === null) {​​​​​​​
            return null;
        }​​​​​​​
        const d = new Date(val);
        if (isNaN(d.valueOf())) {​​​​​​​
            return invalidValue("Date", val);
        }​​​​​​​
        return d;
    }​​​​​​​


    function transformObject(props: {​​​​​​​ [k: string]: any }​​​​​​​, additional: any, val: any): any {​​​​​​​
        if (val === null || typeof val !== "object" || Array.isArray(val)) {​​​​​​​
            return invalidValue("object", val);
        }​​​​​​​
        const result: any = {​​​​​​​}​​​​​​​;
        Object.getOwnPropertyNames(props).forEach(key => {​​​​​​​
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        }​​​​​​​);
        Object.getOwnPropertyNames(val).forEach(key => {​​​​​​​
            if (!Object.prototype.hasOwnProperty.call(props, key)) {​​​​​​​
                result[key] = transform(val[key], additional, getProps, key);
            }​​​​​​​
        }​​​​​​​);
        return result;
    }​​​​​​​


    if (typ === "any") return val;
    if (typ === null) {​​​​​​​
        if (val === null) return val;
        return invalidValue(typ, val);
    }​​​​​​​
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {​​​​​​​
        typ = typeMap[typ.ref];
    }​​​​​​​
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {​​​​​​​
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }​​​​​​​
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}​​​​​​​


function cast<T>(val: any, typ: any): T {​​​​​​​
    return transform(val, typ, jsonToJSProps);
}​​​​​​​


function uncast<T>(val: T, typ: any): any {​​​​​​​
    return transform(val, typ, jsToJSONProps);
}​​​​​​​


function a(typ: any) {​​​​​​​
    return {​​​​​​​ arrayItems: typ }​​​​​​​;
}​​​​​​​


function u(...typs: any[]) {​​​​​​​
    return {​​​​​​​ unionMembers: typs }​​​​​​​;
}​​​​​​​


function o(props: any[], additional: any) {​​​​​​​
    return {​​​​​​​ props, additional }​​​​​​​;
}​​​​​​​


function m(additional: any) {​​​​​​​
    return {​​​​​​​ props: [], additional }​​​​​​​;
}​​​​​​​


function r(name: string) {​​​​​​​
    return {​​​​​​​ ref: name }​​​​​​​;
}​​​​​​​


const typeMap: any = {​​​​​​​
    "Welcome": o([
        {​​​​​​​ json: "FirstName", js: "FirstName", typ: "" }​​​​​​​,
        {​​​​​​​ json: "LastName", js: "LastName", typ: "" }​​​​​​​,
        {​​​​​​​ json: "MiddleName", js: "MiddleName", typ: null }​​​​​​​,
        {​​​​​​​ json: "Token", js: "Token", typ: "" }​​​​​​​,
        {​​​​​​​ json: "RefreshToken", js: "RefreshToken", typ: "" }​​​​​​​,
        {​​​​​​​ json: "TimeZone", js: "TimeZone", typ: null }​​​​​​​,
        {​​​​​​​ json: "Language", js: "Language", typ: null }​​​​​​​,
        {​​​​​​​ json: "ProfileUrl", js: "ProfileUrl", typ: "" }​​​​​​​,
        {​​​​​​​ json: "Colors", js: "Colors", typ: r("Colors") }​​​​​​​,
        {​​​​​​​ json: "Urls", js: "Urls", typ: r("Urls") }​​​​​​​,
        {​​​​​​​ json: "MFA", js: "MFA", typ: 0 }​​​​​​​,
        {​​​​​​​ json: "Tenants", js: "Tenants", typ: a(r("Tenant")) }​​​​​​​,
    ], false),
    "Colors": o([
        {​​​​​​​ json: "HeaderBackground", js: "HeaderBackground", typ: "" }​​​​​​​,
        {​​​​​​​ json: "HeaderColor", js: "HeaderColor", typ: "" }​​​​​​​,
        {​​​​​​​ json: "HighlightBackground", js: "HighlightBackground", typ: "" }​​​​​​​,
        {​​​​​​​ json: "HighlightColor", js: "HighlightColor", typ: "" }​​​​​​​,
    ], false),
    "Tenant": o([
        {​​​​​​​ json: "TenantName", js: "TenantName", typ: "" }​​​​​​​,
        {​​​​​​​ json: "TenantUrl", js: "TenantUrl", typ: "" }​​​​​​​,
        {​​​​​​​ json: "DomainName", js: "DomainName", typ: "" }​​​​​​​,
    ], false),
    "Urls": o([
        {​​​​​​​ json: "FaviconUrl", js: "FaviconUrl", typ: "" }​​​​​​​,
        {​​​​​​​ json: "LogoUrl", js: "LogoUrl", typ: "" }​​​​​​​,
    ], false),
}​​​​​​​;

export interface Logging {​​​​​​​
    Debug: number;
    Info:  number;
    Error: number;
}
export enum LogType {​​​​​​​
    Debug,
    Info,
    Error
}

























