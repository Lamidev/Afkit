

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

const getUserStats = async (req, res) => {
  try {
   const oneMinuteAgo = new Date(Date.now() - 60 * 1000); 
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      verifiedUsersCount,
      unverifiedUsersCount,
      activeUsersCount,
      dailyWhatsAppShares,
      dailyInstagramShares,
      dailyCheckoutShares,
      totalLinksShared,
      dailyAuthenticatedShares,
      dailyGuestShares,
      totalAuthenticatedShares,
      totalGuestShares,
    ] = await Promise.all([
      // User counts (only 'user' role, excluding 'admin')
      User.countDocuments({ isVerified: true, role: "user" }),
      User.countDocuments({ isVerified: false, role: "user" }),
      User.countDocuments({ 
        role: "user",
         lastLogin: { $gte: oneMinuteAgo } // Updated to 1 minute
      }),

      // Share counts (24h)
      LinkShare.countDocuments({
        shareDestination: "WhatsApp",
        createdAt: { $gte: twentyFourHoursAgo },
      }),
      LinkShare.countDocuments({
        shareDestination: "Instagram",
        createdAt: { $gte: twentyFourHoursAgo },
      }),
      LinkShare.countDocuments({
        sourcePage: "Checkout",
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
    ]);

    res.status(200).json({
      success: true,
      stats: {
        verifiedUsers: verifiedUsersCount,
        unverifiedUsers: unverifiedUsersCount,
        activeUsers: activeUsersCount,
        totalUsers: verifiedUsersCount + unverifiedUsersCount,
        linkShares: {
          dailyWhatsAppShares,
          dailyInstagramShares,
          dailyCheckoutShares,
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

const getVerifiedUsersList = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    
    const [verifiedUsers, total] = await Promise.all([
      User.find(
        { 
          isVerified: true, 
          role: "user" // Only user role
        },
        "userName email createdAt lastLogin" // Only necessary fields
      )
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(parseInt(limit))
      .lean(), // Convert to plain JS objects
      
      User.countDocuments({ 
        isVerified: true, 
        role: "user" // Only user role
      })
    ]);

    res.status(200).json({
      success: true,
      verifiedUsers,
      total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error("Error fetching verified users list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch verified users list",
      error: error.message
    });
  }
};

module.exports = { 
  getUserStats, 
  getVerifiedUsersList 
};