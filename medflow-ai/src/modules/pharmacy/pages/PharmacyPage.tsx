import { useState } from 'react';
import { DataPage } from '../../../shared/components/DataPage';
import { Badge } from '../../../shared/components/Badge/Badge';
import { Button } from '../../../shared/components/Button/Button';
import { useToast } from '../../../shared/components/Toast/Toast';
import { pharmacyApi } from '../../../core/api/services';
import { ApiError } from '../../../core/api/client';
import { formatDate, formatMoney } from '../../../core/utils/format';
import type { Medication } from '../../../core/api/types';

export default function PharmacyPage() {
  const { show } = useToast();
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [version, setVersion] = useState(0);

  async function restock(row: Medication, delta: number) {
    try {
      await pharmacyApi.adjustStock(row.id, delta);
      show({ title: `${row.name}: stock ${delta > 0 ? '+' : ''}${delta}`, tone: 'success' });
      setVersion((v) => v + 1);
    } catch (cause) {
      show({
        title: 'Could not adjust stock',
        description: cause instanceof ApiError ? cause.message : undefined,
        tone: 'danger',
      });
    }
  }

  return (
    <DataPage<Medication>
      title="Pharmacy"
      description="Medication catalogue, stock levels and reorder alerts."
      searchPlaceholder="Search by name or category…"
      rowKey={(row) => row.id}
      deps={[lowStockOnly, version]}
      load={({ page, size, query }) => pharmacyApi.list({ page, size, query, lowStockOnly })}
      emptyMessage="No medications match this filter."
      toolbar={
        <Button
          size="sm"
          variant={lowStockOnly ? 'primary' : 'outline'}
          onClick={() => setLowStockOnly((value) => !value)}
        >
          {lowStockOnly ? 'Showing reorder list' : 'Show reorder list'}
        </Button>
      }
      columns={[
        { key: 'name', header: 'Medication', render: (row) => row.name },
        { key: 'category', header: 'Category', render: (row) => row.category },
        { key: 'price', header: 'Unit price', align: 'right', render: (row) => formatMoney(row.unitPrice) },
        {
          key: 'stock',
          header: 'Stock',
          align: 'right',
          render: (row) => (
            <Badge tone={row.lowStock ? 'coral' : 'green'}>
              {row.stockQuantity} / reorder at {row.reorderLevel}
            </Badge>
          ),
        },
        { key: 'expiry', header: 'Expires', render: (row) => formatDate(row.expiryDate) },
        {
          key: 'action',
          header: '',
          align: 'right',
          render: (row) => (
            <div style={{ display: 'flex', gap: 'var(--mf-space-2)', justifyContent: 'flex-end' }}>
              <Button size="sm" variant="outline" onClick={() => restock(row, 10)}>
                +10
              </Button>
              <Button size="sm" variant="ghost" onClick={() => restock(row, -1)}>
                Dispense
              </Button>
            </div>
          ),
        },
      ]}
    />
  );
}
