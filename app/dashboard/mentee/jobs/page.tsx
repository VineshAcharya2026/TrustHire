import { JobBrowsePanel } from "@/components/jobs/JobBrowsePanel";

export default function MenteeJobsPage() {
  return (
    <JobBrowsePanel
      title="Browse jobs"
      description="Discover roles filtered by company, skills, and bounty."
      jobLinkPrefix="/dashboard/mentee/jobs"
    />
  );
}
