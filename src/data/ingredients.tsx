export type IngredientSchema = {
  id: string;
  title: string;
  illustration: string;
};

const pineapple = {
  id: "pineapple",
  title: "Pineapple",
  illustration: "/memory/illustrations/pineapple.webp",
} as const satisfies IngredientSchema;

const cheese = {
  id: "cheese",
  title: "Cheese",
  illustration: "/memory/illustrations/cheese.webp",
} as const satisfies IngredientSchema;

const apricot = {
  id: "apricot",
  title: "Apricot",
  illustration: "/memory/illustrations/apricot.webp",
} as const satisfies IngredientSchema;

const peach = {
  id: "peach",
  title: "Peach",
  illustration: "/memory/illustrations/peach.webp",
} as const satisfies IngredientSchema;

const cherry = {
  id: "cherry",
  title: "Cherry",
  illustration: "/memory/illustrations/cherry.webp",
} as const satisfies IngredientSchema;

const almond = {
  id: "almond",
  title: "Almond",
  illustration: "/memory/illustrations/almond.webp",
} as const satisfies IngredientSchema;

const cucumber = {
  id: "cucumber",
  title: "Cucumber",
  illustration: "/memory/illustrations/cucumber.webp",
} as const satisfies IngredientSchema;

const seaWater = {
  id: "seaWater",
  title: "Sea Water",
  illustration: "/memory/illustrations/sea.webp",
} as const satisfies IngredientSchema;

const coriander = {
  id: "coriander",
  title: "Coriander",
  illustration: "/memory/illustrations/coriander.webp",
} as const satisfies IngredientSchema;

const soap = {
  id: "soap",
  title: "Soap",
  illustration: "/memory/illustrations/soap.webp",
} as const satisfies IngredientSchema;

const litchi = {
  id: "litchi",
  title: "Litchi",
  illustration: "/memory/illustrations/litchi.webp",
} as const satisfies IngredientSchema;

const rose = {
  id: "rose",
  title: "Rose",
  illustration: "/memory/illustrations/rose.webp",
} as const satisfies IngredientSchema;

const licorice = {
  id: "licorice",
  title: "Licorice",
  illustration: "/memory/illustrations/licorice.webp",
} as const satisfies IngredientSchema;

const fennel = {
  id: "fennel",
  title: "Fennel",
  illustration: "/memory/illustrations/fennel.webp",
} as const satisfies IngredientSchema;

const truffle = {
  id: "truffle",
  title: "Truffle",
  illustration: "/memory/illustrations/truffle.webp",
} as const satisfies IngredientSchema;

const gas = {
  id: "gas",
  title: "Gas",
  illustration: "/memory/illustrations/gas.webp",
} as const satisfies IngredientSchema;

export const idToIngredient = {
  pineapple,
  cheese,
  apricot,
  peach,
  cherry,
  almond,
  cucumber,
  seaWater,
  coriander,
  soap,
  litchi,
  rose,
  licorice,
  fennel,
  truffle,
  gas,
} as const satisfies Record<string, IngredientSchema>;

export const ingredients = Object.values(
  idToIngredient,
) satisfies IngredientSchema[];

export type IngredientId = keyof typeof idToIngredient;
export type Ingredient = (typeof ingredients)[number];
