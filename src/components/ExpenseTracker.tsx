/**
 * Expense Tracker System
 * Track business expenses, receipts, and generate reports
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Receipt, Plus, Upload, Download, Trash2, Edit2,
  DollarSign, Calendar, Tag, TrendingUp, TrendingDown,
  Camera, Filter, Search, PieChart, BarChart3
} from 'lucide-react';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: Date;
  vendor: string;
  receipt?: string;
  jobId?: string;
  jobName?: string;
  isBillable: boolean;
  status: 'pending' | 'approved' | 'reimbursed';
  notes?: string;
}

const categories = [
  { id: 'materials', name: 'Materials', icon: '🪵', color: 'bg-amber-100 text-amber-700' },
  { id: 'tools', name: 'Tools & Equipment', icon: '🔧', color: 'bg-blue-100 text-blue-700' },
  { id: 'fuel', name: 'Fuel & Transportation', icon: '⛽', color: 'bg-green-100 text-green-700' },
  { id: 'labor', name: 'Subcontractor Labor', icon: '👷', color: 'bg-purple-100 text-purple-700' },
  { id: 'permits', name: 'Permits & Licenses', icon: '📋', color: 'bg-red-100 text-red-700' },
  { id: 'office', name: 'Office & Admin', icon: '🏢', color: 'bg-gray-100 text-gray-700' },
  { id: 'insurance', name: 'Insurance', icon: '🛡️', color: 'bg-indigo-100 text-indigo-700' },
  { id: 'marketing', name: 'Marketing', icon: '📣', color: 'bg-pink-100 text-pink-700' },
  { id: 'other', name: 'Other', icon: '📦', color: 'bg-slate-100 text-slate-700' },
];

const mockExpenses: Expense[] = [
  {
    id: '1',
    description: 'Lumber for deck project',
    amount: 1250.00,
    category: 'materials',
    date: new Date('2024-02-01'),
    vendor: 'Home Depot',
    jobId: 'job-1',
    jobName: 'Deck Construction - Smith',
    isBillable: true,
    status: 'approved',
  },
  {
    id: '2',
    description: 'DeWalt Power Drill Set',
    amount: 349.99,
    category: 'tools',
    date: new Date('2024-02-03'),
    vendor: 'Lowe\'s',
    isBillable: false,
    status: 'approved',
  },
  {
    id: '3',
    description: 'Gas for work truck',
    amount: 85.50,
    category: 'fuel',
    date: new Date('2024-02-05'),
    vendor: 'Shell',
    isBillable: false,
    status: 'reimbursed',
  },
  {
    id: '4',
    description: 'Electrical permit',
    amount: 175.00,
    category: 'permits',
    date: new Date('2024-02-06'),
    vendor: 'City of Austin',
    jobId: 'job-2',
    jobName: 'Kitchen Remodel - Johnson',
    isBillable: true,
    status: 'pending',
  },
  {
    id: '5',
    description: 'Tile and grout',
    amount: 680.00,
    category: 'materials',
    date: new Date('2024-02-07'),
    vendor: 'Floor & Decor',
    jobId: 'job-3',
    jobName: 'Bathroom Renovation - Williams',
    isBillable: true,
    status: 'approved',
  },
  {
    id: '6',
    description: 'Liability insurance premium',
    amount: 450.00,
    category: 'insurance',
    date: new Date('2024-02-01'),
    vendor: 'State Farm',
    isBillable: false,
    status: 'approved',
  },
  {
    id: '7',
    description: 'Business cards and flyers',
    amount: 125.00,
    category: 'marketing',
    date: new Date('2024-02-08'),
    vendor: 'Vistaprint',
    isBillable: false,
    status: 'pending',
  },
];

export function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    description: '',
    amount: 0,
    category: 'materials',
    vendor: '',
    isBillable: false,
    date: new Date(),
    status: 'pending',
  });

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.vendor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [expenses, searchQuery, categoryFilter]);

  const stats = useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const billable = expenses.filter(e => e.isBillable).reduce((sum, exp) => sum + exp.amount, 0);
    const pending = expenses.filter(e => e.status === 'pending').reduce((sum, exp) => sum + exp.amount, 0);
    
    const byCategory = categories.map(cat => ({
      ...cat,
      total: expenses.filter(e => e.category === cat.id).reduce((sum, exp) => sum + exp.amount, 0),
      count: expenses.filter(e => e.category === cat.id).length,
    })).filter(cat => cat.total > 0).sort((a, b) => b.total - a.total);

    return { total, billable, pending, byCategory };
  }, [expenses]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(c => c.id === categoryId) || categories[categories.length - 1];
  };

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount && newExpense.vendor) {
      setExpenses(prev => [{
        id: String(Date.now()),
        description: newExpense.description!,
        amount: newExpense.amount!,
        category: newExpense.category!,
        date: newExpense.date || new Date(),
        vendor: newExpense.vendor!,
        isBillable: newExpense.isBillable || false,
        status: 'pending',
      }, ...prev]);
      setShowAddModal(false);
      setNewExpense({
        description: '',
        amount: 0,
        category: 'materials',
        vendor: '',
        isBillable: false,
        date: new Date(),
        status: 'pending',
      });
    }
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
            <p className="text-gray-600 mt-1">Track and manage your business expenses</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Expense
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Expenses</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.total)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600">12% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Billable Expenses</p>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.billable)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Receipt className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                {Math.round((stats.billable / stats.total) * 100)}% of total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending Approval</p>
                  <p className="text-2xl font-bold text-yellow-600">{formatCurrency(stats.pending)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                {expenses.filter(e => e.status === 'pending').length} expenses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">This Month</p>
                  <p className="text-2xl font-bold">{expenses.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-500">Total transactions</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Expense List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Expenses</CardTitle>
                  <div className="flex gap-2">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="text-sm border rounded-lg px-3 py-1.5"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search expenses..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="space-y-3">
                  {filteredExpenses.map(expense => {
                    const category = getCategoryInfo(expense.category);
                    return (
                      <div 
                        key={expense.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center text-lg`}>
                            {category.icon}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{expense.description}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{expense.vendor}</span>
                              <span>•</span>
                              <span>{formatDate(expense.date)}</span>
                              {expense.jobName && (
                                <>
                                  <span>•</span>
                                  <span className="text-blue-600">{expense.jobName}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                            <div className="flex items-center gap-2">
                              {expense.isBillable && (
                                <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                                  Billable
                                </Badge>
                              )}
                              <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                  expense.status === 'approved' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  expense.status === 'reimbursed' ? 'bg-green-50 text-green-700 border-green-200' :
                                  'bg-yellow-50 text-yellow-700 border-yellow-200'
                                }`}
                              >
                                {expense.status}
                              </Badge>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  By Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.byCategory.map(cat => (
                    <div key={cat.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span className="text-sm font-medium">{cat.name}</span>
                        </div>
                        <span className="text-sm font-semibold">{formatCurrency(cat.total)}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${(cat.total / stats.total) * 100}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {cat.count} expense{cat.count !== 1 ? 's' : ''} • {Math.round((cat.total / stats.total) * 100)}%
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Quick Add</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {categories.slice(0, 6).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setNewExpense(prev => ({ ...prev, category: cat.id }));
                        setShowAddModal(true);
                      }}
                      className={`p-3 rounded-xl ${cat.color} hover:opacity-80 transition-opacity text-center`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <p className="text-xs mt-1 font-medium">{cat.name.split(' ')[0]}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Add Expense Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Add Expense</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <Input
                    placeholder="What did you buy?"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={newExpense.amount || ''}
                        onChange={(e) => setNewExpense(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                        className="pl-8"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full border rounded-lg px-3 py-2"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Vendor</label>
                  <Input
                    placeholder="Where did you buy it?"
                    value={newExpense.vendor}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, vendor: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <Input
                    type="date"
                    value={newExpense.date ? new Date(newExpense.date).toISOString().split('T')[0] : ''}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, date: new Date(e.target.value) }))}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="billable"
                    checked={newExpense.isBillable}
                    onChange={(e) => setNewExpense(prev => ({ ...prev, isBillable: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <label htmlFor="billable" className="text-sm text-gray-700">
                    This expense is billable to a client
                  </label>
                </div>

                <div className="border-2 border-dashed rounded-xl p-6 text-center">
                  <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Upload receipt</p>
                  <p className="text-xs text-gray-400">PNG, JPG, PDF up to 10MB</p>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                    onClick={handleAddExpense}
                  >
                    Add Expense
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExpenseTracker;
