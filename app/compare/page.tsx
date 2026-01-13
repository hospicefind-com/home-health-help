import CompareAccordion from "./compareAccordion";
import { getCombinedProviderData } from "@/lib/hospice-data/provider-data";
import { getAllCodes } from "@/lib/hospice-data/get-code-details";

// This allows Next.js to access searchParams in Server Components
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const ccns = Array.isArray(params.ccn) ? params.ccn : params.ccn ? [params.ccn] : [];
  const codes = await getAllCodes();
  const add = ccns.length < 5;

  const results = await Promise.all(
    ccns.map((ccn) => getCombinedProviderData(ccn))
  );

  results.map((result) => {
    result?.measures.sort((a, b) => {
      return a.measureCode.localeCompare(b.measureCode);
    })
  })

  return (
    <div className="p-2">
      <CompareAccordion addable={add} codes={codes} data={results} />
    </div>
  );
}
