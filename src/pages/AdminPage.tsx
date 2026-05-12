
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Users, Building2, Map, ShieldAlert, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
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
        </Card>
      </div>
    </div>
  );
}
