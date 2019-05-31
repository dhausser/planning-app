import React from 'react'
import TextField from '@atlaskit/textfield'
import Button, { ButtonGroup } from '@atlaskit/button'
import Form, { Field, FormFooter, HelperMessage } from '@atlaskit/form'

export default props => (
  <div
    style={{
      display: 'flex',
      width: '400px',
      margin: '0 auto',
      flexDirection: 'column',
    }}
  >
    <Form
      onSubmit={data =>
        new Promise(resolve => resolve(props.login({ variables: { ...data } })))
      }
    >
      {({ formProps, submitting }) => (
        <form {...formProps}>
          <Field name="username" label="User name" defaultValue="">
            {({ fieldProps, error }) => (
              <>
                <TextField autoComplete="off" {...fieldProps} />
                {!error && (
                  <HelperMessage>Use your usual Jira user name.</HelperMessage>
                )}
              </>
            )}
          </Field>
          <Field
            name="password"
            label="Password"
            defaultValue=""
            validate={value => (value.length < 8 ? 'TOO_SHORT' : undefined)}
          >
            {({ fieldProps, error }) => (
              <>
                <TextField type="password" {...fieldProps} />
                {!error && (
                  <HelperMessage>Use your usual Jira password.</HelperMessage>
                )}
              </>
            )}
          </Field>
          <FormFooter>
            <ButtonGroup>
              <Button appearance="subtle">Cancel</Button>
              <Button type="submit" appearance="primary" isLoading={submitting}>
                Sign in
              </Button>
            </ButtonGroup>
          </FormFooter>
        </form>
      )}
    </Form>
  </div>
)
