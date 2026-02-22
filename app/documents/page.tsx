import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { getDocuments } from "@/lib/sanity.queries";
import { FileText, Download, Shield, Award, Receipt } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Documents",
  description:
    "Access Fiber Guys compliance and qualification documents — COI, safety manual, W-9, and certifications.",
  robots: { index: false, follow: false },
};

const CATEGORY_META: Record<
  string,
  { label: string; icon: typeof FileText }
> = {
  insurance: { label: "Insurance / COI", icon: Shield },
  safety: { label: "Safety Manual", icon: FileText },
  w9: { label: "W-9", icon: Receipt },
  certifications: { label: "Certifications", icon: Award },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function DocumentsPage() {
  const documents = await getDocuments();

  // Group by category
  const grouped: Record<string, typeof documents> = {};
  for (const doc of documents) {
    const cat = doc.category || "other";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(doc);
  }

  const categoryOrder = ["insurance", "safety", "w9", "certifications"];
  const sortedCategories = categoryOrder.filter((c) => grouped[c]);

  return (
    <main className="pt-20 lg:pt-24">
      <section className="mx-auto max-w-4xl px-6 lg:px-8 py-section-sm lg:py-section">
        <ScrollReveal>
          <p className="caption-lg text-orange mb-4">Documents</p>
          <h1 className="font-heading text-h1 lg:text-display font-bold tracking-tighter">
            Compliance &amp; qualification files.
          </h1>
          <p className="mt-4 text-lg text-muted max-w-2xl">
            Current versions of our insurance, safety, tax, and certification
            documents. Click to download or copy the link for your records.
          </p>
        </ScrollReveal>

        {documents.length === 0 ? (
          <ScrollReveal>
            <div className="mt-16 text-center py-20 border border-line rounded-2xl bg-bg-2">
              <p className="text-muted font-mono text-sm">
                Documents will be available here soon.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <div className="mt-12 space-y-10">
            {sortedCategories.map((cat) => {
              const meta = CATEGORY_META[cat] || {
                label: cat,
                icon: FileText,
              };
              const Icon = meta.icon;
              const docs = grouped[cat];

              return (
                <ScrollReveal key={cat}>
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <Icon className="w-4 h-4 text-orange" />
                      <h2 className="font-heading text-sm font-bold tracking-tight uppercase">
                        {meta.label}
                      </h2>
                    </div>
                    <div className="space-y-2">
                      {docs.map((doc) => (
                        <a
                          key={doc._id}
                          href={`${doc.fileUrl}?dl=`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group flex items-center justify-between gap-4 p-4 rounded-lg border border-line bg-bg-2 hover:border-orange/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <FileText className="w-5 h-5 text-muted shrink-0 group-hover:text-orange transition-colors" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate group-hover:text-orange transition-colors">
                                {doc.title}
                              </p>
                              {doc.lastUpdated && (
                                <p className="font-mono text-[10px] uppercase tracking-widest text-muted mt-0.5">
                                  Updated {formatDate(doc.lastUpdated)}
                                </p>
                              )}
                            </div>
                          </div>
                          <Download className="w-4 h-4 text-muted shrink-0 group-hover:text-orange transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
