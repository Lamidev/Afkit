

// const User = require("../../models/users");
// const LinkShare = require("../../models/link-share");

// const getUserStats = async (req, res) => {
//   try {
//     const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

//     const [
//       verifiedCount,
//       unverifiedCount,
//       activeCount,
//       dailyWhatsAppShares,
//       dailyInstagramShares,
//       dailyCheckoutShares,
//       totalLinksShared,
//       dailyAuthenticatedShares,
//       dailyGuestShares,
//       totalAuthenticatedShares,
//       totalGuestShares,
//     ] = await Promise.all([
//       User.countDocuments({ isVerified: true }),
//       User.countDocuments({ isVerified: false }),
//       User.countDocuments({ lastActive: { $gte: twentyFourHoursAgo } }),
//       LinkShare.countDocuments({
//         shareDestination: "WhatsApp",
//         createdAt: { $gte: twentyFourHoursAgo },
//       }),
//       LinkShare.countDocuments({
//         shareDestination: "Instagram",
//         createdAt: { $gte: twentyFourHoursAgo },
//       }),
//       LinkShare.countDocuments({
//         sourcePage: "Checkout",
//         createdAt: { $gte: twentyFourHoursAgo },
//       }),
//       LinkShare.countDocuments({}),
//       LinkShare.countDocuments({
//         isGuest: false,
//         createdAt: { $gte: twentyFourHoursAgo },
//       }),
//       LinkShare.countDocuments({
//         isGuest: true,
//         createdAt: { $gte: twentyFourHoursAgo },
//       }),
//       LinkShare.countDocuments({
//         isGuest: false,
//       }),
//       LinkShare.countDocuments({
//         isGuest: true,
//       }),
//     ]);

//     res.status(200).json({
//       success: true,
//       stats: {
//         verifiedUsers: verifiedCount,
//         unverifiedUsers: unverifiedCount,
//         activeUsers: activeCount,
//         totalUsers: verifiedCount + unverifiedCount,
//         linkShares: {
//           dailyWhatsAppShares,
//           dailyInstagramShares,
//           dailyCheckoutShares,
//           totalLinksShared,
//           dailyAuthenticatedShares,
//           dailyGuestShares,
//           totalAuthenticatedShares,
//           totalGuestShares,
//         },
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching user stats:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch user statistics",
//     });
//   }
// };

// // NEW FUNCTION: Fetch a list of verified users
// // const getVerifiedUsersList = async (req, res) => {
// //   try {
// //     const verifiedUsers = await User.find(
// //       {
// //         isVerified: true,
// //         role: { $ne: "admin" }, // NEW: Exclude users where role is 'admin'
// //       },
// //       "userName email createdAt lastActive" // Select specific fields
// //     )
// //       .sort({ createdAt: -1 }) // Sort by most recent
// //       .limit(10); // Limit to a reasonable number for the dashboard

// //     res.status(200).json({
// //       success: true,
// //       verifiedUsers,
// //     });
// //   } catch (error) {
// //     console.error("Error fetching verified users list:", error);
// //     res.status(500).json({
// //       success: false,
// //       message: "Failed to fetch verified users list",
// //     });
// //   }
// // };
// const getVerifiedUsersList = async (req, res) => {
//   try {
//     const verifiedUsers = await User.find(
//       { isVerified: true, role: { $ne: "admin" } },
//       "userName email createdAt lastActive lastLogin"
//     )
//     .sort({ createdAt: -1 })
//     .limit(10)
//     .lean();

//     res.status(200).json({
//       success: true,
//       verifiedUsers,
//     });
//   } catch (error) {
//     console.error("Error fetching verified users list:", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch verified users list",
//     });
//   }
// };

// module.exports = { getUserStats, getVerifiedUsersList };

const User = require("../../models/users");
const LinkShare = require("../../models/link-share");
const Order = require("../../models/order");

const getUserStats = async (req, res) => {
  try {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000); 
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      verifiedUsersCount,
      unverifiedUsersCount,
      activeUsersCount,
      dailyWhatsAppShares,
      totalLinksShared,
      dailyAuthenticatedShares,
      dailyGuestShares,
      totalAuthenticatedShares,
      totalGuestShares,
      totalOrders,
      revenueStats
    ] = await Promise.all([
      // User counts (only 'user' role, excluding 'admin')
      User.countDocuments({ isVerified: true, role: "user" }),
      User.countDocuments({ isVerified: false, role: "user" }),
      User.countDocuments({ 
        role: "user",
        lastLogin: { $gte: oneMinuteAgo }
      }),

      // Share counts (24h)
      LinkShare.countDocuments({
        shareDestination: "WhatsApp",
        createdAt: { $gte: twentyFourHoursAgo },
      }),

      // Total shares
      LinkShare.countDocuments({}),
      
      // Authenticated vs Guest shares (24h)
      LinkShare.countDocuments({
        isGuest: false,
        createdAt: { $gte: twentyFourHoursAgo },
      }),
      LinkShare.countDocuments({
        isGuest: true,
        createdAt: { $gte: twentyFourHoursAgo },
      }),

      // Total authenticated vs guest shares
      LinkShare.countDocuments({ isGuest: false }),
      LinkShare.countDocuments({ isGuest: true }),

      // Order counts and revenue
      Order.countDocuments({}),
      Order.aggregate([
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" }
          }
        }
      ])
    ]);

    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

    res.status(200).json({
      success: true,
      stats: {
        verifiedUsers: verifiedUsersCount,
        unverifiedUsers: unverifiedUsersCount,
        activeUsers: activeUsersCount,
        totalUsers: verifiedUsersCount + unverifiedUsersCount,
        totalOrders,
        totalRevenue,
        linkShares: {
          dailyWhatsAppShares,
          totalLinksShared,
          dailyAuthenticatedShares,
          dailyGuestShares,
          totalAuthenticatedShares,
          totalGuestShares,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user statistics",
      error: error.message
    });
  }
};

const getAllUsersList = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      User.find(
        { 
          role: "user" // Only user role
        },
        "userName email createdAt lastLogin isVerified _id" // Include isVerified
      )
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
      
      User.countDocuments({ 
        role: "user" 
      })
    ]);

    res.status(200).json({
      success: true,
      users,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error("Error fetching users list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users list",
      error: error.message
    });
  }
};

const deleteVerifiedUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });
    if (user.role === "admin") return res.status(403).json({ success: false, message: "Action forbidden" });
    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting user" });
  }
};

module.exports = {
  getUserStats,
  getAllUsersList,
  deleteVerifiedUser,
};
