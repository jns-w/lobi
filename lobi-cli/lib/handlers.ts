import React from "react";


export const inputStrHandler = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setStateFunc: React.Dispatch<React.SetStateAction<string>>) => {
  setStateFunc(e.target.value)
}

type ObjHandlerOpts = {
  type: 'number' | 'alphabet' | 'alphanumerical' | 'hour'
  qualifier?: Function
  modifier?: Function
  callback?: Function
}

export const inputObjHandler = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  setStateFunc: React.Dispatch<React.SetStateAction<any>>,
  state: object,
  opts?: ObjHandlerOpts
) => {
  let v = e.target.value
  if (e.target.value !== "" && opts) {
    switch (opts.type) {
      case 'number':
        const isNum = /^\d+$/.test(e.target.value);
        if (!isNum) return;
        break;
      case 'alphabet':
        const isAlphabetOnly = /^[a-zA-Z]+$/.test(e.target.value);
        if (!isAlphabetOnly) return;
        break;
      case 'alphanumerical':
        const isAlphanumericalOnly = /^[A-Za-z0-9]+$/gi.test(e.target.value);
        if (!isAlphanumericalOnly) return;
        break;
    }
    if (opts.qualifier && !opts.qualifier(e.target.value)) return;
  }
  if (opts?.modifier) v = opts.modifier(v);
  setStateFunc({...state, [e.target.name]: v})
  if (opts?.callback) opts.callback();
}
