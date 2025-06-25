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
//       // NEW: Add counts for guest vs. authenticated shares (daily)
//       dailyAuthenticatedShares,
//       dailyGuestShares,
//       // NEW: Add counts for guest vs. authenticated shares (total)
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
//       LinkShare.countDocuments({}), // Total shares ever

//       // NEW QUERIES FOR AUTHENTICATED VS GUEST SHARES (DAILY)
//       LinkShare.countDocuments({
//         isGuest: false, // Authenticated users
//         createdAt: { $gte: twentyFourHoursAgo },
//       }),
//       LinkShare.countDocuments({
//         isGuest: true, // Guest users
//         createdAt: { $gte: twentyFourHoursAgo },
//       }),
//       // NEW QUERIES FOR AUTHENTICATED VS GUEST SHARES (TOTAL)
//       LinkShare.countDocuments({
//         isGuest: false, // Authenticated users (all time)
//       }),
//       LinkShare.countDocuments({
//         isGuest: true, // Guest users (all time)
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
//           // NEW: Add these to the response
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

// module.exports = { getUserStats };


// controllers/admin/user-stats-controller.js

const User = require("../../models/users");
const LinkShare = require("../../models/link-share");

const getUserStats = async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [
      verifiedCount,
      unverifiedCount,
      activeCount,
      dailyWhatsAppShares,
      dailyInstagramShares,
      dailyCheckoutShares,
      totalLinksShared,
      dailyAuthenticatedShares,
      dailyGuestShares,
      totalAuthenticatedShares,
      totalGuestShares,
    ] = await Promise.all([
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ isVerified: false }),
      User.countDocuments({ lastActive: { $gte: twentyFourHoursAgo } }),
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
      LinkShare.countDocuments({}),
      LinkShare.countDocuments({
        isGuest: false,
        createdAt: { $gte: twentyFourHoursAgo },
      }),
      LinkShare.countDocuments({
        isGuest: true,
        createdAt: { $gte: twentyFourHoursAgo },
      }),
      LinkShare.countDocuments({
        isGuest: false,
      }),
      LinkShare.countDocuments({
        isGuest: true,
      }),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        verifiedUsers: verifiedCount,
        unverifiedUsers: unverifiedCount,
        activeUsers: activeCount,
        totalUsers: verifiedCount + unverifiedCount,
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
    });
  }
};

// NEW FUNCTION: Fetch a list of verified users
const getVerifiedUsersList = async (req, res) => {
  try {
    const verifiedUsers = await User.find(
      {
        isVerified: true,
        role: { $ne: "admin" }, // NEW: Exclude users where role is 'admin'
      },
      "userName email createdAt lastActive" // Select specific fields
    )
      .sort({ createdAt: -1 }) // Sort by most recent
      .limit(10); // Limit to a reasonable number for the dashboard

    res.status(200).json({
      success: true,
      verifiedUsers,
    });
  } catch (error) {
    console.error("Error fetching verified users list:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch verified users list",
    });
  }
};

module.exports = { getUserStats, getVerifiedUsersList };