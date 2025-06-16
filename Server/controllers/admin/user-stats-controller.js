const User = require("../../models/users");

const getUserStats = async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const [verifiedCount, unverifiedCount, activeCount] = await Promise.all([
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ isVerified: false }),
      User.countDocuments({ lastActive: { $gte: twentyFourHoursAgo } })
    ]);
    
    res.status(200).json({
      success: true,
      stats: {
        verifiedUsers: verifiedCount,
        unverifiedUsers: unverifiedCount,
        activeUsers: activeCount,
        totalUsers: verifiedCount + unverifiedCount
      }
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Failed to fetch user statistics" 
    });
  }
};

module.exports = { getUserStats };