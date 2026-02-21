import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";

function ShoppingAccount() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 pt-14 sm:pt-16">
      <div className="container mx-auto px-1 sm:px-6 py-1 sm:py-2 max-w-[99%] 2xl:max-w-[1400px]">
        <div className="flex flex-col gap-1 mb-1 sm:mb-2 text-center sm:text-left ml-1 sm:ml-2">
          <h1 className="text-2xl sm:text-3xl font-bold sm:font-black text-slate-900 uppercase tracking-tight">Account Settings</h1>
          <p className="text-[10px] sm:text-sm font-bold text-slate-400 tracking-widest uppercase">Everything you bought & where they go</p>
        </div>
        <div className="flex flex-col rounded-xl bg-white shadow-sm border border-slate-200">
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
            <TabsContent value="orders" className="p-1 sm:p-4 pt-6">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address" className="p-1 sm:p-4 pt-6">
              <Address />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default ShoppingAccount;
