type ClientStatusCode = '1' | '2' | '3' | '4' | '5';
type NumberRange = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
export type HttpStatusResponse =
  `${ClientStatusCode}${NumberRange}${NumberRange}`;
