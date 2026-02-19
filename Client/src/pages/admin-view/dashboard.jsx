

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserStats,
  fetchAllUsersList,
} from "@/store/admin/user-stats-slice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  UserX,
  Activity,
  Loader2,
  Share2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Trash2,
  CreditCard,
  TrendingUp,
  Link as LinkIcon,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { motion } from "framer-motion";
import { formatDistanceToNow, isValid } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteVerifiedUser } from "@/store/admin/user-stats-slice";

function AdminDashboard() {
  const dispatch = useDispatch();
  const {
    stats,
    isLoading,
    error,
    allUsersList,
    isUsersListLoading,
    usersListError,
    totalUsers,
    currentPage,
    totalPages,
  } = useSelector((state) => state.userStats);
  const [localPage, setLocalPage] = useState(1);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const usersPerPage = 10;

  const refreshData = () => {
    dispatch(fetchUserStats());
    dispatch(fetchAllUsersList({ page: localPage, limit: usersPerPage }));
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (userToDelete?._id) {
      dispatch(deleteVerifiedUser(userToDelete._id)).then((data) => {
        if (data?.payload?.success) {
          refreshData();
          toast.success("User deleted successfully");
        } else {
          toast.error(data?.payload?.message || "Failed to delete user");
        }
      });
    }
    setIsDeleteDialogOpen(false);
  };

  useEffect(() => {
    refreshData();
    const interval = setInterval(refreshData, 300000);
    return () => clearInterval(interval);
  }, [dispatch, localPage]);

  useEffect(() => {
    if (currentPage) setLocalPage(currentPage);
  }, [currentPage]);

  if (error || usersListError) {
    return <div className="p-6 text-red-500 font-medium">Error: {error || usersListError}</div>;
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isValid(date) ? date.toLocaleDateString() : "N/A";
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    return isValid(date) ? formatDistanceToNow(date, { addSuffix: true }) : "Never";
  };

  const isUserActive = (user) => {
    if (!user.lastLogin) return false;
    const oneMinuteAgo = new Date(Date.now() - 60000);
    return new Date(user.lastLogin) > oneMinuteAgo;
  };

  const handlePageChange = (newPage) => {
    setLocalPage(newPage);
    dispatch(fetchAllUsersList({ page: newPage, limit: usersPerPage }));
  };

  const statCards = [
    { title: "Total Revenue", value: `₦${(stats?.totalRevenue || 0).toLocaleString()}`, icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50", delay: 0.1 },
    { title: "Total Orders", value: (stats?.totalOrders || 0).toLocaleString(), icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50", delay: 0.2 },
    { title: "Total Shoppers", value: ((stats?.verifiedUsers || 0) + (stats?.unverifiedUsers || 0)).toLocaleString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50", delay: 0.3 },
    { title: "Active Now", value: (stats?.activeUsers || 0).toLocaleString(), icon: Activity, color: "text-rose-600", bg: "bg-rose-50", delay: 0.4 },
    { title: "WhatsApp Shares", value: (stats?.linkShares?.dailyWhatsAppShares || 0).toLocaleString(), icon: FaWhatsapp, color: "text-green-600", bg: "bg-green-50", delay: 0.5 },
    { title: "Total Links Shared", value: (stats?.linkShares?.totalLinksShared || 0).toLocaleString(), icon: LinkIcon, color: "text-amber-600", bg: "bg-amber-50", delay: 0.6 },
    { title: "Verified Shares (Daily)", value: (stats?.linkShares?.dailyAuthenticatedShares || 0).toLocaleString(), icon: UserCheck, color: "text-sky-600", bg: "bg-sky-50", delay: 0.7 },
    { title: "Guest Shares (Daily)", value: (stats?.linkShares?.dailyGuestShares || 0).toLocaleString(), icon: UserX, color: "text-orange-600", bg: "bg-orange-50", delay: 0.8 },
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        <button
          onClick={refreshData}
          disabled={isLoading || isUsersListLoading}
          className="flex items-center gap-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${(isLoading || isUsersListLoading) ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: card.delay }}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className="h-full border-0 shadow-sm glass-morphism hover:shadow-xl transition-all duration-300 overflow-hidden relative">
              <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full ${card.bg} opacity-20 group-hover:opacity-30 transition-opacity`} />
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${card.bg} ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center gap-2 text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Updating...</span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-black text-gray-900">
                      {card.value}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <Card className="border-0 shadow-lg overflow-hidden glass-morphism">
          <CardHeader className="bg-white/50 backdrop-blur-sm border-b border-gray-100 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Users className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-black text-gray-800 tracking-tight">
                    Customer List
                  </CardTitle>
                  <p className="text-xs text-gray-500 font-medium">Manage and monitor all our customers</p>
                </div>
              </div>
              <div className="bg-gray-100/50 px-3 py-1.5 rounded-full border border-gray-200">
                 <span className="text-xs font-bold text-gray-600 uppercase tracking-widest flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                    </span>
                    {totalUsers} Customers in total
                 </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {isUsersListLoading ? (
              <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                <Loader2 className="h-10 w-10 animate-spin mb-4 text-blue-500" />
                <p className="text-sm font-medium animate-pulse">Loading data...</p>
              </div>
            ) : usersListError ? (
              <div className="m-6 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-bold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-600" />
                Loading Error: {usersListError}
              </div>
            ) : allUsersList.length > 0 ? (
              <>
                {/* Mobile Flow Layout */}
                <div className="sm:hidden divide-y divide-gray-100">
                  {allUsersList.map((user) => (
                    <div key={user._id} className="p-5 hover:bg-gray-50/50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="space-y-1">
                          <p className="font-black text-gray-900 leading-none">{user.userName}</p>
                          <p className="text-xs text-gray-400 font-bold">{user.email}</p>
                        </div>
                        <div className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${user.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {user.isVerified ? 'Verified' : 'Unverified'}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                        <div className="flex items-center gap-2">
                          {isUserActive(user) ? (
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Online</span>
                            </div>
                          ) : (
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                              {user.lastLogin ? formatRelativeTime(user.lastLogin) : 'Offline'}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteClick(user)}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-all border border-transparent hover:border-red-100 group/del shadow-sm bg-white"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Customer Table */}
                <div className="hidden sm:block overflow-hidden rounded-2xl border border-gray-100 bg-white/50 shadow-sm mx-4 mb-4">
                  <table className="min-w-full">
                    <thead>
                      <tr className="bg-gray-50/80 border-b border-gray-100">
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">User Details</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Joined</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Verification</th>
                        <th className="px-6 py-4 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-right text-xs font-black text-gray-400 uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {allUsersList.map((user) => (
                        <tr key={user._id} className="hover:bg-blue-50/30 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-gray-900">{user.userName}</span>
                              <span className="text-xs text-gray-400 font-medium">{user.email}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-xs font-bold text-gray-600 tracking-tight">{formatDate(user.createdAt)}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${user.isVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                              {user.isVerified ? 'Verified' : 'Unverified'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {isUserActive(user) ? (
                              <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                                <span className="text-[10px] font-black text-emerald-600 uppercase">Online Now</span>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 font-medium italic">
                                {user.lastLogin ? formatRelativeTime(user.lastLogin) : 'Inactive'}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button
                               onClick={() => handleDeleteClick(user)}
                               className="p-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all hover:bg-red-50 text-red-500 rounded-xl border border-transparent hover:border-red-100"
                               title="Permanently remove user"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Page Navigation */}
                <div className="flex justify-between items-center p-4 bg-gray-50/80 backdrop-blur-md rounded-b-2xl border-t border-gray-100">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest hidden sm:block">
                    Page {localPage} of {totalPages || 1}
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handlePageChange(localPage - 1)}
                      disabled={localPage === 1}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs font-black bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl transition-all disabled:opacity-30 shadow-sm border border-gray-200"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      PREVIOUS
                    </button>
                    <div className="sm:hidden text-xs font-black text-gray-700 px-4 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
                      {localPage} / {totalPages || 1}
                    </div>
                    <button
                      onClick={() => handlePageChange(localPage + 1)}
                      disabled={localPage === totalPages || totalPages === 0}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 text-xs font-black bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl transition-all disabled:opacity-30 shadow-sm border border-gray-200"
                    >
                      NEXT
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center p-12 text-gray-400">
                <Users className="h-10 w-10 mb-4 opacity-20" />
                <p className="text-sm font-medium">No users retrieved in this segment.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm User Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Are you sure you want to delete <span className="font-bold text-gray-900">{userToDelete?.userName}</span>? 
              This action is permanent and cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminDashboard;