const CodePreviewBlock = () => {
  return (
    <section className="max-w-2xl mx-auto px-6 pb-24">
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted">
          <span className="w-3 h-3 rounded-full bg-destructive opacity-70"></span>
          <span className="w-3 h-3 rounded-full bg-chart-3 opacity-70"></span>
          <span className="w-3 h-3 rounded-full bg-chart-1 opacity-70"></span>
          <span className="ml-3 text-xs text-muted-foreground font-mono">
            bug-report.md
          </span>
        </div>
        {/* Content */}
        <div
          className="p-5 font-mono text-sm leading-7"
          style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
        >
          <div className="text-muted-foreground">
            <span className="text-chart-2">#</span> Bug #42 — Auth token not
            refreshing
          </div>
          <div className="text-muted-foreground mt-1">
            <span className="text-chart-1">Status:</span>{' '}
            <span className="text-primary">Resolved</span>
          </div>
          <div className="text-muted-foreground">
            <span className="text-chart-1">Root cause:</span> Race condition in
            token middleware
          </div>
          <div className="mt-3 text-muted-foreground">
            <span className="text-chart-2">##</span> Steps to reproduce
          </div>
          <div className="text-muted-foreground">
            1. Log in with short-lived token
          </div>
          <div className="text-muted-foreground">
            2. Wait for expiry without activity
          </div>
          <div className="text-muted-foreground">
            3. Make API call →{' '}
            <span className="text-destructive">401 Unauthorized</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CodePreviewBlock;
