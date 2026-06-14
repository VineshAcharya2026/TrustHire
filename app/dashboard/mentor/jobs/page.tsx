import { JobBrowsePanel } from "@/components/jobs/JobBrowsePanel";

export default function MentorJobsPage() {
  return (
    <JobBrowsePanel
      title="Browse jobs"
      description="Filter open roles by company, skills, and bounty to guide your mentees."
      jobLinkPrefix="/dashboard/mentor/jobs"
    />
  );
}
