import {atom, WritableAtom} from "jotai";
import { focusAtom } from "jotai-optics";

type GamesAtomType = {
  items: string[];
  resultOf: "" | "upcoming" | "searched" | "featured";
  page: number | undefined;
  pageCount: number | undefined;
  limit: number | undefined;
  itemsCount: number | undefined;
  timestamp: Date;
};

export const gameBoardAtom = atom<GamesAtomType>({
  items: [],
  resultOf: "",
  page: undefined,
  pageCount: undefined,
  limit: undefined,
  itemsCount: undefined,
  timestamp: new Date(),
});

export const gamesListAtom: WritableAtom<any, string[], any> = focusAtom(gameBoardAtom, (optic: any) =>
  optic.prop("items")
);
export const resultOfAtom: WritableAtom<string | undefined, any, void> = focusAtom(gameBoardAtom, (optic: any) =>
  optic.prop("resultOf")
);
export const pageAtom: WritableAtom<number | undefined, any, void> = focusAtom(gameBoardAtom, (optic: any) =>
  optic.prop("page")
);
export const limitAtom: WritableAtom<number | undefined, any, void> = focusAtom(gameBoardAtom, (optic: any) =>
  optic.prop("limit")
);
export const itemsCountAtom: WritableAtom<number | undefined, any, void> = focusAtom(gameBoardAtom, (optic: any) =>
  optic.prop("itemsCount")
);
export const pageCountAtom: WritableAtom<number | undefined, any, void> = focusAtom(gameBoardAtom, (optic: any) => optic.prop("pageCount"));

export const goToPageAtom = atom<number>(1);