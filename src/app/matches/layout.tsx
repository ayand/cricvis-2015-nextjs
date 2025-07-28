import MatchDropdown from "@/components/matches/MatchDropdown";

export default function MatchesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className="container mx-auto px-4 py-4">
            <div className="row flex">
              <MatchDropdown />
            </div>
          </div>
      {children}
    </div>
  );
}