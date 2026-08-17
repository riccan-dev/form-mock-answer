import type { OptionCount } from '@/lib/mockResults';

export default function ResultsBarChart({
  data,
  total,
}: {
  data: OptionCount[];
  total: number;
}) {
  return (
    <div>
      {data.map((item) => {
        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
        return (
          <div key={item.label} className="mb-2">
            <div className="d-flex justify-content-between small mb-1">
              <span>{item.label}</span>
              <span className="text-muted">
                {item.count}件（{pct}%）
              </span>
            </div>
            <div className="bg-light rounded" style={{ height: 8 }}>
              <div
                className="bg-primary rounded"
                style={{ width: `${pct}%`, height: 8 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
