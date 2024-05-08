import { Character } from "./Character";

export type Location = {
  id:	number;
  name:	string;	
  type:	string;
  dimension:	string;
  residents:	Character[];
  url:	string;
  created:	string;
}
