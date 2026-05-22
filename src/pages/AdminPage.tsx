
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Building2, Map, ShieldAlert, Loader2, Coins, Edit2 } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { adminService } from '@/services/adminService';
import { useAuth } from '@/features/auth';
import type { UserRole } from '@/features/auth/types';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'super-admin', label: 'Super Admin' },
  { value: 'owner', label: 'Owner (Agencia)' },
  { value: 'admin', label: 'Admin' },
  { value: 'staff', label: 'Staff' },
  { value: 'client', label: 'Client' },
];

export function AdminPage() {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const { data: metrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['admin-metrics'],
    queryFn: () => adminService.getSystemMetrics(),
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminService.getAllUsers(),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: UserRole }) => 
      adminService.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Rol actualizado correctamente');
    },
    onError: () => {
      toast.error('Error al actualizar el rol');
    }
  });

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateRoleMutation.mutate({ userId, role: newRole });
  };

  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string; credits: number } | null>(null);
  const [creditsInput, setCreditsInput] = useState<string>('');

  const updateCreditsMutation = useMutation({
    mutationFn: ({ userId, credits }: { userId: string; credits: number }) => 
      adminService.updateUserCredits(userId, credits),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast.success('Créditos actualizados correctamente');
      setSelectedUser(null);
    },
    onError: () => {
      toast.error('Error al actualizar los créditos');
    }
  });

  const handleCreditsSave = () => {
    if (!selectedUser) return;
    const parsed = parseInt(creditsInput, 10);
    if (isNaN(parsed) || parsed < 0) {
      toast.error('Por favor introduce un número de créditos válido (mayor o igual a 0)');
      return;
    }
    updateCreditsMutation.mutate({ userId: selectedUser.id, credits: parsed });
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white flex items-center gap-3">
            <div className="p-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <ShieldAlert className="h-6 w-6 text-zinc-950 dark:text-white" strokeWidth={1.5} />
            </div>
            Panel de Administración Global
          </h2>
          <p className="text-muted-foreground mt-2">
            Control maestro de usuarios, agencias y recursos del sistema. Solo para Super Admins.
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6"
      >
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-none rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-zinc-950 dark:text-white">Usuarios Totales</CardTitle>
            <Users className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-950 dark:text-white">
              {isLoadingMetrics ? <Loader2 className="h-4 w-4 animate-spin" /> : metrics?.users || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-none rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-zinc-950 dark:text-white">Agencias White Label</CardTitle>
            <Building2 className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-950 dark:text-white">
              {isLoadingMetrics ? <Loader2 className="h-4 w-4 animate-spin" /> : metrics?.agencies || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-none rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-zinc-950 dark:text-white">Mapas Generados</CardTitle>
            <Map className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-950 dark:text-white">
              {isLoadingMetrics ? <Loader2 className="h-4 w-4 animate-spin" /> : metrics?.heatmaps || 0}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-none rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-zinc-950 dark:text-white">Estado del Sistema</CardTitle>
            <ShieldAlert className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">Óptimo</div>
            <p className="text-xs text-zinc-500 font-medium">APIs conectadas</p>
          </CardContent>
        </Card>
      </motion.div>
      
      <div className="mt-6">
        <Card className="border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-none rounded-xl">
          <CardHeader>
            <CardTitle className="text-xl text-zinc-950 dark:text-white">Gestión de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingUsers ? (
              <div className="flex justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
              </div>
            ) : (
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <Table>
                  <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
                    <TableRow className="border-zinc-200 dark:border-zinc-800 hover:bg-transparent">
                      <TableHead className="font-semibold text-zinc-950 dark:text-white">Usuario</TableHead>
                      <TableHead className="font-semibold text-zinc-950 dark:text-white">Email</TableHead>
                      <TableHead className="font-semibold text-zinc-950 dark:text-white">Plan</TableHead>
                      <TableHead className="font-semibold text-zinc-950 dark:text-white">Créditos</TableHead>
                      <TableHead className="font-semibold text-zinc-950 dark:text-white">Rol Actual</TableHead>
                      <TableHead className="text-right font-semibold text-zinc-950 dark:text-white">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users?.map((user) => (
                      <TableRow key={user.id} className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                        <TableCell className="font-medium text-zinc-950 dark:text-white">{user.full_name || 'Sin Nombre'}</TableCell>
                        <TableCell className="text-zinc-500">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="uppercase text-[10px] font-semibold bg-white dark:bg-zinc-950 text-zinc-950 dark:text-white border-zinc-200 dark:border-zinc-800 shadow-none">
                            {user.plan || 'free'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-zinc-950 dark:text-white">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{new Intl.NumberFormat().format(user.credits ?? 0)}</span>
                            <button
                              onClick={() => {
                                setSelectedUser({ id: user.id, name: user.full_name || user.email, credits: user.credits ?? 0 });
                                setCreditsInput((user.credits ?? 0).toString());
                              }}
                              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors text-zinc-500 hover:text-zinc-950 dark:hover:text-white"
                              title="Editar créditos"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="uppercase text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white hover:bg-zinc-200 dark:hover:bg-zinc-700 shadow-none font-semibold">
                            {user.role || 'client'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Select
                            value={user.role || 'client'}
                            onValueChange={(value) => handleRoleChange(user.id, value as UserRole)}
                            disabled={user.id === currentUser?.id}
                          >
                            <SelectTrigger className="w-[140px] ml-auto h-8 text-xs bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-none focus:ring-zinc-950 dark:focus:ring-white rounded-md">
                              <SelectValue placeholder="Cambiar rol" />
                            </SelectTrigger>
                            <SelectContent className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl">
                              {ROLES.map((role) => (
                                <SelectItem key={role.value} value={role.value} className="text-xs hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer focus:bg-zinc-50 dark:focus:bg-zinc-900">
                                  {role.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
      </div>

      {/* Modal para gestionar créditos */}
      <Dialog open={selectedUser !== null} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[400px] p-6 border border-zinc-200 dark:border-zinc-800 shadow-xl rounded-xl bg-white dark:bg-zinc-950">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-zinc-950 dark:text-white flex items-center gap-2">
              <Coins className="h-5 w-5 text-zinc-500" />
              Gestionar Créditos
            </DialogTitle>
            <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
              Modifica la cantidad de créditos de <span className="font-semibold text-zinc-700 dark:text-zinc-300">{selectedUser?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="credits" className="text-zinc-950 dark:text-white font-medium">Cantidad de Créditos</Label>
              <Input
                id="credits"
                type="number"
                min="0"
                value={creditsInput}
                onChange={(e) => setCreditsInput(e.target.value)}
                className="h-10 rounded-md border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-white shadow-none bg-zinc-50 dark:bg-zinc-900"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
            <Button
              variant="outline"
              onClick={() => setSelectedUser(null)}
              className="h-10 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreditsSave}
              disabled={updateCreditsMutation.isPending}
              className="h-10 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-none font-semibold rounded-md flex items-center gap-2"
            >
              {updateCreditsMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
