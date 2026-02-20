import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pt-20">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col gap-2 mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Account Settings</h1>
          <p className="text-sm font-bold text-slate-400 tracking-widest uppercase">Everything you bought & where they go</p>
        </div>
        <div className="flex flex-col rounded-xl bg-white p-2 shadow-sm border border-slate-200">
          <Tabs defaultValue="orders">
            <TabsList className="grid w-full grid-cols-2 h-14 bg-slate-100/50 p-1">
              <TabsTrigger 
                value="orders" 
                className="text-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                What I Bought
              </TabsTrigger>
              <TabsTrigger 
                value="address" 
                className="text-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
              >
                Saved Addresses
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
