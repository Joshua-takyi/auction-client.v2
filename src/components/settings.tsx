import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeSwitcher } from "./theme-switcher";

interface SettingsProps {
    children: React.ReactNode;
}

export function Settings({ children }: SettingsProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-2xl font-serif">Settings</DialogTitle>
                    <DialogDescription>
                        Manage your account settings and preferences.
                    </DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="w-full justify-start rounded-none border-b bg-transparent px-6">
                        <TabsTrigger
                            value="general"
                            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                        >
                            General
                        </TabsTrigger>
                        <TabsTrigger
                            value="appearance"
                            className="rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary data-[state=active]:bg-transparent"
                        >
                            Appearance
                        </TabsTrigger>
                    </TabsList>
                    <div className="p-6">
                        <TabsContent value="general" className="mt-0 space-y-6">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Display Name</Label>
                                    <Input id="name" defaultValue="Pedro Duarte" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" type="email" defaultValue="pedro@example.com" />
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="appearance" className="mt-0 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Theme</h4>
                                    <p className="text-xs text-muted-foreground mb-4">
                                        Select your preferred interface theme.
                                    </p>
                                    <ThemeSwitcher />
                                </div>
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}