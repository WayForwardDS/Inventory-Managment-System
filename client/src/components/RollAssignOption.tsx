import { Listbox } from '@headlessui/react';
import { useState } from 'react';

const roles = [
  { id: 1, name: 'Select a role', value: '' },
  { id: 2, name: 'Manager', value: 'Manager' },
  { id: 3, name: 'Stock Manager', value: 'Stock-Manager' },
  { id: 4, name: 'Mixture', value: 'Mixture' },
];

type Props = {
  register: any;
  setValue: any; 
};

function RollAssignOption({ register, setValue }: Props) {
  const [selectedRole, setSelectedRole] = useState(roles[0]); 
  const handleRoleChange = (role: any) => {
    setSelectedRole(role);
    setValue('role', role.value);
  };

  return (
    <div className="relative mb-4">
      <Listbox value={selectedRole} onChange={handleRoleChange}>
        <Listbox.Button className="w-full p-2 text-base bg-white border rounded text-start border-gray1 focus:outline-none">
        {selectedRole.name !== 'Select a role'? selectedRole.name : "Select a role"} 
        </Listbox.Button>
        <Listbox.Options className="absolute z-20 w-full mt-1 text-sm bg-white border border-gray-300 rounded shadow-md">
          {roles.map((role) => (
            <Listbox.Option
              key={role.id}
              value={role}
              disabled={role.id === 1}
              className={`px-2 py-1 cursor-pointer ${
                role.id === 1 ? "text-gray-400 cursor-not-allowed hidden" : "hover:bg-gray-200"
              }`}
            >
              {role.name}
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
      <input type="hidden" {...register('role', { required: true })} value={selectedRole.value} />
    </div>
  );
}

export default RollAssignOption;
