/**
 * Vehicle & Equipment Tracker
 * Track work vehicles, equipment, and maintenance schedules
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Car, Wrench, Calendar, DollarSign, AlertTriangle, 
  CheckCircle, MapPin, Fuel, Timer, Plus, Search,
  TrendingUp, BarChart3, Settings, Clock
} from 'lucide-react';

interface Vehicle {
  id: string;
  name: string;
  type: 'truck' | 'van' | 'trailer' | 'equipment';
  make: string;
  model: string;
  year: number;
  licensePlate?: string;
  vin?: string;
  mileage: number;
  fuelLevel: number;
  status: 'active' | 'maintenance' | 'repair' | 'inactive';
  assignedTo?: string;
  lastService: Date;
  nextService: Date;
  insuranceExpiry: Date;
  registrationExpiry: Date;
  purchaseDate: Date;
  purchasePrice: number;
  currentValue: number;
  maintenanceHistory: MaintenanceRecord[];
  fuelLogs: FuelLog[];
}

interface MaintenanceRecord {
  id: string;
  date: Date;
  type: string;
  description: string;
  cost: number;
  mileage: number;
  vendor: string;
}

interface FuelLog {
  id: string;
  date: Date;
  gallons: number;
  cost: number;
  mileage: number;
  location: string;
}

const mockVehicles: Vehicle[] = [
  {
    id: '1',
    name: 'Work Truck 1',
    type: 'truck',
    make: 'Ford',
    model: 'F-150',
    year: 2022,
    licensePlate: 'ABC-1234',
    vin: '1FTEW1EP5NFA12345',
    mileage: 45230,
    fuelLevel: 75,
    status: 'active',
    assignedTo: 'Mike Johnson',
    lastService: new Date('2024-01-15'),
    nextService: new Date('2024-04-15'),
    insuranceExpiry: new Date('2024-12-01'),
    registrationExpiry: new Date('2024-08-15'),
    purchaseDate: new Date('2022-03-01'),
    purchasePrice: 52000,
    currentValue: 42000,
    maintenanceHistory: [
      { id: '1', date: new Date('2024-01-15'), type: 'Oil Change', description: 'Full synthetic oil change + filter', cost: 89.99, mileage: 45000, vendor: 'Jiffy Lube' },
      { id: '2', date: new Date('2023-10-20'), type: 'Tire Rotation', description: 'Tire rotation and balance', cost: 45.00, mileage: 42000, vendor: 'Discount Tire' },
      { id: '3', date: new Date('2023-07-10'), type: 'Brake Service', description: 'Front brake pads replaced', cost: 250.00, mileage: 38000, vendor: 'AutoZone' },
    ],
    fuelLogs: [
      { id: '1', date: new Date('2024-02-05'), gallons: 22.5, cost: 78.75, mileage: 45230, location: 'Shell - Austin' },
      { id: '2', date: new Date('2024-02-01'), gallons: 20.8, cost: 72.80, mileage: 44890, location: 'Exxon - Round Rock' },
    ],
  },
  {
    id: '2',
    name: 'Service Van',
    type: 'van',
    make: 'Ram',
    model: 'ProMaster',
    year: 2021,
    licensePlate: 'XYZ-5678',
    vin: '3C6TRVAG8ME123456',
    mileage: 62450,
    fuelLevel: 30,
    status: 'active',
    assignedTo: 'Sarah Williams',
    lastService: new Date('2024-01-28'),
    nextService: new Date('2024-04-28'),
    insuranceExpiry: new Date('2024-11-15'),
    registrationExpiry: new Date('2024-06-30'),
    purchaseDate: new Date('2021-06-15'),
    purchasePrice: 38000,
    currentValue: 28000,
    maintenanceHistory: [
      { id: '1', date: new Date('2024-01-28'), type: 'Oil Change', description: 'Oil change and inspection', cost: 75.00, mileage: 62000, vendor: 'Firestone' },
    ],
    fuelLogs: [
      { id: '1', date: new Date('2024-02-04'), gallons: 18.2, cost: 63.70, mileage: 62450, location: 'Chevron - Austin' },
    ],
  },
  {
    id: '3',
    name: 'Utility Trailer',
    type: 'trailer',
    make: 'Big Tex',
    model: '70CH',
    year: 2020,
    licensePlate: 'TRL-9012',
    mileage: 0,
    fuelLevel: 0,
    status: 'active',
    lastService: new Date('2023-12-01'),
    nextService: new Date('2024-06-01'),
    insuranceExpiry: new Date('2024-09-01'),
    registrationExpiry: new Date('2024-05-01'),
    purchaseDate: new Date('2020-04-01'),
    purchasePrice: 3500,
    currentValue: 2800,
    maintenanceHistory: [
      { id: '1', date: new Date('2023-12-01'), type: 'Annual Inspection', description: 'Bearings, lights, and safety check', cost: 125.00, mileage: 0, vendor: 'Local Trailer Shop' },
    ],
    fuelLogs: [],
  },
  {
    id: '4',
    name: 'Skid Steer',
    type: 'equipment',
    make: 'Bobcat',
    model: 'S650',
    year: 2019,
    mileage: 1250,
    fuelLevel: 50,
    status: 'maintenance',
    lastService: new Date('2024-01-10'),
    nextService: new Date('2024-02-10'),
    insuranceExpiry: new Date('2024-10-01'),
    registrationExpiry: new Date('2024-10-01'),
    purchaseDate: new Date('2019-08-01'),
    purchasePrice: 45000,
    currentValue: 32000,
    maintenanceHistory: [
      { id: '1', date: new Date('2024-01-10'), type: 'Filter Change', description: 'Hydraulic and air filter replacement', cost: 350.00, mileage: 1200, vendor: 'Bobcat Dealer' },
    ],
    fuelLogs: [
      { id: '1', date: new Date('2024-02-03'), gallons: 15.0, cost: 52.50, mileage: 1250, location: 'On-site Delivery' },
    ],
  },
];

const typeIcons = {
  truck: '🚛',
  van: '🚐',
  trailer: '🚚',
  equipment: '🏗️',
};

const statusColors = {
  active: 'bg-green-100 text-green-700',
  maintenance: 'bg-yellow-100 text-yellow-700',
  repair: 'bg-red-100 text-red-700',
  inactive: 'bg-gray-100 text-gray-700',
};

export function VehicleTracker() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'maintenance' | 'fuel'>('overview');

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [vehicles, searchQuery, typeFilter]);

  const stats = useMemo(() => {
    const totalValue = vehicles.reduce((sum, v) => sum + v.currentValue, 0);
    const maintenanceDue = vehicles.filter(v => new Date(v.nextService) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length;
    const totalFuelCost = vehicles.reduce((sum, v) => 
      sum + v.fuelLogs.reduce((fSum, log) => fSum + log.cost, 0), 0
    );
    const totalMaintenanceCost = vehicles.reduce((sum, v) => 
      sum + v.maintenanceHistory.reduce((mSum, record) => mSum + record.cost, 0), 0
    );
    return { totalValue, maintenanceDue, totalFuelCost, totalMaintenanceCost };
  }, [vehicles]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  const getDaysUntil = (date: Date) => {
    const diff = date.getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vehicle & Equipment Tracker</h1>
            <p className="text-gray-600 mt-1">Manage your fleet and equipment maintenance</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Vehicle
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Car className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fleet Value</p>
                  <p className="text-xl font-bold">{formatCurrency(stats.totalValue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Maintenance Due</p>
                  <p className="text-xl font-bold text-yellow-600">{stats.maintenanceDue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <Fuel className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fuel (This Month)</p>
                  <p className="text-xl font-bold">{formatCurrency(stats.totalFuelCost)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Maintenance (YTD)</p>
                  <p className="text-xl font-bold">{formatCurrency(stats.totalMaintenanceCost)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Vehicle List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Fleet Overview</CardTitle>
                  <div className="flex gap-2">
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="text-sm border rounded-lg px-3 py-1.5"
                    >
                      <option value="all">All Types</option>
                      <option value="truck">Trucks</option>
                      <option value="van">Vans</option>
                      <option value="trailer">Trailers</option>
                      <option value="equipment">Equipment</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search vehicles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-3">
                  {filteredVehicles.map(vehicle => {
                    const daysUntilService = getDaysUntil(vehicle.nextService);
                    const isServiceDue = daysUntilService <= 30;
                    
                    return (
                      <div 
                        key={vehicle.id}
                        onClick={() => setSelectedVehicle(vehicle)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedVehicle?.id === vehicle.id 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-transparent bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-white border flex items-center justify-center text-2xl">
                              {typeIcons[vehicle.type]}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{vehicle.name}</p>
                                <Badge className={statusColors[vehicle.status]}>
                                  {vehicle.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-500">
                                {vehicle.year} {vehicle.make} {vehicle.model}
                                {vehicle.licensePlate && ` • ${vehicle.licensePlate}`}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            {vehicle.type !== 'trailer' && (
                              <div className="flex items-center gap-2 mb-1">
                                <Fuel className="w-4 h-4 text-gray-400" />
                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      vehicle.fuelLevel > 50 ? 'bg-green-500' :
                                      vehicle.fuelLevel > 25 ? 'bg-yellow-500' :
                                      'bg-red-500'
                                    }`}
                                    style={{ width: `${vehicle.fuelLevel}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">{vehicle.fuelLevel}%</span>
                              </div>
                            )}
                            {isServiceDue && (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                                <Clock className="w-3 h-3 mr-1" />
                                Service in {daysUntilService} days
                              </Badge>
                            )}
                          </div>
                        </div>
                        {vehicle.assignedTo && (
                          <p className="text-xs text-gray-500 mt-2">
                            Assigned to: {vehicle.assignedTo}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vehicle Details */}
          <div>
            {selectedVehicle ? (
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-2xl">
                      {typeIcons[selectedVehicle.type]}
                    </div>
                    <div>
                      <CardTitle>{selectedVehicle.name}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {selectedVehicle.year} {selectedVehicle.make} {selectedVehicle.model}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Tabs */}
                  <div className="flex gap-1 mb-4 p-1 bg-gray-100 rounded-lg">
                    {['overview', 'maintenance', 'fuel'].map(tab => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as typeof activeTab)}
                        className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                          activeTab === tab 
                            ? 'bg-white shadow text-gray-900' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'overview' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">Mileage</p>
                          <p className="font-semibold">{selectedVehicle.mileage.toLocaleString()} mi</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">Current Value</p>
                          <p className="font-semibold">{formatCurrency(selectedVehicle.currentValue)}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm text-gray-700">Important Dates</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Next Service</span>
                            <span className={`text-sm font-medium ${
                              getDaysUntil(selectedVehicle.nextService) <= 30 ? 'text-yellow-600' : 'text-gray-900'
                            }`}>
                              {formatDate(selectedVehicle.nextService)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Insurance Expiry</span>
                            <span className={`text-sm font-medium ${
                              getDaysUntil(selectedVehicle.insuranceExpiry) <= 30 ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              {formatDate(selectedVehicle.insuranceExpiry)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">Registration</span>
                            <span className={`text-sm font-medium ${
                              getDaysUntil(selectedVehicle.registrationExpiry) <= 30 ? 'text-red-600' : 'text-gray-900'
                            }`}>
                              {formatDate(selectedVehicle.registrationExpiry)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {selectedVehicle.vin && (
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">VIN</p>
                          <p className="font-mono text-sm">{selectedVehicle.vin}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'maintenance' && (
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full" size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Log Maintenance
                      </Button>
                      {selectedVehicle.maintenanceHistory.map(record => (
                        <div key={record.id} className="p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-sm">{record.type}</span>
                            <span className="text-sm font-semibold text-blue-600">
                              {formatCurrency(record.cost)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600">{record.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                            <span>{formatDate(record.date)}</span>
                            <span>•</span>
                            <span>{record.mileage.toLocaleString()} mi</span>
                            <span>•</span>
                            <span>{record.vendor}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'fuel' && (
                    <div className="space-y-3">
                      {selectedVehicle.type !== 'trailer' ? (
                        <>
                          <Button variant="outline" className="w-full" size="sm">
                            <Plus className="w-4 h-4 mr-2" />
                            Log Fuel
                          </Button>
                          {selectedVehicle.fuelLogs.length > 0 ? (
                            selectedVehicle.fuelLogs.map(log => (
                              <div key={log.id} className="p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-medium text-sm">{log.gallons} gallons</span>
                                  <span className="text-sm font-semibold text-green-600">
                                    {formatCurrency(log.cost)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <span>{formatDate(log.date)}</span>
                                  <span>•</span>
                                  <span>{log.mileage.toLocaleString()} mi</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                  <MapPin className="w-3 h-3 inline mr-1" />
                                  {log.location}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-4">No fuel logs yet</p>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">
                          Fuel tracking not applicable for trailers
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Car className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">Select a vehicle to view details</p>
                </CardContent>
              </Card>
            )}

            {/* Alerts Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {vehicles.filter(v => getDaysUntil(v.nextService) <= 30).map(v => (
                    <div key={v.id} className="flex items-center gap-3 p-2 bg-yellow-50 rounded-lg">
                      <Wrench className="w-4 h-4 text-yellow-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{v.name}</p>
                        <p className="text-xs text-yellow-700">
                          Service due in {getDaysUntil(v.nextService)} days
                        </p>
                      </div>
                    </div>
                  ))}
                  {vehicles.filter(v => getDaysUntil(v.insuranceExpiry) <= 30).map(v => (
                    <div key={`ins-${v.id}`} className="flex items-center gap-3 p-2 bg-red-50 rounded-lg">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{v.name}</p>
                        <p className="text-xs text-red-700">
                          Insurance expires in {getDaysUntil(v.insuranceExpiry)} days
                        </p>
                      </div>
                    </div>
                  ))}
                  {vehicles.filter(v => v.fuelLevel < 25 && v.type !== 'trailer').map(v => (
                    <div key={`fuel-${v.id}`} className="flex items-center gap-3 p-2 bg-orange-50 rounded-lg">
                      <Fuel className="w-4 h-4 text-orange-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{v.name}</p>
                        <p className="text-xs text-orange-700">
                          Low fuel ({v.fuelLevel}%)
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleTracker;
