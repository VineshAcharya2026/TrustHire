import { Badge } from "@/components/ui/badge";
import { GENTLE_COMMITMENT_OPTIONS, LEADERSHIP_LONELINESS_OPTIONS } from "@/lib/reflection-constants";
import { formatDate } from "@/lib/utils";

type Reflection = {
  id: string;
  introduction?: string | null;
  proudestAchievement?: string | null;
  guidingValues?: string | null;
  standFor?: string | null;
  admiredPerson?: string | null;
  meaningPurpose?: string | null;
  dreamMission?: string | null;
  societalAspiration?: string | null;
  othersDescribeYou?: string | null;
  valuedQualities?: string[];
  energizingPeople?: string | null;
  differentBeliefsApproach?: string | null;
  confidentialityImportance?: number | null;
  supportWays?: string[];
  contributions?: string | null;
  leadershipLoneliness?: string | null;
  supportNeeded?: string | null;
  sharingTopics?: string | null;
  rememberedFor?: string | null;
  additionalNotes?: string | null;
  gentleCommitment?: string | null;
  completedAt?: string | null;
  updatedAt?: string;
};

function labelFor(
  options: readonly { value: string; label: string }[],
  value?: string | null
) {
  return options.find((o) => o.value === value)?.label ?? value ?? "—";
}

function ReflectionAnswer({ label, value }: { label: string; value?: string | null }) {
  if (!value?.trim()) return null;
  return (
    <div className="space-y-1">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className="whitespace-pre-wrap text-sm text-primary">{value}</p>
    </div>
  );
}

export function MemberReflectionPanel({ reflection }: { reflection?: Reflection | null }) {
  if (!reflection?.id) {
    return (
      <div className="rounded-xl border border-primary/8 bg-white p-5 shadow-card">
        <h2 className="font-semibold text-primary">Member reflection</h2>
        <p className="mt-2 text-sm text-muted">This member has not started their reflection form yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/8 bg-white p-5 shadow-card space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-semibold text-primary">Member reflection</h2>
        <div className="flex gap-2">
          {reflection.completedAt ? (
            <Badge variant="accent">Submitted {formatDate(reflection.completedAt)}</Badge>
          ) : (
            <Badge>Draft</Badge>
          )}
        </div>
      </div>

      <ReflectionAnswer label="Introduction" value={reflection.introduction} />
      <ReflectionAnswer label="Most proud of" value={reflection.proudestAchievement} />
      <ReflectionAnswer label="Guiding values" value={reflection.guidingValues} />
      <ReflectionAnswer label="What they stand for" value={reflection.standFor} />
      <ReflectionAnswer label="Who they admire" value={reflection.admiredPerson} />
      <ReflectionAnswer label="Meaning and purpose" value={reflection.meaningPurpose} />
      <ReflectionAnswer label="Dream or mission" value={reflection.dreamMission} />
      <ReflectionAnswer label="Societal aspiration" value={reflection.societalAspiration} />
      <ReflectionAnswer label="How others describe them" value={reflection.othersDescribeYou} />

      {reflection.valuedQualities && reflection.valuedQualities.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Valued qualities</p>
          <div className="flex flex-wrap gap-2">
            {reflection.valuedQualities.map((q) => (
              <Badge key={q}>{q}</Badge>
            ))}
          </div>
        </div>
      )}

      <ReflectionAnswer label="People who energise them" value={reflection.energizingPeople} />
      <ReflectionAnswer label="Approach to different beliefs" value={reflection.differentBeliefsApproach} />

      {reflection.confidentialityImportance != null && (
        <p className="text-sm text-muted">
          Confidentiality importance: <span className="font-medium text-primary">{reflection.confidentialityImportance}/10</span>
        </p>
      )}

      {reflection.supportWays && reflection.supportWays.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Ways to support</p>
          <div className="flex flex-wrap gap-2">
            {reflection.supportWays.map((w) => (
              <Badge key={w} variant="accent">{w}</Badge>
            ))}
          </div>
        </div>
      )}

      <ReflectionAnswer label="Contributions" value={reflection.contributions} />

      {reflection.leadershipLoneliness && (
        <p className="text-sm text-muted">
          Leadership loneliness:{" "}
          <span className="text-primary">
            {labelFor(LEADERSHIP_LONELINESS_OPTIONS, reflection.leadershipLoneliness)}
          </span>
        </p>
      )}

      <ReflectionAnswer label="Support needed" value={reflection.supportNeeded} />
      <ReflectionAnswer label="Topics to share" value={reflection.sharingTopics} />
      <ReflectionAnswer label="Remembered for" value={reflection.rememberedFor} />
      <ReflectionAnswer label="Additional notes" value={reflection.additionalNotes} />

      {reflection.gentleCommitment && (
        <p className="text-sm text-muted">
          Gentle commitment:{" "}
          <span className="text-primary">
            {labelFor(GENTLE_COMMITMENT_OPTIONS, reflection.gentleCommitment)}
          </span>
        </p>
      )}
    </div>
  );
}
