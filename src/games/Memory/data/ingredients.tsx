export type IngredientSchema = {
  id: string;
  title: string;
};

const pineapple = {
  id: "pineapple",
  title: "Pineapple",
} as const satisfies IngredientSchema;

const cheese = {
  id: "cheese",
  title: "Cheese",
} as const satisfies IngredientSchema;

const apricot = {
  id: "apricot",
  title: "Apricot",
} as const satisfies IngredientSchema;

const peach = {
  id: "peach",
  title: "Peach",
} as const satisfies IngredientSchema;

const cherry = {
  id: "cherry",
  title: "Cherry",
} as const satisfies IngredientSchema;

const almond = {
  id: "almond",
  title: "Almond",
} as const satisfies IngredientSchema;

const cucumber = {
  id: "cucumber",
  title: "Cucumber",
} as const satisfies IngredientSchema;

const seaWater = {
  id: "seaWater",
  title: "Sea Water",
} as const satisfies IngredientSchema;

const coriander = {
  id: "coriander",
  title: "Coriander",
} as const satisfies IngredientSchema;

const soap = {
  id: "soap",
  title: "Soap",
} as const satisfies IngredientSchema;

const litchi = {
  id: "litchi",
  title: "Litchi",
} as const satisfies IngredientSchema;

const rose = {
  id: "rose",
  title: "Rose",
} as const satisfies IngredientSchema;

const licorice = {
  id: "licorice",
  title: "Licorice",
} as const satisfies IngredientSchema;

const fennel = {
  id: "fennel",
  title: "Fennel",
} as const satisfies IngredientSchema;

const truffle = {
  id: "truffle",
  title: "Truffle",
} as const satisfies IngredientSchema;

const gas = {
  id: "gas",
  title: "Gas",
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

export const ingredients = Object.values(idToIngredient) satisfies IngredientSchema[];

export type IngredientId = keyof typeof idToIngredient;
export type Ingredient = (typeof ingredients)[number];
