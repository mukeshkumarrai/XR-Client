export interface SeekPreviewUrl {
    jobCategoryId: string;
    locationId: string;
    organizationId: string;
    jobTitle: string;
    offeredRemunerationPackage: OfferedRemunerationPackageUrl;
    seekAnzWorkTypeCode: string;
    postingInstructions?: (PostingInstructionsEntity)[] | null;
    positionFormattedDescriptions?: (PositionFormattedDescriptionsEntity)[] | null;
    //seekApplicationQuestionnaireId: string;  /**WHO: Renu @WHEN:13-05-2024 @WHY:EWM-16917 EWM-17052 @WHAT: as per the API requirement is not required so commented. */
    seekVideo: SeekVideo;
  }
  export interface OfferedRemunerationPackageUrl {
    basisCode: string;
    descriptions?: (string)[] | null;
    ranges?: (RangesEntityUrl)[] | null;
  }
  export interface RangesEntityUrl {
    intervalCode: string;
    minimumAmount: MinimumAmountUrl;
    maximumAmount: MaximumAmountUrl;
  }
  export interface MinimumAmountUrl {
    currency: string;
    value: number;
  }
  export interface MaximumAmountUrl {
    currency: string;
    value: number;
  }
  export interface PostingInstructionsEntity {
    seekAdvertisementProductId: string;
    brandingId: string;
  }
  export interface PositionFormattedDescriptionsEntity {
    DescriptionId: string;
    Content: string;
  }
  export interface SeekVideo {
    Url: string;
    SeekAnzPositionCode: string;
  }
  