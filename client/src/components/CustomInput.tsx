import { Col, Row } from 'antd';
import { useFormContext, UseFormRegister, FieldError } from 'react-hook-form';
import React from 'react';

interface Props {
  name: string;
  label: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  hidden?: boolean;
  readOnly?: boolean;
  defaultValue?: unknown;
  className?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  errors?: Record<string, FieldError | undefined>;
  register?: UseFormRegister<any>; // Optional explicit register prop
  id?: string;
}

const CustomInput: React.FC<Props> = ({
  name,
  label,
  type = 'text',
  required = false,
  hidden = false,
  readOnly = false,
  className = '',
  onChange,
  errors = {},
  register: externalRegister,
  id = name,
}) => {
  
  const formContext = useFormContext();
  const register = externalRegister || formContext?.register;

  return (
    <Row id={id} style={{ display: hidden ? 'none' : 'flex' }}>
      <Col 
        className={readOnly ? 'text-start' : ''} 
        xs={{ span: 23 }} 
        lg={{ span: 6 }}
      >
        <label htmlFor={name} className="label">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      </Col>
      <Col xs={{ span: 23 }} lg={{ span: 18 }}>
        <input
          id={name}
          type={type}
          readOnly={readOnly}
          placeholder={label}
          className={`
            ${className}
            ${readOnly 
              ? 'w-full outline-none text-base font-semibold' 
              : 'input-field w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400'
            }
            ${errors[name] ? 'border-red-500' : ''}
          `}
          {...(register 
            ? register(name, { 
                required: required && 'This field is required',
                onChange 
              })
            : { name, onChange }
          )}
        />
        {errors?.[name] && (
          <p className="mt-1 text-sm text-red-500">
            {errors[name]?.message}
          </p>
        )}
      </Col>
    </Row>
  );
};

export default CustomInput;