import { Dispatch, SetStateAction } from 'react';
import { OptionType } from '@atlaskit/select';

export interface ModalInterfaceProps {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export interface NamePlateProps {
  id: string;
}

export interface Team {
  id: string;
}

export interface ResourceForm {
  firstname: string;
  lastname: string;
  email: string;
  team: OptionType;
}

export interface Resource {
  key: string;
  name: string;
  team: string;
}

export interface FieldProps {
  firstname: string;
  lastname: string;
  email: string;
  team: OptionType;
}
