import { idToIngredient, IngredientId } from "@memory/data/ingredients";
import { idToMolecule, type MoleculeId } from "@memory/data/molecules";
import {
  floral,
  fresh,
  OlfactiveFamilyId,
  oriental,
} from "@memory/data/olfactiveFamilies";

type MemoryPairSchema = {
  id: string;
  title: string;
  description: string;
  molecule: MoleculeId;
  family: OlfactiveFamilyId;
  ingredients: [IngredientId, IngredientId];
};

const toPairId = <T extends string>(s: T) => `pair-${s}` as const;

const pair1 = {
  id: toPairId(idToMolecule.ethylButyrate.id),
  title: idToMolecule.ethylButyrate.title,
  description:
    "Bon là tu t'es fait avoir hihi! Car c'est techniquement un peu un piège. Le butyrate d'éthyle (odeur d'ananas) est une déclinaison proche de l'acide butirique (odeur de fromage, beurre rance, vomi ou encore sueur). C'est juste hyper marrant de se dire que juste un petit changement moléculaire peut faire passer du fruit exotique à l'odeur de parmesan. Ça veut bien dire qu'il faut faire super gaffe quand tu sens le bon \"fruit exotique miam\" car il peut probablement vite tourner à l'odeur de beure rance. Et oui, comme ton ex!",
  molecule: idToMolecule.ethylButyrate.id,
  family: fresh.id,
  ingredients: [idToIngredient.pineapple.id, idToIngredient.cheese.id],
} as const satisfies MemoryPairSchema;

const pair2 = {
  id: toPairId(idToMolecule.lactones.id),
  title: idToMolecule.lactones.title,
  description:
    "Ces molécules forment une grande famille! Quand la molécule grandi, on a une différente odeur. Stylé. Ça va de la pêche, à l'abricot, à la noix de coco, jusqu'au beurre! C'est clairement une famille de beaux gosses et de belles meufs qui sentent bons. Je suis sure que t'as quelqu'un en tête non? 🍑",
  molecule: idToMolecule.lactones.id,
  family: oriental.id,
  ingredients: [idToIngredient.apricot.id, idToIngredient.peach.id],
} as const satisfies MemoryPairSchema;

const pair3 = {
  id: toPairId(idToMolecule.benzaldehyde.id),
  title: idToMolecule.benzaldehyde.title,
  description:
    "Comme l'a dit Panoramix: \"tout est question de dosage!\". En gros selon la quantité présente de ce composé tu peux sentir ou l'amande amère, ou la cerise. Bien sur, les autres molécules odorantes autours de la composition parfumée dirige la tendance amande ou cerise. Fin voilà c'est logique après.",
  molecule: idToMolecule.benzaldehyde.id,
  family: floral.id,
  ingredients: [idToIngredient.cherry.id, idToIngredient.almond.id],
} as const satisfies MemoryPairSchema;

const pair4 = {
  id: toPairId(idToMolecule.calone.id),
  title: idToMolecule.calone.title,
  description:
    "Découverte par accident lors de recherches sur des anxiolytiques (benzodiazépines) par le chimiste Pfizer. Le boug a cru se la coller avec des drogues mais au final il a créé un arôme concombre. Comme quoi, la vie peut vraiment être pleines de surprises. Bon après c'est grâce à ce composé qu'on a réussi a créé une odeur iodée qui a donné le jour à toute une famille de parfums emblematiques. Donc on restera anxieux mais au moins on sentira bon la brise marine.",
  molecule: idToMolecule.calone.id,
  family: floral.id,
  ingredients: [idToIngredient.cucumber.id, idToIngredient.seaWater.id],
} as const satisfies MemoryPairSchema;

const pair5 = {
  id: toPairId(idToMolecule.aldehydeC10.id),
  title: idToMolecule.aldehydeC10.title,
  description:
    "Bon facile celui-là! C'est le gène OR6A2 qui rend certaines personnes ultra-sensibles à ce type d'aldéhyde et qui percoivent un goût de savon plutôt qu'une saveur d'herbe fraîche. Pas de chance. Ça s'explique tout s'implement par la présence de ce fameux composé chimique dans les 2 ingrédients. Fun fact d'intello: cet aldehyde a donné son succès au Chanel N5 lancé en 1921.",
  molecule: idToMolecule.aldehydeC10.id,
  family: floral.id,
  ingredients: [idToIngredient.coriander.id, idToIngredient.soap.id],
} as const satisfies MemoryPairSchema;

const pair6 = {
  id: toPairId(idToMolecule.roseOxide.id),
  title: idToMolecule.roseOxide.title,
  description:
    "Et non tu n'es pas fou/folle. La rose sent le litchi et le litchi la rose, car ce composé est présent dans ces 2 ingrédients! Ce n'est qu'une histoire de dosage et d'ornements olfactifs qui fait que la tendance balancera vers l'un ou l'autre. Allez, va briller en société avec cette info.",
  molecule: idToMolecule.roseOxide.id,
  family: floral.id,
  ingredients: [idToIngredient.litchi.id, idToIngredient.rose.id],
} as const satisfies MemoryPairSchema;

const pair7 = {
  id: toPairId(idToMolecule.anethol.id),
  title: idToMolecule.anethol.title,
  description:
    "Ce composé vient principalement de l'anis. Mais il faudrait pas que le jeu soit trop facile alors on a pas mis anis. Tu peux te la peter la prochaine fois que tu bois un RICARD ou de l'OUZO: c'est l'anéthole qui est responsable de ce goût réglisse/ fenouil/ anis. D'ailleurs, cette molécule n'est pas soluble dans l'eau, c'est pour ça que ton ricard est trouble. Attention à ne pas trop en boire sinon c'est toi qui verra trouble. Lol allez next.",
  molecule: idToMolecule.anethol.id,
  family: floral.id,
  ingredients: [idToIngredient.licorice.id, idToIngredient.fennel.id],
} as const satisfies MemoryPairSchema;

const pair8 = {
  id: toPairId(idToMolecule.ethanethiol.id),
  title: "Sulfur coumpounds (ex: Ethanethiol)",
  description:
    "L'éthanethiol (t'es pas obligé de retenir le nom exact) est connu pour être ajouté au gaz naturel normalement inodore pour lui donner son odeur d'alerte en cas de fuite. Et tiens tiens! Ces composés souffrés sont aussi naturellement présent dans la truffe! L'utilisation synthétique pour imiter la truffe est courante. D'où la ressemblance olfactive. Après va pas au resto Italien en criant \"FUYEZ PAUVRE FOU\" car tu penses qui a une fuite de gaz...",
  molecule: idToMolecule.ethanethiol.id,
  family: floral.id,
  ingredients: [idToIngredient.truffle.id, idToIngredient.gas.id],
} as const satisfies MemoryPairSchema;

export const idToMemoryPair = {
  [pair1.id]: pair1,
  [pair2.id]: pair2,
  [pair3.id]: pair3,
  [pair4.id]: pair4,
  [pair5.id]: pair5,
  [pair6.id]: pair6,
  [pair7.id]: pair7,
  [pair8.id]: pair8,
} as const satisfies Record<string, MemoryPairSchema>;

export const memoryPairs = Object.values(
  idToMemoryPair,
) satisfies MemoryPairSchema[];

export type MemoryPairId = keyof typeof idToMemoryPair;
export type MemoryPair = (typeof memoryPairs)[number];

const ingredientPairEntries = memoryPairs.flatMap((pair) =>
  pair.ingredients.map((ingredientId) => [ingredientId, pair] as const),
);

const ingredientToPair = Object.fromEntries(ingredientPairEntries) as Record<
  IngredientId,
  MemoryPair
>;

export const ingredientIdToPair = (id: IngredientId) => ingredientToPair[id];
