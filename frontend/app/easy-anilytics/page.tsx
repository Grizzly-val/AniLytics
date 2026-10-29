import { redirect } from "next/navigation";

export default function EasyAnilyticsPage() {
  redirect("/easy-anilytics/filter-by");
  
  return (
    <div className="flex-1 flex items-center justify-center min-h-hero-screen bg-anilytics-bg text-anilytics-text-low font-mono text-caption">
      Redirecting to Easy-AniLytics...
    </div>
  );
}
