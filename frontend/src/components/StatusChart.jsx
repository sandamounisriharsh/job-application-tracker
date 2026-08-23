import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const COLORS = {
  Applied: '#64748b',
  Interview: '#2563eb',
  Offer: '#16a34a',
  Rejected: '#dc2626',
}

const ICONS = {
  Applied: '↗',
  Interview: '◎',
  Offer: '✓',
  Rejected: '×',
}

export default function StatusChart({ stats, statuses }) {
  const data = statuses.map((status) => ({
    status,
    count:
      stats.find((item) => item.status === status)?.count ?? 0,
  }))

  const total = data.reduce(
    (sum, item) => sum + item.count,
    0
  )

  const topStatus =
    data.length > 0
      ? data.reduce(
          (max, item) =>
            item.count > max.count ? item : max,
          data[0]
        )
      : null

  return (
    <div className="card chart-card">

      {/* HEADER */}
      <div className="chart-header">

        <div>
          <span className="section-kicker">
            Analytics
          </span>

          <h2>Status breakdown</h2>
        </div>

        <div className="chart-total">
          <strong>{total}</strong>
          <span>Total</span>
        </div>

      </div>


      {/* CHART */}
      <div className="chart-wrapper">

        <ResponsiveContainer
          width="100%"
          height={200}
        >
          <BarChart
            data={data}
            margin={{
              top: 12,
              right: 4,
              left: -24,
              bottom: 0,
            }}
            barCategoryGap="28%"
          >

            <XAxis
              dataKey="status"
              tick={{
                fontSize: 10,
                fill: '#737b8c',
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              allowDecimals={false}
              tick={{
                fontSize: 10,
                fill: '#9aa2b1',
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip
              cursor={{
                fill: 'rgba(79, 70, 229, 0.04)',
              }}
              contentStyle={{
                borderRadius: '10px',
                border: '1px solid #e7e9ef',
                boxShadow:
                  '0 8px 24px rgba(20, 25, 35, 0.08)',
                fontSize: '12px',
              }}
              formatter={(value) => [
                value,
                'Applications',
              ]}
            />

            <Bar
              dataKey="count"
              radius={[7, 7, 2, 2]}
              maxBarSize={38}
            >

              {data.map((entry) => (
                <Cell
                  key={entry.status}
                  fill={COLORS[entry.status]}
                />
              ))}

            </Bar>

          </BarChart>
        </ResponsiveContainer>

      </div>


      {/* SUMMARY */}
      {topStatus && total > 0 && (
        <div className="chart-summary">

          <div className="summary-icon">
            {ICONS[topStatus.status]}
          </div>

          <div>
            <span>Most common status</span>

            <strong>
              {topStatus.status}
            </strong>
          </div>

          <b>
            {Math.round(
              (topStatus.count / total) * 100
            )}
            %
          </b>

        </div>
      )}


      {/* LEGEND */}
      <div className="chart-legend">

        {data.map((item) => (

          <div
            className="legend-item"
            key={item.status}
          >

            <span
              className="legend-dot"
              style={{
                backgroundColor:
                  COLORS[item.status],
              }}
            />

            <span>{item.status}</span>

            <strong>{item.count}</strong>

          </div>

        ))}

      </div>

    </div>
  )
}