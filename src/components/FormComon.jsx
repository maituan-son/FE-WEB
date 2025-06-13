import React from 'react'
import styled from '@emotion/styled'
const Form = styled.form`
	padding: 24px;
	margin: 0 auto;
	border: 1px solid #ccc;
	border-radius: 8px;
	box-shadow: 0 0 12px rgba(0, 0, 0, 0.5);
	width: 700px;
	max-width: 100%;
`;

const FormComon = ( {children , handleSubmit}) => {
  return <Form onSubmit={handleSubmit}> {children}</Form>
}

export default FormComon