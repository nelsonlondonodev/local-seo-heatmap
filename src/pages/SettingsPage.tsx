import { motion } from 'framer-motion';
import { User, CreditCard, Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/features/auth';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

export function SettingsPage() {
  const { user } = useAuth();

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Configuración</h1>
        <p className="text-muted-foreground">Administra tu cuenta y preferencias</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" className="gap-1.5"><User className="h-3.5 w-3.5" />Perfil</TabsTrigger>
            <TabsTrigger value="billing" className="gap-1.5"><CreditCard className="h-3.5 w-3.5" />Plan</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-1.5"><Bell className="h-3.5 w-3.5" />Notificaciones</TabsTrigger>
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
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
