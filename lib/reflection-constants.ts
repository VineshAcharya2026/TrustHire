export const REFLECTION_FORM_DESCRIPTION =
  "A trusted community of accomplished individuals who value friendship, growth, generosity, and meaningful conversations.";

export const VALUED_QUALITIES = [
  "Integrity",
  "Humility",
  "Kindness",
  "Loyalty",
  "Excellence",
  "Wisdom",
  "Courage",
  "Curiosity",
  "Compassion",
  "Open-mindedness",
  "Reliability",
  "Generosity",
  "Sense of humour",
] as const;

export const SUPPORT_WAYS = [
  "Mentoring",
  "Listening and emotional support",
  "Business introductions",
  "Strategic advice",
  "Professional guidance",
  "Social impact initiatives",
  "Investing",
  "Philanthropy",
  "Other",
] as const;

export const LEADERSHIP_LONELINESS_OPTIONS = [
  { value: "FREQUENTLY", label: "Frequently" },
  { value: "OCCASIONALLY", label: "Occasionally" },
  { value: "RARELY", label: "Rarely" },
  { value: "NEVER", label: "Never" },
] as const;

export const GENTLE_COMMITMENT_OPTIONS = [
  {
    value: "YES_REFLECTS_INTENTIONS",
    label: "Yes, this reflects my intentions.",
  },
  {
    value: "STILL_EXPLORING",
    label: "I am still exploring whether this community is right for me.",
  },
] as const;

export const GENTLE_COMMITMENT_TEXT =
  "I value integrity, generosity, confidentiality, and mutual respect, and I will strive to contribute positively to this community to the best of my ability.";

export const REFLECTION_SECTIONS = [
  {
    id: "identity",
    title: "Introduction",
    description: "Help us get to know you.",
  },
  {
    id: "values",
    title: "Values & purpose",
    description: "What shapes who you are and what you care about.",
  },
  {
    id: "people",
    title: "People & connection",
    description: "How you relate to others in community.",
  },
  {
    id: "support",
    title: "Trust & support",
    description: "Confidentiality, contribution, and what you need.",
  },
  {
    id: "community",
    title: "Community",
    description: "Topics, legacy, and suggestions.",
  },
  {
    id: "commitment",
    title: "Gentle commitment",
    description: "Your intentions for this community.",
  },
] as const;
