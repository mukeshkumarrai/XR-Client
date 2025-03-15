   
export interface loginResponse {​​​​​​​
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


    export class Convert {
        public static toWelcome(json: string): loginResponse {
        return JSON.parse(json);
        }
        
         public static welcomeToJson(value: loginResponse): string {
        return JSON.stringify(value);
        }
        }