export interface SeekPreview {
    jobCategoryId: string;
    locationId: string;
    organizationId: string;
    jobTitle: string;
    offeredRemunerationPackage: OfferedRemunerationPackage;
    seekAnzWorkTypeCode: string;
  }
  export interface OfferedRemunerationPackage {
    basisCode: string;
    descriptions?: (string)[] | null;
    ranges?: (RangesEntity)[] | null;
  }
  export interface RangesEntity {
    intervalCode: string;
    minimumAmount: MinimumAmount;
    maximumAmount: MaximumAmount;
  }
  export interface MinimumAmount {
    currency: string;
    value: number;
  }
  export interface MaximumAmount {
    currency: string;
    value: number;
  }

  