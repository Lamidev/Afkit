

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserStats,
  fetchVerifiedUsersList,
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
} from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import { formatDistanceToNow, isValid } from "date-fns";

function AdminDashboard() {
  const dispatch = useDispatch();
  const {
    stats,
    isLoading,
    error,
    verifiedUsersList,
    isUsersListLoading,
    usersListError,
    totalUsers,
    currentPage,
    totalPages,
  } = useSelector((state) => state.userStats);
  const [localPage, setLocalPage] = useState(1);
  const usersPerPage = 10;

  const refreshData = () => {
    dispatch(fetchUserStats());
    dispatch(fetchVerifiedUsersList({ page: localPage, limit: usersPerPage }));
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
    dispatch(fetchVerifiedUsersList({ page: newPage, limit: usersPerPage }));
  };

  const statCards = [
    { title: "Verified Users", value: stats?.verifiedUsers || 0, icon: UserCheck, color: "text-green-500", delay: 0.2 },
    { title: "Unverified Users", value: stats?.unverifiedUsers || 0, icon: UserX, color: "text-yellow-500", delay: 0.3 },
    { title: "Active Now", value: stats?.activeUsers || 0, icon: Activity, color: "text-blue-500", delay: 0.4 },
    { title: "Total Users", value: (stats?.verifiedUsers || 0) + (stats?.unverifiedUsers || 0), icon: Users, color: "text-purple-500", delay: 0.5 },
    { title: "WhatsApp Shares (24h)", value: stats?.linkShares?.dailyWhatsAppShares || 0, icon: FaWhatsapp, color: "text-green-600", delay: 0.6 },
    { title: "Instagram Shares (24h)", value: stats?.linkShares?.dailyInstagramShares || 0, icon: FaInstagram, color: "text-pink-600", delay: 0.7 },
    { title: "Checkout Shares (24h)", value: stats?.linkShares?.dailyCheckoutShares || 0, icon: Share2, color: "text-cyan-500", delay: 0.8 },
    { title: "Verified Shares (Daily)", value: stats?.linkShares?.dailyAuthenticatedShares || 0, icon: UserCheck, color: "text-blue-700", delay: 0.9 },
    { title: "Guest Shares (Daily)", value: stats?.linkShares?.dailyGuestShares || 0, icon: UserX, color: "text-orange-500", delay: 1.0 },
    { title: "Total Links Shared", value: stats?.linkShares?.totalLinksShared || 0, icon: Share2, color: "text-indigo-500", delay: 1.1 },
    { title: "Total Verified Shares", value: stats?.linkShares?.totalAuthenticatedShares || 0, icon: UserCheck, color: "text-blue-900", delay: 1.2 },
    { title: "Total Guest Shares", value: stats?.linkShares?.totalGuestShares || 0, icon: UserX, color: "text-red-700", delay: 1.3 },
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: card.delay }}
            className="h-full"
          >
            <Card className="shadow-sm sm:shadow-md border border-gray-200 bg-white p-3 sm:p-4 rounded-lg h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
                <CardTitle className="text-xs sm:text-sm font-semibold text-gray-700 truncate">
                  {card.title}
                </CardTitle>
                <card.icon className={`${card.color} w-5 h-5 sm:w-6 sm:h-6`} />
              </CardHeader>
              <CardContent className="pt-1 sm:pt-2 flex-1 flex items-end">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    <span className="text-xs sm:text-sm">Loading...</span>
                  </div>
                ) : (
                  <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 w-full truncate">
                    {card.value.toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      >
        <Card className="shadow-sm sm:shadow-md border border-gray-200 bg-white p-3 sm:p-4 rounded-lg">
          <CardHeader className="pb-2 sm:pb-4">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-base sm:text-xl font-semibold text-gray-800">
                <UserCheck className="text-green-500 w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-sm sm:text-base md:text-lg">Verified Users</span>
              </CardTitle>
              <span className="text-xs text-gray-500">
                Showing {(localPage - 1) * usersPerPage + 1}-{Math.min(localPage * usersPerPage, totalUsers)} of {totalUsers} users
              </span>
            </div>
          </CardHeader>
          <CardContent>
            {isUsersListLoading ? (
              <div className="flex items-center gap-2 text-gray-500 p-3 sm:p-4">
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                <span className="text-sm sm:text-base">Loading users...</span>
              </div>
            ) : usersListError ? (
              <div className="text-red-500 p-3 sm:p-4 text-sm sm:text-base">Error: {usersListError}</div>
            ) : verifiedUsersList.length > 0 ? (
              <>
                <div className="sm:hidden space-y-3">
                  {verifiedUsersList.map((user) => (
                    <Card key={user._id} className="p-3">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-sm">{user.userName}</div>
                        <div className="text-xs text-gray-500">Joined: {formatDate(user.createdAt)}</div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1 truncate">{user.email}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {isUserActive(user) ? (
                          <>
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                            <span className="text-green-600">Online now</span>
                          </>
                        ) : user.lastLogin ? (
                          <>
                            <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-1"></span>
                            <span>Last seen {formatRelativeTime(user.lastLogin)}</span>
                          </>
                        ) : (
                          <>
                            <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-1"></span>
                            <span>Never logged in</span>
                          </>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {verifiedUsersList.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm font-medium text-gray-900">{user.userName}</td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">
                            {isUserActive(user) ? (
                              <div className="flex items-center">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                                <span className="text-green-600">Online now</span>
                              </div>
                            ) : user.lastLogin ? (
                              <div className="flex items-center">
                                <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                                <span>Last seen {formatRelativeTime(user.lastLogin)}</span>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <span className="inline-block w-2 h-2 rounded-full bg-gray-400 mr-2"></span>
                                <span>Never logged in</span>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button
                    onClick={() => handlePageChange(localPage - 1)}
                    disabled={localPage === 1}
                    className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded transition-colors disabled:opacity-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <div className="text-sm text-gray-600">
                    Page {localPage} of {totalPages}
                  </div>
                  <button
                    onClick={() => handlePageChange(localPage + 1)}
                    disabled={localPage === totalPages || totalPages === 0}
                    className="flex items-center gap-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded transition-colors disabled:opacity-50"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <p className="text-gray-600 p-3 sm:p-4 text-sm sm:text-base">No verified users found.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;