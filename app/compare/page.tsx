import CompareAccordion from "@/components/compare/compareAccordion";

// This allows Next.js to access searchParams in Server Components
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const ccns = Array.isArray(params.ccn) ? params.ccn : params.ccn ? [params.ccn] : [];

  const add = ccns.length == 5;

  return (
    <div className="p-2">
      <CompareAccordion addable={add} />
    </div>
  );
}
