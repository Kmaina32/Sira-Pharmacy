
'use client';

import { useState, useEffect } from 'react';
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BrandForm, Brand } from '@/components/BrandForm';
import { useAuth } from '@/context/AuthContext';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const { isAdmin, loading: authLoading } = useAuth();

  useEffect(() => {
     if (authLoading) return;
      if (!isAdmin) {
        setLoading(false);
        return;
      }
    const unsubscribe = onSnapshot(collection(db, 'brands'), (snapshot) => {
      const brandsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Brand));
      setBrands(brandsList);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [isAdmin, authLoading]);

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setEditingBrand(null);
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setIsDialogOpen(true);
  };

  const handleDelete = async (brandId: string) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      await deleteDoc(doc(db, 'brands', brandId));
    }
  };
  
  const openNewBrandDialog = () => {
    setEditingBrand(null);
    setIsDialogOpen(true);
  };
  
  if (loading || authLoading) {
    return <p>Loading...</p>
  }

  if (!isAdmin) {
    return <p>Access Denied.</p>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold font-headline">Partner Brands</h1>
            <p className="text-muted-foreground">Manage the brand logos displayed on your homepage.</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewBrandDialog}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Brand
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingBrand ? 'Edit Brand' : 'Add New Brand'}</DialogTitle>
            </DialogHeader>
            <BrandForm 
                brand={editingBrand} 
                onSuccess={handleSuccess} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brand Logos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Logo</TableHead>
                <TableHead>Brand Name</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brands.map((brand) => (
                <TableRow key={brand.id}>
                  <TableCell>
                    <Image
                      alt={brand.name}
                      className="aspect-video object-contain"
                      height="40"
                      src={brand.logoUrl}
                      width="80"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{brand.name}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleEdit(brand)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(brand.id)} className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
