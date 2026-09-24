function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <main className="error-fallback" role="alert" aria-live="assertive">
       ⚠️
      <h2>Something went wrong</h2>
      <p className="error-fallback__message">
        {error?.message || 'An unexpected error occurred.'}
      </p>
      <button
        type="button"
        className="error-fallback__retry"
        onClick={resetErrorBoundary}
      >
        Try again
      </button>

       {import.meta.env.DEV && (
        <details>
          <summary>Error details</summary>
          <pre>{error.message}</pre>
        </details>
      )}
    </main>
  )
}
export default ErrorFallback
