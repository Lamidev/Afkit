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
  fetchVerifiedUsersList, // Import the new thunk
} from "@/store/admin/user-stats-slice/index";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

function AdminDashboard() {
  const dispatch = useDispatch();
  const {
    stats,
    isLoading,
    error,
    verifiedUsersList, // Get the new state
    isUsersListLoading, // Get the new loading state
    usersListError, // Get the new error state
  } = useSelector((state) => state.userStats);

  useEffect(() => {
    dispatch(fetchUserStats());
    dispatch(fetchVerifiedUsersList()); // Dispatch the new thunk

    // Refresh every 5 minutes
    const interval = setInterval(() => {
      dispatch(fetchUserStats());
      dispatch(fetchVerifiedUsersList());
    }, 300000);

    return () => clearInterval(interval);
  }, [dispatch]);

  if (error || usersListError) {
    return (
      <div className="p-6 text-red-500">
        Error loading dashboard: {error || usersListError}
      </div>
    );
  }

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
    {
      title: "Total Links Shared (All Time)",
      value: stats?.linkShares?.totalLinksShared || 0,
      icon: Share2,
      color: "text-indigo-500",
      delay: 1.1,
    },
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
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: card.delay }}
          >
            <Card className="shadow-xl border border-gray-200 bg-white p-4 rounded-lg h-full">
              <CardHeader className="flex items-center gap-3">
                <card.icon className={`${card.color} w-8 h-8`} />
                <CardTitle>{card.title}</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <p className="text-2xl font-bold text-gray-800">
                    {card.value.toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* NEW SECTION: Verified Users List */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.4 }} // Adjust delay as needed
      >
        <Card className="shadow-xl border border-gray-200 bg-white p-4 rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="text-green-500 w-6 h-6" />
              Recent Verified Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isUsersListLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading verified users...</span>
              </div>
            ) : usersListError ? (
              <div className="text-red-500">
                Error loading verified users: {usersListError}
              </div>
            ) : verifiedUsersList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date Joined
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Last Active
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {verifiedUsersList.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.userName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.lastActive).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No verified users found.</p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;