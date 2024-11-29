export const updateDriverOnlineTime = async (driver) => {
    const currentTime = Date.now();
  
    if (driver.status === 'active' && driver.lastActiveAt) {
      // Calculate time spent online without updating lastActiveAt
      const timeSpentOnlineMinutes = Math.floor(
        (currentTime - new Date(driver.lastActiveAt).getTime()) / (1000 * 60)
      );
      driver.onlineTime += timeSpentOnlineMinutes;
    } else if (driver.status === 'inactive' && driver.lastActiveAt) {
      // Calculate total time spent online until becoming inactive
      const timeSpentOnlineMinutes = Math.floor(
        (new Date(driver.lastActiveAt).getTime() - new Date(driver.updatedAt).getTime()) / (1000 * 60)
      );
      driver.onlineTime += timeSpentOnlineMinutes;
  
      // Clear lastActiveAt since the driver is now inactive
      driver.lastActiveAt = null;
    } else if (driver.status === 'active' && !driver.lastActiveAt) {
            // Set lastActiveAt to the current time if the driver is now active and has no previous active time
        driver.lastActiveAt = Date.now()
    }
  
    // Save updated driver data
    await driver.save();
  };
  