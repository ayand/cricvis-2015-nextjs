import MatchDropdown from "@/components/MatchDropdown";

export default function MatchesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="container mx-auto px-4 py-4">
            <div className="row flex">
              <MatchDropdown />
              <div className="col-span-8">
                {/* Placeholder for future content */}
              </div>
            </div>
          </div>
      {children}
    </div>
  );
}