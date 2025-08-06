import InningsDataDisplay from "@/components/matches/innings/InningDataDisplay";

interface InningsPageProps {
    params: {
        inningNumber: string;
    };
}

export default async function InningsPage({ params }: InningsPageProps) {
    const { inningNumber } = await params;
    return <InningsDataDisplay inning={Number(inningNumber)} />;
}
