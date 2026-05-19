import { Button } from '@/components/ui/button';
import { CreateProduct } from './create';
import { EnhancedProductTable } from '../../components/enhanced-product-table';

export default function ProductPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        <CreateProduct>
          <Button>Create Product</Button>
        </CreateProduct>
      </div>

      <EnhancedProductTable />
    </div>
  );
}
