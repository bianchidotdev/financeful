import React from 'react'
import PropTypes from 'prop-types'
import { defaultTheme, ThemeProvider } from 'evergreen-ui'

const theme = {
  ...defaultTheme
  // override default theme values here
}

const Root = ({ children }) => {
  return <ThemeProvider value={theme}>{children}</ThemeProvider>
}

Root.propTypes = {
  children: PropTypes.node
}

export const wrapRootElement = ({ element }) => {
  return <Root>{element}</Root>
}
