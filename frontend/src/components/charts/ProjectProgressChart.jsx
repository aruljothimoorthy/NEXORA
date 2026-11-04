import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function ProjectProgressChart({ data = [] }) {
  const chartData = data.slice(0, 6).map((project) => ({
    name:
      project.name.length > 14 ? `${project.name.slice(0, 14)}…` : project.name,
    progress: project.progress,
    color: project.color || '#8B5CF6',
  }))

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
      <div className="mb-4">
        <h2 className="font-display text-lg font-semibold">Project progress</h2>
        <p className="mt-1 text-sm text-nexora-muted">Completion across your active workspace</p>
      </div>

      <div className="h-64 w-full">
        {!chartData.length ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-nexora-muted">
            Create a project to track progress here.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 8, right: 8, left: -18, bottom: 8 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#94A3B8', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                unit="%"
              />
              <Tooltip
                formatter={(value) => [`${value}%`, 'Progress']}
                contentStyle={{
                  background: '#0B1020',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  color: '#F8FAFC',
                }}
              />
              <Bar dataKey="progress" radius={[8, 8, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
