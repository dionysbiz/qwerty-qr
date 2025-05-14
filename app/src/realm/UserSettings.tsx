

export interface IListUser {
  id: string,
  name: string;
  deliverAddress: string;
  langPref: string;
}

export type {IListUser as IListUserType}

export const UserSettingsSchema = {
  name: 'UserSettings',
  primaryKey: 'id',
  properties: {
    id: 'string',
    name:  'string',
    deliverAddress: 'string',
    langPref: 'string',
  }
};