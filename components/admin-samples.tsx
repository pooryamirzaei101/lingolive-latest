import { SampleManager } from "@/components/admin-example-actions";
import { sampleCatalog } from "@/lib/sample-catalog";
import { hiddenSampleIds } from "@/lib/sample-visibility";
import type { ContentSection } from "@/lib/video";

export async function AdminSamples({ section }: { section: ContentSection }) {
  const hidden = await hiddenSampleIds();
  return <SampleManager samples={sampleCatalog.filter(item => item.section === section)} hidden={[...hidden]}/>;
}
