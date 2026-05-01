import { ClassValue } from "clsx";

import { ReferenceLink } from "~/types/referenceLink";

type MoleculeSchema = {
  id: string;
  title: string;
  pubChemId: number;
  colorClass: ClassValue;
  referenceLinks?: ReferenceLink[];
};

const ethylButyrate = {
  id: "ethylButyrate",
  title: "Ethyl butyrate",
  pubChemId: 7762,
  colorClass: "bg-data-viz-6",
  referenceLinks: [
    {
      url: "https://pubchem.ncbi.nlm.nih.gov/compound/7762",
      name: "PubChem Page",
    },
  ],
} as const satisfies MoleculeSchema;

const lactones = {
  id: "lactones",
  title: "Lactones",
  pubChemId: 443021,
  colorClass: "bg-data-viz-5",
  referenceLinks: [
    {
      url: "https://www.scentree.co/en/Delta-octalactone.html",
      name: "Scentree - Delta-octalactone example",
    },
  ],
} as const satisfies MoleculeSchema;

const benzaldehyde = {
  id: "benzaldehyde",
  title: "Benzaldehyde",
  pubChemId: 240,
  colorClass: "bg-data-viz-4",
  referenceLinks: [
    {
      url: "https://pubchem.ncbi.nlm.nih.gov/compound/240",
      name: "PubChem Page",
    },
    {
      url: "https://www.scentree.co/en/Benzaldehyde.html",
      name: "Scentree Page",
    },
  ],
} as const satisfies MoleculeSchema;

const calone = {
  id: "calone",
  title: "Calone",
  pubChemId: 6432154,
  colorClass: "bg-data-viz-3",
  referenceLinks: [
    {
      url: "https://pubchem.ncbi.nlm.nih.gov/compound/6432154",
      name: "PubChem Page",
    },
    {
      url: "https://www.scentree.co/en/Calone%C2%AE.html",
      name: "Scentree Page",
    },
  ],
} as const satisfies MoleculeSchema;

const aldehydeC10 = {
  id: "aldehydeC10",
  title: "Aldehyde C10 (Decanal)",
  pubChemId: 8175,
  colorClass: "bg-data-viz-9",
  referenceLinks: [
    {
      url: "https://pubchem.ncbi.nlm.nih.gov/compound/8175",
      name: "PubChem Page",
    },
    {
      url: "https://www.scentree.co/en/Aldehyde_C-10.html",
      name: "Scentree Page",
    },
  ],
} as const satisfies MoleculeSchema;

const roseOxide = {
  id: "roseOxide",
  title: "Rose oxide",
  pubChemId: 27866,
  colorClass: "bg-data-viz-1",
  referenceLinks: [
    {
      url: "https://pubchem.ncbi.nlm.nih.gov/compound/27866",
      name: "PubChem Page",
    },
  ],
} as const satisfies MoleculeSchema;

const anethol = {
  id: "anethol",
  title: "Anethol",
  pubChemId: 637563,
  colorClass: "bg-data-viz-7",
  referenceLinks: [
    {
      url: "https://pubchem.ncbi.nlm.nih.gov/compound/637563",
      name: "PubChem Page",
    },
    {
      url: "https://www.scentree.co/en/Anethole.html",
      name: "Scentree Page",
    },
  ],
} as const satisfies MoleculeSchema;

const ethanethiol = {
  id: "ethanethiol",
  title: "Ethanethiol (Sulfur compound)",
  pubChemId: 6343,
  colorClass: "bg-data-viz-8",
  referenceLinks: [
    {
      url: "https://pubchem.ncbi.nlm.nih.gov/compound/6343",
      name: "PubChem Page",
    },
  ],
} as const satisfies MoleculeSchema;

export const idToMolecule = {
  ethylButyrate,
  lactones,
  benzaldehyde,
  calone,
  aldehydeC10,
  roseOxide,
  anethol,
  ethanethiol,
} as const satisfies Record<string, MoleculeSchema>;

export const molecules = Object.values(idToMolecule) satisfies MoleculeSchema[];

export type MoleculeId = keyof typeof idToMolecule;
export type Molecule = (typeof molecules)[number];
