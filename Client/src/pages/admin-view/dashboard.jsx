// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUserStats } from "@/store/admin/user-stats-slice/index";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Users,
//   UserCheck, // Used for verified users and shares
//   UserX,     // Used for unverified users and guest shares
//   Activity,
//   Loader2,
//   Share2,
// } from "lucide-react";

// import { FaWhatsapp, FaInstagram } from "react-icons/fa";

// import { motion } from "framer-motion";

// function AdminDashboard() {
//   const dispatch = useDispatch();
//   const { stats, isLoading, error } = useSelector((state) => state.userStats);

//   useEffect(() => {
//     dispatch(fetchUserStats());

//     // Refresh every 5 minutes
//     const interval = setInterval(() => {
//       dispatch(fetchUserStats());
//     }, 300000);

//     return () => clearInterval(interval);
//   }, [dispatch]);

//   if (error) {
//     return (
//       <div className="p-6 text-red-500">
//         Error loading dashboard: {error}
//       </div>
//     );
//   }

//   const statCards = [
//     {
//       title: "Verified Users",
//       value: stats?.verifiedUsers || 0,
//       icon: UserCheck,
//       color: "text-green-500",
//       delay: 0.2,
//     },
//     {
//       title: "Unverified Users",
//       value: stats?.unverifiedUsers || 0,
//       icon: UserX,
//       color: "text-yellow-500",
//       delay: 0.3,
//     },
//     {
//       title: "Active Today",
//       value: stats?.activeUsers || 0,
//       icon: Activity,
//       color: "text-blue-500",
//       delay: 0.4,
//     },
//     {
//       title: "Total Users",
//       value: (stats?.verifiedUsers || 0) + (stats?.unverifiedUsers || 0),
//       icon: Users,
//       color: "text-purple-500",
//       delay: 0.5,
//     },
//     // Share Stats
//     {
//       title: "WhatsApp Shares (24h)",
//       value: stats?.linkShares?.dailyWhatsAppShares || 0,
//       icon: FaWhatsapp,
//       color: "text-green-600",
//       delay: 0.6,
//     },
//     {
//       title: "Instagram Shares (24h)",
//       value: stats?.linkShares?.dailyInstagramShares || 0,
//       icon: FaInstagram,
//       color: "text-pink-600",
//       delay: 0.7,
//     },
//     {
//       title: "Checkout Shares (24h)",
//       value: stats?.linkShares?.dailyCheckoutShares || 0,
//       icon: Share2,
//       color: "text-cyan-500",
//       delay: 0.8,
//     },
//     // RENAMED: Daily Verified and Guest Shares
//     {
//       title: "Verified Shares (Daily)", // Renamed from "Auth Shares (Daily)"
//       value: stats?.linkShares?.dailyAuthenticatedShares || 0,
//       icon: UserCheck, // Using UserCheck for clarity
//       color: "text-blue-700",
//       delay: 0.9,
//     },
//     {
//       title: "Guest Shares (Daily)",
//       value: stats?.linkShares?.dailyGuestShares || 0,
//       icon: UserX, // Using UserX for clarity
//       color: "text-orange-500",
//       delay: 1.0,
//     },
//     // Total Shares
//     {
//       title: "Total Links Shared (All Time)",
//       value: stats?.linkShares?.totalLinksShared || 0,
//       icon: Share2,
//       color: "text-indigo-500",
//       delay: 1.1,
//     },
//     // RENAMED: Total Verified and Guest Shares (All Time)
//     {
//       title: "Total Verified Shares", // Renamed from "Total Auth Shares"
//       value: stats?.linkShares?.totalAuthenticatedShares || 0,
//       icon: UserCheck, // Using UserCheck for clarity
//       color: "text-blue-900",
//       delay: 1.2,
//     },
//     {
//       title: "Total Guest Shares",
//       value: stats?.linkShares?.totalGuestShares || 0,
//       icon: UserX, // Using UserX for clarity
//       color: "text-red-700",
//       delay: 1.3,
//     },
//   ];

//   return (
//     <div className="p-6">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {statCards.map((card, index) => (
//           <motion.div
//             key={index}
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.5, delay: card.delay }}
//           >
//             <Card className="shadow-xl border border-gray-200 bg-white p-4 rounded-lg h-full">
//               <CardHeader className="flex items-center gap-3">
//                 <card.icon className={`${card.color} w-8 h-8`} />
//                 <CardTitle>{card.title}</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {isLoading ? (
//                   <div className="flex items-center gap-2">
//                     <Loader2 className="h-5 w-5 animate-spin" />
//                     <span>Loading...</span>
//                   </div>
//                 ) : (
//                   <p className="text-2xl font-bold text-gray-800">
//                     {card.value.toLocaleString()}
//                   </p>
//                 )}
//               </CardContent>
//             </Card>
//           </motion.div>
//         ))}
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;

// AdminDashboard.jsx

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserStats,
  fetchVerifiedUsersList,
} from "@/store/admin/user-stats-slice/index";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  UserX,
  Activity,
  Loader2,
  Share2,
} from "lucide-react";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";
import { formatDistanceToNow, isValid } from "date-fns"; // Import isValid for robust date checking

function AdminDashboard() {
  const dispatch = useDispatch();
  const {
    stats,
    isLoading,
    error,
    verifiedUsersList,
    isUsersListLoading,
    usersListError,
  } = useSelector((state) => state.userStats);

  useEffect(() => {
    // Fetch initial stats and user list
    dispatch(fetchUserStats());
    dispatch(fetchVerifiedUsersList());

    // Set up interval to refresh data every 5 minutes (300,000 milliseconds)
    const interval = setInterval(() => {
      dispatch(fetchUserStats());
      dispatch(fetchVerifiedUsersList());
    }, 300000);

    // Clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [dispatch]); // Dependency array ensures effect runs only on dispatch changes

  // Display error message if either stats or user list fetching failed
  if (error || usersListError) {
    return (
      <div className="p-6 text-red-500 font-medium">
        Error loading dashboard: {error || usersListError}
      </div>
    );
  }

  // Helper function to safely format dates
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isValid(date) ? date.toLocaleDateString() : "N/A";
  };

  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    return isValid(date)
      ? formatDistanceToNow(date, { addSuffix: true })
      : "Never";
  };

  // Configuration for individual statistic cards
  const statCards = [
    {
      title: "Verified Users",
      value: stats?.verifiedUsers || 0,
      icon: UserCheck,
      color: "text-green-500",
      delay: 0.2,
    },
    {
      title: "Unverified Users",
      value: stats?.unverifiedUsers || 0,
      icon: UserX,
      color: "text-yellow-500",
      delay: 0.3,
    },
    {
      title: "Active Today",
      value: stats?.activeUsers || 0,
      icon: Activity,
      color: "text-blue-500",
      delay: 0.4,
    },
    {
      title: "Total Users",
      value: (stats?.verifiedUsers || 0) + (stats?.unverifiedUsers || 0),
      icon: Users,
      color: "text-purple-500",
      delay: 0.5,
    },
    // Share Stats
    {
      title: "WhatsApp Shares (24h)",
      value: stats?.linkShares?.dailyWhatsAppShares || 0,
      icon: FaWhatsapp,
      color: "text-green-600",
      delay: 0.6,
    },
    {
      title: "Instagram Shares (24h)",
      value: stats?.linkShares?.dailyInstagramShares || 0,
      icon: FaInstagram,
      color: "text-pink-600",
      delay: 0.7,
    },
    {
      title: "Checkout Shares (24h)",
      value: stats?.linkShares?.dailyCheckoutShares || 0,
      icon: Share2,
      color: "text-cyan-500",
      delay: 0.8,
    },
    // Daily Authenticated and Guest Shares
    {
      title: "Verified Shares (Daily)",
      value: stats?.linkShares?.dailyAuthenticatedShares || 0,
      icon: UserCheck,
      color: "text-blue-700",
      delay: 0.9,
    },
    {
      title: "Guest Shares (Daily)",
      value: stats?.linkShares?.dailyGuestShares || 0,
      icon: UserX,
      color: "text-orange-500",
      delay: 1.0,
    },
    // Total Shares
    {
      title: "Total Links Shared (All Time)",
      value: stats?.linkShares?.totalLinksShared || 0,
      icon: Share2,
      color: "text-indigo-500",
      delay: 1.1,
    },
    // Total Authenticated and Guest Shares (All Time)
    {
      title: "Total Verified Shares",
      value: stats?.linkShares?.totalAuthenticatedShares || 0,
      icon: UserCheck,
      color: "text-blue-900",
      delay: 1.2,
    },
    {
      title: "Total Guest Shares",
      value: stats?.linkShares?.totalGuestShares || 0,
      icon: UserX,
      color: "text-red-700",
      delay: 1.3,
    },
  ];

  return (
    <div className="p-3 sm:p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Statistic Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: card.delay }}
            className="h-full"
          >
            <Card className="shadow-sm sm:shadow-md border border-gray-200 bg-white p-3 sm:p-4 rounded-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 sm:pb-2">
                <CardTitle className="text-xs sm:text-sm font-semibold text-gray-700">
                  {card.title}
                </CardTitle>
                <card.icon className={`${card.color} w-5 h-5 sm:w-6 sm:h-6`} />
              </CardHeader>
              <CardContent className="pt-1 sm:pt-2">
                {isLoading ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                    <span className="text-xs sm:text-sm">Loading...</span>
                  </div>
                ) : (
                  <p className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900">
                    {card.value.toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Verified Users List Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      >
        <Card className="shadow-sm sm:shadow-md border border-gray-200 bg-white p-3 sm:p-4 rounded-lg">
          <CardHeader className="pb-2 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-xl font-semibold text-gray-800">
              <UserCheck className="text-green-500 w-5 h-5 sm:w-6 sm:h-6" />
              <span className="text-sm sm:text-base md:text-lg">
                Recent Verified Users
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isUsersListLoading ? (
              <div className="flex items-center gap-2 text-gray-500 p-3 sm:p-4">
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                <span className="text-sm sm:text-base">Loading users...</span>
              </div>
            ) : usersListError ? (
              <div className="text-red-500 p-3 sm:p-4 text-sm sm:text-base">
                Error: {usersListError}
              </div>
            ) : verifiedUsersList.length > 0 ? (
              <>
                {/* Mobile view (cards) */}
                <div className="sm:hidden space-y-3">
                  {verifiedUsersList.map((user) => (
                    <Card key={user._id} className="p-3">
                      <div className="flex justify-between items-center">
                        <div className="font-medium text-sm">
                          {user.userName}
                        </div>
                        <div className="text-xs text-gray-500">
                          Joined: {formatDate(user.createdAt)}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600 mt-1 truncate">
                        {user.email}
                      </div>
                      {/* Add last active with smaller text and simplified format */}
                      <div className="text-xs text-gray-500 mt-1">
                        Active: {formatRelativeTime(user.lastActive)}
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Desktop view (table) */}
                <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-3 py-2 sm:px-4 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Active
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {verifiedUsersList.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.userName}
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatRelativeTime(user.lastActive)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <p className="text-gray-600 p-3 sm:p-4 text-sm sm:text-base">
                No verified users found.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;