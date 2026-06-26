"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { MentorFriendCard } from "@/components/mentor/MentorFriendCard";
import { Alert } from "@/components/ui/alert";

type Match = {
  score: number;
  reasons: string[];
  mentor: Parameters<typeof MentorFriendCard>[0]["mentor"];
};

export default function MentorFriendsPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/mentor/friends")
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setError(data.error);
        else setMatches(data.matches ?? []);
      });
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Find your friends"
        description="Discover mentors with similar expertise, industry, seniority, and interests."
      />
      {error && <Alert variant="error">{error}</Alert>}
      {matches.length === 0 && !error && (
        <p className="text-sm text-muted">No matches yet. Complete your profile to improve recommendations.</p>
      )}
      <div className="grid gap-4 md:grid-cols-2">
        {matches.map((m) => (
          <MentorFriendCard
            key={m.mentor.userId}
            mentor={m.mentor}
            score={m.score}
            reasons={m.reasons}
          />
        ))}
      </div>
    </div>
  );
}
