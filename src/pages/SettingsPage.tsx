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
  const isAgencyManagementAllowed = role === 'owner' || role === 'super-admin' || role === 'admin';
  const isBillingAllowed = role === 'owner' || role === 'super-admin';

  // State for Agency Form
  const [agencyName, setAgencyName] = useState('');
  const [agencyLogo, setAgencyLogo] = useState('');

  // Fetch Agency
  const { data: agency, isLoading: isLoadingAgency } = useQuery({
    queryKey: ['my-agency', user?.id],
    queryFn: () => user?.id ? agencyService.getAgencyByOwnerId(user.id) : null,
    enabled: !!user?.id && isAgencyManagementAllowed,
  });

  // Fetch Team Users
  const { data: teamUsers, isLoading: isLoadingTeam } = useQuery({
    queryKey: ['agency-users', agency?.id],
    queryFn: () => agency?.id ? agencyService.getAgencyUsers(agency.id) : [],
    enabled: !!agency?.id && isAgencyManagementAllowed,
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
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-950 dark:text-white">Configuración</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Administra tu cuenta y preferencias</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto bg-zinc-50 dark:bg-zinc-900 p-1 rounded-xl border border-zinc-200 dark:border-zinc-800">
            <TabsTrigger value="profile" className="gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-zinc-950 dark:data-[state=active]:text-white shadow-none data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800"><User className="h-4 w-4" strokeWidth={2} />Perfil</TabsTrigger>
            {isBillingAllowed && (
              <TabsTrigger value="billing" className="gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-zinc-950 dark:data-[state=active]:text-white shadow-none data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800"><CreditCard className="h-4 w-4" strokeWidth={2} />Plan</TabsTrigger>
            )}
            <TabsTrigger value="notifications" className="gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-zinc-950 dark:data-[state=active]:text-white shadow-none data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800"><Bell className="h-4 w-4" strokeWidth={2} />Notificaciones</TabsTrigger>
            {isAgencyManagementAllowed && (
              <>
                <TabsTrigger value="agency" className="gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-zinc-950 dark:data-[state=active]:text-white shadow-none data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800"><Building2 className="h-4 w-4" strokeWidth={2} />Agencia (White Label)</TabsTrigger>
                <TabsTrigger value="team" className="gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-zinc-950 dark:data-[state=active]:text-white shadow-none data-[state=active]:border data-[state=active]:border-zinc-200 dark:data-[state=active]:border-zinc-800"><Users className="h-4 w-4" strokeWidth={2} />Equipo</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="profile">
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-none rounded-xl">
              <CardHeader><CardTitle className="text-xl text-zinc-950 dark:text-white">Perfil</CardTitle><CardDescription className="text-zinc-500">Actualiza tu información personal</CardDescription></CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2"><Label htmlFor="name" className="text-zinc-950 dark:text-white font-medium">Nombre</Label><Input id="name" defaultValue={user?.user_metadata?.full_name ?? ''} className="h-10 rounded-md border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-white shadow-none bg-zinc-50 dark:bg-zinc-900" /></div>
                <div className="space-y-2"><Label htmlFor="settingsEmail" className="text-zinc-950 dark:text-white font-medium">Email</Label><Input id="settingsEmail" defaultValue={user?.email ?? ''} disabled className="h-10 rounded-md border-zinc-200 dark:border-zinc-800 shadow-none bg-zinc-100 dark:bg-zinc-800 text-zinc-500" /></div>
                <Button className="h-10 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-none font-semibold rounded-md">Guardar Cambios</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {isBillingAllowed && (
            <TabsContent value="billing">
              <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-none rounded-xl">
                <CardHeader><CardTitle className="text-xl text-zinc-950 dark:text-white">Plan Actual</CardTitle><CardDescription className="text-zinc-500">Gestiona tu suscripción</CardDescription></CardHeader>
                <CardContent className="space-y-5">
                  <div className="flex items-center gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 bg-zinc-50 dark:bg-zinc-900">
                    <div className="flex-1"><p className="font-semibold text-zinc-950 dark:text-white">Plan Free</p><p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">3 búsquedas diarias • Grid hasta 5×5</p></div>
                    <Badge variant="outline" className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-white font-semibold">Activo</Badge>
                  </div>
                  <Separator className="bg-zinc-200 dark:bg-zinc-800" />
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 leading-relaxed">
                    Para solicitar paquetes de créditos adicionales o planes corporativos personalizados a la medida de tu agencia, por favor ponte en contacto con soporte.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="notifications">
            <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-none rounded-xl">
              <CardHeader><CardTitle className="text-xl text-zinc-950 dark:text-white">Notificaciones</CardTitle><CardDescription className="text-zinc-500">Configura tus alertas</CardDescription></CardHeader>
              <CardContent><p className="text-sm text-zinc-500 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">Las notificaciones estarán disponibles próximamente.</p></CardContent>
            </Card>
          </TabsContent>

          {isAgencyManagementAllowed && (
            <>
              <TabsContent value="agency">
                <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-none rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-zinc-950 dark:text-white">Configuración White Label</CardTitle>
                    <CardDescription className="text-zinc-500">Personaliza la apariencia de la plataforma para tus clientes</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    {isLoadingAgency ? (
                      <div className="flex items-center gap-2 text-zinc-500"><Loader2 className="h-4 w-4 animate-spin" /> Cargando datos...</div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="agencyName" className="text-zinc-950 dark:text-white font-medium">Nombre de la Agencia</Label>
                          <Input 
                            id="agencyName" 
                            placeholder="Ej: Agencia Digital Pro" 
                            value={agencyName}
                            onChange={(e) => setAgencyName(e.target.value)}
                            className="h-10 rounded-md border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-white shadow-none bg-zinc-50 dark:bg-zinc-900"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="agencyLogo" className="text-zinc-950 dark:text-white font-medium">URL del Logo (Opcional)</Label>
                          <Input 
                            id="agencyLogo" 
                            placeholder="https://tudominio.com/logo.png" 
                            value={agencyLogo}
                            onChange={(e) => setAgencyLogo(e.target.value)}
                            className="h-10 rounded-md border-zinc-200 dark:border-zinc-800 focus-visible:ring-zinc-950 dark:focus-visible:ring-white shadow-none bg-zinc-50 dark:bg-zinc-900"
                          />
                        </div>
                        {agencyLogo && (
                          <div className="mt-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center h-24">
                            <img src={agencyLogo} alt="Logo Preview" className="max-h-16 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
                          </div>
                        )}
                        <Button 
                          onClick={handleSaveAgency} 
                          disabled={updateAgencyMutation.isPending}
                          className="h-10 bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-none font-semibold rounded-md"
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
                <Card className="border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-none rounded-xl">
                  <CardHeader>
                    <CardTitle className="text-xl text-zinc-950 dark:text-white">Tu Equipo y Clientes</CardTitle>
                    <CardDescription className="text-zinc-500">Usuarios asociados a tu agencia</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {!agency ? (
                      <p className="text-sm text-zinc-500 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">Primero debes configurar tu agencia en la pestaña "Agencia".</p>
                    ) : isLoadingTeam ? (
                      <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-zinc-400" /></div>
                    ) : teamUsers && teamUsers.length > 0 ? (
                      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                        <Table>
                          <TableHeader className="bg-zinc-50 dark:bg-zinc-900">
                            <TableRow className="border-zinc-200 dark:border-zinc-800 hover:bg-transparent">
                              <TableHead className="font-semibold text-zinc-950 dark:text-white">Nombre</TableHead>
                              <TableHead className="font-semibold text-zinc-950 dark:text-white">Email</TableHead>
                              <TableHead className="font-semibold text-zinc-950 dark:text-white">Créditos</TableHead>
                              <TableHead className="font-semibold text-zinc-950 dark:text-white">Rol</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {teamUsers.map((member) => (
                              <TableRow key={member.id} className="border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/50">
                                <TableCell className="font-medium text-zinc-950 dark:text-white">{member.full_name || 'Sin Nombre'}</TableCell>
                                <TableCell className="text-zinc-500">{member.email}</TableCell>
                                <TableCell className="font-semibold text-zinc-950 dark:text-white">
                                  {new Intl.NumberFormat().format(member.credits ?? 0)}
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="uppercase text-[10px] font-semibold text-zinc-950 dark:text-white bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-none">{member.role}</Badge>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="text-center p-8 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border-dashed">
                        <Users className="h-8 w-8 mx-auto text-zinc-400 mb-3" strokeWidth={1.5} />
                        <p className="text-sm font-medium text-zinc-500">Aún no tienes usuarios en tu agencia.</p>
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
