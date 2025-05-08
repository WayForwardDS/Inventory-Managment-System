export interface IUser {
  name: string;
  email: string;
  role: string;
  avatar?: string;
  password: string;
  status: string;
  address?: string;
  phone?: string
}

export const profileKeys = [
  { keyName: 'name' },
  { keyName: 'email' },
  { keyName: 'role' },
  { keyName: 'status' },
  { keyName: 'address' },
  { keyName: 'phone' },
]

export const profileInputFields = [
  { id: 1, name: 'name', label: 'Name' },
  { id: 2, name: 'email', label: 'Email' },
  { id: 4, name: 'role', label: 'Role' },
  { id: 6, name: 'address', label: 'Address' },
  { id: 7, name: 'phone', label: 'Phone' },
]