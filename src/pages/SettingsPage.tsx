import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, CreditCard, Bell, Building2, Users, Loader2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/features/auth';
import { agencyService } from '@/services/agencyService';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

export function SettingsPage() {
  const { user, role } = useAuth();
  const queryClient = useQueryClient();
  const isOwnerOrAdmin = role === 'owner' || role === 'super-admin';

  // State for Agency Form
  const [agencyName, setAgencyName] = useState('');
  const [agencyLogo, setAgencyLogo] = useState('');

  // Fetch Agency
  const { data: agency, isLoading: isLoadingAgency } = useQuery({
    queryKey: ['my-agency', user?.id],
    queryFn: () => user?.id ? agencyService.getAgencyByOwnerId(user.id) : null,
    enabled: !!user?.id && isOwnerOrAdmin,
  });

  // Fetch Team Users
  const { data: teamUsers, isLoading: isLoadingTeam } = useQuery({
    queryKey: ['agency-users', agency?.id],
    queryFn: () => agency?.id ? agencyService.getAgencyUsers(agency.id) : [],
    enabled: !!agency?.id && isOwnerOrAdmin,
  });

  // Populate form when agency data loads
  useEffect(() => {
    if (agency) {
      setAgencyName(agency.name || '');
      setAgencyLogo(agency.logo_url || '');
    }
  }, [agency]);

  const updateAgencyMutation = useMutation({
    mutationFn: () => agencyService.upsertAgency(user!.id, agencyName, agencyLogo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-agency'] });
      toast.success('Agencia actualizada exitosamente');
    },
    onError: () => {
      toast.error('Error al actualizar la agencia');
    }
  });

  const handleSaveAgency = () => {
    if (!agencyName.trim()) {
      toast.error('El nombre de la agencia es obligatorio');
      return;
    }
    updateAgencyMutation.mutate();
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Configuración</h1>
        <p className="text-muted-foreground">Administra tu cuenta y preferencias</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto">
            <TabsTrigger value="profile" className="gap-1.5"><User className="h-3.5 w-3.5" />Perfil</TabsTrigger>
            <TabsTrigger value="billing" className="gap-1.5"><CreditCard className="h-3.5 w-3.5" />Plan</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-3.5 w-3.5" />Notificaciones</TabsTrigger>
            {isOwnerOrAdmin && (
              <>
                <TabsTrigger value="agency" className="gap-1.5"><Building2 className="h-3.5 w-3.5" />Agencia (White Label)</TabsTrigger>
                <TabsTrigger value="team" className="gap-1.5"><Users className="h-3.5 w-3.5" />Equipo</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader><CardTitle>Perfil</CardTitle><CardDescription>Actualiza tu información personal</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="name">Nombre</Label><Input id="name" defaultValue={user?.user_metadata?.full_name ?? ''} /></div>
                <div className="space-y-2"><Label htmlFor="settingsEmail">Email</Label><Input id="settingsEmail" defaultValue={user?.email ?? ''} disabled /></div>
                <Button>Guardar Cambios</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card>
              <CardHeader><CardTitle>Plan Actual</CardTitle><CardDescription>Gestiona tu suscripción</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3 rounded-lg border border-border p-4">
                  <div className="flex-1"><p className="font-semibold">Plan Free</p><p className="text-sm text-muted-foreground">3 búsquedas diarias • Grid hasta 5×5</p></div>
                  <Badge>Activo</Badge>
                </div>
                <Separator />
                <Button variant="outline" className="gap-2"><CreditCard className="h-4 w-4" />Actualizar a Pro</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader><CardTitle>Notificaciones</CardTitle><CardDescription>Configura tus alertas</CardDescription></CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">Las notificaciones estarán disponibles próximamente.</p></CardContent>
            </Card>
          </TabsContent>

          {isOwnerOrAdmin && (
            <>
              <TabsContent value="agency">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración White Label</CardTitle>
                    <CardDescription>Personaliza la apariencia de la plataforma para tus clientes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isLoadingAgency ? (
                      <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Cargando datos...</div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="agencyName">Nombre de la Agencia</Label>
                          <Input 
                            id="agencyName" 
                            placeholder="Ej: Agencia Digital Pro" 
                            value={agencyName}
                            onChange={(e) => setAgencyName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="agencyLogo">URL del Logo (Opcional)</Label>
                          <Input 
                            id="agencyLogo" 
                            placeholder="https://tudominio.com/logo.png" 
                            value={agencyLogo}
                            onChange={(e) => setAgencyLogo(e.target.value)}
                          />
                        </div>
                        {agencyLogo && (
                          <div className="mt-4 p-4 border rounded-lg bg-card/50 flex items-center justify-center h-24">
                            <img src={agencyLogo} alt="Logo Preview" className="max-h-16 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                          </div>
                        )}
                        <Button 
                          onClick={handleSaveAgency} 
                          disabled={updateAgencyMutation.isPending}
                        >
                          {updateAgencyMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                          Guardar Agencia
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="team">
                <Card>
                  <CardHeader>
                    <CardTitle>Tu Equipo y Clientes</CardTitle>
                    <CardDescription>Usuarios asociados a tu agencia</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!agency ? (
                      <p className="text-sm text-muted-foreground">Primero debes configurar tu agencia en la pestaña "Agencia".</p>
                    ) : isLoadingTeam ? (
                      <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-brand-primary" /></div>
                    ) : teamUsers && teamUsers.length > 0 ? (
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nombre</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Rol</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {teamUsers.map((member) => (
                              <TableRow key={member.id}>
                                <TableCell className="font-medium">{member.full_name || 'Sin Nombre'}</TableCell>
                                <TableCell>{member.email}</TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="uppercase text-[10px]">{member.role}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center p-8 border rounded-lg border-dashed">
                        <Users className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                        <p className="text-sm text-muted-foreground">Aún no tienes usuarios en tu agencia.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}

        </Tabs>
      </motion.div>
    </motion.div>
  );
}
