import {
  ProviderData,
  EnrichedProviderData,
  RawNationalDataRecord,
  RawStateDataRecord,
  RawNationalCahpsRecord,
  Code
} from "@/lib/types";

/**
 * Creates a lookup map for quick measure code lookups
 * Now handles case-insensitive matching
 */
function createMeasureLookup(
  records: Array<{ "measure_code": string; "score": string }> | null
): Map<string, string> {
  const lookup = new Map<string, string>();
  if (!records) return lookup;

  records.forEach(record => {
    // Store with uppercase key for case-insensitive matching
    const measureCode = record["measure_code"]?.trim().toUpperCase();
    if (measureCode) {
      lookup.set(measureCode, record["score"]);
    }
  });

  return lookup;
}

/**
 * Creates a lookup map for Code objects by measure code
 */
function createCodeLookup(
  codes: Code[] | null
): Map<string, Code> {
  const lookup = new Map<string, Code>();
  if (!codes) return lookup;

  codes.forEach(code => {
    // Store with uppercase key for case-insensitive matching
    const measureCode = code.measure_code?.trim().toUpperCase();
    if (measureCode) {
      lookup.set(measureCode, code);
    }
  });

  return lookup;
}

/**
 * Enriches provider data with national and state averages
 * Single responsibility: Transform ProviderData into EnrichedProviderData
 */
export function enrichProviderData(
  providerData: ProviderData,
  nationalData: RawNationalDataRecord[] | null,
  nationalCahps: RawNationalCahpsRecord[] | null,
  stateData: RawStateDataRecord[] | null,
  stateCahps: RawStateDataRecord[] | null,
  customData: Code[] | null,
): EnrichedProviderData {
  // Create lookup maps for O(1) access
  const nationalDataLookup = createMeasureLookup(nationalData);
  const nationalCahpsLookup = createMeasureLookup(nationalCahps);
  const stateDataLookup = createMeasureLookup(stateData);
  const stateCahpsLookup = createMeasureLookup(stateCahps);
  const codeLookup = createCodeLookup(customData);

  // Enrich each measure with comparison data
  // Use uppercase for case-insensitive matching
  const enrichedMeasures = providerData.measures.map(measure => {
    const measureCodeUpper = measure.measureCode.trim().toUpperCase();
    const codeData = codeLookup.get(measureCodeUpper);

    // Destructure to omit 'id', 'measure_code', 'description', and 'measure_name'
    const {
      id: _id, // Renamed to start with an underscore
      measure_code: _measure_code, // Renamed to start with an underscore
      description: _description, // Renamed to start with an underscore
      measure_name: _measure_name, // Renamed to start with an underscore
      ...codeFields
    } = codeData || {};

    return {
      ...measure,
      nationalAverage: nationalDataLookup.get(measureCodeUpper) || nationalCahpsLookup.get(measureCodeUpper),
      stateAverage: stateDataLookup.get(measureCodeUpper) || stateCahpsLookup.get(measureCodeUpper),
      // Spread all fields from codeOmit type
      ...codeFields,
    };
  });

  return {
    ...providerData,
    measures: enrichedMeasures
  };
}
