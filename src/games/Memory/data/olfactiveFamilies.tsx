import { ReferenceLink } from "~/types/referenceLink";

type OlfactiveFamilySchema = {
  id: string;
  title: string;
  subfamilies: string[];
  descriptors: string[];
  referenceLinks?: ReferenceLink[];
};

// Four-wheel structure (Michael Edwards)
export const fresh = {
  id: "fresh",
  title: "Fresh",
  subfamilies: ["Citrus", "Green", "Water", "Fruity", "Aromatic Fresh"],
  descriptors: [
    "Bright",
    "Zesty",
    "Clean",
    "Light",
    "Energizing",
    "Crisp",
    "Airy",
    "Natural",
    "Refreshing",
  ],
} as const satisfies OlfactiveFamilySchema;

export const floral = {
  id: "floral",
  title: "Floral",
  subfamilies: ["Soft Floral", "Floriental", "Floral Fruity", "Floral Woody Musk"],
  descriptors: [
    "Romantic",
    "Elegant",
    "Delicate",
    "Powdery",
    "Sweet",
    "Feminine",
    "Lush",
    "Fragrant",
    "Graceful",
  ],
} as const satisfies OlfactiveFamilySchema;

export const oriental = {
  id: "oriental",
  title: "Oriental",
  subfamilies: ["Soft Oriental", "Spicy Oriental", "Woody Oriental", "Amber", "Gourmand"],
  descriptors: [
    "Warm",
    "Sensual",
    "Exotic",
    "Rich",
    "Spicy",
    "Sweet",
    "Opulent",
    "Mysterious",
    "Luxurious",
  ],
} as const satisfies OlfactiveFamilySchema;

export const woody = {
  id: "woody",
  title: "Woody",
  subfamilies: ["Dry Woods", "Mossy Woods (Chypre)", "Soft Woods", "Leather", "Vetiver"],
  descriptors: [
    "Earthy",
    "Warm",
    "Smooth",
    "Rich",
    "Smoky",
    "Dry",
    "Mossy",
    "Deep",
    "Grounding",
    "Refined",
  ],
} as const satisfies OlfactiveFamilySchema;

// Final array in Edwards' wheel order
export const olfactiveFamilies = [
  fresh,
  floral,
  oriental,
  woody,
] as const satisfies OlfactiveFamilySchema[];

export type OlfactiveFamily = (typeof olfactiveFamilies)[number];
export type OlfactiveFamilyId = OlfactiveFamily["id"];
