import Link from "next/link";
import { getSubjectById } from "@/lib/subjects";
import { SectionBlock } from "@/components/seasonal/SectionBlock";

export default function SeasonalSubjectPage() {
  const subject = getSubjectById("seasonal");

  if (!subject) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-white">
        Subject not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs font-medium text-neutral-400">
        <Link href="/" className="hover:text-neutral-200 transition">
          Home
        </Link>
        <span>/</span>
        <span className="text-indigo-400 font-semibold">{subject.title}</span>
      </nav>

      {/* Header Section */}
      <div className="border-b border-neutral-800 pb-8 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-400">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          <span>{subject.badge || "Subject Hub"}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {subject.title}
          </span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-400 max-w-3xl leading-relaxed">
          {subject.description}
        </p>
      </div>

      {/* Sections & Dashboard Cards */}
      <div className="space-y-12">
        {subject.sections.map((section) => (
          <SectionBlock key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}
