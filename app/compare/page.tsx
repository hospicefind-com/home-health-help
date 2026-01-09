import AddColumn from "@/components/compare/addColumn";
import NameColumn from "@/components/compare/nameColumn";
import CompareColumn from "@/components/compare/compareColumn";
import CompareAccordion from "@/components/compare/compareAccordion";

// This allows Next.js to access searchParams in Server Components
export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const ccns = Array.isArray(params.ccn) ? params.ccn : params.ccn ? [params.ccn] : [];

  return (
    <div className="p-2">
      <CompareAccordion />
    </div>
  );
}
