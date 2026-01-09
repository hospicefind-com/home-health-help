/**
 * Note about difference between types and interfaces.
 * They're very similar, but you can add parameters to an interface
 * later on in code, it doesn't all have to be declared at once.
 *      Aka you can 're-declare' the interface multiple times and it'll automatcially 
 *      merge the new parameter you added to it.
 * Both types and interfaces can extend others.
 * Types can be combined as well using the `&` operator.
 * Types can describe unions which is where you can say an object COULD be multiple different types at a given time (example: <string | undefined>). 
 *      Types can also describe tuples, and 'complex conditional types' which I assume means types that are a certian type dependent on some condition.
 */
export type HospiceDisplayProps = { params: Promise<{ id: string }> }

export type PersonalPageDisplayProps = { id: string };

// This defines the specific data that the sortby functions need to use, along with the specific data the hospice display card function needs to use.
// I made it a type because both the sortby functions and display cards need to be able to accept and return the same objects with the same data,
// so making this an interface would imply that it's meant to be extended at some point, which isn't true.
export type GeneralData = {
  cms_certification_number_ccn: string
  facility_name: string,
  address_line_1: string
  countyparish: string,
  citytown: string,
  state: string,
  telephone_number: string,
  ownership_type: string
}

export type SortbyMedicareScores = {
  score: string,
  score_desc: string | undefined // need to do this because of how the 'find()' function works to find labels in the sortOptions array
}

export type CardData = {
  general_data: GeneralData,
  sortby_medicare_scores: SortbyMedicareScores
}

// THIS SHOULD BE UPDATED WITH ANY NEW COLUMNS ADDED TO THE `measure_codes` TABLE YOU CHUD
export type Code = {
  id: string,
  measure_code: string,
  description: string,
  measure_name: string,
  real_desc: string,
  opt_sorting: boolean,
  family_caregiver_experience: boolean,
  quality_patient_care: boolean,
  conditions_treated: boolean,
  location_of_care: boolean,
  out_of: string,
  lower_is_better: boolean,
  details_section: boolean,
  is_cahps: boolean,
  is_hci: boolean,
  is_general_metric: boolean,
}

type codeOmit = Partial<Omit<Code, 'id' | 'measure_code' | 'description' | 'measure_name'>>;

// Hospice Provider Data Types
export interface ProviderMeasure {
  measureCode: string;
  measureName: string;
  score: string;
  starRating?: string;
  footnote: string;
  measureDateRange: string;
}

// Enriched measure with comparison data
export type EnrichedProviderMeasure = ProviderMeasure & codeOmit & {
  nationalAverage?: string;
  stateAverage?: string;
}

export interface ProviderData {
  ccn: string;
  facilityName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;
  county: string;
  phone: string;
  cmsRegion: string;
  measures: ProviderMeasure[];
}

// Enriched provider data with averages baked in
export interface EnrichedProviderData extends Omit<ProviderData, 'measures'> {
  measures: EnrichedProviderMeasure[];
}

// Type for the raw CMS API response
export interface RawCMSRecord {
  "CMS Certification Number (CCN)": string;
  "Facility Name": string;
  "Address Line 1": string;
  "Address Line 2": string;
  "City/Town": string;
  "State": string;
  "ZIP Code": string;
  "County/Parish": string;
  "Telephone Number": string;
  "CMS Region": string;
  "Measure Code": string;
  "Measure Name": string;
  "Score": string;
  "Star Rating"?: string;
  "Footnote": string;
  "Measure Date Range": string;
}

// Type for the raw National Data API response
export interface RawNationalDataRecord {
  "CMS Certification Number (CCN)": string;
  "Measure Code": string;
  "Measure Name": string;
  "Score": string;
  "Footnote": string;
  "Date": string;
}

// Type for the raw National CAHPS API response
export interface RawNationalCahpsRecord {
  "Measure Code": string;
  "Measure Name": string;
  "Score": string;
  "Footnote": string;
  "Date": string;
}

// Type for the raw State response
export interface RawStateDataRecord {
  "State": string;
  "Measure Code": string;
  "Measure Name": string;
  "Score": string;
  "Footnote": string;
  "Date": string;
}

// 1. The individual review object
export interface PlaceReview {
  author_name: string;
  author_url: string;
  language: string;
  original_language: string;
  profile_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number; // Unix timestamp
  translated: boolean;
}

// 2. The 'result' object containing the list of reviews
export interface PlaceResult {
  reviews?: PlaceReview[]; // Optional because a place might not have reviews
}

// 3. The top-level API response
export interface GooglePlacesResponse {
  html_attributions: string[];
  result: PlaceResult;
  status: string; // e.g., "OK", "ZERO_RESULTS", "INVALID_REQUEST"
}
