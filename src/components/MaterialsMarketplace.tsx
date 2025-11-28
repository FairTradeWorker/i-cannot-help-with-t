import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GlassSurface } from './GlassSurface';
import { getDefaultGlassContext } from '@/lib/glass-context-utils';
import {
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  WarningCircle,
  MagnifyingGlass,
  ArrowRight,
  Barcode,
  Factory,
  ShoppingCart,
  Star,
  CaretDown,
} from '@phosphor-icons/react';

interface Material {
  id: string;
  name: string;
  category: string;
  supplier: string;
  price: number;
  unit: string;
  inStock: boolean;
  rating: number;
  deliveryDays: number;
  image?: string;
}

interface MaterialOrder {
  id: string;
  materials: { material: Material; quantity: number }[];
  status: 'processing' | 'shipped' | 'delivered';
  orderedAt: Date;
  estimatedDelivery: Date;
  trackingNumber?: string;
  total: number;
}

const MOCK_MATERIALS: Material[] = [
  { id: '1', name: 'Architectural Shingles - 30 Year', category: 'Roofing', supplier: 'ABC Supply', price: 89.99, unit: 'bundle', inStock: true, rating: 4.8, deliveryDays: 2 },
  { id: '2', name: 'OSB Sheathing 7/16"', category: 'Lumber', supplier: 'Home Depot Pro', price: 18.50, unit: 'sheet', inStock: true, rating: 4.5, deliveryDays: 1 },
  { id: '3', name: 'Ice & Water Shield', category: 'Roofing', supplier: 'ABC Supply', price: 125.00, unit: 'roll', inStock: true, rating: 4.9, deliveryDays: 2 },
  { id: '4', name: 'Ridge Vent 4ft', category: 'Ventilation', supplier: 'Roofing Wholesale', price: 12.99, unit: 'piece', inStock: false, rating: 4.6, deliveryDays: 3 },
  { id: '5', name: 'Drip Edge 10ft', category: 'Roofing', supplier: 'ABC Supply', price: 8.50, unit: 'piece', inStock: true, rating: 4.7, deliveryDays: 2 },
  { id: '6', name: 'Roofing Nails 1-1/4"', category: 'Fasteners', supplier: 'Fastener Depot', price: 45.00, unit: 'box', inStock: true, rating: 4.4, deliveryDays: 1 },
];

const MOCK_ORDERS: MaterialOrder[] = [
  {
    id: 'ORD-001',
    materials: [
      { material: MOCK_MATERIALS[0], quantity: 45 },
      { material: MOCK_MATERIALS[2], quantity: 6 },
    ],
    status: 'shipped',
    orderedAt: new Date(Date.now() - 86400000 * 2),
    estimatedDelivery: new Date(Date.now() + 86400000),
    trackingNumber: '1Z999AA10123456784',
    total: 4799.55,
  },
  {
    id: 'ORD-002',
    materials: [
      { material: MOCK_MATERIALS[1], quantity: 30 },
      { material: MOCK_MATERIALS[5], quantity: 4 },
    ],
    status: 'delivered',
    orderedAt: new Date(Date.now() - 86400000 * 5),
    estimatedDelivery: new Date(Date.now() - 86400000 * 2),
    total: 735.00,
  },
];

const STATUS_CONFIG = {
  processing: { label: 'Processing', color: 'bg-yellow-100 text-yellow-700', progress: 25 },
  shipped: { label: 'Shipped', color: 'bg-blue-100 text-blue-700', progress: 75 },
  delivered: { label: 'Delivered', color: 'bg-green-100 text-green-700', progress: 100 },
};

export function MaterialsMarketplace() {
  const [materials] = useState<Material[]>(MOCK_MATERIALS);
  const [orders] = useState<MaterialOrder[]>(MOCK_ORDERS);
  const [cart, setCart] = useState<{ material: Material; quantity: number }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', ...new Set(materials.map(m => m.category))];

  const filteredMaterials = materials.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (material: Material) => {
    setCart(prev => {
      const existing = prev.find(item => item.material.id === material.id);
      if (existing) {
        return prev.map(item =>
          item.material.id === material.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { material, quantity: 1 }];
    });
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.material.price * item.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="w-7 h-7" />
            Materials Marketplace
          </h2>
          <p className="text-muted-foreground">Order materials directly for your jobs</p>
        </div>
        <Button className="relative">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Cart ({cart.length})
          {cart.length > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 flex items-center justify-center">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </Badge>
          )}
        </Button>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList>
          <TabsTrigger value="browse">Browse Materials</TabsTrigger>
          <TabsTrigger value="orders">My Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-4">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search materials..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {categories.map(cat => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className="capitalize"
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Materials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMaterials.map(material => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
              >
                <GlassSurface
                  id={`material-${material.id}`}
                  context={{
                    ...getDefaultGlassContext(),
                    serviceCategory: 'materials',
                    confidence: material.rating / 5,
                    urgency: material.inStock ? 'low' : 'medium'
                  }}
                >
                  <Card className="p-4 border-0 bg-transparent">
                    <div className="flex items-start justify-between mb-3">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <Package className="w-6 h-6 text-primary" />
                    </div>
                    {material.inStock ? (
                      <Badge className="bg-green-100 text-green-700">In Stock</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700">Out of Stock</Badge>
                    )}
                  </div>

                  <h4 className="font-semibold mb-1">{material.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{material.supplier}</p>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500" weight="fill" />
                      <span className="text-sm">{material.rating}</span>
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1">
                      <Truck className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{material.deliveryDays}d delivery</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold">${material.price.toFixed(2)}</span>
                      <span className="text-sm text-muted-foreground">/{material.unit}</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => addToCart(material)}
                      disabled={!material.inStock}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </Card>
                </GlassSurface>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          {orders.map(order => (
            <GlassSurface
              key={order.id}
              id={`order-${order.id}`}
              context={{
                ...getDefaultGlassContext(),
                serviceCategory: 'materials',
                completion: STATUS_CONFIG[order.status].progress / 100,
                urgency: order.status === 'processing' ? 'medium' : 'low'
              }}
            >
              <Card className="p-4 border-0 bg-transparent">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold">{order.id}</h4>
                  <p className="text-sm text-muted-foreground">
                    Ordered {order.orderedAt.toLocaleDateString()}
                  </p>
                </div>
                <Badge className={STATUS_CONFIG[order.status].color}>
                  {STATUS_CONFIG[order.status].label}
                </Badge>
              </div>

              {/* Order Progress */}
              <div className="mb-4">
                <Progress value={STATUS_CONFIG[order.status].progress} className="h-2" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>Ordered</span>
                  <span>Processing</span>
                  <span>Shipped</span>
                  <span>Delivered</span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-4">
                {order.materials.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-muted flex items-center justify-center">
                        <Package className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{item.material.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium">
                      ${(item.material.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  {order.trackingNumber && (
                    <div className="flex items-center gap-2 text-sm">
                      <Barcode className="w-4 h-4" />
                      <span>Tracking: {order.trackingNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Est. delivery: {order.estimatedDelivery.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                </div>
              </div>
            </Card>
            </GlassSurface>
          ))}
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['ABC Supply', 'Home Depot Pro', 'Roofing Wholesale', 'Fastener Depot'].map(supplier => (
              <GlassSurface
                key={supplier}
                id={`supplier-${supplier}`}
                context={{
                  ...getDefaultGlassContext(),
                  serviceCategory: 'materials',
                  confidence: 0.9
                }}
              >
                <Card className="p-4 border-0 bg-transparent">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-xl bg-primary/10">
                    <Factory className="w-8 h-8 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{supplier}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>Multiple locations</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500" weight="fill" />
                      <span className="text-sm">4.7 • 500+ orders</span>
                    </div>
                  </div>
                  <Button variant="outline">
                    View Products
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </Card>
              </GlassSurface>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Cart Summary (when items in cart) */}
      {cart.length > 0 && (
        <GlassSurface
          id="cart-summary"
          context={{
            ...getDefaultGlassContext(),
            serviceCategory: 'materials',
            urgency: 'medium',
            confidence: 0.9
          }}
          className="fixed bottom-6 right-6 w-80 shadow-2xl"
        >
          <Card className="p-4 border-0 bg-transparent">
          <h4 className="font-semibold mb-3">Cart Summary</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto mb-4">
            {cart.map(item => (
              <div key={item.material.id} className="flex justify-between text-sm">
                <span>{item.material.name} x{item.quantity}</span>
                <span>${(item.material.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between font-bold border-t pt-2 mb-3">
            <span>Total</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>
          <Button className="w-full">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Checkout
          </Button>
        </Card>
      )}
    </div>
  );
}
