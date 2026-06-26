"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert } from "@/components/ui/alert";
import { Star } from "lucide-react";

type PendingRating = {
  id: string;
  mentor: {
    profile?: { firstName: string; lastName: string };
    mentorProfile?: { title: string; company: string };
  };
};

export function MenteeRatingPanel() {
  const [pending, setPending] = useState<PendingRating[]>([]);
  const [ratings, setRatings] = useState<Record<string, { rating: number; review: string }>>({});
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/mentee/ratings")
      .then((r) => r.json())
      .then((data) => setPending(Array.isArray(data) ? data : []));
  }

  useEffect(() => {
    load();
  }, []);

  async function submit(mentorshipId: string) {
    const r = ratings[mentorshipId];
    if (!r?.rating) return;
    setError("");
    const res = await fetch("/api/mentee/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mentorshipId, rating: r.rating, review: r.review }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to submit rating");
      return;
    }
    setSaved(true);
    load();
  }

  if (pending.length === 0) return null;

  return (
    <div className="rounded-xl border border-primary/8 bg-white p-5 shadow-card space-y-4">
      <h2 className="font-semibold text-primary">Rate your mentors</h2>
      {saved && <Alert variant="success">Thank you for your feedback!</Alert>}
      {error && <Alert variant="error">{error}</Alert>}
      {pending.map((m) => {
        const name = m.mentor.profile
          ? `${m.mentor.profile.firstName} ${m.mentor.profile.lastName}`
          : "Mentor";
        const r = ratings[m.id] ?? { rating: 0, review: "" };
        return (
          <div key={m.id} className="space-y-3 border-t border-primary/8 pt-4 first:border-0 first:pt-0">
            <p className="text-sm font-medium">{name}</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRatings({ ...ratings, [m.id]: { ...r, rating: n } })}
                >
                  <Star
                    className={`h-5 w-5 ${n <= r.rating ? "fill-accent text-accent" : "text-primary/20"}`}
                  />
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <Label>Review (optional)</Label>
              <Textarea
                value={r.review}
                onChange={(e) => setRatings({ ...ratings, [m.id]: { ...r, review: e.target.value } })}
                rows={2}
              />
            </div>
            <Button size="sm" variant="accent" onClick={() => submit(m.id)} disabled={!r.rating}>
              Submit rating
            </Button>
          </div>
        );
      })}
    </div>
  );
}
