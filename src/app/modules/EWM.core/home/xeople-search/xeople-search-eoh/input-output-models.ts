export interface  TagList {
    filter: any;
    Id: string;
    Text: string;
  }
export const InputFields=[
    {
      "InputColumnName": "Country",
      "EOHFieldName":"Country",
      "InputColumnType": "Dropdown",
      "InputColumnCondition": "Contains",
      "InputColumnConditionId":"EqualTo",
      "APIKey":"Text",
      "IsMultiple": true,
      "Condition": [
        {
          "ConditionId": "EqualTo",
          "ConditionName": "Contains"
        },
        {
          "ConditionId": "NotEqualTo",
          "ConditionName": "DoesNotContain"
        }
      ]
    },
    {
      "InputColumnName": "State",
      "EOHFieldName":"State",
      "InputColumnType": "Dropdown",
      "InputColumnCondition": "Contains",
      "InputColumnConditionId":"EqualTo",
      "APIKey":"Text",
      "IsMultiple": true,
      "Condition": [
        {
          "ConditionId": "EqualTo",
          "ConditionName": "Contains"
        },
        {
          "ConditionId": "NotEqualTo",
          "ConditionName": "DoesNotContain"
        }
      ]
    },
    {
      "InputColumnName": "CV Parsing",
      "EOHFieldName":"CVParsed",
      "InputColumnType": "Dropdown",
      "InputColumnCondition": "Is",
      "InputColumnConditionId":"EqualTo",
      "APIKey":"Text",
      "IsMultiple": false,
      "Condition": [
        {
          "ConditionId": "EqualTo",
          "ConditionName": "Is"
        },
        {
          "ConditionId": "NotEqualTo",
          "ConditionName": "IsNot"
        }
      ]
    },
    {
      "InputColumnName": "Expertise",
      "EOHFieldName":"Expertise",
      "InputColumnType": "Dropdown",
      "InputColumnCondition": "Contains",
      "InputColumnConditionId":"EqualTo",
      "APIKey":"Text",
      "IsMultiple": true,
      "Condition": [
        {
          "ConditionId": "EqualTo",
          "ConditionName": "Contains"
        },
        {
          "ConditionId": "NotEqualTo",
          "ConditionName": "DoesNotContain"
        }
      ]
    },
    {
      "InputColumnName": "Gender",
      "EOHFieldName":"Gender",
      "InputColumnType": "Dropdown",
      "InputColumnCondition": "Is",
      "InputColumnConditionId":"EqualTo",
      "APIKey":"Text",
      "IsMultiple": true,
      "Condition": [
        {
          "ConditionId": "EqualTo",
          "ConditionName": "Is"
        },
        {
          "ConditionId": "NotEqualTo",
          "ConditionName": "IsNot"
        }
      ]
    },
    {
      "InputColumnName": "Member Status",
      "EOHFieldName":"MemberStatus",
      "InputColumnType": "Dropdown",
      "InputColumnCondition": "Contains",
      "InputColumnConditionId":"EqualTo",
      "APIKey":"Text",
      "IsMultiple": true,
      "Condition": [
        {
          "ConditionId": "EqualTo",
          "ConditionName": "Contains"
        },
        {
          "ConditionId": "NotEqualTo",
          "ConditionName": "DoesNotContain"
        }
      ]
    },
    // {
    //   "InputColumnName": "Experience",
    //   "EOHFieldName":"Experience",
    //   "InputColumnType": "Dropdown",
    //   "InputColumnCondition": "IsEqualTo",
    //   "InputColumnConditionId":"EqualTo",
    //   "APIKey":"Text",
    //   "IsMultiple": false,
    //   "Condition": [
    //     {
    //       "ConditionId": "EqualTo",
    //       "ConditionName": "IsEqualTo",

    //     }
    //   ]
    // },
    {
      "InputColumnName": "Keyword",
      "EOHFieldName":"Keyword",
      "InputColumnType": "Text",
      "InputColumnCondition": "Exact",
      "InputColumnConditionId":"Exact",
      "APIKey":"Text",
      "IsMultiple": true,
      "Condition": [
        {
          "ConditionId": "Exact",
          "ConditionName": "Exact"
        },
        {
          "ConditionId": "Contains",
          "ConditionName": "Contains"
        },
        {
          "ConditionId": "NotContains",
          "ConditionName": "DoesNotContain"
        }
      ]
    },
    {
      "InputColumnName": "Industry",
      "EOHFieldName":"Industry",
      "InputColumnType": "Dropdown",
      "InputColumnCondition": "Contains",
      "InputColumnConditionId":"EqualTo",
      "APIKey":"Text",
      "IsMultiple": true,
      "Condition": [
        {
          "ConditionId": "EqualTo",
          "ConditionName": "Contains"
        },
        {
          "ConditionId": "NotEqualTo",
          "ConditionName": "DoesNotContain"
        }
      ]
    },
    {
      "InputColumnName": "Qualification",
      "EOHFieldName":"Qualification",
      "InputColumnType": "Dropdown",
      "InputColumnCondition": "Contains",
      "InputColumnConditionId":"EqualTo",
      "APIKey":"Text",
      "IsMultiple": true,
      "Condition": [
        {
          "ConditionId": "EqualTo",
          "ConditionName": "Contains"
        },
        {
          "ConditionId": "NotEqualTo",
          "ConditionName": "DoesNotContain"
        }
      ]
    },
    {
      "InputColumnName": "Application Status",
      "EOHFieldName":"ApplicationStatus",
      "InputColumnType": "Dropdown",
      "InputColumnCondition": "Contains",
      "InputColumnConditionId":"EqualTo",
      "APIKey":"Text",
      "IsMultiple": true,
      "Condition": [
        {
          "ConditionId": "EqualTo",
          "ConditionName": "Contains"
        },
        {
          "ConditionId": "NotEqualTo",
          "ConditionName": "DoesNotContain"
        }
      ]
    },
    {
      "InputColumnName": "Office",
      "EOHFieldName":"Office",
      "InputColumnType": "Dropdown",
      "InputColumnCondition": "Contains",
      "InputColumnConditionId":"EqualTo",
      "APIKey":"Text",
      "IsMultiple": true,
      "Condition": [
        {
          "ConditionId": "EqualTo",
          "ConditionName": "Contains"
        },
        {
          "ConditionId": "NotEqualTo",
          "ConditionName": "DoesNotContain"
        }
      ]
    },
    {
      "InputColumnName": "Member Id",
      "EOHFieldName":"MemberId",
      "InputColumnType": "Text",
      "InputColumnCondition": "Is",
      "InputColumnConditionId":"EqualTo",
      "APIKey":"Text",
      "IsMultiple": false,
      "Condition": [
        {
          "ConditionId": "EqualTo",
          "ConditionName": "Is"
        },
        {
          "ConditionId": "NotEqualTo",
          "ConditionName": "IsNot"
        }
      ]
    },
    {
      "InputColumnName": "Employee Id",
      "EOHFieldName":"EmployeeId",
      "InputColumnType": "Text",
      "InputColumnCondition": "Is",
      "InputColumnConditionId":"EqualTo",
      "APIKey":"Text",
      "IsMultiple": false,
      "Condition": [
        {
          "ConditionId": "EqualTo",
          "ConditionName": "Is"
        },
        {
          "ConditionId": "NotEqualTo",
          "ConditionName": "IsNot"
        }
      ]
    },
    {
      "InputColumnName": "Email",
      "EOHFieldName":"Email",
      "InputColumnType": "Text",
      "InputColumnCondition": "Is",
      "InputColumnConditionId":"EqualTo",
      "APIKey":"Text",
      "IsMultiple": false,
      "Condition": [
        {
          "ConditionId": "EqualTo",
          "ConditionName": "Is"
        },
        {
          "ConditionId": "NotEqualTo",
          "ConditionName": "IsNot"
        }
      ]
    },
    // {
    //   "InputColumnName": "Employee Type",
    //   "EOHFieldName":"EmployeeType",
    //   "InputColumnType": "Dropdown",
    //   "InputColumnCondition": "Is",
    //   "APIKey":"Text",
    //   "IsMultiple": true,
    //   "Condition": [
    //     {
    //       "ConditionId": "Is",
    //       "ConditionName": "Is"
    //     },
    //     {
    //       "ConditionId": "IsNot",
    //       "ConditionName": "IsNot"
    //     }
    //   ]
    // },
    {
      "InputColumnName": "Proximity",
      "EOHFieldName":"Proximity",
      "InputColumnType": "Numeric",
      "InputColumnCondition": "Within",
      "InputColumnConditionId":"Within",
      "APIKey":"Numeric",
      "IsMultiple": false,
      "Condition": [
        {
          "ConditionId": "Within",
          "ConditionName": "Within"
        }
      ]
    }
  ]

  export const OutputFields=[
    {
      "OutputFieldName": "Member Id",
      "DisplayIndex": 1,
      "selected":true
    },
    {
      "OutputFieldName": "Profile Pic",
      "DisplayIndex": 2,
      "selected":true
    },
    {
      "OutputFieldName": "Name",
      "DisplayIndex": 3,
      "selected":true
    },
    {
      "OutputFieldName": "Address",
      "DisplayIndex": 4,
      "selected":true
    },
    {
      "OutputFieldName": "Phone No",
      "DisplayIndex": 5,
      "selected":true
    },
    {
      "OutputFieldName": "Email",
      "DisplayIndex": 6,
      "selected":true
    },
    {
      "OutputFieldName": "Resume",
      "DisplayIndex": 7,
      "selected":true
    },
    {
      "OutputFieldName": "Member Status",
      "DisplayIndex": 8,
      "selected":true
    },
    {
      "OutputFieldName": "Experience",
      "DisplayIndex": 9,
      "selected":true
    },
    {
      "OutputFieldName": "Qualification",
      "DisplayIndex": 10,
      "selected":true
    },
    {
      "OutputFieldName": "Skills",
      "DisplayIndex": 11,
      "selected":true
    },
    {
      "OutputFieldName": "Office",
      "DisplayIndex": 12,
      "selected":true
    },
    {
      "OutputFieldName": "Proximity",
      "DisplayIndex": 13,
      "selected":true
    },
    {
      "OutputFieldName": "Date of Hire",
      "DisplayIndex": 14,
      "selected":true
    },
    {
      "OutputFieldName": "Priority",
      "DisplayIndex": 15,
      "selected":true
    }
  ]

  export interface filter {
    Id: number
    FilterName: string
    AccessId: number
    AccessName: string
    SearchPools: SearchPool[]
    UserType: string
    InputFields: InputField[]
    ShowAllMatchingRecord: number
    ShowTopMatchingRecordNumber: number
    SearchQuery: string
    OutputFields: OutputField[]
    JobId: string
    LoggedInUserType: number
    View: number
    Edit: number
    Delete: number
    GrantAccessList: GrantAccessList[]
  }

  export interface SearchPool {
    SearchPoolId: number
    SearchPoolName: string
    IsEnabled: number
  }

  export interface InputField {
    InputColumnName: string
    InputColumnCondition: string
    InputColumnType: string
    IsMultiple: boolean
    APIKey: string
    Condition: Condition[]
    InputColumnValue: InputColumnValue[]
  }

  export interface Condition {
    ConditionName: string
  }

  export interface InputColumnValue {
    ValueName: string
  }

  export interface OutputField {
    OutputFieldName: string
    DisplayIndex: number
    Selected: boolean
  }

  export interface GrantAccessList {
    UserId: string
    EmailId: string
    UserName: string
    MappingId: number
    Mode: number
  }
