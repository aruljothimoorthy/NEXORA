import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export default function ProductivityChart({ data = [] }) {
  const hasData = data.some((d) => d.completed > 0)

  return (
    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-semibold">Productivity</h2>
          <p className="mt-1 text-sm text-nexora-muted">Tasks completed in the last 7 days</p>
        </div>
      </div>

      <div className="h-64 w-full">
        {!hasData ? (
          <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-nexora-muted">
            Complete tasks to see your weekly trend.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="productivityFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: '#94A3B8', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#0B1020',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  color: '#F8FAFC',
                }}
                labelStyle={{ color: '#94A3B8' }}
              />
              <Area
                type="monotone"
                dataKey="completed"
                stroke="#8B5CF6"
                strokeWidth={2.5}
                fill="url(#productivityFill)"
                name="Completed"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
