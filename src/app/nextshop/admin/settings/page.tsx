export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">System</p>
        <h1 className="text-3xl font-semibold text-zinc-900">Settings</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-zinc-900">Appearance</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Customize the admin skin, notification cadence, and housekeeping
            preferences before launch.
          </p>
        </div>
        <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-zinc-900">Security</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Enable multi-factor auth, control session durations, and manage role
            assignments for collaborators.
          </p>
        </div>
      </div>
    </div>
  );
}
