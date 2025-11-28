/**
 * Invoice Management System
 * Full-featured invoicing for contractors with professional templates
 */

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, Plus, Download, Send, Eye, Edit2, Trash2,
  DollarSign, Calendar, User, CheckCircle, Clock, AlertCircle,
  Printer, Copy, Search, Filter, MoreVertical
} from 'lucide-react';

interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  jobTitle: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue';
  createdAt: Date;
  dueDate: Date;
  paidAt?: Date;
  notes?: string;
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    clientName: 'Robert Johnson',
    clientEmail: 'robert@email.com',
    clientAddress: '123 Main St, Austin, TX 78701',
    jobTitle: 'Kitchen Renovation',
    lineItems: [
      { id: '1', description: 'Cabinet Installation', quantity: 1, unitPrice: 2500, total: 2500 },
      { id: '2', description: 'Countertop Installation', quantity: 1, unitPrice: 1800, total: 1800 },
      { id: '3', description: 'Plumbing Work', quantity: 8, unitPrice: 75, total: 600 },
    ],
    subtotal: 4900,
    taxRate: 8.25,
    taxAmount: 404.25,
    total: 5304.25,
    status: 'paid',
    createdAt: new Date('2024-01-15'),
    dueDate: new Date('2024-01-30'),
    paidAt: new Date('2024-01-28'),
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    clientName: 'Sarah Williams',
    clientEmail: 'sarah@email.com',
    clientAddress: '456 Oak Ave, Phoenix, AZ 85001',
    jobTitle: 'Bathroom Remodel',
    lineItems: [
      { id: '1', description: 'Tile Installation', quantity: 120, unitPrice: 15, total: 1800 },
      { id: '2', description: 'Fixture Installation', quantity: 1, unitPrice: 950, total: 950 },
      { id: '3', description: 'Labor', quantity: 16, unitPrice: 65, total: 1040 },
    ],
    subtotal: 3790,
    taxRate: 5.6,
    taxAmount: 212.24,
    total: 4002.24,
    status: 'sent',
    createdAt: new Date('2024-02-01'),
    dueDate: new Date('2024-02-15'),
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    clientName: 'Michael Chen',
    clientEmail: 'michael@email.com',
    clientAddress: '789 Pine Rd, Denver, CO 80202',
    jobTitle: 'HVAC Installation',
    lineItems: [
      { id: '1', description: 'AC Unit', quantity: 1, unitPrice: 3500, total: 3500 },
      { id: '2', description: 'Installation Labor', quantity: 1, unitPrice: 1200, total: 1200 },
      { id: '3', description: 'Ductwork', quantity: 1, unitPrice: 800, total: 800 },
    ],
    subtotal: 5500,
    taxRate: 4.75,
    taxAmount: 261.25,
    total: 5761.25,
    status: 'overdue',
    createdAt: new Date('2024-01-20'),
    dueDate: new Date('2024-02-03'),
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    clientName: 'Emily Davis',
    clientEmail: 'emily@email.com',
    clientAddress: '321 Elm St, Portland, OR 97201',
    jobTitle: 'Deck Construction',
    lineItems: [
      { id: '1', description: 'Lumber Materials', quantity: 1, unitPrice: 2800, total: 2800 },
      { id: '2', description: 'Labor', quantity: 24, unitPrice: 55, total: 1320 },
    ],
    subtotal: 4120,
    taxRate: 0,
    taxAmount: 0,
    total: 4120,
    status: 'draft',
    createdAt: new Date('2024-02-05'),
    dueDate: new Date('2024-02-20'),
  },
];

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: Edit2 },
  sent: { label: 'Sent', color: 'bg-blue-100 text-blue-700', icon: Send },
  viewed: { label: 'Viewed', color: 'bg-purple-100 text-purple-700', icon: Eye },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-700', icon: AlertCircle },
};

export function InvoiceManagement() {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const matchesSearch = invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const stats = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + inv.total, 0);
    const paid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.total, 0);
    const pending = invoices.filter(inv => ['sent', 'viewed'].includes(inv.status)).reduce((sum, inv) => sum + inv.total, 0);
    const overdue = invoices.filter(inv => inv.status === 'overdue').reduce((sum, inv) => sum + inv.total, 0);
    return { total, paid, pending, overdue };
  }, [invoices]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
  };

  const handleStatusChange = (invoiceId: string, newStatus: Invoice['status']) => {
    setInvoices(prev => prev.map(inv => 
      inv.id === invoiceId ? { ...inv, status: newStatus, paidAt: newStatus === 'paid' ? new Date() : inv.paidAt } : inv
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Invoice Management</h1>
            <p className="text-gray-600 mt-1">Create, track, and manage your professional invoices</p>
          </div>
          <Button 
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Invoice
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Invoiced</p>
                  <p className="text-xl font-bold">{formatCurrency(stats.total)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Paid</p>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(stats.paid)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-yellow-600">{formatCurrency(stats.pending)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Overdue</p>
                  <p className="text-xl font-bold text-red-600">{formatCurrency(stats.overdue)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'draft', 'sent', 'viewed', 'paid', 'overdue'].map(status => (
              <Button
                key={status}
                variant={statusFilter === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(status)}
                className="capitalize"
              >
                {status}
              </Button>
            ))}
          </div>
        </div>

        {/* Invoice List */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-4 font-medium text-gray-700">Invoice</th>
                    <th className="text-left p-4 font-medium text-gray-700">Client</th>
                    <th className="text-left p-4 font-medium text-gray-700">Job</th>
                    <th className="text-left p-4 font-medium text-gray-700">Amount</th>
                    <th className="text-left p-4 font-medium text-gray-700">Status</th>
                    <th className="text-left p-4 font-medium text-gray-700">Due Date</th>
                    <th className="text-left p-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map(invoice => {
                    const StatusIcon = statusConfig[invoice.status].icon;
                    return (
                      <tr key={invoice.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center">
                              <FileText className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="font-medium">{invoice.invoiceNumber}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{invoice.clientName}</p>
                            <p className="text-sm text-gray-500">{invoice.clientEmail}</p>
                          </div>
                        </td>
                        <td className="p-4 text-gray-700">{invoice.jobTitle}</td>
                        <td className="p-4 font-semibold">{formatCurrency(invoice.total)}</td>
                        <td className="p-4">
                          <Badge className={`${statusConfig[invoice.status].color} flex items-center gap-1 w-fit`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig[invoice.status].label}
                          </Badge>
                        </td>
                        <td className="p-4 text-gray-700">{formatDate(invoice.dueDate)}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setSelectedInvoice(invoice)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Download className="w-4 h-4" />
                            </Button>
                            {invoice.status === 'draft' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleStatusChange(invoice.id, 'sent')}
                              >
                                <Send className="w-4 h-4" />
                              </Button>
                            )}
                            {invoice.status !== 'paid' && invoice.status !== 'draft' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleStatusChange(invoice.id, 'paid')}
                                className="text-green-600"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Preview Modal */}
        {selectedInvoice && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle>Invoice Preview</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedInvoice(null)}>
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {/* Invoice Header */}
                <div className="flex justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-blue-600">INVOICE</h2>
                    <p className="text-gray-600">{selectedInvoice.invoiceNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">FairTrade Worker</p>
                    <p className="text-sm text-gray-600">Professional Services</p>
                  </div>
                </div>

                {/* Client Info */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Bill To</p>
                    <p className="font-semibold">{selectedInvoice.clientName}</p>
                    <p className="text-sm text-gray-600">{selectedInvoice.clientEmail}</p>
                    <p className="text-sm text-gray-600">{selectedInvoice.clientAddress}</p>
                  </div>
                  <div className="text-right">
                    <div className="mb-2">
                      <p className="text-sm text-gray-500">Invoice Date</p>
                      <p className="font-medium">{formatDate(selectedInvoice.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Due Date</p>
                      <p className="font-medium">{formatDate(selectedInvoice.dueDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                <div className="border rounded-lg overflow-hidden mb-6">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-3 text-sm font-medium text-gray-700">Description</th>
                        <th className="text-right p-3 text-sm font-medium text-gray-700">Qty</th>
                        <th className="text-right p-3 text-sm font-medium text-gray-700">Rate</th>
                        <th className="text-right p-3 text-sm font-medium text-gray-700">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.lineItems.map(item => (
                        <tr key={item.id} className="border-t">
                          <td className="p-3">{item.description}</td>
                          <td className="p-3 text-right">{item.quantity}</td>
                          <td className="p-3 text-right">{formatCurrency(item.unitPrice)}</td>
                          <td className="p-3 text-right font-medium">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-64">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                    </div>
                    {selectedInvoice.taxRate > 0 && (
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Tax ({selectedInvoice.taxRate}%)</span>
                        <span>{formatCurrency(selectedInvoice.taxAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 border-t font-bold text-lg">
                      <span>Total</span>
                      <span className="text-blue-600">{formatCurrency(selectedInvoice.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-8 pt-6 border-t">
                  <Button className="flex-1" variant="outline">
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  <Button className="flex-1" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                  <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                    <Send className="w-4 h-4 mr-2" />
                    Send to Client
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

export default InvoiceManagement;
