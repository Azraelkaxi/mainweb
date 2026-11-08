import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

type ErrorBoundaryProps = {
  children: ReactNode
}

type ErrorBoundaryState = {
  error: Error | null
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Keep the failure contained to the page area; the shell remains available.
  }

  render() {
    const { error } = this.state

    if (error) {
      return (
        <section className="error-state" role="alert">
          <p className="eyebrow">暂时迷失</p>
          <h1>这里出了些问题</h1>
          <p className="error-summary">
            {error.message || '页面暂时无法显示。'}
          </p>
          <Link
            className="error-home-link"
            to="/"
            onClick={() => this.setState({ error: null })}
          >
            回到理想国
          </Link>
        </section>
      )
    }

    return this.props.children
  }
}
