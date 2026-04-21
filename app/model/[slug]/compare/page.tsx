import VariantCompareClient from "./VariantCompareClient";

export default async function ModelVariantComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <VariantCompareClient slug={slug} />;
}
