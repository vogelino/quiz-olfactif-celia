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
  colorClass: "bg-red-500",
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
  colorClass: "bg-yellow-500",
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
  colorClass: "bg-green-500",
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
  title: "Calone (7-Methyl-2H-1,5-benzodioxepin-3(4H)-one)",
  pubChemId: 6432154,
  colorClass: "bg-cyan-500",
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
  colorClass: "bg-indigo-500",
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
  colorClass: "bg-fuchsia-500",
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
  colorClass: "bg-slate-500",
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
  colorClass: "bg-mauve-500",
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
