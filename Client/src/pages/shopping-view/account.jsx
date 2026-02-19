import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <div className="relative h-[200px] w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1600"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h1 className="text-4xl font-bold text-white tracking-tight">My Account</h1>
        </div>
      </div>
      <div className="container mx-auto grid grid-cols-1 gap-8 p-8 max-w-6xl">
        <div className="flex flex-col rounded-xl bg-white p-2 shadow-sm border border-slate-200">
          <Tabs defaultValue="orders">
            <TabsList className="grid w-full grid-cols-2 h-14 bg-slate-100/50 p-1">
              <TabsTrigger 
                value="orders" 
                className="text-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger 
                value="address" 
                className="text-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Addresses
              </TabsTrigger>
            </TabsList>
            <TabsContent value="orders" className="p-4 pt-8">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address" className="p-4 pt-8">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
