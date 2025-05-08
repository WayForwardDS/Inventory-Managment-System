import { Col, Row } from 'antd';

interface Props {
  name: string;
  errors?: any;
  label: string;
  type?: string;
  register: any;
  required?: boolean;
  defaultValue?: any;
  className?: string;
}

const CustomTextArea = ({
  name,
  errors = {},
  required = false,
  label,
  register,
  className= '',
  type = 'text',
}: Props) => {


  return (
    <Row>
      <Col xs={{ span: 23 }} lg={{ span: 6 }}>
        <label htmlFor={name} className='label'>
          {label}
        </label>
      </Col>
      <Col xs={{ span: 23 }} lg={{ span: 18 }}>
        <textarea
          id={name}
          type={type}
          placeholder={"Please Add Additional Information"}
          {...register(name, { required: required })}
          className={`min-h-28 ${className} ${errors[name] ? 'input-field-error' : 'input-field w-full px-4 py-3 text-white bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-400'}`}

        />
      </Col>
    </Row>
  );
};

export default CustomTextArea;
