// @flow
import React from 'react'
import TextField from '@atlaskit/textfield'
import Button, { ButtonGroup } from '@atlaskit/button'
import { Checkbox } from '@atlaskit/checkbox'
import Form, {
  CheckboxField,
  Field,
  FormFooter,
  HelperMessage,
  ErrorMessage,
  ValidMessage,
} from '@atlaskit/form'

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
          <Field name="username" label="User name" isRequired defaultValue="">
            {({ fieldProps, error }) => (
              <>
                <TextField autoComplete="off" {...fieldProps} />
                {!error && (
                  <HelperMessage>
                    You can use letters, numbers & periods.
                  </HelperMessage>
                )}
                {error && (
                  <ErrorMessage>
                    This user name is already in use, try another one.
                  </ErrorMessage>
                )}
              </>
            )}
          </Field>
          <Field
            name="password"
            label="Password"
            defaultValue=""
            isRequired
            validate={value => (value.length < 8 ? 'TOO_SHORT' : undefined)}
          >
            {({ fieldProps, error, meta }) => (
              <>
                <TextField type="password" {...fieldProps} />
                {!error && !meta.valid && (
                  <HelperMessage>
                    Use 8 or more characters with a mix of letters, numbers &
                    symbols.
                  </HelperMessage>
                )}
                {error && (
                  <ErrorMessage>
                    Password needs to be more than 8 characters.
                  </ErrorMessage>
                )}
                {meta.valid && <ValidMessage>Awesome password!</ValidMessage>}
              </>
            )}
          </Field>
          <CheckboxField name="remember" label="Remember me" defaultIsChecked>
            {({ fieldProps }) => (
              <Checkbox {...fieldProps} label="Always sign in on this device" />
            )}
          </CheckboxField>
          <FormFooter>
            <ButtonGroup>
              <Button appearance="subtle">Cancel</Button>
              <Button type="submit" appearance="primary" isLoading={submitting}>
                Sign up
              </Button>
            </ButtonGroup>
          </FormFooter>
        </form>
      )}
    </Form>
  </div>
)
